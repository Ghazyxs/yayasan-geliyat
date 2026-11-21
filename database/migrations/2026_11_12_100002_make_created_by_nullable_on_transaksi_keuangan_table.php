<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Transaksi pemasukan yang dicatat otomatis oleh webhook Midtrans tidak memiliki
 * pengguna (admin) pencatat. Kolom `created_by` dibuat nullable; NULL berarti
 * "dicatat otomatis oleh sistem". Data lama tidak diubah dan foreign key tetap ada.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('transaksi_keuangan', function (Blueprint $table) {
            $table->unsignedBigInteger('created_by')->nullable()->change();
        });
    }

    public function down(): void
    {
        // Catatan: rollback gagal bila sudah ada transaksi otomatis (created_by NULL).
        Schema::table('transaksi_keuangan', function (Blueprint $table) {
            $table->unsignedBigInteger('created_by')->nullable(false)->change();
        });
    }
};

