<?php

namespace Database\Seeders;

use App\Models\AnakYatim;
use App\Models\Bidang;
use App\Models\User;
use Illuminate\Database\Seeder;

class AnakYatimSeeder extends Seeder
{
    public function run(): void
    {
        $superAdmin = User::where('role', 'super_admin')->first();
        if (! $superAdmin) {
            return;
        }

        $bidangMap = Bidang::pluck('id', 'kode');

        $daftarAnak = [
            [
                'nik' => '3273011205150001',
                'nama_lengkap' => 'Rizky Ramadhan Pratama',
                'alias' => 'Rizky (R.P.)',
                'jenis_kelamin' => 'L',
                'tempat_lahir' => 'Bandung',
                'tanggal_lahir' => '2015-05-12',
                'jenjang' => 'SD',
                'kelas' => 'Kelas 5 SD',
                'nama_sekolah' => 'SDN Cigending Kota Bandung',
                'kelurahan' => 'Cigending',
                'alamat_detail' => 'Jl. Cigending Dalam RT 03 RW 05 Kec. Ujungberung',
                'nama_wali' => 'Ibu Siti Maryam',
                'no_telepon_wali' => '081223344551',
                'hobi' => 'Menggambar & Sepak Bola',
                'cita_cita' => 'Arsitek',
                'potensi' => 'Ananda Rizky memiliki daya imajinasi visual dan kemampuan menggambar sketsa bangunan yang menonjol. Dalam kegiatan les rutin Yayasan Geliyat, ia dikenal tekun menyelesaikan soal matematika dasar serta aktif memimpin kegiatan olahraga bersama teman sebaya.',
                'prestasi' => [
                    'Peringkat 3 Besar Kelas 5 SD Semester Ganjil',
                    'Juara Harapan Lomba Menggambar Anak Tingkat Kecamatan Ujungberung',
                    'Peserta Aktif Les Matematika & Bahasa Inggris Yayasan Geliyat',
                ],
                'foto' => '/images/kegiatan1.jpeg',
                'izin_publikasi_foto' => true,
                'status_binaan' => 'aktif',
                'status_asuh' => AnakYatim::STATUS_ASUH_BELUM,
                'bidang_kodes' => [
                    Bidang::PENDIDIKAN => 'Mengikuti les matematika dan bahasa Inggris rutin setiap akhir pekan.',
                    Bidang::KEMANUSIAAN => 'Penerima santunan bulanan dan perlengkapan sekolah.',
                ],
            ],
            [
                'nik' => '3273015808120002',
                'nama_lengkap' => 'Siti Aisyah Nurhaliza',
                'alias' => 'Aisyah (S.A.)',
                'jenis_kelamin' => 'P',
                'tempat_lahir' => 'Bandung',
                'tanggal_lahir' => '2012-08-18',
                'jenjang' => 'SMP',
                'kelas' => 'Kelas 8 SMP',
                'nama_sekolah' => 'SMPN 8 Ujungberung',
                'kelurahan' => 'Pasirwangi',
                'alamat_detail' => 'Kp. Pasirwangi RT 02 RW 07 Kec. Ujungberung',
                'nama_wali' => 'Ibu Halimah',
                'no_telepon_wali' => '081223344552',
                'hobi' => 'Membaca & Kaligrafi',
                'cita_cita' => 'Dokter Anak',
                'potensi' => 'Ananda Aisyah unggul pada mata pelajaran IPA (Biologi) dan seni kaligrafi Islam. Di program Gemar (Geliyat Mengaji & Belajar), ia telah menyelesaikan hafalan Juz 30 dengan tajwid yang baik dan kerap membantu membimbing adik-adik binaan jenjang SD.',
                'prestasi' => [
                    'Hafidz Juz 30 Program Tahfidz & Gemar Yayasan Geliyat',
                    'Juara 2 Lomba Kaligrafi tingkat SMP se-Ujungberung',
                    'Nilai Rapor Terbaik Mata Pelajaran IPA Kelas 8',
                ],
                'foto' => '/images/kegiatan2.jpeg',
                'izin_publikasi_foto' => true,
                'status_binaan' => 'aktif',
                'status_asuh' => AnakYatim::STATUS_ASUH_AKTIF,
                'bidang_kodes' => [
                    Bidang::KEAGAMAAN => 'Peserta aktif pembinaan tahfidz Al-Qur\'an Juz 30 & Juz 29.',
                    Bidang::PENDIDIKAN => 'Penerima bimbingan belajar intensif IPA dan Bahasa Inggris.',
                ],
            ],
            [
                'nik' => '3273012111110003',
                'nama_lengkap' => 'Muhammad Fajar Siddiq',
                'alias' => 'Fajar (M.F.)',
                'jenis_kelamin' => 'L',
                'tempat_lahir' => 'Bandung',
                'tanggal_lahir' => '2011-11-21',
                'jenjang' => 'SMP',
                'kelas' => 'Kelas 9 SMP',
                'nama_sekolah' => 'MTs Al-Inayah Bandung',
                'kelurahan' => 'Pasanggrahan',
                'alamat_detail' => 'Jl. Pasanggrahan Indah RT 04 RW 02 Kec. Ujungberung',
                'nama_wali' => 'Bapak Dedi Supriadi',
                'no_telepon_wali' => '081223344553',
                'hobi' => 'Tahfidz Qur\'an & Bulu Tangkis',
                'cita_cita' => 'Guru & Pengusaha',
                'potensi' => 'Ananda Fajar memiliki kemampuan kepemimpinan dan komunikasi publik yang sangat baik. Selain disiplin menjaga hafalan Al-Qur\'an, ia juga memiliki ketertarikan kuat pada kewirausahaan remaja dan aktif dalam pelatihan kemandirian di sekretariat yayasan.',
                'prestasi' => [
                    'Ketua Kelompok Belajar Remaja Binaan Yayasan Geliyat',
                    'Lulus Ujian Tahsin & Tahfidz Juz 30 dengan Predikat Mumtaz',
                    'Peserta Terbaik Pelatihan Literasi Komputer & Administrasi Dasar',
                ],
                'foto' => '/images/kegiatan3.jpeg',
                'izin_publikasi_foto' => false,
                'status_binaan' => 'aktif',
                'status_asuh' => AnakYatim::STATUS_ASUH_BELUM,
                'bidang_kodes' => [
                    Bidang::KEAGAMAAN => 'Mengikuti kajian adab dan halaqah tahfidz remaja.',
                    Bidang::PENDIDIKAN => 'Persiapan ujian akhir SMP dan pemetaan minat jenjang SMA/SMK.',
                ],
            ],
            [
                'nik' => '3273014402090004',
                'nama_lengkap' => 'Nabila Zahra Khairunnisa',
                'alias' => 'Nabila (N.Z.)',
                'jenis_kelamin' => 'P',
                'tempat_lahir' => 'Sumedang',
                'tanggal_lahir' => '2009-02-04',
                'jenjang' => 'SMA',
                'kelas' => 'Kelas 11 SMA',
                'nama_sekolah' => 'SMAN 24 Bandung',
                'kelurahan' => 'Pasirjati',
                'alamat_detail' => 'Komp. Pasirjati RT 01 RW 09 Kec. Ujungberung',
                'nama_wali' => 'Ibu Rohmah',
                'no_telepon_wali' => '081223344554',
                'hobi' => 'Menulis Cerpen & Bahasa Inggris',
                'cita_cita' => 'Psikolog Anak',
                'potensi' => 'Ananda Nabila memiliki bakat literasi, penulisan kreatif, dan penguasaan Bahasa Inggris yang menonjol. Ia aktif menjadi kakak pendamping bagi adik-adik binaan usia SD dalam kegiatan membaca nyaring (read aloud) dan motivasi belajar.',
                'prestasi' => [
                    'Finalis Lomba Esai Pelajar Tingkat Kota Bandung',
                    'Relawan Kakak Asuh Literasi pada Program Les Rutin Yayasan Geliyat',
                    'Peringkat 5 Besar Jurusan Sosial SMAN 24 Bandung',
                ],
                'foto' => '/images/kegiatan1.jpeg',
                'izin_publikasi_foto' => true,
                'status_binaan' => 'aktif',
                'status_asuh' => AnakYatim::STATUS_ASUH_BELUM,
                'bidang_kodes' => [
                    Bidang::PENDIDIKAN => 'Penerima beasiswa pendidikan jenjang SMA dan kelas Bahasa Inggris.',
                    Bidang::EKONOMI => 'Mengikuti pelatihan keterampilan kreatif dan penulisan konten.',
                ],
            ],
            [
                'nik' => '3273011907160005',
                'nama_lengkap' => 'Ilham Ramadhan Putra',
                'alias' => 'Ilham (I.R.)',
                'jenis_kelamin' => 'L',
                'tempat_lahir' => 'Bandung',
                'tanggal_lahir' => '2016-07-19',
                'jenjang' => 'SD',
                'kelas' => 'Kelas 3 SD',
                'nama_sekolah' => 'SDN Pasirendah 1',
                'kelurahan' => 'Pasirendah',
                'alamat_detail' => 'Jl. Pasirendah RT 06 RW 03 Kec. Ujungberung',
                'nama_wali' => 'Ibu Nenden',
                'no_telepon_wali' => '081223344555',
                'hobi' => 'Berhitung & Menyusun Lego',
                'cita_cita' => 'Insinyur Robotika',
                'potensi' => 'Ananda Ilham sangat antusias pada permainan logika, berhitung cepat, dan perakitan rancang bangun. Meskipun masih duduk di bangku kelas 3 SD, ia memiliki rasa ingin tahu yang tinggi terhadap sains dasar dan teknologi.',
                'prestasi' => [
                    'Siswa Teraktif Kelas Berhitung Dasar Yayasan Geliyat',
                    'Lulus Iqra Jilid 6 & Mulai Hafalan Surat Pendek Juz 30',
                ],
                'foto' => null,
                'izin_publikasi_foto' => false,
                'status_binaan' => 'aktif',
                'status_asuh' => AnakYatim::STATUS_ASUH_AKTIF,
                'bidang_kodes' => [
                    Bidang::PENDIDIKAN => 'Pendampingan belajar calistung lanjutan dan matematika dasar.',
                    Bidang::KEMANUSIAAN => 'Penerima paket nutrisi dan santunan bulanan.',
                ],
            ],
            [
                'nik' => '3273016509080006',
                'nama_lengkap' => 'Salma Khairunnisa Putri',
                'alias' => 'Salma (S.K.)',
                'jenis_kelamin' => 'P',
                'tempat_lahir' => 'Garut',
                'tanggal_lahir' => '2008-09-25',
                'jenjang' => 'SMA',
                'kelas' => 'Kelas 12 SMK',
                'nama_sekolah' => 'SMKN 9 Bandung',
                'kelurahan' => 'Cigending',
                'alamat_detail' => 'Jl. Nagrog RT 05 RW 08 Kel. Cigending',
                'nama_wali' => 'Ibu Yayah',
                'no_telepon_wali' => '081223344556',
                'hobi' => 'Desain Grafis & Fotografi',
                'cita_cita' => 'Desainer Komunikasi Visual',
                'potensi' => 'Ananda Salma memiliki keterampilan desain grafis, tata letak visual, dan fotografi dokumentasi. Ia turut membantu tim dokumentasi kegiatan remaja di Yayasan Geliyat serta sedang mempersiapkan portofolio untuk melanjutkan studi perguruan tinggi.',
                'prestasi' => [
                    'Peserta Terbaik Pelatihan Desain Grafis & Kewirausahaan Muda',
                    'Juara 1 Proyek Karya Desain Poster Sekolah',
                    'Penerima Bantuan Persiapan Masuk Perguruan Tinggi Yayasan Geliyat',
                ],
                'foto' => '/images/kegiatan2.jpeg',
                'izin_publikasi_foto' => true,
                'status_binaan' => 'aktif',
                'status_asuh' => AnakYatim::STATUS_ASUH_BELUM,
                'bidang_kodes' => [
                    Bidang::PENDIDIKAN => 'Pendampingan persiapan seleksi masuk perguruan tinggi.',
                    Bidang::EKONOMI => 'Pelatihan keterampilan desain digital dan kewirausahaan.',
                ],
            ],
        ];

        foreach ($daftarAnak as $item) {
            $bidangKodes = $item['bidang_kodes'];
            unset($item['bidang_kodes']);

            $anak = AnakYatim::updateOrCreate(
                ['alias' => $item['alias']],
                array_merge($item, ['created_by' => $superAdmin->id])
            );

            $syncPayload = [];
            foreach ($bidangKodes as $kode => $catatan) {
                $bidangId = $bidangMap[$kode] ?? null;
                if ($bidangId) {
                    $syncPayload[$bidangId] = ['catatan_program' => $catatan];
                }
            }

            if ($syncPayload !== []) {
                $anak->bidang()->sync($syncPayload);
            }
        }
    }
}
