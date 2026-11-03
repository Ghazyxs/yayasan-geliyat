<?php

use App\Models\AnakYatim;
use App\Models\Bidang;
use App\Models\Donasi;
use App\Models\Kegiatan;
use App\Models\TransaksiKeuangan;
use App\Models\User;
use Illuminate\Support\Facades\Gate;

function buatAnakTest(array $attributes = []): AnakYatim
{
    return AnakYatim::create(array_merge([
        'nama_lengkap' => 'Anak Test',
        'alias' => 'Test',
        'jenis_kelamin' => 'L',
        'tanggal_lahir' => '2015-05-10',
        'jenjang' => 'SD',
        'kelas' => '4 SD',
        'kelurahan' => 'Kutoanyar',
        'nama_wali' => 'Ibu Fulanah',
        'status_binaan' => 'aktif',
        'status_asuh' => AnakYatim::STATUS_ASUH_BELUM,
    ], $attributes));
}

function buatKegiatanTest(array $attributes = []): Kegiatan
{
    return Kegiatan::create(array_merge([
        'judul' => 'Kegiatan Test',
        'kategori' => 'Kemanusiaan',
        'deskripsi' => 'Deskripsi kegiatan operasional yayasan',
        'lokasi' => 'Tulungagung',
        'tanggal_kegiatan' => '2026-11-10',
    ], $attributes));
}

function buatDonasiTest(array $attributes = []): Donasi
{
    return Donasi::create(array_merge([
        'kode_donasi' => 'DON-' . uniqid(),
        'nama_donatur' => 'Hamba Allah',
        'no_whatsapp' => '081234567890',
        'jenis_donasi' => 'Donasi Umum',
        'rekening_tujuan' => 'BSI - 1234567890',
        'nominal' => 500000,
        'status_verifikasi' => Donasi::STATUS_MENUNGGU,
    ], $attributes));
}

beforeEach(function () {
    $this->bidangKemanusiaan = Bidang::where('kode', Bidang::KEMANUSIAAN)->firstOrFail();
    $this->bidangPendidikan = Bidang::where('kode', Bidang::PENDIDIKAN)->firstOrFail();
    $this->bidangEkonomi = Bidang::where('kode', Bidang::EKONOMI)->firstOrFail();

    $this->superAdmin = User::create([
        'name' => 'Ketua Yayasan',
        'email' => 'ketua.auth@geliyat.or.id',
        'password' => 'secret123',
        'role' => 'super_admin',
        'bidang_id' => null,
        'is_active' => true,
    ]);

    $this->adminKemanusiaan = User::create([
        'name' => 'Admin Kemanusiaan',
        'email' => 'admin.kemanusiaan@geliyat.or.id',
        'password' => 'secret123',
        'role' => 'admin',
        'bidang_id' => $this->bidangKemanusiaan->id,
        'is_active' => true,
    ]);

    $this->adminPendidikan = User::create([
        'name' => 'Admin Pendidikan',
        'email' => 'admin.pendidikan@geliyat.or.id',
        'password' => 'secret123',
        'role' => 'admin',
        'bidang_id' => $this->bidangPendidikan->id,
        'is_active' => true,
    ]);

    $this->adminTanpaBidang = User::create([
        'name' => 'Admin Tanpa Bidang',
        'email' => 'admin.nobidang@geliyat.or.id',
        'password' => 'secret123',
        'role' => 'admin',
        'bidang_id' => null,
        'is_active' => true,
    ]);

    $this->userNonAktif = User::create([
        'name' => 'User Non Aktif',
        'email' => 'inactive@geliyat.or.id',
        'password' => 'secret123',
        'role' => 'admin',
        'bidang_id' => $this->bidangKemanusiaan->id,
        'is_active' => false,
    ]);
});

