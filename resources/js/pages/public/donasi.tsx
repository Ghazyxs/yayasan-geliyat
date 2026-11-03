import { useState, useRef } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import {
    ChevronRight,
    CreditCard,
    Copy,
    Check,
    AlertCircle,
    HeartHandshake,
    Send,
    Upload,
    FileCheck2,
    CheckCircle2,
    Clock,
    X,
    MessageCircle,
    UserCheck,
} from 'lucide-react';
import PublicLayout from '@/layouts/public-layout';

interface RekeningItem {
    kode: string;
    bank: string;
    nomor: string;
    atas_nama: string;
    icon: string;
}

interface AnakYatimPublicItem {
    id: number;
    alias: string;
    jenjang: string;
    kelas: string;
    kelurahan: string;
    status_asuh: 'belum_diasuh' | 'aktif_diasuh';
}

interface DonasiSubmittedInfo {
    kode_donasi: string;
    nama_donatur: string;
    jenis_donasi: string;
    nominal: number;
    rekening_tujuan: string;
    status_verifikasi: string;
}

interface DonasiPageProps {
    rekeningList?: RekeningItem[];
    jenisDonasiList?: string[];
    anakYatimList?: AnakYatimPublicItem[];
    donasiSubmitted?: DonasiSubmittedInfo | null;
}

const DEFAULT_REKENING: RekeningItem[] = [
    {
        kode: 'BSI - 7256194821',
        bank: 'Bank Syariah Indonesia (BSI)',
        nomor: '7256194821',
        atas_nama: 'Yayasan Geliyat Mahdiesa Nahate',
        icon: 'BSI',
    },
    {
        kode: 'BRI - 0123-01-098765-53-1',
        bank: 'Bank Rakyat Indonesia (BRI)',
        nomor: '0123-01-098765-53-1',
        atas_nama: 'Yayasan Geliyat Mahdiesa Nahate',
        icon: 'BRI',
    },
];

const DEFAULT_JENIS_DONASI = [
    'Donasi Umum',
    'Orang Tua Asuh',
    'Santunan Rutin',
    'Bimbel Sinar',
    'Zakat',
];

const JENIS_DENGAN_ANak = ['Orang Tua Asuh', 'Santunan Rutin', 'Bimbel Sinar'];

