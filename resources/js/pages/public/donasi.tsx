import { useState, useId } from 'react';
import { Head, Link } from '@inertiajs/react';
import {
    ChevronRight,
    CreditCard,
    Copy,
    Check,
    AlertCircle,
    HeartHandshake,
    Send,
    ShieldCheck,
} from 'lucide-react';
import PublicLayout from '@/layouts/public-layout';

export default function DonasiPage() {
    const [namaDonatur, setNamaDonatur] = useState('');
    const [noWhatsApp, setNoWhatsApp] = useState('');
    const [jenisDonasi, setJenisDonasi] = useState('Donasi Umum');
    const [rekeningTujuan, setRekeningTujuan] = useState('BSI - 7123456789');
    const [nominal, setNominal] = useState('');
    const [pesanDoa, setPesanDoa] = useState('');
    const [copiedRekening, setCopiedRekening] = useState<string | null>(null);

    const presetNominals = ['25000', '50000', '100000', '250000', '500000'];

    const rekeningList = [
        {
            bank: 'Bank Syariah Indonesia (BSI)',
            nomor: '7256194821',
            atasNama: 'Yayasan Geliyat Mahdiesa Nahate',
            icon: 'BSI',
        },
        {
            bank: 'Bank Rakyat Indonesia (BRI)',
            nomor: '0123-01-098765-53-1',
            atasNama: 'Yayasan Geliyat Mahdiesa Nahate',
            icon: 'BRI',
        },
    ];

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopiedRekening(text);
        setTimeout(() => setCopiedRekening(null), 2000);
    };

    const handleKirimWhatsApp = (e: React.FormEvent) => {
        e.preventDefault();

        const cleanPhone = '6282120854460'; // Nomor Admin Yayasan Geliyat
        const formattedNominal = nominal
            ? Number(nominal).toLocaleString('id-ID')
            : '0';

        const textMessage = `*KONFIRMASI DONASI - YAYASAN GELIYAT*
----------------------------------------
*Nama Donatur:* ${namaDonatur || '-'}
*No. WhatsApp:* ${noWhatsApp || '-'}
*Jenis Donasi:* ${jenisDonasi}
*Rekening Tujuan:* ${rekeningTujuan}
*Nominal Donasi:* Rp ${formattedNominal}
*Doa & Pesan:*
${pesanDoa || 'Semoga berkah dan bermanfaat bagi adik-adik yatim.'}
----------------------------------------
_Saya telah melakukan transfer ke rekening yayasan dan melampirkan bukti transfer ini._`;

        const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(textMessage)}`;
        window.open(waUrl, '_blank');
    };

    return (
        <PublicLayout>
            <Head title="Donasi Digital - Yayasan Geliyat Mahdiesa Nahate" />

            {/* Banner Header with Breadcrumbs */}
            <div className="border-b border-[#e4eaec] bg-gradient-to-r from-[#d1f6fa]/60 via-[#e8f8fa] to-[#f7fcfd] py-10 sm:py-14">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <h1 className="font-poppins text-3xl font-bold text-[#1d2b2d] sm:text-4xl">
                        Donasi & Sedekah
                    </h1>
                    <nav className="mt-2 flex items-center gap-2 font-poppins text-sm text-gray-500">
                        <Link
                            href="/"
                            className="transition-colors hover:text-[#14bace]"
                        >
                            Beranda
                        </Link>
                        <ChevronRight className="size-4 text-gray-400" />
                        <span className="font-semibold text-[#186972]">
                            Donasi Digital
                        </span>
                    </nav>
                    <p className="mt-3 max-w-2xl font-sans text-sm text-gray-600 sm:text-base">
                        Penyaluran sedekah dan program orang tua asuh yang
                        amanah, langsung membina 420 anak yatim di wilayah
                        Ujungberung, Kota Bandung.
                    </p>
                </div>
            </div>

            {/* Panduan Berdonasi (5 Tahapan - Matching Figma 314:2918) */}
            <section className="border-b border-[#e4eaec] bg-white py-10">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto mb-8 max-w-xl text-center">
                        <span className="font-poppins text-xs font-bold tracking-wider text-[#14bace] uppercase">
                            Alur Sederhana
                        </span>
                        <h2 className="mt-1 font-poppins text-2xl font-bold text-[#1d2b2d]">
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
                                desc: 'Lengkapi identitas & pesan doa di bawah',
                            },
                            {
                                num: '4',
                                title: 'Kirim Bukti',
                                desc: 'Kirim bukti via WhatsApp admin otomatis',
                            },
                            {
                                num: '5',
                                title: 'Verifikasi',
                                desc: 'Admin mencatat donasi ke rekap digital',
                            },
                        ].map((step) => (
                            <div
                                key={step.num}
                                className="group flex flex-col items-center rounded-xl border border-[#e4eaec] bg-[#fbfdfd] p-4 text-center transition hover:border-[#14bace]/40"
                            >
                                <div className="mb-3 flex size-9 items-center justify-center rounded-full bg-[#e8f8fa] font-poppins text-sm font-bold text-[#087f8c] transition group-hover:bg-[#14bace] group-hover:text-white">
                                    {step.num}
                                </div>
                                <h4 className="font-poppins text-xs font-bold text-[#1d2b2d] sm:text-sm">
                                    {step.title}
                                </h4>
                                <p className="mt-1 font-sans text-[11px] leading-snug text-gray-500">
                                    {step.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Rekening & Form Pendataan (Matching Figma 314:2951) */}
            <section className="bg-[#fbfdfd] py-12 sm:py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12">
                        {/* Kolom Kiri: Rekening Resmi & Catatan */}
                        <div className="space-y-6 lg:col-span-5">
                            <div>
                                <h3 className="font-poppins text-xl font-bold text-[#1d2b2d]">
                                    Rekening Resmi Yayasan
                                </h3>
                                <p className="mt-1 font-sans text-xs text-gray-500">
                                    Seluruh donasi disalurkan melalui rekening
                                    resmi berbadan hukum:
                                </p>
                            </div>

                            {/* Rekening Cards */}
                            <div className="space-y-4">
                                {rekeningList.map((rek) => (
                                    <div
                                        key={rek.nomor}
                                        className="flex flex-col justify-between rounded-2xl border border-[#e4eaec] bg-white p-5 shadow-sm transition hover:shadow-md"
                                    >
                                        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                                            <div className="flex items-center gap-2.5">
                                                <CreditCard className="size-5 text-[#14bace]" />
                                                <span className="font-poppins text-sm font-bold text-[#1d2b2d]">
                                                    {rek.bank}
                                                </span>
                                            </div>
                                            <span className="rounded-md bg-[#e8f8fa] px-2 py-0.5 text-[11px] font-semibold text-[#087f8c]">
                                                {rek.icon}
                                            </span>
                                        </div>

                                        <div className="mt-4 flex items-center justify-between">
                                            <div>
                                                <p className="font-mono text-lg font-bold tracking-wider text-[#1d2b2d]">
                                                    {rek.nomor}
                                                </p>
                                                <p className="mt-0.5 text-xs text-gray-500">
                                                    a.n. {rek.atasNama}
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    copyToClipboard(rek.nomor)
                                                }
                                                className="flex items-center gap-1.5 rounded-xl border border-gray-200 p-2.5 text-xs font-semibold text-gray-600 transition hover:border-[#14bace] hover:bg-[#e8f8fa] hover:text-[#087f8c]"
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

                            {/* Catatan Penting Card (From Figma) */}
                            <div className="flex items-start gap-3 rounded-xl border border-amber-200/60 bg-amber-50/70 p-4">
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
                            <div className="rounded-2xl border border-[#14bace]/30 bg-gradient-to-br from-[#14bace]/10 to-[#186972]/10 p-5">
                                <div className="flex items-center gap-3">
                                    <HeartHandshake className="size-6 text-[#14bace]" />
                                    <div>
                                        <h4 className="font-poppins text-sm font-bold text-[#1d2b2d]">
                                            Program Orang Tua Asuh
                                        </h4>
                                        <p className="mt-0.5 text-xs text-gray-600">
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
                            <div className="rounded-3xl border border-[#e4eaec] bg-white p-6 shadow-sm sm:p-8">
                                <div className="border-b border-gray-100 pb-4">
                                    <h3 className="font-poppins text-xl font-bold text-[#1d2b2d]">
                                        Formulir Konfirmasi Donasi
                                    </h3>
                                    <p className="mt-1 font-sans text-xs text-gray-500">
                                        Isi form konfirmasi singkat di bawah ini
                                        untuk pengalihan langsung ke WhatsApp
                                        admin yayasan:
                                    </p>
                                </div>

                                <form
                                    onSubmit={handleKirimWhatsApp}
                                    className="mt-6 space-y-5"
                                >
                                    {/* Nama & WhatsApp */}
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div>
                                            <label className="mb-1.5 block font-poppins text-xs font-semibold text-[#1d2b2d]">
                                                Nama Lengkap / Hamba Allah *
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="Contoh: Ahmad Fauzan"
                                                value={namaDonatur}
                                                onChange={(e) =>
                                                    setNamaDonatur(
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 font-sans text-sm outline-hidden focus:border-[#14bace] focus:ring-2 focus:ring-[#14bace]/20"
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-1.5 block font-poppins text-xs font-semibold text-[#1d2b2d]">
                                                Nomor WhatsApp *
                                            </label>
                                            <input
                                                type="tel"
                                                required
                                                placeholder="Contoh: 08123456789"
                                                value={noWhatsApp}
                                                onChange={(e) =>
                                                    setNoWhatsApp(
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 font-sans text-sm outline-hidden focus:border-[#14bace] focus:ring-2 focus:ring-[#14bace]/20"
                                            />
                                        </div>
                                    </div>

                                    {/* Jenis Donasi */}
                                    <div>
                                        <label className="mb-1.5 block font-poppins text-xs font-semibold text-[#1d2b2d]">
                                            Jenis Donasi *
                                        </label>
                                        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                                            {[
                                                'Donasi Umum',
                                                'Orang Tua Asuh',
                                                'Santunan / Sembako',
                                            ].map((j) => (
                                                <button
                                                    key={j}
                                                    type="button"
                                                    onClick={() =>
                                                        setJenisDonasi(j)
                                                    }
                                                    className={`rounded-xl border px-3 py-2 text-center font-poppins text-xs font-medium transition ${
                                                        jenisDonasi === j
                                                            ? 'border-[#14bace] bg-[#e8f8fa] font-semibold text-[#087f8c]'
                                                            : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                                                    }`}
                                                >
                                                    {j}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Pilihan Rekening Tujuan */}
                                    <div>
                                        <label className="mb-1.5 block font-poppins text-xs font-semibold text-[#1d2b2d]">
                                            Rekening Tujuan Transfer *
                                        </label>
                                        <select
                                            value={rekeningTujuan}
                                            onChange={(e) =>
                                                setRekeningTujuan(
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 font-sans text-sm outline-hidden focus:border-[#14bace] focus:ring-2 focus:ring-[#14bace]/20"
                                        >
                                            <option value="BSI - 7256194821">
                                                Bank Syariah Indonesia (BSI) -
                                                7256194821
                                            </option>
                                            <option value="BRI - 0123-01-098765-53-1">
                                                Bank Rakyat Indonesia (BRI) -
                                                0123-01-098765-53-1
                                            </option>
                                        </select>
                                    </div>

                                    {/* Nominal Donasi */}
                                    <div>
                                        <label className="mb-1.5 block font-poppins text-xs font-semibold text-[#1d2b2d]">
                                            Nominal Donasi (Rp) *
                                        </label>
                                        <div className="relative mb-2">
                                            <span className="absolute top-1/2 left-3.5 -translate-y-1/2 font-sans text-sm font-bold text-gray-400">
                                                Rp
                                            </span>
                                            <input
                                                type="number"
                                                required
                                                min="10000"
                                                step="1000"
                                                placeholder="Contoh: 100000"
                                                value={nominal}
                                                onChange={(e) =>
                                                    setNominal(e.target.value)
                                                }
                                                className="w-full rounded-xl border border-gray-200 py-2.5 pr-4 pl-12 font-sans text-sm outline-hidden focus:border-[#14bace] focus:ring-2 focus:ring-[#14bace]/20"
                                            />
                                        </div>

                                        {/* Presets */}
                                        <div className="flex flex-wrap items-center gap-2">
                                            {presetNominals.map((val) => (
                                                <button
                                                    key={val}
                                                    type="button"
                                                    onClick={() =>
                                                        setNominal(val)
                                                    }
                                                    className="rounded-lg border border-gray-200 px-2.5 py-1 font-mono text-xs font-medium text-gray-600 transition hover:border-[#14bace] hover:bg-[#e8f8fa]"
                                                >
                                                    Rp{' '}
                                                    {Number(val).toLocaleString(
                                                        'id-ID',
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Pesan & Doa */}
                                    <div>
                                        <label className="mb-1.5 block font-poppins text-xs font-semibold text-[#1d2b2d]">
                                            Pesan & Doa Kebaikan (Opsional)
                                        </label>
                                        <textarea
                                            rows={3}
                                            placeholder="Tuliskan doa atau harapan untuk adik-adik yatim binaan..."
                                            value={pesanDoa}
                                            onChange={(e) =>
                                                setPesanDoa(e.target.value)
                                            }
                                            className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 font-sans text-sm outline-hidden focus:border-[#14bace] focus:ring-2 focus:ring-[#14bace]/20"
                                        />
                                    </div>

                                    {/* Submit Action */}
                                    <div className="pt-2">
                                        <button
                                            type="submit"
                                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#14bace] px-6 py-3.5 font-poppins text-sm font-bold text-white shadow-md shadow-[#14bace]/25 transition hover:bg-[#087f8c] active:scale-[0.99]"
                                        >
                                            <Send className="size-4" />
                                            <span>
                                                Konfirmasi Donasi via WhatsApp
                                            </span>
                                        </button>
                                        <p className="mt-2.5 text-center font-sans text-[11px] text-gray-400">
                                            Sistem akan membuka WhatsApp secara
                                            otomatis dengan pesan konfirmasi
                                            yang sudah terformat rapi.
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
