<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('bidang', function (Blueprint $table) {
            if (! Schema::hasColumn('bidang', 'subjudul')) {
                $table->string('subjudul')->nullable()->after('nama');
            }
            if (! Schema::hasColumn('bidang', 'deskripsi_lengkap')) {
                $table->text('deskripsi_lengkap')->nullable()->after('deskripsi');
            }
            if (! Schema::hasColumn('bidang', 'gambar')) {
                $table->string('gambar')->nullable()->after('deskripsi_lengkap');
            }
            if (! Schema::hasColumn('bidang', 'tujuan')) {
                $table->json('tujuan')->nullable()->after('gambar');
            }
            if (! Schema::hasColumn('bidang', 'program_kerja')) {
                $table->json('program_kerja')->nullable()->after('tujuan');
            }
            if (! Schema::hasColumn('bidang', 'informasi_tambahan')) {
                $table->json('informasi_tambahan')->nullable()->after('program_kerja');
            }
        });

        Schema::table('kegiatan', function (Blueprint $table) {
            if (! Schema::hasColumn('kegiatan', 'ringkasan')) {
                $table->text('ringkasan')->nullable()->after('kategori');
            }
            if (! Schema::hasColumn('kegiatan', 'isi_berita')) {
                $table->longText('isi_berita')->nullable()->after('deskripsi');
            }
            if (! Schema::hasColumn('kegiatan', 'dokumentasi')) {
                $table->json('dokumentasi')->nullable()->after('gambar');
            }
        });

        // Backfill data detail untuk 4 bidang utama agar langsung tersedia di database
        $detailBidang = [
            'pendidikan' => [
                'subjudul' => 'Membuka Pintu Ilmu dan Masa Depan Gemilang',
                'deskripsi' => 'Bantuan beasiswa, bimbingan belajar gratis, dan fasilitas penunjang pendidikan anak binaan.',
                'deskripsi_lengkap' => 'Bidang Pendidikan Yayasan Geliyat berfokus pada pendampingan akademik secara menyeluruh bagi anak-anak yatim binaan dari jenjang Sekolah Dasar (SD), SMP, SMA/SMK, hingga Perguruan Tinggi di lima kelurahan Kecamatan Ujungberung. Melalui pendampingan belajar rutin, penyediaan modul pembelajaran, pembinaan pengajar relawan, serta penyaluran beasiswa pendidikan, bidang ini memastikan tidak ada anak yatim binaan yang terputus pendidikannya karena keterbatasan biaya maupun pendampingan.',
                'gambar' => 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200&auto=format&fit=crop',
                'tujuan' => json_encode([
                    'Meningkatkan pemahaman materi pelajaran sekolah dan prestasi akademik anak yatim binaan.',
                    'Mencegah angka putus sekolah melalui dukungan biaya pendidikan dan perlengkapan sekolah.',
                    'Mencetak generasi anak yatim yang berpendidikan tinggi hingga jenjang sarjana (S1).',
                    'Membangun ekosistem pengajar relawan yang kompeten, sabar, dan inspiratif.',
                ], JSON_UNESCAPED_UNICODE),
                'program_kerja' => json_encode([
                    [
                        'nama' => 'Bimbel Sinar (Sahabat Inspirasi Anak Remaja)',
                        'deskripsi' => 'Bimbingan belajar rutin setiap akhir pekan bagi siswa SD kelas 1–6 untuk pendampingan tugas sekolah, pendalaman materi matematika, literasi, dan latihan soal ujian.',
                        'jadwal' => 'Setiap Hari Sabtu',
                        'sasaran' => 'Anak Binaan Jenjang SD (Kelas 1–6)',
                    ],
                    [
                        'nama' => 'Gemilang (Gerakan Militan Pejuang Geliyat)',
                        'deskripsi' => 'Program pembinaan kapasitas pengajar relawan serta pendalaman tajwid dan metodologi pengajaran yang menyenangkan bagi anak binaan.',
                        'jadwal' => 'Rutin Bulanan',
                        'sasaran' => 'Relawan Pengajar & Mentor Pendidikan',
                    ],
                    [
                        'nama' => 'Beasiswa Prestasi Siswa Berperingkat Setiap Semester',
                        'deskripsi' => 'Pemberian apresiasi dan bantuan biaya pendidikan khusus bagi anak binaan yang meraih peringkat terbaik di sekolah setiap semester.',
                        'jadwal' => 'Setiap Akhir Semester',
                        'sasaran' => 'Siswa Berprestasi SD, SMP, dan SMA',
                    ],
                    [
                        'nama' => 'Program Geliyat Mensarjanakan ke Jenjang Perguruan Tinggi',
                        'deskripsi' => 'Pendampingan dan beasiswa lanjutan bagi lulusan SMA/SMK binaan yang melanjutkan studi ke jenjang Perguruan Tinggi.',
                        'jadwal' => 'Tahun Akademik Berjalan',
                        'sasaran' => 'Lulusan SMA/SMK Binaan Yayasan',
                    ],
                ], JSON_UNESCAPED_UNICODE),
                'informasi_tambahan' => json_encode([
                    'sasaran_utama' => 'Anak yatim jenjang SD, SMP, SMA/SMK, hingga Perguruan Tinggi',
                    'lokasi_pelaksanaan' => 'Sekretariat Geliyat & Posko Belajar 5 Kelurahan Ujungberung',
                    'frekuensi_kegiatan' => 'Pekanan (Sabtu/Minggu) & Evaluasi Semester',
                    'koordinator_unit' => 'Divisi Pendidikan & Relawan Pengajar Sinar',
                ], JSON_UNESCAPED_UNICODE),
            ],
            'kemanusiaan' => [
                'subjudul' => 'Amanah Kepedulian Langsung dan Tepat Sasaran',
                'deskripsi' => 'Pemberdayaan, perlindungan, dan penyaluran santunan anak yatim & dhuafa binaan Yayasan Geliyat.',
                'deskripsi_lengkap' => 'Bidang Kemanusiaan & Yatim merupakan garda terdepan Yayasan Geliyat dalam memetakan, mendata, dan menyalurkan bantuan sosial secara langsung kepada lebih dari 420 anak yatim beserta keluarganya di 5 kelurahan wilayah Ujungberung (Cigending, Pasanggrahan, Pasir Endah, Pasirjati, dan Pasirwangi). Seluruh penyaluran santunan dilakukan secara transparan, terjadwal, dan tepat sasaran untuk menjaga kesejahteraan dasar serta kebahagiaan anak-anak binaan.',
                'gambar' => 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1200&auto=format&fit=crop',
                'tujuan' => json_encode([
                    'Memastikan seluruh anak yatim di 5 kelurahan binaan terdata secara akurat dan terlindungi hak dasarnya.',
                    'Menyalurkan amanah donatur berupa santunan tunai dan paket sembako secara rutin, transparan, dan tepat sasaran.',
                    'Memberikan tanggap darurat kesehatan maupun bantuan musibah bagi keluarga yatim binaan.',
                    'Menghadirkan kebahagiaan dan pengalaman rekreatif yang membangun rasa percaya diri anak yatim.',
                ], JSON_UNESCAPED_UNICODE),
                'program_kerja' => json_encode([
                    [
                        'nama' => 'Santunan Rutin Bulanan di Masjid Besar Ujungberung',
                        'deskripsi' => 'Penyaluran santunan rutin bulanan dan amanah program Orang Tua Asuh bagi anak yatim binaan yang dilaksanakan secara bergilir di wilayah binaan.',
                        'jadwal' => 'Awal Setiap Bulan',
                        'sasaran' => '420+ Anak Yatim Binaan di 5 Kelurahan',
                    ],
                    [
                        'nama' => 'Santunan Paket Sembako Munggahan Menjelang Ramadhan',
                        'deskripsi' => 'Distribusi paket sembako lengkap menjelang bulan suci Ramadhan untuk memenuhi kebutuhan pangan keluarga yatim.',
                        'jadwal' => 'Menjelang Ramadhan',
                        'sasaran' => 'Keluarga Wali Yatim (Ummu Geliyat)',
                    ],
                    [
                        'nama' => 'Santunan Hari Raya Idul Fitri bagi Anak & Keluarga',
                        'deskripsi' => 'Pemberian bingkisan hari raya, pakaian baru, dan santunan tunai agar anak-anak yatim dapat merayakan Idul Fitri dengan penuh sukacita.',
                        'jadwal' => 'Pekan Terakhir Ramadhan',
                        'sasaran' => 'Seluruh Anak Yatim Binaan',
                    ],
                    [
                        'nama' => 'Bantuan Darurat Kesehatan dan Musibah',
                        'deskripsi' => 'Penyaluran dana darurat untuk biaya pengobatan rumah sakit, rawat inap, atau pemulihan pasca musibah bagi keluarga yatim.',
                        'jadwal' => 'Siaga Insidental',
                        'sasaran' => 'Anak & Keluarga Yatim yang Membutuhkan',
                    ],
                    [
                        'nama' => 'Ulin Bareng Anak Yatim (UBAY) Rekreasi Edukatif Tahunan',
                        'deskripsi' => 'Kegiatan rekreasi edukatif dan kebersamaan tahunan ke destinasi wisata untuk memberikan pengalaman berlibur dan mempererat persaudaraan anak binaan.',
                        'jadwal' => 'Tahunan',
                        'sasaran' => 'Anak Yatim & Pendamping Wilayah',
                    ],
                ], JSON_UNESCAPED_UNICODE),
                'informasi_tambahan' => json_encode([
                    'sasaran_utama' => '420+ Anak yatim dan keluarga wali di 5 kelurahan binaan',
                    'lokasi_pelaksanaan' => 'Masjid Besar Ujungberung & 5 Kelurahan Binaan',
                    'frekuensi_kegiatan' => 'Bulanan, Hari Besar Islam, dan Tanggap Darurat',
                    'koordinator_unit' => 'Divisi Kemanusiaan & Koordinator Kelurahan',
                ], JSON_UNESCAPED_UNICODE),
            ],
            'ekonomi' => [
                'subjudul' => 'Menumbuhkan Kemandirian Finansial Keluarga Yatim',
                'deskripsi' => 'Koperasi yayasan, pelatihan kewirausahaan, dan program pemberdayaan ekonomi keluarga binaan.',
                'deskripsi_lengkap' => 'Bidang Ekonomi & Koperasi hadir untuk mentransformasi keluarga anak yatim agar berdaya secara finansial dan tidak bergantung sepenuhnya pada bantuan karitatif. Melalui wadah Koperasi Yayasan Geliyat dan pendampingan usaha mikro bagi Ummu Geliyat (ibu dari anak yatim), bidang ini menyediakan akses kebutuhan pokok terjangkau, pengelolaan tabungan berjangka, layanan simpan pinjam yang amanah, serta pelatihan keterampilan wirausaha rumahan.',
                'gambar' => 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?q=80&w=1200&auto=format&fit=crop',
                'tujuan' => json_encode([
                    'Mendorong kemandirian ekonomi para ibu/wali yatim (Ummu Geliyat) melalui pengembangan usaha mikro keluarga.',
                    'Menyediakan akses bahan pangan dan kebutuhan pokok rumah tangga berkualitas dengan harga terjangkau.',
                    'Membangun budaya menabung dan perencanaan keuangan keluarga melalui sistem koperasi yang sehat dan amanah.',
                    'Melindungi keluarga yatim dari jeratan pinjaman ilegal melalui fasilitas simpan pinjam koperasi yang syar’i.',
                ], JSON_UNESCAPED_UNICODE),
                'program_kerja' => json_encode([
                    [
                        'nama' => 'Penyediaan Sembako dan Kebutuhan Rumah Tangga Berkualitas',
                        'deskripsi' => 'Penyediaan beras, minyak goreng, gula, dan bahan pokok rumah tangga berkualitas dengan harga khusus bagi keluarga binaan dan anggota.',
                        'jadwal' => 'Operasional Harian / Pekanan',
                        'sasaran' => 'Ummu Geliyat & Anggota Koperasi',
                    ],
                    [
                        'nama' => 'Pengelolaan Simpanan Pokok, Wajib, dan Sukarela',
                        'deskripsi' => 'Fasilitas pengelolaan tabungan anggota koperasi untuk membantu perencanaan dana pendidikan anak dan cadangan keuangan keluarga.',
                        'jadwal' => 'Setoran Bulanan',
                        'sasaran' => 'Anggota Koperasi Yayasan Geliyat',
                    ],
                    [
                        'nama' => 'Layanan Simpan Pinjam Khusus Anggota Koperasi',
                        'deskripsi' => 'Fasilitas pembiayaan modal bergulir yang mudah, amanah, dan bebas jeratan rentenir bagi wali yatim yang memiliki usaha rumahan.',
                        'jadwal' => 'Sesuai Pengajuan Anggota',
                        'sasaran' => 'Pelaku Usaha Mikro Ummu Geliyat',
                    ],
                    [
                        'nama' => 'Pemberdayaan Wirausaha Mandiri bagi Ummu Geliyat',
                        'deskripsi' => 'Pendampingan pembuatan produk olahan pangan, kerajinan, serta pemasaran bersama produk karya ibu-ibu wali yatim.',
                        'jadwal' => 'Triwulanan',
                        'sasaran' => 'Wali Anak Yatim Binaan Produktif',
                    ],
                ], JSON_UNESCAPED_UNICODE),
                'informasi_tambahan' => json_encode([
                    'sasaran_utama' => 'Ummu Geliyat (Ibu/Wali Yatim) & Anggota Koperasi',
                    'lokasi_pelaksanaan' => 'Koperasi Yayasan Geliyat, Kecamatan Ujungberung',
                    'frekuensi_kegiatan' => 'Layanan Pekanan & Rapat Anggota Tahunan',
                    'koordinator_unit' => 'Pengurus Koperasi & Pemberdayaan Ekonomi',
                ], JSON_UNESCAPED_UNICODE),
            ],
            'keagamaan' => [
                'subjudul' => 'Menanamkan Karakter Qur’ani dan Nilai Akhlak',
                'deskripsi' => 'Pembinaan keagamaan, program tahfidz Al-Quran, dan peringatan hari besar Islam yayasan.',
                'deskripsi_lengkap' => 'Bidang Keagamaan Yayasan Geliyat berfokus pada pembentukan karakter berakhlakul karimah, kecintaan terhadap Al-Qur’an, serta penguatan ketahanan spiritual baik bagi anak-anak yatim remaja maupun para ibu/wali yatim (Ummu Geliyat). Melalui majelis ilmu, bimbingan tahsin-tahfidz, serta kunjungan silaturahmi langsung ke rumah-rumah binaan, bidang ini memastikan keluarga yatim mendapatkan pendampingan ruhiyah yang hangat dan berkelanjutan.',
                'gambar' => 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?q=80&w=1200&auto=format&fit=crop',
                'tujuan' => json_encode([
                    'Meningkatkan kemampuan membaca, memahami, dan menghafal Al-Qur’an sesuai kaidah tajwid bagi anak remaja yatim.',
                    'Membentuk adab, akhlak mulia, dan keteladanan ibadah dalam keseharian anak binaan.',
                    'Menguatkan ketabahan mental dan spiritual para ibu/wali yatim (Ummu Geliyat) dalam mendidik anak.',
                    'Mempererat ikatan kekeluargaan antara pengurus yayasan dengan keluarga yatim di tiap kelurahan.',
                ], JSON_UNESCAPED_UNICODE),
                'program_kerja' => json_encode([
                    [
                        'nama' => 'Gemar (Gerakan Mengaji Anak Remaja) Usia SMP dan SMA',
                        'deskripsi' => 'Pembinaan rutin baca tulis Al-Qur’an, perbaikan makharijul huruf (tahsin), hafalan surat pilihan, dan kajian adab remaja.',
                        'jadwal' => 'Setiap Pekan',
                        'sasaran' => 'Anak Yatim Usia SMP dan SMA',
                    ],
                    [
                        'nama' => 'Binatulya (Bina Orang Tua Yatim) Pengajian & Siraman Rohani Bulanan',
                        'deskripsi' => 'Pengajian bulanan, tausiyah keislaman, dan ruang berbagi penguatan hati khusus bagi para ibu/wali anak yatim (Ummu Geliyat).',
                        'jadwal' => 'Pertengahan Bulan',
                        'sasaran' => 'Ibu / Wali Anak Yatim (Ummu Geliyat)',
                    ],
                    [
                        'nama' => 'Turwil (Turun Wilayah) Silaturahmi ke Rumah Orang Tua Binaan',
                        'deskripsi' => 'Kunjungan langsung pengurus ke rumah-rumah keluarga binaan di 5 kelurahan untuk menyapa, mendoakan, dan menyerap aspirasi wali yatim.',
                        'jadwal' => 'Rutin Bergilir per Kelurahan',
                        'sasaran' => 'Keluarga Binaan di 5 Kelurahan',
                    ],
                    [
                        'nama' => 'Pelatihan Tahsin & Pembinaan Akhlak Berkelanjutan',
                        'deskripsi' => 'Pendampingan bacaan Al-Qur’an bersanad dan pembinaan karakter islami pada momentum hari besar Islam dan pesantren kilat.',
                        'jadwal' => 'Rutin & Hari Besar Islam',
                        'sasaran' => 'Anak Binaan, Pengajar, dan Wali Yatim',
                    ],
                ], JSON_UNESCAPED_UNICODE),
                'informasi_tambahan' => json_encode([
                    'sasaran_utama' => 'Anak yatim usia remaja (SMP/SMA) & Wali Yatim (Ummu Geliyat)',
                    'lokasi_pelaksanaan' => 'Sekretariat Geliyat & Majelis 5 Kelurahan Binaan',
                    'frekuensi_kegiatan' => 'Pekanan (Gemar) & Bulanan (Binatulya/Turwil)',
                    'koordinator_unit' => 'Divisi Keagamaan & Pembina Rohani',
                ], JSON_UNESCAPED_UNICODE),
            ],
        ];

        foreach ($detailBidang as $kode => $attrs) {
            DB::table('bidang')
                ->where('kode', $kode)
                ->update(array_merge($attrs, ['updated_at' => now()]));
        }
    }

    public function down(): void
    {
        Schema::table('kegiatan', function (Blueprint $table) {
            $columns = array_filter(
                ['ringkasan', 'isi_berita', 'dokumentasi'],
                fn (string $col) => Schema::hasColumn('kegiatan', $col)
            );
            if (! empty($columns)) {
                $table->dropColumn($columns);
            }
        });

        Schema::table('bidang', function (Blueprint $table) {
            $columns = array_filter(
                ['subjudul', 'deskripsi_lengkap', 'gambar', 'tujuan', 'program_kerja', 'informasi_tambahan'],
                fn (string $col) => Schema::hasColumn('bidang', $col)
            );
            if (! empty($columns)) {
                $table->dropColumn($columns);
            }
        });
    }
};