test('super admin has universal authorization across all models and all bidang', function () {
    $anak = buatAnakTest([
        'nama_lengkap' => 'Ahmad Fulan',
        'alias' => 'Ahmad',
        'created_by' => $this->superAdmin->id,
    ]);
    $anak->bidang()->attach($this->bidangPendidikan->id);

    $kegiatan = buatKegiatanTest([
        'judul' => 'Pelatihan Koperasi',
        'bidang_id' => $this->bidangEkonomi->id,
        'kategori' => 'Ekonomi',
        'created_by' => $this->superAdmin->id,
    ]);

    $donasi = buatDonasiTest([
        'kode_donasi' => 'DON-AUTH-001',
        'nama_donatur' => 'Hamba Allah',
        'jenis_donasi' => 'Donasi Umum',
        'nominal' => 500000,
        'status_verifikasi' => Donasi::STATUS_MENUNGGU,
    ]);

    $transaksi = TransaksiKeuangan::create([
        'kode_transaksi' => 'TRX-AUTH-001',
        'tipe' => TransaksiKeuangan::TIPE_PEMASUKAN,
        'kategori' => 'Donasi Umum',
        'nominal' => 500000,
        'tanggal_transaksi' => now(),
        'status_transaksi' => TransaksiKeuangan::STATUS_VALID,
        'keterangan' => 'Donasi kas',
        'created_by' => $this->superAdmin->id,
    ]);

    // AnakYatim policy checks
    expect(Gate::forUser($this->superAdmin)->allows('viewAny', AnakYatim::class))->toBeTrue();
    expect(Gate::forUser($this->superAdmin)->allows('view', $anak))->toBeTrue();
    expect(Gate::forUser($this->superAdmin)->allows('create', AnakYatim::class))->toBeTrue();
    expect(Gate::forUser($this->superAdmin)->allows('update', $anak))->toBeTrue();
    expect(Gate::forUser($this->superAdmin)->allows('delete', $anak))->toBeTrue();
    expect(Gate::forUser($this->superAdmin)->allows('viewSensitiveData', $anak))->toBeTrue();
    expect(Gate::forUser($this->superAdmin)->allows('attachBidang', [$anak, $this->bidangKemanusiaan->id]))->toBeTrue();
    expect(Gate::forUser($this->superAdmin)->allows('detachBidang', [$anak, $this->bidangPendidikan->id]))->toBeTrue();

    // Kegiatan policy checks
    expect(Gate::forUser($this->superAdmin)->allows('viewAny', Kegiatan::class))->toBeTrue();
    expect(Gate::forUser($this->superAdmin)->allows('view', $kegiatan))->toBeTrue();
    expect(Gate::forUser($this->superAdmin)->allows('create', Kegiatan::class))->toBeTrue();
    expect(Gate::forUser($this->superAdmin)->allows('update', $kegiatan))->toBeTrue();
    expect(Gate::forUser($this->superAdmin)->allows('delete', $kegiatan))->toBeTrue();

    // Donasi policy checks
    expect(Gate::forUser($this->superAdmin)->allows('viewAny', Donasi::class))->toBeTrue();
    expect(Gate::forUser($this->superAdmin)->allows('view', $donasi))->toBeTrue();
    expect(Gate::forUser($this->superAdmin)->allows('verify', $donasi))->toBeTrue();
    expect(Gate::forUser($this->superAdmin)->allows('reject', $donasi))->toBeTrue();
    expect(Gate::forUser($this->superAdmin)->allows('cancel', $donasi))->toBeTrue();

    // TransaksiKeuangan policy checks
    expect(Gate::forUser($this->superAdmin)->allows('viewAny', TransaksiKeuangan::class))->toBeTrue();
    expect(Gate::forUser($this->superAdmin)->allows('view', $transaksi))->toBeTrue();
    expect(Gate::forUser($this->superAdmin)->allows('void', $transaksi))->toBeTrue();
});

test('admin without bidang_id is strictly denied from accessing anak yatim data', function () {
    $anak = buatAnakTest([
        'nama_lengkap' => 'Budi Santoso',
        'alias' => 'Budi',
        'created_by' => $this->superAdmin->id,
    ]);
    $anak->bidang()->attach($this->bidangKemanusiaan->id);

    // Policy gates must all deny
    expect(Gate::forUser($this->adminTanpaBidang)->denies('viewAny', AnakYatim::class))->toBeTrue();
    expect(Gate::forUser($this->adminTanpaBidang)->denies('view', $anak))->toBeTrue();
    expect(Gate::forUser($this->adminTanpaBidang)->denies('create', AnakYatim::class))->toBeTrue();
    expect(Gate::forUser($this->adminTanpaBidang)->denies('update', $anak))->toBeTrue();
    expect(Gate::forUser($this->adminTanpaBidang)->denies('delete', $anak))->toBeTrue();
    expect(Gate::forUser($this->adminTanpaBidang)->denies('viewSensitiveData', $anak))->toBeTrue();

    // Model scope visibleTo must return 0 records
    $visibleCount = AnakYatim::visibleTo($this->adminTanpaBidang)->count();
    expect($visibleCount)->toBe(0);

    // HTTP Route Model access must return 403 Forbidden
    $this->actingAs($this->adminTanpaBidang)
        ->getJson("/admin/anak-yatim/{$anak->id}")
        ->assertForbidden();
});

