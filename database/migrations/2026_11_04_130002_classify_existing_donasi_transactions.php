<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Klasifikasikan transaksi donasi yang tercatat sebelum penambahan kolom sumber_dana.
     * Transaksi yang terikat langsung ke tabel donasi (donasi_id != null)
     * secara definitif adalah Dana Donasi.
     */
    public function up(): void
    {
        DB::table('transaksi_keuangan')
            ->whereNotNull('donasi_id')
            ->whereNull('sumber_dana')
            ->update([
                'sumber_dana' => 'donasi',
            ]);
    }

    public function down(): void
    {
        // Tidak perlu revert untuk menjaga integritas data klasifikasi
    }
};

