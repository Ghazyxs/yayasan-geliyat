<?php

namespace App\Http\Controllers;

use App\Http\Requests\Donasi\StorePublicDonasiRequest;
use App\Models\Donasi;
use App\Models\RekeningYayasan;
use App\Services\Midtrans\MidtransException;
use App\Services\Midtrans\MidtransService;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class PublicDonasiController extends Controller
{
    /**
     * Tampilkan halaman donasi publik dengan pilihan nominal yang tersedia dan konfigurasi Midtrans publik.
     */
    public function index(Request $request, MidtransService $midtrans): Response
    {
        return Inertia::render('public/donasi', [
            'nominalOptions' => Donasi::NOMINAL_PILIHAN_PUBLIK,
            'donasiSubmitted' => $request->session()->get('donasi_submitted'),
            'midtransClientKey' => $midtrans->clientKey(),
            'midtransSnapJsUrl' => $midtrans->snapJsUrl(),
        ]);
    }

    /**
     * Simpan pengajuan donasi baru dari donatur publik dan buat token Midtrans Snap.
     */
    public function store(StorePublicDonasiRequest $request, MidtransService $midtrans): RedirectResponse|JsonResponse
    {
        $validated = $request->validated();

        $buktiPath = null;
        if ($request->hasFile('bukti_transfer')) {
            $file = $request->file('bukti_transfer');
            $ext = strtolower((string) ($file->guessExtension() ?: $file->getClientOriginalExtension()));
            if (! in_array($ext, ['jpg', 'jpeg', 'png', 'webp', 'pdf'], true)) {
                $ext = 'jpg';
            }

            $filename = Str::uuid()->toString().'.'.$ext;
            $buktiPath = $file->storeAs('bukti-transfer/'.now()->format('Y/m'), $filename, 'local');
        }

        $jenisDonasi = ! empty($validated['jenis_donasi'])
            ? $validated['jenis_donasi']
            : Donasi::JENIS_DONASI_UMUM;

        $rekeningTujuan = ! empty($validated['rekening_tujuan'])
            ? trim($validated['rekening_tujuan'])
            : Donasi::REKENING_DEFAULT_PUBLIK;

        $rekening = null;
        if (! empty($validated['rekening_id'])) {
            $rekening = RekeningYayasan::query()->find((int) $validated['rekening_id']);
        } elseif (! empty($validated['rekening_tujuan'])) {
            $rekening = RekeningYayasan::where(function ($query) use ($validated) {
                $query->whereRaw("CONCAT(nama_bank, ' - ', nomor_rekening) = ?", [trim($validated['rekening_tujuan'])])
                    ->orWhere('nomor_rekening', trim($validated['rekening_tujuan']));
            })->first();
        }

        $donasi = DB::transaction(function () use ($validated, $jenisDonasi, $rekeningTujuan, $buktiPath, $rekening, $midtrans) {
            $attributes = [
                'kode_donasi' => Donasi::generateKodeDonasi(),
                'nama_donatur' => trim($validated['nama_donatur']),
                'no_whatsapp' => ! empty($validated['no_whatsapp']) ? trim($validated['no_whatsapp']) : null,
                'email_donatur' => trim($validated['email']),
                'jenis_donasi' => $jenisDonasi,
                'anak_yatim_id' => ! empty($validated['anak_yatim_id']) ? (int) $validated['anak_yatim_id'] : null,
                'rekening_tujuan' => $rekeningTujuan,
                'nominal' => (int) $validated['nominal'],
                'pesan_doa' => ! empty($validated['pesan_doa']) ? trim($validated['pesan_doa']) : null,
                'bukti_transfer' => $buktiPath,
                'status_verifikasi' => Donasi::STATUS_MENUNGGU,
                'metode_pembayaran' => Donasi::METODE_MIDTRANS,
                'payment_expires_at' => now()->addMinutes($midtrans->expiryMinutes()),
            ];

            Donasi::terapkanSnapshotRekening($attributes, $rekening);

            return Donasi::create($attributes);
        });

        // Buat transaksi Midtrans Snap jika kredensial telah dikonfigurasi
        if ($midtrans->isConfigured()) {
            try {
                $snapResult = $midtrans->createSnapTransaction($donasi);
                $donasi->update([
                    'snap_token' => $snapResult['token'],
                    'snap_redirect_url' => $snapResult['redirect_url'] ?? null,
                ]);
            } catch (MidtransException $e) {
                Log::error('Gagal membuat Midtrans Snap Transaction: '.$e->getMessage(), [
                    'kode_donasi' => $donasi->kode_donasi,
                ]);

                if ($request->expectsJson() || $request->wantsJson()) {
                    return response()->json([
                        'status' => 'error',
                        'message' => 'Gagal menghubungkan ke gerbang pembayaran Midtrans. '.$e->getMessage(),
                    ], 502);
                }
            }
        }

        // Kirim email pengingat pending + link lanjutan pembayaran ke email donatur
        $donasi->kirimEmailPendingJikaPerlu();

        $invoiceUrl = URL::signedRoute('donasi.invoice', ['kode' => $donasi->kode_donasi]);
        $statusUrl = URL::signedRoute('donasi.status', ['kode' => $donasi->kode_donasi]);
        $expiresAtIso = $donasi->payment_expires_at?->toIso8601String();

        if ($request->expectsJson() || $request->wantsJson()) {
            return response()->json([
                'status' => 'success',
                'kode_donasi' => $donasi->kode_donasi,
                'snap_token' => $donasi->snap_token,
                'redirect_url' => $donasi->snap_redirect_url,
                'nominal' => $donasi->nominal,
                'nama_donatur' => $donasi->nama_donatur,
                'invoice_url' => $invoiceUrl,
                'status_url' => $statusUrl,
                'payment_expires_at' => $expiresAtIso,
            ]);
        }

        return redirect()
            ->route('donasi')
            ->with(
                'success',
                "Pengajuan donasi ({$donasi->kode_donasi}) sebesar Rp ".number_format($donasi->nominal, 0, ',', '.').' berhasil dicatat.'
            )
            ->with('donasi_submitted', [
                'kode_donasi' => $donasi->kode_donasi,
                'nama_donatur' => $donasi->nama_donatur,
                'nominal' => $donasi->nominal,
                'status_verifikasi' => $donasi->status_verifikasi,
                'snap_token' => $donasi->snap_token,
                'snap_redirect_url' => $donasi->snap_redirect_url,
                'invoice_url' => $invoiceUrl,
                'status_url' => $statusUrl,
                'payment_expires_at' => $expiresAtIso,
            ]);
    }

    /**
     * Periksa status donasi terkini (digunakan oleh polling frontend / halaman invoice).
     */
    public function checkStatus(string $kode, MidtransService $midtrans): JsonResponse
    {
        $donasi = Donasi::where('kode_donasi', $kode)->first();

        if (! $donasi) {
            return response()->json([
                'status' => 'error',
                'message' => 'Donasi tidak ditemukan.',
            ], 404);
        }

        $donasi = $this->syncPendingDonationStatus($donasi, $midtrans);
        $canResume = $donasi->status_verifikasi === Donasi::STATUS_MENUNGGU && ! $donasi->isPaymentExpired();

        return response()->json([
            'status' => 'success',
            'kode_donasi' => $donasi->kode_donasi,
            'status_verifikasi' => $donasi->status_verifikasi,
            'nominal' => $donasi->nominal,
            'metode_pembayaran' => $donasi->metode_pembayaran,
            'midtrans_payment_type' => $donasi->midtrans_payment_type,
            'metode_label' => $donasi->formatPaymentMethodLabel(),
            'paid_at' => $donasi->paid_at?->toIso8601String(),
            'payment_expires_at' => $donasi->effectiveExpiresAt()?->toIso8601String(),
            'is_expired' => $donasi->isPaymentExpired(),
            'invoice_url' => URL::signedRoute('donasi.invoice', ['kode' => $donasi->kode_donasi]),
            'snap_token' => $canResume ? $donasi->snap_token : null,
        ]);
    }

    /**
     * Tampilkan halaman status pembayaran, lanjut bayar, dan bukti invoice donasi.
     */
    public function invoice(string $kode, MidtransService $midtrans): Response
    {
        $donasi = Donasi::where('kode_donasi', $kode)->firstOrFail();
        $donasi = $this->syncPendingDonationStatus($donasi, $midtrans);

        $isExpired = $donasi->isPaymentExpired();
        $canResume = $donasi->status_verifikasi === Donasi::STATUS_MENUNGGU
            && ! $isExpired
            && filled($donasi->snap_token);

        return Inertia::render('public/donasi-invoice', [
            'donasi' => [
                'kode_donasi' => $donasi->kode_donasi,
                'nama_donatur' => $donasi->nama_donatur,
                'email_masked' => $this->maskEmail($donasi->email_donatur),
                'jenis_donasi' => $donasi->jenis_donasi,
                'nominal' => $donasi->nominal,
                'pesan_doa' => $donasi->pesan_doa,
                'status_verifikasi' => $donasi->status_verifikasi,
                'metode_pembayaran' => $donasi->metode_pembayaran,
                'metode_label' => $donasi->formatPaymentMethodLabel(),
                'created_at_iso' => $donasi->created_at?->toIso8601String(),
                'paid_at_iso' => ($donasi->paid_at ?? $donasi->verified_at)?->toIso8601String(),
                'expires_at_iso' => $donasi->effectiveExpiresAt()?->toIso8601String(),
                'is_expired' => $isExpired,
                'can_resume' => $canResume,
                'snap_token' => $canResume ? $donasi->snap_token : null,
                'snap_redirect_url' => $canResume ? $donasi->snap_redirect_url : null,
                'status_url' => URL::signedRoute('donasi.status', ['kode' => $donasi->kode_donasi]),
                'catatan_verifikasi' => $donasi->catatan_verifikasi,
            ],
            'midtransClientKey' => $midtrans->clientKey(),
            'midtransSnapJsUrl' => $midtrans->snapJsUrl(),
        ]);
    }

    /**
     * Sinkronkan status transaksi yang masih menunggu dengan Midtrans Core API
     * serta tandai kedaluwarsa secara otomatis bila melewati batas waktu pembayaran.
     */
    private function syncPendingDonationStatus(Donasi $donasi, MidtransService $midtrans): Donasi
    {
        if ($donasi->status_verifikasi !== Donasi::STATUS_MENUNGGU) {
            return $donasi;
        }

        if ($midtrans->isConfigured()) {
            try {
                $statusPayload = $midtrans->getTransactionStatus($donasi->kode_donasi);
                if (is_array($statusPayload) && ! empty($statusPayload['transaction_status'])) {
                    $donasi = Donasi::prosesNotifikasiMidtrans($statusPayload);
                }
            } catch (Exception $e) {
                Log::info("Check status check failed for {$donasi->kode_donasi}: ".$e->getMessage());
            }
        }

        if ($donasi->status_verifikasi === Donasi::STATUS_MENUNGGU && $donasi->isPaymentExpired()) {
            $donasi->update([
                'status_verifikasi' => Donasi::STATUS_DIBATALKAN,
                'midtrans_transaction_status' => $donasi->midtrans_transaction_status ?: 'expire',
                'catatan_verifikasi' => 'Waktu pembayaran Midtrans kedaluwarsa.',
            ]);
        }

        return $donasi->refresh();
    }

    /**
     * Samarkan sebagian alamat email untuk keamanan pada halaman invoice publik.
     */
    private function maskEmail(?string $email): ?string
    {
        if (! is_string($email) || trim($email) === '' || ! str_contains($email, '@')) {
            return null;
        }

        [$local, $domain] = explode('@', trim($email), 2);
        $len = mb_strlen($local);
        $prefixLen = $len <= 2 ? 1 : 2;

        return mb_substr($local, 0, $prefixLen).'***@'.$domain;
    }
}
