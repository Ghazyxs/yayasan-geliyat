<?php

use App\Models\AnakYatim;
use App\Models\Bidang;
use App\Models\Donasi;
use App\Models\TransaksiKeuangan;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

function buatFileJpgDashboard(string $filename = 'bukti.jpg'): UploadedFile
{
    $jpegBytes = "\xFF\xD8\xFF\xE0\x00\x10JFIF\x00\x01\x01\x01\x00\x60\x00\x60\x00\x00\xFF\xDB\x00\x43\x00"
        .str_repeat("\x08", 64)
        ."\xFF\xC0\x00\x0B\x08\x00\x01\x00\x01\x01\x01\x11\x00\xFF\xDA\x00\x08\x01\x01\x00\x00\x3F\x00\xD2\xCF\x20\xFF\xD9";

    return UploadedFile::fake()->createWithContent($filename, $jpegBytes);
}

beforeEach(function () {
    Storage::fake('local');

    $this->bidangKemanusiaan = Bidang::where('kode', Bidang::KEMANUSIAAN)->firstOrFail();
    $this->bidangPendidikan = Bidang::where('kode', Bidang::PENDIDIKAN)->firstOrFail();

    $this->superAdmin = User::create([
        'name' => 'Ketua Yayasan',
        'email' => 'ketua.dash@geliyat.or.id',
        'password' => 'secret123',
        'role' => 'super_admin',
        'bidang_id' => null,
        'is_active' => true,
    ]);

    $this->adminKemanusiaan = User::create([
        'name' => 'Admin Kemanusiaan',
        'email' => 'admin.kemanusiaan.dash@geliyat.or.id',
        'password' => 'secret123',
        'role' => 'admin',
        'bidang_id' => $this->bidangKemanusiaan->id,
        'is_active' => true,
    ]);

    $this->anakKemanusiaan = AnakYatim::create([
        'nik' => '3273111122220099',
        'nama_lengkap' => 'Budi Santoso',
        'alias' => 'Budi (B.S.)',
        'jenis_kelamin' => 'L',
        'tanggal_lahir' => '2014-05-15',
        'jenjang' => 'SD',
        'kelas' => 'Kelas 5 SD',
        'kelurahan' => 'Cigending',
        'alamat_detail' => 'Jl. Pasir',
        'nama_wali' => 'Ibu Aminah',
        'status_binaan' => 'aktif',
        'created_by' => $this->adminKemanusiaan->id,
    ]);
    $this->anakKemanusiaan->bidang()->attach($this->bidangKemanusiaan->id);
});

