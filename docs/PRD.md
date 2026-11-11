# Product Requirements Document (PRD) — Rumah Yayasan Geliyat

| Informasi Dokumen | Keterangan |
| :--- | :--- |
| **Nama Produk** | Sistem Informasi "Rumah Yayasan Geliyat" |
| **Mitra Proyek** | Yayasan Geliyat Mahdiesa Nahate (Kec. Ujungberung, Kota Bandung) |
| **Ketua Yayasan (Stakeholder)** | Ibu Hj. Nina Mahdiah |
| **Tim Konsultan** | Tim Warjett — Program Studi Rekayasa Perangkat Lunak, UPI Kampus Cibiru |
| **Project Manager & System Analyst** | Rafi Ghazy Athallah (2405433) |
| **Status Dokumen** | Versi 2.0 (Penyesuaian Scope: Integrasi Midtrans & Tanpa Modul AI) |

---

## 1. Latar Belakang & Konteks Mitra

**Yayasan Geliyat (Gerakan Peduli Yatim)** adalah yayasan sosial yang berdiri pada tahun 2023 di wilayah Kecamatan Ujungberung, Kota Bandung. Saat ini yayasan membina sekitar **420 anak yatim** (mulai jenjang SD, SMP, SMA, hingga 21 anak di Perguruan Tinggi) yang tersebar di **5 kelurahan binaan**:
1. Kelurahan Cigending
2. Kelurahan Pasanggrahan
3. Kelurahan Pasir Endah
4. Kelurahan Pasirjati
5. Kelurahan Pasirwangi

Yayasan menjalankan 4 bidang utama: **Pendidikan** (*Bimbel Sinar, Gemilang, Gemar, Beasiswa, Geliyat Mensarjanakan*), **Kemanusiaan** (*Pendataan anak yatim, santunan rutin bulanan, santunan munggahan/lebaran, UBAY*), **Keagamaan** (*Binatulya, Turun Wilayah/Turwil*), serta **Ekonomi & Koperasi**.

> **Karakteristik Pengguna Utama:** Mayoritas pengurus Yayasan Geliyat adalah ibu-ibu yang belum memiliki tenaga khusus di bidang TI. Oleh karena itu, antarmuka sistem wajib dirancang **sederhana, ramah pengguna (*human-centric*), dan *mobile-first***.

---

## 2. Rumusan Masalah, Hipotesis Solusi, & Target Keberhasilan

Berdasarkan 3 kali observasi lapangan (15 Sep, 25 Sep, dan 1 Okt 2026) serta penyesuaian ruang lingkup terbaru (penghapusan modul AI & peralihan ke Payment Gateway Midtrans), proyek ini berfokus menyelesaikan **3 Rumusan Masalah Utama**:

| Kode | Rumusan Masalah | Solusi Modul yang Dibangun | Indikator Keberhasilan | Target ($H_1$) |
| :--- | :--- | :--- | :--- | :--- |
| **RM-01** | Bagaimana menyampaikan informasi profil, 4 bidang program kerja, dan kegiatan yayasan kepada masyarakat secara terpusat? | **Modul Company Profile & Publikasi Kegiatan** (Menggantikan ketergantungan publikasi di Facebook eksternal BKMM) | 1. Kelengkapan konten<br>2. Frekuensi publikasi<br>3. *System Usability Scale* (SUS) | - Konten **100%** sesuai kesepakatan<br>- Min. **4 kegiatan/bulan**<br>- Skor **SUS > 68** (min. 10 responden) |
| **RM-02** | Bagaimana mengelola dan memperbarui data anak yatim dari 5 kelurahan secara terstruktur dengan tetap menjaga kerahasiaan data pribadi? | **Modul Pendataan Anak Yatim (CRUD) & RBAC Multi-Role** (Enkripsi NIK & pembatasan akses per bidang sesuai UU PDP) | 1. Waktu penyelesaian pembaruan data bulanan<br>2. Perlindungan data sensitif anak | - Waktu pembaruan **turun >= 50%**<br>- **100%** data sensitif anak (`nik`, `alamat_detail`) terlindungi dari publik |
| **RM-03** | Bagaimana mempermudah calon donatur menyalurkan donasi secara instan dan mengotomatisasi rekapitulasi laporan donasi yayasan? | **Modul Donasi Digital Terintegrasi Midtrans Payment Gateway & Buku Kas (`transaksi_keuangan`)** | 1. Waktu rekap donasi bulanan bendahara<br>2. Akurasi rekonsiliasi transaksi digital<br>3. Pertumbuhan donasi | - Waktu rekap **turun >= 50%** (otomatis via Webhook Midtrans)<br>- Rekonsiliasi **100%** akurat<br>- Donasi **naik >= 10%** dalam 3 bulan |

