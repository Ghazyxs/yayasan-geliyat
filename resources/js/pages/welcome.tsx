import { Head, Link } from '@inertiajs/react';
import { ArrowRight, BookOpen, Heart, Users, Sparkles, HandHeart } from 'lucide-react';
import PublicLayout from '@/layouts/public-layout';

export default function Welcome() {
    return (
        <PublicLayout>
            <Head title="Yayasan Geliyat Mahdiesa Nahate - Gerakan Peduli Yatim" />

            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-b from-[#eef9fa] via-[#f7fcfd] to-[#fbfdfd] py-16 sm:py-24 border-b border-[#e4eaec]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        {/* Text Content */}
                        <div className="lg:col-span-7 flex flex-col items-start">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#14bace]/10 text-[#087f8c] font-poppins text-xs font-semibold uppercase tracking-wider mb-6">
                                <Sparkles className="size-3.5" />
                                <span>Amanah & Peduli Yatim</span>
                            </div>

                            <h1 className="font-poppins font-bold text-3xl sm:text-5xl lg:text-6xl text-[#1d2b2d] leading-[1.15] tracking-tight">
                                Bersama untuk <br />
                                <span className="text-[#14bace]">Masa Depan</span> Mereka
                            </h1>

                            <p className="mt-6 font-sans text-base sm:text-lg text-gray-600 leading-relaxed max-w-xl">
                                Yayasan Geliyat hadir untuk mendampingi anak-anak yatim melalui pendidikan bermartabat, pembinaan karakter, dan berbagai program kemanusiaan di wilayah Ujungberung, Kota Bandung.
                            </p>

                            <div className="mt-8 flex flex-wrap items-center gap-4">
                                <Link
                                    href="/donasi"
                                    className="bg-[#14bace] hover:bg-[#087f8c] active:scale-95 text-white font-poppins font-semibold text-base px-6 py-3.5 rounded-xl flex items-center gap-2.5 shadow-md shadow-[#14bace]/20 transition-all duration-150"
                                >
                                    <span>Donasi Sekarang</span>
                                    <ArrowRight className="size-4" />
                                </Link>

                                <Link
                                    href="/profil"
                                    className="bg-white hover:bg-gray-50 border border-[#e4eaec] text-[#1d2b2d] font-poppins font-medium text-base px-6 py-3.5 rounded-xl transition-colors duration-150 shadow-sm"
                                >
                                    <span>Lihat Profil Kami</span>
                                </Link>
                            </div>

                            {/* Trust Stats Indicator */}
                            <div className="mt-12 pt-8 border-t border-[#e4eaec]/60 w-full grid grid-cols-3 gap-6">
                                <div>
                                    <p className="font-poppins font-bold text-2xl sm:text-3xl text-[#14bace]">420+</p>
                                    <p className="font-sans text-xs text-gray-500 mt-0.5">Anak Yatim Binaan</p>
                                </div>
                                <div>
                                    <p className="font-poppins font-bold text-2xl sm:text-3xl text-[#186972]">5</p>
                                    <p className="font-sans text-xs text-gray-500 mt-0.5">Kelurahan Binaan</p>
                                </div>
                                <div>
                                    <p className="font-poppins font-bold text-2xl sm:text-3xl text-[#1d2b2d]">4</p>
                                    <p className="font-sans text-xs text-gray-500 mt-0.5">Pilar Program Utama</p>
                                </div>
                            </div>
                        </div>

                        {/* Visual Card / Illustration */}
                        <div className="lg:col-span-5 flex justify-center">
                            <div className="relative w-full max-w-md">
                                <div className="absolute -inset-1 bg-gradient-to-r from-[#14bace] to-[#186972] rounded-3xl blur-xl opacity-20"></div>
                                <div className="relative rounded-2xl bg-white border border-[#e4eaec] p-6 shadow-xl">
                                    <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
                                        <div className="size-14 rounded-xl bg-[#e8f8fa] flex items-center justify-center text-[#14bace]">
                                            <HandHeart className="size-7" />
                                        </div>
                                        <div>
                                            <h3 className="font-poppins font-bold text-base text-[#1d2b2d]">
                                                Gerakan Peduli Yatim
                                            </h3>
                                            <p className="text-xs text-gray-500 font-sans">
                                                Ujungberung, Kota Bandung
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-4 space-y-3">
                                        <div className="p-3 rounded-xl bg-[#f7fcfd] border border-[#e4eaec]/60 flex items-center gap-3">
                                            <BookOpen className="size-5 text-[#14bace] shrink-0" />
                                            <div>
                                                <p className="text-xs font-semibold text-[#1d2b2d]">Bimbel Sinar</p>
                                                <p className="text-[11px] text-gray-500">Pendampingan belajar & latihan soal siswa</p>
                                            </div>
                                        </div>
                                        <div className="p-3 rounded-xl bg-[#f7fcfd] border border-[#e4eaec]/60 flex items-center gap-3">
                                            <Heart className="size-5 text-[#186972] shrink-0" />
                                            <div>
                                                <p className="text-xs font-semibold text-[#1d2b2d]">Santunan & Orang Tua Asuh</p>
                                                <p className="text-[11px] text-gray-500">Mulai Rp10.000/bulan untuk satu anak</p>
                                            </div>
                                        </div>
                                        <div className="p-3 rounded-xl bg-[#f7fcfd] border border-[#e4eaec]/60 flex items-center gap-3">
                                            <Users className="size-5 text-[#087f8c] shrink-0" />
                                            <div>
                                                <p className="text-xs font-semibold text-[#1d2b2d]">Pembinaan & Keagamaan</p>
                                                <p className="text-[11px] text-gray-500">Bina orang tua yatim & pengajian remaja</p>
                                            </div>
                                        </div>
                                    </div>

                                    <Link
                                        href="/donasi"
                                        className="mt-6 w-full py-3 rounded-xl bg-[#14bace] hover:bg-[#087f8c] text-white font-poppins font-semibold text-sm flex items-center justify-center gap-2 transition"
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
            <section className="py-16 sm:py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto">
                        <span className="text-xs font-bold text-[#14bace] uppercase tracking-wider font-poppins">
                            Fokus & Dedikasi
                        </span>
                        <h2 className="mt-2 text-3xl font-bold font-poppins text-[#1d2b2d]">
                            Empat Program di Geliyat
                        </h2>
                        <p className="mt-3 text-sm text-gray-600 font-sans">
                            Empat bidang program untuk mendukung tumbuh kembang anak yatim secara holistik dan berkelanjutan.
                        </p>
                    </div>

                    <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* 1. Pendidikan */}
                        <div className="group rounded-2xl border border-[#e4eaec] bg-[#fbfdfd] p-6 hover:shadow-lg hover:border-[#14bace]/40 transition-all duration-200">
                            <div className="size-12 rounded-xl bg-[#e8f8fa] flex items-center justify-center text-[#14bace] group-hover:scale-110 transition-transform">
                                <BookOpen className="size-6" />
                            </div>
                            <h3 className="mt-5 font-poppins font-bold text-lg text-[#1d2b2d]">
                                Pendidikan
                            </h3>
                            <p className="mt-2 text-xs text-gray-600 leading-relaxed font-sans">
                                Pendampingan belajar Bimbel Sinar, modul belajar, penguatan tajwid, beasiswa prestasi, dan program Geliyat Mensarjanakan.
                            </p>
                            <Link href="/bidang" className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#14bace] hover:text-[#087f8c]">
                                <span>Lihat Selengkapnya</span>
                                <ArrowRight className="size-3" />
                            </Link>
                        </div>

                        {/* 2. Keagamaan */}
                        <div className="group rounded-2xl border border-[#e4eaec] bg-[#fbfdfd] p-6 hover:shadow-lg hover:border-[#14bace]/40 transition-all duration-200">
                            <div className="size-12 rounded-xl bg-[#e8f8fa] flex items-center justify-center text-[#186972] group-hover:scale-110 transition-transform">
                                <Users className="size-6" />
                            </div>
                            <h3 className="mt-5 font-poppins font-bold text-lg text-[#1d2b2d]">
                                Keagamaan
                            </h3>
                            <p className="mt-2 text-xs text-gray-600 leading-relaxed font-sans">
                                Pembinaan mental dan rohani, Binatulya (Bina Orang Tua Yatim), Gemar (Gerakan Mengaji Remaja), dan kegiatan Turwil silaturahmi.
                            </p>
                            <Link href="/bidang" className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#14bace] hover:text-[#087f8c]">
                                <span>Lihat Selengkapnya</span>
                                <ArrowRight className="size-3" />
                            </Link>
                        </div>

                        {/* 3. Kemanusiaan */}
                        <div className="group rounded-2xl border border-[#e4eaec] bg-[#fbfdfd] p-6 hover:shadow-lg hover:border-[#14bace]/40 transition-all duration-200">
                            <div className="size-12 rounded-xl bg-[#e8f8fa] flex items-center justify-center text-[#14bace] group-hover:scale-110 transition-transform">
                                <Heart className="size-6" />
                            </div>
                            <h3 className="mt-5 font-poppins font-bold text-lg text-[#1d2b2d]">
                                Kemanusiaan
                            </h3>
                            <p className="mt-2 text-xs text-gray-600 leading-relaxed font-sans">
                                Santunan bulanan rutin, santunan paket lebaran & munggahan, pendataan validasi anak yatim, dan program Ulin Bareng Anak Yatim (UBAY).
                            </p>
                            <Link href="/bidang" className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#14bace] hover:text-[#087f8c]">
                                <span>Lihat Selengkapnya</span>
                                <ArrowRight className="size-3" />
                            </Link>
                        </div>

                        {/* 4. Ekonomi & Koperasi */}
                        <div className="group rounded-2xl border border-[#e4eaec] bg-[#fbfdfd] p-6 hover:shadow-lg hover:border-[#14bace]/40 transition-all duration-200">
                            <div className="size-12 rounded-xl bg-[#e8f8fa] flex items-center justify-center text-[#087f8c] group-hover:scale-110 transition-transform">
                                <Sparkles className="size-6" />
                            </div>
                            <h3 className="mt-5 font-poppins font-bold text-lg text-[#1d2b2d]">
                                Ekonomi Koperasi
                            </h3>
                            <p className="mt-2 text-xs text-gray-600 leading-relaxed font-sans">
                                Pemberdayaan ekonomi mandiri orang tua yatim (Ummu Geliyat) melalui koperasi sembako dan layanan simpan pinjam anggota yayasan.
                            </p>
                            <Link href="/bidang" className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#14bace] hover:text-[#087f8c]">
                                <span>Lihat Selengkapnya</span>
                                <ArrowRight className="size-3" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
