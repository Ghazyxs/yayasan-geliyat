<?php

use App\Models\AnakYatim;
use App\Models\Bidang;
use App\Models\Donasi;
use App\Models\User;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->bidangKemanusiaan = Bidang::where('kode', Bidang::KEMANUSIAAN)->firstOrFail();
    $this->bidangPendidikan = Bidang::where('kode', Bidang::PENDIDIKAN)->firstOrFail();
    $this->bidangKeagamaan = Bidang::where('kode', Bidang::KEAGAMAAN)->firstOrFail();
    $this->bidangEkonomi = Bidang::where('kode', Bidang::EKONOMI)->firstOrFail();

    $this->superAdmin = User::create([
        'name' => 'Ketua Yayasan',
        'email' => 'ketua.crud@geliyat.or.id',
        'password' => 'secret123',
        'role' => 'super_admin',
        'bidang_id' => null,
        'is_active' => true,
    ]);

    $this->adminKemanusiaan = User::create([
        'name' => 'Admin Kemanusiaan',
        'email' => 'admin.kemanusiaan.crud@geliyat.or.id',
        'password' => 'secret123',
        'role' => 'admin',
        'bidang_id' => $this->bidangKemanusiaan->id,
        'is_active' => true,
    ]);

    $this->adminPendidikan = User::create([
        'name' => 'Admin Pendidikan',
        'email' => 'admin.pendidikan.crud@geliyat.or.id',
        'password' => 'secret123',
        'role' => 'admin',
        'bidang_id' => $this->bidangPendidikan->id,
        'is_active' => true,
    ]);

    $this->adminTanpaBidang = User::create([
        'name' => 'Admin Tanpa Bidang',
        'email' => 'admin.nobidang.crud@geliyat.or.id',
        'password' => 'secret123',
        'role' => 'admin',
        'bidang_id' => null,
        'is_active' => true,
    ]);
});

function payloadAnakValid(array $overrides = []): array
{
    return array_merge([
        'nik' => '3273123456780001',
        'nama_lengkap' => 'Rizky Ramadhan',
        'alias' => 'Rizky (R.R.)',
        'jenis_kelamin' => 'L',
        'tanggal_lahir' => '2014-08-17',
        'jenjang' => 'SD',
        'kelas' => 'Kelas 5 SD',
        'nama_sekolah' => 'SDN 1 Cigending',
        'kelurahan' => 'Cigending',
        'alamat_detail' => 'Jl. Cigending Raya No. 12 RT 01 RW 04',
        'nama_wali' => 'Ibu Aminah',
        'no_telepon_wali' => '081234567890',
        'hobi' => 'Sepak Bola',
        'cita_cita' => 'Dokter',
        'status_binaan' => 'aktif',
        'status_asuh' => 'belum_diasuh',
        'catatan_program' => 'Binaan santunan rutin',
    ], $overrides);
}

