<?php

namespace Database\Seeders;

use App\Models\Bidang;
use Illuminate\Database\Seeder;

class BidangSeeder extends Seeder
{
    /**
     * Data master bidang resmi Yayasan Geliyat Mahdiesa Nahate
     * beserta program kerja dan informasi masing-masing bidang.
     *
     * @var array<int, array<string, mixed>>
     */
    protected array $bidangMaster = [
        [
            'kode' => Bidang::PENDIDIKAN,
            'nama' => 'Bidang Pendidikan',
            'subjudul' => 'BINAYA (Bina Anak Yatim)',
            'deskripsi' => 'BINAYA (Bina Anak Yatim) berfokus pada peningkatan kualitas pendidikan dan pengembangan potensi anak yatim melalui pembinaan, pendampingan belajar, pendidikan Al-Qur\'an, serta dukungan akses pendidikan guna membangun generasi yang cerdas, berkarakter, dan berdaya saing.',
            'deskripsi_lengkap' => 'BINAYA (Bina Anak Yatim) berfokus pada peningkatan kualitas pendidikan dan pengembangan potensi anak yatim melalui pembinaan, pendampingan belajar, pendidikan Al-Qur\'an, serta dukungan akses pendidikan guna membangun generasi yang cerdas, berkarakter, dan berdaya saing.',
            'gambar' => 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200&auto=format&fit=crop',
            'tujuan' => [
                'Meningkatkan kualitas pendidikan melalui pembinaan dan pendampingan belajar anak yatim.',
                'Mengembangkan potensi, kecerdasan, dan daya saing anak binaan sejak usia dini hingga usia sekolah.',
                'Menyelenggarakan pendidikan Al-Qur\'an untuk membentuk karakter generasi yang berakhlak mulia.',
                'Mendukung akses pendidikan bagi anak yatim agar tumbuh menjadi generasi yang cerdas dan mandiri.',
            ],
            'program_kerja' => [
                [
                    'nama' => 'KOBER (Kelompok Bermain)',
                    'deskripsi' => 'Program pendidikan anak usia dini untuk mendukung tumbuh kembang, pengenalan dasar belajar, dan pembentukan karakter sejak dini.',
                    'jadwal' => 'Sesuai Jadwal KOBER',
                    'sasaran' => 'Anak Usia Dini',
                ],
                [
                    'nama' => 'SINAR (Sahabat Inspirasi Anak & Remaja)',
                    'deskripsi' => 'Program bimbingan belajar dengan sasaran anak-anak usia Sekolah Dasar (SD) untuk pendampingan tugas sekolah dan pemahaman pelajaran.',
                    'jadwal' => 'Rutin Terjadwal',
                    'sasaran' => 'Anak-anak Usia SD',
                ],
                [
                    'nama' => 'GEMAR (Gerakan Mengaji Anak)',
                    'deskripsi' => 'Program pembelajaran dan pembinaan mengaji Al-Qur\'an dengan sasaran seluruh anak binaan Yayasan Geliyat Mahdiesa Nahate.',
                    'jadwal' => 'Rutin Terjadwal',
                    'sasaran' => 'Seluruh Anak Binaan',
                ],
                [
                    'nama' => 'GEMILANG (Gerakan Militan Pejuang)',
                    'deskripsi' => 'Program penguatan kapasitas, komitmen, dan kebersamaan yang ditujukan khusus untuk penguatan pengurus yayasan.',
                    'jadwal' => 'Internal Pengurus',
                    'sasaran' => 'Pengurus Yayasan (Internal)',
                ],
            ],
            'informasi_tambahan' => [
                'sasaran_utama' => 'Anak usia dini, anak-anak usia SD, dan seluruh anak binaan',
                'lokasi_pelaksanaan' => 'Kecamatan Ujungberung, Kota Bandung',
                'frekuensi_kegiatan' => 'Rutin Terjadwal',
                'koordinator_unit' => 'Pengurus Bidang Pendidikan',
            ],
        ],
        [
            'kode' => Bidang::KEAGAMAAN,
            'nama' => 'Bidang Keagamaan',
            'subjudul' => 'Pembinaan Spiritual Anak Yatim & Ibu Yatim',
            'deskripsi' => 'Berfokus pada pembinaan spiritual anak yatim dan ibu yatim melalui peningkatan pemahaman serta pengamalan nilai-nilai Islam, pembelajaran Al-Qur\'an, penguatan akidah, ibadah, dan pembentukan akhlak mulia.',
            'deskripsi_lengkap' => 'Bidang Keagamaan berfokus pada pembinaan spiritual anak yatim dan ibu yatim melalui peningkatan pemahaman serta pengamalan nilai-nilai Islam, pembelajaran Al-Qur\'an, penguatan akidah, ibadah, dan pembentukan akhlak mulia.',
            'gambar' => 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?q=80&w=1200&auto=format&fit=crop',
            'tujuan' => [
                'Menyelenggarakan pembinaan keagamaan yang berkelanjutan bagi anak yatim dan ibu yatim.',
                'Meningkatkan pemahaman serta pengamalan nilai-nilai Islam melalui pembelajaran Al-Qur\'an.',
                'Menguatkan akidah, ibadah, dan membentuk akhlak mulia dalam kehidupan sehari-hari.',
            ],
            'program_kerja' => [
                [
                    'nama' => 'BINATUYA (Bina Orang Tua Yatim)',
                    'deskripsi' => 'Program penguatan spiritual dan keagamaan bagi orang tua yatim (Ummu Geliyat) yang diselenggarakan satu kali setiap bulan.',
                    'jadwal' => 'Satu Kali Setiap Bulan',
                    'sasaran' => 'Orang Tua Yatim (Ummu Geliyat)',
                ],
            ],
            'informasi_tambahan' => [
                'sasaran_utama' => 'Anak yatim dan orang tua yatim (Ummu Geliyat)',
                'lokasi_pelaksanaan' => 'Kecamatan Ujungberung, Kota Bandung',
                'frekuensi_kegiatan' => 'Satu Kali Setiap Bulan',
                'koordinator_unit' => 'Pengurus Bidang Keagamaan',
            ],
        ],
        [
            'kode' => Bidang::KEMANUSIAAN,
            'nama' => 'Bidang Kemanusiaan',
            'subjudul' => 'Kepedulian dan Perlindungan Sosial Anak Yatim & Ibu Yatim',
            'deskripsi' => 'Berfokus pada kepedulian dan perlindungan sosial bagi anak yatim dan ibu yatim melalui program santunan, bantuan sosial, pemenuhan kebutuhan dasar, pendampingan, serta kegiatan yang mendukung peningkatan kualitas hidup dan kesejahteraan keluarga yatim.',
            'deskripsi_lengkap' => 'Bidang Kemanusiaan berfokus pada kepedulian dan perlindungan sosial bagi anak yatim dan ibu yatim melalui program santunan, bantuan sosial, pemenuhan kebutuhan dasar, pendampingan, serta kegiatan yang mendukung peningkatan kualitas hidup dan kesejahteraan keluarga yatim.',
            'gambar' => 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1200&auto=format&fit=crop',
            'tujuan' => [
                'Memberikan perlindungan dan pelayanan sosial bagi anak yatim dan ibu yatim.',
                'Menyalurkan santunan dan bantuan pemenuhan kebutuhan dasar secara berkelanjutan.',
                'Mendukung peningkatan kualitas hidup, kebahagiaan, serta kesejahteraan keluarga yatim.',
            ],
            'program_kerja' => [
                [
                    'nama' => 'SATIN (Santunan Rutin)',
                    'deskripsi' => 'Bukan sekadar pemberian uang sumbangan yang dilaksanakan setiap Sabtu pada minggu keempat setiap bulan. Program ini juga menghadirkan perhatian, pelukan, dan senyuman bagi anak-anak yatim.',
                    'jadwal' => 'Setiap Sabtu Minggu Keempat Setiap Bulan',
                    'sasaran' => 'Anak-anak Yatim Binaan',
                ],
                [
                    'nama' => 'UBAY (Ulin Bareng Yatim)',
                    'deskripsi' => 'Bukan sekadar piknik, melainkan waktu bagi anak-anak untuk tertawa, melupakan beban, dan merasakan memiliki keluarga baru yang benar-benar peduli. Merupakan program tahunan (1 kali setahun) untuk membangun koneksi emosional antara pengurus dan anak-anak, sekaligus menjadi ruang deteksi psikologis anak.',
                    'jadwal' => 'Tahunan (1 Kali dalam Setahun)',
                    'sasaran' => 'Anak-anak Yatim & Pengurus',
                ],
                [
                    'nama' => 'RAMADHAN BERSAMA YATIM',
                    'deskripsi' => 'Agenda tahunan Yayasan Geliyat Mahdiesa Nahate menjelang bulan suci Ramadhan dengan memberikan bingkisan kebutuhan pokok (sembako) kepada anak-anak yatim dan keluarganya agar dapat menyambut dan menjalani Ramadhan dengan penuh suka cita, lebih tenang, dan bahagia.',
                    'jadwal' => 'Tahunan (Menjelang Bulan Ramadhan)',
                    'sasaran' => 'Anak-anak Yatim & Keluarga',
                ],
                [
                    'nama' => 'LEBARAN BERSAMA YATIM',
                    'deskripsi' => 'Program berbagi kebahagiaan menjelang Hari Raya Idul Fitri dengan memberikan bingkisan makanan kepada anak-anak yatim sebagai bentuk kasih sayang agar mereka turut merasakan kemeriahan hari kemenangan dan mengetahui bahwa mereka tidak sendiri.',
                    'jadwal' => 'Tahunan (Menjelang Hari Raya Idul Fitri)',
                    'sasaran' => 'Anak-anak Yatim Binaan',
                ],
            ],
            'informasi_tambahan' => [
                'sasaran_utama' => 'Anak yatim dan ibu yatim binaan',
                'lokasi_pelaksanaan' => 'Kecamatan Ujungberung, Kota Bandung',
                'frekuensi_kegiatan' => 'Bulanan (Sabtu Minggu Ke-4) & Agenda Tahunan',
                'koordinator_unit' => 'Pengurus Bidang Kemanusiaan',
            ],
        ],
        [
            'kode' => Bidang::EKONOMI,
            'nama' => 'Bidang Pengembangan Ekonomi',
            'subjudul' => 'Pemberdayaan Ekonomi dan Kemandirian Keluarga Yatim',
            'deskripsi' => 'Berfokus pada pemberdayaan ekonomi ibu yatim melalui peningkatan keterampilan, pendampingan usaha, pengembangan kewirausahaan, serta pembentukan kegiatan ekonomi produktif guna mendorong kemandirian dan meningkatkan kesejahteraan keluarga yatim.',
            'deskripsi_lengkap' => 'Bidang Pengembangan Ekonomi berfokus pada pemberdayaan ekonomi ibu yatim melalui peningkatan keterampilan, pendampingan usaha, pengembangan kewirausahaan, serta pembentukan kegiatan ekonomi produktif guna mendorong kemandirian dan meningkatkan kesejahteraan keluarga yatim.',
            'gambar' => 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?q=80&w=1200&auto=format&fit=crop',
            'tujuan' => [
                'Mengembangkan kemandirian ekonomi keluarga penerima manfaat.',
                'Meningkatkan keterampilan, pendampingan usaha, dan kewirausahaan bagi ibu yatim.',
                'Membentuk kegiatan ekonomi produktif untuk meningkatkan kesejahteraan keluarga yatim.',
            ],
            'program_kerja' => [
                [
                    'nama' => 'Koperasi Simpan Pinjam',
                    'deskripsi' => 'Meliputi penyediaan kebutuhan yang bersifat mendesak (urgent) serta fasilitas cicilan barang bagi keluarga binaan.',
                    'jadwal' => 'Operasional Koperasi',
                    'sasaran' => 'Ibu Yatim & Keluarga Binaan',
                ],
                [
                    'nama' => 'Penyediaan Kebutuhan Pokok',
                    'deskripsi' => 'Program penyediaan kebutuhan pokok untuk mendukung pemenuhan kebutuhan keluarga binaan.',
                    'jadwal' => 'Berkelanjutan',
                    'sasaran' => 'Keluarga Binaan Yayasan',
                ],
            ],
            'informasi_tambahan' => [
                'sasaran_utama' => 'Ibu yatim dan keluarga penerima manfaat',
                'lokasi_pelaksanaan' => 'Kecamatan Ujungberung, Kota Bandung',
                'frekuensi_kegiatan' => 'Berkelanjutan',
                'koordinator_unit' => 'Pengurus Bidang Pengembangan Ekonomi',
            ],
        ],
    ];

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach ($this->bidangMaster as $data) {
            Bidang::updateOrCreate(
                ['kode' => $data['kode']],
                [
                    'nama' => $data['nama'],
                    'subjudul' => $data['subjudul'],
                    'deskripsi' => $data['deskripsi'],
                    'deskripsi_lengkap' => $data['deskripsi_lengkap'],
                    'gambar' => $data['gambar'],
                    'tujuan' => $data['tujuan'],
                    'program_kerja' => $data['program_kerja'],
                    'informasi_tambahan' => $data['informasi_tambahan'],
                ]
            );
        }
    }
}
