<?php

namespace App\Http\Controllers;

use App\Models\BeritaUmum;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class PublicBeritaUmumController extends Controller
{
    private const BULAN_INDONESIA = [
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

    public function index(): Response
    {
        $beritaList = BeritaUmum::query()
            ->with('pembuat:id,name')
            ->where('is_published', true)
            ->orderByDesc('tanggal_publikasi')
            ->orderByDesc('id')
            ->get()
            ->map(fn (BeritaUmum $berita) => self::transform($berita));

        return Inertia::render('public/berita-umum', [
            'beritaList' => $beritaList,
        ]);
    }

    public function show(string $slug): Response
    {
        $berita = BeritaUmum::query()
            ->with('pembuat:id,name')
            ->where('slug', $slug)
            ->where('is_published', true)
            ->firstOrFail();

        $beritaLainnya = BeritaUmum::query()
            ->with('pembuat:id,name')
            ->where('is_published', true)
            ->where('id', '!=', $berita->id)
            ->orderByDesc('tanggal_publikasi')
            ->orderByDesc('id')
            ->limit(4)
            ->get()
            ->map(fn (BeritaUmum $item) => self::transform($item));

        return Inertia::render('public/berita-umum-detail', [
            'berita' => self::transform($berita, includeBody: true),
            'beritaLainnya' => $beritaLainnya,
        ]);
    }

    public static function transform(BeritaUmum $berita, bool $includeBody = false): array
    {
        $gambarUrl = null;
        if ($berita->gambar) {
            $gambarUrl = str_starts_with($berita->gambar, 'http')
                ? $berita->gambar
                : asset('storage/' . ltrim($berita->gambar, '/'));
        }

        $ringkasan = $berita->ringkasan ?: Str::limit(strip_tags($berita->isi), 160);

        $data = [
            'id' => $berita->id,
            'judul' => $berita->judul,
            'slug' => $berita->slug,
            'kategori' => $berita->kategori ?: 'Informasi',
            'ringkasan' => $ringkasan,
            'gambar_url' => $gambarUrl,
            'tanggal_publikasi' => $berita->tanggal_publikasi?->format('Y-m-d'),
            'tanggal_publikasi_formatted' => self::formatTanggal($berita->tanggal_publikasi),
            'penulis' => $berita->pembuat?->name,
        ];

        if ($includeBody) {
            $data['isi'] = $berita->isi;
        }

        return $data;
    }

    private static function formatTanggal(?\Carbon\CarbonInterface $tanggal): string
    {
        if (! $tanggal) {
            return '-';
        }

        $bulan = self::BULAN_INDONESIA[(int) $tanggal->month] ?? $tanggal->translatedFormat('F');

        return $tanggal->day . ' ' . $bulan . ' ' . $tanggal->year;
    }
}

