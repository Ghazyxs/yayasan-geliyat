<?php

use App\Models\BeritaUmum;
use App\Models\Bidang;
use App\Models\Kegiatan;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

function buatGambarKegiatanTest(string $filename = 'kegiatan.jpg'): UploadedFile
{
    $jpegBytes = "\xFF\xD8\xFF\xE0\x00\x10JFIF\x00\x01\x01\x01\x00\x60\x00\x60\x00\x00\xFF\xDB\x00\x43\x00"
        .str_repeat("\x08", 64)
        ."\xFF\xC0\x00\x0B\x08\x00\x01\x00\x01\x01\x01\x11\x00\xFF\xDA\x00\x08\x01\x01\x00\x00\x3F\x00\xD2\xCF\x20\xFF\xD9";

    return UploadedFile::fake()->createWithContent($filename, $jpegBytes);
}

beforeEach(function () {
    Storage::fake('public');
    $this->seed(DatabaseSeeder::class);

    $this->bidangKemanusiaan = Bidang::where('kode', Bidang::KEMANUSIAAN)->firstOrFail();
    $this->bidangPendidikan = Bidang::where('kode', Bidang::PENDIDIKAN)->firstOrFail();

    $this->superAdmin = User::create([
        'name' => 'Ketua Yayasan',
        'email' => 'ketua.kegiatan@geliyat.or.id',
        'password' => 'secret123',
        'role' => 'super_admin',
        'bidang_id' => null,
        'is_active' => true,
    ]);

    $this->adminPendidikan = User::create([
        'name' => 'Admin Pendidikan',
        'email' => 'admin.pendidikan.kegiatan@geliyat.or.id',
        'password' => 'secret123',
        'role' => 'admin',
        'bidang_id' => $this->bidangPendidikan->id,
        'is_active' => true,
    ]);

    $this->adminTanpaBidang = User::create([
        'name' => 'Admin Tanpa Bidang',
        'email' => 'admin.nobidang.kegiatan@geliyat.or.id',
        'password' => 'secret123',
        'role' => 'admin',
        'bidang_id' => null,
        'is_active' => true,
    ]);
});

