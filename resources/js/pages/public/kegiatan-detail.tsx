import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, ArrowRight, Calendar, ChevronRight } from 'lucide-react';
import PublicLayout from '@/layouts/public-layout';
import { useLanguage } from '@/hooks/use-language';
import { type KegiatanData } from './kegiatan';

function DokumentasiIconBadge() {
    return (
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#e0f7fa] via-[#ecfeff] to-[#cffafe] shadow-xs ring-1 ring-[#14bace]/20">
            <svg
                viewBox="0 0 32 32"
                fill="none"
                aria-hidden="true"
                className="size-6"
            >
                {/* Back stacked photo card */}
                <path
                    d="M9.5 8H21.5C22.6 8 23.5 8.9 23.5 10V19.8C23.5 20.9 22.6 21.8 21.5 21.8H21"
                    fill="#14bace"
                    fillOpacity="0.14"
                    stroke="#0891b2"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                {/* Front photo frame */}
                <rect
                    x="5"
                    y="10.5"
                    width="16.5"
                    height="14.5"
                    rx="2.8"
                    fill="#14bace"
                    fillOpacity="0.12"
                    stroke="#0891b2"
                    strokeWidth="1.75"
                />
                {/* Sun circle */}
                <circle
                    cx="10"
                    cy="15.2"
                    r="1.6"
                    fill="#14bace"
                    fillOpacity="0.4"
                    stroke="#0891b2"
                    strokeWidth="1.3"
                />
                {/* Layered mountain silhouette */}
                <path
                    d="M5.6 22.6L10.3 18.5C10.9 18 11.7 18 12.2 18.5L14.5 20.7L16.4 19C16.9 18.5 17.7 18.5 18.2 19L20.9 21.7V22.4C20.9 23.5 20 24.4 18.9 24.4H7.6C6.5 24.4 5.6 23.6 5.6 22.6Z"
                    fill="#14bace"
                    fillOpacity="0.28"
                    stroke="#0e7490"
                    strokeWidth="1.4"
                    strokeLinejoin="round"
                />
                {/* Editorial sparkle accent */}
                <path
                    d="M26.5 3.8L27.1 5.2L28.5 5.8L27.1 6.4L26.5 7.8L25.9 6.4L24.5 5.8L25.9 5.2L26.5 3.8Z"
                    fill="#14bace"
                />
            </svg>
        </div>
    );
}

interface KegiatanDetailProps {
    kegiatan: KegiatanData;
    kegiatanLainnya: KegiatanData[];
}

