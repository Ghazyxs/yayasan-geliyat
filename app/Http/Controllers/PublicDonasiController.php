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
            $rekening = RekeningYayasan::find($validated['rekening_id']);
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
                'no_whatsapp' => trim($validated['no_whatsapp']),
                'email_donatur' => ! empty($validated['email']) ? trim($validated['email']) : null,
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

        if ($request->expectsJson() || $request->wantsJson()) {
            return response()->json([
                'status' => 'success',
                'kode_donasi' => $donasi->kode_donasi,
                'snap_token' => $donasi->snap_token,
                'redirect_url' => $donasi->snap_redirect_url,
                'nominal' => $donasi->nominal,
                'nama_donatur' => $donasi->nama_donatur,
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
            ]);
    }

    /**
     * Periksa status donasi terkini (digunakan oleh polling frontend / verifikasi direct).
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

        // Jika masih menunggu dan Midtrans dikonfigurasi, coba sync status dari Midtrans API
        if ($donasi->status_verifikasi === Donasi::STATUS_MENUNGGU && $midtrans->isConfigured()) {
            try {
                $statusPayload = $midtrans->getTransactionStatus($donasi->kode_donasi);
                if (is_array($statusPayload) && ! empty($statusPayload['transaction_status'])) {
                    $donasi = Donasi::prosesNotifikasiMidtrans($statusPayload);
                }
            } catch (Exception $e) {
                Log::info("Check status check failed for {$kode}: ".$e->getMessage());
            }
        }

        return response()->json([
            'status' => 'success',
            'kode_donasi' => $donasi->kode_donasi,
            'status_verifikasi' => $donasi->status_verifikasi,
            'nominal' => $donasi->nominal,
            'metode_pembayaran' => $donasi->metode_pembayaran,
            'midtrans_payment_type' => $donasi->midtrans_payment_type,
            'paid_at' => $donasi->paid_at?->toIso8601String(),
        ]);
    }
}