test('super admin can crud berita kegiatan with main image and gallery and auto sync to homepage and annual report', function () {
    // 1. CREATE Berita Kegiatan lengkap dengan gambar utama + 2 foto dokumentasi
    $this->actingAs($this->superAdmin)
        ->post(route('admin.kegiatan.store'), [
            'jenis_konten' => 'berita_kegiatan',
            'judul' => 'Wisuda Tahfidz & Santunan Akbar Geliyat 2026',
            'bidang_id' => $this->bidangKemanusiaan->id,
            'tanggal_kegiatan' => '2026-11-20',
            'lokasi' => 'Masjid Agung Ujungberung',
            'isi_berita' => "Paragraf pertama pelaksanaan wisuda tahfidz.\n\nParagraf kedua penyerahan santunan kepada anak binaan.",
            'gambar' => buatGambarKegiatanTest('utama.jpg'),
            'dokumentasi_files' => [
                buatGambarKegiatanTest('dok1.jpg'),
                buatGambarKegiatanTest('dok2.jpg'),
            ],
            'dokumentasi_captions' => [
                'Pembukaan acara bersama tokoh masyarakat',
                'Penyerahan bingkisan pendidikan anak binaan',
            ],
        ])
        ->assertRedirect(route('admin.kegiatan'))
        ->assertSessionHas('success');

    $kegiatan = Kegiatan::where('judul', 'Wisuda Tahfidz & Santunan Akbar Geliyat 2026')->firstOrFail();
    expect($kegiatan->kategori)->toBe('Kemanusiaan');
    expect($kegiatan->gambar)->toStartWith('/storage/kegiatan/utama/');
    expect($kegiatan->dokumentasi)->toHaveCount(2);

    Storage::disk('public')->assertExists(str_replace('/storage/', '', $kegiatan->gambar));
    Storage::disk('public')->assertExists(str_replace('/storage/', '', $kegiatan->dokumentasi[0]['url']));
    Storage::disk('public')->assertExists(str_replace('/storage/', '', $kegiatan->dokumentasi[1]['url']));

    // 2. INDEX & STATS + SEARCH
    $this->actingAs($this->superAdmin)
        ->get(route('admin.kegiatan', ['search' => 'Wisuda Tahfidz']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/kegiatan/index')
            ->has('items.data', 1)
            ->where('items.data.0.jenis_konten', 'berita_kegiatan')
            ->where('items.data.0.lokasi', 'Masjid Agung Ujungberung')
        );

    // 3. TERHUBUNG OTOMATIS KE BERANDA, HALAMAN KEGIATAN, DETAIL KEGIATAN, & REKAP TAHUNAN
    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('kegiatanTerbaru.0.judul', 'Wisuda Tahfidz & Santunan Akbar Geliyat 2026')
        );

    $this->get(route('kegiatan.show', $kegiatan->id))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('kegiatan.judul', 'Wisuda Tahfidz & Santunan Akbar Geliyat 2026')
            ->has('kegiatan.dokumentasi', 2)
            ->has('kegiatan.paragraf_berita', 2)
        );

    $this->get(route('laporan-tahunan', ['tahun' => 2026]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('laporanList.0.tahun', 2026)
            ->where('laporanList.0.jumlah_kegiatan', fn ($count) => (int) $count >= 1)
        );

    // 4. UPDATE (ganti gambar utama, pertahankan foto galeri pertama, tambah foto ketiga)
    $oldUtama = str_replace('/storage/', '', $kegiatan->gambar);
    $removedDoc = str_replace('/storage/', '', $kegiatan->dokumentasi[1]['url']);

    $this->actingAs($this->superAdmin)
        ->put(route('admin.kegiatan.update', $kegiatan->id), [
            'jenis_konten' => 'berita_kegiatan',
            'judul' => 'Wisuda Tahfidz Akbar 2026 (Updated)',
            'bidang_id' => $this->bidangPendidikan->id,
            'tanggal_kegiatan' => '2026-11-21',
            'lokasi' => 'Aula Yayasan Geliyat',
            'isi_berita' => 'Konten kegiatan yang telah diperbarui.',
            'gambar' => buatGambarKegiatanTest('utama-baru.jpg'),
            'retained_dokumentasi' => json_encode([$kegiatan->dokumentasi[0]]),
            'dokumentasi_files' => [buatGambarKegiatanTest('dok3.jpg')],
            'dokumentasi_captions' => ['Sesi foto bersama'],
        ])
        ->assertRedirect(route('admin.kegiatan'))
        ->assertSessionHas('success');

    $kegiatan->refresh();
    expect($kegiatan->judul)->toBe('Wisuda Tahfidz Akbar 2026 (Updated)');
    expect($kegiatan->kategori)->toBe('Pendidikan');
    expect($kegiatan->dokumentasi)->toHaveCount(2);
    Storage::disk('public')->assertMissing($oldUtama);
    Storage::disk('public')->assertMissing($removedDoc);

    // 5. DELETE membersihkan database & file gambar lokal
    $currentUtama = str_replace('/storage/', '', $kegiatan->gambar);
    $this->actingAs($this->superAdmin)
        ->delete(route('admin.kegiatan.destroy', $kegiatan->id))
        ->assertRedirect(route('admin.kegiatan'))
        ->assertSessionHas('success');

    expect(Kegiatan::find($kegiatan->id))->toBeNull();
    Storage::disk('public')->assertMissing($currentUtama);
});

