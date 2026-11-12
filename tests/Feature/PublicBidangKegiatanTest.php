<?php

use App\Models\Bidang;
use App\Models\Kegiatan;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->seed(DatabaseSeeder::class);
});

test('beranda memuat daftar bidang dan kegiatan terbaru dari database', function () {
    $response = $this->get(route('home'));

    $response->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('welcome')
            ->has('bidangList', 4)
            ->has('kegiatanTerbaru', 4)
        );
});

test('halaman daftar bidang menampilkan seluruh bidang dari database', function () {
    $response = $this->get(route('bidang'));

    $response->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('public/bidang')
            ->has('bidangList', 4)
            ->where('bidangList.0.kode', Bidang::PENDIDIKAN)
            ->where('bidangList.0.nama', 'Bidang Pendidikan')
            ->has('bidangList.0.program_kerja')
            ->has('bidangList.0.tujuan')
        );
});

test('halaman detail bidang dapat diakses menggunakan kode maupun id dari database', function () {
    $pendidikan = Bidang::where('kode', Bidang::PENDIDIKAN)->firstOrFail();
    $kemanusiaan = Bidang::where('kode', Bidang::KEMANUSIAAN)->firstOrFail();

    // Akses menggunakan kode bidang
    $this->get(route('bidang.show', $pendidikan->kode))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('public/bidang-detail')
            ->where('bidang.id', $pendidikan->id)
            ->where('bidang.kode', 'pendidikan')
            ->where('bidang.nama', 'Bidang Pendidikan')
            ->has('bidang.tujuan', 4)
            ->has('bidang.program_kerja', 4)
            ->has('kegiatanTerkait')
            ->has('bidangLainnya', 3)
        );

    // Akses menggunakan ID bidang
    $this->get(route('bidang.show', $kemanusiaan->id))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('public/bidang-detail')
            ->where('bidang.id', $kemanusiaan->id)
            ->where('bidang.kode', 'kemanusiaan')
            ->where('bidang.nama', 'Bidang Kemanusiaan & Yatim')
            ->has('bidang.tujuan', 4)
            ->has('bidang.program_kerja', 5)
            ->has('bidangLainnya', 3)
        );
});

test('halaman detail bidang mengembalikan 404 untuk identitas yang tidak valid', function () {
    $this->get('/bidang/bidang-tidak-ada')->assertNotFound();
    $this->get('/bidang/99999')->assertNotFound();
});

test('halaman daftar kegiatan menampilkan seluruh kegiatan dari database', function () {
    $totalKegiatan = Kegiatan::count();
    expect($totalKegiatan)->toBeGreaterThanOrEqual(6);

    $this->get(route('kegiatan'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('public/kegiatan')
            ->has('kegiatanList', $totalKegiatan)
        );
});

test('halaman detail berita kegiatan menampilkan data spesifik sesuai identitas kegiatan di database', function () {
    $author = User::firstOrFail();
    $bidangKeagamaan = Bidang::where('kode', Bidang::KEAGAMAAN)->firstOrFail();

    $kegiatanKhusus = Kegiatan::create([
        'judul' => 'Kajian Akbar Muharram & Santunan Yatim Ujungberung',
        'bidang_id' => $bidangKeagamaan->id,
        'kategori' => 'Keagamaan',
        'ringkasan' => 'Ringkasan peringatan tahun baru Islam bersama 420 anak yatim binaan.',
        'deskripsi' => 'Deskripsi singkat kegiatan Muharram.',
        'isi_berita' => "Paragraf pertama isi berita lengkap.\n\nParagraf kedua penjelasan detail kegiatan.",
        'lokasi' => 'Masjid Agung Ujungberung',
        'tanggal_kegiatan' => '2026-11-15',
        'gambar' => 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?q=80&w=1200&auto=format&fit=crop',
        'dokumentasi' => [
            ['url' => 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?q=80&w=800&auto=format&fit=crop', 'caption' => 'Suasana kajian akbar'],
        ],
        'created_by' => $author->id,
    ]);

    $this->get(route('kegiatan.show', $kegiatanKhusus->id))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('public/kegiatan-detail')
            ->where('kegiatan.id', $kegiatanKhusus->id)
            ->where('kegiatan.judul', 'Kajian Akbar Muharram & Santunan Yatim Ujungberung')
            ->where('kegiatan.kategori', 'Keagamaan')
            ->where('kegiatan.lokasi', 'Masjid Agung Ujungberung')
            ->where('kegiatan.tanggal_kegiatan', '15 November 2026')
            ->where('kegiatan.ringkasan', 'Ringkasan peringatan tahun baru Islam bersama 420 anak yatim binaan.')
            ->has('kegiatan.paragraf_berita', 2)
            ->has('kegiatan.dokumentasi', 1)
            ->where('kegiatan.bidang.kode', 'keagamaan')
            ->has('kegiatanLainnya')
        );

    // Kegiatan tidak ditemukan harus 404
    $this->get('/kegiatan/999999')->assertNotFound();
});

