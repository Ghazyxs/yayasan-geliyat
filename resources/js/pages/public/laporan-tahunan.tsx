import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import {
    ChevronRight,
    FileText,
    Calendar,
    Eye,
    Download,
    ShieldCheck,
    CheckCircle2,
    Building2,
    Award,
    ExternalLink,
} from 'lucide-react';
import PublicLayout from '@/layouts/public-layout';

export interface LaporanDocumentItem {
    tahun: number;
    judul: string;
    nomor_dokumen: string | null;
    tanggal_penerbitan: string;
    tanggal_iso: string;
    jumlah_kegiatan: number;
    penandatangan: string;
    ringkasan: string | null;
    preview_url: string;
    download_url: string;
}

interface LaporanTahunanPageProps {
    selectedYear: number;
    availableYears: number[];
    laporanList: LaporanDocumentItem[];
}

export default function LaporanTahunanPage({
    selectedYear,
    availableYears = [],
    laporanList = [],
}: LaporanTahunanPageProps) {
    const [filterYear, setFilterYear] = useState<number | 'all'>('all');

    const filteredReports =
        filterYear === 'all'
            ? laporanList
            : laporanList.filter((doc) => doc.tahun === filterYear);

    return (
        <PublicLayout>
            <Head title="Laporan Kegiatan Tahunan - Yayasan Geliyat" />

            {/* Banner Header Formal */}
            <div className="border-b border-[#e4eaec] bg-gradient-to-r from-[#d1f6fa]/60 via-[#e8f8fa] to-[#f7fcfd] py-10 sm:py-14">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl">
                        <h1 className="font-poppins text-3xl font-extrabold tracking-tight text-[#1d2b2d] sm:text-4xl">
                            Laporan Kegiatan Tahunan Yayasan Geliyat
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
                                href="/profil"
                                className="transition-colors hover:text-[#14bace]"
                            >
                                Profil
                            </Link>
                            <ChevronRight className="size-4 text-slate-400" />
                            <span className="font-semibold text-[#087f8c]">
                                Laporan Tahunan
                            </span>
                        </nav>

                        <p className="mt-3 font-sans text-sm leading-relaxed text-slate-600 sm:text-base">
                            Arsip dokumen resmi laporan pertanggungjawaban kegiatan, program kerja, dan pembinaan anak yatim yang disusun secara formal dan berkala oleh pengurus Yayasan Geliyat Mahdiesa Nahate.
                        </p>
                    </div>
                </div>
            </div>

            {/* Konten Arsip Dokumen Laporan */}
            <main className="bg-[#f8fafb] py-10 sm:py-16">
                <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                    {/* Filter Pilihan Tahun Sederhana */}
                    <div className="mb-8 flex flex-col gap-3 rounded-2xl border border-[#e4eaec] bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between sm:p-5">
                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 sm:text-sm">
                            <Calendar className="size-4 text-[#087f8c]" />
                            <span>Pilih Tahun Laporan:</span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <button
                                type="button"
                                onClick={() => setFilterYear('all')}
                                className={`rounded-xl px-4 py-2 font-poppins text-xs font-bold transition ${
                                    filterYear === 'all'
                                        ? 'bg-[#087f8c] text-white shadow-xs'
                                        : 'border border-[#e4eaec] bg-slate-50 text-slate-600 hover:bg-white hover:text-[#087f8c]'
                                }`}
                            >
                                Semua Tahun ({laporanList.length})
                            </button>
                            {availableYears.map((year) => (
                                <button
                                    key={year}
                                    type="button"
                                    onClick={() => setFilterYear(year)}
                                    className={`rounded-xl px-4 py-2 font-poppins text-xs font-bold transition ${
                                        filterYear === year
                                            ? 'bg-[#087f8c] text-white shadow-xs'
                                            : 'border border-[#e4eaec] bg-slate-50 text-slate-600 hover:bg-white hover:text-[#087f8c]'
                                    }`}
                                >
                                    Tahun {year}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Daftar Dokumen Laporan Resmi */}
                    {filteredReports.length > 0 ? (
                        <div className="space-y-6">
                            {filteredReports.map((doc) => (
                                <article
                                    key={doc.tahun}
                                    className="group relative rounded-3xl border border-[#e4eaec] bg-white p-6 shadow-xs transition hover:border-[#14bace]/50 hover:shadow-md sm:p-8"
                                >
                                    <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                                        {/* Kolom Kiri: Ikon & Informasi Dokumen */}
                                        <div className="flex items-start gap-4">
                                            <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 ring-1 ring-rose-100">
                                                <FileText className="size-7" />
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className="rounded-full bg-[#e8f8fa] px-2.5 py-0.5 font-poppins text-[11px] font-bold text-[#087f8c]">
                                                        Tahun {doc.tahun}
                                                    </span>
                                                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 font-poppins text-[11px] font-medium text-slate-600">
                                                        Dokumen Resmi A4
                                                    </span>
                                                    {doc.nomor_dokumen && (
                                                        <span className="font-mono text-[11px] text-slate-400">
                                                            No: {doc.nomor_dokumen}
                                                        </span>
                                                    )}
                                                </div>

                                                <h2 className="font-poppins text-lg font-bold text-slate-800 transition group-hover:text-[#087f8c] sm:text-xl">
                                                    {doc.judul}
                                                </h2>

                                                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                                                    <div className="flex items-center gap-1.5">
                                                        <Calendar className="size-3.5 text-slate-400" />
                                                        <span>Penerbitan: {doc.tanggal_penerbitan}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <Building2 className="size-3.5 text-slate-400" />
                                                        <span>{doc.jumlah_kegiatan} Kegiatan Terlampir</span>
                                                    </div>
                                                </div>

                                                {doc.ringkasan && (
                                                    <p className="pt-1 font-sans text-xs leading-relaxed text-slate-600 sm:text-sm line-clamp-3">
                                                        {doc.ringkasan}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Kolom Kanan: Tombol Aksi PDF */}
                                        <div className="flex shrink-0 flex-row gap-2.5 sm:flex-col sm:items-end">
                                            <a
                                                href={doc.preview_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#087f8c] bg-white px-4 py-2.5 font-poppins text-xs font-bold text-[#087f8c] shadow-xs transition hover:bg-[#e8f8fa] active:scale-95 sm:w-36"
                                            >
                                                <Eye className="size-4" />
                                                <span>Lihat PDF</span>
                                            </a>

                                            <a
                                                href={doc.download_url}
                                                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#087f8c] px-4 py-2.5 font-poppins text-xs font-bold text-white shadow-xs transition hover:bg-[#066570] active:scale-95 sm:w-36"
                                            >
                                                <Download className="size-4" />
                                                <span>Unduh PDF</span>
                                            </a>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-xs">
                            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                                <FileText className="size-7" />
                            </div>
                            <h3 className="mt-4 font-poppins text-lg font-bold text-slate-800">
                                Belum Ada Laporan Terbit
                            </h3>
                            <p className="mt-1 font-sans text-xs text-slate-500">
                                Dokumen laporan kegiatan untuk tahun yang dipilih belum diterbitkan.
                            </p>
                        </div>
                    )}

                    {/* Informasi Pengesahan Dokumen */}
                    <div className="mt-10 rounded-2xl border border-[#cbebf0] bg-[#f7fcfd] p-5 text-center sm:text-left">
                        <div className="flex flex-col items-center gap-3 sm:flex-row">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#e8f8fa] text-[#087f8c]">
                                <CheckCircle2 className="size-5" />
                            </div>
                            <div className="text-xs text-slate-600 sm:text-sm">
                                <span className="font-poppins font-bold text-[#087f8c]">
                                    Autentikasi Dokumen:
                                </span>{' '}
                                Setiap dokumen Laporan Kegiatan Tahunan memuat rangkuman lengkap, bukti dokumentasi visual, dan pengesahan resmi pengurus Yayasan Geliyat Mahdiesa Nahate.
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </PublicLayout>
    );
}

