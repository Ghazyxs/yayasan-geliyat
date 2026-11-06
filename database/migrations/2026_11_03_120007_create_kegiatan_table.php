<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('kegiatan', function (Blueprint $table) {
            $table->id();
            $table->string('judul');

            // NULL = kegiatan umum/lintas bidang (mis. Milad Yayasan).
            // SET NULL: dokumentasi kegiatan tetap ada bila bidang direstrukturisasi.
            $table->foreignId('bidang_id')
                ->nullable()
                ->constrained('bidang')
                ->nullOnDelete()
                ->cascadeOnUpdate();

            $table->enum('kategori', ['Pendidikan', 'Keagamaan', 'Kemanusiaan', 'Ekonomi']);
            $table->text('deskripsi');
            $table->string('lokasi');
            $table->date('tanggal_kegiatan')->index();
            $table->string('gambar')->nullable();

            $table->foreignId('created_by')
                ->constrained('users')
                ->restrictOnDelete()
                ->cascadeOnUpdate();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kegiatan');
    }
};
