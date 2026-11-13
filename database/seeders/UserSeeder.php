<?php

namespace Database\Seeders;

use App\Models\Bidang;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Log;
use RuntimeException;

class UserSeeder extends Seeder
{
    /**
     * Jalankan seeder akun default pengurus yayasan.
     *
     * Aturan Keamanan:
     * 1. Akun default hanya boleh di-seed di lingkungan non-production (local / testing).
     * 2. Di production, seeder ini dilewati secara otomatis untuk mencegah pembuatan akun demo.
     * 3. Kredensial dibaca dari konfigurasi environment (SEED_SUPER_ADMIN_PASSWORD, SEED_ADMIN_PASSWORD).
     * 4. Super Admin memiliki bidang_id NULL.
     * 5. Admin memiliki bidang_id mengarah ke Bidang Kemanusiaan & Yatim.
     * 6. Idempoten: menggunakan updateOrCreate berdasarkan kolom 'email' (unique key).
     */
    public function run(): void
    {
        // Pengamanan tingkat tinggi: blokir otomatis di lingkungan production
        if (app()->isProduction() && ! (bool) env('SEED_ALLOW_PRODUCTION', false)) {
            $this->command?->warn('Melewatkan pembuatan akun default karena aplikasi berada di environment production.');
            Log::warning('UserSeeder: Upaya seeding akun default dicegah karena lingkungan berstatus production.');

            return;
        }

        // Pastikan master bidang Kemanusiaan tersedia untuk akun Admin
        $bidangKemanusiaan = Bidang::where('kode', Bidang::KEMANUSIAAN)->first();

        if (! $bidangKemanusiaan) {
            throw new RuntimeException('Bidang Kemanusiaan belum tersedia. Pastikan BidangSeeder dijalankan sebelum UserSeeder.');
        }

        // Resolusi kredensial dari environment (tanpa fallback hardcode password)
        $superAdminEmail = env('SEED_SUPER_ADMIN_EMAIL', 'ketua@geliyat.or.id');
        $superAdminPassword = env('SEED_SUPER_ADMIN_PASSWORD');

        $adminEmail = env('SEED_ADMIN_EMAIL', 'admin@geliyat.or.id');
        $adminPassword = env('SEED_ADMIN_PASSWORD');

        if (empty($superAdminPassword) || empty($adminPassword)) {
            throw new RuntimeException(
                'Password seeder belum dikonfigurasi di environment. '
                .'Harap tentukan SEED_SUPER_ADMIN_PASSWORD dan SEED_ADMIN_PASSWORD pada file .env.'
            );
        }

        // 1. Super Admin (Ketua Yayasan) — bidang_id WAJIB NULL (wewenang lintas seluruh bidang)
        User::updateOrCreate(
            ['email' => $superAdminEmail],
            [
                'name' => env('SEED_SUPER_ADMIN_NAME', 'Nina Mahdiah, S.Ag., M.Sos.'),
                'password' => $superAdminPassword,
                'role' => 'super_admin',
                'bidang_id' => null,
                'phone' => '082126854485',
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );

        // 2. Admin Operasional — bidang_id WAJIB mengarah ke Bidang Kemanusiaan
        User::updateOrCreate(
            ['email' => $adminEmail],
            [
                'name' => env('SEED_ADMIN_NAME', 'Juaningsih'),
                'password' => $adminPassword,
                'role' => 'admin',
                'bidang_id' => $bidangKemanusiaan->id,
                'phone' => '085797243161',
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );
    }
}
