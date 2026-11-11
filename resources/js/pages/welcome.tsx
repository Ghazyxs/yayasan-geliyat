import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    BookOpen,
    Heart,
    Users,
    Sparkles,
    MapPin,
    HandHeart,
} from 'lucide-react';
import PublicLayout from '@/layouts/public-layout';

export default function Welcome() {
    const activities = [
        {
            title: 'Bimbel Sinar ',
            category: 'Pendidikan',
            description:
                'Kegiatan bimbingan belajar bagi anak-anak sekolah dasar kelas 1–6 untuk mendukung proses belajar dan meningkatkan pemahaman materi pelajaran.',
            location: 'Jl. Ujung Berung',
            image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800&auto=format&fit=crop',
        },
        {
            title: 'Ulin Bareng Anak Yatim (UBAY)',
            category: 'Kemanusiaan',
            description:
                'Kegiatan kebersamaan dan rekreasi yang memberikan kesempatan bagi anak-anak yatim untuk belajar, bermain, dan membangun pengalaman bersama.',
            location: 'Jl. Pantai Pangandaran',
            image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=800&auto=format&fit=crop',
        },
        {
            title: 'Santunan Rutin Anak Yatim',
            category: 'Kemanusiaan',
            description:
                'Program bantuan sosial bagi anak yatim dan keluarganya melalui santunan rutin bulanan maupun santunan hari raya.',
            location: 'Masjid Besar Ujungberung',
            image: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=800&auto=format&fit=crop',
        },
        {
            title: 'Gemar — Mengaji Anak Remaja',
            category: 'Keagamaan',
            description:
                "Kegiatan pembelajaran keagamaan bagi anak usia SMP dan SMA untuk mendukung pembinaan serta pengembangan kemampuan membaca Al-Qur'an.",
            location: 'Jl. Ujung Berung',
            image: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?q=80&w=800&auto=format&fit=crop',
        },
    ];

    return (
        <PublicLayout>
            <Head title="Yayasan Geliyat Mahdiesa Nahate - Gerakan Peduli Yatim" />

            {/* Hero Section */}
            <section className="relative overflow-hidden border-b border-[#e4eaec] bg-gradient-to-b from-[#eef9fa] via-[#f7fcfd] to-[#fbfdfd] py-16 sm:py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" >
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
                                    className="flex items-center gap-2.5 rounded-xl bg-[#14bace] px-6 py-3.5 font-poppins text-base font-semibold text-white shadow-md shadow-[#14bace]/20 transition-all duration-150 hover:bg-[#087f8c] active:scale-95"
                                >
                                    <span>Donasi Sekarang</span>
                                    <ArrowRight className="size-4" />
                                </Link>

                                <Link
                                    href="/profil"
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
                                        <div className="flex items-center gap-3 rounded-xl border border-[#e4eaec]/60 bg-[#f7fcfd] p-3">
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
                                        </div>
                                        <div className="flex items-center gap-3 rounded-xl border border-[#e4eaec]/60 bg-[#f7fcfd] p-3">
                                            <Heart className="size-5 shrink-0 text-[#186972]" />
                                            <div>
                                                <p className="text-xs font-semibold text-[#1d2b2d]">
                                                    Santunan & Orang Tua Asuh
                                                </p>
                                                <p className="text-[11px] text-gray-500">
                                                    Mulai Rp10.000/bulan untuk
                                                    satu anak
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 rounded-xl border border-[#e4eaec]/60 bg-[#f7fcfd] p-3">
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
                                        </div>
                                    </div>

                                    <Link
                                        href="/donasi"
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
                        {/* 1. Pendidikan */}
                        <div className="group flex flex-col justify-between rounded-2xl border border-[#e4eaec] bg-white p-6 shadow-sm transition-all duration-200 hover:border-[#14bace]/40 hover:shadow-lg">
                            <div>
                                <div className="flex size-12 items-center justify-center rounded-xl bg-[#e8f8fa] text-[#14bace] transition-transform group-hover:scale-110">
                                    <BookOpen className="size-6" />
                                </div>
                                <h3 className="mt-5 font-poppins text-lg font-bold text-[#1d2b2d]">
                                    Pendidikan
                                </h3>
                                <p className="mt-2 font-sans text-xs leading-relaxed text-gray-600">
                                    Mendukung pendidikan anak yatim melalui
                                    bimbingan belajar, pembinaan, beasiswa, dan
                                    bantuan pendidikan untuk mengembangkan
                                    potensi mereka.
                                </p>
                            </div>
                            <Link
                                href="/bidang"
                                className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#14bace] hover:text-[#087f8c]"
                            >
                                <span>Lihat Selengkapnya</span>
                                <ArrowRight className="size-3" />
                            </Link>
                        </div>

                        {/* 2. Keagamaan */}
                        <div className="group flex flex-col justify-between rounded-2xl border border-[#e4eaec] bg-white p-6 shadow-sm transition-all duration-200 hover:border-[#14bace]/40 hover:shadow-lg">
                            <div>
                                <div className="flex size-12 items-center justify-center rounded-xl bg-[#e8f8fa] text-[#186972] transition-transform group-hover:scale-110">
                                    <Users className="size-6" />
                                </div>
                                <h3 className="mt-5 font-poppins text-lg font-bold text-[#1d2b2d]">
                                    Keagamaan
                                </h3>
                                <p className="mt-2 font-sans text-xs leading-relaxed text-gray-600">
                                    Mendukung pembinaan keagamaan melalui
                                    kegiatan mengaji anak remaja (Gemar), kajian
                                    tajwid, dan penguatan spiritual bagi
                                    keluarga yatim.
                                </p>
                            </div>
                            <Link
                                href="/bidang"
                                className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#14bace] hover:text-[#087f8c]"
                            >
                                <span>Lihat Selengkapnya</span>
                                <ArrowRight className="size-3" />
                            </Link>
                        </div>

                        {/* 3. Kemanusiaan */}
                        <div className="group flex flex-col justify-between rounded-2xl border border-[#e4eaec] bg-white p-6 shadow-sm transition-all duration-200 hover:border-[#14bace]/40 hover:shadow-lg">
                            <div>
                                <div className="flex size-12 items-center justify-center rounded-xl bg-[#e8f8fa] text-[#14bace] transition-transform group-hover:scale-110">
                                    <Heart className="size-6" />
                                </div>
                                <h3 className="mt-5 font-poppins text-lg font-bold text-[#1d2b2d]">
                                    Kemanusiaan
                                </h3>
                                <p className="mt-2 font-sans text-xs leading-relaxed text-gray-600">
                                    Memberikan santunan rutin bulanan, paket
                                    sembako munggahan & hari raya, serta bantuan
                                    darurat bagi anak yatim yang membutuhkan.
                                </p>
                            </div>
                            <Link
                                href="/bidang"
                                className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#14bace] hover:text-[#087f8c]"
                            >
                                <span>Lihat Selengkapnya</span>
                                <ArrowRight className="size-3" />
                            </Link>
                        </div>

                        {/* 4. Ekonomi & Koperasi */}
                        <div className="group flex flex-col justify-between rounded-2xl border border-[#e4eaec] bg-white p-6 shadow-sm transition-all duration-200 hover:border-[#14bace]/40 hover:shadow-lg">
                            <div>
                                <div className="flex size-12 items-center justify-center rounded-xl bg-[#e8f8fa] text-[#087f8c] transition-transform group-hover:scale-110">
                                    <Sparkles className="size-6" />
                                </div>
                                <h3 className="mt-5 font-poppins text-lg font-bold text-[#1d2b2d]">
                                    Ekonomi & Koperasi
                                </h3>
                                <p className="mt-2 font-sans text-xs leading-relaxed text-gray-600">
                                    Mendorong kemandirian ekonomi orang tua asuh
                                    / Ummu Geliyat melalui pengelolaan koperasi
                                    sembako dan layanan simpan pinjam anggota.
                                </p>
                            </div>
                            <Link
                                href="/bidang"
                                className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#14bace] hover:text-[#087f8c]"
                            >
                                <span>Lihat Selengkapnya</span>
                                <ArrowRight className="size-3" />
                            </Link>
                        </div>
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
                            className="inline-flex items-center gap-2 text-sm font-semibold text-[#14bace] transition-colors hover:text-[#087f8c]"
                        >
                            <span>Lihat Semua Kegiatan</span>
                            <ArrowRight className="size-4" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                        {activities.map((act) => (
                            <div
                                key={act.title}
                                className="group flex flex-col overflow-hidden rounded-2xl border border-[#e4eaec] bg-white shadow-sm transition-all duration-200 hover:shadow-xl"
                            >
                                <div className="relative h-44 w-full overflow-hidden bg-gray-100">
                                    <img
                                        src={act.image}
                                        alt={act.title}
                                        className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                    <span className="absolute top-3 left-3 rounded-md bg-white/90 px-2.5 py-1 text-[10px] font-bold tracking-wider text-[#087f8c] uppercase shadow-xs">
                                        {act.category}
                                    </span>
                                </div>
                                <div className="flex flex-1 flex-col justify-between p-5">
                                    <div>
                                        <h3 className="line-clamp-2 font-poppins text-base font-bold text-[#1d2b2d] transition-colors group-hover:text-[#14bace]">
                                            {act.title}
                                        </h3>
                                        <p className="mt-2 line-clamp-3 font-sans text-xs leading-relaxed text-gray-600">
                                            {act.description}
                                        </p>
                                    </div>
                                    <div className="mt-4 flex items-center gap-1.5 border-t border-gray-100 pt-3 text-xs text-gray-500">
                                        <MapPin className="size-3.5 shrink-0 text-[#14bace]" />
                                        <span className="truncate">
                                            {act.location}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
