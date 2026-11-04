<?php

namespace App\Http\Controllers;

use App\Models\AnakYatim;
use App\Models\Donasi;
use App\Models\Kegiatan;
use App\Models\RekeningYayasan;
use App\Models\TransaksiKeuangan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Tampilkan halaman dashboard utama aplikasi.
     * Super Admin: Agregasi keuangan global (pemisahan Dana Donasi vs Kas Operasional).
     * Admin Biasa: Hanya data binaan dan kegiatan sesuai batas kewenangan unit kerjanya.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        $isSuperAdmin = $user->isSuperAdmin();

        if ($isSuperAdmin) {
            $ringkasanKeuangan = TransaksiKeuangan::ringkasanKeuangan();

            $totalAnakYatim = AnakYatim::query()
                ->where('status_binaan', 'aktif')
                ->count();

            $donasiMenungguCount = Donasi::query()
                ->where('status_verifikasi', Donasi::STATUS_MENUNGGU)
                ->count();

            $donasiMenungguNominal = (int) Donasi::query()
                ->where('status_verifikasi', Donasi::STATUS_MENUNGGU)
                ->sum('nominal');

            $rekeningAktifCount = RekeningYayasan::query()
                ->aktif()
                ->count();

            // Distribusi jenjang pendidikan anak binaan aktif secara live
            $distribusiPendidikan = $this->hitungDistribusiPendidikan();

            return Inertia::render('dashboard', [
                'isSuperAdmin' => true,
                'ringkasanKeuangan' => $ringkasanKeuangan,
                'totalAnakYatim' => $totalAnakYatim,
                'donasiMenungguCount' => $donasiMenungguCount,
                'donasiMenungguNominal' => $donasiMenungguNominal,
                'rekeningAktifCount' => $rekeningAktifCount,
                'distribusiPendidikan' => $distribusiPendidikan,
                'appEnv' => config('app.env'),
            ]);
        }

        // --- SCOPED DASHBOARD UNTUK ADMIN BIDANG ---
        // Menjaga agar tidak membocorkan data keuangan global maupun data bidang lain
        $bidang = $user->bidang;

        $totalAnakYatim = $bidang !== null
            ? $bidang->anakYatim()->where('status_binaan', 'aktif')->count()
            : 0;

        $kegiatanBidangCount = $bidang !== null
            ? Kegiatan::query()->where('bidang_id', $bidang->id)->count()
            : 0;

        $donasiMenungguCount = $bidang !== null
            ? Donasi::query()
                ->where('status_verifikasi', Donasi::STATUS_MENUNGGU)
                ->whereHas('anakYatim.bidang', fn ($q) => $q->where('bidang.id', $bidang->id))
                ->count()
            : 0;

        $distribusiPendidikan = $this->hitungDistribusiPendidikan($bidang?->id);

        return Inertia::render('dashboard', [
            'isSuperAdmin' => false,
            'ringkasanKeuangan' => null, // Dilarang membocorkan ringkasan kas ke admin biasa
            'totalAnakYatim' => $totalAnakYatim,
            'kegiatanBidangCount' => $kegiatanBidangCount,
            'donasiMenungguCount' => $donasiMenungguCount,
            'donasiMenungguNominal' => 0,
            'rekeningAktifCount' => 0,
            'distribusiPendidikan' => $distribusiPendidikan,
            'namaBidang' => $bidang?->nama ?? 'Unit Kerja',
            'appEnv' => config('app.env'),
        ]);
    }

    /**
     * Hitung persentase jenjang pendidikan anak yatim secara live dari database.
     *
     * @return array<int, array{label: string, count: int, percent: string, color: string}>
     */
    private function hitungDistribusiPendidikan(?int $bidangId = null): array
    {
        $query = AnakYatim::query()->where('status_binaan', 'aktif');

        if ($bidangId !== null) {
            $query->whereHas('bidang', fn ($q) => $q->where('bidang.id', $bidangId));
        }

        $total = (clone $query)->count();

        $jenjangConfigs = [
            ['key' => 'SD', 'label' => 'Sekolah Dasar (SD)', 'color' => 'bg-[#14bace]'],
            ['key' => 'SMP', 'label' => 'Sekolah Menengah Pertama (SMP)', 'color' => 'bg-[#087f8c]'],
            ['key' => 'SMA', 'label' => 'Sekolah Menengah Atas (SMA)', 'color' => 'bg-amber-400'],
            ['key' => 'Kuliah', 'label' => 'Perguruan Tinggi / Kuliah', 'color' => 'bg-purple-500'],
        ];

        return array_map(function ($item) use ($query, $total) {
            $count = (clone $query)->where('jenjang', $item['key'])->count();
            $percent = $total > 0 ? (string) round(($count / $total) * 100).'%' : '0%';

            return [
                'label' => $item['label'],
                'count' => $count,
                'percent' => $percent,
                'color' => $item['color'],
            ];
        }, $jenjangConfigs);
    }
}

