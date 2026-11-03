<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('donasi', function (Blueprint $table) {
            $table->id();
            $table->string('kode_donasi', 50)->unique();
            $table->string('nama_donatur');
            $table->string('no_whatsapp', 30);
            $table->enum('jenis_donasi', [
                'Donasi Umum',
                'Santunan Rutin',
                'Orang Tua Asuh',
                'Bimbel Sinar',
                'Zakat',
            ])->index();

            // Hanya terisi untuk donasi Orang Tua Asuh.
            // RESTRICT: riwayat donasi tidak boleh hilang karena data anak dihapus;
            // anak yang punya riwayat donasi cukup diubah status_binaan-nya.
            $table->foreignId('anak_yatim_id')
                ->nullable()
                ->constrained('anak_yatim')
                ->restrictOnDelete()
                ->cascadeOnUpdate();

            $table->string('rekening_tujuan', 100);
            $table->unsignedBigInteger('nominal');
            $table->text('pesan_doa')->nullable();
            $table->string('bukti_transfer')->nullable();

            $table->enum('status_verifikasi', [
                'menunggu',
                'terverifikasi',
                'ditolak',
                'dibatalkan',
            ])->default('menunggu')->index();
            $table->timestamp('verified_at')->nullable();
            $table->foreignId('verified_by')
                ->nullable()
                ->constrained('users')
                ->restrictOnDelete()
                ->cascadeOnUpdate();
            $table->text('catatan_verifikasi')->nullable();

            $table->timestamps();
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('donasi');
    }
};
