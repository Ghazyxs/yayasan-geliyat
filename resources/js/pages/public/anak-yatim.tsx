import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import {
    ChevronRight,
    GraduationCap,
    Sparkles,
    Search,
    BookOpen,
    ShieldCheck,
    Heart,
    MapPin,
    Calendar,
    UserCheck,
    ArrowRight,
} from 'lucide-react';
import PublicLayout from '@/layouts/public-layout';

export interface BidangPembinaanPublic {
    id: number;
    kode: string;
    nama: string;
    catatan_program?: string | null;
}

export interface AnakYatimPublicProfile {
    id: number;
    nama_publik: string;
    alias: string;
    inisial: string;
    jenis_kelamin: 'L' | 'P';
    jenis_kelamin_label: string;
    tempat_lahir: string;
    tanggal_lahir_publik: string;
    tempat_tanggal_lahir: string;
    usia: string;
    usia_tahun?: number | null;
    kelompok_usia: string;
    jenjang: 'SD' | 'SMP' | 'SMA' | 'Kuliah';
    kelas: string;
    kelurahan: string;
    hobi: string;
    cita_cita: string;
    potensi: string;
    prestasi: string[];
    izin_publikasi_foto: boolean;
    foto: string | null;
    bidang_pembinaan: BidangPembinaanPublic[];
}

interface AnakYatimPageProps {
    anakList?: AnakYatimPublicProfile[];
}

