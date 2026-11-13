<?php

use App\Models\AnakYatim;
use App\Models\Bidang;
use App\Models\Donasi;
use App\Models\TransaksiKeuangan;
use App\Models\User;
use Database\Seeders\BidangSeeder;
use Database\Seeders\DatabaseSeeder;
use Database\Seeders\UserSeeder;
use Illuminate\Support\Facades\Hash;

test('database seeder runs successfully and creates exactly four master bidang', function () {
    $this->seed(DatabaseSeeder::class);

    expect(Bidang::count())->toBe(4);

    $bidangCodes = Bidang::pluck('kode')->all();
    expect($bidangCodes)->toContain(
        Bidang::KEMANUSIAAN,
        Bidang::PENDIDIKAN,
        Bidang::KEAGAMAAN,
        Bidang::EKONOMI
    );

    $kemanusiaan = Bidang::where('kode', Bidang::KEMANUSIAAN)->first();
    expect($kemanusiaan->nama)->toBe('Bidang Kemanusiaan');
});

test('user seeder creates super admin with null bidang_id and admin with valid kemanusiaan bidang_id', function () {
    $this->seed(DatabaseSeeder::class);

    $expectedSuperAdminPassword = env('SEED_SUPER_ADMIN_PASSWORD');
    $expectedAdminPassword = env('SEED_ADMIN_PASSWORD');

    // Verifikasi Super Admin
    $superAdmin = User::where('email', 'ketua@geliyat.or.id')->first();
    expect($superAdmin)->not->toBeNull();
    expect($superAdmin->role)->toBe('super_admin');
    expect($superAdmin->bidang_id)->toBeNull();
    expect($superAdmin->is_active)->toBeTrue();
    expect(Hash::check($expectedSuperAdminPassword, $superAdmin->password))->toBeTrue();

    // Verifikasi Admin
    $admin = User::where('email', 'admin@geliyat.or.id')->first();
    expect($admin)->not->toBeNull();
    expect($admin->role)->toBe('admin');
    expect($admin->bidang_id)->not->toBeNull();
    expect($admin->bidang->kode)->toBe(Bidang::KEMANUSIAAN);
    expect($admin->is_active)->toBeTrue();
    expect(Hash::check($expectedAdminPassword, $admin->password))->toBeTrue();
});

test('user seeder throws exception when password environment variables are missing', function () {
    $this->seed(BidangSeeder::class);

    $originalSuperPass = env('SEED_SUPER_ADMIN_PASSWORD');
    $originalAdminPass = env('SEED_ADMIN_PASSWORD');

    unset($_ENV['SEED_SUPER_ADMIN_PASSWORD'], $_SERVER['SEED_SUPER_ADMIN_PASSWORD']);
    unset($_ENV['SEED_ADMIN_PASSWORD'], $_SERVER['SEED_ADMIN_PASSWORD']);
    putenv('SEED_SUPER_ADMIN_PASSWORD');
    putenv('SEED_ADMIN_PASSWORD');

    try {
        expect(fn () => (new UserSeeder())->run())->toThrow(
            RuntimeException::class,
            'Password seeder belum dikonfigurasi di environment'
        );
    } finally {
        if ($originalSuperPass) {
            putenv("SEED_SUPER_ADMIN_PASSWORD={$originalSuperPass}");
            $_ENV['SEED_SUPER_ADMIN_PASSWORD'] = $originalSuperPass;
            $_SERVER['SEED_SUPER_ADMIN_PASSWORD'] = $originalSuperPass;
        }
        if ($originalAdminPass) {
            putenv("SEED_ADMIN_PASSWORD={$originalAdminPass}");
            $_ENV['SEED_ADMIN_PASSWORD'] = $originalAdminPass;
            $_SERVER['SEED_ADMIN_PASSWORD'] = $originalAdminPass;
        }
    }
});

test('seeder is idempotent when executed multiple times', function () {
    // Jalankan seeder pertama kali
    $this->seed(DatabaseSeeder::class);

    $initialBidangCount = Bidang::count();
    $initialUserCount = User::whereIn('email', ['ketua@geliyat.or.id', 'admin@geliyat.or.id'])->count();

    expect($initialBidangCount)->toBe(4);
    expect($initialUserCount)->toBe(2);

    // Jalankan seeder kedua dan ketiga kali
    $this->seed(DatabaseSeeder::class);
    $this->seed(DatabaseSeeder::class);

    // Tidak boleh terjadi duplikasi baris
    expect(Bidang::count())->toBe(4);
    expect(User::whereIn('email', ['ketua@geliyat.or.id', 'admin@geliyat.or.id'])->count())->toBe(2);
});

test('seeder does not insert dummy operational data into anak_yatim, donasi, or transaksi_keuangan', function () {
    $this->seed(DatabaseSeeder::class);

    expect(AnakYatim::count())->toBe(0);
    expect(Donasi::count())->toBe(0);
    expect(TransaksiKeuangan::count())->toBe(0);
});

test('user seeder skips default demo accounts when running in production environment', function () {
    // Kosongkan user yang mungkin dibuat migration/setup
    User::whereIn('email', ['ketua@geliyat.or.id', 'admin@geliyat.or.id'])->delete();

    // Pastikan master bidang tersedia
    $this->seed(BidangSeeder::class);

    // Simulasikan environment production
    app()->detectEnvironment(fn () => 'production');
    expect(app()->isProduction())->toBeTrue();

    // Jalankan UserSeeder (dengan --force agar artisan tidak meminta konfirmasi terminal di production)
    $this->artisan('db:seed', ['--class' => UserSeeder::class, '--force' => true]);

    // Akun demo tidak boleh dibuat di production
    $superAdmin = User::where('email', 'ketua@geliyat.or.id')->first();
    $admin = User::where('email', 'admin@geliyat.or.id')->first();

    expect($superAdmin)->toBeNull();
    expect($admin)->toBeNull();
});
