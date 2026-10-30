<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Super Admin (Ketua Yayasan)
        User::updateOrCreate(
            ['email' => 'ketua@geliyat.or.id'],
            [
                'name' => 'H. Ahmad Fauzi',
                'password' => 'password',
                'role' => 'super_admin',
                'bidang' => 'Pimpinan Yayasan',
                'phone' => '081234567890',
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );

        // Admin Operasional (Bidang Kemanusiaan & Anak Yatim)
        User::updateOrCreate(
            ['email' => 'admin@geliyat.or.id'],
            [
                'name' => 'Ibu Siti Rahmah',
                'password' => 'password',
                'role' => 'admin',
                'bidang' => 'Kemanusiaan & Yatim',
                'phone' => '081298765432',
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );
    }
}
