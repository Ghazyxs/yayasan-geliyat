<?php

use App\Models\AnakYatim;
use App\Models\Bidang;
use App\Models\Donasi;
use App\Models\TransaksiKeuangan;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

/**
 * Buat file JPEG valid dengan header JFIF asli tanpa bergantung pada ekstensi GD PHP.
 */
function buatFileJpgTest(string $filename = 'bukti-transfer-bsi.jpg'): UploadedFile
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
    $this->bidangEkonomi = Bidang::where('kode', Bidang::EKONOMI)->firstOrFail();

    $this->superAdmin = User::create([
        'name' => 'Ketua Yayasan',
        'email' => 'ketua.donasi@geliyat.or.id',
        'password' => 'secret123',
        'role' => 'super_admin',
        'bidang_id' => null,
        'is_active' => true,
    ]);

    $this->adminKemanusiaan = User::create([
        'name' => 'Admin Kemanusiaan',
        'email' => 'admin.kemanusiaan.donasi@geliyat.or.id',
        'password' => 'secret123',
        'role' => 'admin',
        'bidang_id' => $this->bidangKemanusiaan->id,
        'is_active' => true,
    ]);

    $this->adminPendidikan = User::create([
        'name' => 'Admin Pendidikan',
        'email' => 'admin.pendidikan.donasi@geliyat.or.id',
        'password' => 'secret123',
        'role' => 'admin',
        'bidang_id' => $this->bidangPendidikan->id,
        'is_active' => true,
    ]);

    $this->adminEkonomi = User::create([
        'name' => 'Admin Ekonomi',
        'email' => 'admin.ekonomi.donasi@geliyat.or.id',
        'password' => 'secret123',
        'role' => 'admin',
        'bidang_id' => $this->bidangEkonomi->id,
        'is_active' => true,
    ]);

    $this->adminTanpaBidang = User::create([
        'name' => 'Admin Tanpa Bidang',
        'email' => 'admin.nobidang.donasi@geliyat.or.id',
        'password' => 'secret123',
        'role' => 'admin',
        'bidang_id' => null,
        'is_active' => true,
    ]);

    $this->anakKemanusiaan = AnakYatim::create([
        'nik' => '3273111122220001',
        'nama_lengkap' => 'Nadia Safitri',
        'alias' => 'Nadia (N.S.)',
        'jenis_kelamin' => 'P',
        'tanggal_lahir' => '2015-03-10',
        'jenjang' => 'SD',
        'kelas' => 'Kelas 4 SD',
        'kelurahan' => 'Cigending',
        'alamat_detail' => 'Jl. Cigending No. 5',
        'nama_wali' => 'Ibu Siti',
        'status_binaan' => 'aktif',
        'status_asuh' => AnakYatim::STATUS_ASUH_BELUM,
        'created_by' => $this->adminKemanusiaan->id,
    ]);
    $this->anakKemanusiaan->bidang()->attach($this->bidangKemanusiaan->id);

    $this->anakPendidikan = AnakYatim::create([
        'nik' => '3273111122220002',
        'nama_lengkap' => 'Farhan Maulana',
        'alias' => 'Farhan (F.M.)',
        'jenis_kelamin' => 'L',
        'tanggal_lahir' => '2012-07-22',
        'jenjang' => 'SMP',
        'kelas' => 'Kelas 8 SMP',
        'kelurahan' => 'Pasanggrahan',
        'alamat_detail' => 'Jl. Pasanggrahan No. 9',
        'nama_wali' => 'Bapak Hendra',
        'status_binaan' => 'aktif',
        'status_asuh' => AnakYatim::STATUS_ASUH_BELUM,
        'created_by' => $this->adminPendidikan->id,
    ]);
    $this->anakPendidikan->bidang()->attach($this->bidangPendidikan->id);
});

