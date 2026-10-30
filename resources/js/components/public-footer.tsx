import { Link } from '@inertiajs/react';
import { Facebook, Instagram, Linkedin, Twitter, MapPin, Mail, Phone, Heart } from 'lucide-react';

export default function PublicFooter() {
    return (
        <footer className="w-full bg-[#1b2124] text-white pt-16 pb-8 border-t border-[#293236]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Main Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-[#2e373b]">
                    {/* Brand Column */}
                    <div className="lg:col-span-5 flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <div className="size-10 rounded-full bg-[#14bace] flex items-center justify-center text-white font-bold text-sm tracking-wider shadow-sm">
                                GM
                            </div>
                            <span className="font-poppins font-bold text-xl text-white tracking-wide">
                                Yayasan Geliyat
                            </span>
                        </div>
                        <p className="font-sans text-sm text-gray-300 leading-relaxed max-w-md">
                            Mengemban misi kemanusiaan berkelanjutan untuk mewujudkan kesejahteraan sosial melalui sinergi pendidikan bermartabat dan aksi kemitraan strategis bagi anak yatim.
                        </p>
                        <div className="flex items-center gap-2 pt-2 text-xs text-[#14bace] font-medium">
                            <Heart className="size-4 fill-current text-[#14bace]" />
                            <span>Yayasan Geliyat Mahdiesa Nahate</span>
                        </div>
                    </div>

                    {/* Column 1: Program Bantuan */}
                    <div className="lg:col-span-2 flex flex-col gap-4">
                        <h4 className="font-poppins font-bold text-xs uppercase tracking-wider text-[#14bace]">
                            Program Bantuan
                        </h4>
                        <ul className="flex flex-col gap-2.5 text-sm text-gray-300">
                            <li>
                                <Link href="/bidang" className="hover:text-white hover:underline transition-colors">
                                    Bimbel Sinar (SD)
                                </Link>
                            </li>
                            <li>
                                <Link href="/bidang" className="hover:text-white hover:underline transition-colors">
                                    Santunan Rutin
                                </Link>
                            </li>
                            <li>
                                <Link href="/bidang" className="hover:text-white hover:underline transition-colors">
                                    Orang Tua Asuh
                                </Link>
                            </li>
                            <li>
                                <Link href="/bidang" className="hover:text-white hover:underline transition-colors">
                                    Koperasi Berdaya
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 2: Tentang Kami */}
                    <div className="lg:col-span-2 flex flex-col gap-4">
                        <h4 className="font-poppins font-bold text-xs uppercase tracking-wider text-[#14bace]">
                            Tentang Kami
                        </h4>
                        <ul className="flex flex-col gap-2.5 text-sm text-gray-300">
                            <li>
                                <Link href="/profil" className="hover:text-white hover:underline transition-colors">
                                    Visi & Misi
                                </Link>
                            </li>
                            <li>
                                <Link href="/profil" className="hover:text-white hover:underline transition-colors">
                                    Struktur Pengurus
                                </Link>
                            </li>
                            <li>
                                <Link href="/kegiatan" className="hover:text-white hover:underline transition-colors">
                                    Dokumentasi Kegiatan
                                </Link>
                            </li>
                            <li>
                                <Link href="/anak-yatim" className="hover:text-white hover:underline transition-colors">
                                    Data Anak Binaan
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 3: Hubungi Kami */}
                    <div className="lg:col-span-3 flex flex-col gap-4">
                        <h4 className="font-poppins font-bold text-xs uppercase tracking-wider text-[#14bace]">
                            Hubungi Kami
                        </h4>
                        <div className="flex flex-col gap-3 text-sm text-gray-300">
                            <div className="flex items-start gap-2.5">
                                <MapPin className="size-4 shrink-0 text-[#14bace] mt-0.5" />
                                <span className="text-xs leading-relaxed">
                                    Jl. Kampung Baru Rt.02/05 No.42, Cigending, Kec. Ujungberung, Kota Bandung 40611
                                </span>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <Mail className="size-4 shrink-0 text-[#14bace]" />
                                <span className="text-xs">info@geliyat.or.id</span>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <Phone className="size-4 shrink-0 text-[#14bace]" />
                                <span className="text-xs">+62 821-2085-4460</span>
                            </div>

                            {/* Social Media Links */}
                            <div className="flex items-center gap-3 pt-2">
                                <a
                                    href="https://facebook.com"
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label="Facebook Geliyat"
                                    className="size-8 rounded-lg bg-[#273034] hover:bg-[#14bace] hover:text-white flex items-center justify-center text-gray-300 transition-colors"
                                >
                                    <Facebook className="size-4" />
                                </a>
                                <a
                                    href="https://instagram.com"
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label="Instagram Geliyat"
                                    className="size-8 rounded-lg bg-[#273034] hover:bg-[#14bace] hover:text-white flex items-center justify-center text-gray-300 transition-colors"
                                >
                                    <Instagram className="size-4" />
                                </a>
                                <a
                                    href="https://linkedin.com"
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label="LinkedIn Geliyat"
                                    className="size-8 rounded-lg bg-[#273034] hover:bg-[#14bace] hover:text-white flex items-center justify-center text-gray-300 transition-colors"
                                >
                                    <Linkedin className="size-4" />
                                </a>
                                <a
                                    href="https://twitter.com"
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label="Twitter Geliyat"
                                    className="size-8 rounded-lg bg-[#273034] hover:bg-[#14bace] hover:text-white flex items-center justify-center text-gray-300 transition-colors"
                                >
                                    <Twitter className="size-4" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Row */}
                <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
                    <p>
                        © 2026 Yayasan Geliyat Mahdiesa Nahate. Hak Cipta Dilindungi Undang-Undang.
                    </p>
                    <p className="font-poppins font-semibold tracking-wider text-[#14bace]">
                        BERSAMA PEDULI YATIM
                    </p>
                </div>
            </div>
        </footer>
    );
}

