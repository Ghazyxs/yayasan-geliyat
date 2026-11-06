<?php

use App\Models\Bidang;
use App\Models\Donasi;
use App\Models\RekeningYayasan;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

function buatFileJpgTestRekening(string $filename = 'bukti.jpg'): UploadedFile
{
    $jpegBytes = "\xFF\xD8\xFF\xE0\x00\x10JFIF\x00\x01\x01\x01\x00\x60\x00\x60\x00\x00\xFF\xDB\x00\x43\x00"
        .str_repeat("\x08", 64)
        ."\xFF\xC0\x00\x0B\x08\x00\x01\x00\x01\x01\x01\x11\x00\xFF\xDA\x00\x08\x01\x01\x00\x00\x3F\x00\xD2\xCF\x20\xFF\xD9";

    return UploadedFile::fake()->createWithContent($filename, $jpegBytes);
}

beforeEach(function () {
    Storage::fake('local');

    $this->bidangKemanusiaan = Bidang::where('kode', Bidang::KEMANUSIAAN)->firstOrFail();

    $this->superAdmin = User::create([
        'name' => 'Ketua Yayasan',
        'email' => 'ketua.rekening@geliyat.or.id',
        'password' => 'secret123',
        'role' => 'super_admin',
        'bidang_id' => null,
        'is_active' => true,
    ]);

    $this->adminBiasa = User::create([
        'name' => 'Admin Kemanusiaan',
        'email' => 'admin.rekening@geliyat.or.id',
        'password' => 'secret123',
        'role' => 'admin',
        'bidang_id' => $this->bidangKemanusiaan->id,
        'is_active' => true,
    ]);
});

