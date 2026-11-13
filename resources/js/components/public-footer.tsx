import { Link } from '@inertiajs/react';
import {
    Instagram,
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
                    <div className="flex flex-col gap-4 lg:col-span-4">
                        <div className="flex items-center gap-3">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#14bace] text-sm font-bold tracking-wider text-white shadow-sm">
                                GM
                            </div>
                            <span className="font-poppins text-lg font-bold tracking-wide text-white">
                                Yayasan Geliyat Mahdiesa Nahate
                            </span>
                        </div>
                        <p className="max-w-md font-sans text-sm leading-relaxed text-gray-300">
                            Amanah, profesional, dan berkelanjutan dalam membina
                            serta memberdayakan anak yatim dan ibu yatim agar
                            tumbuh menjadi generasi yang beriman, berilmu,
                            mandiri, dan bermanfaat bagi masyarakat.
                        </p>
                        <div className="flex items-center gap-2 pt-2 text-xs font-medium text-[#14bace]">
                            <Heart className="size-4 fill-current text-[#14bace]" />
                            <span>Sebaik-baiknya manusia adalah yang paling bermanfaat bagi orang lain</span>
                        </div>
                    </div>

                    {/* Column 1: Bidang & Program */}
                    <div className="flex flex-col gap-4 lg:col-span-2">
                        <h4 className="font-poppins text-xs font-bold tracking-wider text-[#14bace] uppercase">
                            Bidang Program
                        </h4>
                        <ul className="flex flex-col gap-2.5 text-sm text-gray-300">
                            <li>
                                <Link
                                    href="/bidang/pendidikan"
                                    prefetch={false}
                                    className="transition-colors hover:text-white hover:underline"
                                >
                                    BINAYA (Pendidikan)
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/bidang/keagamaan"
                                    prefetch={false}
                                    className="transition-colors hover:text-white hover:underline"
                                >
                                    BINATUYA (Keagamaan)
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/bidang/kemanusiaan"
                                    prefetch={false}
                                    className="transition-colors hover:text-white hover:underline"
                                >
                                    SATIN & UBAY (Kemanusiaan)
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/bidang/ekonomi"
                                    prefetch={false}
                                    className="transition-colors hover:text-white hover:underline"
                                >
                                    Pengembangan Ekonomi
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
                                    Profil, Visi & Misi
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/bidang"
                                    className="transition-colors hover:text-white hover:underline"
                                >
                                    Empat Bidang
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/kegiatan"
                                    className="transition-colors hover:text-white hover:underline"
                                >
                                    Kegiatan Yayasan
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/laporan-tahunan"
                                    className="transition-colors hover:text-white hover:underline"
                                >
                                    Laporan Tahunan
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
                    <div className="flex flex-col gap-4 lg:col-span-4">
                        <h4 className="font-poppins text-xs font-bold tracking-wider text-[#14bace] uppercase">
                            Hubungi Kami
                        </h4>
                        <div className="flex flex-col gap-3 text-sm text-gray-300">
                            <div className="flex items-start gap-2.5">
                                <MapPin className="mt-0.5 size-4 shrink-0 text-[#14bace]" />
                                <span className="text-xs leading-relaxed">
                                    Jl. Kampung Baru RT/RW 02/05 No.42, Kel.
                                    Cigending, Kec. Ujungberung, Kota Bandung,
                                    40611.
                                </span>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <Mail className="size-4 shrink-0 text-[#14bace]" />
                                <a
                                    href="mailto:geliyatmahdiesanahate@gmail.com"
                                    className="text-xs transition-colors hover:text-[#14bace] hover:underline"
                                >
                                    geliyatmahdiesanahate@gmail.com
                                </a>
                            </div>
                            <div className="flex items-start gap-2.5">
                                <Phone className="mt-0.5 size-4 shrink-0 text-[#14bace]" />
                                <div className="flex flex-col gap-1 text-xs">
                                    <a
                                        href="tel:+6282126854485"
                                        className="transition-colors hover:text-[#14bace] hover:underline"
                                    >
                                        +62 821-2685-4485 (Ibu Nina Mahdiah,
                                        S.Ag., M.Sos.)
                                    </a>
                                    <a
                                        href="tel:+6285797243161"
                                        className="transition-colors hover:text-[#14bace] hover:underline"
                                    >
                                        +62 857-9724-3161 (Juaningsih)
                                    </a>
                                </div>
                            </div>

                            {/* Instagram Link */}
                            <div className="pt-2">
                                <a
                                    href="https://www.instagram.com/geliyatmahdiesanahate/"
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label="Instagram Yayasan Geliyat Mahdiesa Nahate"
                                    className="inline-flex items-center gap-2.5 rounded-lg bg-[#273034] px-3.5 py-2 text-xs font-medium text-gray-200 transition-colors hover:bg-[#14bace] hover:text-white"
                                >
                                    <Instagram className="size-4" />
                                    <span>@Geliyat MahdiesaNahate</span>
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