test('admin can only view and manage anak yatim connected to their specific bidang', function () {
    $anakKemanusiaan = buatAnakTest([
        'nama_lengkap' => 'Citra Lestari',
        'alias' => 'Citra',
        'jenis_kelamin' => 'P',
        'kelurahan' => 'Bungur',
        'created_by' => $this->adminKemanusiaan->id,
    ]);
    $anakKemanusiaan->bidang()->attach($this->bidangKemanusiaan->id);

    $anakPendidikan = buatAnakTest([
        'nama_lengkap' => 'Doni Prasetyo',
        'alias' => 'Doni',
        'jenis_kelamin' => 'L',
        'jenjang' => 'SMA',
        'kelas' => '10 SMA',
        'kelurahan' => 'Kutoanyar',
        'created_by' => $this->adminPendidikan->id,
    ]);
    $anakPendidikan->bidang()->attach($this->bidangPendidikan->id);

    // Admin Kemanusiaan: Allowed for Citra, Denied for Doni
    expect(Gate::forUser($this->adminKemanusiaan)->allows('view', $anakKemanusiaan))->toBeTrue();
    expect(Gate::forUser($this->adminKemanusiaan)->allows('update', $anakKemanusiaan))->toBeTrue();
    expect(Gate::forUser($this->adminKemanusiaan)->allows('delete', $anakKemanusiaan))->toBeTrue();

    expect(Gate::forUser($this->adminKemanusiaan)->denies('view', $anakPendidikan))->toBeTrue();
    expect(Gate::forUser($this->adminKemanusiaan)->denies('update', $anakPendidikan))->toBeTrue();
    expect(Gate::forUser($this->adminKemanusiaan)->denies('delete', $anakPendidikan))->toBeTrue();

    // Admin Pendidikan: Allowed for Doni, Denied for Citra
    expect(Gate::forUser($this->adminPendidikan)->allows('view', $anakPendidikan))->toBeTrue();
    expect(Gate::forUser($this->adminPendidikan)->allows('update', $anakPendidikan))->toBeTrue();
    expect(Gate::forUser($this->adminPendidikan)->allows('delete', $anakPendidikan))->toBeTrue();

    expect(Gate::forUser($this->adminPendidikan)->denies('view', $anakKemanusiaan))->toBeTrue();
    expect(Gate::forUser($this->adminPendidikan)->denies('update', $anakKemanusiaan))->toBeTrue();
    expect(Gate::forUser($this->adminPendidikan)->denies('delete', $anakKemanusiaan))->toBeTrue();

    // Scope check: Admin only sees children from their own bidang
    $kemanusiaanIds = AnakYatim::visibleTo($this->adminKemanusiaan)->pluck('id')->all();
    expect($kemanusiaanIds)->toContain($anakKemanusiaan->id);
    expect($kemanusiaanIds)->not->toContain($anakPendidikan->id);

    $pendidikanIds = AnakYatim::visibleTo($this->adminPendidikan)->pluck('id')->all();
    expect($pendidikanIds)->toContain($anakPendidikan->id);
    expect($pendidikanIds)->not->toContain($anakKemanusiaan->id);

    // Super Admin sees all
    $superAdminIds = AnakYatim::visibleTo($this->superAdmin)->pluck('id')->all();
    expect($superAdminIds)->toContain($anakKemanusiaan->id);
    expect($superAdminIds)->toContain($anakPendidikan->id);
});

test('url and id parameter tampering by admin to access other bidang orphan returns 403 forbidden', function () {
    $anakPendidikan = buatAnakTest([
        'nama_lengkap' => 'Eka Saputra',
        'alias' => 'Eka',
        'jenjang' => 'SMP',
        'kelas' => '8 SMP',
        'kelurahan' => 'Sembung',
        'created_by' => $this->adminPendidikan->id,
    ]);
    $anakPendidikan->bidang()->attach($this->bidangPendidikan->id);

    // Admin Kemanusiaan attempts to access anakPendidikan by manipulating ID in URL
    $this->actingAs($this->adminKemanusiaan)
        ->getJson("/admin/anak-yatim/{$anakPendidikan->id}")
        ->assertForbidden();

    // Admin Pendidikan accessing own child succeeds with 200 OK
    $response = $this->actingAs($this->adminPendidikan)
        ->getJson("/admin/anak-yatim/{$anakPendidikan->id}")
        ->assertOk();

    // Sensitive fields are hidden from JSON response
    $responseData = $response->json('data');
    expect(array_key_exists('nik', $responseData))->toBeFalse();
    expect(array_key_exists('alamat_detail', $responseData))->toBeFalse();
    expect($responseData['nama_lengkap'])->toBe('Eka Saputra');
});