test('super admin can perform full crud and link orphan to multiple bidang', function () {
    // 1. CREATE dengan 2 bidang sekaligus
    $payload = payloadAnakValid([
        'bidang_ids' => [$this->bidangKemanusiaan->id, $this->bidangPendidikan->id],
    ]);

    $this->actingAs($this->superAdmin)
        ->post(route('admin.anak-yatim.store'), $payload)
        ->assertRedirect(route('admin.anak-yatim'))
        ->assertSessionHas('success');

    $anak = AnakYatim::where('nama_lengkap', 'Rizky Ramadhan')->firstOrFail();
    expect($anak->bidang()->pluck('bidang.id')->all())
        ->toEqualCanonicalizing([$this->bidangKemanusiaan->id, $this->bidangPendidikan->id]);

    // 2. INDEX menampilkan data tanpa mengekspos NIK & alamat_detail di props standar
    $this->actingAs($this->superAdmin)
        ->get(route('admin.anak-yatim'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/anak-yatim/index')
            ->has('anakYatim.data', 1)
            ->where('anakYatim.data.0.nama_lengkap', 'Rizky Ramadhan')
            ->missing('anakYatim.data.0.nik')
            ->missing('anakYatim.data.0.alamat_detail')
        );

    // 3. SHOW mengembalikan detail tanpa NIK/alamat_detail
    $showRes = $this->actingAs($this->superAdmin)
        ->getJson(route('admin.anak-yatim.show', $anak))
        ->assertOk();
    expect(array_key_exists('nik', $showRes->json('data')))->toBeFalse();
    expect(array_key_exists('alamat_detail', $showRes->json('data')))->toBeFalse();

    // 4. SENSITIVE mengembalikan NIK terdekripsi & alamat_detail untuk Super Admin
    $sensitiveRes = $this->actingAs($this->superAdmin)
        ->getJson(route('admin.anak-yatim.sensitive', $anak))
        ->assertOk();
    expect($sensitiveRes->json('data.nik'))->toBe('3273123456780001');
    expect($sensitiveRes->json('data.alamat_detail'))->toBe('Jl. Cigending Raya No. 12 RT 01 RW 04');

    // 5. UPDATE oleh Super Admin (ubah data & tambah bidang Keagamaan)
    $updatePayload = payloadAnakValid([
        'nama_lengkap' => 'Rizky Ramadhan Putra',
        'jenjang' => 'SMP',
        'kelas' => 'Kelas 7 SMP',
        'bidang_ids' => [
            $this->bidangKemanusiaan->id,
            $this->bidangPendidikan->id,
            $this->bidangKeagamaan->id,
        ],
        'update_sensitive' => false,
    ]);

    $this->actingAs($this->superAdmin)
        ->put(route('admin.anak-yatim.update', $anak), $updatePayload)
        ->assertRedirect(route('admin.anak-yatim'))
        ->assertSessionHas('success');

    $anak->refresh();
    expect($anak->nama_lengkap)->toBe('Rizky Ramadhan Putra');
    expect($anak->jenjang)->toBe('SMP');
    expect($anak->nik)->toBe('3273123456780001'); // tetap terjaga meskipun update_sensitive = false
    expect($anak->bidang()->count())->toBe(3);

    // 6. DELETE oleh Super Admin
    $this->actingAs($this->superAdmin)
        ->delete(route('admin.anak-yatim.destroy', $anak))
        ->assertRedirect(route('admin.anak-yatim'))
        ->assertSessionHas('success');

    expect(AnakYatim::find($anak->id))->toBeNull();
    expect(DB::table('anak_yatim_bidang')->where('anak_yatim_id', $anak->id)->count())->toBe(0);
});

test('admin can perform crud only within their own bidang and cannot access other bidang', function () {
    // Admin Kemanusiaan membuat data anak
    $this->actingAs($this->adminKemanusiaan)
        ->post(route('admin.anak-yatim.store'), payloadAnakValid([
            'nama_lengkap' => 'Siti Aisyah',
            'alias' => 'Aisyah',
            'jenis_kelamin' => 'P',
        ]))
        ->assertRedirect(route('admin.anak-yatim'))
        ->assertSessionHas('success');

    $anakKemanusiaan = AnakYatim::where('nama_lengkap', 'Siti Aisyah')->firstOrFail();
    expect($anakKemanusiaan->terhubungKeBidang($this->bidangKemanusiaan->id))->toBeTrue();

    // Admin Pendidikan membuat data anak di bidang Pendidikan
    $this->actingAs($this->adminPendidikan)
        ->post(route('admin.anak-yatim.store'), payloadAnakValid([
            'nama_lengkap' => 'Bima Sakti',
            'alias' => 'Bima',
        ]))
        ->assertRedirect(route('admin.anak-yatim'));

    $anakPendidikan = AnakYatim::where('nama_lengkap', 'Bima Sakti')->firstOrFail();
    expect($anakPendidikan->terhubungKeBidang($this->bidangPendidikan->id))->toBeTrue();

    // Index Admin Kemanusiaan HANYA menampilkan Siti Aisyah (bukan Bima Sakti)
    $this->actingAs($this->adminKemanusiaan)
        ->get(route('admin.anak-yatim'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('anakYatim.data', 1)
            ->where('anakYatim.data.0.nama_lengkap', 'Siti Aisyah')
        );

    // Admin Kemanusiaan DITOLAK (403) saat mencoba show, update, atau delete anak Pendidikan
    $this->actingAs($this->adminKemanusiaan)
        ->getJson(route('admin.anak-yatim.show', $anakPendidikan))
        ->assertForbidden();

    $this->actingAs($this->adminKemanusiaan)
        ->put(route('admin.anak-yatim.update', $anakPendidikan), payloadAnakValid([
            'nama_lengkap' => 'Hacked Name',
        ]))
        ->assertForbidden();

    $this->actingAs($this->adminKemanusiaan)
        ->delete(route('admin.anak-yatim.destroy', $anakPendidikan))
        ->assertForbidden();

    // Admin Kemanusiaan DITOLAK (403) bila mencoba mengaitkan anak ke bidang Pendidikan saat create
    $this->actingAs($this->adminKemanusiaan)
        ->post(route('admin.anak-yatim.store'), payloadAnakValid([
            'nama_lengkap' => 'Anak Tampered',
            'bidang_ids' => [$this->bidangPendidikan->id],
        ]))
        ->assertForbidden();

    // Admin tanpa bidang DITOLAK (403) mengakses halaman index anak yatim
    $this->actingAs($this->adminTanpaBidang)
        ->get(route('admin.anak-yatim'))
        ->assertForbidden();
});

test('multi-bidang child updated by one admin preserves other connected bidang and protects sensitive data', function () {
    $anak = AnakYatim::create(array_merge(payloadAnakValid([
        'nama_lengkap' => 'Nadia Vega',
        'alias' => 'Nadia',
        'jenis_kelamin' => 'P',
    ]), ['created_by' => $this->superAdmin->id]));

    $anak->bidang()->sync([
        $this->bidangKemanusiaan->id,
        $this->bidangPendidikan->id,
    ]);

    // Admin Pendidikan boleh mengupdate data akademik Nadia
    $this->actingAs($this->adminPendidikan)
        ->put(route('admin.anak-yatim.update', $anak), payloadAnakValid([
            'nama_lengkap' => 'Nadia Vega',
            'alias' => 'Nadia',
            'jenis_kelamin' => 'P',
            'kelas' => 'Kelas 6 SD',
            'nama_sekolah' => 'SDN Unggulan',
            'nik' => '9999999999999999', // tidak boleh mengubah NIK karena Admin Pendidikan tidak punya izin viewSensitiveData
            'update_sensitive' => true,
        ]))
        ->assertRedirect(route('admin.anak-yatim'));

    $anak->refresh();
    expect($anak->kelas)->toBe('Kelas 6 SD');
    // NIK asli tetap utuh (tidak berubah oleh Admin Pendidikan)
    expect($anak->nik)->toBe('3273123456780001');
    // Relasi ke Bidang Kemanusiaan tetap utuh (tidak terhapus)
    expect($anak->terhubungKeBidang($this->bidangKemanusiaan->id))->toBeTrue();
    expect($anak->terhubungKeBidang($this->bidangPendidikan->id))->toBeTrue();
});

test('nik is encrypted in database and validation rejects invalid input', function () {
    // 1. Uji validasi gagal (NIK bukan 16 digit, nama kosong, tanggal lahir di masa depan)
    $this->actingAs($this->superAdmin)
        ->post(route('admin.anak-yatim.store'), [
            'nik' => '12345',
            'nama_lengkap' => '',
            'alias' => '',
            'jenis_kelamin' => 'X',
            'tanggal_lahir' => now()->addDays(5)->format('Y-m-d'),
            'jenjang' => 'TK',
            'kelas' => '',
            'kelurahan' => '',
            'nama_wali' => '',
            'status_binaan' => 'aktif',
            'status_asuh' => 'belum_diasuh',
            'bidang_ids' => [],
        ])
        ->assertSessionHasErrors([
            'nik',
            'nama_lengkap',
            'alias',
            'jenis_kelamin',
            'tanggal_lahir',
            'jenjang',
            'kelas',
            'kelurahan',
            'nama_wali',
            'bidang_ids',
        ]);

    // 2. Uji penyimpanan valid & pastikan ciphertext di database
    $plainNik = '3273888899990005';
    $this->actingAs($this->superAdmin)
        ->post(route('admin.anak-yatim.store'), payloadAnakValid([
            'nik' => $plainNik,
            'nama_lengkap' => 'Farhan Maulana',
            'bidang_ids' => [$this->bidangKemanusiaan->id],
        ]))
        ->assertRedirect(route('admin.anak-yatim'));

    $anak = AnakYatim::where('nama_lengkap', 'Farhan Maulana')->firstOrFail();
    $rawRow = DB::table('anak_yatim')->where('id', $anak->id)->first();

    expect($rawRow->nik)->not->toBe($plainNik);
    expect(Crypt::decryptString($rawRow->nik))->toBe($plainNik);
    expect($anak->nik)->toBe($plainNik);
});

test('search, filters, and pagination work accurately from backend', function () {
    for ($i = 1; $i <= 12; $i++) {
        $anak = AnakYatim::create(array_merge(payloadAnakValid([
            'nama_lengkap' => sprintf('Anak Binaan %02d', $i),
            'alias' => sprintf('AB-%02d', $i),
            'jenjang' => $i <= 8 ? 'SD' : 'SMP',
            'kelurahan' => $i % 2 === 0 ? 'Cigending' : 'Pasirwangi',
            'status_asuh' => $i <= 4 ? 'aktif_diasuh' : 'belum_diasuh',
        ]), ['created_by' => $this->superAdmin->id]));

        $anak->bidang()->attach($this->bidangKemanusiaan->id);
    }

    // Halaman 1 berisi 10 data, total 12 data
    $this->actingAs($this->adminKemanusiaan)
        ->get(route('admin.anak-yatim'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('anakYatim.data', 10)
            ->where('anakYatim.total', 12)
            ->where('stats.total', 12)
            ->where('stats.aktif_diasuh', 4)
            ->where('stats.belum_diasuh', 8)
        );

    // Filter jenjang SMP -> 4 data
    $this->actingAs($this->adminKemanusiaan)
        ->get(route('admin.anak-yatim', ['jenjang' => 'SMP']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('anakYatim.data', 4)
            ->where('anakYatim.total', 4)
        );

    // Search spesifik "Anak Binaan 11" -> 1 data
    $this->actingAs($this->adminKemanusiaan)
        ->get(route('admin.anak-yatim', ['search' => 'Anak Binaan 11']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('anakYatim.data', 1)
            ->where('anakYatim.data.0.nama_lengkap', 'Anak Binaan 11')
        );
});

test('deletion is blocked when child has donation history to preserve financial audit trail', function () {
    $anak = AnakYatim::create(array_merge(payloadAnakValid([
        'nama_lengkap' => 'Zaidan Alfarizi',
        'alias' => 'Zaidan',
    ]), ['created_by' => $this->superAdmin->id]));
    $anak->bidang()->attach($this->bidangKemanusiaan->id);

    Donasi::create([
        'kode_donasi' => 'DON-AUDIT-001',
        'nama_donatur' => 'Donatur Tetap',
        'no_whatsapp' => '081234567890',
        'jenis_donasi' => Donasi::JENIS_ORANG_TUA_ASUH,
        'anak_yatim_id' => $anak->id,
        'rekening_tujuan' => 'BSI - 1234567890',
        'nominal' => 500000,
        'status_verifikasi' => Donasi::STATUS_TERVERIFIKASI,
    ]);

    // Upaya hapus ditolak dengan pesan error dan record anak + donasi tetap ada di database
    $this->actingAs($this->superAdmin)
        ->from(route('admin.anak-yatim'))
        ->delete(route('admin.anak-yatim.destroy', $anak))
        ->assertRedirect(route('admin.anak-yatim'))
        ->assertSessionHas('error');

    expect(AnakYatim::find($anak->id))->not->toBeNull();
    expect(Donasi::where('anak_yatim_id', $anak->id)->count())->toBe(1);
});
