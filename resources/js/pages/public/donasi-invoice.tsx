import { useEffect, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowLeft,
    Ban,
    CheckCircle2,
    ChevronRight,
    Clock,
    CreditCard,
    Heart,
    Loader2,
    Printer,
    RefreshCw,
    ShieldCheck,
} from 'lucide-react';
import PublicLayout from '@/layouts/public-layout';
import { useLanguage } from '@/hooks/use-language';

export interface DonasiInvoiceData {
    kode_donasi: string;
    nama_donatur: string;
    email_masked: string | null;
    jenis_donasi: string;
    nominal: number;
    pesan_doa: string | null;
    status_verifikasi: 'menunggu' | 'terverifikasi' | 'ditolak' | 'dibatalkan';
    metode_pembayaran: string | null;
    metode_label: string;
    created_at_iso: string | null;
    paid_at_iso: string | null;
    expires_at_iso: string | null;
    is_expired: boolean;
    can_resume: boolean;
    snap_token: string | null;
    snap_redirect_url: string | null;
    status_url: string;
    catatan_verifikasi: string | null;
}

interface DonasiInvoicePageProps {
    donasi: DonasiInvoiceData;
    midtransClientKey?: string | null;
    midtransSnapJsUrl?: string;
}

function formatRemainingTime(targetIso: string | null): {
    text: string;
    expired: boolean;
} {
    if (!targetIso) {
        return { text: '--:--:--', expired: false };
    }

    const diffMs = new Date(targetIso).getTime() - Date.now();
    if (Number.isNaN(diffMs) || diffMs <= 0) {
        return { text: '00:00:00', expired: true };
    }

    const totalSeconds = Math.floor(diffMs / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return {
        text: [hours, minutes, seconds]
            .map((unit) => String(unit).padStart(2, '0'))
            .join(':'),
        expired: false,
    };
}

function formatDateTime(iso: string | null, lang: 'id' | 'en'): string {
    if (!iso) return '-';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '-';

    return (
        new Intl.DateTimeFormat(lang === 'id' ? 'id-ID' : 'en-US', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'Asia/Jakarta',
        }).format(d) + ' WIB'
    );
}

