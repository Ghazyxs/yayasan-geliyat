<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('anak_yatim', function (Blueprint $table) {
            $table->id();

            // Data pribadi (UU PDP). NIK dienkripsi oleh cast `encrypted`
            // di model, sehingga disimpan sebagai TEXT (ciphertext panjang).
            $table->text('nik')->nullable();
            $table->string('nama_lengkap');
            $table->string('alias', 100); // nama samaran untuk tampilan publik
            $table->enum('jenis_kelamin', ['L', 'P']);
            $table->date('tanggal_lahir');

            // Pendidikan
            $table->enum('jenjang', ['SD', 'SMP', 'SMA', 'Kuliah'])->index();
            $table->string('kelas', 50);
            $table->string('nama_sekolah')->nullable();

            // Domisili (string agar fleksibel bila wilayah binaan bertambah)
            $table->string('kelurahan', 100)->index();
            $table->text('alamat_detail')->nullable();

            // Wali
            $table->string('nama_wali');
            $table->string('no_telepon_wali', 30)->nullable();

            // Profil publik
            $table->string('hobi')->nullable();
            $table->string('cita_cita')->nullable();

            // Status
            $table->enum('status_binaan', ['aktif', 'alumni', 'nonaktif'])
                ->default('aktif')
                ->index();
            $table->enum('status_asuh', ['belum_diasuh', 'aktif_diasuh'])
                ->default('belum_diasuh');

            // Akun pengurus tidak boleh di-hard delete bila pernah mendata anak.
            $table->foreignId('created_by')
                ->constrained('users')
                ->restrictOnDelete()
                ->cascadeOnUpdate();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('anak_yatim');
    }
};
