import { Head, Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import PublicLayout from '@/layouts/public-layout';
import { useLanguage } from '@/hooks/use-language';

interface PimpinanItem {
    jabatanId: string;
    jabatanEn: string;
    nama: string;
    foto: string;
}

const daftarPimpinan: PimpinanItem[] = [
    {
        jabatanId: 'Ketua Yayasan',
        jabatanEn: 'Chairperson of the Foundation',
        nama: 'Nina Mahdiah, S.Ag., M.Sos.',
        foto: '/images/pimpinan/ketua.jpg',
    },
    {
        jabatanId: 'Sekretaris Yayasan',
        jabatanEn: 'Secretary of the Foundation',
        nama: 'Juaningsih',
        foto: '/images/pimpinan/sekretaris.jpg',
    },
    {
        jabatanId: 'Bendahara Yayasan',
        jabatanEn: 'Treasurer of the Foundation',
        nama: 'Dewi Yulia',
        foto: '/images/pimpinan/bendahara.jpg',
    },
];

export default function ProfilPimpinanPage() {
    const { t } = useLanguage();

    return (
        <PublicLayout>
            <Head
                title={t(
                    'Profil Pimpinan Yayasan Geliyat - Yayasan Geliyat Mahdiesa Nahate',
                    'Leadership Profile - Yayasan Geliyat Mahdiesa Nahate',
                )}
            />

            {/* Banner Header with Breadcrumbs */}
            <div className="border-b border-[#e4eaec] bg-gradient-to-r from-[#d1f6fa]/60 via-[#e8f8fa] to-[#f7fcfd] py-10 sm:py-14">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <h1 className="font-poppins text-3xl font-bold text-[#1d2b2d] sm:text-4xl">
                        {t(
                            'Profil Pimpinan Yayasan Geliyat',
                            'Leadership Profile of Yayasan Geliyat',
                        )}
                    </h1>
                    <nav className="mt-2 flex items-center gap-2 font-poppins text-sm text-gray-500">
                        <Link
                            href="/"
                            className="transition-colors hover:text-[#14bace]"
                        >
                            {t('Beranda', 'Home')}
                        </Link>
                        <ChevronRight className="size-4 text-gray-400" />
                        <Link
                            href="/profil"
                            className="transition-colors hover:text-[#14bace]"
                        >
                            {t('Profil', 'Profile')}
                        </Link>
                        <ChevronRight className="size-4 text-gray-400" />
                        <span className="font-semibold text-[#186972]">
                            {t('Profil Pimpinan', 'Leadership Profile')}
                        </span>
                    </nav>
                    <p className="mt-3 max-w-2xl font-sans text-sm leading-relaxed text-gray-600 sm:text-base">
                        {t(
                            'Susunan pimpinan utama Yayasan Geliyat Mahdiesa Nahate yang mengemban amanah kepemimpinan, administrasi, dan pengelolaan yayasan.',
                            'The core leadership board of Yayasan Geliyat Mahdiesa Nahate entrusted with the leadership, administration, and management of the foundation.',
                        )}
                    </p>
                </div>
            </div>

            {/* Daftar Pimpinan Yayasan */}
            <section className="bg-white py-16 sm:py-20">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    <h2 className="font-poppins text-xl font-bold tracking-wide text-[#1d2b2d] uppercase sm:text-2xl">
                        {t('Pimpinan Yayasan', 'Foundation Leadership')}
                    </h2>
                    <div className="mt-2 h-1 w-16 rounded-full bg-[#14bace]" />

                    <div className="mt-10 divide-y divide-[#e4eaec]">
                        {daftarPimpinan.map((pimpinan) => {
                            const jabatan = t(
                                pimpinan.jabatanId,
                                pimpinan.jabatanEn,
                            );
                            return (
                                <article
                                    key={pimpinan.jabatanId}
                                    className="flex flex-col gap-5 py-8 first:pt-0 last:pb-0 sm:flex-row sm:items-start sm:gap-8"
                                >
                                    {/* Foto Pimpinan */}
                                    <div className="aspect-[3/4] w-40 shrink-0 overflow-hidden rounded-lg border border-[#e4eaec] bg-[#f7fcfd] sm:w-44">
                                        <img
                                            src={pimpinan.foto}
                                            alt={`${pimpinan.nama} - ${jabatan}`}
                                            className="size-full object-cover object-top"
                                        />
                                    </div>

                                    {/* Jabatan & Nama */}
                                    <div className="pt-1">
                                        <h3 className="font-poppins text-lg font-bold text-[#1d2b2d] sm:text-xl">
                                            {jabatan}
                                        </h3>
                                        <p className="mt-1.5 font-sans text-base font-medium text-gray-800">
                                            {pimpinan.nama}
                                        </p>
                                        <p className="mt-1 font-sans text-sm text-gray-500">
                                            Yayasan Geliyat Mahdiesa Nahate
                                        </p>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
