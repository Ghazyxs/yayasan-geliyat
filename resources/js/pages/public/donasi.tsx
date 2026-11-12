import { useState } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
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
} from 'lucide-react';
import PublicLayout from '@/layouts/public-layout';

interface DonasiSubmittedInfo {
    kode_donasi: string;
    nama_donatur: string;
    nominal: number;
    status_verifikasi: string;
}

interface DonasiPageProps {
    nominalOptions?: number[];
    donasiSubmitted?: DonasiSubmittedInfo | null;
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
        title: 'Tulis Pesan & Doa',
        desc: 'Sertakan doa atau harapan kebaikan untuk adik-adik yatim binaan (opsional).',
        icon: MessageSquareHeart,
    },
    {
        num: '4',
        title: 'Lanjutkan Pembayaran',
        desc: 'Kirim formulir untuk melanjutkan proses pembayaran donasi secara aman dan tercatat otomatis.',
        icon: ShieldCheck,
    },
];

export default function DonasiPage({
    nominalOptions = DEFAULT_NOMINAL_OPTIONS,
    donasiSubmitted = null,
}: DonasiPageProps) {
    const pageProps = usePage<{
        flash?: { success?: string | null; error?: string | null };
    }>().props;

    const daftarNominal =
        nominalOptions.length > 0 ? nominalOptions : DEFAULT_NOMINAL_OPTIONS;

    const [nominalError, setNominalError] = useState<string | null>(null);

    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm<{
            nama_donatur: string;
            no_whatsapp: string;
            nominal: number | null;
            pesan_doa: string;
        }>({
            nama_donatur: '',
            no_whatsapp: '',
            nominal: null,
            pesan_doa: '',
        });

    const formatRupiah = (val: number | string) => {
        const num = Number(val);
        if (Number.isNaN(num)) return 'Rp0';
        return `Rp${num.toLocaleString('id-ID')}`;
    };

    const handleSelectNominal = (nominal: number) => {
        setData('nominal', nominal);
        setNominalError(null);
        clearErrors('nominal');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (data.nominal === null || !daftarNominal.includes(data.nominal)) {
            setNominalError('Silakan pilih salah satu nominal donasi terlebih dahulu.');
            return;
        }

        setNominalError(null);

        post('/donasi', {
            preserveScroll: true,
            onSuccess: () => {
                reset();
            },
        });
    };

    const activeNominalError = errors.nominal || nominalError;

    return (
        <PublicLayout>
            <Head title="Donasi Digital - Yayasan Geliyat Mahdiesa Nahate" />

            {/* Banner Header with Breadcrumbs */}
            <div className="border-b border-[#e4eaec] bg-gradient-to-r from-[#d1f6fa]/60 via-[#e8f8fa] to-[#f7fcfd] py-10 sm:py-14">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <h1 className="font-poppins text-3xl font-bold text-slate-800 sm:text-4xl">
                        Donasi & Sedekah
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
                            Donasi Digital
                        </span>
                    </nav>
                    <p className="mt-3 max-w-2xl font-sans text-sm text-slate-600 sm:text-base">
                        Penyaluran infaq, sedekah, dan santunan pendidikan yang
                        amanah, langsung membina 420 anak yatim di wilayah
                        Ujungberung, Kota Bandung.
                    </p>
                </div>
            </div>

            {/* Alur Berdonasi & Formulir Donasi */}
            <section className="bg-[#f8fafb] py-10 sm:py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Notifikasi Berhasil */}
                    {(pageProps.flash?.success || donasiSubmitted) && (
                        <div className="mb-8 rounded-2xl border border-emerald-200 bg-emerald-50/90 p-5 shadow-xs">
                            <div className="flex items-start gap-3.5">
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                                    <CheckCircle2 className="size-5" />
                                </div>
                                <div className="w-full">
                                    <h4 className="font-poppins text-sm font-bold text-emerald-900 sm:text-base">
                                        Alhamdulillah, Data Donasi Berhasil
                                        Dicatat!
                                    </h4>
                                    <p className="mt-1 text-xs leading-relaxed text-emerald-800 sm:text-sm">
                                        {pageProps.flash?.success ??
                                            'Data donasi Anda telah tersimpan di sistem dan siap dilanjutkan ke proses pembayaran.'}
                                    </p>

                                    {donasiSubmitted && (
                                        <div className="mt-3 grid grid-cols-1 gap-3 rounded-xl border border-emerald-200/80 bg-white/90 p-3.5 text-xs text-slate-700 sm:grid-cols-3">
                                            <div>
                                                <span className="block text-[11px] text-slate-400">
                                                    Kode Donasi
                                                </span>
                                                <span className="font-mono font-bold text-slate-800">
                                                    {donasiSubmitted.kode_donasi}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="block text-[11px] text-slate-400">
                                                    Nominal Donasi
                                                </span>
                                                <span className="font-semibold text-[#087f8c]">
                                                    {formatRupiah(
                                                        donasiSubmitted.nominal,
                                                    )}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="block text-[11px] text-slate-400">
                                                    Status Saat Ini
                                                </span>
                                                <span className="mt-0.5 inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700">
                                                    <Clock className="size-3" />
                                                    Menunggu Pembayaran
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {pageProps.flash?.error && (
                        <div className="mb-8 flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
                            <AlertCircle className="size-5 shrink-0 text-rose-600" />
                            <span>{pageProps.flash.error}</span>
                        </div>
                    )}

                    <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12">
                        {/* Kolom Kiri: Alur Berdonasi */}
                        <div className="flex flex-col justify-between rounded-3xl border border-[#e4eaec] bg-white p-6 shadow-xs sm:p-8 lg:col-span-5">
                            <div>
                                <span className="font-poppins text-xs font-bold tracking-wider text-[#14bace] uppercase">
                                    Alur Sederhana
                                </span>
                                <h2 className="mt-1 font-poppins text-xl font-bold text-slate-800 sm:text-2xl">
                                    Alur Berdonasi
                                </h2>
                                <p className="mt-1 font-sans text-xs leading-relaxed text-slate-500 sm:text-sm">
                                    Ikuti langkah singkat berikut untuk
                                    menyalurkan donasi terbaik Anda bagi
                                    anak-anak yatim binaan:
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
                                            Komitmen Penyaluran Amanah
                                        </h3>
                                        <p className="mt-1 font-sans text-xs leading-relaxed text-slate-600">
                                            Setiap donasi yang masuk tercatat
                                            secara transparan di sistem yayasan
                                            untuk mendukung pendidikan serta
                                            kesejahteraan anak binaan.
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
                                        <h2 className="font-poppins text-xl font-bold text-slate-800 sm:text-2xl">
                                            Formulir Donasi
                                        </h2>
                                        <p className="mt-1 font-sans text-xs text-slate-500 sm:text-sm">
                                            Lengkapi identitas donatur dan pilih
                                            nominal donasi yang ingin Anda
                                            salurkan:
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
                                                    value={data.nama_donatur}
                                                    onChange={(e) =>
                                                        setData(
                                                            'nama_donatur',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="w-full rounded-xl border border-[#e4eaec] bg-white px-3.5 py-2.5 font-sans text-sm text-slate-800 outline-hidden transition focus:border-[#14bace] focus:ring-2 focus:ring-[#14bace]/20"
                                                />
                                                {errors.nama_donatur && (
                                                    <p className="mt-1 text-xs text-rose-600">
                                                        {errors.nama_donatur}
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
                                                    value={data.no_whatsapp}
                                                    onChange={(e) =>
                                                        setData(
                                                            'no_whatsapp',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="w-full rounded-xl border border-[#e4eaec] bg-white px-3.5 py-2.5 font-sans text-sm text-slate-800 outline-hidden transition focus:border-[#14bace] focus:ring-2 focus:ring-[#14bace]/20"
                                                />
                                                {errors.no_whatsapp && (
                                                    <p className="mt-1 text-xs text-rose-600">
                                                        {errors.no_whatsapp}
                                                    </p>
                                                )}
                                            </div>
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
                                                {data.nominal !== null && (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-[#e8f8fa] px-2.5 py-0.5 font-poppins text-xs font-bold text-[#087f8c]">
                                                        <CheckCircle2 className="size-3.5 text-[#14bace]" />
                                                        Dipilih:{' '}
                                                        {formatRupiah(
                                                            data.nominal,
                                                        )}
                                                    </span>
                                                )}
                                            </div>

                                            <div
                                                role="radiogroup"
                                                aria-label="Pilihan Nominal Donasi"
                                                className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4"
                                            >
                                                {daftarNominal.map(
                                                    (nominal) => {
                                                        const isSelected =
                                                            data.nominal ===
                                                            nominal;
                                                        return (
                                                            <button
                                                                key={nominal}
                                                                type="button"
                                                                role="radio"
                                                                aria-checked={
                                                                    isSelected
                                                                }
                                                                onClick={() =>
                                                                    handleSelectNominal(
                                                                        nominal,
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
                                                                        nominal,
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
                                                    },
                                                )}
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
                                                value={data.pesan_doa}
                                                onChange={(e) =>
                                                    setData(
                                                        'pesan_doa',
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full rounded-xl border border-[#e4eaec] bg-white px-3.5 py-2.5 font-sans text-sm text-slate-800 outline-hidden transition focus:border-[#14bace] focus:ring-2 focus:ring-[#14bace]/20"
                                            />
                                            {errors.pesan_doa && (
                                                <p className="mt-1 text-xs text-rose-600">
                                                    {errors.pesan_doa}
                                                </p>
                                            )}
                                        </div>

                                        {/* Submit Action */}
                                        <div className="pt-2">
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#14bace] px-6 py-3.5 font-poppins text-sm font-bold text-white shadow-sm transition hover:bg-[#087f8c] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                                            >
                                                <Send className="size-4" />
                                                <span>
                                                    {processing
                                                        ? 'Memproses Donasi...'
                                                        : data.nominal !== null
                                                          ? `Lanjutkan Donasi ${formatRupiah(data.nominal)}`
                                                          : 'Lanjutkan Donasi'}
                                                </span>
                                            </button>
                                            <p className="mt-2.5 text-center font-sans text-[11px] text-slate-400">
                                                Data donasi Anda disimpan secara
                                                aman dan diproses secara
                                                transparan oleh Yayasan Geliyat
                                                Mahdiesa Nahate.
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
