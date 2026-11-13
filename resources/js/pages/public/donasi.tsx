import { useState, useEffect } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    ChevronRight,
    CheckCircle2,
    AlertCircle,
    HeartHandshake,
    Send,
    Clock,
    UserCheck,
    Wallet,
    MessageSquareHeart,
    ShieldCheck,
    CreditCard,
    Loader2,
    Mail,
    RefreshCw,
} from 'lucide-react';
import PublicLayout from '@/layouts/public-layout';

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
                }
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
}

interface DonasiPageProps {
    nominalOptions?: number[];
    donasiSubmitted?: DonasiSubmittedInfo | null;
    midtransClientKey?: string | null;
    midtransSnapJsUrl?: string;
}

const DEFAULT_NOMINAL_OPTIONS: number[] = [
    5000,
    10000,
    15000,
    20000,
    25000,
    50000,
    100000,
];

const ALUR_BERDONASI = [
    {
        num: '1',
        title: 'Isi Identitas Donatur',
        desc: 'Masukkan nama lengkap (atau Hamba Allah) beserta nomor WhatsApp aktif Anda.',
        icon: UserCheck,
    },
    {
        num: '2',
        title: 'Pilih Nominal Donasi',
        desc: 'Pilih salah satu nominal donasi yang tersedia mulai dari Rp5.000 hingga Rp100.000.',
        icon: Wallet,
    },
    {
        num: '3',
        title: 'Pilih Jalur Pembayaran',
        desc: 'Tersedia QRIS, Transfer Bank (BCA, BNI, BRI, Mandiri, Permata), dan e-Wallet melalui Midtrans Snap.',
        icon: CreditCard,
    },
    {
        num: '4',
        title: 'Konfirmasi Otomatis',
        desc: 'Pembayaran terverifikasi otomatis oleh sistem dan langsung tercatat pada buku kas amanah yayasan.',
        icon: ShieldCheck,
    },
];

