<?php

use App\Models\AnakYatim;
use App\Models\Bidang;
use App\Models\Donasi;
use App\Models\Kegiatan;
use App\Models\TransaksiKeuangan;
use App\Models\User;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;

test('master bidang is populated by migration and has predefined codes', function () {
    expect(Bidang::count())->toBe(4);
    expect(Bidang::where('kode', Bidang::KEMANUSIAAN)->first()->nama)->toBe('Bidang Kemanusiaan & Yatim');
    expect(Bidang::where('kode', Bidang::PENDIDIKAN)->first()->nama)->toBe('Bidang Pendidikan');
    expect(Bidang::where('kode', Bidang::KEAGAMAAN)->first()->nama)->toBe('Bidang Keagamaan');
    expect(Bidang::where('kode', Bidang::EKONOMI)->first()->nama)->toBe('Bidang Ekonomi & Koperasi');
});

test('user belongs to bidang and bidang has many users', function () {
    $bidang = Bidang::where('kode', Bidang::KEMANUSIAAN)->firstOrFail();

    $admin = User::create([
        'name' => 'Admin Kemanusiaan',
        'email' => 'admin.test@geliyat.or.id',
        'password' => 'secret123',
        'role' => 'admin',
        'bidang_id' => $bidang->id,
        'is_active' => true,
    ]);

    $superAdmin = User::create([
        'name' => 'Ketua Yayasan',
        'email' => 'ketua.test@geliyat.or.id',
        'password' => 'secret123',
        'role' => 'super_admin',
        'bidang_id' => null,
        'is_active' => true,
    ]);

    expect($admin->bidang)->not->toBeNull();
    expect($admin->bidang->id)->toBe($bidang->id);
    expect($admin->bidang->kode)->toBe('kemanusiaan');
    expect($superAdmin->bidang)->toBeNull();
    expect($bidang->users)->toHaveCount(1);
    expect($bidang->users->first()->id)->toBe($admin->id);
});

test('anak yatim has many to many relation with bidang via anak_yatim_bidang pivot', function () {
    $user = User::create([
        'name' => 'Staff Yatim',
        'email' => 'staff@geliyat.or.id',
        'password' => 'secret123',
        'role' => 'admin',
        'is_active' => true,
    ]);

    $bidangPendidikan = Bidang::where('kode', Bidang::PENDIDIKAN)->firstOrFail();
    $bidangKemanusiaan = Bidang::where('kode', Bidang::KEMANUSIAAN)->firstOrFail();

    $anak = AnakYatim::create([
        'nik' => '3273123456780001',
        'nama_lengkap' => 'Muhammad Fikri Ramadhan',
        'alias' => 'F.R.',
        'jenis_kelamin' => 'L',
        'tanggal_lahir' => '2014-05-12',
        'jenjang' => 'SD',
        'kelas' => 'Kelas 4 SD',
        'nama_sekolah' => 'SDN Ujungberung 1',
        'kelurahan' => 'Cigending',
        'alamat_detail' => 'Jl. Nagrog No. 12',
        'nama_wali' => 'Ibu Maryam',
        'status_binaan' => 'aktif',
        'status_asuh' => 'belum_diasuh',
        'created_by' => $user->id,
    ]);

    // Attach to 2 bidang with pivot note
    $anak->bidang()->attach($bidangPendidikan->id, ['catatan_program' => 'Penerima modul Bimbel Sinar']);
    $anak->bidang()->attach($bidangKemanusiaan->id, ['catatan_program' => 'Penerima santunan bulanan']);

    expect($anak->bidang)->toHaveCount(2);
    expect($anak->terhubungKeBidang($bidangPendidikan->id))->toBeTrue();
    expect($anak->terhubungKeBidang($bidangKemanusiaan->id))->toBeTrue();

    // Check inverse relation
    expect($bidangPendidikan->anakYatim)->toHaveCount(1);
    expect($bidangPendidikan->anakYatim->first()->pivot->catatan_program)->toBe('Penerima modul Bimbel Sinar');

    // Test unique constraint on pivot (cannot attach duplicate)
    expect(function () use ($anak, $bidangPendidikan) {
        $anak->bidang()->attach($bidangPendidikan->id);
    })->toThrow(Exception::class);
});

