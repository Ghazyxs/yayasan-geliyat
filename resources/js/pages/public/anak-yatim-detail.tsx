import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    ArrowRight,
    Award,
    BookOpen,
    Calendar,
    CheckCircle2,
    ChevronRight,
    GraduationCap,
    Heart,
    Layers,
    MapPin,
    ShieldCheck,
    Sparkles,
    User,
} from 'lucide-react';
import PublicLayout from '@/layouts/public-layout';
import type { AnakYatimPublicProfile } from './anak-yatim';

interface AnakYatimDetailPageProps {
    anak: AnakYatimPublicProfile;
    anakLainnya?: AnakYatimPublicProfile[];
}

export default function AnakYatimDetailPage({
    anak,
    anakLainnya = [],
}: AnakYatimDetailPageProps) {
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
            <Head
                title={`Profil ${anak.nama_publik} - Anak Binaan Yayasan Geliyat`}
            />

            {/* Header & Breadcrumb */}
            <div className="border-b border-[#e4eaec] bg-gradient-to-r from-[#d1f6fa]/60 via-[#e8f8fa] to-[#f7fcfd] py-8 sm:py-12">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    <nav className="flex flex-wrap items-center gap-2 font-poppins text-xs text-slate-500 sm:text-sm">
                        <Link
                            href="/"
                            className="transition-colors hover:text-[#14bace]"
                        >
                            Beranda
                        </Link>
                        <ChevronRight className="size-4 text-slate-400" />
                        <Link
                            href="/anak-yatim"
                            className="transition-colors hover:text-[#14bace]"
                        >
                            Anak Yatim
                        </Link>
                        <ChevronRight className="size-4 text-slate-400" />
                        <span className="font-semibold text-[#087f8c]">
                            {anak.nama_publik}
                        </span>
                    </nav>

                    <div className="mt-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div>
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#14bace]/30 bg-white/90 px-3 py-1 font-poppins text-xs font-semibold text-[#087f8c]">
                                <ShieldCheck className="size-3.5 text-[#14bace]" />
                                Profil Publik Terlindungi
                            </span>
                            <h1 className="mt-2 font-poppins text-2xl font-bold text-slate-800 sm:text-4xl">
                                {anak.nama_publik}
                            </h1>
                            <p className="mt-1 font-sans text-sm text-slate-600">
                                {anak.kelompok_usia} • Jenjang {anak.jenjang} (
                                {anak.kelas})
                            </p>
                        </div>

                        <Link
                            href="/anak-yatim"
                            prefetch={false}
                            className="inline-flex items-center gap-2 self-start rounded-xl border border-[#e4eaec] bg-white px-4 py-2.5 font-poppins text-xs font-semibold text-slate-700 shadow-2xs transition hover:border-[#14bace] hover:text-[#087f8c]"
                        >
                            <ArrowLeft className="size-4" />
                            <span>Kembali ke Daftar Anak</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Konten Detail Anak */}
            <section className="bg-[#f8fafb] py-10 sm:py-14">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                        {/* Kolom Kiri: Kartu Identitas Aman & Foto */}
                        <div className="space-y-6 lg:col-span-4">
                            <div className="overflow-hidden rounded-3xl border border-[#e4eaec] bg-white shadow-xs">
                                {/* Foto Anak (Hanya ditampilkan jika izin_publikasi_foto === true) */}
                                <div className="relative h-64 w-full overflow-hidden bg-gradient-to-br from-[#e8f8fa] via-[#d1f6fa]/70 to-[#f7fcfd]">
                                    {anak.izin_publikasi_foto && anak.foto ? (
                                        <>
                                            <img
                                                src={anak.foto}
                                                alt={`Foto ${anak.nama_publik}`}
                                                className="h-full w-full object-cover"
                                            />
                                            <div className="absolute right-3 bottom-3 left-3 flex items-center justify-between rounded-xl bg-slate-900/75 px-3 py-1.5 text-[11px] font-medium text-white backdrop-blur-xs">
                                                <span className="flex items-center gap-1.5">
                                                    <CheckCircle2 className="size-3.5 text-emerald-400" />
                                                    Foto telah mendapat izin
                                                    publikasi wali
                                                </span>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center">
                                            <div className="flex size-24 items-center justify-center rounded-3xl border-2 border-[#14bace]/30 bg-white font-poppins text-3xl font-bold text-[#087f8c] shadow-sm">
                                                {anak.inisial}
                                            </div>
                                            <span className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-[#cbebf0] bg-white/90 px-3 py-1 text-xs font-semibold text-[#087f8c]">
                                                <ShieldCheck className="size-3.5 text-[#14bace]" />
                                                Foto Tidak Dipublikasikan
                                            </span>
                                            <p className="mt-1.5 max-w-xs font-sans text-[11px] leading-relaxed text-slate-500">
                                                Sesuai kebijakan perlindungan
                                                anak, foto hanya ditampilkan
                                                apabila terdapat izin publikasi.
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Ringkasan Biodata Publik Aman */}
                                <div className="p-6">
                                    <div className="flex flex-wrap items-center gap-2 pb-4">
                                        <span
                                            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${getJenjangBadgeColor(
                                                anak.jenjang,
                                            )}`}
                                        >
                                            <GraduationCap className="size-3.5" />
                                            {anak.kelas}
                                        </span>
                                        <span className="inline-flex items-center rounded-full border border-[#cbebf0] bg-[#e8f8fa] px-3 py-1 text-xs font-semibold text-[#087f8c]">
                                            {anak.usia}
                                        </span>
                                    </div>

                                    <dl className="divide-y divide-slate-100 border-t border-slate-100 text-xs sm:text-sm">
                                        <div className="flex items-start justify-between gap-3 py-3">
                                            <dt className="flex items-center gap-2 text-slate-500">
                                                <User className="size-4 shrink-0 text-[#14bace]" />
                                                <span>Nama Publik</span>
                                            </dt>
                                            <dd className="text-right font-semibold text-slate-800">
                                                {anak.nama_publik}
                                            </dd>
                                        </div>

                                        <div className="flex items-start justify-between gap-3 py-3">
                                            <dt className="flex items-center gap-2 text-slate-500">
                                                <Calendar className="size-4 shrink-0 text-[#14bace]" />
                                                <span>
                                                    Tempat, Tanggal Lahir
                                                </span>
                                            </dt>
                                            <dd className="text-right font-semibold text-slate-800">
                                                {anak.tempat_tanggal_lahir}
                                            </dd>
                                        </div>

                                        <div className="flex items-start justify-between gap-3 py-3">
                                            <dt className="flex items-center gap-2 text-slate-500">
                                                <GraduationCap className="size-4 shrink-0 text-[#14bace]" />
                                                <span>Jenjang Pendidikan</span>
                                            </dt>
                                            <dd className="text-right font-semibold text-slate-800">
                                                {anak.jenjang} ({anak.kelas})
                                            </dd>
                                        </div>

                                        <div className="flex items-start justify-between gap-3 py-3">
                                            <dt className="flex items-center gap-2 text-slate-500">
                                                <Layers className="size-4 shrink-0 text-[#14bace]" />
                                                <span>Kelompok Usia</span>
                                            </dt>
                                            <dd className="text-right font-semibold text-slate-800">
                                                {anak.kelompok_usia}
                                            </dd>
                                        </div>

                                        <div className="flex items-start justify-between gap-3 py-3">
                                            <dt className="flex items-center gap-2 text-slate-500">
                                                <MapPin className="size-4 shrink-0 text-[#14bace]" />
                                                <span>Kelurahan Binaan</span>
                                            </dt>
                                            <dd className="text-right font-semibold text-slate-800">
                                                Kel. {anak.kelurahan}
                                            </dd>
                                        </div>
                                    </dl>

                                    <div className="mt-5 border-t border-slate-100 pt-5">
                                        <Link
                                            href="/donasi"
                                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#14bace] px-4 py-3 font-poppins text-xs font-bold text-white shadow-xs transition hover:bg-[#087f8c] sm:text-sm"
                                        >
                                            <Heart className="size-4 fill-current" />
                                            <span>
                                                Dukung Pendidikan Anak Binaan
                                            </span>
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* Box Perlindungan Privasi */}
                            <div className="rounded-2xl border border-[#cbebf0] bg-[#f7fcfd] p-5">
                                <div className="flex items-start gap-3">
                                    <ShieldCheck className="mt-0.5 size-5 shrink-0 text-[#087f8c]" />
                                    <div>
                                        <h3 className="font-poppins text-xs font-bold text-[#087f8c] sm:text-sm">
                                            Standar Perlindungan Data Anak
                                        </h3>
                                        <p className="mt-1 font-sans text-xs leading-relaxed text-slate-600">
                                            Informasi sensitif seperti NIK,
                                            alamat rumah lengkap, nomor telepon,
                                            data wali, serta kondisi finansial
                                            keluarga tidak ditampilkan di
                                            halaman publik dan hanya dapat
                                            diakses oleh pengurus berwenang.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Kolom Kanan: Potensi Anak, Minat, Prestasi & Program Pembinaan */}
                        <div className="space-y-6 lg:col-span-8">
                            {/* Seksi Utama Potensi Anak */}
                            <div className="rounded-3xl border border-[#e4eaec] bg-white p-6 shadow-xs sm:p-8">
                                <div className="flex items-center gap-2.5">
                                    <div className="flex size-10 items-center justify-center rounded-xl bg-[#e8f8fa] text-[#087f8c]">
                                        <Sparkles className="size-5" />
                                    </div>
                                    <div>
                                        <span className="font-poppins text-[11px] font-bold tracking-wider text-[#14bace] uppercase">
                                            Bakat & Perkembangan
                                        </span>
                                        <h2 className="font-poppins text-xl font-bold text-slate-800 sm:text-2xl">
                                            Potensi Anak
                                        </h2>
                                    </div>
                                </div>

                                <p className="mt-5 font-sans text-sm leading-relaxed text-slate-700 sm:text-base">
                                    {anak.potensi}
                                </p>

                                {/* Highlight Minat/Hobi & Cita-cita */}
                                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div className="rounded-2xl border border-[#e4eaec] bg-[#fbfdfd] p-4">
                                        <div className="flex items-center gap-2.5">
                                            <div className="flex size-9 items-center justify-center rounded-xl bg-[#e8f8fa] text-[#087f8c]">
                                                <BookOpen className="size-4" />
                                            </div>
                                            <div>
                                                <p className="font-sans text-xs text-slate-500">
                                                    Minat & Kegemaran
                                                </p>
                                                <p className="font-poppins text-sm font-bold text-slate-800">
                                                    {anak.hobi}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="rounded-2xl border border-[#e4eaec] bg-[#fbfdfd] p-4">
                                        <div className="flex items-center gap-2.5">
                                            <div className="flex size-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                                                <Sparkles className="size-4" />
                                            </div>
                                            <div>
                                                <p className="font-sans text-xs text-slate-500">
                                                    Cita-Cita Masa Depan
                                                </p>
                                                <p className="font-poppins text-sm font-bold text-[#087f8c]">
                                                    {anak.cita_cita}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Capaian & Perkembangan Positif */}
                                {anak.prestasi && anak.prestasi.length > 0 && (
                                    <div className="mt-8 border-t border-slate-100 pt-6">
                                        <h3 className="flex items-center gap-2 font-poppins text-base font-bold text-slate-800">
                                            <Award className="size-5 text-[#14bace]" />
                                            <span>
                                                Capaian & Perkembangan Belajar
                                            </span>
                                        </h3>
                                        <ul className="mt-4 space-y-3">
                                            {anak.prestasi.map(
                                                (item, index) => (
                                                    <li
                                                        key={index}
                                                        className="flex items-start gap-3 rounded-xl border border-[#e4eaec]/80 bg-[#f8fafb] p-3.5 text-xs text-slate-700 sm:text-sm"
                                                    >
                                                        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[#14bace]" />
                                                        <span>{item}</span>
                                                    </li>
                                                ),
                                            )}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            {/* Program Pembinaan yang Diikuti di Yayasan Geliyat */}
                            {anak.bidang_pembinaan &&
                                anak.bidang_pembinaan.length > 0 && (
                                    <div className="rounded-3xl border border-[#e4eaec] bg-white p-6 shadow-xs sm:p-8">
                                        <h3 className="font-poppins text-lg font-bold text-slate-800">
                                            Program Pembinaan yang Diikuti
                                        </h3>
                                        <p className="mt-1 font-sans text-xs text-slate-500 sm:text-sm">
                                            Pendampingan aktif yang diterima{' '}
                                            {anak.nama_publik} melalui bidang
                                            program Yayasan Geliyat:
                                        </p>

                                        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                            {anak.bidang_pembinaan.map(
                                                (bidang) => (
                                                    <Link
                                                        key={bidang.id}
                                                        href={`/bidang/${bidang.kode}`}
                                                        prefetch={false}
                                                        className="group flex flex-col justify-between rounded-2xl border border-[#e4eaec] bg-[#fbfdfd] p-4 transition hover:border-[#14bace] hover:bg-[#f7fcfd]"
                                                    >
                                                        <div>
                                                            <div className="flex items-center justify-between gap-2">
                                                                <span className="font-poppins text-sm font-bold text-[#087f8c] group-hover:text-[#14bace]">
                                                                    Bidang{' '}
                                                                    {
                                                                        bidang.nama
                                                                    }
                                                                </span>
                                                                <ArrowRight className="size-4 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-[#14bace]" />
                                                            </div>
                                                            <p className="mt-2 font-sans text-xs leading-relaxed text-slate-600">
                                                                {bidang.catatan_program ||
                                                                    `Pendampingan aktif pada program Bidang ${bidang.nama}.`}
                                                            </p>
                                                        </div>
                                                    </Link>
                                                ),
                                            )}
                                        </div>
                                    </div>
                                )}
                        </div>
                    </div>

                    {/* Navigasi Profil Anak Binaan Lainnya */}
                    {anakLainnya.length > 0 && (
                        <div className="mt-14 border-t border-[#e4eaec] pt-10">
                            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                                <div>
                                    <span className="font-poppins text-xs font-bold tracking-wider text-[#14bace] uppercase">
                                        Anak Binaan Lainnya
                                    </span>
                                    <h2 className="mt-1 font-poppins text-xl font-bold text-slate-800 sm:text-2xl">
                                        Kenali Potensi Anak Binaan Lainnya
                                    </h2>
                                </div>
                                <Link
                                    href="/anak-yatim"
                                    prefetch={false}
                                    className="inline-flex items-center gap-1.5 font-poppins text-xs font-semibold text-[#087f8c] hover:text-[#14bace]"
                                >
                                    <span>Lihat Semua Anak Binaan</span>
                                    <ArrowRight className="size-4" />
                                </Link>
                            </div>

                            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
                                {anakLainnya.map((item) => (
                                    <Link
                                        key={item.id}
                                        href={`/anak-yatim/${item.id}`}
                                        prefetch={false}
                                        className="group flex flex-col justify-between rounded-2xl border border-[#e4eaec] bg-white p-5 shadow-2xs transition hover:-translate-y-0.5 hover:border-[#14bace]/50 hover:shadow-md"
                                    >
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#e8f8fa] font-poppins text-sm font-bold text-[#087f8c]">
                                                    {item.inisial}
                                                </div>
                                                <div>
                                                    <h3 className="font-poppins text-sm font-bold text-slate-800 group-hover:text-[#087f8c]">
                                                        {item.nama_publik}
                                                    </h3>
                                                    <p className="text-xs text-slate-500">
                                                        {item.kelas} •{' '}
                                                        {item.usia}
                                                    </p>
                                                </div>
                                            </div>
                                            <p className="mt-3 line-clamp-2 font-sans text-xs leading-relaxed text-slate-600">
                                                {item.potensi}
                                            </p>
                                        </div>
                                        <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[#087f8c] group-hover:text-[#14bace]">
                                            <span>Lihat Profil Anak</span>
                                            <ArrowRight className="size-3.5" />
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </PublicLayout>
    );
}

