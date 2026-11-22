import { useState, useEffect } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    ChevronRight,
    CheckCircle2,
    AlertCircle,
    Send,
    Clock,
    ShieldCheck,
    Loader2,
} from 'lucide-react';
import PublicLayout from '@/layouts/public-layout';
import { useLanguage } from '@/hooks/use-language';

declare global {
    interface Window {
        snap?: {
            pay: (
                token: string,
                options?: {
                    onSuccess?: (result: any) => void;
                    onPending?: (result: any) => void;
                    onError?: (result: any) => void;
                    onClose?: () => void;
                },
            ) => void;
        };
    }
}

interface DonasiSubmittedInfo {
    kode_donasi: string;
    nama_donatur: string;
    nominal: number;
    status_verifikasi: string;
    snap_token?: string | null;
    snap_redirect_url?: string | null;
    invoice_url?: string | null;
    payment_expires_at?: string | null;
}

interface DonasiPageProps {
    nominalOptions?: number[];
    donasiSubmitted?: DonasiSubmittedInfo | null;
    midtransClientKey?: string | null;
    midtransSnapJsUrl?: string;
}

const DEFAULT_NOMINAL_OPTIONS: number[] = [
    5000, 10000, 15000, 20000, 25000, 50000, 100000,
];

const ALUR_BERDONASI_ID = [
    {
        num: '1',
        title: 'Isi Identitas & Email',
        desc: 'Masukkan nama Anda (atau pilih Hamba Allah) serta alamat email aktif untuk pengiriman tautan pembayaran dan bukti invoice resmi.',
    },
    {
        num: '2',
        title: 'Pilih Nominal Donasi',
        desc: 'Pilih salah satu nominal donasi yang tersedia atau masukkan nominal donasi kustom yang Anda kehendaki.',
    },
    {
        num: '3',
        title: 'Pilih Jalur Pembayaran',
        desc: 'Tersedia QRIS, Transfer Bank (BCA, BNI, BRI, Mandiri, Permata), dan e-Wallet.',
    },
    {
        num: '4',
        title: 'Invoice Terkirim ke Email',
        desc: 'Setelah pembayaran terverifikasi otomatis, bukti invoice resmi donasi dikirim langsung ke email Anda.',
    },
];

const ALUR_BERDONASI_EN = [
    {
        num: '1',
        title: 'Enter Identity & Email',
        desc: 'Enter your name (or select Anonymous / Hamba Allah) and an active email address for your payment continuation link and official invoice.',
    },
    {
        num: '2',
        title: 'Select Donation Amount',
        desc: 'Choose one of the available preset donation amounts or enter your desired custom amount.',
    },
    {
        num: '3',
        title: 'Choose Payment Method',
        desc: 'Supports QRIS, Bank Transfer (BCA, BNI, BRI, Mandiri, Permata), and e-Wallet.',
    },
    {
        num: '4',
        title: 'Invoice Sent to Email',
        desc: 'Once payment is verified automatically, an official donation invoice is sent directly to your email.',
    },
];

