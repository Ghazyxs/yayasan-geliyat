<?php

use App\Models\Bidang;
use App\Models\Kegiatan;
use App\Models\LaporanTahunan;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->bidangKemanusiaan = Bidang::firstOrCreate(
        ['kode' => Bidang::KEMANUSIAAN],
        ['nama' => 'Bidang Kemanusiaan', 'deskripsi' => 'Fokus kemanusiaan']
    );

    $this->superAdmin = User::firstOrCreate(
        ['email' => 'superadmin.laporan@geliyat.or.id'],
        [
            'name' => 'Super Admin Laporan',
            'password' => 'secret123',
            'role' => 'super_admin',
            'is_active' => true,
        ]
    );

    $this->adminKemanusiaan = User::firstOrCreate(
        ['email' => 'admin.laporan@geliyat.or.id'],
        [
            'name' => 'Admin Kemanusiaan Laporan',
            'password' => 'secret123',
            'role' => 'admin',
            'bidang_id' => $this->bidangKemanusiaan->id,
            'is_active' => true,
        ]
    );
});

test('public visitor can view annual report archive page', function () {
    $response = $this->get('/laporan-tahunan');

    $response->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('public/laporan-tahunan')
            ->has('selectedYear')
            ->has('availableYears')
            ->has('laporanList')
        );
});

test('legacy rekap-kegiatan routes redirect to laporan-tahunan', function () {
    $this->get('/rekap-kegiatan')->assertRedirect('/laporan-tahunan');
    $this->get('/rekap-kegiatan-tahunan')->assertRedirect('/laporan-tahunan');
});

test('public visitor can preview and download official annual report PDF', function () {
    $tahun = (int) date('Y');

    Kegiatan::create([
        'judul' => 'Santunan Akbar Tahunan Test',
        'bidang_id' => $this->bidangKemanusiaan->id,
        'kategori' => 'Kemanusiaan',
        'ringkasan' => 'Santunan paket sembako untuk yatim dhuafa.',
        'deskripsi' => 'Deskripsi lengkap pelaksanaan kegiatan santunan akbar yayasan geliyat.',
        'lokasi' => 'Bandung Timur',
        'tanggal_kegiatan' => "{$tahun}-04-10",
        'created_by' => $this->superAdmin->id,
    ]);

    // Preview inline (Stream)
    $preview = $this->get("/laporan-tahunan/{$tahun}/preview");
    $preview->assertOk();
    $preview->assertHeader('content-type', 'application/pdf');

    // Download attachment
    $download = $this->get("/laporan-tahunan/{$tahun}/download");
    $download->assertOk();
    $download->assertHeader('content-type', 'application/pdf');
    expect($download->headers->get('content-disposition'))->toContain('attachment');
});

test('admin can access laporan tahunan management page', function () {
    $this->actingAs($this->superAdmin)
        ->get('/admin/laporan')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/laporan/index')
            ->has('laporanList')
        );
});

test('admin can update annual report metadata and narrative', function () {
    $tahun = (int) date('Y');

    $response = $this->actingAs($this->superAdmin)
        ->put("/admin/laporan/{$tahun}", [
            'judul' => "Laporan Pertanggungjawaban Tahunan Yayasan Geliyat {$tahun}",
            'nomor_dokumen' => "01/LPJ-YG/{$tahun}",
            'tanggal_penerbitan' => "{$tahun}-12-31",
            'latar_belakang' => 'Latar belakang resmi tahunan yayasan.',
            'tujuan_laporan' => 'Tujuan akuntabilitas publik yayasan.',
            'kesimpulan' => 'Kesimpulan program berjalan lancar.',
            'harapan_evaluasi' => 'Harapan untuk memperluas cakupan binaan.',
            'penandatangan_ketua' => 'H. Ahmad Fauzi (Ketua)',
            'penandatangan_sekretaris' => 'M. Ridwan, S.Pd. (Sekretaris)',
            'is_published' => true,
        ]);

    $response->assertRedirect();
    $response->assertSessionHas('success');

    $report = LaporanTahunan::where('tahun', $tahun)->first();
    expect($report)->not->toBeNull();
    expect($report->nomor_dokumen)->toBe("01/LPJ-YG/{$tahun}");
    expect($report->penandatangan_ketua)->toBe('H. Ahmad Fauzi (Ketua)');
});