export default function KegiatanDetailPage({
    kegiatan,
    kegiatanLainnya,
}: KegiatanDetailProps) {
    const { t, translateCategory } = useLanguage();
    const paragrafList =
        kegiatan.paragraf_berita && kegiatan.paragraf_berita.length > 0
            ? kegiatan.paragraf_berita
            : [kegiatan.isi_berita || kegiatan.deskripsi];

    return (
        <PublicLayout>
            <Head
                title={`${kegiatan.judul} - ${t('Berita & Kegiatan Geliyat', 'Geliyat News & Activities')}`}
            />

            {/* Article Header & Breadcrumb Banner */}
            <div className="border-b border-[#e4eaec] bg-gradient-to-r from-[#d1f6fa]/60 via-[#e8f8fa] to-[#f7fcfd] py-8 sm:py-12">
                <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumbs */}
                    <nav className="flex flex-wrap items-center gap-2 font-poppins text-xs text-gray-500 sm:text-sm">
                        <Link
                            href="/"
                            prefetch={false}
                            className="transition-colors hover:text-[#14bace]"
                        >
                            {t('Beranda', 'Home')}
                        </Link>
                        <ChevronRight className="size-3.5 text-gray-400" />
                        <Link
                            href="/kegiatan"
                            prefetch={false}
                            className="transition-colors hover:text-[#14bace]"
                        >
                            {t('Kegiatan', 'Activities')}
                        </Link>
                        <ChevronRight className="size-3.5 text-gray-400" />
                        <span className="line-clamp-1 font-semibold text-[#186972]">
                            {kegiatan.judul}
                        </span>
                    </nav>

                    {/* Back Button */}
                    <div className="mt-4">
                        <Link
                            href="/kegiatan"
                            prefetch={false}
                            className="inline-flex items-center gap-2 rounded-lg border border-[#e4eaec] bg-white px-3.5 py-1.5 font-poppins text-xs font-semibold text-[#1d2b2d] shadow-2xs transition hover:border-[#14bace] hover:text-[#087f8c]"
                        >
                            <ArrowLeft className="size-3.5" />
                            <span>
                                {t(
                                    'Kembali ke Halaman Kegiatan',
                                    'Back to Activities Page',
                                )}
                            </span>
                        </Link>
                    </div>

                    {/* Judul Berita / Kegiatan */}
                    <h1 className="mt-6 font-poppins text-2xl leading-tight font-bold text-[#1d2b2d] sm:text-4xl lg:leading-[1.2]">
                        {kegiatan.judul}
                    </h1>
                </div>
            </div>

            {/* Main News Article Content */}
            <article className="bg-[#fbfdfd] py-10 sm:py-14">
                <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
                        {/* Editorial Column (8 cols) */}
                        <div className="space-y-8 lg:col-span-8">
                            {/* Gambar Utama */}
                            <figure className="overflow-hidden rounded-3xl border border-[#e4eaec] bg-white shadow-sm">
                                <img
                                    src={kegiatan.gambar}
                                    alt={kegiatan.judul}
                                    fetchPriority="high"
                                    decoding="async"
                                    className="max-h-[460px] w-full object-cover"
                                />
                            </figure>

                            {/* Isi Berita / Deskripsi Lengkap */}
                            <div className="rounded-2xl border border-[#e4eaec] bg-white p-6 shadow-xs sm:p-8">
                                <h2 className="mb-4 border-b border-gray-100 pb-3 font-poppins text-lg font-bold text-[#1d2b2d] sm:text-xl">
                                    {t(
                                        'Deskripsi Lengkap & Laporan Kegiatan',
                                        'Full Description & Activity Report',
                                    )}
                                </h2>
                                <div className="space-y-4 font-sans text-sm leading-relaxed text-gray-700 sm:text-base sm:leading-loose">
                                    {paragrafList.map((paragraf, index) => (
                                        <p key={index}>{paragraf}</p>
                                    ))}
                                </div>
                            </div>

                            {/* Dokumentasi Kegiatan (Jika Tersedia) */}
                            {kegiatan.dokumentasi &&
                                kegiatan.dokumentasi.length > 0 && (
                                    <div className="rounded-2xl border border-[#e4eaec] bg-white p-6 shadow-xs sm:p-8">
                                        <div className="mb-6 flex items-center gap-3">
                                            <DokumentasiIconBadge />
                                            <div>
                                                <h2 className="font-poppins text-lg font-bold text-[#1d2b2d] sm:text-xl">
                                                    {t(
                                                        'Dokumentasi Kegiatan',
                                                        'Activity Gallery',
                                                    )}
                                                </h2>
                                                <p className="font-sans text-xs text-gray-500">
                                                    {t(
                                                        'Galeri foto pelaksanaan kegiatan di lapangan',
                                                        'Photo gallery of field activity implementation',
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                            {kegiatan.dokumentasi.map(
                                                (dok, idx) => (
                                                    <figure
                                                        key={idx}
                                                        className="group overflow-hidden rounded-2xl border border-[#e4eaec] bg-[#fbfdfd] shadow-2xs"
                                                    >
                                                        <div className="h-48 w-full overflow-hidden bg-gray-100">
                                                            <img
                                                                src={dok.url}
                                                                alt={
                                                                    dok.caption ||
                                                                    `Dokumentasi ${idx + 1}`
                                                                }
                                                                loading="lazy"
                                                                decoding="async"
                                                                className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                            />
                                                        </div>
                                                    </figure>
                                                ),
                                            )}
                                        </div>
                                    </div>
                                )}

                            {/* Bottom Navigation Bar */}
                            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#e4eaec] bg-white p-5 shadow-2xs">
                                <Link
                                    href="/kegiatan"
                                    prefetch={false}
                                    className="inline-flex items-center gap-2 font-poppins text-xs font-semibold text-[#087f8c] transition hover:text-[#14bace] sm:text-sm"
                                >
                                    <ArrowLeft className="size-4" />
                                    <span>
                                        {t(
                                            'Kembali ke Daftar Kegiatan',
                                            'Back to Activities List',
                                        )}
                                    </span>
                                </Link>

                                {kegiatan.bidang && (
                                    <Link
                                        href={`/bidang/${kegiatan.bidang.kode}`}
                                        prefetch={false}
                                        className="inline-flex items-center gap-1.5 font-poppins text-xs font-semibold text-[#1d2b2d] transition hover:text-[#14bace] sm:text-sm"
                                    >
                                        <span>
                                            {t('Lihat', 'View')}{' '}
                                            {kegiatan.bidang.nama}
                                        </span>
                                        <ArrowRight className="size-4" />
                                    </Link>
                                )}
                            </div>
                        </div>

                        {/* Sidebar Info Column (4 cols) */}
                        <aside className="space-y-6 lg:col-span-4">
                            <div className="sticky top-28 space-y-6">
                                {/* Detail Pelaksanaan Box */}
                                <div className="rounded-2xl border border-[#e4eaec] bg-white p-6 shadow-xs">
                                    <h3 className="border-b border-gray-100 pb-3 font-poppins text-base font-bold text-[#1d2b2d]">
                                        {t(
                                            'Informasi Kegiatan',
                                            'Activity Details',
                                        )}
                                    </h3>

                                    <dl className="mt-4 space-y-4">
                                        <div>
                                            <dt className="font-poppins text-xs font-semibold text-gray-400 uppercase">
                                                {t(
                                                    'Kategori Bidang',
                                                    'Division Category',
                                                )}
                                            </dt>
                                            <dd className="mt-1 font-poppins text-sm font-bold text-[#087f8c]">
                                                {translateCategory(
                                                    kegiatan.kategori,
                                                )}
                                            </dd>
                                        </div>

                                        <div>
                                            <dt className="font-poppins text-xs font-semibold text-gray-400 uppercase">
                                                {t(
                                                    'Tanggal Pelaksanaan',
                                                    'Date',
                                                )}
                                            </dt>
                                            <dd className="mt-1 font-sans text-sm font-medium text-[#1d2b2d]">
                                                {kegiatan.tanggal_kegiatan}
                                            </dd>
                                        </div>

                                        <div>
                                            <dt className="font-poppins text-xs font-semibold text-gray-400 uppercase">
                                                {t(
                                                    'Lokasi Kegiatan',
                                                    'Location',
                                                )}
                                            </dt>
                                            <dd className="mt-1 font-sans text-sm font-medium text-[#1d2b2d]">
                                                {kegiatan.lokasi}
                                            </dd>
                                        </div>
                                    </dl>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </article>

            {/* Kegiatan Lainnya */}
            {kegiatanLainnya.length > 0 && (
                <section className="border-t border-[#e4eaec] bg-white py-12 sm:py-16">
                    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-8 flex items-center justify-between">
                            <div>
                                <span className="font-poppins text-xs font-bold tracking-wider text-[#14bace] uppercase">
                                    {t('Berita Terkait', 'Related News')}
                                </span>
                                <h2 className="mt-1 font-poppins text-xl font-bold text-[#1d2b2d] sm:text-2xl">
                                    {t(
                                        'Kegiatan Yayasan Lainnya',
                                        'Other Foundation Activities',
                                    )}
                                </h2>
                            </div>
                            <Link
                                href="/kegiatan"
                                prefetch={false}
                                className="inline-flex items-center gap-1.5 font-poppins text-xs font-semibold text-[#14bace] hover:text-[#087f8c] sm:text-sm"
                            >
                                <span>
                                    {t('Semua Kegiatan', 'All Activities')}
                                </span>
                                <ArrowRight className="size-4" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            {kegiatanLainnya.map((item) => (
                                <Link
                                    key={item.id}
                                    href={`/kegiatan/${item.id}`}
                                    prefetch={false}
                                    className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-[#e4eaec] bg-[#fbfdfd] shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-[#14bace]/50 hover:shadow-md"
                                >
                                    <div>
                                        <div className="relative h-44 w-full overflow-hidden bg-gray-100">
                                            <img
                                                src={item.gambar}
                                                alt={item.judul}
                                                loading="lazy"
                                                decoding="async"
                                                className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                            <span className="absolute top-3 left-3 rounded-md bg-white/95 px-2.5 py-1 text-[10px] font-bold tracking-wider text-[#087f8c] uppercase shadow-xs">
                                                {translateCategory(
                                                    item.kategori,
                                                )}
                                            </span>
                                        </div>
                                        <div className="p-5">
                                            <div className="mb-1.5 flex items-center gap-1.5 text-xs text-gray-400">
                                                <Calendar className="size-3.5 text-[#14bace]" />
                                                <span>
                                                    {item.tanggal_kegiatan}
                                                </span>
                                            </div>
                                            <h3 className="line-clamp-2 font-poppins text-base font-bold text-[#1d2b2d] transition-colors group-hover:text-[#14bace]">
                                                {item.judul}
                                            </h3>
                                            <p className="mt-2 line-clamp-2 font-sans text-xs leading-relaxed text-gray-600">
                                                {item.ringkasan ||
                                                    item.deskripsi}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </PublicLayout>
    );
}
