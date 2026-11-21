import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Calendar, ChevronRight, User } from 'lucide-react';
import PublicLayout from '@/layouts/public-layout';
import type { BeritaUmumItem } from './berita-umum';

interface BeritaUmumDetailProps {
    berita: BeritaUmumItem & { isi: string };
    beritaLainnya: BeritaUmumItem[];
}

export default function BeritaUmumDetail({
    berita,
    beritaLainnya = [],
}: BeritaUmumDetailProps) {
    const paragraphs = (berita.isi || '')
        .split(/\r?\n\s*\r?\n|\r?\n/)
        .map((p) => p.trim())
        .filter(Boolean);

    return (
        <PublicLayout>
            <Head
                title={`${berita.judul} - Berita Umum Yayasan Geliyat Mahdiesa Nahate`}
            />

            {/* Breadcrumbs */}
            <div className="border-b border-[#e4eaec] bg-[#f7fcfd] py-5">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <nav className="flex flex-wrap items-center gap-2 font-poppins text-sm text-gray-500">
                        <Link
                            href="/"
                            prefetch={false}
                            className="transition-colors hover:text-[#14bace]"
                        >
                            Beranda
                        </Link>
                        <ChevronRight className="size-4 text-gray-400" />
                        <Link
                            href="/berita-umum"
                            prefetch={false}
                            className="transition-colors hover:text-[#14bace]"
                        >
                            Berita Umum
                        </Link>
                        <ChevronRight className="size-4 text-gray-400" />
                        <span className="line-clamp-1 font-semibold text-[#186972]">
                            {berita.judul}
                        </span>
                    </nav>
                </div>
            </div>

            {/* Article Content */}
            <section className="py-10 sm:py-14">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
                        <article className="lg:col-span-8">
                            <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                <span className="font-poppins font-semibold text-[#186972]">
                                    {berita.kategori}
                                </span>
                                <span className="text-gray-300">•</span>
                                <span className="inline-flex items-center gap-1.5">
                                    <Calendar className="size-4 text-[#14bace]" />
                                    {berita.tanggal_publikasi_formatted}
                                </span>
                                {berita.penulis && (
                                    <>
                                        <span className="text-gray-300">•</span>
                                        <span className="inline-flex items-center gap-1.5">
                                            <User className="size-4 text-[#14bace]" />
                                            {berita.penulis}
                                        </span>
                                    </>
                                )}
                            </div>

                            <h1 className="font-poppins text-2xl leading-tight font-bold text-[#1d2b2d] sm:text-3xl lg:text-4xl">
                                {berita.judul}
                            </h1>

                            {berita.gambar_url && (
                                <div className="mt-6 overflow-hidden rounded-2xl border border-[#e4eaec] bg-gray-50">
                                    <img
                                        src={berita.gambar_url}
                                        alt={berita.judul}
                                        className="max-h-[460px] w-full object-cover"
                                    />
                                </div>
                            )}

                            <div className="mt-8 space-y-4 text-base leading-relaxed text-gray-700">
                                {paragraphs.map((paragraph, index) => (
                                    <p key={index}>{paragraph}</p>
                                ))}
                            </div>

                            <div className="mt-10 border-t border-[#e4eaec] pt-6">
                                <Link
                                    href="/berita-umum"
                                    prefetch={false}
                                    className="inline-flex items-center gap-2 font-poppins text-sm font-semibold text-[#186972] transition-colors hover:text-[#14bace]"
                                >
                                    <ArrowLeft className="size-4" />
                                    Kembali ke Berita Umum
                                </Link>
                            </div>
                        </article>

                        {/* Sidebar: Berita Lainnya */}
                        <aside className="lg:col-span-4">
                            <div className="rounded-2xl border border-[#e4eaec] bg-[#f7fcfd] p-6">
                                <h2 className="font-poppins text-lg font-bold text-[#1d2b2d]">
                                    Berita Umum Lainnya
                                </h2>
                                <div className="mt-1 h-0.5 w-12 bg-[#14bace]" />

                                {beritaLainnya.length === 0 ? (
                                    <p className="mt-4 text-sm text-gray-500">
                                        Belum ada berita umum lainnya.
                                    </p>
                                ) : (
                                    <div className="mt-5 divide-y divide-[#e4eaec]">
                                        {beritaLainnya.map((item) => (
                                            <Link
                                                key={item.id}
                                                href={`/berita-umum/${item.slug}`}
                                                prefetch={false}
                                                className="group block py-3.5 first:pt-0 last:pb-0"
                                            >
                                                <span className="text-xs font-medium text-[#186972]">
                                                    {item.kategori} •{' '}
                                                    {
                                                        item.tanggal_publikasi_formatted
                                                    }
                                                </span>
                                                <h3 className="mt-1 font-poppins text-sm font-semibold text-[#1d2b2d] transition-colors group-hover:text-[#14bace]">
                                                    {item.judul}
                                                </h3>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </aside>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}

