import { Link } from '@inertiajs/react';
import { Instagram, MapPin, Mail, Phone, Heart } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';

export default function PublicFooter() {
    const { t } = useLanguage();

    return (
        <footer className="w-full border-t border-[#293236] bg-[#1b2124] pt-16 pb-8 text-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Main Row */}
                <div className="grid grid-cols-1 gap-10 border-b border-[#2e373b] pb-12 md:grid-cols-2 lg:grid-cols-12">
                    {/* Brand Column */}
                    <div className="flex flex-col gap-4 lg:col-span-4">
                        <div className="flex items-center gap-3">
                            <img
                                src="/images/logo.png"
                                alt="Logo Yayasan Geliyat"
                                loading="lazy"
                                decoding="async"
                                className="size-11 rounded-lg object-contain"
                            />
                            <span className="font-poppins text-lg font-bold tracking-wide text-white">
                                Yayasan Geliyat Mahdiesa Nahate
                            </span>
                        </div>
                        <p className="max-w-md font-sans text-sm leading-relaxed text-gray-300">
                            {t(
                                'Amanah, profesional, dan berkelanjutan dalam membina serta memberdayakan anak yatim dan ibu yatim agar tumbuh menjadi generasi yang beriman, berilmu, mandiri, dan bermanfaat bagi masyarakat.',
                                'Trustworthy, professional, and sustainable in mentoring and empowering orphans and mothers of orphans to grow into a faithful, knowledgeable, independent, and beneficial generation for society.',
                            )}
                        </p>
                        <div className="flex items-center gap-2 pt-2 text-xs font-medium text-[#14bace]">
                            <Heart className="size-4 fill-current text-[#14bace]" />
                            <span>
                                {t(
                                    'Sebaik-baiknya manusia adalah yang paling bermanfaat bagi orang lain',
                                    'The best of people are those who bring the most benefit to others',
                                )}
                            </span>
                        </div>
                    </div>

                    {/* Column 1: Bidang & Program */}
                    <div className="flex flex-col gap-4 lg:col-span-2">
                        <h4 className="font-poppins text-xs font-bold tracking-wider text-[#14bace] uppercase">
                            {t('Bidang Program', 'Program Divisions')}
                        </h4>
                        <ul className="flex flex-col gap-2.5 text-sm text-gray-300">
                            <li>
                                <Link
                                    href="/bidang/pendidikan"
                                    prefetch={false}
                                    className="transition-colors hover:text-white hover:underline"
                                >
                                    {t(
                                        'BINAYA (Pendidikan)',
                                        'BINAYA (Education)',
                                    )}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/bidang/keagamaan"
                                    prefetch={false}
                                    className="transition-colors hover:text-white hover:underline"
                                >
                                    {t(
                                        'BINATUYA (Keagamaan)',
                                        'BINATUYA (Religious)',
                                    )}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/bidang/kemanusiaan"
                                    prefetch={false}
                                    className="transition-colors hover:text-white hover:underline"
                                >
                                    {t(
                                        'SATIN & UBAY (Kemanusiaan)',
                                        'SATIN & UBAY (Humanitarian)',
                                    )}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/bidang/ekonomi"
                                    prefetch={false}
                                    className="transition-colors hover:text-white hover:underline"
                                >
                                    {t(
                                        'Pengembangan Ekonomi',
                                        'Economic Development',
                                    )}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 2: Tentang Kami */}
                    <div className="flex flex-col gap-4 lg:col-span-2">
                        <h4 className="font-poppins text-xs font-bold tracking-wider text-[#14bace] uppercase">
                            {t('Tentang Kami', 'About Us')}
                        </h4>
                        <ul className="flex flex-col gap-2.5 text-sm text-gray-300">
                            <li>
                                <Link
                                    href="/profil"
                                    className="transition-colors hover:text-white hover:underline"
                                >
                                    {t(
                                        'Profil, Visi & Misi',
                                        'Profile, Vision & Mission',
                                    )}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/bidang"
                                    className="transition-colors hover:text-white hover:underline"
                                >
                                    {t('Empat Bidang', 'Four Divisions')}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/kegiatan"
                                    className="transition-colors hover:text-white hover:underline"
                                >
                                    {t(
                                        'Kegiatan Yayasan',
                                        'Foundation Activities',
                                    )}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/laporan-tahunan"
                                    className="transition-colors hover:text-white hover:underline"
                                >
                                    {t('Laporan Tahunan', 'Annual Report')}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 3: Hubungi Kami */}
                    <div className="flex flex-col gap-4 lg:col-span-4">
                        <h4 className="font-poppins text-xs font-bold tracking-wider text-[#14bace] uppercase">
                            {t('Hubungi Kami', 'Contact Us')}
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
                                    href="https://www.instagram.com/geliyatmahdiesa/"
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label="Instagram Yayasan Geliyat Mahdiesa"
                                    className="inline-flex items-center gap-2.5 rounded-lg bg-[#273034] px-3.5 py-2 text-xs font-medium text-gray-200 transition-colors hover:bg-[#14bace] hover:text-white"
                                >
                                    <Instagram className="size-4" />
                                    <span>@geliyatmahdiesa</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Row */}
                <div className="flex flex-col items-center justify-between gap-4 pt-6 text-xs text-gray-400 sm:flex-row">
                    <p>
                        {t(
                            '© 2026 Yayasan Geliyat Mahdiesa Nahate. Hak Cipta Dilindungi Undang-Undang.',
                            '© 2026 Yayasan Geliyat Mahdiesa Nahate. All Rights Reserved.',
                        )}
                    </p>
                    <p className="font-poppins font-semibold tracking-wider text-[#14bace]">
                        {t(
                            'BERSAMA PEDULI YATIM',
                            'TOGETHER CARING FOR ORPHANS',
                        )}
                    </p>
                </div>
            </div>
        </footer>
    );
}
