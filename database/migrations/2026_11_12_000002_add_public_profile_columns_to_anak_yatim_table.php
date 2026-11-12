<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('anak_yatim', function (Blueprint $table) {
            $table->string('tempat_lahir', 100)->nullable()->after('jenis_kelamin');
            $table->text('potensi')->nullable()->after('cita_cita');
            $table->json('prestasi')->nullable()->after('potensi');
            $table->string('foto')->nullable()->after('prestasi');
            $table->boolean('izin_publikasi_foto')->default(false)->after('foto');
        });
    }

    public function down(): void
    {
        Schema::table('anak_yatim', function (Blueprint $table) {
            $table->dropColumn([
                'tempat_lahir',
                'potensi',
                'prestasi',
                'foto',
                'izin_publikasi_foto',
            ]);
        });
    }
};

