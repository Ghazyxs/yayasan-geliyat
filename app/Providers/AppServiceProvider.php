<?php

namespace App\Providers;

use App\Models\AnakYatim;
use App\Models\Donasi;
use App\Models\Kegiatan;
use App\Models\TransaksiKeuangan;
use App\Policies\AnakYatimPolicy;
use App\Policies\DonasiPolicy;
use App\Policies\KegiatanPolicy;
use App\Policies\TransaksiKeuanganPolicy;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDefaults();
        $this->registerPolicies();
    }

    /**
     * Daftarkan policy otorisasi modul inti secara eksplisit.
     */
    protected function registerPolicies(): void
    {
        Gate::policy(AnakYatim::class, AnakYatimPolicy::class);
        Gate::policy(Donasi::class, DonasiPolicy::class);
        Gate::policy(TransaksiKeuangan::class, TransaksiKeuanganPolicy::class);
        Gate::policy(Kegiatan::class, KegiatanPolicy::class);
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null,
        );
    }
}
