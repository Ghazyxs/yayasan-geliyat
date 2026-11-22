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
                'no_kk' => '3273010101100001',
                'nama_lengkap' => 'Rizky Ramadhan Pratama',
                'anak_ke' => 1,
                'jenis_kelamin' => 'L',
                'status_santunan' => AnakYatim::STATUS_SANTUNAN_MENERIMA,
                'tempat_lahir' => 'Bandung',
                'tanggal_lahir' => '2015-05-12',
                'jenjang' => 'SD',
                'kelurahan' => 'Cigending',
                'alamat_detail' => 'Jl. Cigending Dalam RT 03 RW 05 Kec. Ujungberung',
                'nama_ibu_kandung' => 'Ibu Siti Maryam',
                'no_telepon' => '081223344551',
                'nama_wali' => 'Ibu Siti Maryam',
                'no_telepon_wali' => '081223344551',
                'status_binaan' => 'aktif',
                'bidang_kodes' => [
                    Bidang::PENDIDIKAN => 'Mengikuti les matematika dan bahasa Inggris rutin setiap akhir pekan.',
                    Bidang::KEMANUSIAAN => 'Penerima santunan bulanan dan perlengkapan sekolah.',
                ],
            ],
            [
                'nik' => '3273015808120002',
                'no_kk' => '3273010101100002',
                'nama_lengkap' => 'Siti Aisyah Nurhaliza',
                'anak_ke' => 2,
                'jenis_kelamin' => 'P',
                'status_santunan' => AnakYatim::STATUS_SANTUNAN_MENERIMA,
                'tempat_lahir' => 'Bandung',
                'tanggal_lahir' => '2012-08-18',
                'jenjang' => 'SMP',
                'kelurahan' => 'Pasirwangi',
                'alamat_detail' => 'Kp. Pasirwangi RT 02 RW 07 Kec. Ujungberung',
                'nama_ibu_kandung' => 'Ibu Halimah',
                'no_telepon' => '081223344552',
                'nama_wali' => 'Ibu Halimah',
                'no_telepon_wali' => '081223344552',
                'status_binaan' => 'aktif',
                'bidang_kodes' => [
                    Bidang::KEAGAMAAN => 'Peserta aktif pembinaan tahfidz Al-Qur\'an Juz 30 & Juz 29.',
                    Bidang::PENDIDIKAN => 'Penerima bimbingan belajar intensif IPA dan Bahasa Inggris.',
                ],
            ],
            [
                'nik' => '3273012111110003',
                'no_kk' => '3273010101100003',
                'nama_lengkap' => 'Muhammad Fajar Siddiq',
                'anak_ke' => 1,
                'jenis_kelamin' => 'L',
                'status_santunan' => AnakYatim::STATUS_SANTUNAN_MENUNGGU,
                'tempat_lahir' => 'Bandung',
                'tanggal_lahir' => '2011-11-21',
                'jenjang' => 'SMP',
                'kelurahan' => 'Pasanggrahan',
                'alamat_detail' => 'Jl. Pasanggrahan Indah RT 04 RW 02 Kec. Ujungberung',
                'nama_ibu_kandung' => 'Ibu Nurjanah',
                'no_telepon' => '081223344553',
                'nama_wali' => 'Bapak Dedi Supriadi',
                'no_telepon_wali' => '081223344553',
                'status_binaan' => 'aktif',
                'bidang_kodes' => [
                    Bidang::KEAGAMAAN => 'Mengikuti kajian adab dan halaqah tahfidz remaja.',
                    Bidang::PENDIDIKAN => 'Persiapan ujian akhir SMP dan pemetaan minat jenjang SMA/SMK.',
                ],
            ],
            [
                'nik' => '3273014402090004',
                'no_kk' => '3273010101100004',
                'nama_lengkap' => 'Nabila Zahra Khairunnisa',
                'anak_ke' => 3,
                'jenis_kelamin' => 'P',
                'status_santunan' => AnakYatim::STATUS_SANTUNAN_MENERIMA,
                'tempat_lahir' => 'Sumedang',
                'tanggal_lahir' => '2009-02-04',
                'jenjang' => 'SMA/SMK',
                'kelurahan' => 'Pasirjati',
                'alamat_detail' => 'Komp. Pasirjati RT 01 RW 09 Kec. Ujungberung',
                'nama_ibu_kandung' => 'Ibu Rohmah',
                'no_telepon' => '081223344554',
                'nama_wali' => 'Ibu Rohmah',
                'no_telepon_wali' => '081223344554',
                'status_binaan' => 'aktif',
                'bidang_kodes' => [
                    Bidang::PENDIDIKAN => 'Penerima beasiswa pendidikan jenjang SMA dan kelas Bahasa Inggris.',
                    Bidang::EKONOMI => 'Mengikuti pelatihan keterampilan kreatif dan penulisan konten.',
                ],
            ],
            [
                'nik' => '3273011907160005',
                'no_kk' => '3273010101100005',
                'nama_lengkap' => 'Ilham Ramadhan Putra',
                'anak_ke' => 2,
                'jenis_kelamin' => 'L',
                'status_santunan' => AnakYatim::STATUS_SANTUNAN_MENUNGGU,
                'tempat_lahir' => 'Bandung',
                'tanggal_lahir' => '2016-07-19',
                'jenjang' => 'SD',
                'kelurahan' => 'Pasir Endah',
                'alamat_detail' => 'Jl. Pasirendah RT 06 RW 03 Kec. Ujungberung',
                'nama_ibu_kandung' => 'Ibu Nenden',
                'no_telepon' => '081223344555',
                'nama_wali' => 'Ibu Nenden',
                'no_telepon_wali' => '081223344555',
                'status_binaan' => 'aktif',
                'bidang_kodes' => [
                    Bidang::PENDIDIKAN => 'Pendampingan belajar calistung lanjutan dan matematika dasar.',
                    Bidang::KEMANUSIAAN => 'Penerima paket nutrisi dan santunan bulanan.',
                ],
            ],
            [
                'nik' => '3273016509080006',
                'no_kk' => '3273010101100006',
                'nama_lengkap' => 'Salma Khairunnisa Putri',
                'anak_ke' => 1,
                'jenis_kelamin' => 'P',
                'status_santunan' => AnakYatim::STATUS_SANTUNAN_MENERIMA,
                'tempat_lahir' => 'Garut',
                'tanggal_lahir' => '2008-09-25',
                'jenjang' => 'SMA/SMK',
                'kelurahan' => 'Cigending',
                'alamat_detail' => 'Jl. Nagrog RT 05 RW 08 Kel. Cigending',
                'nama_ibu_kandung' => 'Ibu Yayah',
                'no_telepon' => '081223344556',
                'nama_wali' => 'Ibu Yayah',
                'no_telepon_wali' => '081223344556',
                'status_binaan' => 'aktif',
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
                ['nama_lengkap' => $item['nama_lengkap']],
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
