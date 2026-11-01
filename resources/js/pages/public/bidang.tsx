import { Head, Link } from '@inertiajs/react';
import {
    BookOpen,
    Heart,
    Sparkles,
    Users,
    ChevronRight,
    ArrowRight,
    CheckCircle2,
} from 'lucide-react';
import PublicLayout from '@/layouts/public-layout';

export default function BidangPage() {
    const bidangList = [
        {
            title: 'Pendidikan',
            subtitle: 'Membuka Pintu Ilmu dan Masa Depan Gemilang',
            description:
                'Mendukung pendidikan anak yatim melalui bimbingan belajar, pembinaan intensif, dan bantuan beasiswa untuk mengembangkan potensi mereka.',
            icon: BookOpen,
            color: 'teal',
            image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800&auto=format&fit=crop',
            programs: [
                'Bimbel Sinar (Sahabat Inspirasi Anak Remaja) untuk siswa SD',
                'Gemilang (Gerakan Militan Pejuang Geliyat) pembinaan pengajar & tajwid',
                'Beasiswa Prestasi Siswa Berperingkat Setiap Semester',
                'Program Geliyat Mensarjanakan ke Jenjang Perguruan Tinggi',
            ],
        },
        {
            title: 'Kemanusiaan',
            subtitle: 'Amanah Kepedulian Langsung dan Tepat Sasaran',
            description:
                'Memberikan santunan rutin dan bantuan sosial bagi anak yatim serta keluarganya sesuai kebutuhan riil di lapangan.',
            icon: Heart,
            color: 'deep',
            image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=800&auto=format&fit=crop',
            programs: [
                'Santunan Rutin Bulanan di Masjid Besar Ujungberung',
                'Santunan Paket Sembako Munggahan Menjelang Ramadhan',
                'Santunan Hari Raya Idul Fitri bagi Anak & Keluarga',
                'Bantuan Darurat Kesehatan dan Musibah',
                'Ulin Bareng Anak Yatim (UBAY) rekreasi edukatif tahunan',
            ],
        },
        {
            title: 'Ekonomi dan Koperasi',
            subtitle: 'Menumbuhkan Kemandirian Finansial Keluarga Yatim',
            description:
                'Mendorong kemandirian ekonomi keluarga anak yatim (Ummu Geliyat) melalui kegiatan koperasi dan pemberdayaan bersama.',
            icon: Sparkles,
            color: 'teal',
            image: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?q=80&w=800&auto=format&fit=crop',
            programs: [
                'Penyediaan Sembako dan Kebutuhan Rumah Tangga Berkualitas',
                'Pengelolaan Simpanan Pokok, Wajib, dan Sukarela',
                'Layanan Simpan Pinjam Khusus Anggota Koperasi',
                'Pemberdayaan Wirausaha Mandiri bagi Ummu Geliyat',
            ],
        },
        {
            title: 'Keagamaan',
            subtitle: 'Menanamkan Karakter Qur’ani dan Nilai Akhlak',
            description:
                'Mendukung pembinaan keagamaan melalui kegiatan mengaji, kajian keluarga, dan penguatan nilai spiritual bagi anak dan wali.',
            icon: Users,
            color: 'deep',
            image: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?q=80&w=800&auto=format&fit=crop',
            programs: [
                'Gemar (Gerakan Mengaji Anak Remaja) usia SMP dan SMA',
                'Binatulya (Bina Orang Tua Yatim) pengajian & siraman rohani bulanan',
                'Turwil (Turun Wilayah) silaturahmi ke rumah orang tua binaan',
                'Pelatihan Tahsin & Pembinaan Akhlak Berkelanjutan',
            ],
        },
    ];

    return (
        <PublicLayout>
            <Head title="Bidang Yayasan - Empat Pilar Program Geliyat" />

            {/* Banner Header with Breadcrumbs */}
            <div className="border-b border-[#e4eaec] bg-gradient-to-r from-[#d1f6fa]/60 via-[#e8f8fa] to-[#f7fcfd] py-10 sm:py-14">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <h1 className="font-poppins text-3xl font-bold text-[#1d2b2d] sm:text-4xl">
                        Bidang Yayasan
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
                            Empat Bidang
                        </span>
                    </nav>
                    <p className="mt-4 max-w-3xl font-sans text-sm leading-relaxed text-gray-600 sm:text-base">
                        Yayasan Geliyat mengelola empat bidang utama untuk
                        memperkuat pelayanan sosial, pendidikan, kemandirian
                        ekonomi, dan pembinaan keagamaan bagi 420+ anak yatim
                        serta keluarga binaan di lima kelurahan wilayah
                        Ujungberung.
                    </p>
                </div>
            </div>

            {/* List of 4 Fields */}
            <section className="bg-white py-16 sm:py-20">
                <div className="mx-auto max-w-7xl space-y-16 px-4 sm:px-6 lg:px-8">
                    {bidangList.map((bidang, idx) => (
                        <div
                            key={bidang.title}
                            className={`grid grid-cols-1 items-center gap-10 lg:grid-cols-12 ${
                                idx % 2 === 1 ? 'lg:flex-row-reverse' : ''
                            }`}
                        >
                            {/* Image side */}
                            <div
                                className={`lg:col-span-5 ${idx % 2 === 1 ? 'lg:order-2' : ''}`}
                            >
                                <div className="group relative overflow-hidden rounded-3xl border border-[#e4eaec] shadow-md">
                                    <img
                                        src={bidang.image}
                                        alt={bidang.title}
                                        className="h-72 w-full object-cover transition-transform duration-300 group-hover:scale-105 sm:h-80"
                                    />
                                    <div className="absolute top-4 left-4 rounded-full bg-white/90 px-3.5 py-1 font-poppins text-xs font-bold text-[#087f8c] shadow-xs backdrop-blur-xs">
                                        Bidang 0{idx + 1}
                                    </div>
                                </div>
                            </div>

                            {/* Details side */}
                            <div
                                className={`flex flex-col items-start lg:col-span-7 ${idx % 2 === 1 ? 'lg:order-1' : ''}`}
                            >
                                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#e8f8fa] px-3 py-1 font-poppins text-xs font-semibold text-[#087f8c]">
                                    <bidang.icon className="size-3.5" />
                                    <span>Pilar Geliyat</span>
                                </div>

                                <h2 className="font-poppins text-2xl font-bold text-[#1d2b2d] sm:text-3xl">
                                    {bidang.title}
                                </h2>
                                <p className="mt-1 font-poppins text-xs font-semibold text-[#186972] sm:text-sm">
                                    {bidang.subtitle}
                                </p>
                                <p className="mt-3 font-sans text-sm leading-relaxed text-gray-600">
                                    {bidang.description}
                                </p>

                                {/* Programs sub-list */}
                                <div className="mt-6 w-full space-y-2.5 border-t border-gray-100 pt-4">
                                    <p className="font-poppins text-xs font-bold tracking-wider text-gray-400 uppercase">
                                        Program Unggulan:
                                    </p>
                                    {bidang.programs.map((prog) => (
                                        <div
                                            key={prog}
                                            className="flex items-start gap-2.5 font-sans text-xs text-gray-700 sm:text-sm"
                                        >
                                            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[#14bace]" />
                                            <span>{prog}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-8">
                                    <Link
                                        href="/donasi"
                                        className="inline-flex items-center gap-2 rounded-xl bg-[#14bace] px-5 py-2.5 font-poppins text-xs font-semibold text-white shadow-sm transition hover:bg-[#087f8c] sm:text-sm"
                                    >
                                        <span>Dukung Program Ini</span>
                                        <ArrowRight className="size-3.5" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </PublicLayout>
    );
}
