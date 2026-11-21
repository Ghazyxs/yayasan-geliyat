<?php

use App\Models\BeritaUmum;
use App\Models\Bidang;
use App\Models\Kegiatan;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->seed(DatabaseSeeder::class);
});

test('halaman berita umum menampilkan state kosong saat belum ada berita dipublikasikan', function () {
    $this->get(route('berita-umum'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('public/berita-umum')
            ->has('beritaList', 0)
        );
});

test('halaman berita umum menampilkan daftar berita yang dipublikasikan dan detail berita dapat diakses', function () {
    $user = User::first();

    $published = BeritaUmum::create([
        'judul' => 'Pengumuman Jadwal Santunan Rutin',
        'slug' => 'pengumuman-jadwal-santunan-rutin',
        'kategori' => 'Pengumuman',
        'ringkasan' => 'Informasi pelaksanaan santunan rutin bulanan Yayasan Geliyat.',
        'isi' => "Santunan rutin akan dilaksanakan di sekretariat yayasan.\n\nMohon kehadiran seluruh penerima manfaat tepat waktu.",
        'tanggal_publikasi' => '2026-11-10',
        'is_published' => true,
        'created_by' => $user?->id,
    ]);

    BeritaUmum::create([
        'judul' => 'Draft Berita Internal',
        'slug' => 'draft-berita-internal',
        'kategori' => 'Informasi',
        'isi' => 'Belum dipublikasikan.',
        'tanggal_publikasi' => '2026-11-12',
        'is_published' => false,
        'created_by' => $user?->id,
    ]);

    $this->get(route('berita-umum'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('public/berita-umum')
            ->has('beritaList', 1)
            ->where('beritaList.0.judul', $published->judul)
            ->where('beritaList.0.slug', $published->slug)
            ->where('beritaList.0.kategori', 'Pengumuman')
        );

    $this->get(route('berita-umum.show', $published->slug))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('public/berita-umum-detail')
            ->where('berita.judul', $published->judul)
            ->where('berita.isi', $published->isi)
        );

    $this->get(route('berita-umum.show', 'draft-berita-internal'))
        ->assertNotFound();
});

test('beranda menampilkan kegiatan terbaru dari database untuk banner hero', function () {
    $bidang = Bidang::where('kode', Bidang::PENDIDIKAN)->firstOrFail();
    $user = User::first();

    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('welcome')
            ->has('kegiatanTerbaru', 0)
        );

    Kegiatan::create([
        'bidang_id' => $bidang->id,
        'judul' => 'Bimbingan Belajar SINAR Pekan Ini',
        'kategori' => 'Pendidikan',
        'deskripsi' => 'Kegiatan belajar mengajar rutin untuk anak yatim tingkat SD.',
        'tanggal_kegiatan' => '2026-11-11',
        'lokasi' => 'Sekretariat Yayasan Geliyat',
        'is_published' => true,
        'created_by' => $user?->id,
    ]);

    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('welcome')
            ->has('kegiatanTerbaru', 1)
            ->where('kegiatanTerbaru.0.judul', 'Bimbingan Belajar SINAR Pekan Ini')
        );
});

