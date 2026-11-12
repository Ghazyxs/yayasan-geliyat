<?php

namespace App\Http\Controllers;

use App\Http\Requests\Donasi\StorePublicDonasiRequest;
use App\Models\Donasi;
use App\Models\RekeningYayasan;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class PublicDonasiController extends Controller
{
    /**
     * Tampilkan halaman donasi publik dengan pilihan nominal yang tersedia.
     */
    public function index(Request $request): Response
    {
        return Inertia::render('public/donasi', [
            'nominalOptions' => Donasi::NOMINAL_PILIHAN_PUBLIK,
            'donasiSubmitted' => $request->session()->get('donasi_submitted'),
        ]);
    }

    /**
     * Simpan pengajuan donasi baru dari donatur publik.
     */
    public function store(StorePublicDonasiRequest $request): RedirectResponse
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

        $donasi = DB::transaction(function () use ($validated, $jenisDonasi, $rekeningTujuan, $buktiPath, $rekening) {
            $attributes = [
                'kode_donasi' => Donasi::generateKodeDonasi(),
                'nama_donatur' => trim($validated['nama_donatur']),
                'no_whatsapp' => trim($validated['no_whatsapp']),
                'jenis_donasi' => $jenisDonasi,
                'anak_yatim_id' => null,
                'rekening_tujuan' => $rekeningTujuan,
                'nominal' => (int) $validated['nominal'],
                'pesan_doa' => ! empty($validated['pesan_doa']) ? trim($validated['pesan_doa']) : null,
                'bukti_transfer' => $buktiPath,
                'status_verifikasi' => Donasi::STATUS_MENUNGGU,
            ];

            Donasi::terapkanSnapshotRekening($attributes, $rekening);

            return Donasi::create($attributes);
        });

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
            ]);
    }
}
