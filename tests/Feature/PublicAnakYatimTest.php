<?php

use App\Models\AnakYatim;
use App\Models\Bidang;
use App\Models\User;
use Database\Seeders\AnakYatimSeeder;
use Database\Seeders\DatabaseSeeder;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->seed(DatabaseSeeder::class);
    $this->seed(AnakYatimSeeder::class);
});

test('public anak yatim index page displays active children from database without sensitive data', function () {
    $totalAktif = AnakYatim::where('status_binaan', 'aktif')->count();
    expect($totalAktif)->toBeGreaterThanOrEqual(6);

    $response = $this->get(route('anak-yatim'));

    $response->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('public/anak-yatim')
            ->has('anakList', $totalAktif)
            ->has('anakList.0', fn (Assert $item) => $item
                ->has('id')
                ->has('nama_publik')
                ->has('tempat_tanggal_lahir')
                ->has('jenjang')
                ->has('kelas')
                ->has('usia')
                ->has('kelompok_usia')
                ->has('potensi')
                ->has('izin_publikasi_foto')
                ->has('foto')
                ->missing('nik')
                ->missing('alamat_detail')
                ->missing('nama_lengkap')
                ->missing('nama_wali')
                ->missing('no_telepon_wali')
                ->missing('status_asuh')
                ->etc()
            )
        );
});

test('every active child has a working detail page matching database records and enforcing photo publication consent', function () {
    $anakList = AnakYatim::where('status_binaan', 'aktif')->get();
    expect($anakList)->not->toBeEmpty();

    foreach ($anakList as $anak) {
        $response = $this->get(route('anak-yatim.show', $anak->id));

        $expectedFoto = ($anak->izin_publikasi_foto && ! empty($anak->foto))
            ? $anak->foto
            : null;

        $response->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('public/anak-yatim-detail')
                ->where('anak.id', $anak->id)
                ->where('anak.nama_publik', $anak->alias)
                ->where('anak.jenjang', $anak->jenjang)
                ->where('anak.kelas', $anak->kelas)
                ->where('anak.potensi', $anak->potensi)
                ->where('anak.izin_publikasi_foto', (bool) $anak->izin_publikasi_foto)
                ->where('anak.foto', $expectedFoto)
                ->missing('anak.nik')
                ->missing('anak.alamat_detail')
                ->missing('anak.nama_lengkap')
                ->missing('anak.nama_wali')
                ->missing('anak.no_telepon_wali')
                ->missing('anak.status_asuh')
                ->has('anakLainnya')
            );
    }
});

test('photo is strictly hidden on public pages when izin_publikasi_foto is false even if foto path exists in database', function () {
    $superAdmin = User::where('role', 'super_admin')->firstOrFail();
    $bidangPendidikan = Bidang::where('kode', Bidang::PENDIDIKAN)->firstOrFail();

    $anakTanpaIzin = AnakYatim::create([
        'nik' => '3273999988887777',
        'nama_lengkap' => 'Ahmad Rahasia Lengkap',
        'alias' => 'Ahmad (A.R.)',
        'jenis_kelamin' => 'L',
        'tempat_lahir' => 'Bandung',
        'tanggal_lahir' => '2014-04-10',
        'jenjang' => 'SD',
        'kelas' => 'Kelas 6 SD',
        'kelurahan' => 'Cigending',
        'alamat_detail' => 'Jl. Rahasia No. 99 RT 09 RW 09',
        'nama_wali' => 'Bapak Wali Rahasia',
        'no_telepon_wali' => '081999888777',
        'hobi' => 'Sains',
        'cita_cita' => 'Ilmuwan',
        'potensi' => 'Unggul dalam olimpiade sains dasar.',
        'foto' => '/images/kegiatan1.jpeg',
        'izin_publikasi_foto' => false,
        'status_binaan' => 'aktif',
        'status_asuh' => AnakYatim::STATUS_ASUH_BELUM,
        'created_by' => $superAdmin->id,
    ]);
    $anakTanpaIzin->bidang()->attach($bidangPendidikan->id);

    $response = $this->get(route('anak-yatim.show', $anakTanpaIzin->id));

    $response->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('public/anak-yatim-detail')
            ->where('anak.id', $anakTanpaIzin->id)
            ->where('anak.izin_publikasi_foto', false)
            ->where('anak.foto', null)
            ->missing('anak.nik')
            ->missing('anak.alamat_detail')
            ->missing('anak.nama_lengkap')
            ->missing('anak.nama_wali')
            ->missing('anak.no_telepon_wali')
        );

    // Pastikan string sensitif sama sekali tidak bocor di seluruh HTML/JSON payload Inertia
    $rawContent = $response->getContent();
    expect($rawContent)->not->toContain('3273999988887777');
    expect($rawContent)->not->toContain('Ahmad Rahasia Lengkap');
    expect($rawContent)->not->toContain('Jl. Rahasia No. 99 RT 09 RW 09');
    expect($rawContent)->not->toContain('Bapak Wali Rahasia');
    expect($rawContent)->not->toContain('081999888777');
});

test('non-active child or non-existent id returns 404 on public detail route', function () {
    $superAdmin = User::where('role', 'super_admin')->firstOrFail();

    $anakNonaktif = AnakYatim::create([
        'nik' => '3273000011112222',
        'nama_lengkap' => 'Alumni Binaan',
        'alias' => 'Alumni (A.B.)',
        'jenis_kelamin' => 'L',
        'tanggal_lahir' => '2005-01-01',
        'jenjang' => 'Kuliah',
        'kelas' => 'Semester 3',
        'kelurahan' => 'Cigending',
        'nama_wali' => 'Ibu Wali',
        'status_binaan' => 'alumni',
        'status_asuh' => AnakYatim::STATUS_ASUH_BELUM,
        'created_by' => $superAdmin->id,
    ]);

    $this->get(route('anak-yatim.show', $anakNonaktif->id))->assertNotFound();
    $this->get('/anak-yatim/999999')->assertNotFound();
});

test('public guest cannot access internal admin or sensitive child endpoints', function () {
    $anak = AnakYatim::firstOrFail();

    $this->getJson(route('admin.anak-yatim.show', $anak))->assertUnauthorized();
    $this->getJson(route('admin.anak-yatim.sensitive', $anak))->assertUnauthorized();
});

