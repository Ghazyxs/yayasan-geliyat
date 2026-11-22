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
        if (app()->isProduction() && ! (bool) config('seed.allow_production', false)) {
            $this->command?->warn('Melewatkan pembuatan akun default karena aplikasi berada di environment production.');
            Log::warning('UserSeeder: Upaya seeding akun default dicegah karena lingkungan berstatus production.');

            return;
        }

        // Pastikan master bidang Kemanusiaan tersedia untuk akun Admin
        $bidangKemanusiaan = Bidang::where('kode', Bidang::KEMANUSIAAN)->first();

        if (! $bidangKemanusiaan) {
            throw new RuntimeException('Bidang Kemanusiaan belum tersedia. Pastikan BidangSeeder dijalankan sebelum UserSeeder.');
        }

        // Resolusi kredensial dari konfigurasi (tanpa fallback hardcode password)
        $superAdminEmail = (string) config('seed.super_admin.email', 'ketua@geliyat.or.id');
        $superAdminPassword = config('seed.super_admin.password');

        $adminEmail = (string) config('seed.admin.email', 'admin@geliyat.or.id');
        $adminPassword = config('seed.admin.password');

        if (empty($superAdminPassword) || empty($adminPassword)) {
            throw new RuntimeException(
                'Password seeder belum dikonfigurasi di environment. '
                .'Harap tentukan SEED_SUPER_ADMIN_PASSWORD dan SEED_ADMIN_PASSWORD pada file .env.'
            );
        }

        // 1. Super Admin (Ketua Yayasan) — bidang_id WAJIB NULL (wewenang lintas seluruh bidang)
        // Tidak menimpa password/akun yang sudah tersedia di database
        $superAdmin = User::where('email', $superAdminEmail)->first();

        if (! $superAdmin) {
            User::create([
                'name' => (string) config('seed.super_admin.name', 'Nina Mahdiah, S.Ag., M.Sos.'),
                'email' => $superAdminEmail,
                'password' => $superAdminPassword,
                'role' => 'super_admin',
                'bidang_id' => null,
                'phone' => '082126854485',
                'is_active' => true,
                'email_verified_at' => now(),
            ]);
        } else {
            $superAdminUpdates = [];

            if ($superAdmin->role !== 'super_admin') {
                $superAdminUpdates['role'] = 'super_admin';
            }
            if ($superAdmin->bidang_id !== null) {
                $superAdminUpdates['bidang_id'] = null;
            }
            if ($superAdmin->name === 'H. Ahmad Fauzi') {
                $superAdminUpdates['name'] = (string) config('seed.super_admin.name', 'Nina Mahdiah, S.Ag., M.Sos.');
                $superAdminUpdates['phone'] = '082126854485';
            }

            if (! empty($superAdminUpdates)) {
                $superAdmin->update($superAdminUpdates);
            }
        }

        // 2. Admin Operasional — bidang_id WAJIB mengarah ke Bidang Kemanusiaan
        // Tidak menimpa password/akun yang sudah tersedia di database
        $admin = User::where('email', $adminEmail)->first();

        if (! $admin) {
            User::create([
                'name' => (string) config('seed.admin.name', 'Juaningsih'),
                'email' => $adminEmail,
                'password' => $adminPassword,
                'role' => 'admin',
                'bidang_id' => $bidangKemanusiaan->id,
                'phone' => '085797243161',
                'is_active' => true,
                'email_verified_at' => now(),
            ]);
        } else {
            $adminUpdates = [];

            if ($admin->role !== 'admin') {
                $adminUpdates['role'] = 'admin';
            }
            if ($admin->bidang_id !== $bidangKemanusiaan->id) {
                $adminUpdates['bidang_id'] = $bidangKemanusiaan->id;
            }
            if ($admin->name === 'Ibu Siti Rahmah') {
                $adminUpdates['name'] = (string) config('seed.admin.name', 'Juaningsih');
                $adminUpdates['phone'] = '085797243161';
            }

            if (! empty($adminUpdates)) {
                $admin->update($adminUpdates);
            }
        }
    }
}
