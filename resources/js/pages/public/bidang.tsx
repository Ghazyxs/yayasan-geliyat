import { Head, Link } from '@inertiajs/react';
import { ChevronRight, ArrowRight } from 'lucide-react';
import PublicLayout from '@/layouts/public-layout';
import { useLanguage } from '@/hooks/use-language';

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

export function getBidangImagePosition(kode: string): string {
    switch (kode) {
        case 'kemanusiaan':
            return 'object-[center_72%]';
        case 'keagamaan':
            return 'object-[center_45%]';
        case 'pendidikan':
            return 'object-[center_45%]';
        default:
            return 'object-center';
    }
}

export default function BidangPage({ bidangList }: BidangPageProps) {
    const { t, translateBidang } = useLanguage();

    return (
        <PublicLayout>
            <Head
                title={t(
                    'Bidang Yayasan - Empat Pilar Program Geliyat',
                    'Foundation Divisions - Four Core Pillars of Geliyat',
                )}
            />

            {/* Banner Header with Breadcrumbs */}
            <div className="border-b border-[#e4eaec] bg-gradient-to-r from-[#d1f6fa]/60 via-[#e8f8fa] to-[#f7fcfd] py-10 sm:py-14">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <h1 className="font-poppins text-3xl font-bold text-[#1d2b2d] sm:text-4xl">
                        {t('Bidang Yayasan', 'Foundation Divisions')}
                    </h1>
                    <nav className="mt-2 flex items-center gap-2 font-poppins text-sm text-gray-500">
                        <Link
                            href="/"
                            prefetch={false}
                            className="transition-colors hover:text-[#14bace]"
                        >
                            {t('Beranda', 'Home')}
                        </Link>
                        <ChevronRight className="size-4 text-gray-400" />
                        <span className="font-semibold text-[#186972]">
                            {t('Empat Bidang', 'Four Divisions')}
                        </span>
                    </nav>
                    <p className="mt-4 max-w-3xl font-sans text-sm leading-relaxed text-gray-600 sm:text-base">
                        {t(
                            'Yayasan Geliyat Mahdiesa Nahate mengelola empat bidang utama — Pendidikan, Keagamaan, Kemanusiaan, dan Pengembangan Ekonomi — untuk membina anak yatim dan memberdayakan ibu yatim secara berkelanjutan.',
                            'Yayasan Geliyat Mahdiesa Nahate manages four core divisions — Education, Religious, Humanitarian, and Economic Development — to mentor orphans and empower mothers of orphans sustainably.',
                        )}
                    </p>
                </div>
            </div>

            {/* List of Fields from Database */}
            <section className="bg-white py-16 sm:py-20">
                <div className="mx-auto max-w-7xl space-y-16 px-4 sm:px-6 lg:px-8">
                    {bidangList.map((rawBidang, idx) => {
                        const bidang = translateBidang(rawBidang);
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
                                            className={`aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-105 sm:h-80 ${getBidangImagePosition(bidang.kode)}`}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#1d2b2d]/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                        <div className="absolute right-4 bottom-4 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3.5 py-1.5 font-poppins text-xs font-semibold text-[#1d2b2d] opacity-0 shadow-sm transition-all duration-300 group-hover:opacity-100">
                                            <span>
                                                {t(
                                                    'Lihat Detail',
                                                    'View Details',
                                                )}
                                            </span>
                                            <ArrowRight className="size-3.5 text-[#14bace]" />
                                        </div>
                                    </Link>
                                </div>

                                {/* Details side */}
                                <div
                                    className={`flex flex-col items-start lg:col-span-7 ${idx % 2 === 1 ? 'lg:order-1' : ''}`}
                                >
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
                                        <div className="mt-6 w-full border-t border-gray-100 pt-4">
                                            <p className="font-poppins text-xs font-bold tracking-wider text-gray-400 uppercase">
                                                {t(
                                                    'Program Kerja Utama:',
                                                    'Key Work Programs:',
                                                )}
                                            </p>
                                            <ol className="mt-2.5 list-decimal space-y-1.5 pl-4 font-sans text-xs text-gray-700 sm:text-sm">
                                                {bidang.program_kerja.map(
                                                    (prog) => (
                                                        <li key={prog.nama}>
                                                            {prog.nama}
                                                        </li>
                                                    ),
                                                )}
                                            </ol>
                                        </div>
                                    )}

                                    <div className="mt-8 flex flex-wrap items-center gap-3">
                                        <Link
                                            href={detailHref}
                                            prefetch={false}
                                            className="inline-flex items-center gap-2 rounded-xl bg-[#14bace] px-5 py-2.5 font-poppins text-xs font-semibold text-white shadow-sm transition hover:bg-[#087f8c] sm:text-sm"
                                        >
                                            <span>
                                                {t(
                                                    'Lihat Detail Bidang',
                                                    'View Division Details',
                                                )}
                                            </span>
                                            <ArrowRight className="size-3.5" />
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