test('child connected to multiple bidang can be accessed by admins of those respective bidang', function () {
    $anakMultiBidang = buatAnakTest([
        'nama_lengkap' => 'Fajar Nugraha',
        'alias' => 'Fajar',
        'kelurahan' => 'Kenayan',
        'created_by' => $this->adminKemanusiaan->id,
    ]);
    // Connected to both Kemanusiaan and Pendidikan
    $anakMultiBidang->bidang()->attach([
        $this->bidangKemanusiaan->id,
        $this->bidangPendidikan->id,
    ]);

    // Both Admin Kemanusiaan and Admin Pendidikan can view & manage
    expect(Gate::forUser($this->adminKemanusiaan)->allows('view', $anakMultiBidang))->toBeTrue();
    expect(Gate::forUser($this->adminPendidikan)->allows('view', $anakMultiBidang))->toBeTrue();

    // Admin Ekonomi is denied
    $adminEkonomi = User::create([
        'name' => 'Admin Ekonomi',
        'email' => 'admin.ekonomi@geliyat.or.id',
        'password' => 'secret123',
        'role' => 'admin',
        'bidang_id' => $this->bidangEkonomi->id,
        'is_active' => true,
    ]);
    expect(Gate::forUser($adminEkonomi)->denies('view', $anakMultiBidang))->toBeTrue();

    // HTTP Route check
    $this->actingAs($this->adminKemanusiaan)
        ->getJson("/admin/anak-yatim/{$anakMultiBidang->id}")
        ->assertOk();

    $this->actingAs($this->adminPendidikan)
        ->getJson("/admin/anak-yatim/{$anakMultiBidang->id}")
        ->assertOk();

    $this->actingAs($adminEkonomi)
        ->getJson("/admin/anak-yatim/{$anakMultiBidang->id}")
        ->assertForbidden();
});

test('sensitive data (nik and alamat_detail) is protected and authorized via viewSensitiveData', function () {
    $rawNik = '3273111122223333';
    $anak = buatAnakTest([
        'nik' => $rawNik,
        'nama_lengkap' => 'Gita Gutawa',
        'alias' => 'Gita',
        'jenis_kelamin' => 'P',
        'jenjang' => 'SMA',
        'kelas' => '11 SMA',
        'kelurahan' => 'Bungur',
        'alamat_detail' => 'Jl. Mawar No. 45 RT 02 RW 03',
        'created_by' => $this->adminKemanusiaan->id,
    ]);
    $anak->bidang()->attach([
        $this->bidangKemanusiaan->id,
        $this->bidangPendidikan->id,
    ]);

    // Super Admin: Allowed
    expect(Gate::forUser($this->superAdmin)->allows('viewSensitiveData', $anak))->toBeTrue();

    // Admin Kemanusiaan: Allowed (bertanggung jawab atas pengasuhan & verifikasi identitas yatim)
    expect(Gate::forUser($this->adminKemanusiaan)->allows('viewSensitiveData', $anak))->toBeTrue();

    // Admin Pendidikan: DENIED from viewSensitiveData even though the child is in Pendidikan program
    // (UU PDP: minimisasi data - divisi pendidikan tidak membutuhkan akses NIK/alamat rumah)
    expect(Gate::forUser($this->adminPendidikan)->denies('viewSensitiveData', $anak))->toBeTrue();

    // Admin Kemanusiaan HTTP access to sensitive endpoint returns 200 with decrypted NIK
    $responseKemanusiaan = $this->actingAs($this->adminKemanusiaan)
        ->getJson("/admin/anak-yatim/{$anak->id}/sensitive")
        ->assertOk();

    expect($responseKemanusiaan->json('data.nik'))->toBe($rawNik);
    expect($responseKemanusiaan->json('data.alamat_detail'))->toBe('Jl. Mawar No. 45 RT 02 RW 03');

    // Admin Pendidikan HTTP access to sensitive endpoint returns 403 Forbidden
    $this->actingAs($this->adminPendidikan)
        ->getJson("/admin/anak-yatim/{$anak->id}/sensitive")
        ->assertForbidden();
});

