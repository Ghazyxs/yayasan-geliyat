<?php

use App\Models\AnakYatim;
use App\Models\Bidang;
use App\Models\Donasi;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

function buatPdfTest(string $filename = 'dokumen.pdf'): UploadedFile
{
    return UploadedFile::fake()->createWithContent(
        $filename,
        "%PDF-1.4\n1 0 obj<<>>endobj\ntrailer<<>>\n%%EOF"
    );
}

function buatJpgAnakTest(string $filename = 'foto.jpg'): UploadedFile
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
        'no_kk' => '3273000011112222',
        'nama_lengkap' => 'Rizky Ramadhan',
        'anak_ke' => 1,
        'jenis_kelamin' => 'L',
        'status_santunan' => AnakYatim::STATUS_SANTUNAN_MENERIMA,
        'tempat_lahir' => 'Bandung',
        'tanggal_lahir' => '2014-08-17',
        'jenjang' => 'SD',
        'kelurahan' => 'Cigending',
        'alamat_detail' => 'Jl. Cigending Raya No. 12 RT 01 RW 04',
        'nama_ibu_kandung' => 'Ibu Aminah',
        'no_telepon' => '081234567890',
        'nama_wali' => 'Ibu Aminah',
        'no_telepon_wali' => '081234567890',
        'status_binaan' => 'aktif',
    ], $overrides);
}