export default function AnakYatimPage({ anakList = [] }: AnakYatimPageProps) {
    const [selectedJenjang, setSelectedJenjang] = useState<string>('Semua');
    const [searchQuery, setSearchQuery] = useState<string>('');

    const jenjangList = ['Semua', 'SD', 'SMP', 'SMA'];

    const filteredAnak = anakList.filter((anak) => {
        const matchJenjang =
            selectedJenjang === 'Semua' || anak.jenjang === selectedJenjang;
        const q = searchQuery.toLowerCase();
        const matchSearch =
            anak.nama_publik.toLowerCase().includes(q) ||
            anak.kelurahan.toLowerCase().includes(q) ||
            anak.cita_cita.toLowerCase().includes(q) ||
            anak.hobi.toLowerCase().includes(q) ||
            anak.potensi.toLowerCase().includes(q);
        return matchJenjang && matchSearch;
    });

    const getJenjangBadgeColor = (jenjang: string) => {
        switch (jenjang) {
            case 'SD':
                return 'bg-sky-50 text-sky-700 border-sky-200';
            case 'SMP':
                return 'bg-teal-50 text-teal-700 border-teal-200';
            case 'SMA':
                return 'bg-indigo-50 text-indigo-700 border-indigo-200';
            default:
                return 'bg-emerald-50 text-emerald-700 border-emerald-200';
        }
    };

    return (
        <PublicLayout>
            <Head title="Profil & Potensi Anak Binaan - Yayasan Geliyat Mahdiesa Nahate" />

            {/* Banner Header with Breadcrumbs */}
            <div className="border-b border-[#e4eaec] bg-gradient-to-r from-[#d1f6fa]/60 via-[#e8f8fa] to-[#f7fcfd] py-10 sm:py-14">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <h1 className="font-poppins text-3xl font-bold text-slate-800 sm:text-4xl">
                        Profil & Potensi Anak Binaan
                    </h1>
                    <nav className="mt-2 flex items-center gap-2 font-poppins text-sm text-slate-500">
                        <Link
                            href="/"
                            className="transition-colors hover:text-[#14bace]"
                        >
                            Beranda
                        </Link>
                        <ChevronRight className="size-4 text-slate-400" />
                        <span className="font-semibold text-[#087f8c]">
                            Anak Yatim
                        </span>
                    </nav>
                    <p className="mt-3 max-w-2xl font-sans text-sm text-slate-600 sm:text-base">
                        Mengenal lebih dekat semangat belajar, jenjang
                        pendidikan, dan potensi anak-anak yatim binaan Yayasan
                        Geliyat di Kecamatan Ujungberung, Kota Bandung.
                    </p>
                </div>
            </div>

            {/* Statistik Ringkas Binaan */}
            <section className="border-b border-[#e4eaec] bg-white py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                        <div className="rounded-xl border border-[#e4eaec] bg-[#fbfdfd] p-4 text-center">
                            <p className="font-poppins text-2xl font-extrabold text-[#14bace] sm:text-3xl">
                                420
                            </p>
                            <p className="mt-1 font-sans text-xs font-medium text-slate-500">
                                Total Anak Yatim Terdata
                            </p>
                        </div>
                        <div className="rounded-xl border border-[#e4eaec] bg-[#fbfdfd] p-4 text-center">
                            <p className="font-poppins text-2xl font-extrabold text-[#087f8c] sm:text-3xl">
                                37
                            </p>
                            <p className="mt-1 font-sans text-xs font-medium text-slate-500">
                                Siswa Aktif Les Rutin (SD–SMA)
                            </p>
                        </div>
                        <div className="rounded-xl border border-[#e4eaec] bg-[#fbfdfd] p-4 text-center">
                            <p className="font-poppins text-2xl font-extrabold text-[#186972] sm:text-3xl">
                                5
                            </p>
                            <p className="mt-1 font-sans text-xs font-medium text-slate-500">
                                Kelurahan Wilayah Binaan
                            </p>
                        </div>
                        <div className="rounded-xl border border-[#e4eaec] bg-[#fbfdfd] p-4 text-center">
                            <p className="font-poppins text-2xl font-extrabold text-[#14bace] sm:text-3xl">
                                4
                            </p>
                            <p className="mt-1 font-sans text-xs font-medium text-slate-500">
                                Bidang Pembinaan Terpadu
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Filter & Daftar Profil Anak */}
            <section className="bg-[#f8fafb] py-12 sm:py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Pemberitahuan Privasi Anak */}
                    <div className="mb-8 flex items-start gap-3.5 rounded-2xl border border-[#cbebf0] bg-[#f7fcfd] p-4 sm:p-5">
                        <ShieldCheck className="mt-0.5 size-5 shrink-0 text-[#087f8c]" />
                        <div>
                            <h3 className="font-poppins text-xs font-bold text-[#087f8c] sm:text-sm">
                                Komitmen Perlindungan Privasi & Data Anak
                            </h3>
                            <p className="mt-1 font-sans text-xs leading-relaxed text-slate-600">
                                Demi keamanan, martabat, dan perlindungan anak,
                                halaman publik ini hanya menampilkan nama panggilan
                                aman, informasi pendidikan, kelompok usia, serta
                                potensi anak. Foto hanya ditampilkan apabila telah
                                mendapat izin publikasi resmi. Data sensitif (NIK,
                                alamat rumah lengkap, data wali, dan kontak
                                keluarga) dilindungi secara ketat di sistem
                                internal yayasan.
                            </p>
                        </div>
                    </div>

                    {/* Toolbar Filter & Pencarian */}
                    <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div className="flex flex-wrap items-center gap-2">
                            {jenjangList.map((j) => (
                                <button
                                    key={j}
                                    type="button"
                                    onClick={() => setSelectedJenjang(j)}
                                    className={`rounded-full px-4 py-2 font-poppins text-xs font-semibold transition sm:text-sm ${
                                        selectedJenjang === j
                                            ? 'bg-[#14bace] text-white shadow-xs'
                                            : 'border border-[#e4eaec] bg-white text-slate-600 hover:bg-[#e8f8fa] hover:text-[#087f8c]'
                                    }`}
                                >
                                    {j === 'Semua'
                                        ? 'Semua Jenjang'
                                        : `Jenjang ${j}`}
                                </button>
                            ))}
                        </div>

                        <div className="relative w-full sm:w-72">
                            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Cari nama, potensi, atau cita-cita..."
                                className="w-full rounded-xl border border-[#e4eaec] bg-white py-2.5 pr-4 pl-10 font-sans text-sm text-slate-700 outline-hidden transition focus:border-[#14bace] focus:ring-2 focus:ring-[#14bace]/20"
                            />
                        </div>
                    </div>

                    {/* Grid Kartu Anak */}
                    {filteredAnak.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {filteredAnak.map((anak) => (
                                <div
                                    key={anak.id}
                                    className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-[#e4eaec] bg-white shadow-xs transition duration-300 hover:-translate-y-0.5 hover:border-[#14bace]/40 hover:shadow-md"
                                >
                                    <div>
                                        {/* Header Visual / Foto Anak (hanya jika diizinkan) */}
                                        <Link
                                            href={`/anak-yatim/${anak.id}`}
                                            prefetch={false}
                                            className="relative block h-44 w-full overflow-hidden bg-gradient-to-br from-[#e8f8fa] via-[#d1f6fa]/60 to-[#f7fcfd]"
                                        >
                                            {anak.izin_publikasi_foto &&
                                            anak.foto ? (
                                                <img
                                                    src={anak.foto}
                                                    alt={`Foto ${anak.nama_publik}`}
                                                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full flex-col items-center justify-center p-4 text-center">
                                                    <div className="flex size-16 items-center justify-center rounded-2xl border border-[#14bace]/30 bg-white/90 font-poppins text-xl font-bold text-[#087f8c] shadow-xs">
                                                        {anak.inisial}
                                                    </div>
                                                    <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-white/85 px-2.5 py-0.5 text-[11px] font-medium text-slate-600">
                                                        <ShieldCheck className="size-3 text-[#087f8c]" />
                                                        Privasi Foto Terlindungi
                                                    </span>
                                                </div>
                                            )}

                                            <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                                                <span
                                                    className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold shadow-2xs backdrop-blur-xs ${getJenjangBadgeColor(
                                                        anak.jenjang,
                                                    )}`}
                                                >
                                                    <GraduationCap className="size-3" />
                                                    {anak.kelas}
                                                </span>
                                            </div>

                                            <div className="absolute top-3 right-3">
                                                <span className="inline-flex items-center gap-1 rounded-full border border-[#cbebf0] bg-white/95 px-2.5 py-0.5 text-[11px] font-semibold text-[#087f8c] shadow-2xs">
                                                    {anak.usia}
                                                </span>
                                            </div>
                                        </Link>

                                        {/* Konten Utama Card */}
                                        <div className="p-6">
                                            <div className="flex items-start justify-between gap-2">
                                                <div>
                                                    <Link
                                                        href={`/anak-yatim/${anak.id}`}
                                                        prefetch={false}
                                                        className="font-poppins text-lg font-bold text-slate-800 transition-colors group-hover:text-[#087f8c]"
                                                    >
                                                        {anak.nama_publik}
                                                    </Link>
                                                    <p className="mt-0.5 font-sans text-xs text-slate-500">
                                                        {anak.kelompok_usia}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Detail Informasi Publik */}
                                            <div className="mt-4 space-y-2.5 border-t border-slate-100 pt-4 text-xs text-slate-600">
                                                <div className="flex items-center justify-between gap-2">
                                                    <span className="flex items-center gap-1.5 text-slate-400">
                                                        <Calendar className="size-3.5 text-[#14bace]" />
                                                        Tempat, Tgl Lahir
                                                    </span>
                                                    <span className="text-right font-semibold text-slate-700">
                                                        {
                                                            anak.tempat_tanggal_lahir
                                                        }
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between gap-2">
                                                    <span className="flex items-center gap-1.5 text-slate-400">
                                                        <MapPin className="size-3.5 text-[#14bace]" />
                                                        Wilayah Binaan
                                                    </span>
                                                    <span className="font-semibold text-slate-700">
                                                        Kel. {anak.kelurahan}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between gap-2">
                                                    <span className="flex items-center gap-1.5 text-slate-400">
                                                        <BookOpen className="size-3.5 text-[#14bace]" />
                                                        Minat & Hobi
                                                    </span>
                                                    <span className="text-right font-semibold text-slate-700">
                                                        {anak.hobi}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between gap-2">
                                                    <span className="flex items-center gap-1.5 text-slate-400">
                                                        <Sparkles className="size-3.5 text-amber-500" />
                                                        Cita-Cita
                                                    </span>
                                                    <span className="font-semibold text-[#087f8c]">
                                                        {anak.cita_cita}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Ringkasan Potensi */}
                                            <p className="mt-4 line-clamp-2 font-sans text-xs leading-relaxed text-slate-600">
                                                {anak.potensi}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Action Button ke Halaman Detail Anak */}
                                    <div className="px-6 pb-6">
                                        <Link
                                            href={`/anak-yatim/${anak.id}`}
                                            prefetch={false}
                                            className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#14bace] bg-[#f7fcfd] px-4 py-2.5 font-poppins text-xs font-semibold text-[#087f8c] transition group-hover:bg-[#14bace] group-hover:text-white"
                                        >
                                            <UserCheck className="size-3.5" />
                                            <span>
                                                Lihat Detail & Potensi Anak
                                            </span>
                                            <ArrowRight className="size-3.5" />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-[#e4eaec] bg-white p-12 text-center">
                            <p className="font-poppins text-base font-semibold text-slate-700">
                                Data anak binaan tidak ditemukan
                            </p>
                            <p className="mt-1 font-sans text-xs text-slate-500">
                                Silakan ubah kata kunci pencarian atau pilih
                                filter jenjang pendidikan lainnya.
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {/* Bottom Call to Action */}
            <section className="bg-white py-12">
                <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col items-center justify-between gap-6 rounded-3xl bg-gradient-to-r from-[#087f8c] to-[#14bace] p-8 text-center text-white shadow-md sm:flex-row sm:p-10 sm:text-left">
                        <div className="max-w-xl">
                            <h3 className="font-poppins text-xl font-bold sm:text-2xl">
                                Dukung Pendidikan & Potensi Anak Yatim
                            </h3>
                            <p className="mt-2 font-sans text-xs leading-relaxed text-white/90 sm:text-sm">
                                Setiap dukungan yang Anda salurkan membantu
                                keberlangsungan bimbingan belajar, pembinaan
                                karakter, serta pemenuhan kebutuhan pendidikan
                                adik-adik yatim binaan di Ujungberung.
                            </p>
                        </div>
                        <Link
                            href="/donasi"
                            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-6 py-3.5 font-poppins text-sm font-bold text-[#087f8c] shadow-xs transition hover:bg-slate-50"
                        >
                            <Heart className="size-4 fill-current text-[#14bace]" />
                            <span>Salurkan Donasi Pendidikan</span>
                        </Link>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
