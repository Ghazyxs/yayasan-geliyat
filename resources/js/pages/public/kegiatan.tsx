import { Head } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';

export default function KegiatanPage() {
    return (
        <PublicLayout>
            <Head title="Kegiatan & Berita - Yayasan Geliyat" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="max-w-3xl">
                    <span className="text-xs font-bold text-[#14bace] uppercase tracking-wider">
                        Dokumentasi
                    </span>
                    <h1 className="mt-2 text-3xl sm:text-4xl font-bold font-poppins text-[#1d2b2d]">
                        Kegiatan Terbaru Yayasan
                    </h1>
                    <p className="mt-4 text-gray-600 leading-relaxed font-sans">
                        Publikasi resmi dan liputan berbagai kegiatan pendampingan belajar, santunan, serta pembinaan yatim.
                    </p>
                </div>
            </div>
        </PublicLayout>
    );
}