test('super admin dashboard displays live aggregated finances with split donation and operational funds', function () {
    // 1. Buat donasi terverifikasi Rp 500.000
    $donasi = Donasi::create([
        'kode_donasi' => Donasi::generateKodeDonasi(),
        'nama_donatur' => 'Dermawan A',
        'no_whatsapp' => '081234567890',
        'jenis_donasi' => Donasi::JENIS_DONASI_UMUM,
        'rekening_tujuan' => 'BSI - 7256194821',
        'nominal' => 500000,
        'status_verifikasi' => Donasi::STATUS_MENUNGGU,
    ]);
    Donasi::verifikasi($donasi->id, $this->superAdmin);

    // 2. Buat pengeluaran donasi Rp 200.000
    TransaksiKeuangan::create([
        'kode_transaksi' => 'TRX-OUT-DON-001',
        'tipe' => TransaksiKeuangan::TIPE_PENGELUARAN,
        'sumber_dana' => TransaksiKeuangan::SUMBER_DONASI,
        'kategori' => 'Santunan Anak Yatim',
        'nominal' => 200000,
        'tanggal_transaksi' => now()->toDateString(),
        'status_transaksi' => TransaksiKeuangan::STATUS_VALID,
        'keterangan' => 'Penyaluran santunan tunai',
        'created_by' => $this->superAdmin->id,
    ]);

    // 3. Buat pemasukan operasional non-donasi Rp 1.000.000
    TransaksiKeuangan::create([
        'kode_transaksi' => 'TRX-IN-OPS-001',
        'tipe' => TransaksiKeuangan::TIPE_PEMASUKAN,
        'sumber_dana' => TransaksiKeuangan::SUMBER_OPERASIONAL,
        'kategori' => 'Bagi Hasil Unit Usaha',
        'nominal' => 1000000,
        'tanggal_transaksi' => now()->toDateString(),
        'status_transaksi' => TransaksiKeuangan::STATUS_VALID,
        'keterangan' => 'Bagi hasil penjualan merchandise yayasan',
        'created_by' => $this->superAdmin->id,
    ]);

    // 4. Buat pengeluaran operasional Rp 300.000
    TransaksiKeuangan::create([
        'kode_transaksi' => 'TRX-OUT-OPS-001',
        'tipe' => TransaksiKeuangan::TIPE_PENGELUARAN,
        'sumber_dana' => TransaksiKeuangan::SUMBER_OPERASIONAL,
        'kategori' => 'Listrik & Internet',
        'nominal' => 300000,
        'tanggal_transaksi' => now()->toDateString(),
        'status_transaksi' => TransaksiKeuangan::STATUS_VALID,
        'keterangan' => 'Tagihan listrik kantor',
        'created_by' => $this->superAdmin->id,
    ]);

    // 5. Buat transaksi lama dengan sumber_dana = NULL Rp 50.000
    TransaksiKeuangan::create([
        'kode_transaksi' => 'TRX-OLD-NULL-001',
        'tipe' => TransaksiKeuangan::TIPE_PEMASUKAN,
        'sumber_dana' => null,
        'kategori' => 'Pemasukan Lama',
        'nominal' => 50000,
        'tanggal_transaksi' => now()->toDateString(),
        'status_transaksi' => TransaksiKeuangan::STATUS_VALID,
        'keterangan' => 'Pemasukan lama belum terklasifikasi',
        'created_by' => $this->superAdmin->id,
    ]);

    // Cek kalkulasi pada model
    expect(TransaksiKeuangan::totalDonasiMasuk())->toBe(500000)
        ->and(TransaksiKeuangan::totalPengeluaranDonasi())->toBe(200000)
        ->and(TransaksiKeuangan::saldoDonasi())->toBe(300000)
        ->and(TransaksiKeuangan::totalPemasukanOperasional())->toBe(1000000)
        ->and(TransaksiKeuangan::totalPengeluaranOperasional())->toBe(300000)
        ->and(TransaksiKeuangan::saldoOperasional())->toBe(700000)
        ->and(TransaksiKeuangan::saldoKonsolidasi())->toBe(1000000)
        ->and(TransaksiKeuangan::totalBelumTerklasifikasi())->toBe(50000);

    // Kunjungi dashboard Super Admin
    $this->actingAs($this->superAdmin)
        ->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard')
            ->where('isSuperAdmin', true)
            ->where('ringkasanKeuangan.donasi.masuk', 500000)
            ->where('ringkasanKeuangan.donasi.keluar', 200000)
            ->where('ringkasanKeuangan.donasi.saldo', 300000)
            ->where('ringkasanKeuangan.operasional.masuk', 1000000)
            ->where('ringkasanKeuangan.operasional.keluar', 300000)
            ->where('ringkasanKeuangan.operasional.saldo', 700000)
            ->where('ringkasanKeuangan.konsolidasi.saldo_bersih', 1000000)
            ->where('ringkasanKeuangan.konsolidasi.belum_terklasifikasi', 50000)
            ->where('totalAnakYatim', 1)
        );
});

test('regular admin dashboard does not leak global financial figures', function () {
    // Kunjungi dashboard sebagai admin bidang
    $this->actingAs($this->adminKemanusiaan)
        ->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard')
            ->where('isSuperAdmin', false)
            ->where('ringkasanKeuangan', null) // DILARANG bocor ke admin biasa
            ->where('totalAnakYatim', 1)
            ->where('namaBidang', 'Bidang Kemanusiaan & Yatim')
        );
});

