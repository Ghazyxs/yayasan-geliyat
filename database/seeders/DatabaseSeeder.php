<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     *
     * Urutan pemanggilan seeder:
     * 1. BidangSeeder — Master unit kerja (Kemanusiaan, Pendidikan, Keagamaan, Ekonomi)
     * 2. UserSeeder — Akun default Super Admin (bidang_id NULL) dan Admin (bidang_id Kemanusiaan)
     *
     * Kebijakan Data Operasional:
     * Tidak ada seeding dummy untuk tabel anak_yatim, donasi, maupun transaksi_keuangan
     * guna menjamin kebersihan database utama untuk operasional nyata.
     */
    public function run(): void
    {
        $this->call([
            BidangSeeder::class,
            UserSeeder::class,
        ]);
    }
}