test('nik is encrypted in database and hidden from serialization', function () {
    $user = User::create([
        'name' => 'Staff',
        'email' => 'staff2@geliyat.or.id',
        'password' => 'secret123',
        'role' => 'admin',
        'is_active' => true,
    ]);

    $anak = AnakYatim::create([
        'nik' => '3273999988880002',
        'nama_lengkap' => 'Aisyah Putri',
        'alias' => 'A.P.',
        'jenis_kelamin' => 'P',
        'tanggal_lahir' => '2015-08-10',
        'jenjang' => 'SD',
        'kelas' => 'Kelas 3 SD',
        'kelurahan' => 'Pasanggrahan',
        'alamat_detail' => 'Kp. Babakan RT 01',
        'nama_wali' => 'Bapak Ahmad',
        'created_by' => $user->id,
    ]);

    // In model: decrypted
    expect($anak->nik)->toBe('3273999988880002');

    // In raw database row: NOT plain text (must be encrypted ciphertext)
    $rawRow = DB::table('anak_yatim')->where('id', $anak->id)->first();
    expect($rawRow->nik)->not->toBe('3273999988880002');
    expect(strlen($rawRow->nik))->toBeGreaterThan(50);
    expect(Crypt::decryptString($rawRow->nik))->toBe('3273999988880002');

    // Fresh query from Eloquent decrypts automatically
    $freshAnak = AnakYatim::find($anak->id);
    expect($freshAnak->nik)->toBe('3273999988880002');

    // In serialization (JSON / toArray): NIK and alamat_detail are hidden
    $array = $freshAnak->toArray();
    expect(array_key_exists('nik', $array))->toBeFalse();
    expect(array_key_exists('alamat_detail', $array))->toBeFalse();
    expect(array_key_exists('alias', $array))->toBeTrue();
    expect(array_key_exists('nama_lengkap', $array))->toBeTrue();

    // In json_encode: ciphertext or plaintext NIK never appears
    $json = json_encode($freshAnak);
    expect(str_contains($json, '3273999988880002'))->toBeFalse();
    expect(str_contains($json, 'Kp. Babakan RT 01'))->toBeFalse();
});

test('donasi and transaksi keuangan one-to-one relation and lifecycle', function () {
    $verifikator = User::create([
        'name' => 'Bendahara',
        'email' => 'bendahara@geliyat.or.id',
        'password' => 'secret123',
        'role' => 'admin',
        'is_active' => true,
    ]);

    $donasi = Donasi::create([
        'kode_donasi' => 'DON-TEST-001',
        'nama_donatur' => 'Bpk. Ridwan',
        'no_whatsapp' => '08123456789',
        'jenis_donasi' => 'Donasi Umum',
        'rekening_tujuan' => 'BSI - 7256194821',
        'nominal' => 500000,
        'status_verifikasi' => 'menunggu',
    ]);

    expect($donasi->transaksi)->toBeNull();

    // Verifikasi donasi
    $verified = Donasi::verifikasi($donasi->id, $verifikator);
    expect($verified->status_verifikasi)->toBe('terverifikasi');
    expect($verified->verified_by)->toBe($verifikator->id);
    expect($verified->transaksi)->not->toBeNull();
    expect($verified->transaksi->tipe)->toBe('pemasukan');
    expect($verified->transaksi->nominal)->toBe(500000);
    expect($verified->transaksi->status_transaksi)->toBe('valid');
    expect(TransaksiKeuangan::saldo())->toBe(500000);

    // Inverse relation
    expect($verified->transaksi->donasi->id)->toBe($donasi->id);
    expect($verified->transaksi->pencatat->id)->toBe($verifikator->id);

    // Pembatalan donasi: transaksi di-void
    $dibatalkan = Donasi::batalkan($donasi->id, $verifikator, 'Salah transfer rekening');
    expect($dibatalkan->status_verifikasi)->toBe('dibatalkan');
    expect($dibatalkan->transaksi->fresh()->status_transaksi)->toBe('void');
    // Saldo setelah void harus kembali 0
    expect(TransaksiKeuangan::saldo())->toBe(0);

    // Penolakan donasi: donasi ditolak tidak menyentuh transaksi kas sama sekali
    $donasi2 = Donasi::create([
        'kode_donasi' => 'DON-TEST-002',
        'nama_donatur' => 'Donatur Palsu',
        'no_whatsapp' => '08999999999',
        'jenis_donasi' => 'Donasi Umum',
        'rekening_tujuan' => 'BSI - 7256194821',
        'nominal' => 1000000,
        'status_verifikasi' => 'menunggu',
    ]);

    $ditolak = Donasi::tolak($donasi2->id, $verifikator, 'Bukti transfer fiktif');
    expect($ditolak->status_verifikasi)->toBe('ditolak');
    expect($ditolak->transaksi)->toBeNull();
    expect(TransaksiKeuangan::saldo())->toBe(0);
});

test('kegiatan belongs to bidang and user', function () {
    $user = User::create([
        'name' => 'Koordinator',
        'email' => 'koor@geliyat.or.id',
        'password' => 'secret123',
        'role' => 'admin',
        'is_active' => true,
    ]);

    $bidang = Bidang::where('kode', Bidang::PENDIDIKAN)->firstOrFail();

    $kegiatan = Kegiatan::create([
        'judul' => 'Bimbel Rutin SD',
        'bidang_id' => $bidang->id,
        'kategori' => 'Pendidikan',
        'deskripsi' => 'Belajar matematika',
        'lokasi' => 'Cigending',
        'tanggal_kegiatan' => '2026-11-10',
        'created_by' => $user->id,
    ]);

    expect($kegiatan->bidang->id)->toBe($bidang->id);
    expect($kegiatan->pembuat->id)->toBe($user->id);
    expect($bidang->kegiatan)->toHaveCount(1);
    expect($user->kegiatanDibuat)->toHaveCount(1);
});