test('public donor can view simplified donation page and submit preset nominal donation in waiting status without creating transaction', function () {
    // 1. Halaman publik donasi menampilkan pilihan nominal preset yang disederhanakan
    $this->get(route('donasi'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('public/donasi')
            ->has('nominalOptions', 7)
            ->where('nominalOptions', [5000, 10000, 15000, 20000, 25000, 50000, 100000])
            ->missing('rekeningList')
            ->missing('anakYatimList')
        );

    // 2. Donatur mengajukan donasi menggunakan pilihan nominal (termasuk Rp5.000) tanpa jenis_donasi, rekening_tujuan, dan bukti_transfer
    $response = $this->post(route('donasi.store'), [
        'nama_donatur' => 'H. Abdullah Syakir',
        'no_whatsapp' => '081234567890',
        'nominal' => 5000,
        'pesan_doa' => 'Semoga ananda sehat dan semangat belajar.',
    ]);

    $response->assertRedirect(route('donasi'))
        ->assertSessionHas('success')
        ->assertSessionHas('donasi_submitted', fn (array $submitted) => $submitted['nama_donatur'] === 'H. Abdullah Syakir'
            && $submitted['nominal'] === 5000
            && $submitted['status_verifikasi'] === Donasi::STATUS_MENUNGGU
        );

    // 3. Donasi tersimpan di database dengan status 'menunggu'
    $donasi = Donasi::where('nama_donatur', 'H. Abdullah Syakir')->firstOrFail();
    expect($donasi->status_verifikasi)->toBe(Donasi::STATUS_MENUNGGU);
    expect($donasi->nominal)->toBe(5000);
    expect($donasi->jenis_donasi)->toBe(Donasi::JENIS_DONASI_UMUM);
    expect($donasi->rekening_tujuan)->toBe(Donasi::REKENING_DEFAULT_PUBLIK);
    expect($donasi->anak_yatim_id)->toBeNull();
    expect($donasi->bukti_transfer)->toBeNull();
    expect($donasi->verified_by)->toBeNull();
    expect($donasi->verified_at)->toBeNull();

    // 4. Nominal bebas yang tidak ada pada daftar pilihan ditolak oleh validasi
    $this->from(route('donasi'))->post(route('donasi.store'), [
        'nama_donatur' => 'Donatur Nominal Bebas',
        'no_whatsapp' => '081234567890',
        'nominal' => 12000,
    ])->assertRedirect(route('donasi'))
        ->assertSessionHasErrors('nominal');

    // 5. Donasi berstatus menunggu TIDAK menghasilkan transaksi pemasukan
    expect(TransaksiKeuangan::count())->toBe(0);
    expect(TransaksiKeuangan::saldo())->toBe(0);
    expect(Donasi::totalTerverifikasi())->toBe(0);
});

test('file upload validation rejects invalid mime types, oversized files, and malicious filenames', function () {
    // 1. File bukan gambar/PDF (mis. script .php atau .exe) ditolak
    $maliciousPhp = UploadedFile::fake()->create('shell.php', 100, 'application/x-php');

    $this->from(route('donasi'))->post(route('donasi.store'), [
        'nama_donatur' => 'Penyerang',
        'no_whatsapp' => '081234567890',
        'jenis_donasi' => Donasi::JENIS_DONASI_UMUM,
        'rekening_tujuan' => 'BSI - 7256194821',
        'nominal' => 50000,
        'bukti_transfer' => $maliciousPhp,
    ])->assertRedirect(route('donasi'))
        ->assertSessionHasErrors('bukti_transfer');

    // 2. File dengan double extension berbahaya (mis. bukti.php.jpg) ditolak
    $doubleExtFile = buatFileJpgTest('bukti.php.jpg');

    $this->from(route('donasi'))->post(route('donasi.store'), [
        'nama_donatur' => 'Penyerang 2',
        'no_whatsapp' => '081234567890',
        'jenis_donasi' => Donasi::JENIS_DONASI_UMUM,
        'rekening_tujuan' => 'BSI - 7256194821',
        'nominal' => 50000,
        'bukti_transfer' => $doubleExtFile,
    ])->assertRedirect(route('donasi'))
        ->assertSessionHasErrors('bukti_transfer');

    // 3. Ukuran file > 5 MB (5120 KB) ditolak
    $oversizedFile = UploadedFile::fake()->create('resi-besar.pdf', 6000, 'application/pdf');

    $this->from(route('donasi'))->post(route('donasi.store'), [
        'nama_donatur' => 'Donatur File Besar',
        'no_whatsapp' => '081234567890',
        'jenis_donasi' => Donasi::JENIS_DONASI_UMUM,
        'rekening_tujuan' => 'BSI - 7256194821',
        'nominal' => 50000,
        'bukti_transfer' => $oversizedFile,
    ])->assertRedirect(route('donasi'))
        ->assertSessionHasErrors('bukti_transfer');

    expect(Donasi::count())->toBe(0);
});

test('authorized admin can verify donation creating exactly one income transaction and preventing duplicate verification', function () {
    $buktiPath = buatFileJpgTest('bukti.jpg')->storeAs('bukti-transfer/2026/11', 'bukti-test.jpg', 'local');

    $donasi = Donasi::create([
        'kode_donasi' => 'DON-20261103-VER001',
        'nama_donatur' => 'Ibu Hj. Rahmawati',
        'no_whatsapp' => '081322334455',
        'jenis_donasi' => Donasi::JENIS_ORANG_TUA_ASUH,
        'anak_yatim_id' => $this->anakKemanusiaan->id,
        'rekening_tujuan' => 'BSI - 7256194821',
        'nominal' => 500000,
        'bukti_transfer' => $buktiPath,
        'status_verifikasi' => Donasi::STATUS_MENUNGGU,
    ]);

    // Admin Kemanusiaan memverifikasi donasi
    $this->actingAs($this->adminKemanusiaan)
        ->post(route('admin.donasi.verify', $donasi->id), [
            'catatan_verifikasi' => 'Dana masuk di mutasi rekening BSI.',
        ])
        ->assertRedirect(route('admin.donasi'))
        ->assertSessionHas('success');

    $donasi->refresh();
    expect($donasi->status_verifikasi)->toBe(Donasi::STATUS_TERVERIFIKASI);
    expect($donasi->verified_by)->toBe($this->adminKemanusiaan->id);
    expect($donasi->verified_at)->not->toBeNull();
    expect($donasi->catatan_verifikasi)->toBe('Dana masuk di mutasi rekening BSI.');

    // Tepat satu transaksi pemasukan terbentuk
    expect(TransaksiKeuangan::where('donasi_id', $donasi->id)->count())->toBe(1);
    $transaksi = $donasi->transaksi;
    expect($transaksi)->not->toBeNull();
    expect($transaksi->tipe)->toBe(TransaksiKeuangan::TIPE_PEMASUKAN);
    expect($transaksi->nominal)->toBe(500000);
    expect($transaksi->status_transaksi)->toBe(TransaksiKeuangan::STATUS_VALID);

    // Status asuh anak yatim berubah menjadi aktif_diasuh
    expect($this->anakKemanusiaan->fresh()->status_asuh)->toBe(AnakYatim::STATUS_ASUH_AKTIF);

    // Percobaan verifikasi ulang oleh Super Admin atau Admin ditolak (anti duplikasi transaksi)
    $this->actingAs($this->superAdmin)
        ->postJson(route('admin.donasi.verify', $donasi->id))
        ->assertStatus(422);

    expect(TransaksiKeuangan::count())->toBe(1);
    expect(TransaksiKeuangan::saldo())->toBe(500000);
});

test('rejecting a donation updates status to ditolak and does not create any financial transaction', function () {
    $donasi = Donasi::create([
        'kode_donasi' => 'DON-20261103-REJ001',
        'nama_donatur' => 'Donatur Bukti Buram',
        'no_whatsapp' => '081988776655',
        'jenis_donasi' => Donasi::JENIS_DONASI_UMUM,
        'rekening_tujuan' => 'BRI - 0123-01-098765-53-1',
        'nominal' => 250000,
        'status_verifikasi' => Donasi::STATUS_MENUNGGU,
    ]);

    $this->actingAs($this->adminKemanusiaan)
        ->post(route('admin.donasi.reject', $donasi->id), [
            'catatan_verifikasi' => 'Bukti transfer tidak terbaca dan mutasi tidak ditemukan.',
        ])
        ->assertRedirect(route('admin.donasi'))
        ->assertSessionHas('success');

    $donasi->refresh();
    expect($donasi->status_verifikasi)->toBe(Donasi::STATUS_DITOLAK);
    expect($donasi->verified_by)->toBe($this->adminKemanusiaan->id);
    expect($donasi->catatan_verifikasi)->toBe('Bukti transfer tidak terbaca dan mutasi tidak ditemukan.');

    // Tidak ada transaksi keuangan yang dibuat
    expect(TransaksiKeuangan::count())->toBe(0);
    expect(TransaksiKeuangan::saldo())->toBe(0);
    expect(Donasi::totalTerverifikasi())->toBe(0);
});

test('cancelling a verified donation is restricted to super admin and voids the associated transaction', function () {
    $donasi = Donasi::create([
        'kode_donasi' => 'DON-20261103-CAN001',
        'nama_donatur' => 'Bpk. Kurniawan',
        'no_whatsapp' => '081299887766',
        'jenis_donasi' => Donasi::JENIS_ORANG_TUA_ASUH,
        'anak_yatim_id' => $this->anakKemanusiaan->id,
        'rekening_tujuan' => 'BSI - 7256194821',
        'nominal' => 400000,
        'status_verifikasi' => Donasi::STATUS_MENUNGGU,
    ]);

    Donasi::verifikasi($donasi->id, $this->adminKemanusiaan);
    expect(TransaksiKeuangan::saldo())->toBe(400000);
    expect(Donasi::totalTerverifikasi())->toBe(400000);
    expect($this->anakKemanusiaan->fresh()->status_asuh)->toBe(AnakYatim::STATUS_ASUH_AKTIF);

    // 1. Admin biasa DITOLAK (403 Forbidden) ketika mencoba membatalkan donasi terverifikasi
    $this->actingAs($this->adminKemanusiaan)
        ->post(route('admin.donasi.cancel', $donasi->id), [
            'catatan_verifikasi' => 'Coba batalkan sebagai admin',
        ])
        ->assertForbidden();

    expect($donasi->fresh()->status_verifikasi)->toBe(Donasi::STATUS_TERVERIFIKASI);
    expect(TransaksiKeuangan::saldo())->toBe(400000);

    // 2. Super Admin BERHASIL membatalkan donasi terverifikasi
    $this->actingAs($this->superAdmin)
        ->post(route('admin.donasi.cancel', $donasi->id), [
            'catatan_verifikasi' => 'Koreksi salah nominal pencatatan transfer.',
        ])
        ->assertRedirect(route('admin.donasi'))
        ->assertSessionHas('success');

    $donasi->refresh();
    expect($donasi->status_verifikasi)->toBe(Donasi::STATUS_DIBATALKAN);
    expect($donasi->catatan_verifikasi)->toContain('Koreksi salah nominal pencatatan transfer.');

    // Transaksi terkait tidak dihapus tetapi berstatus VOID
    $transaksi = $donasi->transaksi()->first();
    expect($transaksi)->not->toBeNull();
    expect($transaksi->status_transaksi)->toBe(TransaksiKeuangan::STATUS_VOID);

    // Saldo kas dan total donasi terverifikasi kembali menjadi 0
    expect(TransaksiKeuangan::saldo())->toBe(0);
    expect(Donasi::totalTerverifikasi())->toBe(0);

    // Status asuh anak yatim disinkronkan kembali menjadi belum_diasuh
    expect($this->anakKemanusiaan->fresh()->status_asuh)->toBe(AnakYatim::STATUS_ASUH_BELUM);
});

test('bidang authorization prevents admin from accessing or verifying donations of another bidang while super admin accesses all', function () {
    $donasiAnakKemanusiaan = Donasi::create([
        'kode_donasi' => 'DON-BID-KEM01',
        'nama_donatur' => 'Donatur Anak Kemanusiaan',
        'no_whatsapp' => '081111111111',
        'jenis_donasi' => Donasi::JENIS_ORANG_TUA_ASUH,
        'anak_yatim_id' => $this->anakKemanusiaan->id,
        'rekening_tujuan' => 'BSI - 7256194821',
        'nominal' => 300000,
        'status_verifikasi' => Donasi::STATUS_MENUNGGU,
    ]);

    $donasiAnakPendidikan = Donasi::create([
        'kode_donasi' => 'DON-BID-PEN01',
        'nama_donatur' => 'Donatur Anak Pendidikan',
        'no_whatsapp' => '082222222222',
        'jenis_donasi' => Donasi::JENIS_BIMBEL_SINAR,
        'anak_yatim_id' => $this->anakPendidikan->id,
        'rekening_tujuan' => 'BSI - 7256194821',
        'nominal' => 200000,
        'status_verifikasi' => Donasi::STATUS_MENUNGGU,
    ]);

    // 1. Admin Pendidikan TIDAK DAPAT mengakses, memverifikasi, atau menolak donasi khusus anak Kemanusiaan (403)
    $this->actingAs($this->adminPendidikan)
        ->getJson(route('admin.donasi.show', $donasiAnakKemanusiaan->id))
        ->assertForbidden();

    $this->actingAs($this->adminPendidikan)
        ->post(route('admin.donasi.verify', $donasiAnakKemanusiaan->id))
        ->assertForbidden();

    $this->actingAs($this->adminPendidikan)
        ->post(route('admin.donasi.reject', $donasiAnakKemanusiaan->id), [
            'catatan_verifikasi' => 'Tolak lintas bidang',
        ])
        ->assertForbidden();

    // 2. Admin Ekonomi TIDAK DAPAT mengakses donasi anak Pendidikan maupun Kemanusiaan (403)
    $this->actingAs($this->adminEkonomi)
        ->getJson(route('admin.donasi.show', $donasiAnakPendidikan->id))
        ->assertForbidden();

    $this->actingAs($this->adminEkonomi)
        ->post(route('admin.donasi.verify', $donasiAnakPendidikan->id))
        ->assertForbidden();

    // 3. Admin Tanpa Bidang ditolak sepenuhnya (403)
    $this->actingAs($this->adminTanpaBidang)
        ->get(route('admin.donasi'))
        ->assertForbidden();

    // 4. Pada daftar index, Admin Pendidikan hanya melihat donasi anak Pendidikan (bukan donasi anak Kemanusiaan)
    $this->actingAs($this->adminPendidikan)
        ->get(route('admin.donasi'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/donasi/index')
            ->has('donasi.data', 1)
            ->where('donasi.data.0.kode_donasi', 'DON-BID-PEN01')
        );

    // 5. Super Admin dapat melihat dan mengakses seluruh donasi lintas bidang
    $this->actingAs($this->superAdmin)
        ->get(route('admin.donasi'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/donasi/index')
            ->has('donasi.data', 2)
        );

    $this->actingAs($this->superAdmin)
        ->getJson(route('admin.donasi.show', $donasiAnakKemanusiaan->id))
        ->assertOk();

    $this->actingAs($this->superAdmin)
        ->getJson(route('admin.donasi.show', $donasiAnakPendidikan->id))
        ->assertOk();
});

test('proof of transfer file is protected and cannot be accessed without proper authorization', function () {
    $buktiPath = buatFileJpgTest('resi-rahasia.jpg')->storeAs('bukti-transfer/2026/11', 'resi-rahasia.jpg', 'local');

    $donasiAnakKemanusiaan = Donasi::create([
        'kode_donasi' => 'DON-FILE-001',
        'nama_donatur' => 'Donatur Privasi',
        'no_whatsapp' => '081234560000',
        'jenis_donasi' => Donasi::JENIS_ORANG_TUA_ASUH,
        'anak_yatim_id' => $this->anakKemanusiaan->id,
        'rekening_tujuan' => 'BSI - 7256194821',
        'nominal' => 500000,
        'bukti_transfer' => $buktiPath,
        'status_verifikasi' => Donasi::STATUS_MENUNGGU,
    ]);

    // 1. Pengunjung belum login (guest) ditolak / dialihkan ke halaman login
    $this->get(route('admin.donasi.bukti', $donasiAnakKemanusiaan->id))
        ->assertRedirect(route('login'));

    // 2. Admin dari bidang lain yang tidak berwenang (Admin Pendidikan) ditolak dengan 403 Forbidden
    $this->actingAs($this->adminPendidikan)
        ->get(route('admin.donasi.bukti', $donasiAnakKemanusiaan->id))
        ->assertForbidden();

    // 3. Admin Tanpa Bidang ditolak dengan 403 Forbidden
    $this->actingAs($this->adminTanpaBidang)
        ->get(route('admin.donasi.bukti', $donasiAnakKemanusiaan->id))
        ->assertForbidden();

    // 4. Admin Kemanusiaan yang berwenang berhasil mengakses bukti transfer (200 OK)
    $this->actingAs($this->adminKemanusiaan)
        ->get(route('admin.donasi.bukti', $donasiAnakKemanusiaan->id))
        ->assertOk();

    // 5. Super Admin berhasil mengakses bukti transfer (200 OK)
    $this->actingAs($this->superAdmin)
        ->get(route('admin.donasi.bukti', $donasiAnakKemanusiaan->id))
        ->assertOk();
});

test('total donation and financial income do not experience double counting across all donation statuses', function () {
    // 1. Donasi Menunggu (Rp 150.000) -> tidak dihitung
    $donasiMenunggu = Donasi::create([
        'kode_donasi' => 'DON-CALC-001',
        'nama_donatur' => 'Donatur Menunggu',
        'no_whatsapp' => '081100000001',
        'jenis_donasi' => Donasi::JENIS_DONASI_UMUM,
        'rekening_tujuan' => 'BSI - 7256194821',
        'nominal' => 150000,
        'status_verifikasi' => Donasi::STATUS_MENUNGGU,
    ]);

    // 2. Donasi Ditolak (Rp 250.000) -> tidak dihitung
    $donasiDitolak = Donasi::create([
        'kode_donasi' => 'DON-CALC-002',
        'nama_donatur' => 'Donatur Ditolak',
        'no_whatsapp' => '081100000002',
        'jenis_donasi' => Donasi::JENIS_DONASI_UMUM,
        'rekening_tujuan' => 'BSI - 7256194821',
        'nominal' => 250000,
        'status_verifikasi' => Donasi::STATUS_MENUNGGU,
    ]);
    Donasi::tolak($donasiDitolak->id, $this->adminKemanusiaan, 'Resi tidak valid');

    // 3. Donasi Terverifikasi 1 (Rp 500.000) -> dihitung 1x
    $donasiValid1 = Donasi::create([
        'kode_donasi' => 'DON-CALC-003',
        'nama_donatur' => 'Donatur Valid 1',
        'no_whatsapp' => '081100000003',
        'jenis_donasi' => Donasi::JENIS_DONASI_UMUM,
        'rekening_tujuan' => 'BSI - 7256194821',
        'nominal' => 500000,
        'status_verifikasi' => Donasi::STATUS_MENUNGGU,
    ]);
    Donasi::verifikasi($donasiValid1->id, $this->adminKemanusiaan);

    // 4. Donasi Terverifikasi 2 (Rp 300.000) lalu Dibatalkan (Void) -> tidak dihitung
    $donasiVoid = Donasi::create([
        'kode_donasi' => 'DON-CALC-004',
        'nama_donatur' => 'Donatur Void',
        'no_whatsapp' => '081100000004',
        'jenis_donasi' => Donasi::JENIS_ZAKAT,
        'rekening_tujuan' => 'BSI - 7256194821',
        'nominal' => 300000,
        'status_verifikasi' => Donasi::STATUS_MENUNGGU,
    ]);
    Donasi::verifikasi($donasiVoid->id, $this->adminKemanusiaan);
    Donasi::batalkan($donasiVoid->id, $this->superAdmin, 'Salah input nominal');

    // 5. Transaksi pemasukan non-donasi langsung di buku kas (Rp 200.000)
    TransaksiKeuangan::create([
        'kode_transaksi' => 'TRX-MANUAL-001',
        'tipe' => TransaksiKeuangan::TIPE_PEMASUKAN,
        'kategori' => 'Hibah Operasional',
        'nominal' => 200000,
        'tanggal_transaksi' => now()->toDateString(),
        'donasi_id' => null,
        'status_transaksi' => TransaksiKeuangan::STATUS_VALID,
        'keterangan' => 'Hibah operasional yayasan',
        'created_by' => $this->superAdmin->id,
    ]);

    // Total donasi terverifikasi HANYA menghitung donasiValid1 (Rp 500.000)
    expect(Donasi::totalTerverifikasi())->toBe(500000);

    // Total pemasukan kas valid = donasiValid1 (Rp 500.000) + Hibah (Rp 200.000) = Rp 700.000 (tidak double count!)
    $totalPemasukanValid = (int) TransaksiKeuangan::query()->valid()->pemasukan()->sum('nominal');
    expect($totalPemasukanValid)->toBe(700000);
    expect(TransaksiKeuangan::saldo())->toBe(700000);

    // Verifikasi stats yang dikirim ke halaman Inertia admin/donasi/index
    $this->actingAs($this->superAdmin)
        ->get(route('admin.donasi'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('stats.total', 4)
            ->where('stats.menunggu', 1)
            ->where('stats.terverifikasi', 1)
            ->where('stats.ditolak', 1)
            ->where('stats.dibatalkan', 1)
            ->where('stats.total_nominal_terverifikasi', 500000)
            ->where('stats.nominal_menunggu', 150000)
        );
});

test('admin can manually record donation for authorized child, cannot tamper with other bidang child, and can filter donations', function () {
    // 1. Admin Pendidikan ditolak (403) jika mencoba mencatat donasi untuk anak bidang Kemanusiaan
    $this->actingAs($this->adminPendidikan)
        ->post(route('admin.donasi.store'), [
            'nama_donatur' => 'Donatur Tampering',
            'no_whatsapp' => '081234567890',
            'jenis_donasi' => Donasi::JENIS_ORANG_TUA_ASUH,
            'anak_yatim_id' => $this->anakKemanusiaan->id,
            'rekening_tujuan' => 'BSI - 7256194821',
            'nominal' => 200000,
            'bukti_transfer' => buatFileJpgTest('bukti-admin.jpg'),
        ])
        ->assertForbidden();

    // 2. Admin Pendidikan berhasil mencatat donasi untuk anak binaan di bidangnya sendiri
    $this->actingAs($this->adminPendidikan)
        ->post(route('admin.donasi.store'), [
            'nama_donatur' => 'Ibu Kartika Sari',
            'no_whatsapp' => '081234567899',
            'jenis_donasi' => Donasi::JENIS_BIMBEL_SINAR,
            'anak_yatim_id' => $this->anakPendidikan->id,
            'rekening_tujuan' => 'BSI - 7256194821',
            'nominal' => 275000,
            'bukti_transfer' => buatFileJpgTest('bukti-bimbel.jpg'),
        ])
        ->assertRedirect(route('admin.donasi'))
        ->assertSessionHas('success');

    // 3. Filter pencarian berdasarkan nama donatur dan jenis donasi
    $this->actingAs($this->superAdmin)
        ->get(route('admin.donasi', [
            'search' => 'Kartika',
            'jenis_donasi' => Donasi::JENIS_BIMBEL_SINAR,
            'status_verifikasi' => Donasi::STATUS_MENUNGGU,
        ]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('donasi.data', 1)
            ->where('donasi.data.0.nama_donatur', 'Ibu Kartika Sari')
            ->where('donasi.data.0.nominal', 275000)
        );
});
