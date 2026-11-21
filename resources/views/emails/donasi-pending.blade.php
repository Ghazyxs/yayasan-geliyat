<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Menunggu Pembayaran Donasi - Yayasan Geliyat</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f8f9; font-family:Arial, Helvetica, sans-serif; color:#1d2b2d;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f4f8f9; padding:32px 16px;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:600px; background-color:#ffffff; border:1px solid #e4eaec; border-radius:16px; overflow:hidden;">
                    <!-- Header -->
                    <tr>
                        <td style="background-color:#087f8c; padding:24px 32px; text-align:left;">
                            <p style="margin:0; font-size:11px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:#9decf4;">
                                Yayasan Geliyat Mahdiesa Nahate
                            </p>
                            <h1 style="margin:6px 0 0 0; font-size:20px; font-weight:700; color:#ffffff;">
                                Menunggu Penyelesaian Pembayaran
                            </h1>
                        </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                        <td style="padding:28px 32px;">
                            <p style="margin:0 0 14px 0; font-size:14px; line-height:1.6; color:#334155;">
                                Assalamu'alaikum <strong>{{ $donasi->nama_donatur }}</strong>,
                            </p>
                            <p style="margin:0 0 20px 0; font-size:14px; line-height:1.6; color:#334155;">
                                Terima kasih atas niat baik Anda untuk berdonasi melalui Yayasan Geliyat Mahdiesa Nahate. Pengajuan donasi Anda telah tercatat. Apabila jendela pembayaran sebelumnya tertutup atau halaman browser berpindah, Anda dapat melanjutkan pembayaran melalui tombol di bawah ini sebelum batas waktu berakhir.
                            </p>

                            <!-- Summary Table -->
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f7fcfd; border:1px solid #d5ecef; border-radius:12px; margin-bottom:24px;">
                                <tr>
                                    <td style="padding:16px 20px;">
                                        <table role="presentation" width="100%" cellspacing="0" cellpadding="6" border="0" style="font-size:13px;">
                                            <tr>
                                                <td style="color:#64748b; width:44%;">Kode Donasi</td>
                                                <td style="font-weight:700; color:#1d2b2d; font-family:monospace; text-align:right;">{{ $donasi->kode_donasi }}</td>
                                            </tr>
                                            <tr>
                                                <td style="color:#64748b; border-top:1px solid #e4eaec;">Nama Donatur</td>
                                                <td style="font-weight:600; color:#1d2b2d; text-align:right; border-top:1px solid #e4eaec;">{{ $donasi->nama_donatur }}</td>
                                            </tr>
                                            <tr>
                                                <td style="color:#64748b; border-top:1px solid #e4eaec;">Program Donasi</td>
                                                <td style="font-weight:600; color:#1d2b2d; text-align:right; border-top:1px solid #e4eaec;">{{ $donasi->jenis_donasi }}</td>
                                            </tr>
                                            <tr>
                                                <td style="color:#64748b; border-top:1px solid #e4eaec;">Nominal Donasi</td>
                                                <td style="font-weight:700; font-size:15px; color:#087f8c; text-align:right; border-top:1px solid #e4eaec;">{{ $nominalFormatted }}</td>
                                            </tr>
                                            <tr>
                                                <td style="color:#64748b; border-top:1px solid #e4eaec;">Batas Waktu</td>
                                                <td style="font-weight:600; color:#b45309; text-align:right; border-top:1px solid #e4eaec;">{{ $batasWaktu }}</td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            <!-- CTA Button -->
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom:20px;">
                                <tr>
                                    <td align="center">
                                        <a href="{{ $invoiceUrl }}" style="display:inline-block; background-color:#14bace; color:#ffffff; text-decoration:none; font-size:14px; font-weight:700; padding:13px 28px; border-radius:10px;">
                                            Lanjutkan Pembayaran
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <p style="margin:0 0 8px 0; font-size:12px; color:#64748b; text-align:center;">
                                Atau buka tautan berikut di browser Anda:
                            </p>
                            <p style="margin:0; font-size:12px; color:#087f8c; word-break:break-all; text-align:center;">
                                <a href="{{ $invoiceUrl }}" style="color:#087f8c;">{{ $invoiceUrl }}</a>
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
                                Kec. Ujungberung, Kota Bandung &bull; Email otomatis, mohon tidak membalas langsung ke alamat ini.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
