import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    BookOpen,
    Heart,
    Users,
    Sparkles,
    MapPin,
    HandHeart,
    Calendar,
} from 'lucide-react';
import PublicLayout from '@/layouts/public-layout';
import { type BidangItem, getBidangIcon } from './public/bidang';
import { type KegiatanData } from './public/kegiatan';

interface WelcomeProps {
    bidangList?: BidangItem[];
    kegiatanTerbaru?: KegiatanData[];
}

export default function Welcome({
    bidangList = [],
    kegiatanTerbaru = [],
}: WelcomeProps) {
    return (
        <PublicLayout>
            <Head title="Yayasan Geliyat Mahdiesa Nahate - Gerakan Peduli Yatim" />

            {/* Hero Section */}
            <section className="relative overflow-hidden border-b border-[#e4eaec] bg-gradient-to-b from-[#eef9fa] via-[#f7fcfd] to-[#fbfdfd] py-16 sm:py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
                        {/* Text Content */}
                        <div className="flex flex-col items-start lg:col-span-7">
                            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#14bace]/10 px-3.5 py-1.5 font-poppins text-xs font-semibold tracking-wider text-[#087f8c] uppercase">
                                <Sparkles className="size-3.5" />
                                <span>Gerakan Peduli Yatim</span>
                            </div>

                            <h1 className="font-poppins text-3xl leading-[1.15] font-bold tracking-tight text-[#1d2b2d] sm:text-5xl lg:text-6xl">
                                Bersama untuk <br />
                                <span className="text-[#14bace]">
                                    Masa Depan
                                </span>{' '}
                                Mereka
                            </h1>

                            <p className="mt-6 max-w-xl font-sans text-base leading-relaxed text-gray-600 sm:text-lg">
                                Yayasan Geliyat hadir untuk mendampingi
                                anak-anak yatim melalui pendidikan bermartabat,
                                pembinaan karakter, dan berbagai program
                                kemanusiaan di wilayah Ujungberung, Kota
                                Bandung.
                            </p>

                            <div className="mt-8 flex flex-wrap items-center gap-4">
                                <Link
                                    href="/donasi"
                                    prefetch={false}
                                    className="flex items-center gap-2.5 rounded-xl bg-[#14bace] px-6 py-3.5 font-poppins text-base font-semibold text-white shadow-md shadow-[#14bace]/20 transition-all duration-150 hover:bg-[#087f8c] active:scale-95"
                                >
                                    <span>Donasi Sekarang</span>
                                    <ArrowRight className="size-4" />
                                </Link>

                                <Link
                                    href="/profil"
                                    prefetch={false}
                                    className="rounded-xl border border-[#e4eaec] bg-white px-6 py-3.5 font-poppins text-base font-medium text-[#1d2b2d] shadow-sm transition-colors duration-150 hover:bg-gray-50"
                                >
                                    <span>Lihat Profil Kami</span>
                                </Link>
                            </div>

                            {/* Trust Stats Indicator */}
                            <div className="mt-12 grid w-full grid-cols-3 gap-6 border-t border-[#e4eaec]/60 pt-8">
                                <div>
                                    <p className="font-poppins text-2xl font-bold text-[#14bace] sm:text-3xl">
                                        420+
                                    </p>
                                    <p className="mt-0.5 font-sans text-xs text-gray-500">
                                        Anak Yatim Binaan
                                    </p>
                                </div>
                                <div>
                                    <p className="font-poppins text-2xl font-bold text-[#186972] sm:text-3xl">
                                        5
                                    </p>
                                    <p className="mt-0.5 font-sans text-xs text-gray-500">
                                        Kelurahan Binaan
                                    </p>
                                </div>
                                <div>
                                    <p className="font-poppins text-2xl font-bold text-[#1d2b2d] sm:text-3xl">
                                        4
                                    </p>
                                    <p className="mt-0.5 font-sans text-xs text-gray-500">
                                        Pilar Program Utama
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Visual Card / Illustration */}
                        <div className="flex justify-center lg:col-span-5">
                            <div className="relative w-full max-w-md">
                                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-[#14bace] to-[#186972] opacity-20 blur-xl"></div>
                                <div className="relative rounded-2xl border border-[#e4eaec] bg-white p-6 shadow-xl">
                                    <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
                                        <div className="flex size-14 items-center justify-center rounded-xl bg-[#e8f8fa] text-[#14bace]">
                                            <HandHeart className="size-7" />
                                        </div>
                                        <div>
                                            <h3 className="font-poppins text-base font-bold text-[#1d2b2d]">
                                                Gerakan Peduli Yatim
                                            </h3>
                                            <p className="font-sans text-xs text-gray-500">
                                                Ujungberung, Kota Bandung
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-4 space-y-3">
                                        <Link
                                            href="/bidang/pendidikan"
                                            prefetch={false}
                                            className="flex items-center gap-3 rounded-xl border border-[#e4eaec]/60 bg-[#f7fcfd] p-3 transition hover:border-[#14bace]/50"
                                        >
                                            <BookOpen className="size-5 shrink-0 text-[#14bace]" />
                                            <div>
                                                <p className="text-xs font-semibold text-[#1d2b2d]">
                                                    Bimbel Sinar
                                                </p>
                                                <p className="text-[11px] text-gray-500">
                                                    Pendampingan belajar & modul
                                                    latihan siswa
                                                </p>
                                            </div>
                                        </Link>
                                        <Link
                                            href="/bidang/kemanusiaan"
                                            prefetch={false}
                                            className="flex items-center gap-3 rounded-xl border border-[#e4eaec]/60 bg-[#f7fcfd] p-3 transition hover:border-[#14bace]/50"
                                        >
                                            <Heart className="size-5 shrink-0 text-[#186972]" />
                                            <div>
                                                <p className="text-xs font-semibold text-[#1d2b2d]">
                                                    Santunan & Kemanusiaan
                                                </p>
                                                <p className="text-[11px] text-gray-500">
                                                    Santunan rutin bulanan &
                                                    bantuan sembako anak yatim
                                                </p>
                                            </div>
                                        </Link>
                                        <Link
                                            href="/bidang/keagamaan"
                                            prefetch={false}
                                            className="flex items-center gap-3 rounded-xl border border-[#e4eaec]/60 bg-[#f7fcfd] p-3 transition hover:border-[#14bace]/50"
                                        >
                                            <Users className="size-5 shrink-0 text-[#087f8c]" />
                                            <div>
                                                <p className="text-xs font-semibold text-[#1d2b2d]">
                                                    Pembinaan & Keagamaan
                                                </p>
                                                <p className="text-[11px] text-gray-500">
                                                    Bina orang tua yatim
                                                    (Binatulya) & pengajian
                                                    remaja
                                                </p>
                                            </div>
                                        </Link>
                                    </div>

                                    <Link
                                        href="/donasi"
                                        prefetch={false}
                                        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#14bace] py-3 font-poppins text-sm font-semibold text-white transition hover:bg-[#087f8c]"
                                    >
                                        <span>Salurkan Donasi</span>
                                        <ArrowRight className="size-4" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Program Utama Section */}
            <section className="border-b border-[#e4eaec] bg-[#d1f6fa]/30 py-16 sm:py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <span className="font-poppins text-xs font-bold tracking-wider text-[#14bace] uppercase">
                            Program Utama
                        </span>
                        <h2 className="mt-2 font-poppins text-3xl font-bold text-[#1d2b2d]">
                            Empat Program di Geliyat
                        </h2>
                        <p className="mt-3 font-sans text-sm text-gray-600">
                            Empat bidang program untuk mendukung tumbuh kembang
                            anak yatim secara holistik dan berkelanjutan.
                        </p>
                    </div>

                    <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {bidangList.map((bidang) => {
                            const IconComponent = getBidangIcon(bidang.kode);
                            return (
                                <Link
                                    key={bidang.id}
                                    href={`/bidang/${bidang.kode}`}
                                    prefetch={false}
                                    className="group flex flex-col justify-between rounded-2xl border border-[#e4eaec] bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#14bace]/40 hover:shadow-lg"
                                >
                                    <div>
                                        <div className="flex size-12 items-center justify-center rounded-xl bg-[#e8f8fa] text-[#14bace] transition-transform group-hover:scale-110">
                                            <IconComponent className="size-6" />
                                        </div>
                                        <h3 className="mt-5 font-poppins text-lg font-bold text-[#1d2b2d] transition-colors group-hover:text-[#14bace]">
                                            {bidang.nama}
                                        </h3>
                                        <p className="mt-2 font-sans text-xs leading-relaxed text-gray-600">
                                            {bidang.deskripsi}
                                        </p>
                                    </div>
                                    <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#14bace] group-hover:text-[#087f8c]">
                                        <span>Lihat Selengkapnya</span>
                                        <ArrowRight className="size-3" />
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Kegiatan Terbaru Section */}
            <section className="bg-white py-16 sm:py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-12 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                        <div>
                            <span className="font-poppins text-xs font-bold tracking-wider text-[#14bace] uppercase">
                                Berita & Dokumentasi
                            </span>
                            <h2 className="mt-2 font-poppins text-3xl font-bold text-[#1d2b2d]">
                                Kegiatan Terbaru
                            </h2>
                        </div>
                        <Link
                            href="/kegiatan"
                            prefetch={false}
                            className="inline-flex items-center gap-2 text-sm font-semibold text-[#14bace] transition-colors hover:text-[#087f8c]"
                        >
                            <span>Lihat Semua Kegiatan</span>
                            <ArrowRight className="size-4" />
                        </Link>
                    </div>

                    {kegiatanTerbaru.length === 0 ? (
                        <div className="rounded-2xl border border-[#e4eaec] bg-[#fbfdfd] p-8 text-center text-sm text-gray-500">
                            Belum ada kegiatan terbaru yang dipublikasikan.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                            {kegiatanTerbaru.map((act) => (
                                <Link
                                    key={act.id}
                                    href={`/kegiatan/${act.id}`}
                                    prefetch={false}
                                    className="group flex flex-col overflow-hidden rounded-2xl border border-[#e4eaec] bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#14bace]/50 hover:shadow-xl"
                                >
                                    <div className="relative h-44 w-full overflow-hidden bg-gray-100">
                                        <img
                                            src={act.gambar}
                                            alt={act.judul}
                                            className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                        <span className="absolute top-3 left-3 rounded-md bg-white/90 px-2.5 py-1 text-[10px] font-bold tracking-wider text-[#087f8c] uppercase shadow-xs">
                                            {act.kategori}
                                        </span>
                                    </div>
                                    <div className="flex flex-1 flex-col justify-between p-5">
                                        <div>
                                            <div className="mb-1.5 flex items-center gap-1.5 text-[11px] text-gray-400">
                                                <Calendar className="size-3 text-[#14bace]" />
                                                <span>
                                                    {act.tanggal_kegiatan}
                                                </span>
                                            </div>
                                            <h3 className="line-clamp-2 font-poppins text-base font-bold text-[#1d2b2d] transition-colors group-hover:text-[#14bace]">
                                                {act.judul}
                                            </h3>
                                            <p className="mt-2 line-clamp-3 font-sans text-xs leading-relaxed text-gray-600">
                                                {act.ringkasan ||
                                                    act.deskripsi}
                                            </p>
                                        </div>
                                        <div className="mt-4 flex items-center gap-1.5 border-t border-gray-100 pt-3 text-xs text-gray-500">
                                            <MapPin className="size-3.5 shrink-0 text-[#14bace]" />
                                            <span className="truncate">
                                                {act.lokasi}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </PublicLayout>
    );
}