test('donation verification explicitly creates cash transaction with sumber_dana donasi', function () {
    $donasi = Donasi::create([
        'kode_donasi' => Donasi::generateKodeDonasi(),
        'nama_donatur' => 'Donatur Ikhlas',
        'no_whatsapp' => '081234567891',
        'jenis_donasi' => Donasi::JENIS_DONASI_UMUM,
        'rekening_tujuan' => 'BSI - 7256194821',
        'nominal' => 250000,
        'status_verifikasi' => Donasi::STATUS_MENUNGGU,
    ]);

    $verified = Donasi::verifikasi($donasi->id, $this->superAdmin);

    $transaksi = TransaksiKeuangan::where('donasi_id', $verified->id)->firstOrFail();
    expect($transaksi->sumber_dana)->toBe(TransaksiKeuangan::SUMBER_DONASI)
        ->and($transaksi->tipe)->toBe(TransaksiKeuangan::TIPE_PEMASUKAN)
        ->and($transaksi->nominal)->toBe(250000)
        ->and($transaksi->status_transaksi)->toBe(TransaksiKeuangan::STATUS_VALID);
});

test('void transactions are completely excluded from both donation and operational balances', function () {
    $donasi = Donasi::create([
        'kode_donasi' => Donasi::generateKodeDonasi(),
        'nama_donatur' => 'Donatur Batal',
        'no_whatsapp' => '081234567892',
        'jenis_donasi' => Donasi::JENIS_DONASI_UMUM,
        'rekening_tujuan' => 'BSI - 7256194821',
        'nominal' => 150000,
        'status_verifikasi' => Donasi::STATUS_MENUNGGU,
    ]);
    Donasi::verifikasi($donasi->id, $this->superAdmin);

    // Batalkan donasi -> transaksi kas jadi void
    Donasi::batalkan($donasi->id, $this->superAdmin, 'Salah nominal transfer');

    expect(TransaksiKeuangan::totalDonasiMasuk())->toBe(0)
        ->and(TransaksiKeuangan::saldoDonasi())->toBe(0)
        ->and(TransaksiKeuangan::saldoKonsolidasi())->toBe(0);
});

test('super admin can record manual expense with explicit sumber dana', function () {
    $response = $this->actingAs($this->superAdmin)
        ->post(route('admin.transaksi.store'), [
            'tipe' => TransaksiKeuangan::TIPE_PENGELUARAN,
            'sumber_dana' => TransaksiKeuangan::SUMBER_DONASI,
            'kategori' => 'Bantuan Beras & Sembako Yatim',
            'nominal' => 450000,
            'tanggal_transaksi' => now()->toDateString(),
            'keterangan' => 'Distribusi sembako untuk 3 kelurahan binaan',
        ]);

    $response->assertRedirect()->assertSessionHas('success');

    $this->assertDatabaseHas('transaksi_keuangan', [
        'tipe' => 'pengeluaran',
        'sumber_dana' => 'donasi',
        'nominal' => 450000,
        'kategori' => 'Bantuan Beras & Sembako Yatim',
        'status_transaksi' => 'valid',
    ]);
});

test('regular admin cannot record manual cash transaction', function () {
    $this->actingAs($this->adminKemanusiaan)
        ->post(route('admin.transaksi.store'), [
            'tipe' => TransaksiKeuangan::TIPE_PENGELUARAN,
            'sumber_dana' => TransaksiKeuangan::SUMBER_OPERASIONAL,
            'kategori' => 'Pengeluaran Ilegal',
            'nominal' => 100000,
            'tanggal_transaksi' => now()->toDateString(),
            'keterangan' => 'Coba catat tanpa wewenang',
        ])
        ->assertForbidden();
});

