import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    MapPin,
    Calendar,
    Newspaper,
} from 'lucide-react';
import PublicLayout from '@/layouts/public-layout';
import { useLanguage } from '@/hooks/use-language';
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
    const { t, translateBidang, translateCategory } = useLanguage();
    const latestActivity = kegiatanTerbaru[0] ?? null;

    return (
        <PublicLayout>
            <Head
                title={t(
                    'Yayasan Geliyat Mahdiesa Nahate - Gerakan Peduli Yatim',
                    'Yayasan Geliyat Mahdiesa Nahate - Orphan Care Movement',
                )}
            />

            {/* Hero Section */}
            <section className="relative overflow-hidden border-b border-[#e4eaec] bg-gradient-to-b from-[#eef9fa] via-[#f7fcfd] to-[#fbfdfd] py-16 sm:py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
                        {/* Text Content */}
                        <div className="flex flex-col items-start lg:col-span-7">
                            <h1 className="font-poppins text-3xl leading-[1.15] font-bold tracking-tight text-[#1d2b2d] sm:text-5xl lg:text-6xl">
                                {t('Bersama untuk', 'Together for')} <br />
                                <span className="text-[#14bace]">
                                    {t('Masa Depan', 'Their Future')}
                                </span>{' '}
                                {t('Mereka', '')}
                            </h1>

                            <p className="mt-6 max-w-xl font-sans text-base leading-relaxed text-gray-600 sm:text-lg">
                                {t(
                                    'Yayasan Geliyat Mahdiesa Nahate hadir sebagai gerakan kepedulian untuk membina dan memberdayakan anak yatim serta ibu yatim secara amanah, profesional, dan berkelanjutan di Kota Bandung.',
                                    'Yayasan Geliyat Mahdiesa Nahate is a caring movement dedicated to mentoring and empowering orphans and mothers of orphans in a trustworthy, professional, and sustainable manner in Bandung City.',
                                )}
                            </p>

                            <div className="mt-8 flex flex-wrap items-center gap-4">
                                <Link
                                    href="/donasi"
                                    prefetch={false}
                                    className="flex items-center gap-2.5 rounded-xl bg-[#14bace] px-6 py-3.5 font-poppins text-base font-semibold text-white shadow-md shadow-[#14bace]/20 transition-all duration-150 hover:bg-[#087f8c] active:scale-95"
                                >
                                    <span>{t('Donasi Sekarang', 'Donate Now')}</span>
                                    <ArrowRight className="size-4" />
                                </Link>

                                <Link
                                    href="/profil"
                                    prefetch={false}
                                    className="rounded-xl border border-[#e4eaec] bg-white px-6 py-3.5 font-poppins text-base font-medium text-[#1d2b2d] shadow-sm transition-colors duration-150 hover:bg-gray-50"
                                >
                                    <span>{t('Lihat Profil Kami', 'View Our Profile')}</span>
                                </Link>
                            </div>

                            {/* Values & Pillars Indicator */}
                            <div className="mt-12 grid w-full grid-cols-3 gap-6 border-t border-[#e4eaec]/60 pt-8">
                                <div>
                                    <p className="font-poppins text-2xl font-bold text-[#14bace] sm:text-3xl">
                                        4
                                    </p>
                                    <p className="mt-0.5 font-sans text-xs text-gray-500">
                                        {t('Bidang Program Utama', 'Core Program Divisions')}
                                    </p>
                                </div>
                                <div>
                                    <p className="font-poppins text-xl font-bold text-[#186972] sm:text-2xl">
                                        {t('Amanah', 'Trustworthy')}
                                    </p>
                                    <p className="mt-0.5 font-sans text-xs text-gray-500">
                                        {t('Profesional & Berkelanjutan', 'Professional & Sustainable')}
                                    </p>
                                </div>
                                <div>
                                    <p className="font-poppins text-xl font-bold text-[#1d2b2d] sm:text-2xl">
                                        Bandung
                                    </p>
                                    <p className="mt-0.5 font-sans text-xs text-gray-500">
                                        {t('Kec. Ujungberung', 'Ujungberung District')}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Right Visual Card: Banner Kegiatan Terbaru */}
                        <div className="flex justify-center lg:col-span-5">
                            <div className="relative w-full max-w-md">
                                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-[#14bace] to-[#186972] opacity-20 blur-xl"></div>
                                <div className="relative overflow-hidden rounded-2xl border border-[#e4eaec] bg-white shadow-xl">
                                    {latestActivity ? (
                                        <>
                                            <div className="aspect-[16/10] w-full overflow-hidden bg-gray-100">
                                                <img
                                                    src={latestActivity.gambar}
                                                    alt={latestActivity.judul}
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                            <div className="p-6">
                                                <p className="font-poppins text-xs font-semibold tracking-wider text-[#186972] uppercase">
                                                    {t('Kegiatan Terbaru', 'Latest Activity')}
                                                </p>
                                                <h3 className="mt-1.5 font-poppins text-lg leading-snug font-bold text-[#1d2b2d]">
                                                    {latestActivity.judul}
                                                </h3>
                                                <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                                                    <span className="inline-flex items-center gap-1.5">
                                                        <Calendar className="size-3.5 text-[#14bace]" />
                                                        {latestActivity.tanggal_kegiatan}
                                                    </span>
                                                    {latestActivity.lokasi && (
                                                        <span className="inline-flex items-center gap-1.5">
                                                            <MapPin className="size-3.5 text-[#14bace]" />
                                                            {latestActivity.lokasi}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-gray-600">
                                                    {latestActivity.ringkasan ||
                                                        latestActivity.deskripsi}
                                                </p>
                                                <Link
                                                    href={`/kegiatan/${latestActivity.id}`}
                                                    prefetch={false}
                                                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#14bace] py-3 font-poppins text-sm font-semibold text-white transition hover:bg-[#087f8c]"
                                                >
                                                    <span>
                                                        {t('Lihat Selengkapnya', 'Read More')}
                                                    </span>
                                                    <ArrowRight className="size-4" />
                                                </Link>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="p-8 text-center">
                                            <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-[#e8f8fa] text-[#186972]">
                                                <Newspaper className="size-7" />
                                            </div>
                                            <p className="font-poppins text-xs font-semibold tracking-wider text-[#186972] uppercase">
                                                {t('Kegiatan Terbaru', 'Latest Activity')}
                                            </p>
                                            <h3 className="mt-2 font-poppins text-lg font-bold text-[#1d2b2d]">
                                                {t(
                                                    'Belum Ada Kegiatan Terbaru',
                                                    'No Recent Activities Yet',
                                                )}
                                            </h3>
                                            <p className="mt-2 text-sm leading-relaxed text-gray-600">
                                                {t(
                                                    'Dokumentasi kegiatan terbaru Yayasan Geliyat Mahdiesa Nahate akan tampil di sini setelah dipublikasikan.',
                                                    'Documentation of the latest activities of Yayasan Geliyat Mahdiesa Nahate will appear here once published.',
                                                )}
                                            </p>
                                            <Link
                                                href="/kegiatan"
                                                prefetch={false}
                                                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-[#14bace] bg-white py-2.5 font-poppins text-sm font-semibold text-[#186972] transition hover:bg-[#e8f8fa]"
                                            >
                                                <span>
                                                    {t('Lihat Arsip Kegiatan', 'View Activity Archive')}
                                                </span>
                                                <ArrowRight className="size-4" />
                                            </Link>
                                        </div>
                                    )}
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
                        <h2 className="font-poppins text-3xl font-bold text-[#1d2b2d]">
                            {t('Empat Bidang di Geliyat', 'Four Divisions at Geliyat')}
                        </h2>
                        <p className="mt-3 font-sans text-sm text-gray-600">
                            {t(
                                'Empat bidang program untuk mendukung tumbuh kembang anak yatim secara holistik dan berkelanjutan.',
                                'Four core program divisions supporting the holistic and sustainable growth of orphans.',
                            )}
                        </p>
                    </div>

                    <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {bidangList.map((rawBidang) => {
                            const bidang = translateBidang(rawBidang);
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
                                        <span>{t('Lihat Selengkapnya', 'Learn More')}</span>
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
                            <h2 className="font-poppins text-3xl font-bold text-[#1d2b2d]">
                                {t('Kegiatan Terbaru', 'Latest Activities')}
                            </h2>
                        </div>
                        <Link
                            href="/kegiatan"
                            prefetch={false}
                            className="inline-flex items-center gap-2 text-sm font-semibold text-[#14bace] transition-colors hover:text-[#087f8c]"
                        >
                            <span>{t('Lihat Semua Kegiatan', 'View All Activities')}</span>
                            <ArrowRight className="size-4" />
                        </Link>
                    </div>

                    {kegiatanTerbaru.length === 0 ? (
                        <div className="rounded-2xl border border-[#e4eaec] bg-[#fbfdfd] p-8 text-center text-sm text-gray-500">
                            {t(
                                'Belum ada kegiatan terbaru yang dipublikasikan.',
                                'No recent activities have been published yet.',
                            )}
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
                                            {translateCategory(act.kategori)}
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
