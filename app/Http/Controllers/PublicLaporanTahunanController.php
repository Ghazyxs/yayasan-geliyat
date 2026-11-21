<?php

namespace App\Http\Controllers;

use App\Models\Kegiatan;
use App\Models\LaporanTahunan;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Inertia\Inertia;
use Inertia\Response;

class PublicLaporanTahunanController extends Controller
{
    /**
     * Tampilkan halaman arsip Laporan Kegiatan Tahunan Yayasan Geliyat.
     */
    public function index(Request $request): Response
    {
        // 1. Ambil seluruh tahun yang ada di database kegiatan & laporan
        $kegiatanYears = Kegiatan::query()
            ->whereNotNull('tanggal_kegiatan')
            ->pluck('tanggal_kegiatan')
            ->map(fn ($val) => (int) Carbon::parse($val)->year)
            ->unique();

        $laporanYears = LaporanTahunan::query()
            ->where('is_published', true)
            ->pluck('tahun');

        $availableYears = $kegiatanYears->concat($laporanYears)
            ->unique()
            ->sortDesc()
            ->values()
            ->all();

        if (empty($availableYears)) {
            $availableYears = [(int) now()->year];
        }

        $defaultYear = $availableYears[0];
        $selectedYear = (int) $request->input('tahun', $defaultYear);

        // Siapkan daftar dokumen laporan per tahun
        $laporanList = collect($availableYears)->map(function ($thn) {
            $laporan = LaporanTahunan::getOrDefault((int) $thn);
            $start = sprintf('%04d-01-01', $thn);
            $end = sprintf('%04d-12-31', $thn);

            $countKegiatan = Kegiatan::query()
                ->whereBetween('tanggal_kegiatan', [$start, $end])
                ->count();

            $tglTerbit = $laporan->tanggal_penerbitan
                ? $laporan->tanggal_penerbitan->translatedFormat('d F Y')
                : "31 Desember {$thn}";

            return [
                'tahun' => (int) $thn,
                'judul' => $laporan->judul,
                'nomor_dokumen' => $laporan->nomor_dokumen ?: sprintf('01/LKT/YGM/XII/%04d', $thn),
                'tanggal_penerbitan' => $tglTerbit,
                'tanggal_iso' => $laporan->tanggal_penerbitan?->format('Y-m-d') ?: "{$thn}-12-31",
                'jumlah_kegiatan' => $countKegiatan,
                'penandatangan' => $laporan->penandatangan_ketua,
                'ringkasan' => $laporan->latar_belakang,
                'preview_url' => route('laporan-tahunan.preview', $thn),
                'download_url' => route('laporan-tahunan.download', $thn),
            ];
        })->values()->all();

        return Inertia::render('public/laporan-tahunan', [
            'selectedYear' => $selectedYear,
            'availableYears' => $availableYears,
            'laporanList' => $laporanList,
        ]);
    }

    /**
     * Tampilkan pratinjau dokumen PDF laporan tahunan di browser (stream inline).
     */
    public function preview(int $tahun): HttpResponse
    {
        $pdf = $this->buildPdf($tahun);

        return $pdf->stream("Laporan-Kegiatan-Tahunan-Yayasan-Geliyat-{$tahun}.pdf");
    }

    /**
     * Unduh file dokumen PDF laporan tahunan resmi.
     */
    public function download(int $tahun): HttpResponse
    {
        $pdf = $this->buildPdf($tahun);

        return $pdf->download("Laporan-Kegiatan-Tahunan-Yayasan-Geliyat-{$tahun}.pdf");
    }

    /**
     * Bangun objek Dompdf dengan data riil dari database.
     */
    private function buildPdf(int $tahun)
    {
        $laporan = LaporanTahunan::getOrDefault($tahun);
        $start = sprintf('%04d-01-01', $tahun);
        $end = sprintf('%04d-12-31', $tahun);

        $kegiatanList = Kegiatan::query()
            ->with(['bidang:id,kode,nama', 'pembuat:id,name'])
            ->whereBetween('tanggal_kegiatan', [$start, $end])
            ->orderBy('tanggal_kegiatan', 'asc')
            ->orderBy('id', 'asc')
            ->get();

        $hasGd = extension_loaded('gd');
        $logoPath = public_path('images/logo.png');
        $logoBase64 = '';
        if ($hasGd && file_exists($logoPath)) {
            $logoBase64 = 'data:image/png;base64,' . base64_encode((string) file_get_contents($logoPath));
        }

        $pdf = Pdf::loadView('pdf.laporan-tahunan', [
            'laporan' => $laporan,
            'kegiatanList' => $kegiatanList,
            'logoBase64' => $logoBase64,
            'hasGd' => $hasGd,
        ]);

        $pdf->setPaper('a4', 'portrait');

        return $pdf;
    }
}