test('admin cannot tamper with attachBidang or detachBidang for other bidang', function () {
    $anak = buatAnakTest([
        'nama_lengkap' => 'Hadi Sucipto',
        'alias' => 'Hadi',
        'created_by' => $this->adminKemanusiaan->id,
    ]);
    $anak->bidang()->attach($this->bidangKemanusiaan->id);

    // Admin Kemanusiaan can attach/detach their own bidang
    expect(Gate::forUser($this->adminKemanusiaan)->allows('attachBidang', [$anak, $this->bidangKemanusiaan->id]))->toBeTrue();
    expect(Gate::forUser($this->adminKemanusiaan)->allows('detachBidang', [$anak, $this->bidangKemanusiaan->id]))->toBeTrue();

    // Admin Kemanusiaan is DENIED from attaching/detaching Pendidikan bidang (preventing parameter tampering)
    expect(Gate::forUser($this->adminKemanusiaan)->denies('attachBidang', [$anak, $this->bidangPendidikan->id]))->toBeTrue();
    expect(Gate::forUser($this->adminKemanusiaan)->denies('detachBidang', [$anak, $this->bidangPendidikan->id]))->toBeTrue();
});

test('kegiatan policy isolates activities by bidang and reserves general activities to super admin', function () {
    $kegiatanUmum = buatKegiatanTest([
        'judul' => 'Milad Yayasan Geliyat',
        'bidang_id' => null, // Umum / lintas bidang
        'kategori' => 'Kemanusiaan',
        'created_by' => $this->superAdmin->id,
    ]);

    $kegiatanKemanusiaan = buatKegiatanTest([
        'judul' => 'Santunan Anak Yatim',
        'bidang_id' => $this->bidangKemanusiaan->id,
        'kategori' => 'Kemanusiaan',
        'created_by' => $this->adminKemanusiaan->id,
    ]);

    $kegiatanPendidikan = buatKegiatanTest([
        'judul' => 'Bimbingan Belajar Gratis',
        'bidang_id' => $this->bidangPendidikan->id,
        'kategori' => 'Pendidikan',
        'created_by' => $this->adminPendidikan->id,
    ]);

    // Admin Kemanusiaan can view general and own activity
    expect(Gate::forUser($this->adminKemanusiaan)->allows('view', $kegiatanUmum))->toBeTrue();
    expect(Gate::forUser($this->adminKemanusiaan)->allows('view', $kegiatanKemanusiaan))->toBeTrue();
    // Admin Kemanusiaan CANNOT view Pendidikan activity
    expect(Gate::forUser($this->adminKemanusiaan)->denies('view', $kegiatanPendidikan))->toBeTrue();

    // Admin Kemanusiaan can update/delete own activity, but NOT general or Pendidikan activity
    expect(Gate::forUser($this->adminKemanusiaan)->allows('update', $kegiatanKemanusiaan))->toBeTrue();
    expect(Gate::forUser($this->adminKemanusiaan)->allows('delete', $kegiatanKemanusiaan))->toBeTrue();

    expect(Gate::forUser($this->adminKemanusiaan)->denies('update', $kegiatanUmum))->toBeTrue();
    expect(Gate::forUser($this->adminKemanusiaan)->denies('update', $kegiatanPendidikan))->toBeTrue();

    // HTTP Route ID tampering check
    $this->actingAs($this->adminKemanusiaan)
        ->getJson("/admin/kegiatan/{$kegiatanPendidikan->id}")
        ->assertForbidden();

    $this->actingAs($this->adminKemanusiaan)
        ->getJson("/admin/kegiatan/{$kegiatanKemanusiaan->id}")
        ->assertOk();

    // Scope check: Kegiatan::visibleTo
    $kemanusiaanKegiatanIds = Kegiatan::visibleTo($this->adminKemanusiaan)->pluck('id')->all();
    expect($kemanusiaanKegiatanIds)->toContain($kegiatanUmum->id);
    expect($kemanusiaanKegiatanIds)->toContain($kegiatanKemanusiaan->id);
    expect($kemanusiaanKegiatanIds)->not->toContain($kegiatanPendidikan->id);
});

