import { Head } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';

export default function BidangPage() {
    return (
        <PublicLayout>
            <Head title="Bidang Yayasan - Yayasan Geliyat" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="max-w-3xl">
                    <span className="text-xs font-bold text-[#14bace] uppercase tracking-wider">
                        Pilar Program
                    </span>
                    <h1 className="mt-2 text-3xl sm:text-4xl font-bold font-poppins text-[#1d2b2d]">
                        Empat Bidang Utama Yayasan
                    </h1>
                    <p className="mt-4 text-gray-600 leading-relaxed font-sans">
                        Pendidikan, Keagamaan, Kemanusiaan, serta Ekonomi & Koperasi untuk mendampingi tumbuh kembang anak secara menyeluruh.
                    </p>
                </div>
            </div>
        </PublicLayout>
    );
}