export default function DonasiInvoicePage({
    donasi,
    midtransClientKey = null,
    midtransSnapJsUrl = 'https://app.sandbox.midtrans.com/snap/snap.js',
}: DonasiInvoicePageProps) {
    const { lang, t } = useLanguage();
    const [countdown, setCountdown] = useState(() =>
        formatRemainingTime(donasi.expires_at_iso),
    );
    const [isCheckingStatus, setIsCheckingStatus] = useState(false);
    const [isOpeningSnap, setIsOpeningSnap] = useState(false);
    const [notice, setNotice] = useState<{
        type: 'success' | 'pending' | 'error';
        message: string;
    } | null>(null);

    const isPending = donasi.status_verifikasi === 'menunggu';
    const isVerified = donasi.status_verifikasi === 'terverifikasi';
    const isLocallyExpired =
        donasi.is_expired || (isPending && countdown.expired);

    // Muat Snap.js hanya jika transaksi masih bisa dilanjutkan
    useEffect(() => {
        if (!donasi.can_resume || !midtransClientKey || !midtransSnapJsUrl) {
            return;
        }

        const scriptId = 'midtrans-snap-script';
        if (document.getElementById(scriptId)) return;

        const script = document.createElement('script');
        script.id = scriptId;
        script.src = midtransSnapJsUrl;
        script.setAttribute('data-client-key', midtransClientKey);
        script.async = true;
        document.body.appendChild(script);
    }, [donasi.can_resume, midtransClientKey, midtransSnapJsUrl]);

    // Countdown timer setiap 1 detik selama berstatus menunggu
    useEffect(() => {
        if (!isPending || !donasi.expires_at_iso) {
            return;
        }

        setCountdown(formatRemainingTime(donasi.expires_at_iso));
        const interval = window.setInterval(() => {
            setCountdown(formatRemainingTime(donasi.expires_at_iso));
        }, 1000);

        return () => window.clearInterval(interval);
    }, [isPending, donasi.expires_at_iso]);

    const formatRupiah = (val: number) => `Rp${val.toLocaleString('id-ID')}`;

    const handleCheckStatus = async () => {
        setIsCheckingStatus(true);
        setNotice(null);

        try {
            const res = await fetch(donasi.status_url);
            const data = await res.json();

            if (res.ok && data.status_verifikasi === 'terverifikasi') {
                setNotice({
                    type: 'success',
                    message: t(
                        'Pembayaran terkonfirmasi lunas. Memuat bukti invoice resmi...',
                        'Payment confirmed. Loading official invoice...',
                    ),
                });
            } else if (res.ok && data.is_expired) {
                setNotice({
                    type: 'error',
                    message: t(
                        'Waktu pembayaran telah berakhir.',
                        'Payment deadline has expired.',
                    ),
                });
            } else if (res.ok) {
                setNotice({
                    type: 'pending',
                    message: t(
                        'Status masih menunggu pembayaran. Silakan selesaikan melalui tombol Lanjutkan Pembayaran.',
                        'Status is still awaiting payment. Please complete it using the Resume Payment button.',
                    ),
                });
            }

            router.reload({ only: ['donasi'] });
        } catch {
            setNotice({
                type: 'error',
                message: t(
                    'Gagal memeriksa status transaksi. Silakan coba lagi.',
                    'Failed to check transaction status. Please try again.',
                ),
            });
        } finally {
            setIsCheckingStatus(false);
        }
    };

    const handleResumePayment = () => {
        if (!donasi.snap_token) {
            if (donasi.snap_redirect_url) {
                window.location.href = donasi.snap_redirect_url;
            }
            return;
        }

        if (typeof window.snap !== 'undefined' && window.snap.pay) {
            setIsOpeningSnap(true);
            setNotice(null);

            window.snap.pay(donasi.snap_token, {
                onSuccess: () => {
                    fetch(donasi.status_url)
                        .catch(() => {})
                        .finally(() => {
                            setIsOpeningSnap(false);
                            router.reload({ only: ['donasi'] });
                        });
                },
                onPending: () => {
                    setIsOpeningSnap(false);
                    setNotice({
                        type: 'pending',
                        message: t(
                            'Silakan selesaikan pembayaran sesuai instruksi sebelum batas waktu berakhir.',
                            'Please complete your payment according to the instructions before the deadline.',
                        ),
                    });
                    router.reload({ only: ['donasi'] });
                },
                onError: () => {
                    setIsOpeningSnap(false);
                    setNotice({
                        type: 'error',
                        message: t(
                            'Pembayaran gagal atau ditolak. Anda dapat mencoba memilih metode pembayaran lainnya.',
                            'Payment failed or was declined. You may try another payment method.',
                        ),
                    });
                    router.reload({ only: ['donasi'] });
                },
                onClose: () => {
                    setIsOpeningSnap(false);
                    router.reload({ only: ['donasi'] });
                },
            });
        } else if (donasi.snap_redirect_url) {
            window.location.href = donasi.snap_redirect_url;
        } else {
            setNotice({
                type: 'error',
                message: t(
                    'Modul pembayaran sedang dimuat. Silakan muat ulang halaman beberapa saat lagi.',
                    'Payment module is loading. Please refresh the page shortly.',
                ),
            });
        }
    };

    return (
        <PublicLayout>
            <Head
                title={
                    isVerified
                        ? `${t('Bukti Invoice Donasi', 'Donation Invoice')} ${donasi.kode_donasi}`
                        : `${t('Status Pembayaran Donasi', 'Donation Payment Status')} ${donasi.kode_donasi}`
                }
            />

            {/* Header Breadcrumb (disembunyikan saat cetak) */}
            <div className="border-b border-[#e4eaec] bg-gradient-to-r from-[#d1f6fa]/60 via-[#e8f8fa] to-[#f7fcfd] py-8 sm:py-10 print:hidden">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    <nav className="flex flex-wrap items-center gap-2 font-poppins text-xs text-slate-500 sm:text-sm">
                        <Link
                            href="/"
                            className="transition-colors hover:text-[#14bace]"
                        >
                            {t('Beranda', 'Home')}
                        </Link>
                        <ChevronRight className="size-4 text-slate-400" />
                        <Link
                            href="/donasi"
                            className="transition-colors hover:text-[#14bace]"
                        >
                            {t('Donasi Digital', 'Digital Donation')}
                        </Link>
                        <ChevronRight className="size-4 text-slate-400" />
                        <span className="font-semibold text-[#087f8c]">
                            {donasi.kode_donasi}
                        </span>
                    </nav>
                    <h1 className="mt-3 font-poppins text-2xl font-bold text-[#1d2b2d] sm:text-3xl">
                        {isVerified
                            ? t(
                                  'Bukti Invoice Donasi Resmi',
                                  'Official Donation Invoice',
                              )
                            : t(
                                  'Status & Penyelesaian Pembayaran',
                                  'Payment Status & Continuation',
                              )}
                    </h1>
                </div>
            </div>

            <section className="bg-[#f8fafb] py-10 sm:py-14 print:bg-white print:py-0">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 print:max-w-none print:px-0">
                    {/* Feedback Notice */}
                    {notice && (
                        <div
                            className={`mb-6 flex items-start gap-3 rounded-2xl border p-4 text-xs sm:text-sm print:hidden ${
                                notice.type === 'success'
                                    ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                                    : notice.type === 'pending'
                                      ? 'border-amber-200 bg-amber-50 text-amber-900'
                                      : 'border-rose-200 bg-rose-50 text-rose-900'
                            }`}
                        >
                            {notice.type === 'success' && (
                                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                            )}
                            {notice.type === 'pending' && (
                                <Clock className="mt-0.5 size-4 shrink-0 text-amber-600" />
                            )}
                            {notice.type === 'error' && (
                                <AlertCircle className="mt-0.5 size-4 shrink-0 text-rose-600" />
                            )}
                            <p className="leading-relaxed">{notice.message}</p>
                        </div>
                    )}

                    {/* Card Utama */}
                    <div className="overflow-hidden rounded-3xl border border-[#e4eaec] bg-white shadow-xs print:rounded-none print:border-0 print:shadow-none">
                        {/* Kop / Banner Status */}
                        <div className="border-b border-[#e4eaec] bg-[#fbfdfd] px-6 py-6 sm:px-8 sm:py-7">
                            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                                <div className="flex items-center gap-3.5">
                                    <img
                                        src="/images/logo.png"
                                        alt="Logo Yayasan Geliyat"
                                        className="size-12 shrink-0 rounded-xl border border-[#e4eaec] bg-white object-contain p-1.5"
                                    />
                                    <div>
                                        <p className="font-poppins text-xs font-bold tracking-wider text-[#087f8c] uppercase">
                                            Yayasan Geliyat Mahdiesa Nahate
                                        </p>
                                        <p className="mt-0.5 font-mono text-sm font-bold text-[#1d2b2d] sm:text-base">
                                            {donasi.kode_donasi}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    {isVerified && (
                                        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1.5 font-poppins text-xs font-bold text-emerald-700">
                                            <CheckCircle2 className="size-4" />
                                            {t(
                                                'LUNAS / TERVERIFIKASI',
                                                'PAID / VERIFIED',
                                            )}
                                        </span>
                                    )}
                                    {isPending && !isLocallyExpired && (
                                        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3.5 py-1.5 font-poppins text-xs font-bold text-amber-700">
                                            <Clock className="size-4" />
                                            {t(
                                                'MENUNGGU PEMBAYARAN',
                                                'AWAITING PAYMENT',
                                            )}
                                        </span>
                                    )}
                                    {(donasi.status_verifikasi ===
                                        'dibatalkan' ||
                                        isLocallyExpired) && (
                                        <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-100 px-3.5 py-1.5 font-poppins text-xs font-bold text-slate-600">
                                            <Ban className="size-4" />
                                            {t(
                                                'KEDALUWARSA / DIBATALKAN',
                                                'EXPIRED / CANCELLED',
                                            )}
                                        </span>
                                    )}
                                    {donasi.status_verifikasi === 'ditolak' && (
                                        <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-3.5 py-1.5 font-poppins text-xs font-bold text-rose-700">
                                            <AlertCircle className="size-4" />
                                            {t(
                                                'PEMBAYARAN DITOLAK',
                                                'PAYMENT DECLINED',
                                            )}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Countdown Banner khusus saat masih Menunggu Pembayaran */}
                        {isPending && !isLocallyExpired && (
                            <div className="border-b border-amber-200/70 bg-amber-50/70 px-6 py-4 sm:px-8 print:hidden">
                                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                                    <div>
                                        <p className="font-poppins text-xs font-bold text-amber-900 sm:text-sm">
                                            {t(
                                                'Selesaikan pembayaran sebelum batas waktu berakhir',
                                                'Complete payment before the deadline expires',
                                            )}
                                        </p>
                                        {donasi.expires_at_iso && (
                                            <p className="mt-0.5 font-sans text-xs text-amber-800">
                                                {t('Batas waktu:', 'Deadline:')}{' '}
                                                {formatDateTime(
                                                    donasi.expires_at_iso,
                                                    lang,
                                                )}
                                            </p>
                                        )}
                                    </div>
                                    <div className="self-start rounded-xl border border-amber-300 bg-white px-4 py-2 text-center sm:self-auto">
                                        <span className="block font-sans text-[10px] font-semibold tracking-wider text-amber-700 uppercase">
                                            {t('Sisa Waktu', 'Remaining')}
                                        </span>
                                        <span className="font-mono text-lg font-bold text-amber-900 tabular-nums">
                                            {countdown.text}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Rincian Transaksi */}
                        <div className="p-6 sm:p-8">
                            <div className="rounded-2xl border border-[#e4eaec] bg-[#fbfdfd] p-5 sm:p-6">
                                <div className="mb-4 flex flex-col justify-between gap-2 border-b border-[#e4eaec] pb-4 sm:flex-row sm:items-end">
                                    <div>
                                        <span className="font-sans text-xs text-slate-500">
                                            {t(
                                                'Total Nominal Donasi',
                                                'Total Donation Amount',
                                            )}
                                        </span>
                                        <p className="mt-0.5 font-poppins text-3xl font-bold text-[#087f8c]">
                                            {formatRupiah(donasi.nominal)}
                                        </p>
                                    </div>
                                    <span className="font-sans text-xs text-slate-500">
                                        {donasi.jenis_donasi}
                                    </span>
                                </div>

                                <dl className="divide-y divide-slate-100 text-xs sm:text-sm">
                                    <div className="flex items-center justify-between gap-4 py-3">
                                        <dt className="text-slate-500">
                                            {t(
                                                'Kode Donasi / Invoice',
                                                'Donation / Invoice Code',
                                            )}
                                        </dt>
                                        <dd className="font-mono font-bold text-[#1d2b2d]">
                                            {donasi.kode_donasi}
                                        </dd>
                                    </div>
                                    <div className="flex items-center justify-between gap-4 py-3">
                                        <dt className="text-slate-500">
                                            {t('Nama Donatur', 'Donor Name')}
                                        </dt>
                                        <dd className="text-right font-semibold text-[#1d2b2d]">
                                            {donasi.nama_donatur}
                                        </dd>
                                    </div>
                                    {donasi.email_masked && (
                                        <div className="flex items-center justify-between gap-4 py-3">
                                            <dt className="text-slate-500">
                                                {t(
                                                    'Email Penerima Invoice',
                                                    'Invoice Recipient Email',
                                                )}
                                            </dt>
                                            <dd className="font-mono text-slate-700">
                                                {donasi.email_masked}
                                            </dd>
                                        </div>
                                    )}
                                    <div className="flex items-center justify-between gap-4 py-3">
                                        <dt className="text-slate-500">
                                            {t(
                                                'Tanggal Pengajuan',
                                                'Submission Date',
                                            )}
                                        </dt>
                                        <dd className="text-right text-slate-700">
                                            {formatDateTime(
                                                donasi.created_at_iso,
                                                lang,
                                            )}
                                        </dd>
                                    </div>
                                    {isVerified && (
                                        <>
                                            <div className="flex items-center justify-between gap-4 py-3">
                                                <dt className="text-slate-500">
                                                    {t(
                                                        'Waktu Pembayaran',
                                                        'Payment Timestamp',
                                                    )}
                                                </dt>
                                                <dd className="text-right font-semibold text-emerald-700">
                                                    {formatDateTime(
                                                        donasi.paid_at_iso,
                                                        lang,
                                                    )}
                                                </dd>
                                            </div>
                                            <div className="flex items-center justify-between gap-4 py-3">
                                                <dt className="text-slate-500">
                                                    {t(
                                                        'Metode Pembayaran',
                                                        'Payment Method',
                                                    )}
                                                </dt>
                                                <dd className="text-right font-semibold text-[#1d2b2d]">
                                                    {donasi.metode_label}
                                                </dd>
                                            </div>
                                        </>
                                    )}
                                </dl>

                                {donasi.pesan_doa && (
                                    <div className="mt-4 rounded-xl border-l-4 border-[#14bace] bg-white p-4">
                                        <p className="font-poppins text-[11px] font-bold tracking-wider text-[#087f8c] uppercase">
                                            {t(
                                                'Pesan & Doa Donatur',
                                                'Donor Message & Prayer',
                                            )}
                                        </p>
                                        <p className="mt-1 font-sans text-xs leading-relaxed text-slate-600 italic sm:text-sm">
                                            "{donasi.pesan_doa}"
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Pesan status bila expired / ditolak */}
                            {(donasi.status_verifikasi === 'dibatalkan' ||
                                donasi.status_verifikasi === 'ditolak' ||
                                isLocallyExpired) && (
                                <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs leading-relaxed text-slate-600 sm:text-sm">
                                    {donasi.catatan_verifikasi ||
                                        t(
                                            'Batas waktu pembayaran untuk transaksi ini telah berakhir atau dibatalkan. Silakan buat pengajuan donasi baru apabila Anda masih ingin berdonasi.',
                                            'The payment window for this transaction has expired or been cancelled. Please start a new donation if you still wish to contribute.',
                                        )}
                                </div>
                            )}

                            {/* Tombol Aksi */}
                            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between print:hidden">
                                <Link
                                    href="/donasi"
                                    prefetch={false}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#e4eaec] bg-white px-5 py-3 font-poppins text-xs font-semibold text-slate-700 transition hover:border-[#14bace] hover:text-[#087f8c] sm:text-sm"
                                >
                                    <ArrowLeft className="size-4" />
                                    <span>
                                        {t(
                                            'Kembali ke Halaman Donasi',
                                            'Back to Donation Page',
                                        )}
                                    </span>
                                </Link>

                                <div className="flex flex-col gap-3 sm:flex-row">
                                    {isPending && !isLocallyExpired && (
                                        <>
                                            <button
                                                type="button"
                                                onClick={handleCheckStatus}
                                                disabled={isCheckingStatus}
                                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#14bace] bg-white px-5 py-3 font-poppins text-xs font-semibold text-[#087f8c] transition hover:bg-[#e8f8fa] disabled:opacity-60 sm:text-sm"
                                            >
                                                {isCheckingStatus ? (
                                                    <Loader2 className="size-4 animate-spin" />
                                                ) : (
                                                    <RefreshCw className="size-4" />
                                                )}
                                                <span>
                                                    {t(
                                                        'Cek Status Pembayaran',
                                                        'Check Payment Status',
                                                    )}
                                                </span>
                                            </button>

                                            {donasi.can_resume && (
                                                <button
                                                    type="button"
                                                    onClick={
                                                        handleResumePayment
                                                    }
                                                    disabled={isOpeningSnap}
                                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#14bace] px-6 py-3 font-poppins text-xs font-bold text-white shadow-sm transition hover:bg-[#087f8c] disabled:opacity-60 sm:text-sm"
                                                >
                                                    {isOpeningSnap ? (
                                                        <Loader2 className="size-4 animate-spin" />
                                                    ) : (
                                                        <CreditCard className="size-4" />
                                                    )}
                                                    <span>
                                                        {t(
                                                            'Lanjutkan Pembayaran',
                                                            'Resume Payment',
                                                        )}
                                                    </span>
                                                </button>
                                            )}
                                        </>
                                    )}

                                    {isVerified && (
                                        <button
                                            type="button"
                                            onClick={() => window.print()}
                                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#14bace] px-6 py-3 font-poppins text-xs font-bold text-white shadow-sm transition hover:bg-[#087f8c] sm:text-sm"
                                        >
                                            <Printer className="size-4" />
                                            <span>
                                                {t(
                                                    'Cetak / Simpan PDF',
                                                    'Print / Save PDF',
                                                )}
                                            </span>
                                        </button>
                                    )}

                                    {(donasi.status_verifikasi ===
                                        'dibatalkan' ||
                                        donasi.status_verifikasi ===
                                            'ditolak' ||
                                        isLocallyExpired) && (
                                        <Link
                                            href="/donasi"
                                            prefetch={false}
                                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#14bace] px-6 py-3 font-poppins text-xs font-bold text-white shadow-sm transition hover:bg-[#087f8c] sm:text-sm"
                                        >
                                            <Heart className="size-4" />
                                            <span>
                                                {t(
                                                    'Buat Donasi Baru',
                                                    'Make New Donation',
                                                )}
                                            </span>
                                        </Link>
                                    )}
                                </div>
                            </div>

                            {/* Footer Catatan Sah */}
                            <div className="mt-8 flex items-start gap-2.5 border-t border-slate-100 pt-5 text-[11px] text-slate-500 sm:text-xs">
                                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-[#087f8c]" />
                                <p className="leading-relaxed">
                                    {t(
                                        'Dokumen ini diterbitkan secara elektronik oleh sistem Yayasan Geliyat Mahdiesa Nahate (Jl. Kampung Baru Rt.02/05 No.42, Cigending, Kec. Ujungberung, Kota Bandung 40611) dan sah tanpa tanda tangan basah.',
                                        'This document is electronically issued by Yayasan Geliyat Mahdiesa Nahate (Jl. Kampung Baru Rt.02/05 No.42, Cigending, Ujungberung, Bandung City 40611) and is valid without a wet signature.',
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
