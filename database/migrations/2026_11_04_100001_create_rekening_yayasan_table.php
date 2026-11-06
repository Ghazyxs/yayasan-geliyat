<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rekening_yayasan', function (Blueprint $table) {
            $table->id();
            $table->string('nama_bank', 60);
            $table->string('nomor_rekening', 50)->unique();
            $table->string('atas_nama', 150);
            $table->string('icon', 30)->nullable();
            $table->boolean('is_active')->default(true)->index();
            $table->text('catatan')->nullable();

            $table->foreignId('created_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete()
                ->cascadeOnUpdate();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rekening_yayasan');
    }
};

