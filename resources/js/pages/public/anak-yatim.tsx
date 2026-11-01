import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import {
    Search,
    ChevronRight,
    Heart,
    Shield,
    GraduationCap,
    MapPin,
} from 'lucide-react';
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
        const matchesJenjang =
            selectedJenjang === 'Semua' || item.jenjang === selectedJenjang;
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
            <div className="border-b border-[#e4eaec] bg-gradient-to-r from-[#d1f6fa]/60 via-[#e8f8fa] to-[#f7fcfd] py-10 sm:py-14">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <h1 className="font-poppins text-3xl font-bold text-[#1d2b2d] sm:text-4xl">
                        Anak Yatim Binaan
                    </h1>
                    <nav className="mt-2 flex items-center gap-2 font-poppins text-sm text-gray-500">
                        <Link
                            href="/"
                            className="transition-colors hover:text-[#14bace]"
                        >
                            Beranda
                        </Link>
                        <ChevronRight className="size-4 text-gray-400" />
                        <span className="font-semibold text-[#186972]">
                            Anak Binaan
                        </span>
                    </nav>
                    <p className="mt-3 max-w-2xl font-sans text-sm text-gray-600 sm:text-base">
                        Mendukung pemenuhan pendidikan, nutrisi, dan masa depan
                        sekitar 420 anak yatim yang tersebar di lima kelurahan
                        wilayah Ujungberung, Kota Bandung.
                    </p>
                </div>
            </div>

            {/* Privacy Alert Box (From Report & Figma) */}
            <div className="border-b border-[#e4eaec] bg-white py-4">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex items-start gap-3 rounded-xl border border-[#e4eaec] bg-[#f7f9fa] p-3.5 font-sans text-xs text-gray-600">
                        <Shield className="mt-0.5 size-4 shrink-0 text-[#14bace]" />
                        <p className="leading-relaxed">
                            <strong>Prinsip Perlindungan Privasi Anak:</strong>{' '}
                            Identitas lengkap, NIK, dan dokumen resmi anak
                            disimpan secara rahasia di sistem internal dan hanya
                            dapat diakses oleh petugas yayasan berwenang.
                            Informasi publik ini disajikan terbatas untuk calon
                            Orang Tua Asuh.
                        </p>
                    </div>
                </div>
            </div>

            {/* Filter & Search Bar */}
            <section className="sticky top-20 z-40 border-b border-[#e4eaec] bg-white py-6 shadow-xs">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col items-stretch justify-between gap-4 md:flex-row md:items-center">
                        {/* Search Input */}
                        <div className="relative w-full md:w-80">
                            <Search className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Cari nama inisial, kelurahan, atau hobi..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full rounded-full border border-[#65777a] py-2.5 pr-4 pl-11 font-sans text-sm outline-hidden transition focus:border-[#14bace] focus:ring-2 focus:ring-[#14bace]/20"
                            />
                        </div>

                        {/* Jenjang Filter Buttons */}
                        <div className="flex scrollbar-none items-center gap-2 overflow-x-auto pb-1 md:pb-0">
                            {jenjangFilters.map((j) => {
                                const active = selectedJenjang === j;
                                return (
                                    <button
                                        key={j}
                                        type="button"
                                        onClick={() => setSelectedJenjang(j)}
                                        className={`shrink-0 rounded-full px-5 py-2 font-poppins text-xs transition-all sm:text-sm ${
                                            active
                                                ? 'bg-[#1d2b2d] font-semibold text-white shadow-xs'
                                                : 'border border-[#1d2b2d] bg-white text-[#1d2b2d] hover:bg-gray-50'
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
            <section className="bg-[#fbfdfd] py-12 sm:py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {filtered.map((anak) => (
                            <div
                                key={anak.id}
                                className="flex flex-col justify-between rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-lg"
                            >
                                <div>
                                    {/* Avatar & Header */}
                                    <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
                                        <div className="flex size-16 items-center justify-center rounded-2xl border border-[#14bace]/30 bg-[#e8f8fa] font-poppins text-lg font-bold text-[#14bace] shadow-xs">
                                            {anak.alias.substring(0, 2)}
                                        </div>
                                        <div>
                                            <h3 className="font-poppins text-base font-bold text-[#1d2b2d]">
                                                {anak.alias}
                                            </h3>
                                            <div className="mt-0.5 flex items-center gap-2">
                                                <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#087f8c]">
                                                    <GraduationCap className="size-3.5" />
                                                    <span>{anak.kelas}</span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Attributes */}
                                    <div className="mt-4 space-y-2 font-sans text-xs text-gray-600">
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-400">
                                                Wilayah Binaan:
                                            </span>
                                            <span className="flex items-center gap-1 font-semibold text-[#1d2b2d]">
                                                <MapPin className="size-3 text-[#14bace]" />
                                                Kel. {anak.kelurahan}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-400">
                                                Hobi:
                                            </span>
                                            <span className="font-medium text-gray-700">
                                                {anak.hobi}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-400">
                                                Cita-Cita:
                                            </span>
                                            <span className="font-medium text-[#186972]">
                                                {anak.citaCita}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer CTA */}
                                <div className="mt-6 border-t border-gray-100 pt-4">
                                    <Link
                                        href={`/donasi?anak=${encodeURIComponent(anak.alias)}`}
                                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#e8f8fa] py-2.5 font-poppins text-xs font-semibold text-[#087f8c] transition hover:bg-[#14bace] hover:text-white"
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
