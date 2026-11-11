import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { ArrowRight, Menu, X, LogIn, LayoutDashboard } from 'lucide-react';

interface NavItem {
    label: string;
    href: string;
    match: string;
}

const navItems: NavItem[] = [
    { label: 'Beranda', href: '/', match: '/' },
    { label: 'Bidang', href: '/bidang', match: '/bidang' },
    { label: 'Kegiatan', href: '/kegiatan', match: '/kegiatan' },
    { label: 'Anak Yatim', href: '/anak-yatim', match: '/anak-yatim' },
    { label: 'Profil', href: '/profil', match: '/profil' },
    { label: 'Donasi', href: '/donasi', match: '/donasi' },
];

export default function PublicNavbar() {
    const { url } = usePage();
    const { auth } = usePage().props as unknown as {
        auth?: { user?: { name: string; role?: string } };
    };
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const isCurrent = (match: string) => {
        if (match === '/') {
            return url === '/';
        }
        return url.startsWith(match);
    };

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
                                Gerakan Peduli Yatim
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Navigation Links */}
                    <nav className="hidden items-center gap-6 md:flex lg:gap-8">
                        {navItems.map((item) => {
                            const active = isCurrent(item.match);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    prefetch={false}
                                    className="group relative flex flex-col items-center py-2 font-poppins text-sm lg:text-base"
                                >
                                    <span
                                        className={`transition-colors duration-150 ${
                                            active
                                                ? 'font-bold text-[#14bace]'
                                                : 'font-medium text-[#1d2b2d] hover:text-[#14bace]'
                                        }`}
                                    >
                                        {item.label}
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

                    {/* Actions: Donasi CTA & Admin / Auth */}
                    <div className="hidden items-center gap-3 md:flex">
                        {auth?.user ? (
                            <div className="flex items-center gap-1.5">
                                <Link
                                    href="/dashboard"
                                    className="flex items-center gap-1.5 rounded-lg bg-[#e8f8fa] px-3 py-2 text-xs font-semibold text-[#186972] transition-colors hover:bg-[#d5f3f7]"
                                >
                                    <LayoutDashboard className="size-4" />
                                    <span>Panel</span>
                                </Link>
                                <Link
                                    href="/logout"
                                    method="post"
                                    as="button"
                                    className="rounded-lg px-2.5 py-2 text-xs font-medium text-rose-600 transition-colors hover:bg-rose-50 hover:text-rose-700"
                                    title="Keluar Akun"
                                >
                                    Keluar
                                </Link>
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                prefetch={false}
                                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#718083] transition-colors hover:text-[#1d2b2d]"
                                title="Login Pengurus"
                            >
                                <LogIn className="size-4" />
                                <span>Masuk</span>
                            </Link>
                        )}

                        <Link
                            href="/donasi"
                            prefetch={false}
                            className="flex items-center gap-2 rounded-lg bg-[#14bace] px-5 py-2.5 font-poppins text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-[#087f8c] active:scale-95 lg:text-base"
                        >
                            <span>Donasi</span>
                            <ArrowRight className="size-4" />
                        </Link>
                    </div>

                    {/* Mobile Hamburger Toggle */}
                    <div className="flex items-center gap-2 md:hidden">
                        <Link
                            href="/donasi"
                            className="flex items-center gap-1 rounded-md bg-[#14bace] px-3 py-1.5 text-xs font-semibold text-white"
                        >
                            <span>Donasi</span>
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
                                <span>{item.label}</span>
                                {active && (
                                    <span className="size-2 rounded-full bg-[#14bace]" />
                                )}
                            </Link>
                        );
                    })}

                    <div className="flex flex-col gap-2 border-t border-gray-100 pt-3">
                        {auth?.user ? (
                            <>
                                <Link
                                    href="/dashboard"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#e8f8fa] py-2.5 text-sm font-semibold text-[#087f8c]"
                                >
                                    <LayoutDashboard className="size-4" />
                                    <span>Dashboard Pengurus</span>
                                </Link>
                                <Link
                                    href="/logout"
                                    method="post"
                                    as="button"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex w-full items-center justify-center gap-2 rounded-lg py-2 text-xs font-medium text-rose-600 hover:bg-rose-50"
                                >
                                    <span>Keluar Akun (Logout)</span>
                                </Link>
                            </>
                        ) : (
                            <Link
                                href="/login"
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-50 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
                            >
                                <LogIn className="size-4" />
                                <span>Masuk Pengurus</span>
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}
