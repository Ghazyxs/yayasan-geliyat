# Modul 02: Pendataan Anak Yatim & Perlindungan Privasi Data

**Terkait Rumusan Masalah:** RM-02 (Pendataan dan pembaruan data anak yatim melibatkan beberapa tingkatan pengurus secara manual serta membutuhkan kerahasiaan data pribadi)  
**Target Keberhasilan:** Waktu penyelesaian pembaruan data bulanan per kelurahan **turun >= 50%** dan **100% atribut sensitif terlindungi**.  
**Model Terkait:** `App\Models\AnakYatim` (`tabel anak_yatim` & pivot `anak_yatim_bidang`)  
**PIC Utama:** Nabil Rizky R. S. (Frontend), Hanifi Raditya N. (UI/UX), Azka Fadhlan R. & Virgiano Fadhil (Backend/Full-stack).

---

## 1. Tujuan Modul
Memusatkan pendataan dan pembaruan bulanan anak yatim dari 5 kelurahan binaan (*Cigending, Pasanggrahan, Pasir Endah, Pasirjati, Pasirwangi*) ke dalam satu basis data terpadu yang menerapkan enkripsi data pribadi dan pembatasan hak akses per bidang sesuai Undang-Undang Pelindungan Data Pribadi (UU PDP).

---

## 2. Aturan Privasi & Keamanan Data (Implementasi `App\Models\AnakYatim`)

> **Kepatuhan UU PDP di Level Model & Database:**
> - Kolom `nik` wajib dienkripsi di database menggunakan cast Eloquent `'nik' => 'encrypted'`.
> - Atribut `nik` dan `alamat_detail` dimasukkan ke dalam `$hidden = ['nik', 'alamat_detail']` sehingga otomatis disembunyikan dari serialisasi JSON/Inertia publik.
> - Akses data sensitif hanya dapat dibuka melalui `makeVisible(['nik', 'alamat_detail'])` setelah lolos otorisasi policy `viewSensitiveData` (khusus pengurus berwenang).

| Atribut pada Tabel `anak_yatim` | Tampil di Publik (`/anak-yatim`)? | Tampil di Admin (`/admin/anak-yatim`)? |
| :--- | :---: | :---: |
| `alias` (Nama Panggilan / Inisial) | ✅ Ya | ✅ Ya |
| `nama_lengkap` | ❌ Disamarkan (Pakai `alias`) | ✅ Ya |
| `jenjang` (`SD`, `SMP`, `SMA`, `Kuliah`) & `kelas` | ✅ Ya (`jenjang`) | ✅ Ya (Lengkap dengan `nama_sekolah`) |
| `kelurahan` (5 Kelurahan Binaan) | ✅ Ya | ✅ Ya |
| `hobi` & `cita_cita` | ✅ Ya | ✅ Ya |
| `status_asuh` (`belum_diasuh`, `aktif_diasuh`) | ✅ Ya | ✅ Ya |
| `nik` (Terenkripsi) & `alamat_detail` | ❌ **DISEMBUNYIKAN (`$hidden`)** | ✅ Ya (Melalui Policy `viewSensitiveData`) |
| `nama_wali` (*Ummu Geliyat*) & `no_telepon_wali` | ❌ **TIDAK** | ✅ Ya (Khusus Admin & Super Admin) |

---

## 3. Kebutuhan Fungsional (Functional Requirements)

### A. Sisi Publik (`/anak-yatim`)
- **FR-AY-01 (Direktori Publik Anak Binaan):** Menampilkan kartu profil anak binaan aktif (`status_binaan = 'aktif'`) menggunakan `alias`, `jenjang`, `kelurahan`, `hobi`, `cita_cita`, dan `status_asuh`, dilengkapi *banner* perlindungan privasi data anak.
- **FR-AY-02 (Filter Jenjang & Kelurahan):** Pengunjung dapat memfilter daftar anak berdasarkan `jenjang` (*SD, SMP, SMA, Kuliah*) atau `kelurahan`, serta menekan tombol **"Jadi Orang Tua Asuh"** yang mengarahkan ke halaman `/donasi?anak_yatim_id={id}`.

### B. Sisi Internal Admin Panel (`/admin/anak-yatim`)
- **FR-AY-03 (Filter Scope Hak Akses `visibleTo`):**
  - **Super Admin:** melihat dan mengelola seluruh data anak yatim dari semua bidang dan kelurahan.
  - **Admin Bidang:** melihat data anak yatim yang terhubung dengan bidangnya melalui tabel pivot `anak_yatim_bidang`.
- **FR-AY-04 (Tambah & Edit Data Anak Binaan):** Form CRUD lengkap meliputi:
  - `nik` (opsional/terenkripsi), `nama_lengkap`, `alias`, `jenis_kelamin`, `tanggal_lahir`
  - `jenjang`, `kelas`, `nama_sekolah`
  - `kelurahan` (*Cigending, Pasanggrahan, Pasir Endah, Pasirjati, Pasirwangi*), `alamat_detail`
  - `nama_wali` (*Ummu Geliyat*), `no_telepon_wali`
  - `hobi`, `cita_cita`, `status_binaan`, `status_asuh`
  - Relasi program bidang (`anak_yatim_bidang` beserta `catatan_program`) dan berkas pendukung.
- **FR-AY-05 (Detail Anak & Riwayat Donasi Orang Tua Asuh):** Menampilkan halaman detail anak beserta daftar donasi Orang Tua Asuh yang pernah diterima anak tersebut (`$anakYatim->donasi()`).

---

## 4. Kriteria Penerimaan (Acceptance Criteria — QA)
1. Saat endpoint publik `/anak-yatim` diakses, payload Inertia/JSON **tidak boleh** mengandung `nik` maupun `alamat_detail`.
2. Nilai `nik` yang tersimpan di tabel `anak_yatim` pada MySQL berwujud *ciphertext* (terenkripsi), bukan teks polos.
3. Pembaruan data bulanan anak langsung memperbarui metrik statistik jenjang pendidikan (SD, SMP, SMA/Kuliah) di Dashboard.

