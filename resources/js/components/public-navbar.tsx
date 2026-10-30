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
    const { auth } = usePage().props as unknown as { auth?: { user?: { name: string; role?: string } } };
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const isCurrent = (match: string) => {
        if (match === '/') {
            return url === '/';
        }
        return url.startsWith(match);
    };

    return (
        <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-[#e4eaec] transition-all">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-20 items-center justify-between">
                    {/* Brand / Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <img
                            src="/images/logo.png"
                            alt="Logo Yayasan Geliyat"
                            className="size-12 object-contain rounded-lg transition-transform group-hover:scale-105"
                        />
                        <div className="flex flex-col">
                            <span className="font-poppins font-bold text-lg text-[#1d2b2d] tracking-wide leading-tight">
                                GELIYAT
                            </span>
                            <span className="font-poppins font-medium text-[10px] text-[#186972] uppercase tracking-[2px] leading-tight">
                                Gerakan Peduli Yatim
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Navigation Links */}
                    <nav className="hidden md:flex items-center gap-6 lg:gap-8">
                        {navItems.map((item) => {
                            const active = isCurrent(item.match);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="relative flex flex-col items-center py-2 group text-sm lg:text-base font-poppins"
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
                    <div className="hidden md:flex items-center gap-3">
                        {auth?.user ? (
                            <Link
                                href="/dashboard"
                                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#186972] bg-[#e8f8fa] hover:bg-[#d5f3f7] rounded-lg transition-colors"
                            >
                                <LayoutDashboard className="size-4" />
                                <span>Panel</span>
                            </Link>
                        ) : (
                            <Link
                                href="/login"
                                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#718083] hover:text-[#1d2b2d] transition-colors"
                                title="Login Pengurus"
                            >
                                <LogIn className="size-4" />
                                <span>Masuk</span>
                            </Link>
                        )}

                        <Link
                            href="/donasi"
                            className="bg-[#14bace] hover:bg-[#087f8c] active:scale-95 text-white font-poppins font-semibold text-sm lg:text-base px-5 py-2.5 rounded-lg flex items-center gap-2 shadow-sm transition-all duration-150"
                        >
                            <span>Donasi</span>
                            <ArrowRight className="size-4" />
                        </Link>
                    </div>

                    {/* Mobile Hamburger Toggle */}
                    <div className="flex items-center gap-2 md:hidden">
                        <Link
                            href="/donasi"
                            className="bg-[#14bace] text-white text-xs font-semibold px-3 py-1.5 rounded-md flex items-center gap-1"
                        >
                            <span>Donasi</span>
                        </Link>
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            aria-label="Toggle menu navigasi"
                            className="p-2 rounded-lg text-[#1d2b2d] hover:bg-gray-100 transition"
                        >
                            {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Dropdown Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-[#e4eaec] bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top-2 duration-200">
                    {navItems.map((item) => {
                        const active = isCurrent(item.match);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`flex items-center justify-between px-3 py-2.5 rounded-lg font-poppins text-sm transition-colors ${
                                    active
                                        ? 'bg-[#e8f8fa] text-[#087f8c] font-semibold'
                                        : 'text-[#1d2b2d] hover:bg-gray-50'
                                }`}
                            >
                                <span>{item.label}</span>
                                {active && <span className="size-2 rounded-full bg-[#14bace]" />}
                            </Link>
                        );
                    })}

                    <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
                        {auth?.user ? (
                            <Link
                                href="/dashboard"
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-semibold text-[#087f8c] bg-[#e8f8fa] rounded-lg"
                            >
                                <LayoutDashboard className="size-4" />
                                <span>Dashboard Pengurus</span>
                            </Link>
                        ) : (
                            <Link
                                href="/login"
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg"
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
