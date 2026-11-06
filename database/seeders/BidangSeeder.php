<?php

namespace Database\Seeders;

use App\Models\Bidang;
use Illuminate\Database\Seeder;

class BidangSeeder extends Seeder
{
    /**
     * Data master bidang yayasan.
     * Kode bidang bersifat permanen dan digunakan sebagai identifier unik bisnis.
     *
     * @var array<int, array{kode: string, nama: string, deskripsi: string}>
     */
    protected array $bidangMaster = [
        [
            'kode' => Bidang::KEMANUSIAAN,
            'nama' => 'Bidang Kemanusiaan & Yatim',
            'deskripsi' => 'Pemberdayaan, perlindungan, dan penyaluran santunan anak yatim & dhuafa binaan Yayasan Geliyat.',
        ],
        [
            'kode' => Bidang::PENDIDIKAN,
            'nama' => 'Bidang Pendidikan',
            'deskripsi' => 'Bantuan beasiswa, bimbingan belajar gratis, dan fasilitas penunjang pendidikan anak binaan.',
        ],
        [
            'kode' => Bidang::KEAGAMAAN,
            'nama' => 'Bidang Keagamaan',
            'deskripsi' => 'Pembinaan keagamaan, program tahfidz Al-Quran, dan peringatan hari besar Islam yayasan.',
        ],
        [
            'kode' => Bidang::EKONOMI,
            'nama' => 'Bidang Ekonomi & Koperasi',
            'deskripsi' => 'Koperasi yayasan, pelatihan kewirausahaan, dan program pemberdayaan ekonomi keluarga binaan.',
        ],
    ];

    /**
     * Jalankan seeder master bidang secara idempoten.
     * Menggunakan updateOrCreate berdasarkan kolom 'kode' yang memiliki unique constraint.
     */
    public function run(): void
    {
        foreach ($this->bidangMaster as $bidang) {
            Bidang::updateOrCreate(
                ['kode' => $bidang['kode']],
                [
                    'nama' => $bidang['nama'],
                    'deskripsi' => $bidang['deskripsi'],
                ]
            );
        }
    }
}
