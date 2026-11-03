<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transaksi_keuangan', function (Blueprint $table) {
            $table->id();
            $table->string('kode_transaksi', 50)->unique();
            $table->enum('tipe', ['pemasukan', 'pengeluaran']);
            $table->string('kategori', 100);
            $table->unsignedBigInteger('nominal');
            $table->date('tanggal_transaksi');

            // Satu donasi maksimal menghasilkan satu transaksi pemasukan.
            // UNIQUE pada kolom nullable tetap mengizinkan banyak NULL
            // (transaksi non-donasi). RESTRICT: donasi yang sudah masuk buku
            // kas tidak boleh dihapus.
            $table->foreignId('donasi_id')
                ->nullable()
                ->unique()
                ->constrained('donasi')
                ->restrictOnDelete()
                ->cascadeOnUpdate();

            // Transaksi tidak pernah dihapus; pembatalan = void.
            // Saldo & grafik hanya menghitung status 'valid'.
            $table->enum('status_transaksi', ['valid', 'void'])->default('valid');

            $table->text('keterangan');
            $table->string('bukti_nota')->nullable();

            $table->foreignId('created_by')
                ->constrained('users')
                ->restrictOnDelete()
                ->cascadeOnUpdate();

            $table->timestamps();

            // Untuk agregasi saldo & grafik bulanan.
            $table->index(['tipe', 'status_transaksi', 'tanggal_transaksi'], 'idx_transaksi_agregasi');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transaksi_keuangan');
    }
};
