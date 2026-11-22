<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Ubah kolom jenjang menjadi string fleksibel agar menerima SMA/SMK, Perguruan Tinggi, dan Lainnya
        Schema::table('anak_yatim', function (Blueprint $table) {
            $table->string('jenjang', 50)->change();
        });

        // Normalisasi nilai jenjang lama
        DB::table('anak_yatim')->where('jenjang', 'SMA')->update(['jenjang' => 'SMA/SMK']);
        DB::table('anak_yatim')->where('jenjang', 'Kuliah')->update(['jenjang' => 'Perguruan Tinggi']);

        // Tambahkan kolom baru sesuai kebutuhan pendataan terbaru
        Schema::table('anak_yatim', function (Blueprint $table) {
            if (! Schema::hasColumn('anak_yatim', 'no_kk')) {
                $table->text('no_kk')->nullable()->after('nik');
            }
            if (! Schema::hasColumn('anak_yatim', 'anak_ke')) {
                $table->unsignedTinyInteger('anak_ke')->nullable()->after('nama_lengkap');
            }
            if (! Schema::hasColumn('anak_yatim', 'status_santunan')) {
                $table->string('status_santunan', 20)->default('menunggu')->index()->after('jenis_kelamin');
            }
            if (! Schema::hasColumn('anak_yatim', 'nama_ibu_kandung')) {
                $table->string('nama_ibu_kandung')->nullable()->after('nama_wali');
            }
            if (! Schema::hasColumn('anak_yatim', 'no_telepon')) {
                $table->string('no_telepon', 30)->nullable()->after('nama_ibu_kandung');
            }
            if (! Schema::hasColumn('anak_yatim', 'foto_kk')) {
                $table->string('foto_kk')->nullable()->after('foto');
            }
            if (! Schema::hasColumn('anak_yatim', 'foto_akta_kelahiran')) {
                $table->string('foto_akta_kelahiran')->nullable()->after('foto_kk');
            }
            if (! Schema::hasColumn('anak_yatim', 'foto_akta_kematian_ayah')) {
                $table->string('foto_akta_kematian_ayah')->nullable()->after('foto_akta_kelahiran');
            }
        });

        // Hapus kolom yang sudah tidak digunakan lagi
        $columnsToDrop = array_values(array_filter([
            'alias',
            'kelas',
            'nama_sekolah',
            'hobi',
            'cita_cita',
            'status_asuh',
            'potensi',
            'prestasi',
            'izin_publikasi_foto',
        ], fn (string $col) => Schema::hasColumn('anak_yatim', $col)));

        if ($columnsToDrop !== []) {
            Schema::table('anak_yatim', function (Blueprint $table) use ($columnsToDrop) {
                $table->dropColumn($columnsToDrop);
            });
        }
    }

    public function down(): void
    {
        Schema::table('anak_yatim', function (Blueprint $table) {
            if (! Schema::hasColumn('anak_yatim', 'alias')) {
                $table->string('alias', 100)->default('-')->after('nama_lengkap');
            }
            if (! Schema::hasColumn('anak_yatim', 'kelas')) {
                $table->string('kelas', 50)->default('-')->after('jenjang');
            }
            if (! Schema::hasColumn('anak_yatim', 'nama_sekolah')) {
                $table->string('nama_sekolah')->nullable()->after('kelas');
            }
            if (! Schema::hasColumn('anak_yatim', 'hobi')) {
                $table->string('hobi')->nullable()->after('no_telepon_wali');
            }
            if (! Schema::hasColumn('anak_yatim', 'cita_cita')) {
                $table->string('cita_cita')->nullable()->after('hobi');
            }
            if (! Schema::hasColumn('anak_yatim', 'status_asuh')) {
                $table->string('status_asuh', 30)->default('belum_diasuh')->after('status_binaan');
            }
            if (! Schema::hasColumn('anak_yatim', 'potensi')) {
                $table->text('potensi')->nullable()->after('cita_cita');
            }
            if (! Schema::hasColumn('anak_yatim', 'prestasi')) {
                $table->json('prestasi')->nullable()->after('potensi');
            }
            if (! Schema::hasColumn('anak_yatim', 'izin_publikasi_foto')) {
                $table->boolean('izin_publikasi_foto')->default(false)->after('foto');
            }
        });

        DB::table('anak_yatim')->where('jenjang', 'SMA/SMK')->update(['jenjang' => 'SMA']);
        DB::table('anak_yatim')->where('jenjang', 'Perguruan Tinggi')->update(['jenjang' => 'Kuliah']);

        $addedColumns = array_values(array_filter([
            'no_kk',
            'anak_ke',
            'status_santunan',
            'nama_ibu_kandung',
            'no_telepon',
            'foto_kk',
            'foto_akta_kelahiran',
            'foto_akta_kematian_ayah',
        ], fn (string $col) => Schema::hasColumn('anak_yatim', $col)));

        if ($addedColumns !== []) {
            Schema::table('anak_yatim', function (Blueprint $table) use ($addedColumns) {
                $table->dropColumn($addedColumns);
            });
        }
    }
};
