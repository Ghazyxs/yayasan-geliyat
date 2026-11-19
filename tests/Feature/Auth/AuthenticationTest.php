<?php

use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\RateLimiter;
use Laravel\Fortify\Features;

test('login screen can be rendered', function () {
    $response = $this->get(route('login'));

    $response->assertOk();
});

test('users can authenticate using the login screen', function () {
    $user = User::factory()->create();

    $response = $this->post(route('login.store'), [
        'email' => $user->email,
        'password' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('dashboard', absolute: false));
});

test('users with two factor enabled are redirected to two factor challenge', function () {
    $this->skipUnlessFortifyHas(Features::twoFactorAuthentication());

    Features::twoFactorAuthentication([
        'confirm' => true,
        'confirmPassword' => true,
    ]);

    $user = User::factory()->withTwoFactor()->create();

    $response = $this->post(route('login'), [
        'email' => $user->email,
        'password' => 'password',
    ]);

    $response->assertRedirect(route('two-factor.login'));
    $response->assertSessionHas('login.id', $user->id);
    $this->assertGuest();
});

test('users can not authenticate with invalid password', function () {
    $user = User::factory()->create();

    $this->post(route('login.store'), [
        'email' => $user->email,
        'password' => 'wrong-password',
    ]);

    $this->assertGuest();
});

test('users can logout', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post(route('logout'));

    $response->assertRedirect(route('login'));

    $this->assertGuest();
});

test('users are rate limited', function () {
    $user = User::factory()->create();

    RateLimiter::increment(md5('login'.implode('|', [$user->email, '127.0.0.1'])), amount: 5);

    $response = $this->post(route('login.store'), [
        'email' => $user->email,
        'password' => 'wrong-password',
    ]);

    $response->assertTooManyRequests();
});

test('seeded super admin and admin can login, access role-restricted routes, use remember me, and logout', function () {
    $this->seed(DatabaseSeeder::class);

    $superAdminPassword = (string) env('SEED_SUPER_ADMIN_PASSWORD');
    $adminPassword = (string) env('SEED_ADMIN_PASSWORD');

    // 1. Login Super Admin dengan Remember Me
    $loginSuper = $this->post(route('login.store'), [
        'email' => 'ketua@geliyat.or.id',
        'password' => $superAdminPassword,
        'remember' => 'on',
    ]);

    $this->assertAuthenticated();
    $loginSuper->assertRedirect(route('dashboard', absolute: false));
    $loginSuper->assertCookie(Auth::guard('web')->getRecallerName());

    $superAdmin = User::where('email', 'ketua@geliyat.or.id')->firstOrFail();
    expect($superAdmin->remember_token)->not->toBeNull();

    // Super Admin dapat mengakses dashboard, modul operasional, dan modul khusus Super Admin
    $this->get(route('dashboard'))->assertOk();
    $this->get(route('admin.anak-yatim'))->assertOk();
    $this->get(route('admin.donasi'))->assertOk();
    $this->get(route('admin.rekening'))->assertOk();
    $this->get(route('admin.keuangan'))->assertOk();
    $this->get(route('admin.pengguna'))->assertOk();

    // Logout Super Admin
    $this->post(route('logout'))->assertRedirect(route('login'));
    $this->assertGuest();

    // 2. Login Admin Operasional dengan Remember Me
    $loginAdmin = $this->post(route('login.store'), [
        'email' => 'admin@geliyat.or.id',
        'password' => $adminPassword,
        'remember' => 'on',
    ]);

    $this->assertAuthenticated();
    $loginAdmin->assertRedirect(route('dashboard', absolute: false));
    $loginAdmin->assertCookie(Auth::guard('web')->getRecallerName());

    $admin = User::where('email', 'admin@geliyat.or.id')->firstOrFail();
    expect($admin->remember_token)->not->toBeNull();

    // Admin dapat mengakses dashboard dan modul operasional, tetapi ditolak (403) pada modul khusus Super Admin
    $this->get(route('dashboard'))->assertOk();
    $this->get(route('admin.anak-yatim'))->assertOk();
    $this->get(route('admin.donasi'))->assertOk();
    $this->get(route('admin.rekening'))->assertForbidden();
    $this->get(route('admin.keuangan'))->assertForbidden();
    $this->get(route('admin.pengguna'))->assertForbidden();

    // Logout Admin
    $this->post(route('logout'))->assertRedirect(route('login'));
    $this->assertGuest();
});

test('seeded admin and super admin can request forgot password link', function () {
    Notification::fake();
    $this->seed(DatabaseSeeder::class);

    $superAdmin = User::where('email', 'ketua@geliyat.or.id')->firstOrFail();
    $admin = User::where('email', 'admin@geliyat.or.id')->firstOrFail();

    $this->post(route('password.email'), ['email' => $superAdmin->email])
        ->assertSessionHasNoErrors();
    Notification::assertSentTo($superAdmin, ResetPassword::class);

    $this->post(route('password.email'), ['email' => $admin->email])
        ->assertSessionHasNoErrors();
    Notification::assertSentTo($admin, ResetPassword::class);
});
