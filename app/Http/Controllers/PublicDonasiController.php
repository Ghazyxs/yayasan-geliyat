<?php

namespace App\Http\Controllers;

use App\Http\Requests\Donasi\StorePublicDonasiRequest;
use App\Models\AnakYatim;
use App\Models\Donasi;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class PublicDonasiController extends Controller
{
    /**
     * Tampilkan halaman donasi publik beserta rekening yayasan dan daftar anak binaan aktif.
     */
    public function index(Request $request): Response
    {
        // Hanya ekspos kolom non-sensitif (alias, jenjang, kelas, kelurahan, status_asuh) sesuai UU PDP.
        $anakYatimList = AnakYatim::query()
            ->where('status_binaan', 'aktif')
            ->orderBy('alias')
            ->get(['id', 'alias', 'jenjang', 'kelas', 'kelurahan', 'status_asuh']);

        return Inertia::render('public/donasi', [
            'rekeningList' => Donasi::REKENING_RESMI,
            'jenisDonasiList' => Donasi::JENIS_DONASI_LIST,
            'anakYatimList' => $anakYatimList,
            'donasiSubmitted' => $request->session()->get('donasi_submitted'),
        ]);
    }

    /**
     * Simpan pengajuan donasi baru dari donatur publik dengan status menunggu verifikasi.
     */
    public function store(StorePublicDonasiRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $file = $request->file('bukti_transfer');
        $ext = strtolower((string) ($file->guessExtension() ?: $file->getClientOriginalExtension()));
        if (! in_array($ext, ['jpg', 'jpeg', 'png', 'webp', 'pdf'], true)) {
            $ext = 'jpg';
        }

        $filename = Str::uuid()->toString().'.'.$ext;
        $buktiPath = $file->storeAs('bukti-transfer/'.now()->format('Y/m'), $filename, 'local');

        $jenisTargetAnak = [
            Donasi::JENIS_ORANG_TUA_ASUH,
            Donasi::JENIS_SANTUNAN_RUTIN,
            Donasi::JENIS_BIMBEL_SINAR,
        ];

        $anakYatimId = (! empty($validated['anak_yatim_id']) && in_array($validated['jenis_donasi'], $jenisTargetAnak, true))
            ? (int) $validated['anak_yatim_id']
            : null;

        $donasi = DB::transaction(function () use ($validated, $anakYatimId, $buktiPath) {
            return Donasi::create([
                'kode_donasi' => Donasi::generateKodeDonasi(),
                'nama_donatur' => trim($validated['nama_donatur']),
                'no_whatsapp' => trim($validated['no_whatsapp']),
                'jenis_donasi' => $validated['jenis_donasi'],
                'anak_yatim_id' => $anakYatimId,
                'rekening_tujuan' => trim($validated['rekening_tujuan']),
                'nominal' => (int) $validated['nominal'],
                'pesan_doa' => ! empty($validated['pesan_doa']) ? trim($validated['pesan_doa']) : null,
                'bukti_transfer' => $buktiPath,
                'status_verifikasi' => Donasi::STATUS_MENUNGGU,
            ]);
        });

        return redirect()
            ->route('donasi')
            ->with(
                'success',
                "Pengajuan donasi ({$donasi->kode_donasi}) berhasil dikirim dan sedang menunggu verifikasi admin."
            )
            ->with('donasi_submitted', [
                'kode_donasi' => $donasi->kode_donasi,
                'nama_donatur' => $donasi->nama_donatur,
                'jenis_donasi' => $donasi->jenis_donasi,
                'nominal' => $donasi->nominal,
                'rekening_tujuan' => $donasi->rekening_tujuan,
                'status_verifikasi' => $donasi->status_verifikasi,
            ]);
    }
}
