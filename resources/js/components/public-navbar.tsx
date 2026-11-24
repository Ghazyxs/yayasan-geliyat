import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    Menu,
    X,
    LayoutDashboard,
    ChevronDown,
    Globe,
} from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';

interface NavItem {
    labelId: string;
    labelEn: string;
    href: string;
    match: string;
}

const navItems: NavItem[] = [
    { labelId: 'Beranda', labelEn: 'Home', href: '/', match: '/' },
    {
        labelId: 'Bidang',
        labelEn: 'Divisions',
        href: '/bidang',
        match: '/bidang',
    },
    {
        labelId: 'Kegiatan',
        labelEn: 'Activities',
        href: '/kegiatan',
        match: '/kegiatan',
    },
    {
        labelId: 'Profil',
        labelEn: 'Profile',
        href: '/profil',
        match: '/profil',
    },
    {
        labelId: 'Laporan Tahunan',
        labelEn: 'Annual Report',
        href: '/laporan-tahunan',
        match: '/laporan-tahunan',
    },
];

export default function PublicNavbar() {
    const { url } = usePage();
    const { auth } = usePage().props as unknown as {
        auth?: { user?: { name: string; role?: string } };
    };
    const { lang, setLang, t } = useLanguage();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [kegiatanDropdownOpen, setKegiatanDropdownOpen] = useState(false);
    const [profilDropdownOpen, setProfilDropdownOpen] = useState(false);
    const [mobileKegiatanOpen, setMobileKegiatanOpen] = useState(true);
    const [mobileProfilOpen, setMobileProfilOpen] = useState(true);

    const isCurrent = (match: string) => {
        if (match === '/') {
            return url === '/';
        }
        return url.startsWith(match);
    };

    const isKegiatanActive =
        url.startsWith('/kegiatan') || url.startsWith('/berita-umum');

    const isProfilActive =
        url === '/profil' || url.startsWith('/profil-pimpinan');

    return (
        <header className="sticky top-0 z-50 w-full border-b border-[#e4eaec] bg-white/95 backdrop-blur-md transition-all">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-20 items-center justify-between">
                    {/* Brand / Logo */}
                    <Link href="/" className="group flex items-center gap-3">
                        <img
                            src="/images/logo.png"
                            alt="Logo Yayasan Geliyat"
                            className="size-12 rounded-lg object-contain transition-transform group-hover:scale-105"
                        />
                        <div className="flex flex-col">
                            <span className="font-poppins text-lg leading-tight font-bold tracking-wide text-[#1d2b2d]">
                                GELIYAT
                            </span>
                            <span className="font-poppins text-[10px] leading-tight font-medium tracking-[2px] text-[#186972] uppercase">
                                {t(
                                    'Gerakan Peduli Yatim',
                                    'Orphan Care Movement',
                                )}
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Navigation Links */}
                    <nav className="hidden items-center gap-5 md:flex lg:gap-6 xl:gap-8">
                        {navItems.map((item) => {
                            const label = t(item.labelId, item.labelEn);

                            if (item.href === '/kegiatan') {
                                return (
                                    <div
                                        key={item.href}
                                        className="group relative flex flex-col items-center py-2"
                                        onMouseEnter={() =>
                                            setKegiatanDropdownOpen(true)
                                        }
                                        onMouseLeave={() =>
                                            setKegiatanDropdownOpen(false)
                                        }
                                    >
                                        <div className="flex cursor-pointer items-center gap-1">
                                            <Link
                                                href="/kegiatan"
                                                prefetch={false}
                                                className={`font-poppins text-sm whitespace-nowrap transition-colors duration-150 lg:text-base ${
                                                    isKegiatanActive
                                                        ? 'font-bold text-[#14bace]'
                                                        : 'font-medium text-[#1d2b2d] hover:text-[#14bace]'
                                                }`}
                                            >
                                                {label}
                                            </Link>
                                            <ChevronDown
                                                className={`size-3.5 transition-transform duration-200 ${
                                                    kegiatanDropdownOpen
                                                        ? 'rotate-180 text-[#14bace]'
                                                        : 'text-slate-400 group-hover:text-[#14bace]'
                                                }`}
                                            />
                                        </div>

                                        <span
                                            className={`absolute bottom-0 h-[3px] rounded-full transition-all duration-200 ${
                                                isKegiatanActive
                                                    ? 'w-6 bg-[#14bace] opacity-100'
                                                    : 'w-0 bg-[#14bace] opacity-0 group-hover:w-4 group-hover:opacity-60'
                                            }`}
                                        />

                                        {/* Dropdown Menu Kegiatan */}
                                        <div
                                            className={`absolute top-full left-1/2 z-50 w-60 -translate-x-1/2 pt-2 transition-all duration-150 ${
                                                kegiatanDropdownOpen
                                                    ? 'pointer-events-auto visible translate-y-0 opacity-100'
                                                    : 'pointer-events-none invisible -translate-y-1 opacity-0'
                                            }`}
                                        >
                                            <div className="rounded-2xl border border-[#e4eaec] bg-white p-2 shadow-xl ring-1 ring-black/5">
                                                <Link
                                                    href="/kegiatan"
                                                    prefetch={false}
                                                    onClick={() =>
                                                        setKegiatanDropdownOpen(
                                                            false,
                                                        )
                                                    }
                                                    className={`flex flex-col rounded-xl px-3.5 py-2.5 transition-colors ${
                                                        url.startsWith(
                                                            '/kegiatan',
                                                        )
                                                            ? 'bg-[#e8f8fa] text-[#087f8c]'
                                                            : 'text-[#1d2b2d] hover:bg-slate-50'
                                                    }`}
                                                >
                                                    <span className="font-poppins text-xs font-bold">
                                                        {t(
                                                            'Berita Kegiatan',
                                                            'Activity News',
                                                        )}
                                                    </span>
                                                    <span className="text-[11px] text-slate-500">
                                                        {t(
                                                            'Aktivitas dan program yayasan.',
                                                            'Foundation activities and programs.',
                                                        )}
                                                    </span>
                                                </Link>
                                                <div className="my-1 border-t border-slate-100" />
                                                <Link
                                                    href="/berita-umum"
                                                    prefetch={false}
                                                    onClick={() =>
                                                        setKegiatanDropdownOpen(
                                                            false,
                                                        )
                                                    }
                                                    className={`flex flex-col rounded-xl px-3.5 py-2.5 transition-colors ${
                                                        url.startsWith(
                                                            '/berita-umum',
                                                        )
                                                            ? 'bg-[#e8f8fa] text-[#087f8c]'
                                                            : 'text-[#1d2b2d] hover:bg-slate-50'
                                                    }`}
                                                >
                                                    <span className="font-poppins text-xs font-bold">
                                                        {t(
                                                            'Berita Umum',
                                                            'General News',
                                                        )}
                                                    </span>
                                                    <span className="text-[11px] text-slate-500">
                                                        {t(
                                                            'Artikel, informasi, dan pengumuman.',
                                                            'Articles, information, and announcements.',
                                                        )}
                                                    </span>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }

                            if (item.href === '/profil') {
                                return (
                                    <div
                                        key={item.href}
                                        className="group relative flex flex-col items-center py-2"
                                        onMouseEnter={() =>
                                            setProfilDropdownOpen(true)
                                        }
                                        onMouseLeave={() =>
                                            setProfilDropdownOpen(false)
                                        }
                                    >
                                        <div className="flex cursor-pointer items-center gap-1">
                                            <Link
                                                href="/profil"
                                                prefetch={false}
                                                className={`font-poppins text-sm whitespace-nowrap transition-colors duration-150 lg:text-base ${
                                                    isProfilActive
                                                        ? 'font-bold text-[#14bace]'
                                                        : 'font-medium text-[#1d2b2d] hover:text-[#14bace]'
                                                }`}
                                            >
                                                {label}
                                            </Link>
                                            <ChevronDown
                                                className={`size-3.5 transition-transform duration-200 ${
                                                    profilDropdownOpen
                                                        ? 'rotate-180 text-[#14bace]'
                                                        : 'text-slate-400 group-hover:text-[#14bace]'
                                                }`}
                                            />
                                        </div>

                                        <span
                                            className={`absolute bottom-0 h-[3px] rounded-full transition-all duration-200 ${
                                                isProfilActive
                                                    ? 'w-6 bg-[#14bace] opacity-100'
                                                    : 'w-0 bg-[#14bace] opacity-0 group-hover:w-4 group-hover:opacity-60'
                                            }`}
                                        />

                                        {/* Dropdown Menu Profil */}
                                        <div
                                            className={`absolute top-full left-1/2 z-50 w-60 -translate-x-1/2 pt-2 transition-all duration-150 ${
                                                profilDropdownOpen
                                                    ? 'pointer-events-auto visible translate-y-0 opacity-100'
                                                    : 'pointer-events-none invisible -translate-y-1 opacity-0'
                                            }`}
                                        >
                                            <div className="rounded-2xl border border-[#e4eaec] bg-white p-2 shadow-xl ring-1 ring-black/5">
                                                <Link
                                                    href="/profil"
                                                    prefetch={false}
                                                    onClick={() =>
                                                        setProfilDropdownOpen(
                                                            false,
                                                        )
                                                    }
                                                    className={`flex flex-col rounded-xl px-3.5 py-2.5 transition-colors ${
                                                        url === '/profil'
                                                            ? 'bg-[#e8f8fa] text-[#087f8c]'
                                                            : 'text-[#1d2b2d] hover:bg-slate-50'
                                                    }`}
                                                >
                                                    <span className="font-poppins text-xs font-bold">
                                                        {t(
                                                            'Profil Yayasan',
                                                            'Foundation Profile',
                                                        )}
                                                    </span>
                                                    <span className="text-[11px] text-slate-500">
                                                        {t(
                                                            'Visi, misi, dan latar belakang.',
                                                            'Vision, mission, and background.',
                                                        )}
                                                    </span>
                                                </Link>
                                                <div className="my-1 border-t border-slate-100" />
                                                <Link
                                                    href="/profil-pimpinan"
                                                    prefetch={false}
                                                    onClick={() =>
                                                        setProfilDropdownOpen(
                                                            false,
                                                        )
                                                    }
                                                    className={`flex flex-col rounded-xl px-3.5 py-2.5 transition-colors ${
                                                        url.startsWith(
                                                            '/profil-pimpinan',
                                                        )
                                                            ? 'bg-[#e8f8fa] text-[#087f8c]'
                                                            : 'text-[#1d2b2d] hover:bg-slate-50'
                                                    }`}
                                                >
                                                    <span className="font-poppins text-xs font-bold">
                                                        {t(
                                                            'Profil Pimpinan',
                                                            'Leadership Profile',
                                                        )}
                                                    </span>
                                                    <span className="text-[11px] text-slate-500">
                                                        {t(
                                                            'Ketua, Sekretaris, dan Bendahara Yayasan.',
                                                            'Chairperson, Secretary, and Treasurer.',
                                                        )}
                                                    </span>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }

                            const active = isCurrent(item.match);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    prefetch={false}
                                    className="group relative flex flex-col items-center py-2 font-poppins text-sm whitespace-nowrap lg:text-base"
                                >
                                    <span
                                        className={`transition-colors duration-150 ${
                                            active
                                                ? 'font-bold text-[#14bace]'
                                                : 'font-medium text-[#1d2b2d] hover:text-[#14bace]'
                                        }`}
                                    >
                                        {label}
                                    </span>
                                    <span
                                        className={`absolute bottom-0 h-[3px] rounded-full transition-all duration-200 ${
                                            active
                                                ? 'w-6 bg-[#14bace] opacity-100'
                                                : 'w-0 bg-[#14bace] opacity-0 group-hover:w-4 group-hover:opacity-60'
                                        }`}
                                    />
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Actions: Language Switcher, Auth & Donasi CTA */}
                    <div className="hidden items-center gap-2.5 md:flex">
                        {/* Language Switcher Pill */}
                        <div
                            className="inline-flex items-center rounded-lg border border-[#e4eaec] bg-[#f7fcfd] p-0.5"
                            role="group"
                            aria-label="Pilih Bahasa / Select Language"
                        >
                            <Globe className="mr-1 ml-1.5 size-3.5 text-[#087f8c]" />
                            <button
                                type="button"
                                onClick={() => setLang('id')}
                                className={`rounded-md px-2 py-1 font-poppins text-[11px] font-bold transition-all ${
                                    lang === 'id'
                                        ? 'bg-[#14bace] text-white shadow-2xs'
                                        : 'text-slate-600 hover:text-[#087f8c]'
                                }`}
                                title="Bahasa Indonesia"
                            >
                                ID
                            </button>
                            <button
                                type="button"
                                onClick={() => setLang('en')}
                                className={`rounded-md px-2 py-1 font-poppins text-[11px] font-bold transition-all ${
                                    lang === 'en'
                                        ? 'bg-[#14bace] text-white shadow-2xs'
                                        : 'text-slate-600 hover:text-[#087f8c]'
                                }`}
                                title="English"
                            >
                                EN
                            </button>
                        </div>

                        {auth?.user && (
                            <div className="flex items-center gap-1.5">
                                <Link
                                    href="/dashboard"
                                    className="flex items-center gap-1.5 rounded-lg bg-[#e8f8fa] px-3 py-2 text-xs font-semibold text-[#186972] transition-colors hover:bg-[#d5f3f7]"
                                >
                                    <LayoutDashboard className="size-4" />
                                    <span>{t('Panel', 'Dashboard')}</span>
                                </Link>
                                <Link
                                    href="/logout"
                                    method="post"
                                    as="button"
                                    className="rounded-lg px-2.5 py-2 text-xs font-medium text-rose-600 transition-colors hover:bg-rose-50 hover:text-rose-700"
                                    title={t('Keluar Akun', 'Log Out')}
                                >
                                    {t('Keluar', 'Logout')}
                                </Link>
                            </div>
                        )}

                        <Link
                            href="/donasi"
                            prefetch={false}
                            className="flex items-center gap-2 rounded-lg bg-[#14bace] px-5 py-2.5 font-poppins text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-[#087f8c] active:scale-95 lg:text-base"
                        >
                            <span>{t('Donasi', 'Donate')}</span>
                            <ArrowRight className="size-4" />
                        </Link>
                    </div>

                    {/* Mobile Hamburger & Actions */}
                    <div className="flex items-center gap-2 md:hidden">
                        {/* Mobile Language Toggle */}
                        <div className="inline-flex items-center rounded-md border border-[#e4eaec] bg-[#f7fcfd] p-0.5">
                            <button
                                type="button"
                                onClick={() => setLang('id')}
                                className={`rounded px-1.5 py-0.5 font-poppins text-[10px] font-bold transition ${
                                    lang === 'id'
                                        ? 'bg-[#14bace] text-white'
                                        : 'text-slate-600'
                                }`}
                            >
                                ID
                            </button>
                            <button
                                type="button"
                                onClick={() => setLang('en')}
                                className={`rounded px-1.5 py-0.5 font-poppins text-[10px] font-bold transition ${
                                    lang === 'en'
                                        ? 'bg-[#14bace] text-white'
                                        : 'text-slate-600'
                                }`}
                            >
                                EN
                            </button>
                        </div>

                        <Link
                            href="/donasi"
                            prefetch={false}
                            className="flex items-center gap-1 rounded-md bg-[#14bace] px-3 py-1.5 text-xs font-semibold text-white"
                        >
                            <span>{t('Donasi', 'Donate')}</span>
                        </Link>
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            aria-label="Toggle menu navigasi"
                            className="rounded-lg p-2 text-[#1d2b2d] transition hover:bg-gray-100"
                        >
                            {mobileMenuOpen ? (
                                <X className="size-6" />
                            ) : (
                                <Menu className="size-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Dropdown Menu */}
            {mobileMenuOpen && (
                <div className="animate-in space-y-2 border-t border-[#e4eaec] bg-white px-4 pt-3 pb-6 shadow-lg duration-200 slide-in-from-top-2 md:hidden">
                    {navItems.map((item) => {
                        const label = t(item.labelId, item.labelEn);

                        if (item.href === '/kegiatan') {
                            return (
                                <div key={item.href} className="space-y-1">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setMobileKegiatanOpen(
                                                !mobileKegiatanOpen,
                                            )
                                        }
                                        className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 font-poppins text-sm transition-colors ${
                                            isKegiatanActive
                                                ? 'bg-[#e8f8fa] font-semibold text-[#087f8c]'
                                                : 'text-[#1d2b2d] hover:bg-gray-50'
                                        }`}
                                    >
                                        <span>{label}</span>
                                        <ChevronDown
                                            className={`size-4 transition-transform duration-200 ${
                                                mobileKegiatanOpen
                                                    ? 'rotate-180'
                                                    : ''
                                            }`}
                                        />
                                    </button>

                                    {mobileKegiatanOpen && (
                                        <div className="ml-3 space-y-1 border-l-2 border-[#14bace]/40 pl-3">
                                            <Link
                                                href="/kegiatan"
                                                prefetch={false}
                                                onClick={() =>
                                                    setMobileMenuOpen(false)
                                                }
                                                className={`flex items-center justify-between rounded-lg px-3 py-2 font-poppins text-xs transition-colors ${
                                                    url.startsWith('/kegiatan')
                                                        ? 'bg-[#e8f8fa] font-semibold text-[#087f8c]'
                                                        : 'text-slate-600 hover:bg-gray-50'
                                                }`}
                                            >
                                                <span>
                                                    {t(
                                                        'Berita Kegiatan',
                                                        'Activity News',
                                                    )}
                                                </span>
                                                {url.startsWith(
                                                    '/kegiatan',
                                                ) && (
                                                    <span className="size-1.5 rounded-full bg-[#14bace]" />
                                                )}
                                            </Link>
                                            <Link
                                                href="/berita-umum"
                                                prefetch={false}
                                                onClick={() =>
                                                    setMobileMenuOpen(false)
                                                }
                                                className={`flex items-center justify-between rounded-lg px-3 py-2 font-poppins text-xs transition-colors ${
                                                    url.startsWith(
                                                        '/berita-umum',
                                                    )
                                                        ? 'bg-[#e8f8fa] font-semibold text-[#087f8c]'
                                                        : 'text-slate-600 hover:bg-gray-50'
                                                }`}
                                            >
                                                <span>
                                                    {t(
                                                        'Berita Umum',
                                                        'General News',
                                                    )}
                                                </span>
                                                {url.startsWith(
                                                    '/berita-umum',
                                                ) && (
                                                    <span className="size-1.5 rounded-full bg-[#14bace]" />
                                                )}
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            );
                        }

                        if (item.href === '/profil') {
                            return (
                                <div key={item.href} className="space-y-1">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setMobileProfilOpen(
                                                !mobileProfilOpen,
                                            )
                                        }
                                        className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 font-poppins text-sm transition-colors ${
                                            isProfilActive
                                                ? 'bg-[#e8f8fa] font-semibold text-[#087f8c]'
                                                : 'text-[#1d2b2d] hover:bg-gray-50'
                                        }`}
                                    >
                                        <span>{label}</span>
                                        <ChevronDown
                                            className={`size-4 transition-transform duration-200 ${
                                                mobileProfilOpen
                                                    ? 'rotate-180'
                                                    : ''
                                            }`}
                                        />
                                    </button>

                                    {mobileProfilOpen && (
                                        <div className="ml-3 space-y-1 border-l-2 border-[#14bace]/40 pl-3">
                                            <Link
                                                href="/profil"
                                                prefetch={false}
                                                onClick={() =>
                                                    setMobileMenuOpen(false)
                                                }
                                                className={`flex items-center justify-between rounded-lg px-3 py-2 font-poppins text-xs transition-colors ${
                                                    url === '/profil'
                                                        ? 'bg-[#e8f8fa] font-semibold text-[#087f8c]'
                                                        : 'text-slate-600 hover:bg-gray-50'
                                                }`}
                                            >
                                                <span>
                                                    {t(
                                                        'Profil Yayasan',
                                                        'Foundation Profile',
                                                    )}
                                                </span>
                                                {url === '/profil' && (
                                                    <span className="size-1.5 rounded-full bg-[#14bace]" />
                                                )}
                                            </Link>
                                            <Link
                                                href="/profil-pimpinan"
                                                prefetch={false}
                                                onClick={() =>
                                                    setMobileMenuOpen(false)
                                                }
                                                className={`flex items-center justify-between rounded-lg px-3 py-2 font-poppins text-xs transition-colors ${
                                                    url.startsWith(
                                                        '/profil-pimpinan',
                                                    )
                                                        ? 'bg-[#e8f8fa] font-semibold text-[#087f8c]'
                                                        : 'text-slate-600 hover:bg-gray-50'
                                                }`}
                                            >
                                                <span>
                                                    {t(
                                                        'Profil Pimpinan',
                                                        'Leadership Profile',
                                                    )}
                                                </span>
                                                {url.startsWith(
                                                    '/profil-pimpinan',
                                                ) && (
                                                    <span className="size-1.5 rounded-full bg-[#14bace]" />
                                                )}
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            );
                        }

                        const active = isCurrent(item.match);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                prefetch={false}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`flex items-center justify-between rounded-lg px-3 py-2.5 font-poppins text-sm transition-colors ${
                                    active
                                        ? 'bg-[#e8f8fa] font-semibold text-[#087f8c]'
                                        : 'text-[#1d2b2d] hover:bg-gray-50'
                                }`}
                            >
                                <span>{label}</span>
                                {active && (
                                    <span className="size-2 rounded-full bg-[#14bace]" />
                                )}
                            </Link>
                        );
                    })}

                    {auth?.user && (
                        <div className="flex flex-col gap-2 border-t border-gray-100 pt-3">
                            <Link
                                href="/dashboard"
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#e8f8fa] py-2.5 text-sm font-semibold text-[#087f8c]"
                            >
                                <LayoutDashboard className="size-4" />
                                <span>
                                    {t(
                                        'Dashboard Pengurus',
                                        'Admin Dashboard',
                                    )}
                                </span>
                            </Link>
                            <Link
                                href="/logout"
                                method="post"
                                as="button"
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex w-full items-center justify-center gap-2 rounded-lg py-2 text-xs font-medium text-rose-600 hover:bg-rose-50"
                            >
                                <span>
                                    {t('Keluar Akun (Logout)', 'Log Out')}
                                </span>
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </header>
    );
}
