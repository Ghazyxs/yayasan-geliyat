<?php

namespace Database\Seeders;

use App\Models\Bidang;
use App\Models\Kegiatan;
use App\Models\User;
use Illuminate\Database\Seeder;

class KegiatanSeeder extends Seeder
{
    /**
     * Publikasi resmi dan dokumentasi kegiatan Yayasan Geliyat.
     */
    public function run(): void
    {
        $author = User::where('role', 'super_admin')->first() ?? User::first();
        if (! $author) {
            return;
        }

        $bidangMap = Bidang::pluck('id', 'kode')->all();

        $daftarKegiatan = [
            [
                'judul' => 'Bimbel Sinar (Sahabat Inspirasi Anak Remaja)',
                'bidang_id' => $bidangMap[Bidang::PENDIDIKAN] ?? null,
                'kategori' => 'Pendidikan',
                'ringkasan' => 'Kegiatan bimbingan belajar rutin setiap akhir pekan bagi anak-anak binaan jenjang Sekolah Dasar (SD) kelas 1–6 untuk mendampingi pemahaman materi sekolah, latihan soal, dan penguatan motivasi belajar.',
                'deskripsi' => 'Kegiatan bimbingan belajar rutin bagi anak-anak sekolah dasar kelas 1–6 untuk mendukung pemahaman materi pelajaran dan pengerjaan latihan soal.',
                'isi_berita' => "Program Bimbel Sinar (Sahabat Inspirasi Anak Remaja) merupakan salah satu program unggulan Bidang Pendidikan Yayasan Geliyat yang dilaksanakan secara rutin setiap akhir pekan di wilayah Kecamatan Ujungberung, Kota Bandung.\n\nDalam setiap sesi pertemuan, anak-anak yatim binaan dari jenjang Sekolah Dasar (kelas 1 hingga kelas 6) didampingi langsung oleh kakak-kakak pengajar relawan yang tergabung dalam tim Gemilang. Materi pembelajaran difokuskan pada penguatan kemampuan dasar membaca, berhitung, pemahaman mata pelajaran sekolah seperti Matematika, Bahasa Indonesia, dan IPA, serta pendampingan pengerjaan pekerjaan rumah (PR).\n\nSelain belajar akademik, Bimbel Sinar juga mengintegrasikan sesi motivasi, permainan edukatif, serta pembiasaan adab yang baik sebelum dan sesudah belajar. Melalui pendekatan yang ramah dan menyenangkan, anak-anak binaan memiliki ruang tumbuh yang suportif untuk bertanya, berdiskusi, dan meningkatkan rasa percaya diri mereka di sekolah.",
                'lokasi' => 'Jl. Ujung Berung, Cigending',
                'tanggal_kegiatan' => '2026-11-07',
                'gambar' => 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200&auto=format&fit=crop',
                'dokumentasi' => [
                    [
                        'url' => 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800&auto=format&fit=crop',
                        'caption' => 'Pendampingan belajar kelompok siswa kelas 1–3 SD bersama kakak relawan Sinar.',
                    ],
                    [
                        'url' => 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=800&auto=format&fit=crop',
                        'caption' => 'Latihan mengerjakan modul matematika dan diskusi soal ujian sekolah.',
                    ],
                    [
                        'url' => 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=800&auto=format&fit=crop',
                        'caption' => 'Sesi evaluasi belajar dan pembagian alat tulis penunjang pendidikan.',
                    ],
                ],
            ],
            [
                'judul' => 'Ulin Bareng Anak Yatim (UBAY) di Pangandaran',
                'bidang_id' => $bidangMap[Bidang::KEMANUSIAAN] ?? null,
                'kategori' => 'Kemanusiaan',
                'ringkasan' => 'Agenda rekreasi edukatif dan kebersamaan tahunan Yayasan Geliyat yang mengajak ratusan anak yatim beserta wali binaan menikmati liburan penuh keceriaan di Pantai Pangandaran.',
                'deskripsi' => 'Kegiatan kebersamaan dan rekreasi tahunan yang memberikan kesempatan bagi anak-anak yatim binaan untuk belajar, bermain, dan membangun pengalaman bersama.',
                'isi_berita' => "Yayasan Geliyat kembali menyelenggarakan agenda tahunan yang paling dinantikan oleh anak-anak binaan, yaitu Ulin Bareng Anak Yatim (UBAY) menuju kawasan wisata Pantai Pangandaran. Kegiatan ini dirancang khusus sebagai wujud kepedulian terhadap kebahagiaan psikologis dan tumbuh kembang sosial anak-anak yatim dari lima kelurahan binaan di Kecamatan Ujungberung.\n\nSejak pagi hari, rombongan bus keberangkatan dipenuhi antusiasme anak-anak yatim beserta ibu wali (Ummu Geliyat) dan para pengurus pendamping. Setibanya di lokasi, rangkaian acara dibuka dengan doa bersama, dilanjutkan dengan permainan kelompok (fun games) di tepi pantai yang melatih kekompakan, keberanian, serta persaudaraan antar sesama anak binaan lintas kelurahan.\n\nMelalui program UBAY, Yayasan Geliyat bersama para donatur ingin memastikan bahwa anak-anak yatim juga memiliki kenangan masa kecil yang indah, kesempatan mengenal alam ciptaan Tuhan secara langsung, serta semangat baru saat kembali menjalani aktivitas sekolah sehari-hari.",
                'lokasi' => 'Jl. Pantai Pangandaran',
                'tanggal_kegiatan' => '2026-11-21',
                'gambar' => 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1200&auto=format&fit=crop',
                'dokumentasi' => [
                    [
                        'url' => 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=800&auto=format&fit=crop',
                        'caption' => 'Kebersamaan dan senyum ceria anak-anak binaan peserta Ulin Bareng Anak Yatim (UBAY).',
                    ],
                    [
                        'url' => 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop',
                        'caption' => 'Suasana kawasan Pantai Pangandaran tempat pelaksanaan kegiatan outbound dan rekreasi.',
                    ],
                    [
                        'url' => 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=800&auto=format&fit=crop',
                        'caption' => 'Sesi permainan kelompok dan pembagian bingkisan bagi peserta UBAY.',
                    ],
                ],
            ],
            [
                'judul' => 'Santunan Rutin Bulanan & Paket Sembako',
                'bidang_id' => $bidangMap[Bidang::KEMANUSIAAN] ?? null,
                'kategori' => 'Kemanusiaan',
                'ringkasan' => 'Penyaluran amanah donatur dan Orang Tua Asuh berupa santunan tunai bulanan serta paket sembako bagi anak yatim dan keluarga binaan di lima kelurahan Ujungberung.',
                'deskripsi' => 'Program bantuan sosial bagi anak yatim dan keluarganya melalui santunan rutin bulanan yang diselenggarakan secara bergilir di 5 kelurahan.',
                'isi_berita' => "Bidang Kemanusiaan & Yatim Yayasan Geliyat secara konsisten melaksanakan penyaluran Santunan Rutin Bulanan serta pembagian paket sembako bagi anak-anak yatim binaan yang tersebar di lima kelurahan: Cigending, Pasanggrahan, Pasir Endah, Pasirjati, dan Pasirwangi.\n\nKegiatan penyaluran yang dipusatkan di Masjid Besar Ujungberung ini dihadiri oleh anak-anak binaan, para wali yatim (Ummu Geliyat), jajaran pengurus yayasan, serta perwakilan tokoh masyarakat setempat. Sebelum penyerahan santunan, acara diawali dengan pembacaan ayat suci Al-Qur'an oleh perwakilan anak binaan dan doa bersama untuk keberkahan serta kesehatan seluruh donatur dan Orang Tua Asuh.\n\nSetiap dana yang terhimpun dari program Orang Tua Asuh maupun Donasi Umum disalurkan secara terukur dan tercatat transparan. Dukungan berkelanjutan ini sangat membantu meringankan beban kebutuhan pokok bulanan serta uang saku sekolah anak-anak yatim binaan.",
                'lokasi' => 'Masjid Besar Ujungberung',
                'tanggal_kegiatan' => '2026-11-01',
                'gambar' => 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=1200&auto=format&fit=crop',
                'dokumentasi' => [
                    [
                        'url' => 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=800&auto=format&fit=crop',
                        'caption' => 'Penyerahan santunan bulanan kepada anak yatim binaan dari 5 kelurahan.',
                    ],
                    [
                        'url' => 'https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=800&auto=format&fit=crop',
                        'caption' => 'Persiapan dan pengemasan paket sembako kebutuhan pokok oleh relawan yayasan.',
                    ],
                    [
                        'url' => 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=800&auto=format&fit=crop',
                        'caption' => 'Registrasi kehadiran wali yatim dan doa bersama untuk para donatur.',
                    ],
                ],
            ],
            [
                'judul' => 'Gemar — Gerakan Mengaji Anak Remaja',
                'bidang_id' => $bidangMap[Bidang::KEAGAMAAN] ?? null,
                'kategori' => 'Keagamaan',
                'ringkasan' => 'Pembinaan rutin tahsin, tajwid Al-Qur’an, serta penguatan adab dan karakter islami bagi anak-anak yatim binaan jenjang SMP dan SMA.',
                'deskripsi' => "Pembelajaran tahsin dan tajwid Al-Qur'an bagi anak-anak usia SMP dan SMA guna memperdalam pemahaman agama dan akhlak karimah.",
                'isi_berita' => "Memasuki usia remaja, anak-anak binaan membutuhkan pendampingan spiritual dan pergaulan yang positif. Melalui program Gemar (Gerakan Mengaji Anak Remaja), Bidang Keagamaan Yayasan Geliyat menghadirkan wadah pembinaan Al-Qur'an dan karakter khusus bagi anak yatim usia SMP dan SMA.\n\nKegiatan yang berlangsung setiap pekan di Sekretariat Yayasan Geliyat ini mencakup perbaikan bacaan Al-Qur'an (tahsin) sesuai hukum tajwid, setoran hafalan surat-surat pilihan (Juz 30), serta diskusi interaktif seputar akhlak pergaulan remaja muslim, bakti kepada ibu/wali, dan semangat menuntut ilmu.\n\nDengan metode halaqah kecil yang dibimbing oleh ustadz dan mentor muda, setiap peserta mendapatkan perhatian personal sesuai tingkat kemampuannya. Program Gemar diharapkan mampu mencetak generasi remaja yatim yang tidak hanya cerdas secara akademik, tetapi juga memiliki pondasi iman dan akhlak yang kokoh.",
                'lokasi' => 'Sekretariat Yayasan Geliyat',
                'tanggal_kegiatan' => '2026-10-25',
                'gambar' => 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?q=80&w=1200&auto=format&fit=crop',
                'dokumentasi' => [
                    [
                        'url' => 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?q=80&w=800&auto=format&fit=crop',
                        'caption' => 'Halaqah tahsin dan perbaikan makharijul huruf Al-Qur’an remaja binaan.',
                    ],
                    [
                        'url' => 'https://images.unsplash.com/photo-1584286595398-a59f21d313f5?q=80&w=800&auto=format&fit=crop',
                        'caption' => 'Sesi murajaah hafalan surat pendek dan kajian adab menuntut ilmu.',
                    ],
                ],
            ],
            [
                'judul' => 'Binatulya (Bina Orang Tua Yatim)',
                'bidang_id' => $bidangMap[Bidang::KEAGAMAAN] ?? null,
                'kategori' => 'Keagamaan',
                'ringkasan' => 'Majelis pengajian bulanan, siraman rohani, dan ruang silaturahmi penguatan keluarga khusus bagi para ibu/wali anak yatim (Ummu Geliyat).',
                'deskripsi' => 'Pertemuan bulanan bagi Ummu Geliyat (ibu/wali anak yatim) untuk siraman rohani, silaturahmi, serta pendampingan keluarga.',
                'isi_berita' => "Ketangguhan seorang ibu dalam membesarkan anak-anak yatim merupakan pilar utama keutuhan keluarga binaan. Menyadari peran besar tersebut, Yayasan Geliyat menyelenggarakan program Binatulya (Bina Orang Tua Yatim) sebagai ruang pembinaan rohani sekaligus silaturahmi bulanan bagi para Ummu Geliyat.\n\nDalam pertemuan yang dilaksanakan secara bergilir di Kelurahan Cigending dan Pasir Endah ini, para wali yatim mengikuti pengajian keislaman yang mengangkat tema ketabahan hati, pola asuh anak sesuai tuntunan Islam (parenting islami), serta manajemen kesabaran dalam menghadapi tantangan hidup.\n\nSelain tausiyah, Binatulya juga menjadi forum komunikasi dua arah antara pengurus yayasan dengan para orang tua asuh/wali untuk memantau perkembangan sekolah dan kesehatan anak-anak binaan di masing-masing kelurahan.",
                'lokasi' => 'Kelurahan Cigending & Pasir Endah',
                'tanggal_kegiatan' => '2026-10-18',
                'gambar' => 'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=1200&auto=format&fit=crop',
                'dokumentasi' => [
                    [
                        'url' => 'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=800&auto=format&fit=crop',
                        'caption' => 'Pertemuan rutin dan kajian parenting islami bersama Ummu Geliyat.',
                    ],
                    [
                        'url' => 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=800&auto=format&fit=crop',
                        'caption' => 'Ramah tamah dan koordinasi perkembangan anak binaan bersama koordinator wilayah.',
                    ],
                ],
            ],
            [
                'judul' => 'Pemberdayaan Koperasi Ummu Geliyat',
                'bidang_id' => $bidangMap[Bidang::EKONOMI] ?? null,
                'kategori' => 'Ekonomi',
                'ringkasan' => 'Penguatan kemandirian finansial keluarga yatim melalui layanan koperasi sembako terjangkau, edukasi simpanan anggota, dan pendampingan usaha mikro Ummu Geliyat.',
                'deskripsi' => 'Sosialisasi pembentukan simpan pinjam dan penyaluran bahan pokok berkualitas dengan harga bersubsidi bagi anggota yayasan.',
                'isi_berita' => "Bidang Ekonomi & Koperasi Yayasan Geliyat menggelar kegiatan sosialisasi dan penguatan layanan Koperasi Ummu Geliyat yang bertempat di Sekretariat Koperasi Geliyat, Kecamatan Ujungberung. Kegiatan ini diikuti oleh para ibu wali yatim yang aktif menjalankan usaha mikro rumahan maupun anggota koperasi yayasan.\n\nDalam kegiatan ini, pengurus koperasi memaparkan mekanisme pengelolaan Simpanan Pokok, Simpanan Wajib, dan Simpanan Sukarela yang dapat dimanfaatkan oleh para orang tua untuk merencanakan tabungan pendidikan anak. Selain itu, koperasi juga menyalurkan paket bahan pokok rumah tangga seperti beras, minyak goreng, dan gula dengan harga terjangkau.\n\nMelalui pemberdayaan koperasi yang dikelola secara bersama dan transparan, keluarga binaan didorong untuk memiliki ketahanan ekonomi yang mandiri dan produktif.",
                'lokasi' => 'Koperasi Geliyat, Ujungberung',
                'tanggal_kegiatan' => '2026-10-12',
                'gambar' => 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?q=80&w=1200&auto=format&fit=crop',
                'dokumentasi' => [
                    [
                        'url' => 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?q=80&w=800&auto=format&fit=crop',
                        'caption' => 'Pelayanan koperasi dan pencatatan buku simpanan anggota Ummu Geliyat.',
                    ],
                    [
                        'url' => 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800&auto=format&fit=crop',
                        'caption' => 'Penyediaan sembako dan kebutuhan pangan berkualitas bagi keluarga binaan.',
                    ],
                ],
            ],
        ];

        foreach ($daftarKegiatan as $item) {
            Kegiatan::updateOrCreate(
                ['judul' => $item['judul']],
                array_merge($item, [
                    'created_by' => $author->id,
                ])
            );
        }
    }
}

