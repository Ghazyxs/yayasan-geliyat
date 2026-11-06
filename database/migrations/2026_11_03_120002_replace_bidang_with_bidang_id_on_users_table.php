<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Master bidang baku Yayasan Geliyat.
     *
     * @var array<string, string>
     */
    private array $masterBidang = [
        'kemanusiaan' => 'Bidang Kemanusiaan & Yatim',
        'pendidikan' => 'Bidang Pendidikan',
        'keagamaan' => 'Bidang Keagamaan',
        'ekonomi' => 'Bidang Ekonomi & Koperasi',
    ];

    /**
     * Pemetaan kanonikal hasil normalisasi teks ke kode bidang master.
     *
     * @var array<string, string>
     */
    private array $canonicalMap = [
        // Kemanusiaan
        'kemanusiaan' => 'kemanusiaan',
        'kemanusiaan dan yatim' => 'kemanusiaan',
        'yatim' => 'kemanusiaan',
        'kemanusiaan yatim' => 'kemanusiaan',

        // Pendidikan
        'pendidikan' => 'pendidikan',
        'pendidikan dan bimbel' => 'pendidikan',
        'pendidikan bimbel' => 'pendidikan',
        'bimbel' => 'pendidikan',
        'bimbel sinar' => 'pendidikan',

        // Keagamaan
        'keagamaan' => 'keagamaan',
        'keagamaan dan bina ummu' => 'keagamaan',
        'keagamaan bina ummu' => 'keagamaan',
        'bina ummu' => 'keagamaan',
        'gemar' => 'keagamaan',
        'mengaji' => 'keagamaan',

        // Ekonomi
        'ekonomi' => 'ekonomi',
        'koperasi' => 'ekonomi',
        'koperasi dan usaha ummu' => 'ekonomi',
        'koperasi usaha ummu' => 'ekonomi',
        'ekonomi dan koperasi' => 'ekonomi',
        'usaha ummu' => 'ekonomi',
    ];

    public function up(): void
    {
        // 1. Pastikan master bidang tersedia (idempoten karena kolom kode berindeks UNIQUE).
        $now = now();
        foreach ($this->masterBidang as $kode => $nama) {
            DB::table('bidang')->insertOrIgnore([
                'kode' => $kode,
                'nama' => $nama,
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }

        $bidangIds = DB::table('bidang')->pluck('id', 'kode')->all();

        // 2. VALIDASI PRA-MIGRASI KETAT (SEBELUM MENYENTUH STRUKTUR TABEL USERS)
        //    Audit seluruh user di sistem untuk memastikan tidak ada data bidang yang hilang.
        $unmappedUsers = [];
        $mappings = [];

        // Periksa apakah kolom lama 'bidang' masih ada (untuk antisipasi retry jika sempat terhenti)
        $hasOldBidang = Schema::hasColumn('users', 'bidang');

        if ($hasOldBidang) {
            $users = DB::table('users')->select(['id', 'email', 'role', 'bidang'])->get();

            foreach ($users as $user) {
                // Super Admin dikecualikan karena berkedudukan lintas bidang (bidang_id = NULL)
                if ($user->role === 'super_admin') {
                    $mappings[$user->id] = null;
                    continue;
                }

                $rawBidang = trim((string) $user->bidang);

                // Jika user memiliki nilai bidang, validasi pemetaannya
                if ($rawBidang !== '') {
                    $normalized = $this->normalizeString($rawBidang);
                    $targetKode = $this->canonicalMap[$normalized] ?? null;

                    if ($targetKode === null || ! isset($bidangIds[$targetKode])) {
                        $unmappedUsers[] = sprintf(
                            'ID: %d, Role: "%s", Email: %s, Nilai Bidang: "%s" (Normalisasi: "%s")',
                            $user->id,
                            $user->role,
                            $user->email,
                            $rawBidang,
                            $normalized
                        );
                    } else {
                        $mappings[$user->id] = $bidangIds[$targetKode];
                    }
                } else {
                    // Admin tanpa bidang tidak diperbolehkan demi konsistensi hak akses
                    if ($user->role === 'admin') {
                        $unmappedUsers[] = sprintf(
                            'ID: %d, Role: "admin", Email: %s (Nilai bidang kosong/NULL)',
                            $user->id,
                            $user->email
                        );
                    }
                }
            }

            if (! empty($unmappedUsers)) {
                throw new RuntimeException(
                    "MIGRATION DIHENTIKAN UNTUK MENCEGAH KEHILANGAN DATA!\n" .
                    "Ditemukan user dengan nilai bidang yang tidak dapat dipetakan secara pasti:\n- " .
                    implode("\n- ", $unmappedUsers) . "\n" .
                    "Perbaiki data pada tabel users sebelum menjalankan ulang migrasi."
                );
            }
        }

        // 3. TAMBAH KOLOM bidang_id SECARA DEFENSIVE (RESUME-ABLE)
        if (! Schema::hasColumn('users', 'bidang_id')) {
            Schema::table('users', function (Blueprint $table) {
                $table->foreignId('bidang_id')
                    ->nullable()
                    ->after('role')
                    ->constrained('bidang')
                    ->restrictOnDelete()
                    ->cascadeOnUpdate();
            });
        }

        // 4. BACKFILL DATA KE bidang_id
        if (! empty($mappings)) {
            foreach ($mappings as $userId => $bidangId) {
                DB::table('users')
                    ->where('id', $userId)
                    ->update(['bidang_id' => $bidangId]);
            }
        }

        // 5. VERIFIKASI PASCA-UPDATE
        $unassignedAdminCount = DB::table('users')
            ->where('role', 'admin')
            ->whereNull('bidang_id')
            ->count();

        if ($unassignedAdminCount > 0) {
            throw new RuntimeException(
                "MIGRATION DIHENTIKAN: Terdeteksi {$unassignedAdminCount} admin tanpa bidang_id setelah backfill. " .
                "Kolom lama 'bidang' tetap dipertahankan."
            );
        }

        // 6. PELEPASAN KOLOM LAMA SETELAH 100% TERVERIFIKASI
        if (Schema::hasColumn('users', 'bidang')) {
            Schema::table('users', function (Blueprint $table) {
                $table->dropColumn('bidang');
            });
        }
    }

    public function down(): void
    {
        // 1. Buat kembali kolom bidang string jika belum ada
        if (! Schema::hasColumn('users', 'bidang')) {
            Schema::table('users', function (Blueprint $table) {
                $table->string('bidang')->nullable()->after('role');
            });
        }

        // 2. Pulihkan nilai teks dari master bidang
        $bidangNama = DB::table('bidang')->pluck('nama', 'id')->all();

        if (Schema::hasColumn('users', 'bidang_id')) {
            $users = DB::table('users')->select(['id', 'role', 'bidang_id'])->get();

            foreach ($users as $user) {
                $namaString = null;

                if ($user->role === 'super_admin') {
                    $namaString = 'Pimpinan Yayasan';
                } elseif ($user->bidang_id !== null && isset($bidangNama[$user->bidang_id])) {
                    $namaString = $bidangNama[$user->bidang_id];
                }

                DB::table('users')
                    ->where('id', $user->id)
                    ->update(['bidang' => $namaString]);
            }

            // 3. Lepaskan foreign key dan drop kolom bidang_id
            Schema::table('users', function (Blueprint $table) {
                $table->dropConstrainedForeignId('bidang_id');
            });
        }
    }

    /**
     * Normalisasi string untuk menangani variasi format dan spasi.
     */
    private function normalizeString(string $value): string
    {
        // Lowercase & trim
        $val = mb_strtolower(trim($value));

        // Normalisasi simbol penghubung
        $val = str_replace(['&', '/', '+'], ' dan ', $val);
        $val = str_replace(['-', '_'], ' ', $val);

        // Hapus prefiks "bidang" di awal kata
        $val = preg_replace('/^bidang\s+/', '', $val);

        // Satukan multiple spasi
        $val = preg_replace('/\s+/', ' ', $val);

        return trim($val);
    }
};
