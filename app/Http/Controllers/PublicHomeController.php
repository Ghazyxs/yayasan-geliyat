<?php

namespace App\Http\Controllers;

use App\Models\Bidang;
use App\Models\Kegiatan;
use Inertia\Inertia;
use Inertia\Response;

class PublicHomeController extends Controller
{
    /**
     * Urutan tampilan bidang pada beranda.
     *
     * @var array<string, int>
     */
    private const DISPLAY_ORDER = [
        Bidang::PENDIDIKAN => 1,
        Bidang::KEAGAMAAN => 2,
        Bidang::KEMANUSIAAN => 3,
        Bidang::EKONOMI => 4,
    ];

    /**
     * Tampilkan beranda publik beserta daftar bidang dan kegiatan terbaru dari database.
     */
    public function index(): Response
    {
        $bidangList = Bidang::query()
            ->withCount(['kegiatan', 'anakYatim'])
            ->get()
            ->sortBy(fn (Bidang $b) => self::DISPLAY_ORDER[$b->kode] ?? (100 + $b->id))
            ->values()
            ->map(fn (Bidang $bidang) => PublicBidangController::transformBidang($bidang));

        $kegiatanTerbaru = Kegiatan::query()
            ->with(['bidang:id,kode,nama'])
            ->orderByDesc('tanggal_kegiatan')
            ->orderByDesc('id')
            ->limit(4)
            ->get()
            ->map(fn (Kegiatan $kegiatan) => PublicKegiatanController::transformKegiatan($kegiatan));

        return Inertia::render('welcome', [
            'bidangList' => $bidangList,
            'kegiatanTerbaru' => $kegiatanTerbaru,
        ]);
    }
}

