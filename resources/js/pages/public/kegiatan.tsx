import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import {
    Search,
    MapPin,
    Calendar,
    ChevronRight,
    ArrowRight,
} from 'lucide-react';
import PublicLayout from '@/layouts/public-layout';

export interface DokumentasiItem {
    url: string;
    caption: string;
}

export interface KegiatanBidangRef {
    id: number;
    kode: string;
    nama: string;
}

export interface KegiatanData {
    id: number;
    judul: string;
    kategori: string;
    ringkasan: string;
    deskripsi: string;
    isi_berita: string;
    paragraf_berita: string[];
    lokasi: string;
    tanggal_kegiatan: string;
    tanggal_iso: string | null;
    gambar: string;
    dokumentasi: DokumentasiItem[];
    bidang: KegiatanBidangRef | null;
    penulis: string;
}

interface KegiatanPageProps {
    kegiatanList: KegiatanData[];
}

const categories = [
    'Semua',
    'Pendidikan',
    'Keagamaan',
    'Ekonomi',
    'Kemanusiaan',
];

export default function KegiatanPage({ kegiatanList = [] }: KegiatanPageProps) {
    const [selectedCategory, setSelectedCategory] = useState('Semua');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredActivities = kegiatanList.filter((item) => {
        const matchesCategory =
            selectedCategory === 'Semua' ||
            item.kategori.toLowerCase() === selectedCategory.toLowerCase();
        const query = searchQuery.toLowerCase().trim();
        const matchesSearch =
            query === '' ||
            item.judul.toLowerCase().includes(query) ||
            (item.ringkasan && item.ringkasan.toLowerCase().includes(query)) ||
            item.deskripsi.toLowerCase().includes(query) ||
            item.lokasi.toLowerCase().includes(query);
        return matchesCategory && matchesSearch;
    });

    return (
        <PublicLayout>
            <Head title="Kegiatan & Berita - Yayasan Geliyat" />

            {/* Banner Header with Breadcrumbs */}
            <div className="border-b border-[#e4eaec] bg-gradient-to-r from-[#d1f6fa]/60 via-[#e8f8fa] to-[#f7fcfd] py-10 sm:py-14">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <h1 className="font-poppins text-3xl font-bold text-[#1d2b2d] sm:text-4xl">
                        Kegiatan Yayasan
                    </h1>
                    <nav className="mt-2 flex items-center gap-2 font-poppins text-sm text-gray-500">
                        <Link
                            href="/"
                            prefetch={false}
                            className="transition-colors hover:text-[#14bace]"
                        >
                            Beranda
                        </Link>
                        <ChevronRight className="size-4 text-gray-400" />
                        <span className="font-semibold text-[#186972]">
                            Kegiatan
                        </span>
                    </nav>
                    <p className="mt-3 max-w-2xl font-sans text-sm text-gray-600 sm:text-base">
                        Publikasi resmi dan dokumentasi berbagai kegiatan
                        pendampingan belajar, santunan bulanan, serta pembinaan
                        yatim di Ujungberung.
                    </p>
                </div>
            </div>

            {/* Filter & Search Bar */}
            <section className="sticky top-20 z-40 border-b border-[#e4eaec] bg-white py-8 shadow-xs">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col items-stretch justify-between gap-4 md:flex-row md:items-center">
                        {/* Search Input */}
                        <div className="relative w-full md:w-80">
                            <Search className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Cari kegiatan..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full rounded-full border border-[#b1b1b1] py-2.5 pr-4 pl-11 font-sans text-sm outline-hidden transition focus:border-[#14bace] focus:ring-2 focus:ring-[#14bace]/20"
                            />
                        </div>

                        {/* Category Pills */}
                        <div className="flex scrollbar-none items-center gap-2 overflow-x-auto pb-1 md:pb-0">
                            {categories.map((cat) => {
                                const active = selectedCategory === cat;
                                return (
                                    <button
                                        key={cat}
                                        type="button"
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`shrink-0 rounded-full px-5 py-2 font-poppins text-xs transition-all sm:text-sm ${
                                            active
                                                ? 'bg-[#1d2b2d] font-semibold text-white shadow-xs'
                                                : 'border border-[#1d2b2d] bg-white text-[#1d2b2d] hover:bg-gray-50'
                                        }`}
                                    >
                                        {cat}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* Kegiatan Cards Grid */}
            <section className="bg-[#fbfdfd] py-12 sm:py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {filteredActivities.length === 0 ? (
                        <div className="rounded-2xl border border-[#e4eaec] bg-white p-8 py-16 text-center">
                            <p className="font-poppins text-base font-semibold text-gray-700">
                                Tidak ada kegiatan yang cocok
                            </p>
                            <p className="mt-1 text-xs text-gray-500">
                                Coba ubah kata kunci pencarian atau pilih
                                kategori lain.
                            </p>
                            <button
                                type="button"
                                onClick={() => {
                                    setSearchQuery('');
                                    setSelectedCategory('Semua');
                                }}
                                className="mt-4 rounded-lg bg-[#14bace] px-4 py-2 text-xs font-semibold text-white"
                            >
                                Reset Filter
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {filteredActivities.map((act) => (
                                <Link
                                    key={act.id}
                                    href={`/kegiatan/${act.id}`}
                                    prefetch={false}
                                    className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-[#e4eaec] bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#14bace]/50 hover:shadow-xl focus:ring-2 focus:ring-[#14bace] focus:outline-hidden"
                                >
                                    <div>
                                        <div className="relative h-52 w-full overflow-hidden bg-gray-100">
                                            <img
                                                src={act.gambar}
                                                alt={act.judul}
                                                className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                            <span className="absolute top-3.5 left-3.5 rounded-md bg-white/95 px-3 py-1 text-[11px] font-bold tracking-wider text-[#087f8c] uppercase shadow-xs">
                                                {act.kategori}
                                            </span>
                                        </div>

                                        <div className="p-6">
                                            <div className="mb-2 flex items-center gap-2 text-xs text-gray-400">
                                                <Calendar className="size-3.5 text-[#14bace]" />
                                                <span>
                                                    {act.tanggal_kegiatan}
                                                </span>
                                            </div>

                                            <h3 className="font-poppins text-lg leading-snug font-bold text-[#1d2b2d] transition-colors group-hover:text-[#14bace]">
                                                {act.judul}
                                            </h3>

                                            <p className="mt-2.5 line-clamp-3 font-sans text-xs leading-relaxed text-gray-600 sm:text-sm">
                                                {act.ringkasan || act.deskripsi}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between gap-2 border-t border-gray-100 px-6 pt-3 pb-5 text-xs text-gray-500">
                                        <div className="flex items-center gap-1.5 truncate">
                                            <MapPin className="size-4 shrink-0 text-[#14bace]" />
                                            <span className="truncate">
                                                {act.lokasi}
                                            </span>
                                        </div>
                                        <span className="inline-flex shrink-0 items-center gap-1 font-poppins font-semibold text-[#14bace] transition-transform group-hover:translate-x-0.5">
                                            <span>Baca Berita</span>
                                            <ArrowRight className="size-3.5" />
                                        </span>
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