test('donasi policy allows admins according to bidang and restricts cancellation to super admin', function () {
    $anakKemanusiaan = buatAnakTest([
        'nama_lengkap' => 'Indah Permata',
        'alias' => 'Indah',
        'jenis_kelamin' => 'P',
        'kelurahan' => 'Kenayan',
        'created_by' => $this->adminKemanusiaan->id,
    ]);
    $anakKemanusiaan->bidang()->attach($this->bidangKemanusiaan->id);

    $donasiUmum = buatDonasiTest([
        'kode_donasi' => 'DON-UMUM-01',
        'nama_donatur' => 'Donatur Umum',
        'jenis_donasi' => 'Donasi Umum',
        'nominal' => 200000,
        'status_verifikasi' => Donasi::STATUS_MENUNGGU,
    ]);

    $donasiYatim = buatDonasiTest([
        'kode_donasi' => 'DON-YATIM-01',
        'nama_donatur' => 'Orang Tua Asuh Indah',
        'jenis_donasi' => Donasi::JENIS_ORANG_TUA_ASUH,
        'anak_yatim_id' => $anakKemanusiaan->id,
        'nominal' => 300000,
        'status_verifikasi' => Donasi::STATUS_MENUNGGU,
    ]);

    // Admin Kemanusiaan: can view general and orphan donasi
    expect(Gate::forUser($this->adminKemanusiaan)->allows('view', $donasiUmum))->toBeTrue();
    expect(Gate::forUser($this->adminKemanusiaan)->allows('view', $donasiYatim))->toBeTrue();
    expect(Gate::forUser($this->adminKemanusiaan)->allows('verify', $donasiYatim))->toBeTrue();

    // Regular admin CANNOT cancel verified donations
    expect(Gate::forUser($this->adminKemanusiaan)->denies('cancel', $donasiYatim))->toBeTrue();
    expect(Gate::forUser($this->adminPendidikan)->denies('cancel', $donasiYatim))->toBeTrue();

    // Super Admin CAN cancel
    expect(Gate::forUser($this->superAdmin)->allows('cancel', $donasiYatim))->toBeTrue();

    // HTTP Route check
    $this->actingAs($this->adminKemanusiaan)
        ->getJson("/admin/donasi/{$donasiYatim->id}")
        ->assertOk();
});

test('transaksi keuangan policy strictly forbids regular admins from all ledger operations', function () {
    $transaksi = TransaksiKeuangan::create([
        'kode_transaksi' => 'TRX-KAS-01',
        'tipe' => TransaksiKeuangan::TIPE_PEMASUKAN,
        'kategori' => 'Infaq',
        'nominal' => 1000000,
        'tanggal_transaksi' => now(),
        'status_transaksi' => TransaksiKeuangan::STATUS_VALID,
        'keterangan' => 'Kas masuk',
        'created_by' => $this->superAdmin->id,
    ]);

    // Regular admin is denied from all financial operations
    expect(Gate::forUser($this->adminKemanusiaan)->denies('viewAny', TransaksiKeuangan::class))->toBeTrue();
    expect(Gate::forUser($this->adminKemanusiaan)->denies('view', $transaksi))->toBeTrue();
    expect(Gate::forUser($this->adminKemanusiaan)->denies('create', TransaksiKeuangan::class))->toBeTrue();
    expect(Gate::forUser($this->adminKemanusiaan)->denies('update', $transaksi))->toBeTrue();
    expect(Gate::forUser($this->adminKemanusiaan)->denies('delete', $transaksi))->toBeTrue();
    expect(Gate::forUser($this->adminKemanusiaan)->denies('void', $transaksi))->toBeTrue();

    // Super admin is allowed
    expect(Gate::forUser($this->superAdmin)->allows('viewAny', TransaksiKeuangan::class))->toBeTrue();
    expect(Gate::forUser($this->superAdmin)->allows('view', $transaksi))->toBeTrue();
    expect(Gate::forUser($this->superAdmin)->allows('void', $transaksi))->toBeTrue();
});

test('inactive users are denied across all policies regardless of role', function () {
    $inactiveSuperAdmin = User::create([
        'name' => 'Inactive Super Admin',
        'email' => 'super.inactive@geliyat.or.id',
        'password' => 'secret123',
        'role' => 'super_admin',
        'bidang_id' => null,
        'is_active' => false,
    ]);

    $anak = buatAnakTest([
        'nama_lengkap' => 'Kiki',
        'alias' => 'Kiki',
        'created_by' => $this->superAdmin->id,
    ]);

    expect(Gate::forUser($this->userNonAktif)->denies('viewAny', AnakYatim::class))->toBeTrue();
    expect(Gate::forUser($this->userNonAktif)->denies('view', $anak))->toBeTrue();
    expect(Gate::forUser($inactiveSuperAdmin)->denies('viewAny', AnakYatim::class))->toBeTrue();
    expect(Gate::forUser($inactiveSuperAdmin)->denies('view', $anak))->toBeTrue();
});
