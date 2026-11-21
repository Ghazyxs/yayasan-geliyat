<?php

use App\Models\Bidang;
use App\Models\Donasi;
use App\Models\TransaksiKeuangan;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->bidangKemanusiaan = Bidang::where('kode', Bidang::KEMANUSIAAN)->firstOrFail();
    $this->bidangPendidikan = Bidang::where('kode', Bidang::PENDIDIKAN)->firstOrFail();

    $this->superAdmin = User::create([
        'name' => 'Ketua Yayasan',
        'email' => 'ketua.kp@geliyat.or.id',
        'password' => 'secret123',
        'role' => 'super_admin',
        'bidang_id' => null,
        'is_active' => true,
        'email_verified_at' => now(),
    ]);

    $this->adminBiasa = User::create([
        'name' => 'Admin Bidang',
        'email' => 'admin.kp@geliyat.or.id',
        'password' => 'secret123',
        'role' => 'admin',
        'bidang_id' => $this->bidangKemanusiaan->id,
        'is_active' => true,
        'email_verified_at' => now(),
    ]);
});

test('keuangan page displays simplified stats and accurately reflects income and expense totals', function () {
    // 1. Admin biasa ditolak (403)
    $this->actingAs($this->adminBiasa)
        ->get(route('admin.keuangan'))
        ->assertForbidden();

    // 2. Buat pemasukan donasi terverifikasi Rp 750.000
    $donasi = Donasi::create([
        'kode_donasi' => 'DON-KEU-001',
        'nama_donatur' => 'H. Sulaiman',
        'jenis_donasi' => Donasi::JENIS_DONASI_UMUM,
        'rekening_tujuan' => Donasi::REKENING_DEFAULT_PUBLIK,
        'nominal' => 750000,
        'status_verifikasi' => Donasi::STATUS_MENUNGGU,
    ]);
    Donasi::verifikasi($donasi->id, $this->superAdmin);

    // 3. Catat pemasukan manual Rp 250.000
    $this->actingAs($this->superAdmin)
        ->post(route('admin.transaksi.store'), [
            'tipe' => TransaksiKeuangan::TIPE_PEMASUKAN,
            'sumber_dana' => TransaksiKeuangan::SUMBER_OPERASIONAL,
            'kategori' => 'Usaha Koperasi',
            'nominal' => 250000,
            'tanggal_transaksi' => '2026-11-15',
            'keterangan' => 'Setoran hasil koperasi bulan November',
        ])
        ->assertRedirect()
        ->assertSessionHas('success');

    // 4. Catat pengeluaran manual Rp 300.000
    $this->actingAs($this->superAdmin)
        ->post(route('admin.transaksi.store'), [
            'tipe' => TransaksiKeuangan::TIPE_PENGELUARAN,
            'sumber_dana' => TransaksiKeuangan::SUMBER_DONASI,
            'kategori' => 'Santunan Anak Binaan',
            'nominal' => 300000,
            'tanggal_transaksi' => '2026-11-18',
            'keterangan' => 'Penyaluran paket sembako kelurahan Cigending',
        ])
        ->assertRedirect()
        ->assertSessionHas('success');

    // 5. Transaksi berstatus void tidak boleh dihitung ke pemasukan/pengeluaran/saldo
    TransaksiKeuangan::create([
        'kode_transaksi' => 'TRX-VOID-CHECK',
        'tipe' => TransaksiKeuangan::TIPE_PENGELUARAN,
        'sumber_dana' => TransaksiKeuangan::SUMBER_OPERASIONAL,
        'kategori' => 'Salah Input',
        'nominal' => 900000,
        'tanggal_transaksi' => '2026-11-19',
        'status_transaksi' => TransaksiKeuangan::STATUS_VOID,
        'keterangan' => 'Dibatalkan',
        'created_by' => $this->superAdmin->id,
    ]);

    // Total pemasukan = 750.000 + 250.000 = 1.000.000; Total pengeluaran = 300.000; Saldo = 700.000
    $this->actingAs($this->superAdmin)
        ->get(route('admin.keuangan'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/keuangan/index')
            ->where('stats.total_pemasukan', 1000000)
            ->where('stats.total_pengeluaran', 300000)
            ->where('stats.saldo_kas', 700000)
            ->where('stats.jumlah_pemasukan', 2)
            ->where('stats.jumlah_pengeluaran', 1)
            ->has('transaksiList.data', 4)
        );
});

test('keuangan search, tipe filter, date range filter, and transaction detail endpoint work accurately', function () {
    $trxIn = TransaksiKeuangan::create([
        'kode_transaksi' => 'TRX-SEARCH-IN01',
        'tipe' => TransaksiKeuangan::TIPE_PEMASUKAN,
        'sumber_dana' => TransaksiKeuangan::SUMBER_OPERASIONAL,
        'kategori' => 'Sumbangan Rutin',
        'nominal' => 450000,
        'tanggal_transaksi' => '2026-10-05',
        'status_transaksi' => TransaksiKeuangan::STATUS_VALID,
        'keterangan' => 'Pemasukan donatur tetap bulan Oktober',
        'created_by' => $this->superAdmin->id,
    ]);

    $trxOut = TransaksiKeuangan::create([
        'kode_transaksi' => 'TRX-SEARCH-OUT01',
        'tipe' => TransaksiKeuangan::TIPE_PENGELUARAN,
        'sumber_dana' => TransaksiKeuangan::SUMBER_DONASI,
        'kategori' => 'Biaya Sekolah Binaan',
        'nominal' => 200000,
        'tanggal_transaksi' => '2026-11-20',
        'status_transaksi' => TransaksiKeuangan::STATUS_VALID,
        'keterangan' => 'Pembayaran SPP siswa SMA binaan',
        'created_by' => $this->superAdmin->id,
    ]);

    // 1. Pencarian berdasarkan kata kunci keterangan/kategori
    $this->actingAs($this->superAdmin)
        ->get(route('admin.keuangan', ['search' => 'SPP siswa']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('transaksiList.data', 1)
            ->where('transaksiList.data.0.kode_transaksi', 'TRX-SEARCH-OUT01')
        );

    // 2. Filter jenis transaksi (pemasukan vs pengeluaran)
    $this->actingAs($this->superAdmin)
        ->get(route('admin.keuangan', ['tipe' => 'pemasukan']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('transaksiList.data', 1)
            ->where('transaksiList.data.0.kode_transaksi', 'TRX-SEARCH-IN01')
        );

    // 3. Filter rentang tanggal (hanya bulan November 2026)
    $this->actingAs($this->superAdmin)
        ->get(route('admin.keuangan', [
            'tanggal_dari' => '2026-11-01',
            'tanggal_sampai' => '2026-11-30',
        ]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('transaksiList.data', 1)
            ->where('transaksiList.data.0.kode_transaksi', 'TRX-SEARCH-OUT01')
        );

    // 4. Detail transaksi endpoint JSON (Super Admin OK, Admin biasa 403)
    $this->actingAs($this->adminBiasa)
        ->getJson(route('admin.keuangan.show', $trxIn->id))
        ->assertForbidden();

    $detailRes = $this->actingAs($this->superAdmin)
        ->getJson(route('admin.keuangan.show', $trxOut->id))
        ->assertOk();

    expect($detailRes->json('data.kode_transaksi'))->toBe('TRX-SEARCH-OUT01');
    expect($detailRes->json('data.tipe'))->toBe('pengeluaran');
    expect($detailRes->json('data.nominal'))->toBe(200000);
    expect($detailRes->json('data.keterangan'))->toBe('Pembayaran SPP siswa SMA binaan');
});

test('super admin can add new board member securely with hashed password and proper role permissions', function () {
    // 1. Halaman index menampilkan daftar pengguna riil dari DB
    $this->actingAs($this->superAdmin)
        ->get(route('admin.pengguna'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/pengguna/index')
            ->has('users', 2)
            ->has('bidangList', 4)
        );

    // 2. Tambah Admin Bidang Pendidikan baru
    $this->actingAs($this->superAdmin)
        ->post(route('admin.pengguna.store'), [
            'name' => 'Ust. Farhan Nurhadi',
            'email' => 'Farhan.Pendidikan@Geliyat.or.id',
            'phone' => '081299887766',
            'role' => 'admin',
            'bidang_id' => $this->bidangPendidikan->id,
            'password' => 'PasswordKuat2026!',
            'password_confirmation' => 'PasswordKuat2026!',
        ])
        ->assertRedirect(route('admin.pengguna'))
        ->assertSessionHas('success');

    $newAdmin = User::where('email', 'farhan.pendidikan@geliyat.or.id')->firstOrFail();
    expect($newAdmin->name)->toBe('Ust. Farhan Nurhadi');
    expect($newAdmin->role)->toBe('admin');
    expect($newAdmin->bidang_id)->toBe($this->bidangPendidikan->id);
    expect($newAdmin->is_active)->toBeTrue();

    // Password TIDAK disimpan dalam plaintext
    $rawPassword = DB::table('users')->where('id', $newAdmin->id)->value('password');
    expect($rawPassword)->not->toBe('PasswordKuat2026!');
    expect(Hash::check('PasswordKuat2026!', $rawPassword))->toBeTrue();

    // 3. Logout Super Admin & Login sebagai Pengurus Baru via sistem autentikasi Fortify
    $this->post(route('logout'));
    $this->assertGuest();

    $this->post(route('login.store'), [
        'email' => 'farhan.pendidikan@geliyat.or.id',
        'password' => 'PasswordKuat2026!',
    ])->assertRedirect(route('dashboard', absolute: false));

    $this->assertAuthenticatedAs($newAdmin);

    // Cek hak akses: boleh akses modul operasional, ditolak (403) di modul Super Admin
    $this->get(route('dashboard'))->assertOk();
    $this->get(route('admin.anak-yatim'))->assertOk();
    $this->get(route('admin.kegiatan'))->assertOk();
    $this->get(route('admin.donasi'))->assertOk();
    $this->get(route('admin.keuangan'))->assertForbidden();
    $this->get(route('admin.pengguna'))->assertForbidden();
    $this->get(route('admin.rekening'))->assertForbidden();

    // Admin baru ditolak membuat akun pengguna
    $this->post(route('admin.pengguna.store'), [
        'name' => 'Ilegal User',
        'email' => 'ilegal@geliyat.or.id',
        'role' => 'admin',
        'bidang_id' => $this->bidangPendidikan->id,
        'password' => 'PasswordKuat2026!',
        'password_confirmation' => 'PasswordKuat2026!',
    ])->assertForbidden();
});

test('pengguna creation validates inputs, rejects duplicate emails, and creates super admin with null bidang_id', function () {
    // 1. Validasi gagal untuk input kosong, email tidak valid, password terlalu pendek, konfirmasi beda, dan admin tanpa bidang
    $this->actingAs($this->superAdmin)
        ->post(route('admin.pengguna.store'), [
            'name' => '',
            'email' => 'bukan-email',
            'role' => 'admin',
            'bidang_id' => '',
            'password' => '123',
            'password_confirmation' => '456',
        ])
        ->assertSessionHasErrors([
            'name',
            'email',
            'bidang_id',
            'password',
        ]);

    // 2. Tolak email duplikat (case-insensitive) agar tidak membuat akun ganda
    $this->actingAs($this->superAdmin)
        ->post(route('admin.pengguna.store'), [
            'name' => 'Akun Duplikat',
            'email' => 'KETUA.KP@GELIYAT.OR.ID',
            'role' => 'admin',
            'bidang_id' => $this->bidangKemanusiaan->id,
            'password' => 'PasswordAman123!',
            'password_confirmation' => 'PasswordAman123!',
        ])
        ->assertSessionHasErrors(['email']);

    expect(User::where('email', 'ketua.kp@geliyat.or.id')->count())->toBe(1);

    // 3. Buat Super Admin baru -> bidang_id wajib null & bisa mengakses keuangan/pengguna setelah login
    $this->actingAs($this->superAdmin)
        ->post(route('admin.pengguna.store'), [
            'name' => 'Bendahara Utama',
            'email' => 'bendahara.baru@geliyat.or.id',
            'role' => 'super_admin',
            'bidang_id' => $this->bidangPendidikan->id,
            'password' => 'Bendahara2026!',
            'password_confirmation' => 'Bendahara2026!',
        ])
        ->assertRedirect(route('admin.pengguna'))
        ->assertSessionHas('success');

    $newSuper = User::where('email', 'bendahara.baru@geliyat.or.id')->firstOrFail();
    expect($newSuper->role)->toBe('super_admin');
    expect($newSuper->bidang_id)->toBeNull();

    $this->post(route('logout'));
    $this->post(route('login.store'), [
        'email' => 'bendahara.baru@geliyat.or.id',
        'password' => 'Bendahara2026!',
    ])->assertRedirect(route('dashboard', absolute: false));

    $this->get(route('admin.keuangan'))->assertOk();
    $this->get(route('admin.pengguna'))->assertOk();
});