test('super admin can perform full crud with private document uploads and encrypted nik & no_kk', function () {
    $payload = payloadAnakValid([
        'bidang_ids' => [$this->bidangKemanusiaan->id, $this->bidangPendidikan->id],
        'foto_anak' => buatJpgAnakTest('foto-anak.jpg'),
        'foto_kk' => buatPdfTest('kk.pdf'),
        'foto_akta_kelahiran' => buatJpgAnakTest('akta-lahir.jpg'),
        'foto_akta_kematian_ayah' => buatPdfTest('akta-kematian.pdf'),
    ]);

    $this->actingAs($this->superAdmin)
        ->post(route('admin.anak-yatim.store'), $payload)
        ->assertRedirect(route('admin.anak-yatim'))
        ->assertSessionHas('success');

    $anak = AnakYatim::where('nama_lengkap', 'Rizky Ramadhan')->firstOrFail();
    expect($anak->anak_ke)->toBe(1);
    expect($anak->status_santunan)->toBe(AnakYatim::STATUS_SANTUNAN_MENERIMA);
    expect($anak->tempat_lahir)->toBe('Bandung');
    expect($anak->nama_ibu_kandung)->toBe('Ibu Aminah');
    expect($anak->foto)->not->toBeNull();
    expect($anak->foto_kk)->not->toBeNull();
    expect($anak->foto_akta_kelahiran)->not->toBeNull();
    expect($anak->foto_akta_kematian_ayah)->not->toBeNull();

    Storage::disk('local')->assertExists($anak->foto);
    Storage::disk('local')->assertExists($anak->foto_kk);
    Storage::disk('local')->assertExists($anak->foto_akta_kelahiran);
    Storage::disk('local')->assertExists($anak->foto_akta_kematian_ayah);

    // Index menyembunyikan NIK, No KK, alamat detail & path disk internal
    $this->actingAs($this->superAdmin)
        ->get(route('admin.anak-yatim'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/anak-yatim/index')
            ->has('anakYatim.data', 1)
            ->where('anakYatim.data.0.nama_lengkap', 'Rizky Ramadhan')
            ->where('stats.sd', 1)
            ->missing('anakYatim.data.0.nik')
            ->missing('anakYatim.data.0.no_kk')
            ->missing('anakYatim.data.0.alamat_detail')
        );

    // Show mengembalikan detail tanpa NIK, No KK & alamat_detail
    $showRes = $this->actingAs($this->superAdmin)
        ->getJson(route('admin.anak-yatim.show', $anak))
        ->assertOk();
    expect(array_key_exists('nik', $showRes->json('data')))->toBeFalse();
    expect(array_key_exists('no_kk', $showRes->json('data')))->toBeFalse();
    expect(array_key_exists('alamat_detail', $showRes->json('data')))->toBeFalse();

    // Sensitive mengembalikan NIK, No KK & alamat_detail terdekripsi
    $sensitiveRes = $this->actingAs($this->superAdmin)
        ->getJson(route('admin.anak-yatim.sensitive', $anak))
        ->assertOk();
    expect($sensitiveRes->json('data.nik'))->toBe('3273123456780001');
    expect($sensitiveRes->json('data.no_kk'))->toBe('3273000011112222');
    expect($sensitiveRes->json('data.alamat_detail'))->toBe('Jl. Cigending Raya No. 12 RT 01 RW 04');

    // Dokumen privat hanya dapat diakses sesuai hak akses
    $this->actingAs($this->superAdmin)
        ->get(route('admin.anak-yatim.dokumen', [$anak->id, 'foto']))
        ->assertOk();
    $this->actingAs($this->superAdmin)
        ->get(route('admin.anak-yatim.dokumen', [$anak->id, 'kk']))
        ->assertOk();
    $this->actingAs($this->adminPendidikan)
        ->get(route('admin.anak-yatim.dokumen', [$anak->id, 'foto']))
        ->assertOk();
    $this->actingAs($this->adminPendidikan)
        ->get(route('admin.anak-yatim.dokumen', [$anak->id, 'kk']))
        ->assertForbidden();

    // Update jenjang SMA/SMK tanpa menghapus data sensitif ketika update_sensitive = false
    $updatePayload = payloadAnakValid([
        'nama_lengkap' => 'Rizky Ramadhan Putra',
        'anak_ke' => 2,
        'status_santunan' => AnakYatim::STATUS_SANTUNAN_MENUNGGU,
        'jenjang' => 'SMA/SMK',
        'update_sensitive' => false,
    ]);

    $this->actingAs($this->superAdmin)
        ->put(route('admin.anak-yatim.update', $anak), $updatePayload)
        ->assertRedirect(route('admin.anak-yatim'))
        ->assertSessionHas('success');

    $anak->refresh();
    expect($anak->nama_lengkap)->toBe('Rizky Ramadhan Putra');
    expect($anak->anak_ke)->toBe(2);
    expect($anak->status_santunan)->toBe(AnakYatim::STATUS_SANTUNAN_MENUNGGU);
    expect($anak->jenjang)->toBe('SMA/SMK');
    expect($anak->nik)->toBe('3273123456780001');
    expect($anak->no_kk)->toBe('3273000011112222');

    // Delete oleh Super Admin sekaligus membersihkan dokumen lokal
    $oldFoto = $anak->foto;
    $this->actingAs($this->superAdmin)
        ->delete(route('admin.anak-yatim.destroy', $anak))
        ->assertRedirect(route('admin.anak-yatim'))
        ->assertSessionHas('success');

    expect(AnakYatim::find($anak->id))->toBeNull();
    Storage::disk('local')->assertMissing($oldFoto);
});

test('admin can perform crud only within their own bidang and cannot access other bidang', function () {
    $this->actingAs($this->adminKemanusiaan)
        ->post(route('admin.anak-yatim.store'), payloadAnakValid([
            'nama_lengkap' => 'Siti Aisyah',
            'jenis_kelamin' => 'P',
        ]))
        ->assertRedirect(route('admin.anak-yatim'))
        ->assertSessionHas('success');

    $anakKemanusiaan = AnakYatim::where('nama_lengkap', 'Siti Aisyah')->firstOrFail();
    expect($anakKemanusiaan->terhubungKeBidang($this->bidangKemanusiaan->id))->toBeTrue();

    $this->actingAs($this->adminPendidikan)
        ->post(route('admin.anak-yatim.store'), payloadAnakValid([
            'nama_lengkap' => 'Bima Sakti',
        ]))
        ->assertRedirect(route('admin.anak-yatim'));

    $anakPendidikan = AnakYatim::where('nama_lengkap', 'Bima Sakti')->firstOrFail();

    $this->actingAs($this->adminKemanusiaan)
        ->get(route('admin.anak-yatim'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('anakYatim.data', 1)
            ->where('anakYatim.data.0.nama_lengkap', 'Siti Aisyah')
        );

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

    $this->actingAs($this->adminKemanusiaan)
        ->post(route('admin.anak-yatim.store'), payloadAnakValid([
            'nama_lengkap' => 'Anak Tampered',
            'bidang_ids' => [$this->bidangPendidikan->id],
        ]))
        ->assertForbidden();

    $this->actingAs($this->adminTanpaBidang)
        ->get(route('admin.anak-yatim'))
        ->assertForbidden();
});

test('nik and no_kk are encrypted in database and validation rejects invalid input', function () {
    $this->actingAs($this->superAdmin)
        ->post(route('admin.anak-yatim.store'), [
            'nik' => '12345',
            'no_kk' => '999',
            'nama_lengkap' => '',
            'anak_ke' => 0,
            'jenis_kelamin' => 'X',
            'status_santunan' => 'invalid',
            'tempat_lahir' => '',
            'tanggal_lahir' => now()->addDays(5)->format('Y-m-d'),
            'jenjang' => 'TK',
            'kelurahan' => '',
            'nama_ibu_kandung' => '',
            'nama_wali' => '',
        ])
        ->assertSessionHasErrors([
            'nik',
            'no_kk',
            'nama_lengkap',
            'anak_ke',
            'jenis_kelamin',
            'status_santunan',
            'tempat_lahir',
            'tanggal_lahir',
            'jenjang',
            'kelurahan',
            'nama_ibu_kandung',
            'nama_wali',
        ]);

    $plainNik = '3273888899990005';
    $plainKk = '3273777766660009';
    $this->actingAs($this->superAdmin)
        ->post(route('admin.anak-yatim.store'), payloadAnakValid([
            'nik' => $plainNik,
            'no_kk' => $plainKk,
            'nama_lengkap' => 'Farhan Maulana',
            'jenjang' => 'Lainnya',
            'bidang_ids' => [$this->bidangKemanusiaan->id],
        ]))
        ->assertRedirect(route('admin.anak-yatim'));

    $anak = AnakYatim::where('nama_lengkap', 'Farhan Maulana')->firstOrFail();
    $rawRow = DB::table('anak_yatim')->where('id', $anak->id)->first();

    expect($rawRow->nik)->not->toBe($plainNik);
    expect($rawRow->no_kk)->not->toBe($plainKk);
    expect(Crypt::decryptString($rawRow->nik))->toBe($plainNik);
    expect(Crypt::decryptString($rawRow->no_kk))->toBe($plainKk);
    expect($anak->nik)->toBe($plainNik);
    expect($anak->no_kk)->toBe($plainKk);
});

test('stats count by jenjang and jenis_kelamin filter works accurately', function () {
    $jenjangPool = ['SD', 'SD', 'SMP', 'SMA/SMK', 'Perguruan Tinggi'];
    foreach ($jenjangPool as $idx => $j) {
        $anak = AnakYatim::create(array_merge(payloadAnakValid([
            'nama_lengkap' => sprintf('Anak Binaan %02d', $idx + 1),
            'jenis_kelamin' => $idx % 2 === 0 ? 'L' : 'P',
            'jenjang' => $j,
        ]), ['created_by' => $this->superAdmin->id]));
        $anak->bidang()->attach($this->bidangKemanusiaan->id);
    }

    $this->actingAs($this->adminKemanusiaan)
        ->get(route('admin.anak-yatim'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('stats.sd', 2)
            ->where('stats.smp', 1)
            ->where('stats.sma', 1)
            ->where('stats.perguruan_tinggi', 1)
        );

    // Filter jenis kelamin Perempuan -> 2 anak (index 1, 3)
    $this->actingAs($this->adminKemanusiaan)
        ->get(route('admin.anak-yatim', ['jenis_kelamin' => 'P']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('anakYatim.data', 2)
            ->where('anakYatim.total', 2)
        );

    // Filter jenjang SMA/SMK -> 1 anak
    $this->actingAs($this->adminKemanusiaan)
        ->get(route('admin.anak-yatim', ['jenjang' => 'SMA/SMK']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('anakYatim.data', 1)
            ->where('anakYatim.data.0.jenjang', 'SMA/SMK')
        );
});

test('deletion is blocked when child has donation history to preserve financial audit trail', function () {
    $anak = AnakYatim::create(array_merge(payloadAnakValid([
        'nama_lengkap' => 'Zaidan Alfarizi',
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

    $this->actingAs($this->superAdmin)
        ->from(route('admin.anak-yatim'))
        ->delete(route('admin.anak-yatim.destroy', $anak))
        ->assertRedirect(route('admin.anak-yatim'))
        ->assertSessionHas('error');

    expect(AnakYatim::find($anak->id))->not->toBeNull();
    expect(Donasi::where('anak_yatim_id', $anak->id)->count())->toBe(1);
});
