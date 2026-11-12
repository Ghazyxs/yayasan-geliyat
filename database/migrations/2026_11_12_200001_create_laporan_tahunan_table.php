<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('laporan_tahunan', function (Blueprint $table) {
            $table->id();
            $table->unsignedSmallInteger('tahun')->unique()->index();
            $table->string('judul')->default('Laporan Kegiatan Tahunan Yayasan Geliyat');
            $table->string('nomor_dokumen')->nullable();
            $table->date('tanggal_penerbitan')->nullable();
            $table->text('latar_belakang')->nullable();
            $table->text('tujuan_laporan')->nullable();
            $table->text('kesimpulan')->nullable();
            $table->text('harapan_evaluasi')->nullable();
            $table->string('penandatangan_ketua')->default('H. Ahmad Fauzi');
            $table->string('penandatangan_sekretaris')->default('M. Ridwan, S.Pd.');
            $table->boolean('is_published')->default(true);
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('laporan_tahunan');
    }
};

