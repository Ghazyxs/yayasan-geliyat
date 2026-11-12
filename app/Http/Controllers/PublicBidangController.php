<?php

namespace App\Http\Controllers;

use App\Models\Bidang;
use App\Models\Kegiatan;
use Inertia\Inertia;
use Inertia\Response;

class PublicBidangController extends Controller
{
    /**
     * Urutan tampilan kanonikal bidang di halaman publik.
     *
     * @var array<string, int>
     */
    private const DISPLAY_ORDER = [
        Bidang::PENDIDIKAN => 1,
        Bidang::KEMANUSIAAN => 2,
        Bidang::EKONOMI => 3,
        Bidang::KEAGAMAAN => 4,
    ];

    /**
     * Gambar fallback default berdasarkan kode bidang jika kolom gambar bernilai null.
     *
     * @var array<string, string>
     */
    private const DEFAULT_IMAGES = [
        Bidang::PENDIDIKAN => 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200&auto=format&fit=crop',
        Bidang::KEMANUSIAAN => 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1200&auto=format&fit=crop',
        Bidang::EKONOMI => 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?q=80&w=1200&auto=format&fit=crop',
        Bidang::KEAGAMAAN => 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?q=80&w=1200&auto=format&fit=crop',
    ];

    /**
     * Tampilkan daftar seluruh bidang dari database.
     */
    public function index(): Response
    {
        $bidangList = Bidang::query()
            ->withCount(['kegiatan', 'anakYatim'])
            ->get()
            ->sortBy(fn (Bidang $b) => self::DISPLAY_ORDER[$b->kode] ?? (100 + $b->id))
            ->values()
            ->map(fn (Bidang $bidang) => $this->transformBidang($bidang));

        return Inertia::render('public/bidang', [
            'bidangList' => $bidangList,
        ]);
    }

    /**
     * Tampilkan halaman detail untuk satu bidang berdasarkan identitas (id atau kode) dari database.
     */
    public function show(string $identitas): Response
    {
        $query = Bidang::query()->withCount(['kegiatan', 'anakYatim']);

        if (ctype_digit($identitas)) {
            $bidang = $query->where('id', (int) $identitas)->firstOrFail();
        } else {
            $bidang = $query->where('kode', strtolower(trim($identitas)))->firstOrFail();
        }

        $kegiatanTerkait = Kegiatan::query()
            ->where('bidang_id', $bidang->id)
            ->orderByDesc('tanggal_kegiatan')
            ->orderByDesc('id')
            ->get()
            ->map(fn (Kegiatan $kegiatan) => [
                'id' => $kegiatan->id,
                'judul' => $kegiatan->judul,
                'kategori' => $kegiatan->kategori,
                'ringkasan' => $kegiatan->ringkasan ?: $kegiatan->deskripsi,
                'deskripsi' => $kegiatan->deskripsi,
                'lokasi' => $kegiatan->lokasi,
                'tanggal_kegiatan' => PublicKegiatanController::formatTanggal($kegiatan->tanggal_kegiatan),
                'tanggal_iso' => $kegiatan->tanggal_kegiatan?->format('Y-m-d'),
                'gambar' => $kegiatan->gambar ?: (self::DEFAULT_IMAGES[$bidang->kode] ?? self::DEFAULT_IMAGES[Bidang::PENDIDIKAN]),
            ]);

        $bidangLainnya = Bidang::query()
            ->where('id', '!=', $bidang->id)
            ->withCount(['kegiatan', 'anakYatim'])
            ->get()
            ->sortBy(fn (Bidang $b) => self::DISPLAY_ORDER[$b->kode] ?? (100 + $b->id))
            ->values()
            ->map(fn (Bidang $b) => $this->transformBidang($b));

        return Inertia::render('public/bidang-detail', [
            'bidang' => $this->transformBidang($bidang),
            'kegiatanTerkait' => $kegiatanTerkait,
            'bidangLainnya' => $bidangLainnya,
        ]);
    }

    /**
     * Format data model Bidang menjadi struktur konsisten untuk komponen frontend.
     *
     * @return array<string, mixed>
     */
    public static function transformBidang(Bidang $bidang): array
    {
        $rawPrograms = is_array($bidang->program_kerja) ? $bidang->program_kerja : [];
        $programs = array_map(function ($item): array {
            if (is_string($item)) {
                return [
                    'nama' => $item,
                    'deskripsi' => '',
                    'jadwal' => 'Rutin Terjadwal',
                    'sasaran' => 'Anak & Keluarga Binaan',
                ];
            }

            return [
                'nama' => (string) ($item['nama'] ?? ''),
                'deskripsi' => (string) ($item['deskripsi'] ?? ''),
                'jadwal' => (string) ($item['jadwal'] ?? 'Rutin Terjadwal'),
                'sasaran' => (string) ($item['sasaran'] ?? 'Anak & Keluarga Binaan'),
            ];
        }, $rawPrograms);

        $tujuan = is_array($bidang->tujuan) ? array_values($bidang->tujuan) : [];
        $info = is_array($bidang->informasi_tambahan) ? $bidang->informasi_tambahan : [];

        return [
            'id' => $bidang->id,
            'kode' => $bidang->kode,
            'nama' => $bidang->nama,
            'subjudul' => $bidang->subjudul ?: 'Program Pemberdayaan & Pelayanan Yayasan Geliyat',
            'deskripsi' => $bidang->deskripsi ?: '',
            'deskripsi_lengkap' => $bidang->deskripsi_lengkap ?: ($bidang->deskripsi ?: ''),
            'gambar' => $bidang->gambar ?: (self::DEFAULT_IMAGES[$bidang->kode] ?? self::DEFAULT_IMAGES[Bidang::PENDIDIKAN]),
            'tujuan' => $tujuan,
            'program_kerja' => $programs,
            'informasi_tambahan' => [
                'sasaran_utama' => (string) ($info['sasaran_utama'] ?? 'Anak yatim & keluarga binaan di 5 kelurahan Ujungberung'),
                'lokasi_pelaksanaan' => (string) ($info['lokasi_pelaksanaan'] ?? 'Kecamatan Ujungberung, Kota Bandung'),
                'frekuensi_kegiatan' => (string) ($info['frekuensi_kegiatan'] ?? 'Rutin Pekanan & Bulanan'),
                'koordinator_unit' => (string) ($info['koordinator_unit'] ?? 'Pengurus Bidang ' . $bidang->nama),
            ],
            'kegiatan_count' => (int) ($bidang->kegiatan_count ?? 0),
            'anak_yatim_count' => (int) ($bidang->anak_yatim_count ?? 0),
        ];
    }
}
