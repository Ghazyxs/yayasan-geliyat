import { Head, Link } from '@inertiajs/react';
import {
    Target,
    Compass,
    Users2,
    ChevronRight,
    ShieldCheck,
    HeartHandshake,
} from 'lucide-react';
import PublicLayout from '@/layouts/public-layout';

export default function ProfilPage() {
    const dewanPembina = [
        {
            jabatan: 'Ketua Dewan Pembina',
            status: 'Pengarah Strategis',
            deskripsi:
                'Mengarahkan kebijakan strategis dan memastikan keselarasan visi yayasan dengan program-program pemberdayaan yatim.',
        },
        {
            jabatan: 'Anggota Dewan Pembina',
            status: 'Pengawas Program',
            deskripsi:
                'Membantu memantau keberlanjutan program dan memberikan masukan strategis untuk pengembangan kapasitas yayasan.',
        },
    ];

    const pengurusHarian = [
        {
            jabatan: 'Ketua Umum Yayasan',
            status: 'Pimpinan Eksekutif',
            deskripsi:
                'Memimpin operasional sehari-hari, mengelola koordinasi 5 kelurahan binaan, dan memastikan implementasi visi yayasan.',
        },
        {
            jabatan: 'Sekretariat & Operasional',
            status: 'Manajemen Data & Dokumen',
            deskripsi:
                'Mengkoordinasikan pendataan berkas anak yatim bersama koordinator RW dan mengelola administrasi yayasan.',
        },
        {
            jabatan: 'Bendahara Yayasan',
            status: 'Manajemen Keuangan & Donasi',
            deskripsi:
                'Mengelola pencatatan kas donasi, rekonsiliasi transfer donatur, serta transparansi pelaporan keuangan bulanan.',
        },
    ];

    return (
        <PublicLayout>
            <Head title="Profil Yayasan - Yayasan Geliyat Mahdiesa Nahate" />

            {/* Banner Header with Breadcrumbs */}
            <div className="border-b border-[#e4eaec] bg-gradient-to-r from-[#d1f6fa]/60 via-[#e8f8fa] to-[#f7fcfd] py-10 sm:py-14">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <h1 className="font-poppins text-3xl font-bold text-[#1d2b2d] sm:text-4xl">
                        Profil Yayasan
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
                            Profil Yayasan
                        </span>
                    </nav>
                </div>
            </div>

            {/* Tentang Yayasan Section */}
            <section className="bg-white py-16 sm:py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
                        {/* Image Placeholder with Styling */}
                        <div className="lg:col-span-5">
                            <div className="relative overflow-hidden rounded-3xl border border-[#e4eaec] bg-gradient-to-tr from-[#14bace]/20 to-[#186972]/10 p-2 shadow-xl">
                                <img
                                    src="https://images.unsplash.com/photo-1542810634-71277d95dcbb?q=80&w=1000&auto=format&fit=crop"
                                    alt="Yayasan Geliyat Bersama Anak Yatim"
                                    className="h-80 w-full rounded-2xl object-cover sm:h-96"
                                />
                                <div className="absolute right-6 bottom-6 left-6 rounded-xl border border-white/50 bg-white/95 p-4 shadow-md backdrop-blur-md">
                                    <p className="font-poppins text-sm font-bold text-[#1d2b2d]">
                                        Berdiri Sejak 2023
                                    </p>
                                    <p className="mt-0.5 text-xs text-gray-600">
                                        Membina 420+ anak yatim di Kec.
                                        Ujungberung, Kota Bandung
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex flex-col items-start lg:col-span-7">
                            <span className="font-poppins text-xs font-bold tracking-wider text-[#14bace] uppercase">
                                Tentang Kami
                            </span>
                            <h2 className="mt-2 font-poppins text-2xl leading-snug font-bold text-[#1d2b2d] sm:text-4xl">
                                Bergerak Bersama Mengangkat Kesejahteraan Yatim
                            </h2>
                            <div className="mt-6 space-y-4 font-sans text-sm leading-relaxed text-gray-600 sm:text-base">
                                <p>
                                    <strong>
                                        Yayasan Geliyat Mahdiesa Nahate
                                    </strong>{' '}
                                    berawal dari gerakan kepedulian Badan Kontak
                                    Majelis Taklim (BKMM) di Ujungberung, Kota
                                    Bandung. Seiring bertambahnya penerima
                                    manfaat dan kepercayaan para dermawan,
                                    yayasan resmi didirikan pada tahun 2023
                                    untuk menaungi pelayanan sosial yang lebih
                                    baku dan terstruktur.
                                </p>
                                <p>
                                    Saat ini, Geliyat menaungi sekitar 420 anak
                                    yatim yang tersebar di lima kelurahan
                                    binaan:{' '}
                                    <em>
                                        Cigending, Pasanggrahan, Pasir Endah,
                                        Pasirjati, dan Pasirwangi
                                    </em>
                                    . Melalui kolaborasi pengurus (yang
                                    mayoritas adalah ibu-ibu relawan
                                    berdedikasi), donatur, dan masyarakat,
                                    Geliyat berkomitmen mendampingi anak hingga
                                    jenjang mandiri.
                                </p>
                            </div>

                            <div className="mt-8 flex flex-wrap gap-4">
                                <div className="flex items-center gap-2.5 rounded-xl border border-[#14bace]/20 bg-[#e8f8fa] px-4 py-2.5 text-xs font-semibold text-[#087f8c]">
                                    <ShieldCheck className="size-4" />
                                    <span>
                                        Paten Terdaftar & Rekomendasi Kemensos
                                    </span>
                                </div>
                                <div className="flex items-center gap-2.5 rounded-xl border border-[#14bace]/20 bg-[#e8f8fa] px-4 py-2.5 text-xs font-semibold text-[#087f8c]">
                                    <HeartHandshake className="size-4" />
                                    <span>Kemitraan Internasional (Texas)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Visi & Misi Section */}
            <section className="border-y border-[#e4eaec] bg-[#d1f6fa]/30 py-16 sm:py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
                        {/* Visi */}
                        <div className="flex flex-col justify-between rounded-3xl border border-[#e4eaec] bg-white p-8 shadow-sm sm:p-10">
                            <div>
                                <div className="flex items-center gap-3">
                                    <div className="flex size-12 items-center justify-center rounded-2xl bg-[#e8f8fa] text-[#14bace]">
                                        <Compass className="size-6" />
                                    </div>
                                    <h3 className="font-poppins text-2xl font-bold text-[#1d2b2d]">
                                        VISI YAYASAN
                                    </h3>
                                </div>
                                <p className="mt-6 font-sans text-base leading-relaxed font-medium text-[#1b373b] sm:text-lg">
                                    "Mewujudkan masa depan yang lebih baik bagi
                                    anak yatim melalui pendidikan bermartabat,
                                    pembinaan keagamaan, aksi kemanusiaan, dan
                                    pemberdayaan ekonomi keluarga."
                                </p>
                            </div>
                            <div className="mt-8 flex items-center gap-2 border-t border-gray-100 pt-6 text-xs text-gray-500">
                                <span className="size-2 rounded-full bg-[#14bace]"></span>
                                <span>Pedoman komitmen Yayasan Geliyat</span>
                            </div>
                        </div>

                        {/* Misi */}
                        <div className="rounded-3xl border border-[#e4eaec] bg-white p-8 shadow-sm sm:p-10">
                            <div className="flex items-center gap-3">
                                <div className="flex size-12 items-center justify-center rounded-2xl bg-[#e8f8fa] text-[#186972]">
                                    <Target className="size-6" />
                                </div>
                                <h3 className="font-poppins text-2xl font-bold text-[#1d2b2d]">
                                    MISI YAYASAN
                                </h3>
                            </div>
                            <ol className="mt-6 space-y-3.5 font-sans text-sm text-gray-600 sm:text-base">
                                <li className="flex items-start gap-3">
                                    <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-[#14bace] text-xs font-bold text-white">
                                        1
                                    </span>
                                    <span>
                                        Mendukung pendidikan dan pengembangan
                                        potensi minat bakat anak yatim secara
                                        terpadu.
                                    </span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-[#14bace] text-xs font-bold text-white">
                                        2
                                    </span>
                                    <span>
                                        Membina nilai keagamaan, akhlak mulia,
                                        dan penguatan karakter qur'ani sejak
                                        dini.
                                    </span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-[#14bace] text-xs font-bold text-white">
                                        3
                                    </span>
                                    <span>
                                        Memberikan santunan rutin, bantuan
                                        logistik berkala, serta advokasi
                                        perlindungan yatim.
                                    </span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-[#14bace] text-xs font-bold text-white">
                                        4
                                    </span>
                                    <span>
                                        Mendorong kemandirian ekonomi keluarga
                                        yatim (Ummu Geliyat) melalui
                                        pemberdayaan koperasi.
                                    </span>
                                </li>
                            </ol>
                        </div>
                    </div>
                </div>
            </section>

            {/* Struktur Organisasi Section */}
            <section className="bg-white py-16 sm:py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-12 max-w-3xl">
                        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#e8f8fa] px-3 py-1 font-poppins text-xs font-semibold tracking-wider text-[#087f8c] uppercase">
                            <Users2 className="size-3.5" />
                            <span>Struktur Organisasi</span>
                        </div>
                        <h2 className="font-poppins text-3xl font-bold text-[#1d2b2d]">
                            Susunan Kepengurusan
                        </h2>
                        <p className="mt-2 font-sans text-sm text-gray-600">
                            Sinergi antara Dewan Pembina dan Pengurus Harian
                            yang amanah mengabdi untuk kepentingan anak binaan.
                        </p>
                    </div>

                    {/* Dewan Pembina */}
                    <div className="mb-12">
                        <h3 className="mb-6 flex items-center gap-2 font-poppins text-lg font-bold text-[#1d2b2d]">
                            <span className="h-4 w-1 rounded-full bg-[#14bace]"></span>
                            <span>Dewan Pembina</span>
                        </h3>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            {dewanPembina.map((item) => (
                                <div
                                    key={item.jabatan}
                                    className="flex flex-col justify-between rounded-2xl border border-[#e4eaec] bg-[#fbfdfd] p-6"
                                >
                                    <div>
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-poppins text-base font-bold text-[#1d2b2d]">
                                                {item.jabatan}
                                            </h4>
                                            <span className="rounded-md bg-[#e8f8fa] px-2.5 py-1 text-[10px] font-semibold tracking-wider text-[#087f8c] uppercase">
                                                {item.status}
                                            </span>
                                        </div>
                                        <p className="mt-3 font-sans text-xs leading-relaxed text-gray-600">
                                            {item.deskripsi}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Pengurus Harian */}
                    <div>
                        <h3 className="mb-6 flex items-center gap-2 font-poppins text-lg font-bold text-[#1d2b2d]">
                            <span className="h-4 w-1 rounded-full bg-[#186972]"></span>
                            <span>Pengurus Harian & Operasional</span>
                        </h3>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            {pengurusHarian.map((item) => (
                                <div
                                    key={item.jabatan}
                                    className="flex flex-col justify-between rounded-2xl border border-[#e4eaec] bg-[#fbfdfd] p-6"
                                >
                                    <div>
                                        <div className="flex flex-col gap-1">
                                            <h4 className="font-poppins text-base font-bold text-[#1d2b2d]">
                                                {item.jabatan}
                                            </h4>
                                            <span className="self-start rounded bg-[#e8f8fa] px-2 py-0.5 text-[10px] font-semibold text-[#087f8c]">
                                                {item.status}
                                            </span>
                                        </div>
                                        <p className="mt-3 font-sans text-xs leading-relaxed text-gray-600">
                                            {item.deskripsi}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
