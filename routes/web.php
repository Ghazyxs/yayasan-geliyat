<?php

use App\Http\Controllers\Admin\AnakYatimController;
use App\Http\Controllers\Admin\DonasiController;
use App\Http\Controllers\PublicDonasiController;
use App\Models\Kegiatan;
use App\Models\User;
use Illuminate\Support\Facades\Gate;
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
Route::get('/donasi', [PublicDonasiController::class, 'index'])->name('donasi');
Route::post('/donasi', [PublicDonasiController::class, 'store'])->name('donasi.store');

// Dashboard & Protected Admin/Super Admin Routes
Route::middleware(['auth', 'role:admin,super_admin'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    // Admin & Super Admin Shared Modules
    Route::prefix('admin')->name('admin.')->group(function () {
        Route::get('anak-yatim', [AnakYatimController::class, 'index'])->name('anak-yatim');
        Route::post('anak-yatim', [AnakYatimController::class, 'store'])->name('anak-yatim.store');
        Route::get('anak-yatim/{anak_yatim}', [AnakYatimController::class, 'show'])->name('anak-yatim.show');
        Route::get('anak-yatim/{anak_yatim}/sensitive', [AnakYatimController::class, 'sensitive'])->name('anak-yatim.sensitive');
        Route::match(['put', 'patch'], 'anak-yatim/{anak_yatim}', [AnakYatimController::class, 'update'])->name('anak-yatim.update');
        Route::delete('anak-yatim/{anak_yatim}', [AnakYatimController::class, 'destroy'])->name('anak-yatim.destroy');

        Route::get('donasi', [DonasiController::class, 'index'])->name('donasi');
        Route::post('donasi', [DonasiController::class, 'store'])->name('donasi.store');
        Route::get('donasi/{donasi}', [DonasiController::class, 'show'])->name('donasi.show');
        Route::get('donasi/{donasi}/bukti-transfer', [DonasiController::class, 'buktiTransfer'])->name('donasi.bukti');
        Route::match(['post', 'patch'], 'donasi/{donasi}/verify', [DonasiController::class, 'verify'])->name('donasi.verify');
        Route::match(['post', 'patch'], 'donasi/{donasi}/reject', [DonasiController::class, 'reject'])->name('donasi.reject');
        Route::match(['post', 'patch'], 'donasi/{donasi}/cancel', [DonasiController::class, 'cancel'])->name('donasi.cancel');

        Route::inertia('kegiatan', 'admin/kegiatan/index')->name('kegiatan');
        Route::get('kegiatan/{kegiatan}', function (Kegiatan $kegiatan) {
            Gate::authorize('view', $kegiatan);

            return response()->json([
                'status' => 'success',
                'data' => $kegiatan,
            ]);
        })->name('kegiatan.show');

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
