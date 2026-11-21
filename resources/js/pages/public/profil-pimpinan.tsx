import { Head, Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import PublicLayout from '@/layouts/public-layout';

interface PimpinanItem {
    jabatan: string;
    nama: string;
    foto: string;
}

const daftarPimpinan: PimpinanItem[] = [
    {
        jabatan: 'Ketua Yayasan',
        nama: 'Nina Mahdiah, S.Ag., M.Sos.',
        foto: '/images/pimpinan/ketua.jpg',
    },
    {
        jabatan: 'Sekretaris Yayasan',
        nama: 'Juaningsih',
        foto: '/images/pimpinan/sekretaris.jpg',
    },
    {
        jabatan: 'Bendahara Yayasan',
        nama: 'Dewi Yulia',
        foto: '/images/pimpinan/bendahara.jpg',
    },
];

export default function ProfilPimpinanPage() {
    return (
        <PublicLayout>
            <Head title="Profil Pimpinan Yayasan Geliyat - Yayasan Geliyat Mahdiesa Nahate" />

            {/* Banner Header with Breadcrumbs */}
            <div className="border-b border-[#e4eaec] bg-gradient-to-r from-[#d1f6fa]/60 via-[#e8f8fa] to-[#f7fcfd] py-10 sm:py-14">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <h1 className="font-poppins text-3xl font-bold text-[#1d2b2d] sm:text-4xl">
                        Profil Pimpinan Yayasan Geliyat
                    </h1>
                    <nav className="mt-2 flex items-center gap-2 font-poppins text-sm text-gray-500">
                        <Link
                            href="/"
                            className="transition-colors hover:text-[#14bace]"
                        >
                            Beranda
                        </Link>
                        <ChevronRight className="size-4 text-gray-400" />
                        <Link
                            href="/profil"
                            className="transition-colors hover:text-[#14bace]"
                        >
                            Profil
                        </Link>
                        <ChevronRight className="size-4 text-gray-400" />
                        <span className="font-semibold text-[#186972]">
                            Profil Pimpinan
                        </span>
                    </nav>
                    <p className="mt-3 max-w-2xl font-sans text-sm leading-relaxed text-gray-600 sm:text-base">
                        Susunan pimpinan utama Yayasan Geliyat Mahdiesa Nahate
                        yang mengemban amanah kepemimpinan, administrasi, dan
                        pengelolaan yayasan.
                    </p>
                </div>
            </div>

            {/* Daftar Pimpinan Yayasan */}
            <section className="bg-white py-16 sm:py-20">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    <h2 className="font-poppins text-xl font-bold tracking-wide text-[#1d2b2d] uppercase sm:text-2xl">
                        Pimpinan Yayasan
                    </h2>
                    <div className="mt-2 h-1 w-16 rounded-full bg-[#14bace]" />

                    <div className="mt-10 divide-y divide-[#e4eaec]">
                        {daftarPimpinan.map((pimpinan) => (
                            <article
                                key={pimpinan.jabatan}
                                className="flex flex-col gap-5 py-8 first:pt-0 last:pb-0 sm:flex-row sm:items-start sm:gap-8"
                            >
                                {/* Foto Pimpinan */}
                                <div className="aspect-[3/4] w-40 shrink-0 overflow-hidden rounded-lg border border-[#e4eaec] bg-[#f7fcfd] sm:w-44">
                                    <img
                                        src={pimpinan.foto}
                                        alt={`${pimpinan.nama} - ${pimpinan.jabatan}`}
                                        className="size-full object-cover object-top"
                                    />
                                </div>

                                {/* Jabatan & Nama */}
                                <div className="pt-1">
                                    <h3 className="font-poppins text-lg font-bold text-[#1d2b2d] sm:text-xl">
                                        {pimpinan.jabatan}
                                    </h3>
                                    <p className="mt-1.5 font-sans text-base font-medium text-gray-800">
                                        {pimpinan.nama}
                                    </p>
                                    <p className="mt-1 font-sans text-sm text-gray-500">
                                        Yayasan Geliyat Mahdiesa Nahate
                                    </p>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
