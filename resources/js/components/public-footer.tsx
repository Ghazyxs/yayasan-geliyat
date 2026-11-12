import { Link } from '@inertiajs/react';
import {
    Facebook,
    Instagram,
    Linkedin,
    Twitter,
    MapPin,
    Mail,
    Phone,
    Heart,
} from 'lucide-react';

export default function PublicFooter() {
    return (
        <footer className="w-full border-t border-[#293236] bg-[#1b2124] pt-16 pb-8 text-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Main Row */}
                <div className="grid grid-cols-1 gap-10 border-b border-[#2e373b] pb-12 md:grid-cols-2 lg:grid-cols-12">
                    {/* Brand Column */}
                    <div className="flex flex-col gap-4 lg:col-span-5">
                        <div className="flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-full bg-[#14bace] text-sm font-bold tracking-wider text-white shadow-sm">
                                GM
                            </div>
                            <span className="font-poppins text-xl font-bold tracking-wide text-white">
                                Yayasan Geliyat
                            </span>
                        </div>
                        <p className="max-w-md font-sans text-sm leading-relaxed text-gray-300">
                            Mengemban misi kemanusiaan berkelanjutan untuk
                            mewujudkan kesejahteraan sosial melalui sinergi
                            pendidikan bermartabat dan aksi kemitraan strategis
                            bagi anak yatim.
                        </p>
                        <div className="flex items-center gap-2 pt-2 text-xs font-medium text-[#14bace]">
                            <Heart className="size-4 fill-current text-[#14bace]" />
                            <span>Yayasan Geliyat Mahdiesa Nahate</span>
                        </div>
                    </div>

                    {/* Column 1: Program Bantuan */}
                    <div className="flex flex-col gap-4 lg:col-span-2">
                        <h4 className="font-poppins text-xs font-bold tracking-wider text-[#14bace] uppercase">
                            Program Bantuan
                        </h4>
                        <ul className="flex flex-col gap-2.5 text-sm text-gray-300">
                            <li>
                                <Link
                                    href="/bidang/pendidikan"
                                    prefetch={false}
                                    className="transition-colors hover:text-white hover:underline"
                                >
                                    Bimbel Sinar (SD)
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/bidang/kemanusiaan"
                                    prefetch={false}
                                    className="transition-colors hover:text-white hover:underline"
                                >
                                    Santunan Rutin
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/bidang/keagamaan"
                                    prefetch={false}
                                    className="transition-colors hover:text-white hover:underline"
                                >
                                    Gemar & Tahfidz
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/bidang/ekonomi"
                                    prefetch={false}
                                    className="transition-colors hover:text-white hover:underline"
                                >
                                    Koperasi Berdaya
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 2: Tentang Kami */}
                    <div className="flex flex-col gap-4 lg:col-span-2">
                        <h4 className="font-poppins text-xs font-bold tracking-wider text-[#14bace] uppercase">
                            Tentang Kami
                        </h4>
                        <ul className="flex flex-col gap-2.5 text-sm text-gray-300">
                            <li>
                                <Link
                                    href="/profil"
                                    className="transition-colors hover:text-white hover:underline"
                                >
                                    Visi & Misi
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/profil"
                                    className="transition-colors hover:text-white hover:underline"
                                >
                                    Struktur Pengurus
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/kegiatan"
                                    className="transition-colors hover:text-white hover:underline"
                                >
                                    Dokumentasi Kegiatan
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/rekap-kegiatan"
                                    className="transition-colors hover:text-white hover:underline"
                                >
                                    Rekap Kegiatan Tahunan
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/anak-yatim"
                                    className="transition-colors hover:text-white hover:underline"
                                >
                                    Data Anak Binaan
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 3: Hubungi Kami */}
                    <div className="flex flex-col gap-4 lg:col-span-3">
                        <h4 className="font-poppins text-xs font-bold tracking-wider text-[#14bace] uppercase">
                            Hubungi Kami
                        </h4>
                        <div className="flex flex-col gap-3 text-sm text-gray-300">
                            <div className="flex items-start gap-2.5">
                                <MapPin className="mt-0.5 size-4 shrink-0 text-[#14bace]" />
                                <span className="text-xs leading-relaxed">
                                    Jl. Kampung Baru Rt.02/05 No.42, Cigending,
                                    Kec. Ujungberung, Kota Bandung 40611
                                </span>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <Mail className="size-4 shrink-0 text-[#14bace]" />
                                <span className="text-xs">
                                    info@geliyat.or.id
                                </span>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <Phone className="size-4 shrink-0 text-[#14bace]" />
                                <span className="text-xs">
                                    +62 821-2085-4460
                                </span>
                            </div>

                            {/* Social Media Links */}
                            <div className="flex items-center gap-3 pt-2">
                                <a
                                    href="https://facebook.com"
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label="Facebook Geliyat"
                                    className="flex size-8 items-center justify-center rounded-lg bg-[#273034] text-gray-300 transition-colors hover:bg-[#14bace] hover:text-white"
                                >
                                    <Facebook className="size-4" />
                                </a>
                                <a
                                    href="https://instagram.com"
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label="Instagram Geliyat"
                                    className="flex size-8 items-center justify-center rounded-lg bg-[#273034] text-gray-300 transition-colors hover:bg-[#14bace] hover:text-white"
                                >
                                    <Instagram className="size-4" />
                                </a>
                                <a
                                    href="https://linkedin.com"
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label="LinkedIn Geliyat"
                                    className="flex size-8 items-center justify-center rounded-lg bg-[#273034] text-gray-300 transition-colors hover:bg-[#14bace] hover:text-white"
                                >
                                    <Linkedin className="size-4" />
                                </a>
                                <a
                                    href="https://twitter.com"
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label="Twitter Geliyat"
                                    className="flex size-8 items-center justify-center rounded-lg bg-[#273034] text-gray-300 transition-colors hover:bg-[#14bace] hover:text-white"
                                >
                                    <Twitter className="size-4" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Row */}
                <div className="flex flex-col items-center justify-between gap-4 pt-6 text-xs text-gray-400 sm:flex-row">
                    <p>
                        © 2026 Yayasan Geliyat Mahdiesa Nahate. Hak Cipta
                        Dilindungi Undang-Undang.
                    </p>
                    <p className="font-poppins font-semibold tracking-wider text-[#14bace]">
                        BERSAMA PEDULI YATIM
                    </p>
                </div>
            </div>
        </footer>
    );
}
