<?php

namespace App\Http\Controllers;

use App\Models\Bidang;
use App\Models\Kegiatan;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PublicRekapKegiatanController extends Controller
{
    /**
     * Nama bulan resmi dalam Bahasa Indonesia.
     *
     * @var array<int, string>
     */
    private const BULAN_NAMES = [
        1 => 'Januari',
        2 => 'Februari',
        3 => 'Maret',
        4 => 'April',
        5 => 'Mei',
        6 => 'Juni',
        7 => 'Juli',
        8 => 'Agustus',
        9 => 'September',
        10 => 'Oktober',
        11 => 'November',
        12 => 'Desember',
    ];

    /**
     * Tampilkan halaman rekap dan laporan tahunan kegiatan Yayasan Geliyat.
     */
    public function index(Request $request): Response
    {
        // 1. Ambil seluruh tahun yang ada di database kegiatan (kompatibel lintas driver DB: MySQL & SQLite)
        $availableYears = Kegiatan::query()
            ->whereNotNull('tanggal_kegiatan')
            ->pluck('tanggal_kegiatan')
            ->map(fn ($val) => (int) Carbon::parse($val)->year)
            ->unique()
            ->sortDesc()
            ->values()
            ->all();

        // Fallback jika database belum ada kegiatan sama sekali
        if (empty($availableYears)) {
            $availableYears = [(int) now()->year];
        }

        // Tentukan tahun laporan terpilih (default: tahun terbaru yang ada di data)
        $defaultYear = $availableYears[0];
        $selectedYear = (int) $request->input('tahun', $defaultYear);

        // 2. Ambil data kegiatan untuk rentang tahun terpilih
        $startOfYear = sprintf('%04d-01-01', $selectedYear);
        $endOfYear = sprintf('%04d-12-31', $selectedYear);

        $kegiatanRaw = Kegiatan::query()
            ->with(['bidang:id,kode,nama', 'pembuat:id,name'])
            ->whereBetween('tanggal_kegiatan', [$startOfYear, $endOfYear])
            ->orderBy('tanggal_kegiatan', 'asc')
            ->orderBy('id', 'asc')
            ->get();

        $kegiatanList = $kegiatanRaw->map(function (Kegiatan $k) {
            $base = PublicKegiatanController::transformKegiatan($k);
            $tgl = $k->tanggal_kegiatan;
            $bulan = $tgl ? (int) $tgl->month : 1;
            $quarter = $tgl ? (int) ceil($bulan / 3) : 1;

            return array_merge($base, [
                'bulan_angka' => $bulan,
                'bulan_nama' => self::BULAN_NAMES[$bulan] ?? '',
                'kuartal' => "Q{$quarter}",
                'kuartal_nama' => "Kuartal {$quarter} (Q{$quarter})",
            ]);
        })->values()->all();

        // 3. Hitung ringkasan statistik kegiatan tahunan
        $totalKegiatan = $kegiatanRaw->count();

        // Statistik per Bidang
        $allBidangs = Bidang::orderBy('nama')->get(['id', 'nama', 'kode']);
        $bidangStats = [];

        foreach ($allBidangs as $b) {
            $count = $kegiatanRaw->where('bidang_id', $b->id)->count();
            $bidangStats[] = [
                'id' => $b->id,
                'nama' => $b->nama,
                'kode' => $b->kode,
                'total' => $count,
                'persentase' => $totalKegiatan > 0 ? round(($count / $totalKegiatan) * 100) : 0,
            ];
        }

        // Kegiatan umum/lintas bidang (bidang_id NULL)
        $umumCount = $kegiatanRaw->whereNull('bidang_id')->count();
        if ($umumCount > 0) {
            $bidangStats[] = [
                'id' => null,
                'nama' => 'Umum & Lintas Bidang',
                'kode' => 'umum',
                'total' => $umumCount,
                'persentase' => $totalKegiatan > 0 ? round(($umumCount / $totalKegiatan) * 100) : 0,
            ];
        }

        // Distribusi per Bulan (1 - 12)
        $monthlyDistribution = [];
        for ($m = 1; $m <= 12; $m++) {
            $count = $kegiatanRaw->filter(fn ($k) => $k->tanggal_kegiatan && (int) $k->tanggal_kegiatan->month === $m)->count();
            $monthlyDistribution[] = [
                'bulan' => $m,
                'nama_bulan' => self::BULAN_NAMES[$m],
                'singkatan' => substr(self::BULAN_NAMES[$m], 0, 3),
                'total' => $count,
            ];
        }

        // Distribusi per Kuartal (Q1 - Q4)
        $quarterDistribution = [
            'Q1' => ['nama' => 'Kuartal I (Jan - Mar)', 'periode' => 'Januari - Maret', 'total' => 0],
            'Q2' => ['nama' => 'Kuartal II (Apr - Jun)', 'periode' => 'April - Juni', 'total' => 0],
            'Q3' => ['nama' => 'Kuartal III (Jul - Sep)', 'periode' => 'Juli - September', 'total' => 0],
            'Q4' => ['nama' => 'Kuartal IV (Okt - Des)', 'periode' => 'Oktober - Desember', 'total' => 0],
        ];

        foreach ($monthlyDistribution as $item) {
            $q = 'Q' . ceil($item['bulan'] / 3);
            if (isset($quarterDistribution[$q])) {
                $quarterDistribution[$q]['total'] += $item['total'];
            }
        }

        // Hitung total dokumentasi visual yang tersimpan
        $totalDokumentasi = $kegiatanRaw->reduce(function ($carry, Kegiatan $k) {
            $photos = is_array($k->dokumentasi) ? count($k->dokumentasi) : 0;
            return $carry + ($k->gambar ? 1 : 0) + $photos;
        }, 0);

        // Jumlah bidang yang aktif mengadakan kegiatan di tahun tersebut
        $bidangAktifCount = $kegiatanRaw->pluck('bidang_id')->filter()->unique()->count();

        // Periode/bulan paling produktif
        $bulanTeraktif = collect($monthlyDistribution)->sortByDesc('total')->first();

        return Inertia::render('public/rekap-kegiatan', [
            'selectedYear' => $selectedYear,
            'availableYears' => $availableYears,
            'kegiatanList' => $kegiatanList,
            'stats' => [
                'totalKegiatan' => $totalKegiatan,
                'totalDokumentasi' => $totalDokumentasi,
                'bidangAktifCount' => $bidangAktifCount,
                'bulanTeraktif' => $bulanTeraktif && $bulanTeraktif['total'] > 0 ? $bulanTeraktif : null,
                'bidangStats' => $bidangStats,
                'monthlyDistribution' => $monthlyDistribution,
                'quarterDistribution' => $quarterDistribution,
            ],
        ]);
    }
}
