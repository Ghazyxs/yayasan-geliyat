<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bukti Invoice Donasi - Yayasan Geliyat</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f8f9; font-family:Arial, Helvetica, sans-serif; color:#1d2b2d;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f4f8f9; padding:32px 16px;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:600px; background-color:#ffffff; border:1px solid #e4eaec; border-radius:16px; overflow:hidden;">
                    <!-- Header -->
                    <tr>
                        <td style="background-color:#087f8c; padding:24px 32px;">
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                <tr>
                                    <td>
                                        <p style="margin:0; font-size:11px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:#9decf4;">
                                            Yayasan Geliyat Mahdiesa Nahate
                                        </p>
                                        <h1 style="margin:6px 0 0 0; font-size:20px; font-weight:700; color:#ffffff;">
                                            Bukti Invoice Donasi Resmi
                                        </h1>
                                    </td>
                                    <td align="right" valign="middle">
                                        <span style="display:inline-block; background-color:#d1fae5; color:#065f46; font-size:11px; font-weight:700; padding:6px 12px; border-radius:999px;">
                                            LUNAS / TERVERIFIKASI
                                        </span>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                        <td style="padding:28px 32px;">
                            <p style="margin:0 0 14px 0; font-size:14px; line-height:1.6; color:#334155;">
                                Jazakumullahu khairan katsiran, <strong>{{ $donasi->nama_donatur }}</strong>.
                            </p>
                            <p style="margin:0 0 20px 0; font-size:14px; line-height:1.6; color:#334155;">
                                Donasi Anda telah berhasil kami terima, terverifikasi otomatis oleh sistem, dan tercatat pada buku kas amanah Yayasan Geliyat Mahdiesa Nahate. Berikut rincian bukti invoice resmi Anda:
                            </p>

                            <!-- Receipt Table -->
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f7fcfd; border:1px solid #d5ecef; border-radius:12px; margin-bottom:20px;">
                                <tr>
                                    <td style="padding:16px 20px;">
                                        <table role="presentation" width="100%" cellspacing="0" cellpadding="6" border="0" style="font-size:13px;">
                                            <tr>
                                                <td style="color:#64748b; width:44%;">Nomor Invoice / Kode</td>
                                                <td style="font-weight:700; color:#1d2b2d; font-family:monospace; text-align:right;">{{ $donasi->kode_donasi }}</td>
                                            </tr>
                                            <tr>
                                                <td style="color:#64748b; border-top:1px solid #e4eaec;">Nama Donatur</td>
                                                <td style="font-weight:600; color:#1d2b2d; text-align:right; border-top:1px solid #e4eaec;">{{ $donasi->nama_donatur }}</td>
                                            </tr>
                                            <tr>
                                                <td style="color:#64748b; border-top:1px solid #e4eaec;">Tanggal &amp; Waktu Bayar</td>
                                                <td style="font-weight:600; color:#1d2b2d; text-align:right; border-top:1px solid #e4eaec;">{{ $waktuBayar }}</td>
                                            </tr>
                                            <tr>
                                                <td style="color:#64748b; border-top:1px solid #e4eaec;">Metode Pembayaran</td>
                                                <td style="font-weight:600; color:#1d2b2d; text-align:right; border-top:1px solid #e4eaec;">{{ $metodeLabel }}</td>
                                            </tr>
                                            <tr>
                                                <td style="color:#64748b; border-top:1px solid #e4eaec;">Program Donasi</td>
                                                <td style="font-weight:600; color:#1d2b2d; text-align:right; border-top:1px solid #e4eaec;">{{ $donasi->jenis_donasi }}</td>
                                            </tr>
                                            <tr>
                                                <td style="color:#64748b; border-top:1px solid #e4eaec;">Nominal Diterima</td>
                                                <td style="font-weight:700; font-size:16px; color:#087f8c; text-align:right; border-top:1px solid #e4eaec;">{{ $nominalFormatted }}</td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            @if($donasi->pesan_doa)
                                <div style="background-color:#fbfdfd; border-left:4px solid #14bace; padding:12px 16px; border-radius:6px; margin-bottom:22px;">
                                    <p style="margin:0 0 4px 0; font-size:11px; font-weight:700; color:#087f8c; text-transform:uppercase;">
                                        Pesan &amp; Doa
                                    </p>
                                    <p style="margin:0; font-size:13px; line-height:1.5; color:#334155; font-style:italic;">
                                        "{{ $donasi->pesan_doa }}"
                                    </p>
                                </div>
                            @endif

                            <!-- CTA Button -->
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom:20px;">
                                <tr>
                                    <td align="center">
                                        <a href="{{ $invoiceUrl }}" style="display:inline-block; background-color:#14bace; color:#ffffff; text-decoration:none; font-size:14px; font-weight:700; padding:13px 28px; border-radius:10px;">
                                            Lihat &amp; Cetak Invoice
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <p style="margin:0; font-size:12px; color:#64748b; text-align:center;">
                                Simpan email ini sebagai bukti donasi sah Anda. Semoga menjadi amal jariyah yang penuh keberkahan.
                            </p>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color:#f8fafb; border-top:1px solid #e4eaec; padding:18px 32px; text-align:center;">
                            <p style="margin:0; font-size:12px; font-weight:700; color:#1d2b2d;">
                                Yayasan Geliyat Mahdiesa Nahate
                            </p>
                            <p style="margin:4px 0 0 0; font-size:11px; color:#64748b;">
                                Jl. Kampung Baru Rt.02/05 No.42, Cigending, Kec. Ujungberung, Kota Bandung 40611
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
