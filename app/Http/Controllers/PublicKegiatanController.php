<?php

namespace App\Http\Controllers;

use App\Models\Kegiatan;
use Carbon\CarbonInterface;
use Inertia\Inertia;
use Inertia\Response;

class PublicKegiatanController extends Controller
{
    /**
     * Gambar sampul default berdasarkan kategori apabila kolom gambar kosong.
     *
     * @var array<string, string>
     */
    private const DEFAULT_CATEGORY_IMAGES = [
        'Pendidikan' => 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200&auto=format&fit=crop',
        'Kemanusiaan' => 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1200&auto=format&fit=crop',
        'Keagamaan' => 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?q=80&w=1200&auto=format&fit=crop',
        'Ekonomi' => 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?q=80&w=1200&auto=format&fit=crop',
    ];

    /**
     * Nama bulan dalam Bahasa Indonesia untuk konsistensi tampilan tanggal.
     *
     * @var array<int, string>
     */
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

    /**
     * Tampilkan halaman daftar seluruh kegiatan dari database.
     */
    public function index(): Response
    {
        $kegiatanList = Kegiatan::query()
            ->with(['bidang:id,kode,nama'])
            ->orderByDesc('tanggal_kegiatan')
            ->orderByDesc('id')
            ->get()
            ->map(fn (Kegiatan $kegiatan) => self::transformKegiatan($kegiatan));

        return Inertia::render('public/kegiatan', [
            'kegiatanList' => $kegiatanList,
        ]);
    }

    /**
     * Tampilkan halaman berita/detail untuk satu kegiatan berdasarkan identitas dari database.
     */
    public function show(Kegiatan $kegiatan): Response
    {
        $kegiatan->load(['bidang:id,kode,nama', 'pembuat:id,name']);

        $kegiatanLainnya = Kegiatan::query()
            ->with(['bidang:id,kode,nama'])
            ->where('id', '!=', $kegiatan->id)
            ->orderByRaw('CASE WHEN kategori = ? THEN 0 ELSE 1 END', [$kegiatan->kategori])
            ->orderByDesc('tanggal_kegiatan')
            ->orderByDesc('id')
            ->limit(3)
            ->get()
            ->map(fn (Kegiatan $item) => self::transformKegiatan($item));

        return Inertia::render('public/kegiatan-detail', [
            'kegiatan' => self::transformKegiatan($kegiatan),
            'kegiatanLainnya' => $kegiatanLainnya,
        ]);
    }

    /**
     * Transformasi model Kegiatan ke struktur data frontend yang seragam.
     *
     * @return array<string, mixed>
     */
    public static function transformKegiatan(Kegiatan $kegiatan): array
    {
        $gambarUtama = $kegiatan->gambar
            ?: (self::DEFAULT_CATEGORY_IMAGES[$kegiatan->kategori] ?? self::DEFAULT_CATEGORY_IMAGES['Kemanusiaan']);

        $rawDokumentasi = is_array($kegiatan->dokumentasi) ? $kegiatan->dokumentasi : [];
        $dokumentasi = [];

        foreach ($rawDokumentasi as $idx => $item) {
            if (is_string($item) && trim($item) !== '') {
                $dokumentasi[] = [
                    'url' => trim($item),
                    'caption' => 'Dokumentasi kegiatan ' . $kegiatan->judul . ' (' . ($idx + 1) . ')',
                ];
            } elseif (is_array($item) && ! empty($item['url'])) {
                $dokumentasi[] = [
                    'url' => (string) $item['url'],
                    'caption' => (string) ($item['caption'] ?? ('Dokumentasi kegiatan ' . $kegiatan->judul)),
                ];
            }
        }

        $isiBerita = trim((string) ($kegiatan->isi_berita ?: $kegiatan->deskripsi));
        $paragrafBerita = array_values(array_filter(
            array_map('trim', preg_split('/\R{2,}|\r\n|\n/', $isiBerita) ?: []),
            fn (string $p) => $p !== ''
        ));

        return [
            'id' => $kegiatan->id,
            'judul' => $kegiatan->judul,
            'kategori' => $kegiatan->kategori,
            'ringkasan' => $kegiatan->ringkasan ?: $kegiatan->deskripsi,
            'deskripsi' => $kegiatan->deskripsi,
            'isi_berita' => $isiBerita,
            'paragraf_berita' => $paragrafBerita,
            'lokasi' => $kegiatan->lokasi,
            'tanggal_kegiatan' => self::formatTanggal($kegiatan->tanggal_kegiatan),
            'tanggal_iso' => $kegiatan->tanggal_kegiatan?->format('Y-m-d'),
            'gambar' => $gambarUtama,
            'dokumentasi' => $dokumentasi,
            'bidang' => $kegiatan->bidang ? [
                'id' => $kegiatan->bidang->id,
                'kode' => $kegiatan->bidang->kode,
                'nama' => $kegiatan->bidang->nama,
            ] : null,
            'penulis' => $kegiatan->relationLoaded('pembuat') && $kegiatan->pembuat
                ? $kegiatan->pembuat->name
                : 'Tim Publikasi Yayasan Geliyat',
        ];
    }

    /**
     * Format tanggal ke format Indonesia (contoh: 21 November 2026).
     */
    public static function formatTanggal(?CarbonInterface $tanggal): string
    {
        if (! $tanggal) {
            return '-';
        }

        $hari = $tanggal->day;
        $bulan = self::BULAN_INDONESIA[$tanggal->month] ?? $tanggal->format('F');
        $tahun = $tanggal->year;

        return "{$hari} {$bulan} {$tahun}";
    }
}
