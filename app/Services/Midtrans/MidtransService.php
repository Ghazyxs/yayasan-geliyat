<?php

namespace App\Services\Midtrans;

use App\Models\Donasi;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\PendingRequest;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

/**
 * Klien Midtrans berbasis Laravel HTTP Client (tanpa SDK tambahan).
 *
 * - Snap API   : membuat Snap Token untuk donasi.
 * - Core API   : memeriksa status transaksi (server-to-server).
 * - Signature  : memverifikasi keaslian HTTP Notification (webhook).
 *
 * Server Key hanya dibaca dari config/env dan tidak pernah dikembalikan ke frontend.
 */
class MidtransService
{
    private const SNAP_SANDBOX = 'https://app.sandbox.midtrans.com';

    private const SNAP_PRODUCTION = 'https://app.midtrans.com';

    private const API_SANDBOX = 'https://api.sandbox.midtrans.com';

    private const API_PRODUCTION = 'https://api.midtrans.com';

    public function isConfigured(): bool
    {
        return filled($this->serverKey()) && filled($this->clientKey());
    }

    public function isProduction(): bool
    {
        return (bool) config('services.midtrans.is_production', false);
    }

    public function clientKey(): ?string
    {
        $key = config('services.midtrans.client_key');

        return is_string($key) && $key !== '' ? $key : null;
    }

    /** URL snap.js yang dimuat di browser (publik). */
    public function snapJsUrl(): string
    {
        return ($this->isProduction() ? self::SNAP_PRODUCTION : self::SNAP_SANDBOX).'/snap/snap.js';
    }

    public function expiryMinutes(): int
    {
        return max(15, (int) config('services.midtrans.expiry_minutes', 1440));
    }

    /**
     * Minta Snap Token untuk donasi. Nominal (gross_amount) selalu diambil
     * dari database, bukan dari input frontend.
     *
     * @return array{token: string, redirect_url: string|null}
     *
     * @throws MidtransException
     */
    public function createSnapTransaction(Donasi $donasi): array
    {
        if (! $this->isConfigured()) {
            throw new MidtransException('Midtrans credentials (Server Key / Client Key) belum dikonfigurasi.');
        }

        $payload = [
            'transaction_details' => [
                'order_id' => $donasi->kode_donasi,
                'gross_amount' => (int) $donasi->nominal,
            ],
            'item_details' => [[
                'id' => 'DONASI',
                'price' => (int) $donasi->nominal,
                'quantity' => 1,
                'name' => Str::limit("Donasi {$donasi->jenis_donasi} Yayasan Geliyat", 47, ''),
            ]],
            'customer_details' => array_filter([
                'first_name' => Str::limit($donasi->nama_donatur, 50, ''),
                'phone' => $donasi->no_whatsapp,
                'email' => $donasi->email_donatur,
            ]),
            'expiry' => [
                'unit' => 'minute',
                'duration' => $this->expiryMinutes(),
            ],
        ];

        try {
            $response = $this->client()
                ->post($this->snapBaseUrl().'/snap/v1/transactions', $payload);
        } catch (ConnectionException $e) {
            throw new MidtransException('Tidak dapat terhubung ke Midtrans.', previous: $e);
        }

        if (! $response->successful() || ! is_string($response->json('token'))) {
            $pesan = $response->json('error_messages.0') ?? 'Gagal membuat transaksi pembayaran.';

            throw new MidtransException((string) $pesan, $response->status());
        }

        return [
            'token' => $response->json('token'),
            'redirect_url' => $response->json('redirect_url'),
        ];
    }

    /**
     * Ambil status transaksi langsung dari Midtrans (server-to-server, terautentikasi
     * dengan Server Key). Mengembalikan null bila transaksi belum ada di Midtrans
     * (mis. donatur belum memilih metode pembayaran).
     *
     * @return array<string, mixed>|null
     *
     * @throws MidtransException
     */
    public function getTransactionStatus(string $orderId): ?array
    {
        try {
            $response = $this->client()
                ->get($this->apiBaseUrl().'/v2/'.rawurlencode($orderId).'/status');
        } catch (ConnectionException $e) {
            throw new MidtransException('Tidak dapat terhubung ke Midtrans.', previous: $e);
        }

        if (! $response->successful()) {
            throw new MidtransException('Gagal memeriksa status transaksi.', $response->status());
        }

        $data = $response->json();

        // Midtrans mengembalikan HTTP 200 dengan status_code "404" bila transaksi belum dibuat.
        if (! is_array($data) || (string) ($data['status_code'] ?? '') === '404' || empty($data['transaction_status'])) {
            return null;
        }

        return $data;
    }

    /**
     * Verifikasi signature_key HTTP Notification:
     * SHA512(order_id + status_code + gross_amount + ServerKey).
     *
     * @param  array<string, mixed>  $payload
     */
    public function verifySignature(array $payload): bool
    {
        $serverKey = $this->serverKey();

        foreach (['order_id', 'status_code', 'gross_amount', 'signature_key'] as $field) {
            if (! isset($payload[$field]) || ! is_scalar($payload[$field])) {
                return false;
            }
        }

        if ($serverKey === null) {
            return false;
        }

        $expected = hash(
            'sha512',
            $payload['order_id'].$payload['status_code'].$payload['gross_amount'].$serverKey
        );

        return hash_equals($expected, (string) $payload['signature_key']);
    }

    private function client(): PendingRequest
    {
        return Http::withBasicAuth((string) $this->serverKey(), '')
            ->acceptJson()
            ->asJson()
            ->timeout(15);
    }

    private function serverKey(): ?string
    {
        $key = config('services.midtrans.server_key');

        return is_string($key) && $key !== '' ? $key : null;
    }

    private function snapBaseUrl(): string
    {
        return $this->isProduction() ? self::SNAP_PRODUCTION : self::SNAP_SANDBOX;
    }

    private function apiBaseUrl(): string
    {
        return $this->isProduction() ? self::API_PRODUCTION : self::API_SANDBOX;
    }
}