test('backend strictly validates sumber_dana requirement for manual transactions', function () {
    // Tanpa sumber_dana -> error validasi
    $response = $this->actingAs($this->superAdmin)
        ->post(route('admin.transaksi.store'), [
            'tipe' => TransaksiKeuangan::TIPE_PENGELUARAN,
            'kategori' => 'Pengeluaran Tanpa Sumber',
            'nominal' => 50000,
            'tanggal_transaksi' => now()->toDateString(),
            'keterangan' => 'Tidak memilih sumber dana',
        ]);

    $response->assertSessionHasErrors('sumber_dana');

    // Sumber dana sembarangan -> error validasi
    $invalid = $this->actingAs($this->superAdmin)
        ->post(route('admin.transaksi.store'), [
            'tipe' => TransaksiKeuangan::TIPE_PENGELUARAN,
            'sumber_dana' => 'dana_siluman',
            'kategori' => 'Pengeluaran Sumber Palsu',
            'nominal' => 50000,
            'tanggal_transaksi' => now()->toDateString(),
            'keterangan' => 'Sumber dana tidak terdaftar',
        ]);

    $invalid->assertSessionHasErrors('sumber_dana');
});

test('verified donation does not show verify or reject action flags in admin panel', function () {
    $donasi = Donasi::create([
        'kode_donasi' => 'DON-TEST-LIFECYCLE-01',
        'nama_donatur' => 'Budi',
        'no_whatsapp' => '081234567891',
        'jenis_donasi' => Donasi::JENIS_DONASI_UMUM,
        'rekening_tujuan' => 'BSI - 7256194821',
        'nominal' => 250000,
        'status_verifikasi' => Donasi::STATUS_TERVERIFIKASI,
        'tanggal_donasi' => now(),
    ]);

    $donasiMenunggu = Donasi::create([
        'kode_donasi' => 'DON-TEST-LIFECYCLE-02',
        'nama_donatur' => 'Ani',
        'no_whatsapp' => '081234567892',
        'jenis_donasi' => Donasi::JENIS_DONASI_UMUM,
        'rekening_tujuan' => 'BSI - 7256194821',
        'nominal' => 150000,
        'status_verifikasi' => Donasi::STATUS_MENUNGGU,
        'tanggal_donasi' => now(),
    ]);

    $response = $this->actingAs($this->superAdmin)
        ->get(route('admin.donasi'));

    $response->assertOk();
    $page = $response->viewData('page');
    $donasiItems = collect($page['props']['donasi']['data']);

    $verifiedItem = $donasiItems->firstWhere('id', $donasi->id);
    expect($verifiedItem['can_verify'])->toBeFalse()
        ->and($verifiedItem['can_reject'])->toBeFalse()
        ->and($verifiedItem['can_cancel'])->toBeTrue();

    $menungguItem = $donasiItems->firstWhere('id', $donasiMenunggu->id);
    expect($menungguItem['can_verify'])->toBeTrue()
        ->and($menungguItem['can_reject'])->toBeTrue()
        ->and($menungguItem['can_cancel'])->toBeFalse();
});

test('transactions linked to donation are intrinsically classified as donation and not unclassified', function () {
    $donasi = Donasi::create([
        'kode_donasi' => 'DON-TEST-AUTO-CLASSIFY',
        'nama_donatur' => 'Siti',
        'no_whatsapp' => '081234567893',
        'jenis_donasi' => Donasi::JENIS_DONASI_UMUM,
        'rekening_tujuan' => 'BSI - 7256194821',
        'nominal' => 300000,
        'status_verifikasi' => Donasi::STATUS_TERVERIFIKASI,
        'tanggal_donasi' => now(),
    ]);

    // Transaksi lama yang terkait donasi tapi sumber_dana = null
    $trx = TransaksiKeuangan::create([
        'kode_transaksi' => 'TRX-TEST-OLD-DONASI',
        'tipe' => TransaksiKeuangan::TIPE_PEMASUKAN,
        'sumber_dana' => null,
        'donasi_id' => $donasi->id,
        'kategori' => 'Donasi Umum',
        'nominal' => 300000,
        'tanggal_transaksi' => now()->toDateString(),
        'status_transaksi' => TransaksiKeuangan::STATUS_VALID,
        'keterangan' => 'Donasi terverifikasi',
        'created_by' => $this->superAdmin->id,
    ]);

    // Harus terhitung ke total donasi masuk
    expect(TransaksiKeuangan::totalDonasiMasuk())->toBe(300000)
        // Dan TIDAK terhitung ke total belum terklasifikasi
        ->and(TransaksiKeuangan::totalBelumTerklasifikasi())->toBe(0);
});

