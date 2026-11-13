import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    Calendar,
    ChevronRight,
    Newspaper,
    Search,
} from 'lucide-react';
import PublicLayout from '@/layouts/public-layout';

export interface BeritaUmumItem {
    id: number;
    judul: string;
    slug: string;
    kategori: string;
    ringkasan: string;
    isi?: string;
    gambar_url: string | null;
    tanggal_publikasi: string | null;
    tanggal_publikasi_formatted: string;
    penulis: string | null;
}

interface BeritaUmumPageProps {
    beritaList: BeritaUmumItem[];
}

const categories = [
    'Semua',
    'Artikel',
    'Informasi',
    'Pengumuman',
    'Berita Lainnya',
];

export default function BeritaUmumPage({
    beritaList = [],
}: BeritaUmumPageProps) {
    const [selectedCategory, setSelectedCategory] = useState('Semua');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredBerita = beritaList.filter((item) => {
        const matchesCategory =
            selectedCategory === 'Semua' ||
            item.kategori.toLowerCase() === selectedCategory.toLowerCase();
        const query = searchQuery.toLowerCase().trim();
        const matchesSearch =
            query === '' ||
            item.judul.toLowerCase().includes(query) ||
            item.ringkasan.toLowerCase().includes(query) ||
            item.kategori.toLowerCase().includes(query);

        return matchesCategory && matchesSearch;
    });

    return (
        <PublicLayout>
            <Head title="Berita Umum - Yayasan Geliyat Mahdiesa Nahate" />

            {/* Banner Header with Breadcrumbs */}
            <div className="border-b border-[#e4eaec] bg-gradient-to-r from-[#d1f6fa]/60 via-[#e8f8fa] to-[#f7fcfd] py-10 sm:py-14">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <h1 className="font-poppins text-3xl font-bold text-[#1d2b2d] sm:text-4xl">
                        Berita Umum
                    </h1>
                    <p className="mt-2 max-w-2xl text-sm text-gray-600 sm:text-base">
                        Artikel, pengumuman, dan informasi resmi dari Yayasan
                        Geliyat Mahdiesa Nahate.
                    </p>
                    <nav className="mt-4 flex items-center gap-2 font-poppins text-sm text-gray-500">
                        <Link
                            href="/"
                            prefetch={false}
                            className="transition-colors hover:text-[#14bace]"
                        >
                            Beranda
                        </Link>
                        <ChevronRight className="size-4 text-gray-400" />
                        <span className="font-semibold text-[#186972]">
                            Berita Umum
                        </span>
                    </nav>
                </div>
            </div>

            {/* Filter & Content */}
            <section className="py-10 sm:py-14">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Search and Category Filter */}
                    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex flex-wrap gap-2">
                            {categories.map((category) => {
                                const isActive = selectedCategory === category;
                                return (
                                    <button
                                        key={category}
                                        type="button"
                                        onClick={() =>
                                            setSelectedCategory(category)
                                        }
                                        className={`rounded-lg px-4 py-2 font-poppins text-sm font-medium transition-colors ${
                                            isActive
                                                ? 'bg-[#186972] text-white shadow-sm'
                                                : 'border border-[#e4eaec] bg-white text-gray-600 hover:border-[#14bace] hover:text-[#186972]'
                                        }`}
                                    >
                                        {category}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="relative w-full sm:w-72">
                            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Cari berita atau pengumuman..."
                                className="w-full rounded-lg border border-[#e4eaec] bg-white py-2 pr-4 pl-10 text-sm text-[#1d2b2d] placeholder:text-gray-400 focus:border-[#14bace] focus:ring-2 focus:ring-[#14bace]/20 focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Grid / Empty State */}
                    {filteredBerita.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-[#c8dce0] bg-[#f7fcfd] px-6 py-16 text-center">
                            <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-[#e8f8fa] text-[#186972]">
                                <Newspaper className="size-7" />
                            </div>
                            <h2 className="font-poppins text-lg font-semibold text-[#1d2b2d]">
                                {beritaList.length === 0
                                    ? 'Belum Ada Berita Umum'
                                    : 'Berita Tidak Ditemukan'}
                            </h2>
                            <p className="mx-auto mt-2 max-w-md text-sm text-gray-600">
                                {beritaList.length === 0
                                    ? 'Saat ini belum ada artikel, informasi, atau pengumuman yang dipublikasikan oleh Yayasan Geliyat Mahdiesa Nahate.'
                                    : 'Tidak ada berita yang sesuai dengan kata kunci atau kategori yang dipilih.'}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {filteredBerita.map((item) => (
                                <article
                                    key={item.id}
                                    className="group flex flex-col overflow-hidden rounded-2xl border border-[#e4eaec] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#14bace]/50 hover:shadow-md"
                                >
                                    {item.gambar_url ? (
                                        <div className="aspect-[16/10] w-full overflow-hidden bg-gray-100">
                                            <img
                                                src={item.gambar_url}
                                                alt={item.judul}
                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex aspect-[16/10] w-full items-center justify-center bg-gradient-to-br from-[#e8f8fa] to-[#f4fbfc] text-[#186972]/50">
                                            <Newspaper className="size-12" />
                                        </div>
                                    )}

                                    <div className="flex flex-1 flex-col p-6">
                                        <div className="mb-2 flex items-center justify-between gap-2 text-xs text-gray-500">
                                            <span className="font-semibold text-[#186972]">
                                                {item.kategori}
                                            </span>
                                            <span className="inline-flex items-center gap-1.5">
                                                <Calendar className="size-3.5 text-[#14bace]" />
                                                {
                                                    item.tanggal_publikasi_formatted
                                                }
                                            </span>
                                        </div>

                                        <h2 className="font-poppins text-lg font-bold text-[#1d2b2d] transition-colors group-hover:text-[#186972]">
                                            <Link
                                                href={`/berita-umum/${item.slug}`}
                                                prefetch={false}
                                            >
                                                {item.judul}
                                            </Link>
                                        </h2>

                                        <p className="mt-2.5 line-clamp-3 flex-1 text-sm leading-relaxed text-gray-600">
                                            {item.ringkasan}
                                        </p>

                                        <div className="mt-5 border-t border-gray-100 pt-4">
                                            <Link
                                                href={`/berita-umum/${item.slug}`}
                                                prefetch={false}
                                                className="inline-flex items-center gap-1.5 font-poppins text-sm font-semibold text-[#186972] transition-colors hover:text-[#14bace]"
                                            >
                                                Baca Selengkapnya
                                                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                                            </Link>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </PublicLayout>
    );
}

