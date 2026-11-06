<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('donasi', function (Blueprint $table) {
            $table->foreignId('rekening_id')
                ->nullable()
                ->after('anak_yatim_id')
                ->constrained('rekening_yayasan')
                ->restrictOnDelete()
                ->cascadeOnUpdate();

            $table->string('rekening_nama_bank', 60)->nullable()->after('rekening_id');
            $table->string('rekening_nomor', 50)->nullable()->after('rekening_nama_bank');
            $table->string('rekening_atas_nama', 150)->nullable()->after('rekening_nomor');
        });
    }

    public function down(): void
    {
        Schema::table('donasi', function (Blueprint $table) {
            $table->dropForeign(['rekening_id']);
            $table->dropColumn([
                'rekening_id',
                'rekening_nama_bank',
                'rekening_nomor',
                'rekening_atas_nama',
            ]);
        });
    }
};

