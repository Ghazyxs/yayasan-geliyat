<?php

use App\Models\User;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes - Yayasan Geliyat
|--------------------------------------------------------------------------
*/

// Public / Company Profile Routes
Route::inertia('/', 'welcome')->name('home');
Route::inertia('/bidang', 'public/bidang')->name('bidang');
Route::inertia('/kegiatan', 'public/kegiatan')->name('kegiatan');
Route::inertia('/anak-yatim', 'public/anak-yatim')->name('anak-yatim');
Route::inertia('/profil', 'public/profil')->name('profil');
Route::inertia('/donasi', 'public/donasi')->name('donasi');

// Dashboard & Protected Admin/Super Admin Routes
Route::middleware(['auth', 'role:admin,super_admin'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    // Admin & Super Admin Shared Modules
    Route::prefix('admin')->name('admin.')->group(function () {
        Route::inertia('anak-yatim', 'admin/anak-yatim/index')->name('anak-yatim');
        Route::inertia('donasi', 'admin/donasi/index')->name('donasi');
        Route::inertia('kegiatan', 'admin/kegiatan/index')->name('kegiatan');
        Route::inertia('laporan', 'admin/laporan/index')->name('laporan');

        // Super Admin Restricted Modules
        Route::middleware(['role:super_admin'])->group(function () {
            Route::inertia('keuangan', 'admin/keuangan/index')->name('keuangan');
            Route::inertia('pengguna', 'admin/pengguna/index')->name('pengguna');
        });
    });
});

require __DIR__.'/settings.php';

// Local Development Quick Role Switcher — hanya tersedia di APP_ENV=local
if (app()->isLocal()) {
    Route::get('/switch-role/{role}', function (string $role) {
        // Whitelist peran yang diizinkan — cegah login sebagai role sembarangan
        $allowedRoles = ['super_admin', 'admin'];

        if (! in_array($role, $allowedRoles, true)) {
            abort(404);
        }

        $email = $role === 'super_admin' ? 'ketua@geliyat.or.id' : 'admin@geliyat.or.id';
        $user = User::where('email', $email)->first();

        if (! $user) {
            abort(404, 'Akun seeder belum ada. Jalankan: php artisan db:seed');
        }

        auth()->login($user);

        return redirect()->route('dashboard');
    })->name('switch-role');
}
