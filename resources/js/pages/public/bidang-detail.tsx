import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    ArrowRight,
    Calendar,
    CheckCircle2,
    ChevronRight,
    Clock,
    Layers,
    MapPin,
    Target,
    UserCheck,
    Users,
} from 'lucide-react';
import PublicLayout from '@/layouts/public-layout';
import { type BidangItem, getBidangIcon } from './bidang';

interface KegiatanRingkas {
    id: number;
    judul: string;
    kategori: string;
    ringkasan: string;
    deskripsi: string;
    lokasi: string;
    tanggal_kegiatan: string;
    gambar: string;
}

interface BidangDetailProps {
    bidang: BidangItem;
    kegiatanTerkait: KegiatanRingkas[];
    bidangLainnya: BidangItem[];
}

export default function BidangDetailPage({
    bidang,
    kegiatanTerkait = [],
    bidangLainnya = [],
}: BidangDetailProps) {
    const IconComponent = getBidangIcon(bidang.kode);

    return (
        <PublicLayout>
            <Head title={`${bidang.nama} - Bidang Program Yayasan Geliyat`} />

            {/* Top Banner & Breadcrumbs */}
            <div className="border-b border-[#e4eaec] bg-gradient-to-r from-[#d1f6fa]/60 via-[#e8f8fa] to-[#f7fcfd] py-8 sm:py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumb navigation */}
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
                            href="/bidang"
                            prefetch={false}
                            className="transition-colors hover:text-[#14bace]"
                        >
                            Empat Bidang
                        </Link>
                        <ChevronRight className="size-3.5 text-gray-400" />
                        <span className="font-semibold text-[#186972]">
                            {bidang.nama}
                        </span>
                    </nav>

                    {/* Back Link */}
                    <div className="mt-4">
                        <Link
                            href="/bidang"
                            prefetch={false}
                            className="inline-flex items-center gap-2 rounded-lg border border-[#e4eaec] bg-white px-3.5 py-1.5 font-poppins text-xs font-semibold text-[#1d2b2d] shadow-2xs transition hover:border-[#14bace] hover:text-[#087f8c]"
                        >
                            <ArrowLeft className="size-3.5" />
                            <span>Kembali ke Daftar Bidang</span>
                        </Link>
                    </div>

                    {/* Hero Header Grid */}
                    <div className="mt-6 grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
                        <div className="lg:col-span-7">
                            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 font-poppins text-xs font-semibold text-[#087f8c] shadow-2xs">
                                <IconComponent className="size-4 text-[#14bace]" />
                                <span className="uppercase tracking-wider">
                                    Pilar Program Yayasan Geliyat
                                </span>
                            </div>

                            <h1 className="font-poppins text-2xl font-bold text-[#1d2b2d] sm:text-4xl lg:text-5xl">
                                {bidang.nama}
                            </h1>

                            <p className="mt-2 font-poppins text-sm font-semibold text-[#186972] sm:text-base">
                                {bidang.subjudul}
                            </p>

                            <p className="mt-4 max-w-2xl font-sans text-sm leading-relaxed text-gray-600 sm:text-base">
                                {bidang.deskripsi}
                            </p>

                            <div className="mt-6 flex flex-wrap items-center gap-3">
                                <Link
                                    href="/donasi"
                                    prefetch={false}
                                    className="inline-flex items-center gap-2 rounded-xl bg-[#14bace] px-5 py-3 font-poppins text-xs font-semibold text-white shadow-sm transition hover:bg-[#087f8c] sm:text-sm"
                                >
                                    <span>Dukung Program {bidang.nama}</span>
                                    <ArrowRight className="size-4" />
                                </Link>
                                <a
                                    href="#program-kerja"
                                    className="inline-flex items-center gap-2 rounded-xl border border-[#e4eaec] bg-white px-5 py-3 font-poppins text-xs font-semibold text-[#1d2b2d] shadow-2xs transition hover:bg-gray-50 sm:text-sm"
                                >
                                    <span>Lihat Program Kerja</span>
                                </a>
                            </div>
                        </div>

                        {/* Hero Image */}
                        <div className="lg:col-span-5">
                            <div className="overflow-hidden rounded-3xl border border-[#e4eaec] bg-white p-2 shadow-lg">
                                <img
                                    src={bidang.gambar}
                                    alt={bidang.nama}
                                    className="h-64 w-full rounded-2xl object-cover sm:h-80"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content: Deskripsi Lengkap, Tujuan, Program Kerja & Informasi */}
            <section className="bg-[#fbfdfd] py-12 sm:py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
                        {/* Left Column (8 cols): Deskripsi, Tujuan, Program Kerja */}
                        <div className="space-y-10 lg:col-span-8">
                            {/* Deskripsi Lengkap */}
                            <div className="rounded-2xl border border-[#e4eaec] bg-white p-6 shadow-xs sm:p-8">
                                <div className="mb-4 flex items-center gap-2.5">
                                    <div className="flex size-9 items-center justify-center rounded-xl bg-[#e8f8fa] text-[#087f8c]">
                                        <Layers className="size-5" />
                                    </div>
                                    <h2 className="font-poppins text-lg font-bold text-[#1d2b2d] sm:text-xl">
                                        Tentang {bidang.nama}
                                    </h2>
                                </div>
                                <p className="font-sans text-sm leading-relaxed text-gray-700 sm:text-base sm:leading-loose">
                                    {bidang.deskripsi_lengkap ||
                                        bidang.deskripsi}
                                </p>
                            </div>

                            {/* Tujuan Bidang */}
                            {bidang.tujuan.length > 0 && (
                                <div className="rounded-2xl border border-[#e4eaec] bg-white p-6 shadow-xs sm:p-8">
                                    <div className="mb-5 flex items-center gap-2.5">
                                        <div className="flex size-9 items-center justify-center rounded-xl bg-[#e8f8fa] text-[#087f8c]">
                                            <Target className="size-5" />
                                        </div>
                                        <div>
                                            <h2 className="font-poppins text-lg font-bold text-[#1d2b2d] sm:text-xl">
                                                Tujuan Bidang
                                            </h2>
                                            <p className="font-sans text-xs text-gray-500">
                                                Sasaran strategis dan capaian
                                                utama yang diupayakan
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        {bidang.tujuan.map((item, index) => (
                                            <div
                                                key={item}
                                                className="flex items-start gap-3 rounded-xl border border-[#e4eaec]/80 bg-[#f7fcfd] p-4"
                                            >
                                                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#14bace] font-poppins text-xs font-bold text-white">
                                                    {index + 1}
                                                </span>
                                                <p className="font-sans text-xs leading-relaxed text-[#1d2b2d] sm:text-sm">
                                                    {item}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Program Kerja */}
                            <div
                                id="program-kerja"
                                className="scroll-mt-24 rounded-2xl border border-[#e4eaec] bg-white p-6 shadow-xs sm:p-8"
                            >
                                <div className="mb-6 flex items-center gap-2.5">
                                    <div className="flex size-9 items-center justify-center rounded-xl bg-[#e8f8fa] text-[#087f8c]">
                                        <CheckCircle2 className="size-5" />
                                    </div>
                                    <div>
                                        <h2 className="font-poppins text-lg font-bold text-[#1d2b2d] sm:text-xl">
                                            Program Kerja Utama
                                        </h2>
                                        <p className="font-sans text-xs text-gray-500">
                                            Rincian kegiatan operasional dan
                                            layanan pada {bidang.nama}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {bidang.program_kerja.map((prog, index) => (
                                        <div
                                            key={prog.nama}
                                            className="rounded-2xl border border-[#e4eaec] bg-[#fbfdfd] p-5 transition hover:border-[#14bace]/50 hover:shadow-xs"
                                        >
                                            <div className="flex flex-wrap items-start justify-between gap-2">
                                                <div className="flex items-center gap-2.5">
                                                    <span className="rounded-lg bg-[#e8f8fa] px-2.5 py-1 font-poppins text-xs font-bold text-[#087f8c]">
                                                        0{index + 1}
                                                    </span>
                                                    <h3 className="font-poppins text-base font-bold text-[#1d2b2d]">
                                                        {prog.nama}
                                                    </h3>
                                                </div>
                                                {prog.jadwal && (
                                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e8f8fa]/70 px-3 py-1 font-poppins text-[11px] font-semibold text-[#186972]">
                                                        <Clock className="size-3" />
                                                        {prog.jadwal}
                                                    </span>
                                                )}
                                            </div>

                                            {prog.deskripsi && (
                                                <p className="mt-3 font-sans text-xs leading-relaxed text-gray-600 sm:text-sm">
                                                    {prog.deskripsi}
                                                </p>
                                            )}

                                            {prog.sasaran && (
                                                <div className="mt-3 flex items-center gap-2 border-t border-gray-100 pt-2.5 text-xs text-gray-500">
                                                    <Users className="size-3.5 text-[#14bace]" />
                                                    <span>
                                                        <strong className="font-medium text-gray-700">
                                                            Sasaran:
                                                        </strong>{' '}
                                                        {prog.sasaran}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Column (4 cols): Informasi Pelaksanaan & Ringkasan Unit */}
                        <div className="space-y-6 lg:col-span-4">
                            <div className="sticky top-28 space-y-6">
                                {/* Informasi Bidang Card */}
                                <div className="rounded-2xl border border-[#e4eaec] bg-white p-6 shadow-xs">
                                    <h3 className="border-b border-gray-100 pb-3 font-poppins text-base font-bold text-[#1d2b2d]">
                                        Informasi Pelaksanaan
                                    </h3>

                                    <div className="mt-4 space-y-4">
                                        <div className="flex items-start gap-3">
                                            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#e8f8fa] text-[#087f8c]">
                                                <Users className="size-4" />
                                            </div>
                                            <div>
                                                <p className="font-poppins text-xs font-semibold text-gray-400 uppercase">
                                                    Sasaran Penerima Manfaat
                                                </p>
                                                <p className="mt-0.5 font-sans text-xs font-medium text-[#1d2b2d] sm:text-sm">
                                                    {
                                                        bidang
                                                            .informasi_tambahan
                                                            .sasaran_utama
                                                    }
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#e8f8fa] text-[#087f8c]">
                                                <MapPin className="size-4" />
                                            </div>
                                            <div>
                                                <p className="font-poppins text-xs font-semibold text-gray-400 uppercase">
                                                    Wilayah & Lokasi
                                                </p>
                                                <p className="mt-0.5 font-sans text-xs font-medium text-[#1d2b2d] sm:text-sm">
                                                    {
                                                        bidang
                                                            .informasi_tambahan
                                                            .lokasi_pelaksanaan
                                                    }
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#e8f8fa] text-[#087f8c]">
                                                <Clock className="size-4" />
                                            </div>
                                            <div>
                                                <p className="font-poppins text-xs font-semibold text-gray-400 uppercase">
                                                    Jadwal & Frekuensi
                                                </p>
                                                <p className="mt-0.5 font-sans text-xs font-medium text-[#1d2b2d] sm:text-sm">
                                                    {
                                                        bidang
                                                            .informasi_tambahan
                                                            .frekuensi_kegiatan
                                                    }
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#e8f8fa] text-[#087f8c]">
                                                <UserCheck className="size-4" />
                                            </div>
                                            <div>
                                                <p className="font-poppins text-xs font-semibold text-gray-400 uppercase">
                                                    Pelaksana Program
                                                </p>
                                                <p className="mt-0.5 font-sans text-xs font-medium text-[#1d2b2d] sm:text-sm">
                                                    {
                                                        bidang
                                                            .informasi_tambahan
                                                            .koordinator_unit
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Quick Metrics */}
                                    <div className="mt-6 grid grid-cols-2 gap-3 border-t border-gray-100 pt-4">
                                        <div className="rounded-xl bg-[#f7fcfd] p-3 text-center">
                                            <p className="font-poppins text-xl font-bold text-[#087f8c]">
                                                {bidang.program_kerja.length}
                                            </p>
                                            <p className="font-sans text-[11px] text-gray-500">
                                                Program Kerja
                                            </p>
                                        </div>
                                        <div className="rounded-xl bg-[#f7fcfd] p-3 text-center">
                                            <p className="font-poppins text-xl font-bold text-[#14bace]">
                                                5
                                            </p>
                                            <p className="font-sans text-[11px] text-gray-500">
                                                Kelurahan Binaan
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* CTA Box */}
                                <div className="rounded-2xl bg-gradient-to-br from-[#186972] to-[#087f8c] p-6 text-white shadow-md">
                                    <h3 className="font-poppins text-base font-bold">
                                        Mari Berkontribusi Bersama
                                    </h3>
                                    <p className="mt-2 font-sans text-xs leading-relaxed text-white/90">
                                        Setiap dukungan Anda membantu
                                        keberlanjutan program{' '}
                                        {bidang.nama.toLowerCase()} bagi
                                        anak-anak yatim binaan di Ujungberung.
                                    </p>
                                    <Link
                                        href="/donasi"
                                        prefetch={false}
                                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-white py-2.5 font-poppins text-xs font-bold text-[#087f8c] shadow-xs transition hover:bg-[#e8f8fa]"
                                    >
                                        <span>Salurkan Donasi Sekarang</span>
                                        <ArrowRight className="size-3.5" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Kegiatan Terkait Bidang Ini */}
            {kegiatanTerkait.length > 0 && (
                <section className="border-t border-[#e4eaec] bg-white py-12 sm:py-16">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                            <div>
                                <span className="font-poppins text-xs font-bold tracking-wider text-[#14bace] uppercase">
                                    Dokumentasi Pelaksanaan
                                </span>
                                <h2 className="mt-1 font-poppins text-2xl font-bold text-[#1d2b2d]">
                                    Kegiatan pada {bidang.nama}
                                </h2>
                            </div>
                            <Link
                                href="/kegiatan"
                                prefetch={false}
                                className="inline-flex items-center gap-1.5 font-poppins text-xs font-semibold text-[#14bace] hover:text-[#087f8c] sm:text-sm"
                            >
                                <span>Lihat Semua Kegiatan</span>
                                <ArrowRight className="size-4" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {kegiatanTerkait.map((act) => (
                                <Link
                                    key={act.id}
                                    href={`/kegiatan/${act.id}`}
                                    prefetch={false}
                                    className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-[#e4eaec] bg-[#fbfdfd] shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-[#14bace]/50 hover:shadow-md"
                                >
                                    <div>
                                        <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                                            <img
                                                src={act.gambar}
                                                alt={act.judul}
                                                className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                            <span className="absolute top-3 left-3 rounded-md bg-white/95 px-2.5 py-1 text-[10px] font-bold tracking-wider text-[#087f8c] uppercase shadow-xs">
                                                {act.kategori}
                                            </span>
                                        </div>

                                        <div className="p-5">
                                            <div className="mb-2 flex items-center gap-2 text-xs text-gray-400">
                                                <Calendar className="size-3.5 text-[#14bace]" />
                                                <span>
                                                    {act.tanggal_kegiatan}
                                                </span>
                                            </div>
                                            <h3 className="font-poppins text-base font-bold text-[#1d2b2d] transition-colors group-hover:text-[#14bace]">
                                                {act.judul}
                                            </h3>
                                            <p className="mt-2 line-clamp-2 font-sans text-xs leading-relaxed text-gray-600">
                                                {act.ringkasan || act.deskripsi}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3 text-xs text-gray-500">
                                        <div className="flex items-center gap-1.5 truncate">
                                            <MapPin className="size-3.5 shrink-0 text-[#14bace]" />
                                            <span className="truncate">
                                                {act.lokasi}
                                            </span>
                                        </div>
                                        <span className="shrink-0 font-poppins font-semibold text-[#14bace]">
                                            Baca Berita →
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Navigasi ke Bidang Lainnya */}
            {bidangLainnya.length > 0 && (
                <section className="border-t border-[#e4eaec] bg-[#d1f6fa]/25 py-12 sm:py-16">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-8 flex items-center justify-between">
                            <div>
                                <span className="font-poppins text-xs font-bold tracking-wider text-[#087f8c] uppercase">
                                    Pilar Lainnya
                                </span>
                                <h2 className="mt-1 font-poppins text-xl font-bold text-[#1d2b2d] sm:text-2xl">
                                    Jelajahi Bidang Program Lainnya
                                </h2>
                            </div>
                            <Link
                                href="/bidang"
                                prefetch={false}
                                className="hidden items-center gap-1.5 font-poppins text-xs font-semibold text-[#087f8c] hover:text-[#14bace] sm:inline-flex"
                            >
                                <span>Semua Bidang</span>
                                <ArrowRight className="size-3.5" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {bidangLainnya.map((other) => {
                                const OtherIcon = getBidangIcon(other.kode);
                                return (
                                    <Link
                                        key={other.id}
                                        href={`/bidang/${other.kode}`}
                                        prefetch={false}
                                        className="group flex flex-col justify-between rounded-2xl border border-[#e4eaec] bg-white p-6 shadow-xs transition-all duration-200 hover:border-[#14bace] hover:shadow-md"
                                    >
                                        <div>
                                            <div className="flex size-11 items-center justify-center rounded-xl bg-[#e8f8fa] text-[#14bace] transition-transform group-hover:scale-110">
                                                <OtherIcon className="size-5" />
                                            </div>
                                            <h3 className="mt-4 font-poppins text-base font-bold text-[#1d2b2d] transition-colors group-hover:text-[#14bace]">
                                                {other.nama}
                                            </h3>
                                            <p className="mt-1.5 line-clamp-2 font-sans text-xs leading-relaxed text-gray-600">
                                                {other.deskripsi}
                                            </p>
                                        </div>

                                        <div className="mt-4 inline-flex items-center gap-1.5 font-poppins text-xs font-semibold text-[#14bace] group-hover:text-[#087f8c]">
                                            <span>Lihat Detail Bidang</span>
                                            <ArrowRight className="size-3.5" />
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}
        </PublicLayout>
    );
}

