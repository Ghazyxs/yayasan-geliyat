import { useState, useMemo } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
    Calendar,
    ChevronRight,
    MapPin,
    ArrowRight,
    Layers,
    Image as ImageIcon,
    Building2,
    TrendingUp,
    Filter,
    FileSpreadsheet,
    Printer,
    ExternalLink,
    Sparkles,
    CheckCircle2,
    Eye,
    X,
    Award,
    Clock,
} from 'lucide-react';
import PublicLayout from '@/layouts/public-layout';

export interface DokumentasiItem {
    url: string;
    caption: string;
}

export interface BidangRef {
    id: number;
    kode: string;
    nama: string;
}

export interface RekapKegiatanItem {
    id: number;
    judul: string;
    kategori: string;
    ringkasan: string;
    deskripsi: string;
    isi_berita: string;
    lokasi: string;
    tanggal_kegiatan: string;
    tanggal_iso: string | null;
    gambar: string;
    dokumentasi: DokumentasiItem[];
    bidang: BidangRef | null;
    penulis: string;
    bulan_angka: number;
    bulan_nama: string;
    kuartal: string;
    kuartal_nama: string;
}

export interface BidangStat {
    id: number | null;
    nama: string;
    kode: string;
    total: number;
    persentase: number;
}

export interface MonthlyStat {
    bulan: number;
    nama_bulan: string;
    singkatan: string;
    total: number;
}

export interface QuarterStat {
    nama: string;
    periode: string;
    total: number;
}

export interface RekapStats {
    totalKegiatan: number;
    totalDokumentasi: number;
    bidangAktifCount: number;
    bulanTeraktif: MonthlyStat | null;
    bidangStats: BidangStat[];
    monthlyDistribution: MonthlyStat[];
    quarterDistribution: Record<string, QuarterStat>;
}

interface RekapKegiatanPageProps {
    selectedYear: number;
    availableYears: number[];
    kegiatanList: RekapKegiatanItem[];
    stats: RekapStats;
}

const BIDANG_COLORS: Record<string, { bg: string; text: string; border: string; bar: string }> = {
    pendidikan: {
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        border: 'border-blue-200',
        bar: 'bg-blue-500',
    },
    kemanusiaan: {
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        border: 'border-emerald-200',
        bar: 'bg-emerald-500',
    },
    keagamaan: {
        bg: 'bg-purple-50',
        text: 'text-purple-700',
        border: 'border-purple-200',
        bar: 'bg-purple-500',
    },
    ekonomi: {
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        border: 'border-amber-200',
        bar: 'bg-amber-500',
    },
    umum: {
        bg: 'bg-cyan-50',
        text: 'text-[#087f8c]',
        border: 'border-cyan-200',
        bar: 'bg-[#14bace]',
    },
};

