import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Search, ChevronRight, Heart, Shield, GraduationCap, MapPin } from 'lucide-react';
import PublicLayout from '@/layouts/public-layout';

interface AnakBinaan {
    id: number;
    alias: string;
    jenjang: 'SD' | 'SMP' | 'SMA' | 'Kuliah';
    kelas: string;
    kelurahan: string;
    hobi: string;
    citaCita: string;
    statusOrangTuaAsuh: 'Membutuhkan' | 'Tersedia';
}

const mockAnakList: AnakBinaan[] = [
    {
        id: 1,
        alias: 'Anak Binaan 01 (F.R.)',
        jenjang: 'SD',
        kelas: 'Kelas 4 SD',
        kelurahan: 'Cigending',
        hobi: 'Menggambar & Mewarnai',
        citaCita: 'Guru',
        statusOrangTuaAsuh: 'Membutuhkan',
    },
    {
        id: 2,
        alias: 'Anak Binaan 02 (A.S.)',
        jenjang: 'SD',
        kelas: 'Kelas 6 SD',
        kelurahan: 'Pasanggrahan',
        hobi: 'Membaca Cerita & Menulis',
        citaCita: 'Dokter',
        statusOrangTuaAsuh: 'Membutuhkan',
    },
    {
        id: 3,
        alias: 'Anak Binaan 03 (M.K.)',
        jenjang: 'SMP',
        kelas: 'Kelas 2 SMP',
        kelurahan: 'Pasir Endah',
        hobi: 'Bermain Bulu Tangkis',
        citaCita: 'Atlet / Wirausahawan',
        statusOrangTuaAsuh: 'Membutuhkan',
    },
    {
        id: 4,
        alias: 'Anak Binaan 04 (N.Z.)',
        jenjang: 'SMP',
        kelas: 'Kelas 3 SMP',
        kelurahan: 'Pasirjati',
        hobi: 'Sains & Robotik',
        citaCita: 'Insinyur Komputer',
        statusOrangTuaAsuh: 'Membutuhkan',
    },
    {
        id: 5,
        alias: 'Anak Binaan 05 (R.A.)',
        jenjang: 'SMA',
        kelas: 'Kelas 1 SMA',
        kelurahan: 'Pasirwangi',
        hobi: 'Desain Grafis & Fotografi',
        citaCita: 'Desainer Digital',
        statusOrangTuaAsuh: 'Membutuhkan',
    },
    {
        id: 6,
        alias: 'Anak Binaan 06 (D.P.)',
        jenjang: 'Kuliah',
        kelas: 'Semester 3 Perguruan Tinggi',
        kelurahan: 'Cigending',
        hobi: 'Koding & Membaca Buku',
        citaCita: 'Dosen Rekayasa Perangkat Lunak',
        statusOrangTuaAsuh: 'Tersedia',
    },
];

const jenjangFilters = ['Semua', 'SD', 'SMP', 'SMA', 'Kuliah'];