test('admin can crud berita umum and publish automatically to public berita umum pages', function () {
    // 1. CREATE Berita Umum
    $this->actingAs($this->adminPendidikan)
        ->post(route('admin.kegiatan.store'), [
            'jenis_konten' => 'berita_umum',
            'judul' => 'Pembukaan Pendaftaran Relawan Mengajar Geliyat',
            'isi' => 'Yayasan Geliyat membuka kesempatan bagi mahasiswa dan relawan untuk mendampingi belajar adik binaan.',
            'gambar' => buatGambarKegiatanTest('poster-relawan.jpg'),
        ])
        ->assertRedirect(route('admin.kegiatan'))
        ->assertSessionHas('success');

    $berita = BeritaUmum::where('judul', 'Pembukaan Pendaftaran Relawan Mengajar Geliyat')->firstOrFail();
    expect($berita->slug)->toBe('pembukaan-pendaftaran-relawan-mengajar-geliyat');
    expect($berita->is_published)->toBeTrue();
    Storage::disk('public')->assertExists($berita->gambar);

    // Otomatis tampil di /berita-umum dan /berita-umum/{slug}
    $this->get(route('berita-umum'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('beritaList', 1)
            ->where('beritaList.0.judul', $berita->judul)
        );

    $this->get(route('berita-umum.show', $berita->slug))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('berita.judul', $berita->judul)
            ->where('berita.isi', $berita->isi)
        );

    // Filter jenis=berita_umum di dashboard admin
    $this->actingAs($this->adminPendidikan)
        ->get(route('admin.kegiatan', ['jenis' => 'berita_umum']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('items.data', 1)
            ->where('items.data.0.jenis_konten', 'berita_umum')
        );

    // UPDATE Berita Umum
    $this->actingAs($this->adminPendidikan)
        ->put(route('admin.berita-umum.update', $berita->id), [
            'jenis_konten' => 'berita_umum',
            'judul' => 'Pembukaan Pendaftaran Relawan Batch 2',
            'isi' => 'Pendaftaran relawan batch kedua telah dibuka hingga akhir bulan.',
        ])
        ->assertRedirect(route('admin.kegiatan'))
        ->assertSessionHas('success');

    expect($berita->fresh()->judul)->toBe('Pembukaan Pendaftaran Relawan Batch 2');

    // DELETE Berita Umum
    $oldImg = $berita->gambar;
    $this->actingAs($this->adminPendidikan)
        ->delete(route('admin.berita-umum.destroy', $berita->id))
        ->assertRedirect(route('admin.kegiatan'))
        ->assertSessionHas('success');

    expect(BeritaUmum::find($berita->id))->toBeNull();
    Storage::disk('public')->assertMissing($oldImg);
});

test('authorization and validation enforce bidang scoping and required fields on kegiatan module', function () {
    $kegiatanKemanusiaan = Kegiatan::create([
        'judul' => 'Santunan Yatim Kemanusiaan',
        'bidang_id' => $this->bidangKemanusiaan->id,
        'kategori' => 'Kemanusiaan',
        'deskripsi' => 'Penyaluran santunan bulanan.',
        'lokasi' => 'Ujungberung',
        'tanggal_kegiatan' => '2026-11-10',
        'created_by' => $this->superAdmin->id,
    ]);

    // Admin Pendidikan ditolak mengedit/menghapus kegiatan Bidang Kemanusiaan
    $this->actingAs($this->adminPendidikan)
        ->put(route('admin.kegiatan.update', $kegiatanKemanusiaan->id), [
            'jenis_konten' => 'berita_kegiatan',
            'judul' => 'Tampering',
            'tanggal_kegiatan' => '2026-11-10',
            'lokasi' => 'Bandung',
            'isi_berita' => 'Coba ubah lintas bidang',
        ])
        ->assertForbidden();

    $this->actingAs($this->adminPendidikan)
        ->delete(route('admin.kegiatan.destroy', $kegiatanKemanusiaan->id))
        ->assertForbidden();

    // Admin tanpa bidang ditolak total
    $this->actingAs($this->adminTanpaBidang)
        ->get(route('admin.kegiatan'))
        ->assertForbidden();

    // Validasi input kosong ditolak
    $this->actingAs($this->superAdmin)
        ->post(route('admin.kegiatan.store'), [
            'jenis_konten' => 'berita_kegiatan',
            'judul' => '',
            'bidang_id' => '',
            'tanggal_kegiatan' => '',
            'lokasi' => '',
            'isi_berita' => '',
        ])
        ->assertSessionHasErrors([
            'judul',
            'bidang_id',
            'tanggal_kegiatan',
            'lokasi',
            'isi_berita',
        ]);
});
