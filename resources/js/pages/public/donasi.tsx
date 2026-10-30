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
        const formattedNominal = nominal ? Number(nominal).toLocaleString('id-ID') : '0';

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
            <div className="bg-gradient-to-r from-[#d1f6fa]/60 via-[#e8f8fa] to-[#f7fcfd] border-b border-[#e4eaec] py-10 sm:py-14">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="font-poppins font-bold text-3xl sm:text-4xl text-[#1d2b2d]">
                        Donasi & Sedekah
                    </h1>
                    <nav className="flex items-center gap-2 mt-2 text-sm text-gray-500 font-poppins">
                        <Link href="/" className="hover:text-[#14bace] transition-colors">
                            Beranda
                        </Link>
                        <ChevronRight className="size-4 text-gray-400" />
                        <span className="font-semibold text-[#186972]">Donasi Digital</span>
                    </nav>
                    <p className="mt-3 text-sm sm:text-base text-gray-600 max-w-2xl font-sans">
                        Penyaluran sedekah dan program orang tua asuh yang amanah, langsung membina 420 anak yatim di wilayah Ujungberung, Kota Bandung.
                    </p>
                </div>
            </div>

            {/* Panduan Berdonasi (5 Tahapan - Matching Figma 314:2918) */}
            <section className="py-10 bg-white border-b border-[#e4eaec]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-xl mx-auto mb-8">
                        <span className="text-xs font-bold text-[#14bace] uppercase tracking-wider font-poppins">
                            Alur Sederhana
                        </span>
                        <h2 className="mt-1 text-2xl font-bold font-poppins text-[#1d2b2d]">
                            5 Langkah Mudah Berdonasi
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                        {[
                            { num: '1', title: 'Pilih Rekening', desc: 'Pilih rekening resmi bank yayasan' },
                            { num: '2', title: 'Transfer Dana', desc: 'Transfer sesuai nominal kebaikan Anda' },
                            { num: '3', title: 'Isi Formulir', desc: 'Lengkapi identitas & pesan doa di bawah' },
                            { num: '4', title: 'Kirim Bukti', desc: 'Kirim bukti via WhatsApp admin otomatis' },
                            { num: '5', title: 'Verifikasi', desc: 'Admin mencatat donasi ke rekap digital' },
                        ].map((step) => (
                            <div
                                key={step.num}
                                className="p-4 rounded-xl border border-[#e4eaec] bg-[#fbfdfd] flex flex-col items-center text-center group hover:border-[#14bace]/40 transition"
                            >
                                <div className="size-9 rounded-full bg-[#e8f8fa] text-[#087f8c] font-bold font-poppins text-sm flex items-center justify-center mb-3 group-hover:bg-[#14bace] group-hover:text-white transition">
                                    {step.num}
                                </div>
                                <h4 className="font-poppins font-bold text-xs sm:text-sm text-[#1d2b2d]">
                                    {step.title}
                                </h4>
                                <p className="text-[11px] text-gray-500 mt-1 leading-snug font-sans">
                                    {step.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Rekening & Form Pendataan (Matching Figma 314:2951) */}
            <section className="py-12 sm:py-16 bg-[#fbfdfd]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                        {/* Kolom Kiri: Rekening Resmi & Catatan */}
                        <div className="lg:col-span-5 space-y-6">
                            <div>
                                <h3 className="font-poppins font-bold text-xl text-[#1d2b2d]">
                                    Rekening Resmi Yayasan
                                </h3>
                                <p className="text-xs text-gray-500 mt-1 font-sans">
                                    Seluruh donasi disalurkan melalui rekening resmi berbadan hukum:
                                </p>
                            </div>

                            {/* Rekening Cards */}
                            <div className="space-y-4">
                                {rekeningList.map((rek) => (
                                    <div
                                        key={rek.nomor}
                                        className="p-5 rounded-2xl bg-white border border-[#e4eaec] shadow-sm hover:shadow-md transition flex flex-col justify-between"
                                    >
                                        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                                            <div className="flex items-center gap-2.5">
                                                <CreditCard className="size-5 text-[#14bace]" />
                                                <span className="font-poppins font-bold text-sm text-[#1d2b2d]">
                                                    {rek.bank}
                                                </span>
                                            </div>
                                            <span className="text-[11px] px-2 py-0.5 rounded-md font-semibold bg-[#e8f8fa] text-[#087f8c]">
                                                {rek.icon}
                                            </span>
                                        </div>

                                        <div className="mt-4 flex items-center justify-between">
                                            <div>
                                                <p className="font-mono font-bold text-lg text-[#1d2b2d] tracking-wider">
                                                    {rek.nomor}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-0.5">
                                                    a.n. {rek.atasNama}
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => copyToClipboard(rek.nomor)}
                                                className="p-2.5 rounded-xl border border-gray-200 hover:border-[#14bace] hover:bg-[#e8f8fa] text-gray-600 hover:text-[#087f8c] transition flex items-center gap-1.5 text-xs font-semibold"
                                                title="Salin Nomor Rekening"
                                            >
                                                {copiedRekening === rek.nomor ? (
                                                    <>
                                                        <Check className="size-4 text-emerald-600" />
                                                        <span className="text-emerald-600">Disalin</span>
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
                            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/60 flex items-start gap-3">
                                <AlertCircle className="size-5 text-amber-600 shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="font-poppins font-bold text-xs text-amber-900">
                                        Pemberitahuan Rekening Resmi
                                    </h4>
                                    <p className="text-[11px] text-amber-800 leading-relaxed mt-1 font-sans">
                                        Pastikan transfer ditujukan ke rekening atas nama <strong>Yayasan Geliyat Mahdiesa Nahate</strong>. Yayasan tidak pernah menggunakan rekening atas nama perorangan.
                                    </p>
                                </div>
                            </div>

                            {/* Orang Tua Asuh Highlight */}
                            <div className="p-5 rounded-2xl bg-gradient-to-br from-[#14bace]/10 to-[#186972]/10 border border-[#14bace]/30">
                                <div className="flex items-center gap-3">
                                    <HeartHandshake className="size-6 text-[#14bace]" />
                                    <div>
                                        <h4 className="font-poppins font-bold text-sm text-[#1d2b2d]">
                                            Program Orang Tua Asuh
                                        </h4>
                                        <p className="text-xs text-gray-600 mt-0.5">
                                            Mulai dari <strong>Rp10.000 / bulan</strong> (sukarela) untuk mendukung satu anak binaan hingga jenjang SMA / kuliah.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Kolom Kanan: Formulir Konfirmasi Donasi */}
                        <div className="lg:col-span-7">
                            <div className="rounded-3xl bg-white border border-[#e4eaec] p-6 sm:p-8 shadow-sm">
                                <div className="pb-4 border-b border-gray-100">
                                    <h3 className="font-poppins font-bold text-xl text-[#1d2b2d]">
                                        Formulir Konfirmasi Donasi
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-1 font-sans">
                                        Isi form konfirmasi singkat di bawah ini untuk pengalihan langsung ke WhatsApp admin yayasan:
                                    </p>
                                </div>

                                <form onSubmit={handleKirimWhatsApp} className="mt-6 space-y-5">
                                    {/* Nama & WhatsApp */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-[#1d2b2d] font-poppins mb-1.5">
                                                Nama Lengkap / Hamba Allah *
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="Contoh: Ahmad Fauzan"
                                                value={namaDonatur}
                                                onChange={(e) => setNamaDonatur(e.target.value)}
                                                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#14bace] focus:ring-2 focus:ring-[#14bace]/20 text-sm font-sans outline-hidden"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-[#1d2b2d] font-poppins mb-1.5">
                                                Nomor WhatsApp *
                                            </label>
                                            <input
                                                type="tel"
                                                required
                                                placeholder="Contoh: 08123456789"
                                                value={noWhatsApp}
                                                onChange={(e) => setNoWhatsApp(e.target.value)}
                                                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#14bace] focus:ring-2 focus:ring-[#14bace]/20 text-sm font-sans outline-hidden"
                                            />
                                        </div>
                                    </div>

                                    {/* Jenis Donasi */}
                                    <div>
                                        <label className="block text-xs font-semibold text-[#1d2b2d] font-poppins mb-1.5">
                                            Jenis Donasi *
                                        </label>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                                            {['Donasi Umum', 'Orang Tua Asuh', 'Santunan / Sembako'].map((j) => (
                                                <button
                                                    key={j}
                                                    type="button"
                                                    onClick={() => setJenisDonasi(j)}
                                                    className={`py-2 px-3 rounded-xl text-xs font-poppins font-medium border text-center transition ${
                                                        jenisDonasi === j
                                                            ? 'border-[#14bace] bg-[#e8f8fa] text-[#087f8c] font-semibold'
                                                            : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                                                    }`}
                                                >
                                                    {j}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Pilihan Rekening Tujuan */}
                                    <div>
                                        <label className="block text-xs font-semibold text-[#1d2b2d] font-poppins mb-1.5">
                                            Rekening Tujuan Transfer *
                                        </label>
                                        <select
                                            value={rekeningTujuan}
                                            onChange={(e) => setRekeningTujuan(e.target.value)}
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#14bace] focus:ring-2 focus:ring-[#14bace]/20 text-sm font-sans outline-hidden bg-white"
                                        >
                                            <option value="BSI - 7256194821">Bank Syariah Indonesia (BSI) - 7256194821</option>
                                            <option value="BRI - 0123-01-098765-53-1">Bank Rakyat Indonesia (BRI) - 0123-01-098765-53-1</option>
                                        </select>
                                    </div>

                                    {/* Nominal Donasi */}
                                    <div>
                                        <label className="block text-xs font-semibold text-[#1d2b2d] font-poppins mb-1.5">
                                            Nominal Donasi (Rp) *
                                        </label>
                                        <div className="relative mb-2">
                                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400 font-sans">
                                                Rp
                                            </span>
                                            <input
                                                type="number"
                                                required
                                                min="10000"
                                                step="1000"
                                                placeholder="Contoh: 100000"
                                                value={nominal}
                                                onChange={(e) => setNominal(e.target.value)}
                                                className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#14bace] focus:ring-2 focus:ring-[#14bace]/20 text-sm font-sans outline-hidden"
                                            />
                                        </div>

                                        {/* Presets */}
                                        <div className="flex flex-wrap items-center gap-2">
                                            {presetNominals.map((val) => (
                                                <button
                                                    key={val}
                                                    type="button"
                                                    onClick={() => setNominal(val)}
                                                    className="px-2.5 py-1 rounded-lg text-xs font-mono font-medium border border-gray-200 hover:border-[#14bace] hover:bg-[#e8f8fa] text-gray-600 transition"
                                                >
                                                    Rp {Number(val).toLocaleString('id-ID')}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Pesan & Doa */}
                                    <div>
                                        <label className="block text-xs font-semibold text-[#1d2b2d] font-poppins mb-1.5">
                                            Pesan & Doa Kebaikan (Opsional)
                                        </label>
                                        <textarea
                                            rows={3}
                                            placeholder="Tuliskan doa atau harapan untuk adik-adik yatim binaan..."
                                            value={pesanDoa}
                                            onChange={(e) => setPesanDoa(e.target.value)}
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#14bace] focus:ring-2 focus:ring-[#14bace]/20 text-sm font-sans outline-hidden"
                                        />
                                    </div>

                                    {/* Submit Action */}
                                    <div className="pt-2">
                                        <button
                                            type="submit"
                                            className="w-full py-3.5 px-6 rounded-xl bg-[#14bace] hover:bg-[#087f8c] active:scale-[0.99] text-white font-poppins font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-[#14bace]/25 transition"
                                        >
                                            <Send className="size-4" />
                                            <span>Konfirmasi Donasi via WhatsApp</span>
                                        </button>
                                        <p className="text-[11px] text-gray-400 text-center mt-2.5 font-sans">
                                            Sistem akan membuka WhatsApp secara otomatis dengan pesan konfirmasi yang sudah terformat rapi.
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
