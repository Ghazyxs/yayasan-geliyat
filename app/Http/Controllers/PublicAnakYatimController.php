<?php

namespace App\Http\Controllers;

use App\Models\AnakYatim;
use Carbon\CarbonInterface;
use Inertia\Inertia;
use Inertia\Response;

class PublicAnakYatimController extends Controller
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

    /**
     * Kolom database yang diizinkan untuk query publik (Whitelisting).
     * Kolom sensitif (nik, alamat_detail, nama_lengkap, nama_wali, no_telepon_wali)
     * TIDAK PERNAH diambil maupun dikirim ke frontend publik.
     *
     * @var list<string>
     */
    private const PUBLIC_COLUMNS = [
        'id',
        'alias',
        'jenis_kelamin',
        'tempat_lahir',
        'tanggal_lahir',
        'jenjang',
        'kelas',
        'kelurahan',
        'hobi',
        'cita_cita',
        'potensi',
        'prestasi',
        'foto',
        'izin_publikasi_foto',
        'status_binaan',
    ];

    public function index(): Response
    {
        $anakList = AnakYatim::query()
            ->select(self::PUBLIC_COLUMNS)
            ->where('status_binaan', 'aktif')
            ->with(['bidang:id,kode,nama'])
            ->orderBy('id')
            ->get()
            ->map(fn (AnakYatim $anak) => $this->transformPublicAnak($anak))
            ->values();

        return Inertia::render('public/anak-yatim', [
            'anakList' => $anakList,
        ]);
    }

    public function show(AnakYatim $anak_yatim): Response
    {
        if ($anak_yatim->status_binaan !== 'aktif') {
            abort(404);
        }

        $anak_yatim->load(['bidang:id,kode,nama']);

        $anakLainnya = AnakYatim::query()
            ->select(self::PUBLIC_COLUMNS)
            ->where('status_binaan', 'aktif')
            ->where('id', '!=', $anak_yatim->id)
            ->with(['bidang:id,kode,nama'])
            ->orderBy('id')
            ->limit(3)
            ->get()
            ->map(fn (AnakYatim $anak) => $this->transformPublicAnak($anak))
            ->values();

        return Inertia::render('public/anak-yatim-detail', [
            'anak' => $this->transformPublicAnak($anak_yatim),
            'anakLainnya' => $anakLainnya,
        ]);
    }

    /**
     * Transformasi ketat data publik anak yatim (UU PDP & Perlindungan Anak).
     *
     * Memastikan:
     * 1. Hanya nama depan / nama publik aman (`alias`) yang dikirim.
     * 2. Foto HANYA dikirim apabila `izin_publikasi_foto === true`.
     * 3. Data sensitif (NIK, alamat rumah lengkap, nomor telepon, nama wali,
     *    nama lengkap legal, finansial keluarga) TIDAK PERNAH ada di response.
     *
     * @return array<string, mixed>
     */
    public function transformPublicAnak(AnakYatim $anak): array
    {
        $tempatLahir = $anak->tempat_lahir ?: 'Bandung';
        $tanggalLahirPublik = $this->formatTanggal($anak->tanggal_lahir);
        $usiaTahun = $anak->tanggal_lahir ? (int) $anak->tanggal_lahir->age : null;
        $izinFoto = (bool) $anak->izin_publikasi_foto;

        return [
            'id' => $anak->id,
            'nama_publik' => $anak->alias,
            'alias' => $anak->alias,
            'inisial' => $this->extractInisial($anak->alias),
            'jenis_kelamin' => $anak->jenis_kelamin,
            'jenis_kelamin_label' => $anak->jenis_kelamin === 'P' ? 'Perempuan' : 'Laki-laki',
            'tempat_lahir' => $tempatLahir,
            'tanggal_lahir_publik' => $tanggalLahirPublik,
            'tempat_tanggal_lahir' => $tanggalLahirPublik
                ? "{$tempatLahir}, {$tanggalLahirPublik}"
                : $tempatLahir,
            'usia' => $usiaTahun !== null ? "{$usiaTahun} Tahun" : 'Usia Sekolah',
            'usia_tahun' => $usiaTahun,
            'kelompok_usia' => $this->resolveKelompokUsia($usiaTahun, $anak->jenjang),
            'jenjang' => $anak->jenjang,
            'kelas' => $anak->kelas,
            'kelurahan' => $anak->kelurahan,
            'hobi' => $anak->hobi ?: 'Membaca & Olahraga',
            'cita_cita' => $anak->cita_cita ?: 'Pendidik & Profesional',
            'potensi' => $anak->potensi ?: $this->defaultPotensiText($anak),
            'prestasi' => is_array($anak->prestasi) ? array_values($anak->prestasi) : [],
            'izin_publikasi_foto' => $izinFoto,
            'foto' => ($izinFoto && ! empty($anak->foto)) ? $anak->foto : null,
            'bidang_pembinaan' => $anak->relationLoaded('bidang')
                ? $anak->bidang->map(fn ($b) => [
                    'id' => $b->id,
                    'kode' => $b->kode,
                    'nama' => $b->nama,
                    'catatan_program' => $b->pivot?->catatan_program,
                ])->values()->all()
                : [],
        ];
    }

    private function formatTanggal(?CarbonInterface $date): string
    {
        if (! $date) {
            return '';
        }

        $bulan = self::BULAN_INDONESIA[(int) $date->format('n')] ?? $date->format('F');

        return sprintf('%d %s %s', (int) $date->format('j'), $bulan, $date->format('Y'));
    }

    private function resolveKelompokUsia(?int $usia, string $jenjang): string
    {
        if ($usia !== null) {
            if ($usia <= 12) {
                return 'Anak Usia Sekolah Dasar (6–12 Tahun)';
            }
            if ($usia <= 15) {
                return 'Remaja Awal / SMP (13–15 Tahun)';
            }
            if ($usia <= 18) {
                return 'Remaja Akhir / SMA (16–18 Tahun)';
            }

            return 'Pemuda / Mahasiswa (19+ Tahun)';
        }

        return match ($jenjang) {
            'SD' => 'Anak Usia Sekolah Dasar (6–12 Tahun)',
            'SMP' => 'Remaja Awal / SMP (13–15 Tahun)',
            'SMA' => 'Remaja Akhir / SMA (16–18 Tahun)',
            default => 'Pemuda / Mahasiswa (19+ Tahun)',
        };
    }

    private function extractInisial(string $alias): string
    {
        $clean = trim((string) preg_replace('/\([^)]*\)/', '', $alias));
        $parts = preg_split('/\s+/', $clean) ?: [];
        if (count($parts) >= 2) {
            return mb_strtoupper(mb_substr($parts[0], 0, 1).mb_substr($parts[1], 0, 1));
        }

        return mb_strtoupper(mb_substr($clean !== '' ? $clean : 'AY', 0, 2));
    }

    private function defaultPotensiText(AnakYatim $anak): string
    {
        $hobi = $anak->hobi ?: 'kegiatan positif';
        $cita = $anak->cita_cita ?: 'masa depan mandiri';

        return "Ananda {$anak->alias} memiliki semangat belajar yang tinggi pada jenjang {$anak->jenjang} ({$anak->kelas}), aktif mengembangkan minat di bidang {$hobi}, serta memiliki tekad kuat untuk meraih cita-cita sebagai {$cita}.";
    }
}
