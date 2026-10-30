<?php

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
Route::middleware(['auth'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

require __DIR__.'/settings.php';

