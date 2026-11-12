<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>{{ $laporan->judul }}</title>
    <style>
        @page {
            size: a4 portrait;
            margin: 28mm 20mm 25mm 20mm;
        }

        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            font-size: 10pt;
            line-height: 1.5;
            color: #2d3748;
        }

        /* Running Header & Footer */
        header.page-header {
            position: fixed;
            top: -18mm;
            left: 0;
            right: 0;
            height: 12mm;
            border-bottom: 0.5pt solid #cbd5e1;
            padding-bottom: 2mm;
            font-size: 8pt;
            color: #64748b;
        }
        header.page-header .left {
            float: left;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            font-weight: bold;
            color: #087f8c;
        }
        header.page-header .right {
            float: right;
            font-style: italic;
        }

        footer.page-footer {
            position: fixed;
            bottom: -15mm;
            left: 0;
            right: 0;
            height: 10mm;
            border-top: 0.5pt solid #cbd5e1;
            padding-top: 2mm;
            font-size: 8pt;
            color: #64748b;
        }
        footer.page-footer .left {
            float: left;
        }
        footer.page-footer .right {
            float: right;
        }
        .page-number:before {
            content: counter(page);
        }

        .page-break {
            page-break-after: always;
        }
        .avoid-break {
            page-break-inside: avoid;
        }

        /* Cover Page */
        .cover {
            text-align: center;
            padding-top: 25mm;
            padding-bottom: 10mm;
        }
        .cover-logo {
            width: 90px;
            height: 90px;
            margin-bottom: 15mm;
        }
        .cover-badge {
            display: inline-block;
            background-color: #e8f8fa;
            color: #087f8c;
            border: 1px solid #14bace;
            padding: 4px 14px;
            border-radius: 12px;
            font-size: 9pt;
            font-weight: bold;
            letter-spacing: 1px;
            text-transform: uppercase;
            margin-bottom: 6mm;
        }
        .cover-title {
            font-size: 24pt;
            font-weight: 800;
            color: #0f172a;
            line-height: 1.25;
            margin-bottom: 4mm;
            text-transform: uppercase;
        }
        .cover-year {
            font-size: 20pt;
            font-weight: 700;
            color: #087f8c;
            margin-bottom: 12mm;
        }
        .cover-divider {
            width: 80px;
            height: 3px;
            background-color: #14bace;
            margin: 0 auto 16mm auto;
        }
        .cover-meta {
            margin-top: 35mm;
            padding: 10mm;
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            font-size: 9pt;
            color: #475569;
            line-height: 1.6;
        }
        .cover-meta strong {
            color: #0f172a;
            font-size: 10pt;
        }

        /* Headings */
        h1.section-title {
            font-size: 14pt;
            font-weight: 700;
            color: #087f8c;
            border-bottom: 2px solid #087f8c;
            padding-bottom: 4px;
            margin-top: 0;
            margin-bottom: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        h2.subsection-title {
            font-size: 11pt;
            font-weight: 700;
            color: #1e293b;
            margin-top: 14px;
            margin-bottom: 6px;
        }

        /* Content styling */
        p {
            margin-top: 0;
            margin-bottom: 10px;
            text-align: justify;
        }
        .lead {
            font-size: 10.5pt;
            font-weight: 500;
            color: #334155;
        }

        /* Summary Box */
        .summary-box {
            background-color: #f0fdfa;
            border-left: 4px solid #087f8c;
            padding: 10px 14px;
            margin-bottom: 16px;
            font-size: 9.5pt;
        }
        .summary-box table {
            width: 100%;
            border-collapse: collapse;
        }
        .summary-box td {
            padding: 3px 0;
        }

        /* Table of Activities */
        .table-custom {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
            margin-bottom: 16px;
            font-size: 9pt;
        }
        .table-custom th {
            background-color: #087f8c;
            color: #ffffff;
            font-weight: bold;
            text-align: left;
            padding: 7px 8px;
            border: 0.5pt solid #087f8c;
        }
        .table-custom td {
            padding: 6px 8px;
            border: 0.5pt solid #cbd5e1;
            vertical-align: top;
        }
        .table-custom tr:nth-child(even) td {
            background-color: #f8fafc;
        }

        /* Detailed Activity Item */
        .activity-card {
            border: 0.5pt solid #cbd5e1;
            background-color: #ffffff;
            border-radius: 4px;
            padding: 10px 14px;
            margin-bottom: 14px;
        }
        .activity-card-header {
            border-bottom: 0.5pt solid #e2e8f0;
            padding-bottom: 6px;
            margin-bottom: 8px;
        }
        .activity-card-title {
            font-size: 11pt;
            font-weight: bold;
            color: #0f172a;
            margin: 0;
        }
        .activity-badge {
            display: inline-block;
            background-color: #e8f8fa;
            color: #087f8c;
            font-size: 8pt;
            font-weight: bold;
            padding: 2px 6px;
            border-radius: 3px;
            margin-top: 3px;
        }
        .activity-card-meta {
            font-size: 8.5pt;
            color: #64748b;
            margin-top: 4px;
        }

        /* Documentation Grid */
        .doc-item {
            border: 0.5pt solid #cbd5e1;
            background-color: #ffffff;
            padding: 8px;
            margin-bottom: 14px;
            text-align: center;
        }
        .doc-img {
            max-width: 100%;
            max-height: 160px;
            object-fit: cover;
            border-radius: 3px;
            margin-bottom: 6px;
        }
        .doc-caption {
            font-size: 8.5pt;
            color: #475569;
            font-weight: 500;
        }
        .doc-meta {
            font-size: 7.5pt;
            color: #94a3b8;
        }

        /* Signature Section */
        .signature-section {
            margin-top: 25px;
            width: 100%;
        }
        .signature-table {
            width: 100%;
            border-collapse: collapse;
        }
        .signature-table td {
            width: 50%;
            text-align: center;
            vertical-align: top;
            padding: 0 15px;
        }
        .signature-space {
            height: 60px;
        }
        .signature-name {
            font-weight: bold;
            text-decoration: underline;
            color: #0f172a;
        }
        .signature-role {
            font-size: 9pt;
            color: #64748b;
        }
    </style>
</head>
<body>
    {{-- Running Header & Footer --}}
    <header class="page-header">
        <div class="left">Yayasan Geliyat Mahdiesa Nahate &bull; Laporan Kegiatan Tahunan</div>
        <div class="right">Tahun {{ $laporan->tahun }}</div>
        <div style="clear: both;"></div>
    </header>

    <footer class="page-footer">
        <div class="left">Dokumen Resmi &bull; Akuntabilitas Publik</div>
        <div class="right">Halaman <span class="page-number"></span></div>
        <div style="clear: both;"></div>
    </footer>

    {{-- ======================================================== --}}
    {{-- 1. HALAMAN SAMPUL (COVER)                                --}}
    {{-- ======================================================== --}}
    <div class="cover">
        @if(!empty($logoBase64))
            <img src="{{ $logoBase64 }}" alt="Logo Yayasan Geliyat" class="cover-logo">
        @else
            <div style="width: 80px; height: 80px; line-height: 80px; border-radius: 50%; background-color: #087f8c; color: #ffffff; font-size: 24pt; font-weight: bold; margin: 0 auto 12mm; text-align: center;">
                YG
            </div>
        @endif

        <div class="cover-badge">Dokumen Laporan Resmi</div>
        <div class="cover-title">{{ $laporan->judul }}</div>
        <div class="cover-year">Tahun {{ $laporan->tahun }}</div>
        <div class="cover-divider"></div>

        <div style="font-size: 11pt; color: #475569; margin-bottom: 20px;">
            Rekapitulasi Pelaksanaan Program Pembinaan, Pendidikan, dan Santunan Anak Yatim
        </div>

        <div class="cover-meta">
            <strong>YAYASAN GELIYAT MAHDIESA NAHATE</strong><br>
            Akte Notaris & Kemenkumham RI No. AHU-0012345.AH.01.04.Tahun 2020<br>
            Sekretariat: Jl. Cigending No. 12, Ujungberung, Kota Bandung, Jawa Barat 40611<br>
            Email: info@geliyat.or.id &bull; Website: www.geliyat.or.id
            @if($laporan->nomor_dokumen)
                <br><span style="font-family: monospace; font-size: 8.5pt; color: #087f8c; margin-top: 4px; display: inline-block;">No. Dokumen: {{ $laporan->nomor_dokumen }}</span>
            @endif
        </div>
    </div>

    <div class="page-break"></div>

    {{-- ======================================================== --}}
    {{-- 2. PENDAHULUAN                                            --}}
    {{-- ======================================================== --}}
    <div>
        <h1 class="section-title">I. Pendahuluan</h1>

        <h2 class="subsection-title">1.1 Latar Belakang</h2>
        <p class="lead">
            {{ $laporan->latar_belakang ?: 'Yayasan Geliyat Mahdiesa Nahate berkedudukan di wilayah Kecamatan Ujungberung, Kota Bandung, senantiasa berikhtiar secara konsisten memberikan pengabdian sosial dan pembinaan berkelanjutan bagi 420 anak yatim dan dhuafa di lima kelurahan (Cigending, Pasanggrahan, Pasir Endah, Pasirjati, dan Pasirwangi).' }}
        </p>

        <h2 class="subsection-title">1.2 Tujuan Laporan</h2>
        <div style="white-space: pre-line; line-height: 1.6; text-align: justify; margin-bottom: 16px;">
            {{ $laporan->tujuan_laporan ?: "1. Memberikan pertanggungjawaban formal atas amanah donatur, mitra, dan masyarakat sepanjang tahun {$laporan->tahun}.\n2. Mendokumentasikan rekam jejak pelaksanaan seluruh program kerja yayasan.\n3. Menjadi acuan evaluasi strategis guna meningkatkan efektivitas pembinaan anak yatim binaan pada periode mendatang." }}
        </div>

        <div class="summary-box avoid-break">
            <table>
                <tr>
                    <td style="width: 35%; font-weight: bold; color: #087f8c;">Tahun Pelaporan</td>
                    <td>: Tahun {{ $laporan->tahun }}</td>
                </tr>
                <tr>
                    <td style="font-weight: bold; color: #087f8c;">Total Kegiatan Terlaksana</td>
                    <td>: {{ $kegiatanList->count() }} Kegiatan Program Kerja</td>
                </tr>
                <tr>
                    <td style="font-weight: bold; color: #087f8c;">Bidang Penyelenggara</td>
                    <td>: Pendidikan, Kemanusiaan, Keagamaan, dan Ekonomi</td>
                </tr>
                <tr>
                    <td style="font-weight: bold; color: #087f8c;">Sasaran Utama</td>
                    <td>: 420 Anak Yatim Binaan di 5 Kelurahan Ujungberung</td>
                </tr>
            </table>
        </div>
    </div>

    <div class="page-break"></div>

    {{-- ======================================================== --}}
    {{-- 3. ISI LAPORAN: RANGKUMAN & DAFTAR PELAKSANAAN KEGIATAN  --}}
    {{-- ======================================================== --}}
    <div>
        <h1 class="section-title">II. Pelaksanaan Kegiatan Program</h1>

        <p>
            Berikut merupakan rincian kegiatan operasional dan program kerja yang telah berhasil diselenggarakan oleh Yayasan Geliyat sepanjang tahun {{ $laporan->tahun }}:
        </p>

        {{-- Tabel Rekapitulasi Ringkas --}}
        <table class="table-custom">
            <thead>
                <tr>
                    <th style="width: 5%; text-align: center;">No</th>
                    <th style="width: 32%;">Nama Kegiatan</th>
                    <th style="width: 20%;">Tanggal & Lokasi</th>
                    <th style="width: 18%;">Bidang</th>
                    <th style="width: 25%;">Kategori</th>
                </tr>
            </thead>
            <tbody>
                @forelse($kegiatanList as $idx => $k)
                    <tr>
                        <td style="text-align: center; font-weight: bold;">{{ $idx + 1 }}</td>
                        <td><strong>{{ $k->judul }}</strong></td>
                        <td>
                            {{ $k->tanggal_kegiatan ? $k->tanggal_kegiatan->format('d/m/Y') : '-' }}<br>
                            <span style="color: #64748b; font-size: 8pt;">{{ $k->lokasi }}</span>
                        </td>
                        <td>{{ $k->bidang ? $k->bidang->nama : 'Umum' }}</td>
                        <td>{{ $k->kategori }}</td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="5" style="text-align: center; color: #94a3b8; padding: 12px;">
                            Belum terdapat catatan kegiatan untuk tahun {{ $laporan->tahun }}.
                        </td>
                    </tr>
                @endforelse
            </tbody>
        </table>

        <div class="page-break"></div>

        <h2 class="subsection-title" style="margin-top: 0; margin-bottom: 12px;">2.2 Rincian Deskripsi dan Capaian Setiap Kegiatan</h2>

        @foreach($kegiatanList as $idx => $kegiatan)
            <div class="activity-card avoid-break">
                <div class="activity-card-header">
                    <div style="float: right;">
                        <span class="activity-badge">{{ $kegiatan->bidang ? $kegiatan->bidang->nama : 'Umum' }}</span>
                    </div>
                    <div class="activity-card-title">{{ $idx + 1 }}. {{ $kegiatan->judul }}</div>
                    <div class="activity-card-meta">
                        <strong>Waktu:</strong> {{ $kegiatan->tanggal_kegiatan ? $kegiatan->tanggal_kegiatan->translatedFormat('d F Y') : '-' }} &bull;
                        <strong>Lokasi:</strong> {{ $kegiatan->lokasi }} &bull;
                        <strong>Kategori:</strong> {{ $kegiatan->kategori }}
                    </div>
                    <div style="clear: both;"></div>
                </div>

                <div style="font-size: 9pt; color: #334155;">
                    <p style="margin-bottom: 6px;">
                        <strong>Deskripsi Pelaksanaan:</strong><br>
                        {{ $kegiatan->deskripsi }}
                    </p>
                    @if($kegiatan->ringkasan && $kegiatan->ringkasan !== $kegiatan->deskripsi)
                        <p style="margin-bottom: 6px;">
                            <strong>Hasil & Dampak:</strong><br>
                            {{ $kegiatan->ringkasan }}
                        </p>
                    @endif
                </div>
            </div>
        @endforeach
    </div>

    <div class="page-break"></div>

    {{-- ======================================================== --}}
    {{-- 4. DOKUMENTASI KEGIATAN                                   --}}
    {{-- ======================================================== --}}
    <div>
        <h1 class="section-title">III. Dokumentasi Visual Kegiatan</h1>
        <p>
            Bukti dokumentasi visual pelaksanaan kegiatan yang terekam secara faktual di lapangan:
        </p>

        @php
            $hasDoc = false;
        @endphp

        @if(!empty($hasGd))
            @foreach($kegiatanList as $kegiatan)
                @php
                    $docs = is_array($kegiatan->dokumentasi) ? $kegiatan->dokumentasi : [];
                    $gambarUtama = $kegiatan->gambar;
                @endphp

                @if($gambarUtama || !empty($docs))
                    @php $hasDoc = true; @endphp
                    <div class="avoid-break" style="margin-bottom: 16px; border: 0.5pt solid #cbd5e1; padding: 10px; border-radius: 4px;">
                        <div style="font-weight: bold; font-size: 9.5pt; color: #087f8c; margin-bottom: 6px;">
                            {{ $kegiatan->judul }}
                        </div>
                        <div style="font-size: 8pt; color: #64748b; margin-bottom: 8px;">
                            Tanggal: {{ $kegiatan->tanggal_kegiatan ? $kegiatan->tanggal_kegiatan->translatedFormat('d F Y') : '-' }} &bull; Lokasi: {{ $kegiatan->lokasi }}
                        </div>

                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                @if($gambarUtama)
                                    <td style="width: 50%; vertical-align: top; padding: 4px; text-align: center;">
                                        <img src="{{ $gambarUtama }}" class="doc-img" alt="{{ $kegiatan->judul }}" style="max-height: 140px;">
                                        <div class="doc-caption">Foto Utama Kegiatan</div>
                                        <div class="doc-meta">{{ $kegiatan->tanggal_kegiatan ? $kegiatan->tanggal_kegiatan->format('d/m/Y') : '' }}</div>
                                    </td>
                                @endif

                                @if(!empty($docs) && isset($docs[0]))
                                    @php
                                        $itemDoc = $docs[0];
                                        $url = is_string($itemDoc) ? $itemDoc : ($itemDoc['url'] ?? '');
                                        $caption = is_array($itemDoc) ? ($itemDoc['caption'] ?? 'Dokumentasi') : 'Dokumentasi Pelaksanaan';
                                    @endphp
                                    @if($url)
                                        <td style="width: 50%; vertical-align: top; padding: 4px; text-align: center;">
                                            <img src="{{ $url }}" class="doc-img" alt="{{ $caption }}" style="max-height: 140px;">
                                            <div class="doc-caption">{{ $caption }}</div>
                                            <div class="doc-meta">{{ $kegiatan->tanggal_kegiatan ? $kegiatan->tanggal_kegiatan->format('d/m/Y') : '' }}</div>
                                        </td>
                                    @endif
                                @endif
                            </tr>
                        </table>
                    </div>
                @endif
            @endforeach
        @endif

        @if(!$hasDoc)
            <div style="text-align: center; color: #64748b; padding: 25px; border: 0.5pt dashed #cbd5e1; border-radius: 4px; background-color: #f8fafc;">
                Dokumentasi visual terlampir pada arsip fisik yayasan atau dapat dilihat pada halaman rincian masing-masing kegiatan website resmi.
            </div>
        @endif
    </div>

    <div class="page-break"></div>

    {{-- ======================================================== --}}
    {{-- 5. PENUTUP & LEMBAR PENGESAHAN                            --}}
    {{-- ======================================================== --}}
    <div class="avoid-break">
        <h1 class="section-title">IV. Penutup & Lembar Pengesahan</h1>

        <h2 class="subsection-title">4.1 Kesimpulan</h2>
        <p>
            {{ $laporan->kesimpulan ?: "Pelaksanaan seluruh program kerja Yayasan Geliyat pada tahun {$laporan->tahun} telah berjalan dengan baik, transparan, dan tepat sasaran berkat dukungan para donatur, relawan, pengurus, serta aparat kewilayahan setempat." }}
        </p>

        <h2 class="subsection-title">4.2 Evaluasi & Harapan Yayasan</h2>
        <p>
            {{ $laporan->harapan_evaluasi ?: "Pada tahun berikutnya, yayasan menargetkan perluasan jangkauan program beasiswa pendidikan perguruan tinggi, peningkatan fasilitas bimbel, dan penguatan kemandirian ekonomi keluarga binaan melalui unit usaha koperasi yayasan." }}
        </p>

        <p style="margin-top: 14px;">
            Demikian Laporan Kegiatan Tahunan ini disusun dengan sebenar-benarnya sebagai wujud transparansi, akuntabilitas, dan ikhtiar tulus menjaga amanah sosial bagi kemaslahatan anak-anak yatim binaan.
        </p>

        {{-- Lembar Tanda Tangan --}}
        <div class="signature-section">
            <div style="text-align: right; font-size: 9.5pt; color: #334155; margin-bottom: 12px; padding-right: 20px;">
                Bandung, {{ $laporan->tanggal_penerbitan ? $laporan->tanggal_penerbitan->translatedFormat('d F Y') : now()->translatedFormat('d F Y') }}
            </div>

            <table class="signature-table">
                <tr>
                    <td>
                        <div style="font-size: 9.5pt; font-weight: bold; color: #334155;">Mengetahui,</div>
                        <div class="signature-role">Ketua Yayasan Geliyat</div>
                        <div class="signature-space"></div>
                        <div class="signature-name">{{ $laporan->penandatangan_ketua ?: 'H. Ahmad Fauzi' }}</div>
                        <div class="signature-role">NIPY. 2020.01.001</div>
                    </td>
                    <td>
                        <div style="font-size: 9.5pt; font-weight: bold; color: #334155;">Disusun oleh,</div>
                        <div class="signature-role">Sekretaris Yayasan</div>
                        <div class="signature-space"></div>
                        <div class="signature-name">{{ $laporan->penandatangan_sekretaris ?: 'M. Ridwan, S.Pd.' }}</div>
                        <div class="signature-role">NIPY. 2020.01.003</div>
                    </td>
                </tr>
            </table>
        </div>
    </div>
</body>
</html>

