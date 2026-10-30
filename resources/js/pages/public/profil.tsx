import { Head } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';

export default function ProfilPage() {
    return (
        <PublicLayout>
            <Head title="Profil Yayasan - Yayasan Geliyat" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="max-w-3xl">
                    <span className="text-xs font-bold text-[#14bace] uppercase tracking-wider">
                        Tentang Kami
                    </span>
                    <h1 className="mt-2 text-3xl sm:text-4xl font-bold font-poppins text-[#1d2b2d]">
                        Profil Yayasan Geliyat Mahdiesa Nahate
                    </h1>
                    <p className="mt-4 text-gray-600 leading-relaxed font-sans">
                        Yayasan Geliyat merupakan yayasan sosial yang berfokus pada pendampingan dan pemberdayaan anak yatim di wilayah Ujungberung, Kota Bandung. Berdiri sejak tahun 2023, membina sekitar 420 anak yatim di 5 kelurahan binaan.
                    </p>
                </div>
            </div>
        </PublicLayout>
    );
}