export default function DonasiPage({
    nominalOptions = DEFAULT_NOMINAL_OPTIONS,
    midtransClientKey = null,
    midtransSnapJsUrl = 'https://app.sandbox.midtrans.com/snap/snap.js',
}: DonasiPageProps) {
    const { t } = useLanguage();
    const pageProps = usePage<{
        csrf_token?: string;
        flash?: { success?: string | null; error?: string | null };
    }>().props;

    const daftarNominal =
        nominalOptions && nominalOptions.length > 0
            ? nominalOptions
            : DEFAULT_NOMINAL_OPTIONS;

    const alurBerdonasi = t(ALUR_BERDONASI_ID, ALUR_BERDONASI_EN);

    // Form state
    const [isHambaAllah, setIsHambaAllah] = useState(false);
    const [namaDonatur, setNamaDonatur] = useState('');
    const [savedNama, setSavedNama] = useState('');
    const [email, setEmail] = useState('');
    const [nominal, setNominal] = useState<number | null>(null);
    const [customNominalInput, setCustomNominalInput] = useState('');
    const [pesanDoa, setPesanDoa] = useState('');

    // UI & Validation state
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [nominalError, setNominalError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [globalAlert, setGlobalAlert] = useState<{
        type: 'success' | 'pending' | 'error';
        message: string;
        kode_donasi?: string;
        nominal?: number;
        invoice_url?: string;
    } | null>(null);

    // Muat script snap.js secara otomatis
    useEffect(() => {
        if (!midtransClientKey || !midtransSnapJsUrl) return;

        const scriptId = 'midtrans-snap-script';
        if (document.getElementById(scriptId)) return;

        const script = document.createElement('script');
        script.id = scriptId;
        script.src = midtransSnapJsUrl;
        script.setAttribute('data-client-key', midtransClientKey);
        script.async = true;
        document.body.appendChild(script);

        return () => {
            // Biarkan script tetap di cache browser
        };
    }, [midtransClientKey, midtransSnapJsUrl]);

    const formatRupiah = (val: number | string) => {
        const num = Number(val);
        if (Number.isNaN(num)) return 'Rp0';
        return `Rp${num.toLocaleString('id-ID')}`;
    };

    const handleSelectNominal = (nom: number) => {
        setNominal(nom);
        setCustomNominalInput('');
        setNominalError(null);
        if (fieldErrors.nominal) {
            setFieldErrors((prev) => {
                const next = { ...prev };
                delete next.nominal;
                return next;
            });
        }
    };

    const handleCustomNominalChange = (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const rawValue = e.target.value.replace(/[^0-9]/g, '');
        if (!rawValue) {
            setCustomNominalInput('');
            setNominal(null);
            return;
        }
        const num = parseInt(rawValue, 10);
        setCustomNominalInput(num.toLocaleString('id-ID'));
        setNominal(num);
        setNominalError(null);
        if (fieldErrors.nominal) {
            setFieldErrors((prev) => {
                const next = { ...prev };
                delete next.nominal;
                return next;
            });
        }
    };

    const validateForm = () => {
        const errors: Record<string, string> = {};

        const donorName = isHambaAllah ? 'Hamba Allah' : namaDonatur.trim();
        if (!donorName) {
            errors.nama_donatur = t(
                'Nama donatur wajib diisi.',
                'Donor name is required.',
            );
        }

        if (!email.trim()) {
            errors.email = t(
                'Alamat email wajib diisi untuk pengiriman bukti invoice.',
                'Email address is required to send your donation invoice.',
            );
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            errors.email = t(
                'Format alamat email tidak valid.',
                'Invalid email address format.',
            );
        }

        if (nominal === null || nominal < 1000) {
            const msg = t(
                'Silakan pilih atau masukkan nominal donasi (minimal Rp1.000).',
                'Please select or enter a donation amount (minimum Rp1,000).',
            );
            errors.nominal = msg;
            setNominalError(msg);
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        setGlobalAlert(null);

        try {
            const csrfMeta = document.querySelector('meta[name="csrf-token"]');
            const token =
                csrfMeta?.getAttribute('content') || pageProps.csrf_token || '';

            const response = await fetch('/donasi', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': token,
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify({
                    nama_donatur: isHambaAllah
                        ? 'Hamba Allah'
                        : namaDonatur.trim(),
                    email: email.trim(),
                    nominal: nominal,
                    pesan_doa: pesanDoa.trim() || undefined,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                if (response.status === 422 && result.errors) {
                    const mapped: Record<string, string> = {};
                    Object.keys(result.errors).forEach((k) => {
                        mapped[k] = result.errors[k][0];
                    });
                    setFieldErrors(mapped);
                } else {
                    setGlobalAlert({
                        type: 'error',
                        message:
                            result.message ||
                            t(
                                'Terjadi kendala saat memproses donasi. Silakan coba kembali.',
                                'An error occurred while processing the donation. Please try again.',
                            ),
                    });
                }
                setIsSubmitting(false);
                return;
            }

            const invoiceUrl = result.invoice_url || undefined;
            const statusUrl = result.status_url || undefined;

            if (result.snap_token) {
                if (typeof window.snap !== 'undefined' && window.snap.pay) {
                    window.snap.pay(result.snap_token, {
                        onSuccess: () => {
                            if (statusUrl) {
                                fetch(statusUrl).catch(() => {});
                            }
                            setGlobalAlert({
                                type: 'success',
                                message: t(
                                    'Alhamdulillah! Pembayaran donasi Anda berhasil dan bukti invoice resmi telah dikirim ke email Anda.',
                                    'Alhamdulillah! Your donation payment was successful and an official invoice has been sent to your email.',
                                ),
                                kode_donasi: result.kode_donasi,
                                nominal: result.nominal,
                                invoice_url: invoiceUrl,
                            });
                            setIsHambaAllah(false);
                            setNamaDonatur('');
                            setSavedNama('');
                            setEmail('');
                            setNominal(null);
                            setCustomNominalInput('');
                            setPesanDoa('');
                            setIsSubmitting(false);
                        },
                        onPending: () => {
                            setGlobalAlert({
                                type: 'pending',
                                message: t(
                                    'Pembayaran Anda sedang menunggu penyelesaian. Tautan untuk melanjutkan pembayaran telah dikirim ke email Anda.',
                                    'Your payment is awaiting completion. A link to resume your payment has been sent to your email.',
                                ),
                                kode_donasi: result.kode_donasi,
                                nominal: result.nominal,
                                invoice_url: invoiceUrl,
                            });
                            setIsSubmitting(false);
                        },
                        onError: () => {
                            setGlobalAlert({
                                type: 'error',
                                message: t(
                                    'Pembayaran donasi gagal atau ditolak. Silakan gunakan metode pembayaran lainnya.',
                                    'Donation payment failed or was declined. Please use another payment method.',
                                ),
                                kode_donasi: result.kode_donasi,
                                invoice_url: invoiceUrl,
                            });
                            setIsSubmitting(false);
                        },
                        onClose: () => {
                            setGlobalAlert({
                                type: 'pending',
                                message: t(
                                    'Jendela pembayaran ditutup. Anda dapat melanjutkan pembayaran sebelum batas waktu berakhir melalui tombol di bawah atau tautan yang telah dikirim ke email Anda.',
                                    'Payment window was closed. You can resume your payment before expiry via the button below or the link sent to your email.',
                                ),
                                kode_donasi: result.kode_donasi,
                                nominal: result.nominal,
                                invoice_url: invoiceUrl,
                            });
                            setIsSubmitting(false);
                        },
                    });
                } else if (result.redirect_url) {
                    window.location.href = result.redirect_url;
                } else {
                    setGlobalAlert({
                        type: 'pending',
                        message: t(
                            'Data donasi tercatat. Anda dapat membuka halaman status pembayaran melalui tombol di bawah.',
                            'Donation recorded. You can open the payment status page via the button below.',
                        ),
                        kode_donasi: result.kode_donasi,
                        nominal: result.nominal,
                        invoice_url: invoiceUrl,
                    });
                    setIsSubmitting(false);
                }
            } else {
                setGlobalAlert({
                    type: 'success',
                    message: t(
                        'Pengajuan donasi berhasil dicatat dan tautan status donasi telah dikirim ke email Anda.',
                        'Your donation submission has been recorded and a status link has been sent to your email.',
                    ),
                    kode_donasi: result.kode_donasi,
                    nominal: result.nominal,
                    invoice_url: invoiceUrl,
                });
                setIsHambaAllah(false);
                setNamaDonatur('');
                setSavedNama('');
                setEmail('');
                setNominal(null);
                setCustomNominalInput('');
                setPesanDoa('');
                setIsSubmitting(false);
            }
        } catch {
            setGlobalAlert({
                type: 'error',
                message: t(
                    'Tidak dapat terhubung ke server. Periksa koneksi internet Anda dan coba lagi.',
                    'Unable to connect to the server. Please check your internet connection and try again.',
                ),
            });
            setIsSubmitting(false);
        }
    };

    const activeNominalError = fieldErrors.nominal || nominalError;

    return (
        <PublicLayout>
            <Head
                title={t(
                    'Donasi Digital - Yayasan Geliyat Mahdiesa Nahate',
                    'Digital Donation - Yayasan Geliyat Mahdiesa Nahate',
                )}
            />

            {/* Banner Header with Breadcrumbs */}
            <div className="border-b border-[#e4eaec] bg-gradient-to-r from-[#d1f6fa]/60 via-[#e8f8fa] to-[#f7fcfd] py-10 sm:py-14">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <h1 className="font-poppins text-3xl font-bold text-slate-800 sm:text-4xl">
                        {t(
                            'Donasi & Sedekah Digital',
                            'Digital Donation & Charity',
                        )}
                    </h1>
                    <nav className="mt-2 flex items-center gap-2 font-poppins text-sm text-slate-500">
                        <Link
                            href="/"
                            className="transition-colors hover:text-[#14bace]"
                        >
                            {t('Beranda', 'Home')}
                        </Link>
                        <ChevronRight className="size-4 text-slate-400" />
                        <span className="font-semibold text-[#087f8c]">
                            {t('Donasi Digital', 'Digital Donation')}
                        </span>
                    </nav>
                    <p className="mt-3 max-w-2xl font-sans text-sm text-slate-600 sm:text-base">
                        {t(
                            'Penyaluran infaq, sedekah, dan santunan pendidikan yang amanah untuk membina anak-anak yatim dan memberdayakan ibu yatim Yayasan Geliyat Mahdiesa Nahate secara transparan.',
                            'Trustworthy distribution of charity, alms, and educational aid to mentor orphans and empower mothers of orphans at Yayasan Geliyat Mahdiesa Nahate transparently.',
                        )}
                    </p>
                </div>
            </div>

            {/* Alur Berdonasi & Formulir Donasi */}
            <section className="bg-[#f8fafb] py-10 sm:py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Alert Interaktif Hasil Pembayaran */}
                    {globalAlert && (
                        <div
                            className={`mb-8 rounded-2xl border p-5 shadow-xs transition-all ${
                                globalAlert.type === 'success'
                                    ? 'border-emerald-200 bg-emerald-50/95 text-emerald-900'
                                    : globalAlert.type === 'pending'
                                      ? 'border-amber-200 bg-amber-50/95 text-amber-900'
                                      : 'border-rose-200 bg-rose-50/95 text-rose-900'
                            }`}
                        >
                            <div className="flex items-start gap-3.5">
                                <div
                                    className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${
                                        globalAlert.type === 'success'
                                            ? 'bg-emerald-100 text-emerald-700'
                                            : globalAlert.type === 'pending'
                                              ? 'bg-amber-100 text-amber-700'
                                              : 'bg-rose-100 text-rose-700'
                                    }`}
                                >
                                    {globalAlert.type === 'success' && (
                                        <CheckCircle2 className="size-5" />
                                    )}
                                    {globalAlert.type === 'pending' && (
                                        <Clock className="size-5" />
                                    )}
                                    {globalAlert.type === 'error' && (
                                        <AlertCircle className="size-5" />
                                    )}
                                </div>
                                <div className="w-full">
                                    <h4 className="font-poppins text-sm font-bold sm:text-base">
                                        {globalAlert.type === 'success'
                                            ? t(
                                                  'Alhamdulillah, Pembayaran Donasi Berhasil!',
                                                  'Alhamdulillah, Donation Payment Successful!',
                                              )
                                            : globalAlert.type === 'pending'
                                              ? t(
                                                    'Menunggu Penyelesaian Pembayaran',
                                                    'Awaiting Payment Completion',
                                                )
                                              : t(
                                                    'Pemberitahuan Transaksi',
                                                    'Transaction Notice',
                                                )}
                                    </h4>
                                    <p className="mt-1 text-xs leading-relaxed sm:text-sm">
                                        {globalAlert.message}
                                    </p>

                                    {globalAlert.kode_donasi && (
                                        <div className="mt-3 flex flex-wrap items-center gap-4 rounded-xl border border-current/15 bg-white/80 p-3 text-xs sm:text-sm">
                                            <div>
                                                <span className="block text-[11px] text-slate-500">
                                                    {t(
                                                        'Kode Donasi',
                                                        'Donation Code',
                                                    )}
                                                </span>
                                                <span className="font-mono font-bold text-slate-800">
                                                    {globalAlert.kode_donasi}
                                                </span>
                                            </div>
                                            {globalAlert.nominal && (
                                                <div>
                                                    <span className="block text-[11px] text-slate-500">
                                                        {t('Nominal', 'Amount')}
                                                    </span>
                                                    <span className="font-semibold text-[#087f8c]">
                                                        {formatRupiah(
                                                            globalAlert.nominal,
                                                        )}
                                                    </span>
                                                </div>
                                            )}
                                            <div className="ml-auto flex flex-wrap items-center gap-2">
                                                <span className="inline-flex items-center gap-1 rounded-full bg-[#e8f8fa] px-2.5 py-0.5 text-[11px] font-bold text-[#087f8c]">
                                                    <ShieldCheck className="size-3" />
                                                    {t(
                                                        'Tercatat Resmi',
                                                        'Officially Recorded',
                                                    )}
                                                </span>
                                                {globalAlert.invoice_url && (
                                                    <Link
                                                        href={
                                                            globalAlert.invoice_url
                                                        }
                                                        prefetch={false}
                                                        className="inline-flex items-center gap-1.5 rounded-lg bg-[#14bace] px-3 py-1.5 font-poppins text-xs font-semibold text-white transition hover:bg-[#087f8c]"
                                                    >
                                                        <span>
                                                            {globalAlert.type ===
                                                            'success'
                                                                ? t(
                                                                      'Lihat & Cetak Invoice',
                                                                      'View & Print Invoice',
                                                                  )
                                                                : t(
                                                                      'Lanjutkan / Cek Status',
                                                                      'Resume / Check Status',
                                                                  )}
                                                        </span>
                                                        <ChevronRight className="size-3.5" />
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Flash messages dari redirect server lama (jika ada) */}
                    {!globalAlert && pageProps.flash?.success && (
                        <div className="mb-8 rounded-2xl border border-emerald-200 bg-emerald-50/90 p-5 shadow-xs">
                            <div className="flex items-start gap-3.5">
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                                    <CheckCircle2 className="size-5" />
                                </div>
                                <div className="w-full">
                                    <h4 className="font-poppins text-sm font-bold text-emerald-900 sm:text-base">
                                        {t(
                                            'Alhamdulillah, Data Donasi Berhasil Dicatat!',
                                            'Alhamdulillah, Donation Data Recorded Successfully!',
                                        )}
                                    </h4>
                                    <p className="mt-1 text-xs leading-relaxed text-emerald-800 sm:text-sm">
                                        {pageProps.flash.success}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12">
                        {/* Kolom Kiri: Alur Berdonasi */}
                        <div className="flex flex-col justify-between rounded-3xl border border-[#e4eaec] bg-white p-6 shadow-xs sm:p-8 lg:col-span-5">
                            <div>
                                <h2 className="font-poppins text-xl font-bold text-slate-800 sm:text-2xl">
                                    {t(
                                        'Alur Berdonasi Online',
                                        'Online Donation Flow',
                                    )}
                                </h2>

                                <div className="mt-6 space-y-3.5">
                                    {alurBerdonasi.map((step) => (
                                        <div
                                            key={step.num}
                                            className="rounded-2xl border border-[#e4eaec] bg-[#fbfdfd] p-4 transition hover:border-[#14bace]/40 hover:bg-[#f7fcfd]"
                                        >
                                            <div className="flex items-start gap-2.5">
                                                <span className="font-poppins text-sm font-bold text-slate-800">
                                                    {step.num}.
                                                </span>
                                                <div className="min-w-0 flex-1">
                                                    <h3 className="font-poppins text-sm font-bold text-slate-800">
                                                        {step.title}
                                                    </h3>
                                                    <p className="mt-1 font-sans text-xs leading-relaxed text-slate-500">
                                                        {step.desc}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Komitmen Penyaluran Highlight */}
                            <div className="mt-6 rounded-2xl border border-[#cbebf0] bg-[#f7fcfd] p-4 sm:p-5">
                                <h3 className="font-poppins text-xs font-bold text-slate-800 sm:text-sm">
                                    {t(
                                        'Keamanan & Transparansi Donasi',
                                        'Donation Security & Transparency',
                                    )}
                                </h3>
                                <p className="mt-1 font-sans text-xs leading-relaxed text-slate-600">
                                    {t(
                                        'Setiap donasi diverifikasi menggunakan sistem keamanan digital terenkripsi dan otomatis dicatat pada buku kas amanah untuk kebutuhan binaan yatim.',
                                        'Every donation is verified using an encrypted digital security system and automatically recorded in our trustworthy ledger for mentored orphans.',
                                    )}
                                </p>
                            </div>
                        </div>

                        {/* Kolom Kanan: Formulir Donasi */}
                        <div className="lg:col-span-7">
                            <div className="flex h-full flex-col justify-between rounded-3xl border border-[#e4eaec] bg-white p-6 shadow-xs sm:p-8">
                                <div>
                                    <div className="border-b border-slate-100 pb-4">
                                        <h2 className="font-poppins text-xl font-bold text-slate-800 sm:text-2xl">
                                            {t(
                                                'Formulir Donasi',
                                                'Donation Form',
                                            )}
                                        </h2>
                                        <p className="mt-1 font-sans text-xs text-slate-500 sm:text-sm">
                                            {t(
                                                'Lengkapi identitas donatur dan pilih nominal donasi yang ingin Anda salurkan:',
                                                'Complete your donor details and choose the donation amount you wish to contribute:',
                                            )}
                                        </p>
                                    </div>

                                    <form
                                        onSubmit={handleSubmit}
                                        className="mt-6 space-y-6"
                                    >
                                        {/* Identitas Donatur: Nama & Email */}
                                        <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2">
                                            <div>
                                                <label
                                                    htmlFor="nama_donatur"
                                                    className="mb-1.5 block font-poppins text-xs font-semibold text-slate-700"
                                                >
                                                    {t(
                                                        'Nama Lengkap',
                                                        'Full Name',
                                                    )}{' '}
                                                    <span className="text-rose-500">
                                                        *
                                                    </span>
                                                </label>
                                                <input
                                                    id="nama_donatur"
                                                    type="text"
                                                    required
                                                    disabled={isHambaAllah}
                                                    placeholder={
                                                        isHambaAllah
                                                            ? 'Hamba Allah'
                                                            : t(
                                                                  'Contoh: Ahmad Fauzan',
                                                                  'e.g. Ahmad Fauzan',
                                                              )
                                                    }
                                                    value={
                                                        isHambaAllah
                                                            ? 'Hamba Allah'
                                                            : namaDonatur
                                                    }
                                                    onChange={(e) => {
                                                        setNamaDonatur(
                                                            e.target.value,
                                                        );
                                                        if (
                                                            fieldErrors.nama_donatur
                                                        ) {
                                                            setFieldErrors(
                                                                (prev) => {
                                                                    const next =
                                                                        {
                                                                            ...prev,
                                                                        };
                                                                    delete next.nama_donatur;
                                                                    return next;
                                                                },
                                                            );
                                                        }
                                                    }}
                                                    className={`w-full rounded-xl border border-[#e4eaec] px-3.5 py-2.5 font-sans text-sm outline-hidden transition ${
                                                        isHambaAllah
                                                            ? 'cursor-not-allowed bg-slate-100 font-medium text-slate-500'
                                                            : 'bg-white text-slate-800 focus:border-[#14bace] focus:ring-2 focus:ring-[#14bace]/20'
                                                    }`}
                                                />
                                                <div className="mt-1.5 flex items-center gap-3">
                                                    <label className="inline-flex cursor-pointer items-center gap-1 font-poppins text-[11px] text-slate-600 hover:text-[#087f8c]">
                                                        <input
                                                            type="radio"
                                                            name="donor_identity"
                                                            checked={
                                                                !isHambaAllah
                                                            }
                                                            onChange={() => {
                                                                setIsHambaAllah(
                                                                    false,
                                                                );
                                                                setNamaDonatur(
                                                                    savedNama,
                                                                );
                                                            }}
                                                            className="size-3.5 accent-[#14bace]"
                                                        />
                                                        <span>
                                                            {t(
                                                                'Nama Sendiri',
                                                                'Own Name',
                                                            )}
                                                        </span>
                                                    </label>
                                                    <label className="inline-flex cursor-pointer items-center gap-1 font-poppins text-[11px] text-slate-600 hover:text-[#087f8c]">
                                                        <input
                                                            type="radio"
                                                            name="donor_identity"
                                                            checked={
                                                                isHambaAllah
                                                            }
                                                            onChange={() => {
                                                                if (
                                                                    !isHambaAllah &&
                                                                    namaDonatur !==
                                                                        'Hamba Allah'
                                                                ) {
                                                                    setSavedNama(
                                                                        namaDonatur,
                                                                    );
                                                                }
                                                                setIsHambaAllah(
                                                                    true,
                                                                );
                                                                setNamaDonatur(
                                                                    'Hamba Allah',
                                                                );
                                                                if (
                                                                    fieldErrors.nama_donatur
                                                                ) {
                                                                    setFieldErrors(
                                                                        (
                                                                            prev,
                                                                        ) => {
                                                                            const next =
                                                                                {
                                                                                    ...prev,
                                                                                };
                                                                            delete next.nama_donatur;
                                                                            return next;
                                                                        },
                                                                    );
                                                                }
                                                            }}
                                                            className="size-3.5 accent-[#14bace]"
                                                        />
                                                        <span>Hamba Allah</span>
                                                    </label>
                                                </div>
                                                {fieldErrors.nama_donatur &&
                                                    !isHambaAllah && (
                                                        <p className="mt-1 text-xs text-rose-600">
                                                            {
                                                                fieldErrors.nama_donatur
                                                            }
                                                        </p>
                                                    )}
                                            </div>

                                            <div>
                                                <label
                                                    htmlFor="email"
                                                    className="mb-1.5 block font-poppins text-xs font-semibold text-slate-700"
                                                >
                                                    {t(
                                                        'Alamat Email',
                                                        'Email Address',
                                                    )}{' '}
                                                    <span className="text-rose-500">
                                                        *
                                                    </span>
                                                </label>
                                                <input
                                                    id="email"
                                                    type="email"
                                                    required
                                                    placeholder={t(
                                                        'Contoh: donatur@email.com',
                                                        'e.g. donor@email.com',
                                                    )}
                                                    value={email}
                                                    onChange={(e) => {
                                                        setEmail(
                                                            e.target.value,
                                                        );
                                                        if (fieldErrors.email) {
                                                            setFieldErrors(
                                                                (prev) => {
                                                                    const next =
                                                                        {
                                                                            ...prev,
                                                                        };
                                                                    delete next.email;
                                                                    return next;
                                                                },
                                                            );
                                                        }
                                                    }}
                                                    className="w-full rounded-xl border border-[#e4eaec] bg-white px-3.5 py-2.5 font-sans text-sm text-slate-800 outline-hidden transition focus:border-[#14bace] focus:ring-2 focus:ring-[#14bace]/20"
                                                />
                                                <p className="mt-1.5 font-sans text-[11px] text-slate-500">
                                                    {t(
                                                        'Untuk pengiriman tautan bayar & bukti invoice.',
                                                        'For payment link & official invoice delivery.',
                                                    )}
                                                </p>
                                                {fieldErrors.email && (
                                                    <p className="mt-1 text-xs text-rose-600">
                                                        {fieldErrors.email}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Pilihan Nominal Donasi */}
                                        <div>
                                            <div className="mb-2 flex items-center justify-between">
                                                <label className="font-poppins text-xs font-semibold text-slate-700">
                                                    {t(
                                                        'Pilih Nominal Donasi',
                                                        'Select Donation Amount',
                                                    )}{' '}
                                                    <span className="text-rose-500">
                                                        *
                                                    </span>
                                                </label>
                                                {nominal !== null && (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-[#e8f8fa] px-2.5 py-0.5 font-poppins text-xs font-bold text-[#087f8c]">
                                                        <CheckCircle2 className="size-3.5 text-[#14bace]" />
                                                        {t(
                                                            'Dipilih:',
                                                            'Selected:',
                                                        )}{' '}
                                                        {formatRupiah(nominal)}
                                                    </span>
                                                )}
                                            </div>

                                            <div
                                                role="radiogroup"
                                                aria-label={t(
                                                    'Pilihan Nominal Donasi',
                                                    'Donation Amount Options',
                                                )}
                                                className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4"
                                            >
                                                {daftarNominal.map((nom) => {
                                                    const isSelected =
                                                        nominal === nom &&
                                                        !customNominalInput;
                                                    return (
                                                        <button
                                                            key={nom}
                                                            type="button"
                                                            role="radio"
                                                            aria-checked={
                                                                isSelected
                                                            }
                                                            onClick={() =>
                                                                handleSelectNominal(
                                                                    nom,
                                                                )
                                                            }
                                                            className={`group relative flex items-center justify-between rounded-xl border px-3.5 py-3 text-left font-poppins text-xs font-semibold transition sm:text-sm ${
                                                                isSelected
                                                                    ? 'border-[#14bace] bg-[#e8f8fa] font-bold text-[#087f8c] shadow-xs ring-2 ring-[#14bace]/25'
                                                                    : 'border-[#e4eaec] bg-white text-slate-700 hover:border-[#14bace]/60 hover:bg-[#f7fcfd] hover:text-[#087f8c]'
                                                            }`}
                                                        >
                                                            <span>
                                                                {formatRupiah(
                                                                    nom,
                                                                )}
                                                            </span>
                                                            <span
                                                                className={`flex size-4 shrink-0 items-center justify-center rounded-full border transition ${
                                                                    isSelected
                                                                        ? 'border-[#14bace] bg-[#14bace] text-white'
                                                                        : 'border-slate-300 bg-white group-hover:border-[#14bace]'
                                                                }`}
                                                            >
                                                                {isSelected && (
                                                                    <span className="size-1.5 rounded-full bg-white" />
                                                                )}
                                                            </span>
                                                        </button>
                                                    );
                                                })}
                                            </div>

                                            {/* Custom Nominal Input */}
                                            <div className="mt-3">
                                                <label
                                                    htmlFor="custom_nominal"
                                                    className="mb-1 block font-poppins text-xs font-medium text-slate-600"
                                                >
                                                    {t(
                                                        'Atau Masukkan Nominal Lainnya (Rp):',
                                                        'Or Enter Custom Amount (Rp):',
                                                    )}
                                                </label>
                                                <div className="relative">
                                                    <span className="absolute top-2.5 left-3.5 font-poppins text-sm font-semibold text-slate-500">
                                                        Rp
                                                    </span>
                                                    <input
                                                        id="custom_nominal"
                                                        type="text"
                                                        inputMode="numeric"
                                                        placeholder={t(
                                                            'Contoh: 150.000',
                                                            'e.g. 150.000',
                                                        )}
                                                        value={
                                                            customNominalInput
                                                        }
                                                        onChange={
                                                            handleCustomNominalChange
                                                        }
                                                        className="w-full rounded-xl border border-[#e4eaec] bg-white py-2.5 pr-3.5 pl-10 font-sans text-sm font-semibold text-slate-800 outline-hidden transition focus:border-[#14bace] focus:ring-2 focus:ring-[#14bace]/20"
                                                    />
                                                </div>
                                            </div>

                                            {activeNominalError && (
                                                <p className="mt-2 text-xs text-rose-600">
                                                    {activeNominalError}
                                                </p>
                                            )}
                                        </div>

                                        {/* Pesan & Doa */}
                                        <div>
                                            <label
                                                htmlFor="pesan_doa"
                                                className="mb-1.5 block font-poppins text-xs font-semibold text-slate-700"
                                            >
                                                {t(
                                                    'Pesan & Doa Kebaikan (Opsional)',
                                                    'Message & Prayer (Optional)',
                                                )}
                                            </label>
                                            <textarea
                                                id="pesan_doa"
                                                rows={3}
                                                placeholder={t(
                                                    'Tuliskan doa atau harapan untuk adik-adik yatim binaan...',
                                                    'Write a prayer or message of hope for the mentored orphans...',
                                                )}
                                                value={pesanDoa}
                                                onChange={(e) =>
                                                    setPesanDoa(e.target.value)
                                                }
                                                className="w-full rounded-xl border border-[#e4eaec] bg-white px-3.5 py-2.5 font-sans text-sm text-slate-800 outline-hidden transition focus:border-[#14bace] focus:ring-2 focus:ring-[#14bace]/20"
                                            />
                                        </div>

                                        {/* Submit Action */}
                                        <div className="pt-2">
                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#14bace] px-6 py-3.5 font-poppins text-sm font-bold text-white shadow-sm transition hover:bg-[#087f8c] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <Loader2 className="size-4 animate-spin" />
                                                        <span>
                                                            {t(
                                                                'Menyiapkan Pembayaran...',
                                                                'Preparing Payment...',
                                                            )}
                                                        </span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Send className="size-4" />
                                                        <span>
                                                            {nominal !== null
                                                                ? `${t('Bayar Donasi', 'Pay Donation')} ${formatRupiah(nominal)}`
                                                                : t(
                                                                      'Lanjutkan ke Pembayaran',
                                                                      'Proceed to Payment',
                                                                  )}
                                                        </span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
