import { Head } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';

export default function AnakYatimPage() {
    return (
        <PublicLayout>
            <Head title="Anak Yatim Binaan - Yayasan Geliyat" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="max-w-3xl">
                    <span className="text-xs font-bold text-[#14bace] uppercase tracking-wider">
                        Generasi Penerus
                    </span>
                    <h1 className="mt-2 text-3xl sm:text-4xl font-bold font-poppins text-[#1d2b2d]">
                        Anak Yatim Binaan Yayasan Geliyat
                    </h1>
                    <p className="mt-4 text-gray-600 leading-relaxed font-sans">
                        Mendukung pendidikan dan masa depan anak-anak di 5 kelurahan wilayah Ujungberung, Kota Bandung.
                    </p>
                </div>
            </div>
        </PublicLayout>
    );
}

