import { Head, Link } from '@inertiajs/react';
import {
    BookOpen,
    Heart,
    Sparkles,
    Users,
    ChevronRight,
    ArrowRight,
    CheckCircle2,
    type LucideIcon,
} from 'lucide-react';
import PublicLayout from '@/layouts/public-layout';

export interface ProgramKerjaItem {
    nama: string;
    deskripsi: string;
    jadwal: string;
    sasaran: string;
}

export interface InformasiTambahanBidang {
    sasaran_utama: string;
    lokasi_pelaksanaan: string;
    frekuensi_kegiatan: string;
    koordinator_unit: string;
}

export interface BidangItem {
    id: number;
    kode: string;
    nama: string;
    subjudul: string;
    deskripsi: string;
    deskripsi_lengkap: string;
    gambar: string;
    tujuan: string[];
    program_kerja: ProgramKerjaItem[];
    informasi_tambahan: InformasiTambahanBidang;
    kegiatan_count: number;
    anak_yatim_count: number;
}

interface BidangPageProps {
    bidangList: BidangItem[];
}

export function getBidangIcon(kode: string): LucideIcon {
    switch (kode) {
        case 'pendidikan':
            return BookOpen;
        case 'kemanusiaan':
            return Heart;
        case 'ekonomi':
            return Sparkles;
        case 'keagamaan':
            return Users;
        default:
            return BookOpen;
    }
}

export default function BidangPage({ bidangList = [] }: BidangPageProps) {
    return (
        <PublicLayout>
            <Head title="Bidang Yayasan - Empat Pilar Program Geliyat" />

            {/* Banner Header with Breadcrumbs */}
            <div className="border-b border-[#e4eaec] bg-gradient-to-r from-[#d1f6fa]/60 via-[#e8f8fa] to-[#f7fcfd] py-10 sm:py-14">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <h1 className="font-poppins text-3xl font-bold text-[#1d2b2d] sm:text-4xl">
                        Bidang Yayasan
                    </h1>
                    <nav className="mt-2 flex items-center gap-2 font-poppins text-sm text-gray-500">
                        <Link
                            href="/"
                            prefetch={false}
                            className="transition-colors hover:text-[#14bace]"
                        >
                            Beranda
                        </Link>
                        <ChevronRight className="size-4 text-gray-400" />
                        <span className="font-semibold text-[#186972]">
                            Empat Bidang
                        </span>
                    </nav>
                    <p className="mt-4 max-w-3xl font-sans text-sm leading-relaxed text-gray-600 sm:text-base">
                        Yayasan Geliyat mengelola empat bidang utama untuk
                        memperkuat pelayanan sosial, pendidikan, kemandirian
                        ekonomi, dan pembinaan keagamaan bagi 420+ anak yatim
                        serta keluarga binaan di lima kelurahan wilayah
                        Ujungberung.
                    </p>
                </div>
            </div>

            {/* List of Fields from Database */}
            <section className="bg-white py-16 sm:py-20">
                <div className="mx-auto max-w-7xl space-y-16 px-4 sm:px-6 lg:px-8">
                    {bidangList.map((bidang, idx) => {
                        const IconComponent = getBidangIcon(bidang.kode);
                        const detailHref = `/bidang/${bidang.kode}`;

                        return (
                            <div
                                key={bidang.id}
                                className="grid grid-cols-1 items-center gap-10 rounded-3xl border border-transparent p-2 transition-colors lg:grid-cols-12"
                            >
                                {/* Image side */}
                                <div
                                    className={`lg:col-span-5 ${idx % 2 === 1 ? 'lg:order-2' : ''}`}
                                >
                                    <Link
                                        href={detailHref}
                                        prefetch={false}
                                        className="group relative block overflow-hidden rounded-3xl border border-[#e4eaec] shadow-md focus:ring-2 focus:ring-[#14bace] focus:outline-hidden"
                                    >
                                        <img
                                            src={bidang.gambar}
                                            alt={bidang.nama}
                                            className="h-72 w-full object-cover transition-transform duration-300 group-hover:scale-105 sm:h-80"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#1d2b2d]/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                        <div className="absolute top-4 left-4 rounded-full bg-white/95 px-3.5 py-1 font-poppins text-xs font-bold text-[#087f8c] shadow-xs backdrop-blur-xs">
                                            Bidang 0{idx + 1}
                                        </div>
                                        <div className="absolute right-4 bottom-4 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3.5 py-1.5 font-poppins text-xs font-semibold text-[#1d2b2d] opacity-0 shadow-sm transition-all duration-300 group-hover:opacity-100">
                                            <span>Lihat Detail</span>
                                            <ArrowRight className="size-3.5 text-[#14bace]" />
                                        </div>
                                    </Link>
                                </div>

                                {/* Details side */}
                                <div
                                    className={`flex flex-col items-start lg:col-span-7 ${idx % 2 === 1 ? 'lg:order-1' : ''}`}
                                >
                                    <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#e8f8fa] px-3 py-1 font-poppins text-xs font-semibold text-[#087f8c]">
                                        <IconComponent className="size-3.5" />
                                        <span>Pilar Geliyat</span>
                                    </div>

                                    <Link
                                        href={detailHref}
                                        prefetch={false}
                                        className="group"
                                    >
                                        <h2 className="font-poppins text-2xl font-bold text-[#1d2b2d] transition-colors group-hover:text-[#14bace] sm:text-3xl">
                                            {bidang.nama}
                                        </h2>
                                    </Link>

                                    <p className="mt-1 font-poppins text-xs font-semibold text-[#186972] sm:text-sm">
                                        {bidang.subjudul}
                                    </p>
                                    <p className="mt-3 font-sans text-sm leading-relaxed text-gray-600">
                                        {bidang.deskripsi_lengkap ||
                                            bidang.deskripsi}
                                    </p>

                                    {/* Programs sub-list */}
                                    {bidang.program_kerja.length > 0 && (
                                        <div className="mt-6 w-full space-y-2.5 border-t border-gray-100 pt-4">
                                            <p className="font-poppins text-xs font-bold tracking-wider text-gray-400 uppercase">
                                                Program Kerja Utama:
                                            </p>
                                            {bidang.program_kerja.map(
                                                (prog) => (
                                                    <div
                                                        key={prog.nama}
                                                        className="flex items-start gap-2.5 font-sans text-xs text-gray-700 sm:text-sm"
                                                    >
                                                        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[#14bace]" />
                                                        <span>{prog.nama}</span>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    )}

                                    <div className="mt-8 flex flex-wrap items-center gap-3">
                                        <Link
                                            href={detailHref}
                                            prefetch={false}
                                            className="inline-flex items-center gap-2 rounded-xl bg-[#14bace] px-5 py-2.5 font-poppins text-xs font-semibold text-white shadow-sm transition hover:bg-[#087f8c] sm:text-sm"
                                        >
                                            <span>Lihat Detail Bidang</span>
                                            <ArrowRight className="size-3.5" />
                                        </Link>

                                        <Link
                                            href="/donasi"
                                            prefetch={false}
                                            className="inline-flex items-center gap-2 rounded-xl border border-[#e4eaec] bg-white px-5 py-2.5 font-poppins text-xs font-semibold text-[#1d2b2d] shadow-xs transition hover:border-[#14bace]/50 hover:bg-[#f7fcfd] sm:text-sm"
                                        >
                                            <span>Dukung Program Ini</span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>
        </PublicLayout>
    );
}