export default function DonasiPage({
    nominalOptions = DEFAULT_NOMINAL_OPTIONS,
    donasiSubmitted = null,
    midtransClientKey = null,
    midtransSnapJsUrl = 'https://app.sandbox.midtrans.com/snap/snap.js',
}: DonasiPageProps) {
    const pageProps = usePage<{
        csrf_token?: string;
        flash?: { success?: string | null; error?: string | null };
    }>().props;

    const daftarNominal =
        nominalOptions && nominalOptions.length > 0 ? nominalOptions : DEFAULT_NOMINAL_OPTIONS;

    // Form state
    const [namaDonatur, setNamaDonatur] = useState('');
    const [noWhatsapp, setNoWhatsapp] = useState('');
    const [email, setEmail] = useState('');
    const [nominal, setNominal] = useState<number | null>(null);
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

        if (!namaDonatur.trim()) {
            errors.nama_donatur = 'Nama donatur wajib diisi.';
        }

        if (!noWhatsapp.trim()) {
            errors.no_whatsapp = 'Nomor WhatsApp wajib diisi.';
        } else if (!/^[0-9+\-\s()]{8,25}$/.test(noWhatsapp.trim())) {
            errors.no_whatsapp = 'Format nomor WhatsApp tidak valid (minimal 8 angka).';
        }

        if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            errors.email = 'Format email tidak valid.';
        }

        if (nominal === null || !daftarNominal.includes(nominal)) {
            errors.nominal = 'Silakan pilih salah satu nominal donasi terlebih dahulu.';
            setNominalError('Silakan pilih salah satu nominal donasi terlebih dahulu.');
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
            // Ambil CSRF token dari meta tag atau inertia page props
            const csrfMeta = document.querySelector('meta[name="csrf-token"]');
            const token = csrfMeta?.getAttribute('content') || pageProps.csrf_token || '';

            const response = await fetch('/donasi', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': token,
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify({
                    nama_donatur: namaDonatur.trim(),
                    no_whatsapp: noWhatsapp.trim(),
                    email: email.trim() || undefined,
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
                        message: result.message || 'Terjadi kendala saat memproses donasi. Silakan coba kembali.',
                    });
                }
                setIsSubmitting(false);
                return;
            }

            // Jika Midtrans Snap Token tersedia
            if (result.snap_token) {
                if (typeof window.snap !== 'undefined' && window.snap.pay) {
                    window.snap.pay(result.snap_token, {
                        onSuccess: (paymentResult: any) => {
                            setGlobalAlert({
                                type: 'success',
                                message: 'Alhamdulillah! Pembayaran donasi Anda berhasil dan terverifikasi otomatis.',
                                kode_donasi: result.kode_donasi,
                                nominal: result.nominal,
                            });
                            // Reset form
                            setNamaDonatur('');
                            setNoWhatsapp('');
                            setEmail('');
                            setNominal(null);
                            setPesanDoa('');
                            setIsSubmitting(false);
                        },
                        onPending: (paymentResult: any) => {
                            setGlobalAlert({
                                type: 'pending',
                                message: 'Pembayaran Anda sedang diproses. Silakan selesaikan pembayaran sesuai instruksi Midtrans.',
                                kode_donasi: result.kode_donasi,
                                nominal: result.nominal,
                            });
                            setIsSubmitting(false);
                        },
                        onError: (errorResult: any) => {
                            setGlobalAlert({
                                type: 'error',
                                message: 'Pembayaran donasi gagal atau ditolak. Silakan gunakan metode pembayaran lainnya.',
                                kode_donasi: result.kode_donasi,
                            });
                            setIsSubmitting(false);
                        },
                        onClose: () => {
                            setGlobalAlert({
                                type: 'pending',
                                message: 'Jendela pembayaran ditutup. Anda dapat melanjutkan pembayaran nanti dengan kode donasi ini.',
                                kode_donasi: result.kode_donasi,
                                nominal: result.nominal,
                            });
                            setIsSubmitting(false);
                        },
                    });
                } else if (result.redirect_url) {
                    // Fallback redirect jika popup terblokir
                    window.location.href = result.redirect_url;
                } else {
                    setGlobalAlert({
                        type: 'pending',
                        message: 'Data donasi tercatat. Modul pembayaran sedang dimuat, silakan muat ulang halaman.',
                        kode_donasi: result.kode_donasi,
                    });
                    setIsSubmitting(false);
                }
            } else {
                // Kredensial Midtrans belum aktif (fallback tercatat status menunggu)
                setGlobalAlert({
                    type: 'success',
                    message: 'Pengajuan donasi berhasil dicatat dan sedang dalam antrean verifikasi.',
                    kode_donasi: result.kode_donasi,
                    nominal: result.nominal,
                });
                setNamaDonatur('');
                setNoWhatsapp('');
                setEmail('');
                setNominal(null);
                setPesanDoa('');
                setIsSubmitting(false);
            }
        } catch (err: any) {
            setGlobalAlert({
                type: 'error',
                message: 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda dan coba lagi.',
            });
            setIsSubmitting(false);
        }
    };

    const activeNominalError = fieldErrors.nominal || nominalError;

    return (
        <PublicLayout>
            <Head title="Donasi Digital - Yayasan Geliyat Mahdiesa Nahate" />

            {/* Banner Header with Breadcrumbs */}
            <div className="border-b border-[#e4eaec] bg-gradient-to-r from-[#d1f6fa]/60 via-[#e8f8fa] to-[#f7fcfd] py-10 sm:py-14">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <h1 className="font-poppins text-3xl font-bold text-slate-800 sm:text-4xl">
                        Donasi & Sedekah Digital
                    </h1>
                    <nav className="mt-2 flex items-center gap-2 font-poppins text-sm text-slate-500">
                        <Link
                            href="/"
                            className="transition-colors hover:text-[#14bace]"
                        >
                            Beranda
                        </Link>
                        <ChevronRight className="size-4 text-slate-400" />
                        <span className="font-semibold text-[#087f8c]">
                            Donasi Digital (Midtrans)
                        </span>
                    </nav>
                    <p className="mt-3 max-w-2xl font-sans text-sm text-slate-600 sm:text-base">
                        Penyaluran infaq, sedekah, dan santunan pendidikan yang
                        amanah untuk membina anak-anak yatim dan memberdayakan
                        ibu yatim Yayasan Geliyat Mahdiesa Nahate secara
                        transparan.
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
                                    {globalAlert.type === 'success' && <CheckCircle2 className="size-5" />}
                                    {globalAlert.type === 'pending' && <Clock className="size-5" />}
                                    {globalAlert.type === 'error' && <AlertCircle className="size-5" />}
                                </div>
                                <div className="w-full">
                                    <h4 className="font-poppins text-sm font-bold sm:text-base">
                                        {globalAlert.type === 'success'
                                            ? 'Alhamdulillah, Pembayaran Donasi Berhasil!'
                                            : globalAlert.type === 'pending'
                                              ? 'Menunggu Penyelesaian Pembayaran'
                                              : 'Pemberitahuan Transaksi'}
                                    </h4>
                                    <p className="mt-1 text-xs leading-relaxed sm:text-sm">
                                        {globalAlert.message}
                                    </p>

                                    {globalAlert.kode_donasi && (
                                        <div className="mt-3 flex flex-wrap items-center gap-4 rounded-xl border border-current/15 bg-white/80 p-3 text-xs sm:text-sm">
                                            <div>
                                                <span className="block text-[11px] text-slate-500">
                                                    Kode Donasi
                                                </span>
                                                <span className="font-mono font-bold text-slate-800">
                                                    {globalAlert.kode_donasi}
                                                </span>
                                            </div>
                                            {globalAlert.nominal && (
                                                <div>
                                                    <span className="block text-[11px] text-slate-500">
                                                        Nominal
                                                    </span>
                                                    <span className="font-semibold text-[#087f8c]">
                                                        {formatRupiah(globalAlert.nominal)}
                                                    </span>
                                                </div>
                                            )}
                                            <div className="ml-auto">
                                                <span className="inline-flex items-center gap-1 rounded-full bg-[#e8f8fa] px-2.5 py-0.5 text-[11px] font-bold text-[#087f8c]">
                                                    <ShieldCheck className="size-3" />
                                                    Tercatat Resmi
                                                </span>
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
                                        Alhamdulillah, Data Donasi Berhasil Dicatat!
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
                                <span className="font-poppins text-xs font-bold tracking-wider text-[#14bace] uppercase">
                                    Mudah & Terpercaya
                                </span>
                                <h2 className="mt-1 font-poppins text-xl font-bold text-slate-800 sm:text-2xl">
                                    Alur Berdonasi Online
                                </h2>
                                <p className="mt-1 font-sans text-xs leading-relaxed text-slate-500 sm:text-sm">
                                    Pembayaran donasi kini terhubung langsung dengan Midtrans Snap untuk kemudahan sedekah digital:
                                </p>

                                <div className="mt-6 space-y-3.5">
                                    {ALUR_BERDONASI.map((step) => {
                                        const StepIcon = step.icon;
                                        return (
                                            <div
                                                key={step.num}
                                                className="group flex items-start gap-3.5 rounded-2xl border border-[#e4eaec] bg-[#fbfdfd] p-4 transition hover:border-[#14bace]/40 hover:bg-[#f7fcfd]"
                                            >
                                                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#e8f8fa] font-poppins text-sm font-bold text-[#087f8c] transition group-hover:bg-[#14bace] group-hover:text-white">
                                                    <StepIcon className="size-5" />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="inline-flex size-5 items-center justify-center rounded-full bg-[#14bace]/15 font-poppins text-[11px] font-bold text-[#087f8c]">
                                                            {step.num}
                                                        </span>
                                                        <h3 className="font-poppins text-xs font-bold text-slate-800 sm:text-sm">
                                                            {step.title}
                                                        </h3>
                                                    </div>
                                                    <p className="mt-1 font-sans text-xs leading-relaxed text-slate-500">
                                                        {step.desc}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Komitmen Penyaluran Highlight */}
                            <div className="mt-6 rounded-2xl border border-[#cbebf0] bg-[#f7fcfd] p-4 sm:p-5">
                                <div className="flex items-start gap-3">
                                    <HeartHandshake className="mt-0.5 size-6 shrink-0 text-[#14bace]" />
                                    <div>
                                        <h3 className="font-poppins text-xs font-bold text-slate-800 sm:text-sm">
                                            Keamanan & Transparansi Donasi
                                        </h3>
                                        <p className="mt-1 font-sans text-xs leading-relaxed text-slate-600">
                                            Setiap donasi melalui Midtrans diverifikasi menggunakan enkripsi SHA-512 dan otomatis dicatat pada buku kas amanah untuk kebutuhan binaan yatim.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Kolom Kanan: Formulir Donasi */}
                        <div className="lg:col-span-7">
                            <div className="flex h-full flex-col justify-between rounded-3xl border border-[#e4eaec] bg-white p-6 shadow-xs sm:p-8">
                                <div>
                                    <div className="border-b border-slate-100 pb-4">
                                        <div className="flex items-center justify-between">
                                            <h2 className="font-poppins text-xl font-bold text-slate-800 sm:text-2xl">
                                                Formulir Donasi
                                            </h2>
                                            <span className="inline-flex items-center gap-1 rounded-full bg-[#e8f8fa] px-3 py-1 font-poppins text-xs font-semibold text-[#087f8c]">
                                                <CreditCard className="size-3.5 text-[#14bace]" />
                                                Midtrans Snap
                                            </span>
                                        </div>
                                        <p className="mt-1 font-sans text-xs text-slate-500 sm:text-sm">
                                            Lengkapi identitas donatur dan pilih nominal donasi yang ingin Anda salurkan:
                                        </p>
                                    </div>

                                    <form
                                        onSubmit={handleSubmit}
                                        className="mt-6 space-y-6"
                                    >
                                        {/* Identitas Donatur: Nama & WhatsApp */}
                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                            <div>
                                                <label
                                                    htmlFor="nama_donatur"
                                                    className="mb-1.5 block font-poppins text-xs font-semibold text-slate-700"
                                                >
                                                    Nama Lengkap / Hamba Allah{' '}
                                                    <span className="text-rose-500">
                                                        *
                                                    </span>
                                                </label>
                                                <input
                                                    id="nama_donatur"
                                                    type="text"
                                                    required
                                                    placeholder="Contoh: Ahmad Fauzan"
                                                    value={namaDonatur}
                                                    onChange={(e) => {
                                                        setNamaDonatur(e.target.value);
                                                        if (fieldErrors.nama_donatur) {
                                                            setFieldErrors((prev) => {
                                                                const next = { ...prev };
                                                                delete next.nama_donatur;
                                                                return next;
                                                            });
                                                        }
                                                    }}
                                                    className="w-full rounded-xl border border-[#e4eaec] bg-white px-3.5 py-2.5 font-sans text-sm text-slate-800 outline-hidden transition focus:border-[#14bace] focus:ring-2 focus:ring-[#14bace]/20"
                                                />
                                                {fieldErrors.nama_donatur && (
                                                    <p className="mt-1 text-xs text-rose-600">
                                                        {fieldErrors.nama_donatur}
                                                    </p>
                                                )}
                                            </div>

                                            <div>
                                                <label
                                                    htmlFor="no_whatsapp"
                                                    className="mb-1.5 block font-poppins text-xs font-semibold text-slate-700"
                                                >
                                                    Nomor WhatsApp{' '}
                                                    <span className="text-rose-500">
                                                        *
                                                    </span>
                                                </label>
                                                <input
                                                    id="no_whatsapp"
                                                    type="tel"
                                                    required
                                                    placeholder="Contoh: 081234567890"
                                                    value={noWhatsapp}
                                                    onChange={(e) => {
                                                        setNoWhatsapp(e.target.value);
                                                        if (fieldErrors.no_whatsapp) {
                                                            setFieldErrors((prev) => {
                                                                const next = { ...prev };
                                                                delete next.no_whatsapp;
                                                                return next;
                                                            });
                                                        }
                                                    }}
                                                    className="w-full rounded-xl border border-[#e4eaec] bg-white px-3.5 py-2.5 font-sans text-sm text-slate-800 outline-hidden transition focus:border-[#14bace] focus:ring-2 focus:ring-[#14bace]/20"
                                                />
                                                {fieldErrors.no_whatsapp && (
                                                    <p className="mt-1 text-xs text-rose-600">
                                                        {fieldErrors.no_whatsapp}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Email Donatur (Opsional) */}
                                        <div>
                                            <label
                                                htmlFor="email"
                                                className="mb-1.5 block font-poppins text-xs font-semibold text-slate-700"
                                            >
                                                Alamat Email Donatur (Opsional)
                                            </label>
                                            <div className="relative">
                                                <input
                                                    id="email"
                                                    type="email"
                                                    placeholder="Contoh: ahmad@gmail.com (untuk bukti pembayaran)"
                                                    value={email}
                                                    onChange={(e) => {
                                                        setEmail(e.target.value);
                                                        if (fieldErrors.email) {
                                                            setFieldErrors((prev) => {
                                                                const next = { ...prev };
                                                                delete next.email;
                                                                return next;
                                                            });
                                                        }
                                                    }}
                                                    className="w-full rounded-xl border border-[#e4eaec] bg-white px-3.5 py-2.5 pl-9 font-sans text-sm text-slate-800 outline-hidden transition focus:border-[#14bace] focus:ring-2 focus:ring-[#14bace]/20"
                                                />
                                                <Mail className="absolute left-3 top-3 size-4 text-slate-400" />
                                            </div>
                                            {fieldErrors.email && (
                                                <p className="mt-1 text-xs text-rose-600">
                                                    {fieldErrors.email}
                                                </p>
                                            )}
                                        </div>

                                        {/* Pilihan Nominal Donasi */}
                                        <div>
                                            <div className="mb-2 flex items-center justify-between">
                                                <label className="font-poppins text-xs font-semibold text-slate-700">
                                                    Pilih Nominal Donasi{' '}
                                                    <span className="text-rose-500">
                                                        *
                                                    </span>
                                                </label>
                                                {nominal !== null && (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-[#e8f8fa] px-2.5 py-0.5 font-poppins text-xs font-bold text-[#087f8c]">
                                                        <CheckCircle2 className="size-3.5 text-[#14bace]" />
                                                        Dipilih: {formatRupiah(nominal)}
                                                    </span>
                                                )}
                                            </div>

                                            <div
                                                role="radiogroup"
                                                aria-label="Pilihan Nominal Donasi"
                                                className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4"
                                            >
                                                {daftarNominal.map((nom) => {
                                                    const isSelected = nominal === nom;
                                                    return (
                                                        <button
                                                            key={nom}
                                                            type="button"
                                                            role="radio"
                                                            aria-checked={isSelected}
                                                            onClick={() => handleSelectNominal(nom)}
                                                            className={`group relative flex items-center justify-between rounded-xl border px-3.5 py-3 text-left font-poppins text-xs font-semibold transition sm:text-sm ${
                                                                isSelected
                                                                    ? 'border-[#14bace] bg-[#e8f8fa] font-bold text-[#087f8c] shadow-xs ring-2 ring-[#14bace]/25'
                                                                    : 'border-[#e4eaec] bg-white text-slate-700 hover:border-[#14bace]/60 hover:bg-[#f7fcfd] hover:text-[#087f8c]'
                                                            }`}
                                                        >
                                                            <span>{formatRupiah(nom)}</span>
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
                                                Pesan & Doa Kebaikan (Opsional)
                                            </label>
                                            <textarea
                                                id="pesan_doa"
                                                rows={3}
                                                placeholder="Tuliskan doa atau harapan untuk adik-adik yatim binaan..."
                                                value={pesanDoa}
                                                onChange={(e) => setPesanDoa(e.target.value)}
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
                                                        <span>Menyiapkan Pembayaran...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Send className="size-4" />
                                                        <span>
                                                            {nominal !== null
                                                                ? `Bayar Donasi ${formatRupiah(nominal)}`
                                                                : 'Lanjutkan ke Pembayaran'}
                                                        </span>
                                                    </>
                                                )}
                                            </button>
                                            <p className="mt-2.5 text-center font-sans text-[11px] text-slate-400">
                                                Didukung pembayaran digital terenkripsi (QRIS, GoPay, ShopeePay, Virtual Account Bank) melalui Midtrans.
                                            </p>
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
