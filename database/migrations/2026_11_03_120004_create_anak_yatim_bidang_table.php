<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Pivot many-to-many: satu anak dapat dikelola beberapa bidang,
     * satu bidang dapat membina banyak anak.
     */
    public function up(): void
    {
        Schema::create('anak_yatim_bidang', function (Blueprint $table) {
            $table->id();

            // Data anak dihapus -> asosiasi bidangnya ikut terhapus.
            $table->foreignId('anak_yatim_id')
                ->constrained('anak_yatim')
                ->cascadeOnDelete()
                ->cascadeOnUpdate();

            // Bidang tidak boleh dihapus selama masih membina anak.
            $table->foreignId('bidang_id')
                ->constrained('bidang')
                ->restrictOnDelete()
                ->cascadeOnUpdate();

            $table->text('catatan_program')->nullable();
            $table->timestamps();

            // Satu anak hanya boleh terhubung satu kali ke bidang yang sama.
            $table->unique(['anak_yatim_id', 'bidang_id'], 'uq_anak_yatim_bidang');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('anak_yatim_bidang');
    }
};