export default function RekapKegiatanPage({
    selectedYear,
    availableYears = [],
    kegiatanList = [],
    stats,
}: RekapKegiatanPageProps) {
    const [selectedBidangFilter, setSelectedBidangFilter] = useState<string>('all');
    const [selectedQuarterFilter, setSelectedQuarterFilter] = useState<string>('all');
    const [previewPhoto, setPreviewPhoto] = useState<{ url: string; caption?: string } | null>(null);

    // Ganti tahun laporan
    const handleYearChange = (year: number) => {
        if (year === selectedYear) return;
        router.get(
            '/rekap-kegiatan',
            { tahun: year },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    // Filter kegiatan di frontend berdasarkan bidang dan kuartal
    const filteredKegiatan = useMemo(() => {
        return kegiatanList.filter((item) => {
            const matchesBidang =
                selectedBidangFilter === 'all' ||
                (selectedBidangFilter === 'umum' && !item.bidang) ||
                (item.bidang && item.bidang.kode === selectedBidangFilter);

            const matchesQuarter =
                selectedQuarterFilter === 'all' || item.kuartal === selectedQuarterFilter;

            return matchesBidang && matchesQuarter;
        });
    }, [kegiatanList, selectedBidangFilter, selectedQuarterFilter]);

    // Nilai maksimum untuk visualisasi chart bulanan
    const maxMonthlyCount = useMemo(() => {
        const counts = stats.monthlyDistribution.map((m) => m.total);
        return Math.max(...counts, 1);
    }, [stats.monthlyDistribution]);

    const handlePrint = () => {
        window.print();
    };

    return (
        <PublicLayout>
            <Head title={`Rekap Kegiatan Tahunan ${selectedYear} - Yayasan Geliyat`} />

            {/* Header Hero Laporan Tahunan */}
            <div className="border-b border-[#e4eaec] bg-gradient-to-r from-[#d1f6fa]/70 via-[#e8f8fa] to-[#f4fbfc] py-10 sm:py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#14bace]/40 bg-white/80 px-3 py-1 font-poppins text-xs font-bold text-[#087f8c] shadow-xs backdrop-blur-xs">
                                    <Sparkles className="size-3.5 text-[#14bace]" />
                                    Annual Activity Report
                                </span>
                                <span className="rounded-full bg-[#186972] px-3 py-1 font-poppins text-xs font-bold text-white shadow-xs">
                                    Tahun {selectedYear}
                                </span>
                            </div>
                            <h1 className="mt-3 font-poppins text-3xl font-extrabold tracking-tight text-[#1d2b2d] sm:text-4xl lg:text-5xl">
                                Rekap Kegiatan Tahunan
                            </h1>
                            <nav className="mt-2 flex items-center gap-2 font-poppins text-sm text-slate-500">
                                <Link
                                    href="/"
                                    className="transition-colors hover:text-[#14bace]"
                                >
                                    Beranda
                                </Link>
                                <ChevronRight className="size-4 text-slate-400" />
                                <Link
                                    href="/kegiatan"
                                    className="transition-colors hover:text-[#14bace]"
                                >
                                    Kegiatan
                                </Link>
                                <ChevronRight className="size-4 text-slate-400" />
                                <span className="font-semibold text-[#087f8c]">
                                    Laporan Tahunan {selectedYear}
                                </span>
                            </nav>
                            <p className="mt-3 max-w-3xl font-sans text-sm leading-relaxed text-slate-600 sm:text-base">
                                Dokumentasi resmi, rekapitulasi data riil, dan transparansi pelaksanaan program pembinaan serta santunan bagi 420 anak binaan yatim Yayasan Geliyat sepanjang tahun {selectedYear}.
                            </p>
                        </div>

                        {/* Aksi: Print & Navigasi Cepat */}
                        <div className="flex flex-wrap items-center gap-3">
                            <button
                                type="button"
                                onClick={handlePrint}
                                className="inline-flex items-center gap-2 rounded-xl border border-[#cbebf0] bg-white px-4 py-2.5 font-poppins text-xs font-semibold text-slate-700 shadow-xs transition hover:border-[#14bace] hover:bg-[#f7fcfd] hover:text-[#087f8c] print:hidden"
                                title="Cetak atau simpan sebagai PDF"
                            >
                                <Printer className="size-4 text-[#14bace]" />
                                <span>Cetak Laporan</span>
                            </button>
                            <Link
                                href="/kegiatan"
                                className="inline-flex items-center gap-2 rounded-xl bg-[#14bace] px-4 py-2.5 font-poppins text-xs font-bold text-white shadow-xs transition hover:bg-[#087f8c] print:hidden"
                            >
                                <span>Semua Kegiatan</span>
                                <ArrowRight className="size-3.5" />
                            </Link>
                        </div>
                    </div>

                    {/* Filter Tab Pemilihan Tahun */}
                    <div className="mt-8 border-t border-[#cbebf0]/80 pt-6 print:hidden">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-2">
                                <Calendar className="size-4 text-[#087f8c]" />
                                <span className="font-poppins text-xs font-bold uppercase tracking-wider text-slate-700">
                                    Pilih Tahun Laporan:
                                </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                {availableYears.map((year) => {
                                    const isCurrent = year === selectedYear;
                                    return (
                                        <button
                                            key={year}
                                            type="button"
                                            onClick={() => handleYearChange(year)}
                                            className={`rounded-xl px-4 py-2 font-poppins text-xs font-bold transition-all sm:text-sm ${
                                                isCurrent
                                                    ? 'bg-[#087f8c] text-white shadow-md shadow-[#087f8c]/20 ring-2 ring-[#087f8c]/30'
                                                    : 'border border-[#e4eaec] bg-white text-slate-600 hover:border-[#14bace] hover:bg-[#f7fcfd] hover:text-[#087f8c]'
                                            }`}
                                        >
                                            Tahun {year}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Konten Utama */}
            <main className="bg-[#f8fafb] py-10 sm:py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Ringkasan Statistik Utama (Executive KPI Cards) */}
                    <section className="mb-10">
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {/* KPI 1: Total Kegiatan */}
                            <div className="relative overflow-hidden rounded-3xl border border-[#e4eaec] bg-white p-5 shadow-xs transition hover:border-[#14bace]/40 hover:shadow-md sm:p-6">
                                <div className="flex items-center justify-between">
                                    <span className="font-poppins text-xs font-semibold text-slate-500">
                                        Total Kegiatan
                                    </span>
                                    <div className="flex size-10 items-center justify-center rounded-2xl bg-[#e8f8fa] text-[#087f8c]">
                                        <Calendar className="size-5" />
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <span className="font-poppins text-3xl font-extrabold text-slate-800 sm:text-4xl">
                                        {stats.totalKegiatan}
                                    </span>
                                    <span className="ml-1.5 font-sans text-xs text-slate-500">
                                        program terlaksana
                                    </span>
                                </div>
                                <p className="mt-2 text-xs text-slate-400">
                                    Seluruhnya tercatat aktif di tahun {selectedYear}
                                </p>
                            </div>

                            {/* KPI 2: Bidang Aktif */}
                            <div className="relative overflow-hidden rounded-3xl border border-[#e4eaec] bg-white p-5 shadow-xs transition hover:border-[#14bace]/40 hover:shadow-md sm:p-6">
                                <div className="flex items-center justify-between">
                                    <span className="font-poppins text-xs font-semibold text-slate-500">
                                        Bidang Berkontribusi
                                    </span>
                                    <div className="flex size-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                                        <Building2 className="size-5" />
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <span className="font-poppins text-3xl font-extrabold text-slate-800 sm:text-4xl">
                                        {stats.bidangAktifCount}
                                    </span>
                                    <span className="ml-1.5 font-sans text-xs text-slate-500">
                                        divisi binaan
                                    </span>
                                </div>
                                <p className="mt-2 text-xs text-slate-400">
                                    Pendidikan, Kemanusiaan, Keagamaan, & Ekonomi
                                </p>
                            </div>

                            {/* KPI 3: Dokumentasi Foto */}
                            <div className="relative overflow-hidden rounded-3xl border border-[#e4eaec] bg-white p-5 shadow-xs transition hover:border-[#14bace]/40 hover:shadow-md sm:p-6">
                                <div className="flex items-center justify-between">
                                    <span className="font-poppins text-xs font-semibold text-slate-500">
                                        Dokumentasi Visual
                                    </span>
                                    <div className="flex size-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                                        <ImageIcon className="size-5" />
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <span className="font-poppins text-3xl font-extrabold text-slate-800 sm:text-4xl">
                                        {stats.totalDokumentasi}
                                    </span>
                                    <span className="ml-1.5 font-sans text-xs text-slate-500">
                                        arsip foto resmi
                                    </span>
                                </div>
                                <p className="mt-2 text-xs text-slate-400">
                                    Bukti nyata pelaksanaan di lapangan
                                </p>
                            </div>

                            {/* KPI 4: Periode Paling Produktif */}
                            <div className="relative overflow-hidden rounded-3xl border border-[#e4eaec] bg-white p-5 shadow-xs transition hover:border-[#14bace]/40 hover:shadow-md sm:p-6">
                                <div className="flex items-center justify-between">
                                    <span className="font-poppins text-xs font-semibold text-slate-500">
                                        Periode Teraktif
                                    </span>
                                    <div className="flex size-10 items-center justify-center rounded-2xl bg-purple-50 text-purple-700">
                                        <TrendingUp className="size-5" />
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <span className="font-poppins text-2xl font-extrabold text-slate-800 sm:text-3xl">
                                        {stats.bulanTeraktif ? stats.bulanTeraktif.nama_bulan : '-'}
                                    </span>
                                </div>
                                <p className="mt-2 text-xs text-slate-400">
                                    {stats.bulanTeraktif
                                        ? `${stats.bulanTeraktif.total} kegiatan terselenggara`
                                        : 'Belum ada data'}
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Bagian Statistik Visual & Analisis Distribusi */}
                    <section className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-12">
                        {/* Visual 1: Distribusi Bulanan (Jan - Des) */}
                        <div className="rounded-3xl border border-[#e4eaec] bg-white p-6 shadow-xs sm:p-8 lg:col-span-7">
                            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                                <div>
                                    <span className="font-poppins text-xs font-bold uppercase tracking-wider text-[#14bace]">
                                        Ritme Pelaksanaan
                                    </span>
                                    <h3 className="font-poppins text-lg font-bold text-slate-800 sm:text-xl">
                                        Distribusi Kegiatan per Bulan ({selectedYear})
                                    </h3>
                                </div>
                                <span className="rounded-full bg-[#e8f8fa] px-3 py-1 font-poppins text-xs font-bold text-[#087f8c]">
                                    Total 12 Bulan
                                </span>
                            </div>
                            <p className="mt-1 font-sans text-xs text-slate-500">
                                Visualisasi frekuensi kegiatan yayasan yang terlaksana sepanjang bulan Januari hingga Desember.
                            </p>

                            {/* Bar Chart Bulanan */}
                            <div className="mt-8 grid grid-cols-6 gap-2 sm:grid-cols-12 sm:gap-2.5">
                                {stats.monthlyDistribution.map((item) => {
                                    const heightPct =
                                        item.total > 0
                                            ? Math.max(18, Math.round((item.total / maxMonthlyCount) * 100))
                                            : 6;
                                    const hasActivity = item.total > 0;

                                    return (
                                        <div
                                            key={item.bulan}
                                            className="group flex flex-col items-center justify-end"
                                        >
                                            <span
                                                className={`mb-1 font-poppins text-[10px] font-bold transition ${
                                                    hasActivity
                                                        ? 'text-[#087f8c] opacity-100'
                                                        : 'text-slate-300 opacity-0 group-hover:opacity-100'
                                                }`}
                                            >
                                                {item.total}
                                            </span>
                                            <div className="relative flex h-28 w-full items-end justify-center rounded-xl bg-slate-50 p-1 transition group-hover:bg-[#e8f8fa]/60">
                                                <div
                                                    style={{ height: `${heightPct}%` }}
                                                    className={`w-full rounded-lg transition-all duration-300 ${
                                                        hasActivity
                                                            ? 'bg-gradient-to-t from-[#087f8c] to-[#14bace] shadow-xs'
                                                            : 'bg-slate-200'
                                                    }`}
                                                />
                                            </div>
                                            <span
                                                className={`mt-2 font-poppins text-[11px] font-medium transition ${
                                                    hasActivity
                                                        ? 'font-bold text-slate-800'
                                                        : 'text-slate-400'
                                                }`}
                                            >
                                                {item.singkatan}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Ringkasan Kuartal */}
                            <div className="mt-6 grid grid-cols-2 gap-3 border-t border-slate-100 pt-5 sm:grid-cols-4">
                                {Object.entries(stats.quarterDistribution).map(([qKey, qVal]) => (
                                    <div
                                        key={qKey}
                                        className="rounded-2xl border border-slate-100 bg-[#fbfdfd] p-3 text-center"
                                    >
                                        <span className="font-poppins text-[11px] font-bold text-slate-400 uppercase">
                                            {qKey}
                                        </span>
                                        <div className="font-poppins text-lg font-bold text-slate-800">
                                            {qVal.total}
                                        </div>
                                        <span className="block text-[10px] text-slate-500">
                                            {qVal.periode}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Visual 2: Kontribusi per Bidang */}
                        <div className="flex flex-col justify-between rounded-3xl border border-[#e4eaec] bg-white p-6 shadow-xs sm:p-8 lg:col-span-5">
                            <div>
                                <span className="font-poppins text-xs font-bold uppercase tracking-wider text-[#14bace]">
                                    Sinergi Program
                                </span>
                                <h3 className="font-poppins text-lg font-bold text-slate-800 sm:text-xl">
                                    Kontribusi per Bidang
                                </h3>
                                <p className="mt-1 font-sans text-xs text-slate-500">
                                    Persentase kontribusi pelaksanaan kegiatan berdasarkan bidang kerja yayasan:
                                </p>

                                <div className="mt-6 space-y-4">
                                    {stats.bidangStats.map((item) => {
                                        const theme =
                                            BIDANG_COLORS[item.kode.toLowerCase()] ??
                                            BIDANG_COLORS.umum;

                                        return (
                                            <div
                                                key={item.kode}
                                                className="rounded-2xl border border-slate-100 bg-[#fbfdfd] p-3.5 transition hover:border-[#14bace]/30"
                                            >
                                                <div className="flex items-center justify-between text-xs sm:text-sm">
                                                    <span className="font-poppins font-bold text-slate-800">
                                                        {item.nama}
                                                    </span>
                                                    <div className="flex items-center gap-1.5 font-poppins">
                                                        <span className="font-bold text-slate-800">
                                                            {item.total} kegiatan
                                                        </span>
                                                        <span className="text-[11px] text-slate-400">
                                                            ({item.persentase}%)
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                                                    <div
                                                        style={{ width: `${item.persentase}%` }}
                                                        className={`h-full rounded-full transition-all duration-500 ${theme.bar}`}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="mt-6 rounded-2xl border border-[#cbebf0] bg-[#f7fcfd] p-4 text-xs text-slate-600">
                                <span className="font-poppins font-bold text-[#087f8c]">
                                    Prinsip Transparansi:
                                </span>{' '}
                                Seluruh data kegiatan sinkron secara langsung dengan sistem data admin tanpa manipulasi angka.
                            </div>
                        </div>
                    </section>

                    {/* Filter Bar & Kontrol Tampilan Daftar Kegiatan */}
                    <section className="mb-8">
                        <div className="flex flex-col gap-4 rounded-3xl border border-[#e4eaec] bg-white p-5 shadow-xs sm:flex-row sm:items-center sm:justify-between sm:p-6 print:hidden">
                            <div>
                                <h3 className="font-poppins text-base font-bold text-slate-800 sm:text-lg">
                                    Daftar Laporan Kegiatan ({filteredKegiatan.length} dari {stats.totalKegiatan})
                                </h3>
                                <p className="font-sans text-xs text-slate-500">
                                    Rincian kegiatan, tanggal pelaksanaan, bidang, dan dokumentasi visual:
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-2.5">
                                {/* Filter Kuartal */}
                                <select
                                    value={selectedQuarterFilter}
                                    onChange={(e) => setSelectedQuarterFilter(e.target.value)}
                                    className="rounded-xl border border-[#e4eaec] bg-[#fbfdfd] px-3.5 py-2 font-poppins text-xs font-semibold text-slate-700 outline-hidden transition focus:border-[#14bace] focus:ring-2 focus:ring-[#14bace]/20"
                                >
                                    <option value="all">Semua Kuartal</option>
                                    <option value="Q1">Kuartal 1 (Jan - Mar)</option>
                                    <option value="Q2">Kuartal 2 (Apr - Jun)</option>
                                    <option value="Q3">Kuartal 3 (Jul - Sep)</option>
                                    <option value="Q4">Kuartal 4 (Okt - Des)</option>
                                </select>

                                {/* Filter Bidang */}
                                <select
                                    value={selectedBidangFilter}
                                    onChange={(e) => setSelectedBidangFilter(e.target.value)}
                                    className="rounded-xl border border-[#e4eaec] bg-[#fbfdfd] px-3.5 py-2 font-poppins text-xs font-semibold text-slate-700 outline-hidden transition focus:border-[#14bace] focus:ring-2 focus:ring-[#14bace]/20"
                                >
                                    <option value="all">Semua Bidang</option>
                                    <option value="pendidikan">Bidang Pendidikan</option>
                                    <option value="kemanusiaan">Bidang Kemanusiaan</option>
                                    <option value="keagamaan">Bidang Keagamaan</option>
                                    <option value="ekonomi">Bidang Ekonomi</option>
                                    <option value="umum">Umum / Lintas Bidang</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    {/* Empty State Jika Tidak Ada Kegiatan Pada Tahun / Filter */}
                    {filteredKegiatan.length === 0 && (
                        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-xs">
                            <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-[#e8f8fa] text-[#087f8c]">
                                <Calendar className="size-8" />
                            </div>
                            <h3 className="mt-4 font-poppins text-lg font-bold text-slate-800 sm:text-xl">
                                Belum Ada Kegiatan Tercatat
                            </h3>
                            <p className="mx-auto mt-2 max-w-md font-sans text-xs leading-relaxed text-slate-500 sm:text-sm">
                                Tidak ditemukan data kegiatan pada tahun {selectedYear}{' '}
                                {selectedBidangFilter !== 'all' || selectedQuarterFilter !== 'all'
                                    ? 'dengan filter yang Anda pilih. Coba sesuaikan filter pencarian.'
                                    : 'dalam database yayasan.'}
                            </p>
                            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                                {(selectedBidangFilter !== 'all' || selectedQuarterFilter !== 'all') && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSelectedBidangFilter('all');
                                            setSelectedQuarterFilter('all');
                                        }}
                                        className="rounded-xl bg-[#e8f8fa] px-4 py-2 font-poppins text-xs font-bold text-[#087f8c] transition hover:bg-[#d5f3f7]"
                                    >
                                        Reset Filter Kategori
                                    </button>
                                )}
                                {availableYears.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => handleYearChange(availableYears[0])}
                                        className="rounded-xl bg-[#087f8c] px-4 py-2 font-poppins text-xs font-bold text-white transition hover:bg-[#066570]"
                                    >
                                        Buka Laporan Tahun {availableYears[0]}
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Timeline & Daftar Kegiatan Annual Report */}
                    {filteredKegiatan.length > 0 && (
                        <div className="space-y-6">
                            {filteredKegiatan.map((item, index) => {
                                const bidangKode = item.bidang?.kode?.toLowerCase() ?? 'umum';
                                const theme = BIDANG_COLORS[bidangKode] ?? BIDANG_COLORS.umum;

                                return (
                                    <article
                                        key={item.id}
                                        className="group relative overflow-hidden rounded-3xl border border-[#e4eaec] bg-white p-6 shadow-xs transition hover:border-[#14bace]/40 hover:shadow-md sm:p-8"
                                    >
                                        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
                                            {/* Kolom Kiri: Foto Utama Kegiatan */}
                                            <div className="lg:col-span-4">
                                                <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl bg-slate-100">
                                                    <img
                                                        src={item.gambar}
                                                        alt={item.judul}
                                                        className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                        loading="lazy"
                                                    />
                                                    <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
                                                        <span
                                                            className={`inline-flex items-center rounded-full border px-2.5 py-1 font-poppins text-[10px] font-bold uppercase tracking-wider backdrop-blur-md ${theme.bg} ${theme.text} ${theme.border}`}
                                                        >
                                                            {item.bidang ? item.bidang.nama : 'Umum'}
                                                        </span>
                                                        <span className="inline-flex items-center rounded-full bg-black/60 px-2 py-0.5 font-poppins text-[10px] font-semibold text-white backdrop-blur-md">
                                                            {item.kuartal}
                                                        </span>
                                                    </div>

                                                    {/* Tombol Preview Fullscreen */}
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setPreviewPhoto({
                                                                url: item.gambar,
                                                                caption: item.judul,
                                                            })
                                                        }
                                                        className="absolute right-3 bottom-3 flex size-8 items-center justify-center rounded-full bg-white/90 text-slate-700 opacity-0 shadow-sm transition group-hover:opacity-100 hover:bg-white hover:text-[#087f8c]"
                                                        title="Perbesar gambar"
                                                    >
                                                        <Eye className="size-4" />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Kolom Kanan: Rincian Laporan Kegiatan */}
                                            <div className="flex flex-col justify-between lg:col-span-8">
                                                <div>
                                                    {/* Meta: Tanggal & Lokasi */}
                                                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                                                        <div className="flex items-center gap-1.5 font-medium text-[#087f8c]">
                                                            <Calendar className="size-4 text-[#14bace]" />
                                                            <span>{item.tanggal_kegiatan}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5 text-slate-500">
                                                            <MapPin className="size-3.5 text-slate-400" />
                                                            <span>{item.lokasi}</span>
                                                        </div>
                                                        <div className="ml-auto font-mono text-[11px] text-slate-400">
                                                            #{String(index + 1).padStart(2, '0')}
                                                        </div>
                                                    </div>

                                                    {/* Judul Kegiatan */}
                                                    <h4 className="mt-2.5 font-poppins text-lg font-bold text-slate-800 sm:text-xl">
                                                        <Link
                                                            href={`/kegiatan/${item.id}`}
                                                            className="transition hover:text-[#087f8c]"
                                                        >
                                                            {item.judul}
                                                        </Link>
                                                    </h4>

                                                    {/* Ringkasan Eksekutif Kegiatan */}
                                                    <p className="mt-2 font-sans text-xs leading-relaxed text-slate-600 sm:text-sm">
                                                        {item.ringkasan || item.deskripsi}
                                                    </p>

                                                    {/* Strip Dokumentasi Visual Kegiatan */}
                                                    {item.dokumentasi && item.dokumentasi.length > 0 && (
                                                        <div className="mt-4 border-t border-slate-100 pt-3">
                                                            <div className="mb-2 flex items-center justify-between">
                                                                <span className="flex items-center gap-1.5 font-poppins text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                                                    <ImageIcon className="size-3.5 text-[#14bace]" />
                                                                    Galeri Dokumentasi ({item.dokumentasi.length} Foto)
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                                                                {item.dokumentasi.map((doc, docIdx) => (
                                                                    <button
                                                                        key={docIdx}
                                                                        type="button"
                                                                        onClick={() =>
                                                                            setPreviewPhoto({
                                                                                url: doc.url,
                                                                                caption: doc.caption || item.judul,
                                                                            })
                                                                        }
                                                                        className="group/thumb relative size-14 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 transition hover:border-[#14bace] hover:opacity-90 sm:size-16"
                                                                        title={doc.caption || 'Klik untuk perbesar'}
                                                                    >
                                                                        <img
                                                                            src={doc.url}
                                                                            alt={doc.caption}
                                                                            className="size-full object-cover transition duration-300 group-hover/thumb:scale-110"
                                                                            loading="lazy"
                                                                        />
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Footer Kartu Kegiatan */}
                                                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                                                    <span className="font-sans text-[11px] text-slate-400">
                                                        Dipublikasikan oleh{' '}
                                                        <span className="font-semibold text-slate-600">
                                                            {item.penulis}
                                                        </span>
                                                    </span>
                                                    <Link
                                                        href={`/kegiatan/${item.id}`}
                                                        className="inline-flex items-center gap-1.5 font-poppins text-xs font-bold text-[#087f8c] transition hover:text-[#14bace] print:hidden"
                                                    >
                                                        <span>Baca Laporan Lengkap</span>
                                                        <ArrowRight className="size-3.5" />
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    )}

                    {/* Section Penutup Komitmen Akuntabilitas */}
                    <section className="mt-12 rounded-3xl border border-[#cbebf0] bg-gradient-to-br from-[#f7fcfd] via-white to-[#e8f8fa]/60 p-6 shadow-xs sm:p-10">
                        <div className="flex flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-left">
                            <div className="max-w-2xl">
                                <span className="font-poppins text-xs font-bold tracking-wider text-[#14bace] uppercase">
                                    Amanah & Transparansi Publik
                                </span>
                                <h3 className="mt-1 font-poppins text-xl font-bold text-slate-800 sm:text-2xl">
                                    Dukung Keberlanjutan Program Tahun Depan
                                </h3>
                                <p className="mt-2 font-sans text-xs leading-relaxed text-slate-600 sm:text-sm">
                                    Setiap rupiah donasi dan dukungan yang Anda titipkan telah menjadi senyum serta masa depan cerah bagi adik-adik yatim di Ujungberung, Kota Bandung. Mari bersama merajut lebih banyak kebaikan.
                                </p>
                            </div>
                            <div className="shrink-0">
                                <Link
                                    href="/donasi"
                                    className="inline-flex items-center gap-2 rounded-2xl bg-[#087f8c] px-6 py-3.5 font-poppins text-sm font-bold text-white shadow-md shadow-[#087f8c]/20 transition hover:bg-[#066570] active:scale-95"
                                >
                                    <span>Salurkan Donasi</span>
                                    <ArrowRight className="size-4" />
                                </Link>
                            </div>
                        </div>
                    </section>
                </div>
            </main>

            {/* Lightbox Modal Pratinjau Foto Dokumentasi */}
            {previewPhoto && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs animate-in fade-in duration-200"
                    onClick={() => setPreviewPhoto(null)}
                >
                    <div
                        className="relative max-h-[90vh] max-w-4xl overflow-hidden rounded-2xl bg-black p-2 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            type="button"
                            onClick={() => setPreviewPhoto(null)}
                            className="absolute top-4 right-4 z-10 flex size-9 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black"
                            title="Tutup pratinjau"
                        >
                            <X className="size-5" />
                        </button>
                        <img
                            src={previewPhoto.url}
                            alt={previewPhoto.caption || 'Dokumentasi'}
                            className="max-h-[80vh] w-auto rounded-xl object-contain"
                        />
                        {previewPhoto.caption && (
                            <p className="mt-2 px-3 py-1 text-center font-sans text-xs text-slate-300">
                                {previewPhoto.caption}
                            </p>
                        )}
                    </div>
                </div>
            )}
        </PublicLayout>
    );
}

