import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    ArrowRight,
    Calendar,
    Camera,
    ChevronRight,
    FileText,
    Layers,
    MapPin,
    User,
} from 'lucide-react';
import PublicLayout from '@/layouts/public-layout';
import { type KegiatanData } from './kegiatan';

interface KegiatanDetailProps {
    kegiatan: KegiatanData;
    kegiatanLainnya: KegiatanData[];
}

export default function KegiatanDetailPage({
    kegiatan,
    kegiatanLainnya = [],
}: KegiatanDetailProps) {
    const paragrafList =
        kegiatan.paragraf_berita && kegiatan.paragraf_berita.length > 0
            ? kegiatan.paragraf_berita
            : [kegiatan.isi_berita || kegiatan.deskripsi];

    return (
        <PublicLayout>
            <Head title={`${kegiatan.judul} - Berita & Kegiatan Geliyat`} />

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
                            Beranda
                        </Link>
                        <ChevronRight className="size-3.5 text-gray-400" />
                        <Link
                            href="/kegiatan"
                            prefetch={false}
                            className="transition-colors hover:text-[#14bace]"
                        >
                            Kegiatan
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
                            <span>Kembali ke Halaman Kegiatan</span>
                        </Link>
                    </div>

                    {/* Category & Bidang Badge */}
                    <div className="mt-6 flex flex-wrap items-center gap-2.5">
                        <span className="inline-flex items-center rounded-full bg-[#14bace] px-3.5 py-1 font-poppins text-xs font-bold tracking-wider text-white uppercase shadow-2xs">
                            {kegiatan.kategori}
                        </span>
                        {kegiatan.bidang && (
                            <Link
                                href={`/bidang/${kegiatan.bidang.kode}`}
                                prefetch={false}
                                className="inline-flex items-center gap-1.5 rounded-full border border-[#14bace]/30 bg-white px-3.5 py-1 font-poppins text-xs font-semibold text-[#087f8c] transition hover:bg-[#e8f8fa]"
                            >
                                <Layers className="size-3.5" />
                                <span>{kegiatan.bidang.nama}</span>
                            </Link>
                        )}
                    </div>

                    {/* Judul Berita / Kegiatan */}
                    <h1 className="mt-4 font-poppins text-2xl leading-tight font-bold text-[#1d2b2d] sm:text-4xl lg:leading-[1.2]">
                        {kegiatan.judul}
                    </h1>

                    {/* Metadata Bar: Tanggal, Lokasi, Penulis */}
                    <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2.5 border-t border-[#e4eaec]/80 pt-4 font-sans text-xs text-gray-600 sm:text-sm">
                        <div className="flex items-center gap-2">
                            <Calendar className="size-4 shrink-0 text-[#14bace]" />
                            <span>
                                <strong className="font-semibold text-[#1d2b2d]">
                                    Tanggal Pelaksanaan:
                                </strong>{' '}
                                {kegiatan.tanggal_kegiatan}
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <MapPin className="size-4 shrink-0 text-[#14bace]" />
                            <span>
                                <strong className="font-semibold text-[#1d2b2d]">
                                    Lokasi:
                                </strong>{' '}
                                {kegiatan.lokasi}
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <User className="size-4 shrink-0 text-[#14bace]" />
                            <span>{kegiatan.penulis}</span>
                        </div>
                    </div>
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
                                    className="max-h-[460px] w-full object-cover"
                                />
                                <figcaption className="border-t border-gray-100 bg-white px-5 py-3 font-sans text-xs text-gray-500">
                                    Dokumentasi utama kegiatan:{' '}
                                    <span className="font-medium text-gray-700">
                                        {kegiatan.judul}
                                    </span>{' '}
                                    — {kegiatan.lokasi}
                                </figcaption>
                            </figure>

                            {/* Ringkasan Kegiatan */}
                            <div className="rounded-2xl border border-[#14bace]/30 border-l-4 border-l-[#14bace] bg-[#e8f8fa]/50 p-5 sm:p-6">
                                <div className="mb-2 flex items-center gap-2 font-poppins text-xs font-bold tracking-wider text-[#087f8c] uppercase">
                                    <FileText className="size-4 text-[#14bace]" />
                                    <span>Ringkasan Kegiatan</span>
                                </div>
                                <p className="font-sans text-sm leading-relaxed font-medium text-[#1d2b2d] sm:text-base">
                                    {kegiatan.ringkasan || kegiatan.deskripsi}
                                </p>
                            </div>

                            {/* Isi Berita / Deskripsi Lengkap */}
                            <div className="rounded-2xl border border-[#e4eaec] bg-white p-6 shadow-xs sm:p-8">
                                <h2 className="mb-4 border-b border-gray-100 pb-3 font-poppins text-lg font-bold text-[#1d2b2d] sm:text-xl">
                                    Deskripsi Lengkap & Laporan Kegiatan
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
                                        <div className="mb-6 flex items-center gap-2.5">
                                            <div className="flex size-9 items-center justify-center rounded-xl bg-[#e8f8fa] text-[#087f8c]">
                                                <Camera className="size-5" />
                                            </div>
                                            <div>
                                                <h2 className="font-poppins text-lg font-bold text-[#1d2b2d] sm:text-xl">
                                                    Dokumentasi Kegiatan
                                                </h2>
                                                <p className="font-sans text-xs text-gray-500">
                                                    Galeri foto pelaksanaan
                                                    kegiatan di lapangan
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
                                                                className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                            />
                                                        </div>
                                                        {dok.caption && (
                                                            <figcaption className="p-3.5 font-sans text-xs leading-relaxed text-gray-600">
                                                                {dok.caption}
                                                            </figcaption>
                                                        )}
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
                                    <span>Kembali ke Daftar Kegiatan</span>
                                </Link>

                                {kegiatan.bidang && (
                                    <Link
                                        href={`/bidang/${kegiatan.bidang.kode}`}
                                        prefetch={false}
                                        className="inline-flex items-center gap-1.5 font-poppins text-xs font-semibold text-[#1d2b2d] transition hover:text-[#14bace] sm:text-sm"
                                    >
                                        <span>
                                            Lihat {kegiatan.bidang.nama}
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
                                        Informasi Kegiatan
                                    </h3>

                                    <dl className="mt-4 space-y-4">
                                        <div>
                                            <dt className="font-poppins text-xs font-semibold text-gray-400 uppercase">
                                                Kategori Bidang
                                            </dt>
                                            <dd className="mt-1 font-poppins text-sm font-bold text-[#087f8c]">
                                                {kegiatan.kategori}
                                            </dd>
                                        </div>

                                        <div>
                                            <dt className="font-poppins text-xs font-semibold text-gray-400 uppercase">
                                                Tanggal Pelaksanaan
                                            </dt>
                                            <dd className="mt-1 font-sans text-sm font-medium text-[#1d2b2d]">
                                                {kegiatan.tanggal_kegiatan}
                                            </dd>
                                        </div>

                                        <div>
                                            <dt className="font-poppins text-xs font-semibold text-gray-400 uppercase">
                                                Lokasi Kegiatan
                                            </dt>
                                            <dd className="mt-1 font-sans text-sm font-medium text-[#1d2b2d]">
                                                {kegiatan.lokasi}
                                            </dd>
                                        </div>

                                        {kegiatan.bidang && (
                                            <div>
                                                <dt className="font-poppins text-xs font-semibold text-gray-400 uppercase">
                                                    Unit Pelaksana
                                                </dt>
                                                <dd className="mt-1">
                                                    <Link
                                                        href={`/bidang/${kegiatan.bidang.kode}`}
                                                        prefetch={false}
                                                        className="font-poppins text-sm font-semibold text-[#14bace] hover:underline"
                                                    >
                                                        {kegiatan.bidang.nama}
                                                    </Link>
                                                </dd>
                                            </div>
                                        )}
                                    </dl>
                                </div>

                                {/* CTA Donasi */}
                                <div className="rounded-2xl bg-gradient-to-br from-[#186972] to-[#087f8c] p-6 text-white shadow-md">
                                    <h3 className="font-poppins text-base font-bold">
                                        Dukung Kegiatan Yayasan
                                    </h3>
                                    <p className="mt-2 font-sans text-xs leading-relaxed text-white/90">
                                        Mari ambil bagian dalam mendukung
                                        kegiatan pendampingan dan santunan anak
                                        yatim binaan Yayasan Geliyat.
                                    </p>
                                    <Link
                                        href="/donasi"
                                        prefetch={false}
                                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-white py-2.5 font-poppins text-xs font-bold text-[#087f8c] shadow-xs transition hover:bg-[#e8f8fa]"
                                    >
                                        <span>Donasi Sekarang</span>
                                        <ArrowRight className="size-3.5" />
                                    </Link>
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
                                    Berita Terkait
                                </span>
                                <h2 className="mt-1 font-poppins text-xl font-bold text-[#1d2b2d] sm:text-2xl">
                                    Kegiatan Yayasan Lainnya
                                </h2>
                            </div>
                            <Link
                                href="/kegiatan"
                                prefetch={false}
                                className="inline-flex items-center gap-1.5 font-poppins text-xs font-semibold text-[#14bace] hover:text-[#087f8c] sm:text-sm"
                            >
                                <span>Semua Kegiatan</span>
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
                                                className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                            <span className="absolute top-3 left-3 rounded-md bg-white/95 px-2.5 py-1 text-[10px] font-bold tracking-wider text-[#087f8c] uppercase shadow-xs">
                                                {item.kategori}
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
                                    <div className="flex items-center gap-1.5 border-t border-gray-100 px-5 py-3 text-xs text-gray-500">
                                        <MapPin className="size-3.5 shrink-0 text-[#14bace]" />
                                        <span className="truncate">
                                            {item.lokasi}
                                        </span>
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