---

## 3. Aktor Pengguna & Matriks Hak Akses (RBAC)

Sistem membagi pengguna ke dalam **3 aktor utama**:

| Aktor | Deskripsi | Hak Akses Utama |
| :--- | :--- | :--- |
| **1. Pengunjung / Donatur** | Masyarakat umum & calon Orang Tua Asuh (Tanpa Login) | - Melihat halaman *Company Profile* (Beranda, Profil, 4 Bidang, Kegiatan)<br>- Melihat direktori publik anak binaan (`alias`, `jenjang`, `kelurahan`, `hobi`, `cita_cita` — tanpa `nik` dan `alamat_detail`)<br>- Melakukan donasi online (*Donasi Umum, Santunan Rutin, Orang Tua Asuh, Bimbel Sinar, Zakat*) dan membayar langsung via **Midtrans Snap** (QRIS, Virtual Account, E-Wallet) |
| **2. Admin** | Pengurus per bidang (`bidang_id`) yayasan | - Login ke Admin Panel<br>- Mengakses Dashboard Operasional Anak Yatim<br>- Mengelola CRUD Data Anak Yatim yang terhubung ke bidangnya (`visibleTo` scope)<br>- Mengelola publikasi & dokumentasi Kegiatan bidangnya<br>- Melihat daftar transaksi donasi & mengunduh Laporan Operasional |
| **3. Super Admin** | Ketua Umum & Pimpinan Yayasan | - **Seluruh hak akses Admin lintas bidang**, ditambah:<br>- Mengakses Dashboard Eksekutif (Grafik Arus Kas Pemasukan vs Pengeluaran)<br>- Mengelola **Modul Keuangan Yayasan** (`TransaksiKeuangan` — Pemasukan, Pengeluaran, & Void Transaksi)<br>- Mengelola **Manajemen Pengguna** (Tambah/Edit/Nonaktifkan akun Admin Pengurus) |

---

## 4. Daftar Dokumen Spesifikasi Modular (`docs/`)

Dokumentasi kebutuhan sistem ini dipecah menjadi 4 dokumen teknis terpisah di dalam folder `docs/`:

1. **[`docs/modules/01-company-profile-dan-kegiatan.md`](./modules/01-company-profile-dan-kegiatan.md)** — Spesifikasi Portal Publik & Manajemen Kegiatan (`Kegiatan`).
2. **[`docs/modules/02-pendataan-anak-yatim.md`](./modules/02-pendataan-anak-yatim.md)** — Spesifikasi CRUD Anak Yatim (`AnakYatim`), Enkripsi NIK, & Privasi Data UU PDP.
3. **[`docs/modules/03-donasi-midtrans-dan-keuangan.md`](./modules/03-donasi-midtrans-dan-keuangan.md)** — Spesifikasi Alur Pembayaran Otomatis **Midtrans** (`Donasi`) & Buku Kas (`TransaksiKeuangan`).
4. **[`docs/04-arsitektur-database-dan-uat.md`](./04-arsitektur-database-dan-uat.md)** — Arsitektur Sistem, Skema Tabel Database Aktual, & Kriteria Pengujian UAT/QA.