test('super admin can access rekening index page but regular admin is forbidden', function () {
    // Super Admin OK
    $this->actingAs($this->superAdmin)
        ->get(route('admin.rekening'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/rekening/index')
            ->has('rekeningList')
            ->has('stats')
        );

    // Admin biasa 403
    $this->actingAs($this->adminBiasa)
        ->get(route('admin.rekening'))
        ->assertForbidden();
});

test('super admin can create new active bank account with unique account number', function () {
    $response = $this->actingAs($this->superAdmin)
        ->post(route('admin.rekening.store'), [
            'nama_bank' => 'Bank Syariah Indonesia (BSI)',
            'nomor_rekening' => '7256194821',
            'atas_nama' => 'Yayasan Geliyat Mahdiesa Nahate',
            'icon' => 'BSI',
            'is_active' => true,
            'catatan' => 'Rekening utama penampung donasi',
        ]);

    $response->assertRedirect(route('admin.rekening'))
        ->assertSessionHas('success');

    $this->assertDatabaseHas('rekening_yayasan', [
        'nama_bank' => 'Bank Syariah Indonesia (BSI)',
        'nomor_rekening' => '7256194821',
        'is_active' => 1,
        'created_by' => $this->superAdmin->id,
    ]);

    // Duplikat nomor rekening harus ditolak
    $duplicate = $this->actingAs($this->superAdmin)
        ->post(route('admin.rekening.store'), [
            'nama_bank' => 'Bank Syariah Indonesia (BSI) Cabang Lain',
            'nomor_rekening' => '7256194821',
            'atas_nama' => 'Yayasan Geliyat Mahdiesa Nahate',
        ]);

    $duplicate->assertSessionHasErrors('nomor_rekening');
});

test('regular admin cannot create or modify bank accounts', function () {
    $rekening = RekeningYayasan::create([
        'nama_bank' => 'Bank Mandiri',
        'nomor_rekening' => '1310012345678',
        'atas_nama' => 'Yayasan Geliyat',
        'is_active' => true,
        'created_by' => $this->superAdmin->id,
    ]);

    // Admin coba buat rekening -> 403
    $this->actingAs($this->adminBiasa)
        ->post(route('admin.rekening.store'), [
            'nama_bank' => 'Bank BNI',
            'nomor_rekening' => '0987654321',
            'atas_nama' => 'Yayasan Geliyat',
        ])
        ->assertForbidden();

    // Admin coba edit rekening -> 403
    $this->actingAs($this->adminBiasa)
        ->put(route('admin.rekening.update', $rekening), [
            'nama_bank' => 'Bank Mandiri Edit',
            'nomor_rekening' => '1310012345678',
            'atas_nama' => 'Yayasan Geliyat',
        ])
        ->assertForbidden();

    // Admin coba toggle status -> 403
    $this->actingAs($this->adminBiasa)
        ->patch(route('admin.rekening.toggle-active', $rekening))
        ->assertForbidden();

    // Admin coba hapus rekening -> 403
    $this->actingAs($this->adminBiasa)
        ->delete(route('admin.rekening.destroy', $rekening))
        ->assertForbidden();
});

test('super admin can update and toggle active status of a bank account', function () {
    $rekening = RekeningYayasan::create([
        'nama_bank' => 'Bank Mandiri',
        'nomor_rekening' => '1310012345678',
        'atas_nama' => 'Yayasan Geliyat',
        'is_active' => true,
        'created_by' => $this->superAdmin->id,
    ]);

    // Update data
    $this->actingAs($this->superAdmin)
        ->put(route('admin.rekening.update', $rekening), [
            'nama_bank' => 'Bank Mandiri Syariah',
            'nomor_rekening' => '1310012345678',
            'atas_nama' => 'Yayasan Geliyat Mahdiesa Nahate',
            'icon' => 'MANDIRI',
            'is_active' => true,
        ])
        ->assertRedirect(route('admin.rekening'))
        ->assertSessionHas('success');

    expect($rekening->refresh()->nama_bank)->toBe('Bank Mandiri Syariah');

    // Toggle active -> nonaktif
    $this->actingAs($this->superAdmin)
        ->patch(route('admin.rekening.toggle-active', $rekening))
        ->assertRedirect(route('admin.rekening'))
        ->assertSessionHas('success');

    expect($rekening->refresh()->is_active)->toBeFalse();

    // Toggle active -> aktif kembali
    $this->actingAs($this->superAdmin)
        ->patch(route('admin.rekening.toggle-active', $rekening))
        ->assertRedirect(route('admin.rekening'))
        ->assertSessionHas('success');

    expect($rekening->refresh()->is_active)->toBeTrue();
});

test('inactive bank account cannot be selected for new donations', function () {
    $rekeningNonaktif = RekeningYayasan::create([
        'nama_bank' => 'Bank Muamalat',
        'nomor_rekening' => '9998887776',
        'atas_nama' => 'Yayasan Geliyat',
        'is_active' => false,
        'created_by' => $this->superAdmin->id,
    ]);

    $buktiFile = buatFileJpgTestRekening('bukti-test.jpg');

    // Donasi publik dengan rekening_id nonaktif harus ditolak
    $response = $this->post(route('donasi.store'), [
        'nama_donatur' => 'Donatur Hamba Allah',
        'no_whatsapp' => '081234567899',
        'jenis_donasi' => Donasi::JENIS_DONASI_UMUM,
        'rekening_id' => $rekeningNonaktif->id,
        'rekening_tujuan' => "Bank Muamalat - 9998887776",
        'nominal' => 50000,
        'bukti_transfer' => $buktiFile,
    ]);

    $response->assertSessionHasErrors();
    $this->assertDatabaseMissing('donasi', [
        'nama_donatur' => 'Donatur Hamba Allah',
        'rekening_id' => $rekeningNonaktif->id,
    ]);
});

test('donation creates permanent snapshot of bank account details', function () {
    $rekening = RekeningYayasan::create([
        'nama_bank' => 'Bank Syariah Indonesia (BSI)',
        'nomor_rekening' => '7256194821',
        'atas_nama' => 'Yayasan Geliyat Mahdiesa Nahate',
        'icon' => 'BSI',
        'is_active' => true,
        'created_by' => $this->superAdmin->id,
    ]);

    $buktiFile = buatFileJpgTestRekening('bukti-snapshot.jpg');

    $this->post(route('donasi.store'), [
        'nama_donatur' => 'Ahmad Fauzi',
        'no_whatsapp' => '081234567888',
        'jenis_donasi' => Donasi::JENIS_DONASI_UMUM,
        'rekening_id' => $rekening->id,
        'rekening_tujuan' => 'Bank Syariah Indonesia (BSI) - 7256194821',
        'nominal' => 100000,
        'bukti_transfer' => $buktiFile,
    ])->assertRedirect(route('donasi'))->assertSessionHas('success');

    $donasi = Donasi::where('nama_donatur', 'Ahmad Fauzi')->firstOrFail();

    // Verifikasi snapshot tersimpan
    expect($donasi->rekening_id)->toBe($rekening->id)
        ->and($donasi->rekening_nama_bank)->toBe('Bank Syariah Indonesia (BSI)')
        ->and($donasi->rekening_nomor)->toBe('7256194821')
        ->and($donasi->rekening_atas_nama)->toBe('Yayasan Geliyat Mahdiesa Nahate');

    // Ubah master rekening di kemudian hari
    $rekening->update([
        'nama_bank' => 'BSI KCP Ujungberung',
        'nomor_rekening' => '7256199999',
    ]);

    // Data snapshot pada donasi lama TIDAK BOLEH BERUBAH
    $donasiLama = $donasi->fresh();
    expect($donasiLama->rekening_nama_bank)->toBe('Bank Syariah Indonesia (BSI)')
        ->and($donasiLama->rekening_nomor)->toBe('7256194821');
});

test('bank account that has been used in donations cannot be deleted physically', function () {
    $rekening = RekeningYayasan::create([
        'nama_bank' => 'Bank Syariah Indonesia (BSI)',
        'nomor_rekening' => '7256194821',
        'atas_nama' => 'Yayasan Geliyat',
        'is_active' => true,
        'created_by' => $this->superAdmin->id,
    ]);

    // Buat donasi yang merujuk rekening ini
    Donasi::create([
        'kode_donasi' => Donasi::generateKodeDonasi(),
        'nama_donatur' => 'Hamba Allah',
        'no_whatsapp' => '081234567890',
        'jenis_donasi' => Donasi::JENIS_DONASI_UMUM,
        'rekening_id' => $rekening->id,
        'rekening_nama_bank' => $rekening->nama_bank,
        'rekening_nomor' => $rekening->nomor_rekening,
        'rekening_atas_nama' => $rekening->atas_nama,
        'rekening_tujuan' => "{$rekening->nama_bank} - {$rekening->nomor_rekening}",
        'nominal' => 50000,
        'status_verifikasi' => Donasi::STATUS_MENUNGGU,
    ]);

    // Super Admin mencoba menghapus rekening yang sudah terpakai
    $response = $this->actingAs($this->superAdmin)
        ->delete(route('admin.rekening.destroy', $rekening));

    // Harus ditolak dan dialihkan dengan pesan error edukatif
    $response->assertRedirect(route('admin.rekening'))
        ->assertSessionHas('error');

    // Pastikan rekening tetap ada di database
    $this->assertDatabaseHas('rekening_yayasan', [
        'id' => $rekening->id,
    ]);
});

test('bank account without any donations can be safely deleted by super admin', function () {
    $rekening = RekeningYayasan::create([
        'nama_bank' => 'Bank Salah Input',
        'nomor_rekening' => '0000000000',
        'atas_nama' => 'Yayasan Geliyat',
        'is_active' => true,
        'created_by' => $this->superAdmin->id,
    ]);

    $this->actingAs($this->superAdmin)
        ->delete(route('admin.rekening.destroy', $rekening))
        ->assertRedirect(route('admin.rekening'))
        ->assertSessionHas('success');

    $this->assertDatabaseMissing('rekening_yayasan', [
        'id' => $rekening->id,
    ]);
});