export default function AnakYatimPage() {
    const [selectedJenjang, setSelectedJenjang] = useState('Semua');
    const [searchQuery, setSearchQuery] = useState('');

    const filtered = mockAnakList.filter((item) => {
        const matchesJenjang = selectedJenjang === 'Semua' || item.jenjang === selectedJenjang;
        const matchesSearch =
            item.alias.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.kelurahan.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.hobi.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.citaCita.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesJenjang && matchesSearch;
    });

    return (
        <PublicLayout>
            <Head title="Anak Yatim Binaan - Yayasan Geliyat" />

            {/* Banner Header with Breadcrumbs */}
            <div className="bg-gradient-to-r from-[#d1f6fa]/60 via-[#e8f8fa] to-[#f7fcfd] border-b border-[#e4eaec] py-10 sm:py-14">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="font-poppins font-bold text-3xl sm:text-4xl text-[#1d2b2d]">
                        Anak Yatim Binaan
                    </h1>
                    <nav className="flex items-center gap-2 mt-2 text-sm text-gray-500 font-poppins">
                        <Link href="/" className="hover:text-[#14bace] transition-colors">
                            Beranda
                        </Link>
                        <ChevronRight className="size-4 text-gray-400" />
                        <span className="font-semibold text-[#186972]">Anak Binaan</span>
                    </nav>
                    <p className="mt-3 text-sm sm:text-base text-gray-600 max-w-2xl font-sans">
                        Mendukung pemenuhan pendidikan, nutrisi, dan masa depan sekitar 420 anak yatim yang tersebar di lima kelurahan wilayah Ujungberung, Kota Bandung.
                    </p>
                </div>
            </div>

            {/* Privacy Alert Box (From Report & Figma) */}
            <div className="bg-white border-b border-[#e4eaec] py-4">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="p-3.5 rounded-xl bg-[#f7f9fa] border border-[#e4eaec] flex items-start gap-3 text-xs text-gray-600 font-sans">
                        <Shield className="size-4 text-[#14bace] shrink-0 mt-0.5" />
                        <p className="leading-relaxed">
                            <strong>Prinsip Perlindungan Privasi Anak:</strong> Identitas lengkap, NIK, dan dokumen resmi anak disimpan secara rahasia di sistem internal dan hanya dapat diakses oleh petugas yayasan berwenang. Informasi publik ini disajikan terbatas untuk calon Orang Tua Asuh.
                        </p>
                    </div>
                </div>
            </div>

            {/* Filter & Search Bar */}
            <section className="py-6 bg-white border-b border-[#e4eaec] sticky top-20 z-40 shadow-xs">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                        {/* Search Input */}
                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Cari nama inisial, kelurahan, atau hobi..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-11 pr-4 py-2.5 rounded-full border border-[#65777a] focus:border-[#14bace] focus:ring-2 focus:ring-[#14bace]/20 text-sm font-sans outline-hidden transition"
                            />
                        </div>

                        {/* Jenjang Filter Buttons */}
                        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
                            {jenjangFilters.map((j) => {
                                const active = selectedJenjang === j;
                                return (
                                    <button
                                        key={j}
                                        type="button"
                                        onClick={() => setSelectedJenjang(j)}
                                        className={`px-5 py-2 rounded-full text-xs sm:text-sm font-poppins transition-all shrink-0 ${
                                            active
                                                ? 'bg-[#1d2b2d] text-white font-semibold shadow-xs'
                                                : 'bg-white border border-[#1d2b2d] text-[#1d2b2d] hover:bg-gray-50'
                                        }`}
                                    >
                                        {j}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* Cards Grid */}
            <section className="py-12 sm:py-16 bg-[#fbfdfd]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filtered.map((anak) => (
                            <div
                                key={anak.id}
                                className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
                            >
                                <div>
                                    {/* Avatar & Header */}
                                    <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
                                        <div className="size-16 rounded-2xl bg-[#e8f8fa] flex items-center justify-center text-[#14bace] font-bold text-lg font-poppins border border-[#14bace]/30 shadow-xs">
                                            {anak.alias.substring(0, 2)}
                                        </div>
                                        <div>
                                            <h3 className="font-poppins font-bold text-base text-[#1d2b2d]">
                                                {anak.alias}
                                            </h3>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#087f8c]">
                                                    <GraduationCap className="size-3.5" />
                                                    <span>{anak.kelas}</span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Attributes */}
                                    <div className="mt-4 space-y-2 text-xs font-sans text-gray-600">
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-400">Wilayah Binaan:</span>
                                            <span className="font-semibold text-[#1d2b2d] flex items-center gap-1">
                                                <MapPin className="size-3 text-[#14bace]" />
                                                Kel. {anak.kelurahan}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-400">Hobi:</span>
                                            <span className="font-medium text-gray-700">{anak.hobi}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-400">Cita-Cita:</span>
                                            <span className="font-medium text-[#186972]">{anak.citaCita}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer CTA */}
                                <div className="mt-6 pt-4 border-t border-gray-100">
                                    <Link
                                        href={`/donasi?anak=${encodeURIComponent(anak.alias)}`}
                                        className="w-full py-2.5 rounded-xl bg-[#e8f8fa] hover:bg-[#14bace] hover:text-white text-[#087f8c] font-poppins font-semibold text-xs flex items-center justify-center gap-2 transition"
                                    >
                                        <Heart className="size-3.5 fill-current" />
                                        <span>Bantu Jadi Orang Tua Asuh</span>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
