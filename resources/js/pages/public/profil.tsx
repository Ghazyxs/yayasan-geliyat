import { Head, Link } from '@inertiajs/react';
import { Target, Compass, Users2, ChevronRight, ShieldCheck, HeartHandshake } from 'lucide-react';
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
            <div className="bg-gradient-to-r from-[#d1f6fa]/60 via-[#e8f8fa] to-[#f7fcfd] border-b border-[#e4eaec] py-10 sm:py-14">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="font-poppins font-bold text-3xl sm:text-4xl text-[#1d2b2d]">
                        Profil Yayasan
                    </h1>
                    <nav className="flex items-center gap-2 mt-2 text-sm text-gray-500 font-poppins">
                        <Link href="/" className="hover:text-[#14bace] transition-colors">
                            Beranda
                        </Link>
                        <ChevronRight className="size-4 text-gray-400" />
                        <span className="font-semibold text-[#186972]">Profil Yayasan</span>
                    </nav>
                </div>
            </div>

            {/* Tentang Yayasan Section */}
            <section className="py-16 sm:py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        {/* Image Placeholder with Styling */}
                        <div className="lg:col-span-5">
                            <div className="relative rounded-3xl overflow-hidden shadow-xl border border-[#e4eaec] bg-gradient-to-tr from-[#14bace]/20 to-[#186972]/10 p-2">
                                <img
                                    src="https://images.unsplash.com/photo-1542810634-71277d95dcbb?q=80&w=1000&auto=format&fit=crop"
                                    alt="Yayasan Geliyat Bersama Anak Yatim"
                                    className="w-full h-80 sm:h-96 object-cover rounded-2xl"
                                />
                                <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md p-4 rounded-xl border border-white/50 shadow-md">
                                    <p className="font-poppins font-bold text-sm text-[#1d2b2d]">
                                        Berdiri Sejak 2023
                                    </p>
                                    <p className="text-xs text-gray-600 mt-0.5">
                                        Membina 420+ anak yatim di Kec. Ujungberung, Kota Bandung
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="lg:col-span-7 flex flex-col items-start">
                            <span className="text-xs font-bold text-[#14bace] uppercase tracking-wider font-poppins">
                                Tentang Kami
                            </span>
                            <h2 className="mt-2 text-2xl sm:text-4xl font-bold font-poppins text-[#1d2b2d] leading-snug">
                                Bergerak Bersama Mengangkat Kesejahteraan Yatim
                            </h2>
                            <div className="mt-6 space-y-4 text-gray-600 leading-relaxed font-sans text-sm sm:text-base">
                                <p>
                                    <strong>Yayasan Geliyat Mahdiesa Nahate</strong> berawal dari gerakan kepedulian Badan Kontak Majelis Taklim (BKMM) di Ujungberung, Kota Bandung. Seiring bertambahnya penerima manfaat dan kepercayaan para dermawan, yayasan resmi didirikan pada tahun 2023 untuk menaungi pelayanan sosial yang lebih baku dan terstruktur.
                                </p>
                                <p>
                                    Saat ini, Geliyat menaungi sekitar 420 anak yatim yang tersebar di lima kelurahan binaan: <em>Cigending, Pasanggrahan, Pasir Endah, Pasirjati, dan Pasirwangi</em>. Melalui kolaborasi pengurus (yang mayoritas adalah ibu-ibu relawan berdedikasi), donatur, dan masyarakat, Geliyat berkomitmen mendampingi anak hingga jenjang mandiri.
                                </p>
                            </div>

                            <div className="mt-8 flex flex-wrap gap-4">
                                <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#e8f8fa] border border-[#14bace]/20 text-[#087f8c] text-xs font-semibold">
                                    <ShieldCheck className="size-4" />
                                    <span>Paten Terdaftar & Rekomendasi Kemensos</span>
                                </div>
                                <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#e8f8fa] border border-[#14bace]/20 text-[#087f8c] text-xs font-semibold">
                                    <HeartHandshake className="size-4" />
                                    <span>Kemitraan Internasional (Texas)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Visi & Misi Section */}
            <section className="py-16 sm:py-20 bg-[#d1f6fa]/30 border-y border-[#e4eaec]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* Visi */}
                        <div className="rounded-3xl bg-white border border-[#e4eaec] p-8 sm:p-10 shadow-sm flex flex-col justify-between">
                            <div>
                                <div className="flex items-center gap-3">
                                    <div className="size-12 rounded-2xl bg-[#e8f8fa] flex items-center justify-center text-[#14bace]">
                                        <Compass className="size-6" />
                                    </div>
                                    <h3 className="font-poppins font-bold text-2xl text-[#1d2b2d]">
                                        VISI YAYASAN
                                    </h3>
                                </div>
                                <p className="mt-6 text-base sm:text-lg text-[#1b373b] font-medium leading-relaxed font-sans">
                                    "Mewujudkan masa depan yang lebih baik bagi anak yatim melalui pendidikan bermartabat, pembinaan keagamaan, aksi kemanusiaan, dan pemberdayaan ekonomi keluarga."
                                </p>
                            </div>
                            <div className="mt-8 pt-6 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-500">
                                <span className="size-2 rounded-full bg-[#14bace]"></span>
                                <span>Pedoman komitmen Yayasan Geliyat</span>
                            </div>
                        </div>

                        {/* Misi */}
                        <div className="rounded-3xl bg-white border border-[#e4eaec] p-8 sm:p-10 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="size-12 rounded-2xl bg-[#e8f8fa] flex items-center justify-center text-[#186972]">
                                    <Target className="size-6" />
                                </div>
                                <h3 className="font-poppins font-bold text-2xl text-[#1d2b2d]">
                                    MISI YAYASAN
                                </h3>
                            </div>
                            <ol className="mt-6 space-y-3.5 text-sm sm:text-base text-gray-600 font-sans">
                                <li className="flex items-start gap-3">
                                    <span className="size-6 rounded-full bg-[#14bace] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                                        1
                                    </span>
                                    <span>Mendukung pendidikan dan pengembangan potensi minat bakat anak yatim secara terpadu.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="size-6 rounded-full bg-[#14bace] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                                        2
                                    </span>
                                    <span>Membina nilai keagamaan, akhlak mulia, dan penguatan karakter qur'ani sejak dini.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="size-6 rounded-full bg-[#14bace] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                                        3
                                    </span>
                                    <span>Memberikan santunan rutin, bantuan logistik berkala, serta advokasi perlindungan yatim.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="size-6 rounded-full bg-[#14bace] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                                        4
                                    </span>
                                    <span>Mendorong kemandirian ekonomi keluarga yatim (Ummu Geliyat) melalui pemberdayaan koperasi.</span>
                                </li>
                            </ol>
                        </div>
                    </div>
                </div>
            </section>

            {/* Struktur Organisasi Section */}
            <section className="py-16 sm:py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl mb-12">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e8f8fa] text-[#087f8c] font-poppins text-xs font-semibold uppercase tracking-wider mb-3">
                            <Users2 className="size-3.5" />
                            <span>Struktur Organisasi</span>
                        </div>
                        <h2 className="text-3xl font-bold font-poppins text-[#1d2b2d]">
                            Susunan Kepengurusan
                        </h2>
                        <p className="mt-2 text-sm text-gray-600 font-sans">
                            Sinergi antara Dewan Pembina dan Pengurus Harian yang amanah mengabdi untuk kepentingan anak binaan.
                        </p>
                    </div>

                    {/* Dewan Pembina */}
                    <div className="mb-12">
                        <h3 className="font-poppins font-bold text-lg text-[#1d2b2d] mb-6 flex items-center gap-2">
                            <span className="h-4 w-1 bg-[#14bace] rounded-full"></span>
                            <span>Dewan Pembina</span>
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {dewanPembina.map((item) => (
                                <div
                                    key={item.jabatan}
                                    className="p-6 rounded-2xl border border-[#e4eaec] bg-[#fbfdfd] flex flex-col justify-between"
                                >
                                    <div>
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-poppins font-bold text-base text-[#1d2b2d]">
                                                {item.jabatan}
                                            </h4>
                                            <span className="px-2.5 py-1 rounded-md text-[10px] font-semibold bg-[#e8f8fa] text-[#087f8c] uppercase tracking-wider">
                                                {item.status}
                                            </span>
                                        </div>
                                        <p className="mt-3 text-xs text-gray-600 leading-relaxed font-sans">
                                            {item.deskripsi}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Pengurus Harian */}
                    <div>
                        <h3 className="font-poppins font-bold text-lg text-[#1d2b2d] mb-6 flex items-center gap-2">
                            <span className="h-4 w-1 bg-[#186972] rounded-full"></span>
                            <span>Pengurus Harian & Operasional</span>
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {pengurusHarian.map((item) => (
                                <div
                                    key={item.jabatan}
                                    className="p-6 rounded-2xl border border-[#e4eaec] bg-[#fbfdfd] flex flex-col justify-between"
                                >
                                    <div>
                                        <div className="flex flex-col gap-1">
                                            <h4 className="font-poppins font-bold text-base text-[#1d2b2d]">
                                                {item.jabatan}
                                            </h4>
                                            <span className="self-start px-2 py-0.5 rounded text-[10px] font-semibold bg-[#e8f8fa] text-[#087f8c]">
                                                {item.status}
                                            </span>
                                        </div>
                                        <p className="mt-3 text-xs text-gray-600 leading-relaxed font-sans">
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