export default function DonasiPage({
    rekeningList = DEFAULT_REKENING,
    jenisDonasiList = DEFAULT_JENIS_DONASI,
    anakYatimList = [],
    donasiSubmitted = null,
}: DonasiPageProps) {
    const pageProps = usePage<{
        flash?: { success?: string | null; error?: string | null };
    }>().props;

    const daftarRekening =
        rekeningList.length > 0 ? rekeningList : DEFAULT_REKENING;
    const daftarJenis =
        jenisDonasiList.length > 0 ? jenisDonasiList : DEFAULT_JENIS_DONASI;

    const [copiedRekening, setCopiedRekening] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm<{
            nama_donatur: string;
            no_whatsapp: string;
            jenis_donasi: string;
            anak_yatim_id: string;
            rekening_tujuan: string;
            nominal: string;
            pesan_doa: string;
            bukti_transfer: File | null;
        }>({
            nama_donatur: '',
            no_whatsapp: '',
            jenis_donasi: daftarJenis[0] ?? 'Donasi Umum',
            anak_yatim_id: '',
            rekening_tujuan: daftarRekening[0]?.kode ?? 'BSI - 7256194821',
            nominal: '',
            pesan_doa: '',
            bukti_transfer: null,
        });

    const presetNominals = ['25000', '50000', '100000', '250000', '500000'];

    const copyToClipboard = (text: string) => {
        navigator.clipboard
            .writeText(text)
            .then(() => {
                setCopiedRekening(text);
                setTimeout(() => setCopiedRekening(null), 2000);
            })
            .catch(() => {
                // Penanganan jika izin clipboard ditolak atau tidak didukung browser
            });
    };

    const canSelectAnak = JENIS_DENGAN_ANak.includes(data.jenis_donasi);

    const handleJenisChange = (jenis: string) => {
        setData((prev) => ({
            ...prev,
            jenis_donasi: jenis,
            anak_yatim_id: JENIS_DENGAN_ANak.includes(jenis)
                ? prev.anak_yatim_id
                : '',
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setData('bukti_transfer', file);
        if (file) {
            clearErrors('bukti_transfer');
        }
    };

    const handleRemoveFile = () => {
        setData('bukti_transfer', null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post('/donasi', {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                reset();
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            },
        });
    };

    const formatRupiah = (val: number | string) => {
        const num = Number(val);
        if (Number.isNaN(num)) return 'Rp 0';
        return `Rp ${num.toLocaleString('id-ID')}`;
    };

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
                        Penyaluran sedekah dan program orang tua asuh yang
                        amanah, langsung membina 420 anak yatim di wilayah
                        Ujungberung, Kota Bandung.
                    </p>
                </div>
            </div>

            {/* Panduan Berdonasi (5 Tahapan) */}
            <section className="border-b border-[#e4eaec] bg-white py-10">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto mb-8 max-w-xl text-center">
                        <span className="font-poppins text-xs font-bold tracking-wider text-[#14bace] uppercase">
                            Alur Sederhana
                        </span>
                        <h2 className="mt-1 font-poppins text-2xl font-bold text-slate-800">
                            5 Langkah Mudah Berdonasi
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                        {[
                            {
                                num: '1',
                                title: 'Pilih Rekening',
                                desc: 'Pilih rekening resmi bank yayasan',
                            },
                            {
                                num: '2',
                                title: 'Transfer Dana',
                                desc: 'Transfer sesuai nominal kebaikan Anda',
                            },
                            {
                                num: '3',
                                title: 'Isi Formulir',
                                desc: 'Lengkapi identitas & jenis program donasi',
                            },
                            {
                                num: '4',
                                title: 'Unggah Bukti',
                                desc: 'Unggah foto/PDF resi bukti transfer bank',
                            },
                            {
                                num: '5',
                                title: 'Verifikasi',
                                desc: 'Admin memverifikasi & mencatat ke buku kas',
                            },
                        ].map((step) => (
                            <div
                                key={step.num}
                                className="group flex flex-col items-center rounded-xl border border-[#e4eaec] bg-[#fbfdfd] p-4 text-center transition hover:border-[#14bace]/40"
                            >
                                <div className="mb-3 flex size-9 items-center justify-center rounded-full bg-[#e8f8fa] font-poppins text-sm font-bold text-[#087f8c] transition group-hover:bg-[#14bace] group-hover:text-white">
                                    {step.num}
                                </div>
                                <h4 className="font-poppins text-xs font-bold text-slate-800 sm:text-sm">
                                    {step.title}
                                </h4>
                                <p className="mt-1 font-sans text-[11px] leading-snug text-slate-500">
                                    {step.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Rekening & Form Pendataan */}
            <section className="bg-[#f8fafb] py-12 sm:py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Notifikasi Berhasil */}
                    {(pageProps.flash?.success || donasiSubmitted) && (
                        <div className="mb-8 rounded-2xl border border-emerald-200 bg-emerald-50/90 p-5 shadow-xs">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                <div className="flex items-start gap-3.5">
                                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                                        <CheckCircle2 className="size-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-poppins text-sm font-bold text-emerald-900 sm:text-base">
                                            Alhamdulillah, Pengajuan Donasi
                                            Berhasil Dikirim!
                                        </h4>
                                        <p className="mt-1 text-xs leading-relaxed text-emerald-800 sm:text-sm">
                                            {pageProps.flash?.success ??
                                                'Data donasi dan bukti transfer Anda telah tersimpan di sistem dan sedang menunggu verifikasi admin.'}
                                        </p>

                                        {donasiSubmitted && (
                                            <div className="mt-3 grid grid-cols-1 gap-2 rounded-xl border border-emerald-200/80 bg-white/90 p-3.5 text-xs text-slate-700 sm:grid-cols-3">
                                                <div>
                                                    <span className="block text-[11px] text-slate-400">
                                                        Kode Donasi
                                                    </span>
                                                    <span className="font-mono font-bold text-slate-800">
                                                        {
                                                            donasiSubmitted.kode_donasi
                                                        }
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="block text-[11px] text-slate-400">
                                                        Jenis & Nominal
                                                    </span>
                                                    <span className="font-semibold text-slate-800">
                                                        {
                                                            donasiSubmitted.jenis_donasi
                                                        }{' '}
                                                        —{' '}
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
                                                        Menunggu Verifikasi
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {donasiSubmitted && (
                                    <a
                                        href={`https://wa.me/6282120854460?text=${encodeURIComponent(
                                            `Assalamu'alaikum Admin Yayasan Geliyat, saya *${donasiSubmitted.nama_donatur}* telah mengirim konfirmasi donasi melalui website dengan Kode: *${donasiSubmitted.kode_donasi}* sebesar *${formatRupiah(donasiSubmitted.nominal)}* (${donasiSubmitted.jenis_donasi}). Mohon bantuannya untuk verifikasi. Terima kasih.`,
                                        )}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex shrink-0 items-center gap-2 self-start rounded-xl border border-emerald-300 bg-white px-3.5 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100"
                                    >
                                        <MessageCircle className="size-4" />
                                        Kabari via WhatsApp
                                    </a>
                                )}
                            </div>
                        </div>
                    )}

                    {pageProps.flash?.error && (
                        <div className="mb-8 flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
                            <AlertCircle className="size-5 shrink-0 text-rose-600" />
                            <span>{pageProps.flash.error}</span>
                        </div>
                    )}

                    <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12">
                        {/* Kolom Kiri: Rekening Resmi & Catatan */}
                        <div className="space-y-6 lg:col-span-5">
                            <div>
                                <h3 className="font-poppins text-xl font-bold text-slate-800">
                                    Rekening Resmi Yayasan
                                </h3>
                                <p className="mt-1 font-sans text-xs text-slate-500">
                                    Seluruh donasi disalurkan melalui rekening
                                    resmi berbadan hukum:
                                </p>
                            </div>

                            {/* Rekening Cards */}
                            <div className="space-y-4">
                                {daftarRekening.map((rek) => (
                                    <div
                                        key={rek.nomor}
                                        className="flex flex-col justify-between rounded-2xl border border-[#e4eaec] bg-white p-5 shadow-xs transition hover:shadow-sm"
                                    >
                                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                            <div className="flex items-center gap-2.5">
                                                <CreditCard className="size-5 text-[#14bace]" />
                                                <span className="font-poppins text-sm font-bold text-slate-800">
                                                    {rek.bank}
                                                </span>
                                            </div>
                                            <span className="rounded-md bg-[#e8f8fa] px-2 py-0.5 text-[11px] font-semibold text-[#087f8c]">
                                                {rek.icon}
                                            </span>
                                        </div>

                                        <div className="mt-4 flex items-center justify-between">
                                            <div>
                                                <p className="font-mono text-lg font-bold tracking-wider text-slate-800">
                                                    {rek.nomor}
                                                </p>
                                                <p className="mt-0.5 text-xs text-slate-500">
                                                    a.n. {rek.atas_nama}
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    copyToClipboard(rek.nomor)
                                                }
                                                className="flex items-center gap-1.5 rounded-xl border border-[#e4eaec] bg-white p-2.5 text-xs font-semibold text-slate-600 transition hover:border-[#14bace] hover:bg-[#e8f8fa] hover:text-[#087f8c]"
                                                title="Salin Nomor Rekening"
                                            >
                                                {copiedRekening ===
                                                rek.nomor ? (
                                                    <>
                                                        <Check className="size-4 text-emerald-600" />
                                                        <span className="text-emerald-600">
                                                            Disalin
                                                        </span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Copy className="size-4" />
                                                        <span>Salin</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Catatan Penting Card */}
                            <div className="flex items-start gap-3 rounded-xl border border-amber-200/70 bg-amber-50/70 p-4">
                                <AlertCircle className="mt-0.5 size-5 shrink-0 text-amber-600" />
                                <div>
                                    <h4 className="font-poppins text-xs font-bold text-amber-900">
                                        Pemberitahuan Rekening Resmi
                                    </h4>
                                    <p className="mt-1 font-sans text-[11px] leading-relaxed text-amber-800">
                                        Pastikan transfer ditujukan ke rekening
                                        atas nama{' '}
                                        <strong>
                                            Yayasan Geliyat Mahdiesa Nahate
                                        </strong>
                                        . Yayasan tidak pernah menggunakan
                                        rekening atas nama perorangan.
                                    </p>
                                </div>
                            </div>

                            {/* Orang Tua Asuh Highlight */}
                            <div className="rounded-2xl border border-[#cbebf0] bg-[#f7fcfd] p-5">
                                <div className="flex items-center gap-3">
                                    <HeartHandshake className="size-6 shrink-0 text-[#14bace]" />
                                    <div>
                                        <h4 className="font-poppins text-sm font-bold text-slate-800">
                                            Program Orang Tua Asuh
                                        </h4>
                                        <p className="mt-0.5 text-xs text-slate-600">
                                            Mulai dari{' '}
                                            <strong>Rp10.000 / bulan</strong>{' '}
                                            (sukarela) untuk mendukung satu anak
                                            binaan hingga jenjang SMA / kuliah.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Kolom Kanan: Formulir Konfirmasi Donasi */}
                        <div className="lg:col-span-7">
                            <div className="rounded-3xl border border-[#e4eaec] bg-white p-6 shadow-xs sm:p-8">
                                <div className="border-b border-slate-100 pb-4">
                                    <h3 className="font-poppins text-xl font-bold text-slate-800">
                                        Formulir Konfirmasi Donasi
                                    </h3>
                                    <p className="mt-1 font-sans text-xs text-slate-500">
                                        Lengkapi data konfirmasi dan unggah
                                        bukti transfer agar tercatat otomatis di
                                        sistem keuangan yayasan:
                                    </p>
                                </div>

                                <form
                                    onSubmit={handleSubmit}
                                    className="mt-6 space-y-5"
                                >
                                    {/* Nama & WhatsApp */}
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

                                    {/* Jenis Donasi */}
                                    <div>
                                        <label className="mb-1.5 block font-poppins text-xs font-semibold text-slate-700">
                                            Jenis Program Donasi{' '}
                                            <span className="text-rose-500">
                                                *
                                            </span>
                                        </label>
                                        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                                            {daftarJenis.map((j) => (
                                                <button
                                                    key={j}
                                                    type="button"
                                                    onClick={() =>
                                                        handleJenisChange(j)
                                                    }
                                                    className={`rounded-xl border px-3 py-2.5 text-center font-poppins text-xs font-medium transition ${
                                                        data.jenis_donasi === j
                                                            ? 'border-[#14bace] bg-[#e8f8fa] font-semibold text-[#087f8c]'
                                                            : 'border-[#e4eaec] bg-white text-slate-600 hover:bg-slate-50'
                                                    }`}
                                                >
                                                    {j}
                                                </button>
                                            ))}
                                        </div>
                                        {errors.jenis_donasi && (
                                            <p className="mt-1 text-xs text-rose-600">
                                                {errors.jenis_donasi}
                                            </p>
                                        )}
                                    </div>

                                    {/* Pilih Anak Yatim jika jenis donasi memungkinkan penunjukan anak */}
                                    {canSelectAnak && (
                                        <div className="rounded-xl border border-[#cbebf0] bg-[#f7fcfd] p-4">
                                            <label
                                                htmlFor="anak_yatim_id"
                                                className="mb-1.5 flex items-center gap-1.5 font-poppins text-xs font-semibold text-[#087f8c]"
                                            >
                                                <UserCheck className="size-4 text-[#14bace]" />
                                                Pilih Anak Binaan Tujuan
                                                (Opsional / Khusus Orang Tua
                                                Asuh)
                                            </label>
                                            <select
                                                id="anak_yatim_id"
                                                value={data.anak_yatim_id}
                                                onChange={(e) =>
                                                    setData(
                                                        'anak_yatim_id',
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full rounded-xl border border-[#cbebf0] bg-white px-3.5 py-2.5 font-sans text-sm text-slate-800 outline-hidden focus:border-[#14bace] focus:ring-2 focus:ring-[#14bace]/20"
                                            >
                                                <option value="">
                                                    -- Disalurkan ke Anak Binaan
                                                    yang Membutuhkan --
                                                </option>
                                                {anakYatimList.map((anak) => (
                                                    <option
                                                        key={anak.id}
                                                        value={String(anak.id)}
                                                    >
                                                        {anak.alias} —{' '}
                                                        {anak.jenjang} (
                                                        {anak.kelas}) • Kel.{' '}
                                                        {anak.kelurahan}
                                                        {anak.status_asuh ===
                                                        'belum_diasuh'
                                                            ? ' [Belum Diasuh]'
                                                            : ' [Aktif Diasuh]'}
                                                    </option>
                                                ))}
                                            </select>
                                            <p className="mt-1.5 text-[11px] text-slate-500">
                                                Identitas anak ditampilkan dalam
                                                format inisial/alias untuk
                                                menjaga privasi dan perlindungan
                                                data anak.
                                            </p>
                                            {errors.anak_yatim_id && (
                                                <p className="mt-1 text-xs text-rose-600">
                                                    {errors.anak_yatim_id}
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {/* Pilihan Rekening Tujuan */}
                                    <div>
                                        <label
                                            htmlFor="rekening_tujuan"
                                            className="mb-1.5 block font-poppins text-xs font-semibold text-slate-700"
                                        >
                                            Rekening Tujuan Transfer{' '}
                                            <span className="text-rose-500">
                                                *
                                            </span>
                                        </label>
                                        <select
                                            id="rekening_tujuan"
                                            value={data.rekening_tujuan}
                                            onChange={(e) =>
                                                setData(
                                                    'rekening_tujuan',
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full rounded-xl border border-[#e4eaec] bg-white px-3.5 py-2.5 font-sans text-sm text-slate-800 outline-hidden focus:border-[#14bace] focus:ring-2 focus:ring-[#14bace]/20"
                                        >
                                            {daftarRekening.map((rek) => (
                                                <option
                                                    key={rek.kode}
                                                    value={rek.kode}
                                                >
                                                    {rek.bank} - {rek.nomor}{' '}
                                                    (a.n. {rek.atas_nama})
                                                </option>
                                            ))}
                                        </select>
                                        {errors.rekening_tujuan && (
                                            <p className="mt-1 text-xs text-rose-600">
                                                {errors.rekening_tujuan}
                                            </p>
                                        )}
                                    </div>

                                    {/* Nominal Donasi */}
                                    <div>
                                        <label
                                            htmlFor="nominal"
                                            className="mb-1.5 block font-poppins text-xs font-semibold text-slate-700"
                                        >
                                            Nominal Donasi (Rp){' '}
                                            <span className="text-rose-500">
                                                *
                                            </span>
                                        </label>
                                        <div className="relative mb-2">
                                            <span className="absolute top-1/2 left-3.5 -translate-y-1/2 font-sans text-sm font-bold text-slate-400">
                                                Rp
                                            </span>
                                            <input
                                                id="nominal"
                                                type="number"
                                                required
                                                min="10000"
                                                step="1000"
                                                placeholder="Contoh: 100000"
                                                value={data.nominal}
                                                onChange={(e) =>
                                                    setData(
                                                        'nominal',
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full rounded-xl border border-[#e4eaec] bg-white py-2.5 pr-4 pl-12 font-sans text-sm text-slate-800 outline-hidden focus:border-[#14bace] focus:ring-2 focus:ring-[#14bace]/20"
                                            />
                                        </div>

                                        {/* Presets */}
                                        <div className="flex flex-wrap items-center gap-2">
                                            {presetNominals.map((val) => (
                                                <button
                                                    key={val}
                                                    type="button"
                                                    onClick={() =>
                                                        setData('nominal', val)
                                                    }
                                                    className={`rounded-lg border px-2.5 py-1 font-mono text-xs font-medium transition ${
                                                        data.nominal === val
                                                            ? 'border-[#14bace] bg-[#e8f8fa] font-semibold text-[#087f8c]'
                                                            : 'border-[#e4eaec] bg-white text-slate-600 hover:border-[#14bace] hover:bg-[#e8f8fa]'
                                                    }`}
                                                >
                                                    Rp{' '}
                                                    {Number(val).toLocaleString(
                                                        'id-ID',
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                        {errors.nominal && (
                                            <p className="mt-1 text-xs text-rose-600">
                                                {errors.nominal}
                                            </p>
                                        )}
                                    </div>

                                    {/* Unggah Bukti Transfer */}
                                    <div>
                                        <label
                                            htmlFor="bukti_transfer"
                                            className="mb-1.5 block font-poppins text-xs font-semibold text-slate-700"
                                        >
                                            Unggah Bukti Transfer{' '}
                                            <span className="text-rose-500">
                                                *
                                            </span>
                                        </label>

                                        {!data.bukti_transfer ? (
                                            <label
                                                htmlFor="bukti_transfer"
                                                className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#cbd5e1] bg-[#f8fafb] px-4 py-6 text-center transition hover:border-[#14bace] hover:bg-[#f7fcfd]"
                                            >
                                                <div className="mb-2 flex size-10 items-center justify-center rounded-full bg-[#e8f8fa] text-[#087f8c]">
                                                    <Upload className="size-5" />
                                                </div>
                                                <span className="font-poppins text-xs font-semibold text-slate-700">
                                                    Klik untuk memilih file
                                                    bukti transfer
                                                </span>
                                                <span className="mt-1 text-[11px] text-slate-500">
                                                    Format JPG, JPEG, PNG, WEBP,
                                                    atau PDF (Maks. 5 MB)
                                                </span>
                                            </label>
                                        ) : (
                                            <div className="flex items-center justify-between rounded-xl border border-[#cbebf0] bg-[#f7fcfd] px-4 py-3">
                                                <div className="flex items-center gap-3 overflow-hidden">
                                                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#e8f8fa] text-[#087f8c]">
                                                        <FileCheck2 className="size-5" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="truncate text-xs font-semibold text-slate-800">
                                                            {
                                                                data
                                                                    .bukti_transfer
                                                                    .name
                                                            }
                                                        </p>
                                                        <p className="text-[11px] text-slate-500">
                                                            {(
                                                                data
                                                                    .bukti_transfer
                                                                    .size / 1024
                                                            ).toFixed(1)}{' '}
                                                            KB
                                                        </p>
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={handleRemoveFile}
                                                    className="rounded-lg p-1.5 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                                                    title="Hapus file"
                                                >
                                                    <X className="size-4" />
                                                </button>
                                            </div>
                                        )}

                                        <input
                                            ref={fileInputRef}
                                            id="bukti_transfer"
                                            type="file"
                                            accept=".jpg,.jpeg,.png,.webp,.pdf,image/jpeg,image/png,image/webp,application/pdf"
                                            onChange={handleFileChange}
                                            className="sr-only"
                                        />

                                        {errors.bukti_transfer && (
                                            <p className="mt-1.5 text-xs text-rose-600">
                                                {errors.bukti_transfer}
                                            </p>
                                        )}
                                    </div>

                                    {/* Pesan & Doa */}
                                    <div>
                                        <label
                                            htmlFor="pesan_doa"
                                            className="mb-1.5 block font-poppins text-xs font-semibold text-slate-700"
                                        >
                                            Pesan & Doa Kebaikan / Keterangan
                                            (Opsional)
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
                                            className="w-full rounded-xl border border-[#e4eaec] bg-white px-3.5 py-2.5 font-sans text-sm text-slate-800 outline-hidden focus:border-[#14bace] focus:ring-2 focus:ring-[#14bace]/20"
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
                                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#14bace] px-6 py-3.5 font-poppins text-sm font-bold text-white shadow-sm transition hover:bg-[#0fa0ae] disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            <Send className="size-4" />
                                            <span>
                                                {processing
                                                    ? 'Mengirim Konfirmasi Donasi...'
                                                    : 'Kirim Konfirmasi & Bukti Transfer'}
                                            </span>
                                        </button>
                                        <p className="mt-2.5 text-center font-sans text-[11px] text-slate-400">
                                            Data donasi dan bukti transfer Anda
                                            disimpan secara terenkripsi dan
                                            diverifikasi langsung oleh pengurus
                                            resmi yayasan.
                                        </p>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
