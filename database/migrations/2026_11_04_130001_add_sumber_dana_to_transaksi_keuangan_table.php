<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('transaksi_keuangan', function (Blueprint $table) {
            $table->enum('sumber_dana', ['donasi', 'operasional'])
                ->nullable()
                ->after('tipe')
                ->index();
        });
    }

    public function down(): void
    {
        Schema::table('transaksi_keuangan', function (Blueprint $table) {
            $table->dropIndex(['sumber_dana']);
            $table->dropColumn('sumber_dana');
        });
    }
};

