<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Kegiatan;
use App\Models\LaporanTahunan;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Inertia\Inertia;
use Inertia\Response;

class LaporanTahunanAdminController extends Controller
{
    /**
     * Tampilkan halaman pengelolaan laporan tahunan admin.
     */
    public function index(Request $request): Response
    {
        $kegiatanYears = Kegiatan::query()
            ->whereNotNull('tanggal_kegiatan')
            ->pluck('tanggal_kegiatan')
            ->map(fn ($val) => (int) Carbon::parse($val)->year)
            ->unique();

        $laporanYears = LaporanTahunan::query()->pluck('tahun');

        $years = $kegiatanYears->concat($laporanYears)
            ->unique()
            ->sortDesc()
            ->values()
            ->all();

        if (empty($years)) {
            $years = [(int) now()->year];
        }

        $laporanList = collect($years)->map(function ($thn) {
            $laporan = LaporanTahunan::getOrDefault((int) $thn);
            $start = sprintf('%04d-01-01', $thn);
            $end = sprintf('%04d-12-31', $thn);

            $countKegiatan = Kegiatan::query()
                ->whereBetween('tanggal_kegiatan', [$start, $end])
                ->count();

            return [
                'id' => $laporan->id,
                'tahun' => (int) $thn,
                'judul' => $laporan->judul,
                'nomor_dokumen' => $laporan->nomor_dokumen,
                'tanggal_penerbitan' => $laporan->tanggal_penerbitan?->format('Y-m-d'),
                'tanggal_formatted' => $laporan->tanggal_penerbitan ? $laporan->tanggal_penerbitan->translatedFormat('d F Y') : "31 Desember {$thn}",
                'jumlah_kegiatan' => $countKegiatan,
                'penandatangan_ketua' => $laporan->penandatangan_ketua,
                'penandatangan_sekretaris' => $laporan->penandatangan_sekretaris,
                'is_published' => $laporan->is_published,
                'latar_belakang' => $laporan->latar_belakang,
                'tujuan_laporan' => $laporan->tujuan_laporan,
                'kesimpulan' => $laporan->kesimpulan,
                'harapan_evaluasi' => $laporan->harapan_evaluasi,
                'preview_url' => route('admin.laporan.preview', $thn),
                'download_url' => route('admin.laporan.download', $thn),
            ];
        })->values()->all();

        return Inertia::render('admin/laporan/index', [
            'laporanList' => $laporanList,
        ]);
    }

    /**
     * Perbarui narasi dan metadata laporan tahunan oleh admin.
     */
    public function update(Request $request, int $tahun): RedirectResponse
    {
        $validated = $request->validate([
            'judul' => ['required', 'string', 'max:255'],
            'nomor_dokumen' => ['nullable', 'string', 'max:100'],
            'tanggal_penerbitan' => ['nullable', 'date'],
            'latar_belakang' => ['nullable', 'string'],
            'tujuan_laporan' => ['nullable', 'string'],
            'kesimpulan' => ['nullable', 'string'],
            'harapan_evaluasi' => ['nullable', 'string'],
            'penandatangan_ketua' => ['required', 'string', 'max:255'],
            'penandatangan_sekretaris' => ['required', 'string', 'max:255'],
        ]);

        $laporan = LaporanTahunan::firstOrNew(['tahun' => $tahun]);
        $laporan->fill($validated);
        $laporan->created_by = $request->user()->id;
        $laporan->save();

        return redirect()->back()->with('success', "Isi dokumen Laporan Tahunan {$tahun} berhasil diperbarui.");
    }

    /**
     * Preview PDF laporan dari panel admin.
     */
    public function preview(int $tahun): HttpResponse
    {
        return app(PublicLaporanTahunanController::class)->preview($tahun);
    }

    /**
     * Download PDF laporan dari panel admin.
     */
    public function download(int $tahun): HttpResponse
    {
        return app(PublicLaporanTahunanController::class)->download($tahun);
    }
}

