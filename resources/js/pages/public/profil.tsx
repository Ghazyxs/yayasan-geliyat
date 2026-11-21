import { Head, Link } from '@inertiajs/react';
import {
    Target,
    Compass,
    ChevronRight,
    Quote,
} from 'lucide-react';
import PublicLayout from '@/layouts/public-layout';

export default function ProfilPage() {
    const daftarMisi = [
        'Menyelenggarakan pembinaan keagamaan yang berkelanjutan.',
        'Memberikan perlindungan dan pelayanan sosial bagi anak yatim.',
        'Mengembangkan kemandirian ekonomi keluarga penerima manfaat.',
        'Meningkatkan kualitas pendidikan melalui beasiswa, pembinaan, dan pengembangan potensi.',
        'Membangun kolaborasi dengan masyarakat, pemerintah, dan dunia usaha untuk memperluas manfaat program yayasan.',
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

            {/* Latar Belakang Yayasan */}
            <section className="bg-white py-16 sm:py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
                        {/* Identitas & Nilai Filosofis */}
                        <div className="lg:col-span-5">
                            <div className="rounded-3xl border border-[#e4eaec] bg-[#fbfdfd] p-8 shadow-sm">
                                <div className="flex flex-col items-center text-center">
                                    <div className="mb-5 flex size-28 items-center justify-center rounded-2xl border border-[#e4eaec] bg-white p-3">
                                        <img
                                            src="/images/logo.png"
                                            alt="Logo Yayasan Geliyat Mahdiesa Nahate"
                                            className="size-full object-contain"
                                        />
                                    </div>
                                    <h2 className="font-poppins text-base font-bold text-[#1d2b2d]">
                                        Yayasan Geliyat Mahdiesa Nahate
                                    </h2>
                                    <div className="mt-6 w-full border-t border-[#e4eaec] pt-6">
                                        <Quote className="mx-auto mb-2 size-5 text-[#14bace]" />
                                        <p className="font-poppins text-sm leading-relaxed font-semibold text-[#1d2b2d] italic">
                                            "Sebaik-baiknya manusia adalah yang
                                            paling bermanfaat bagi orang lain."
                                        </p>
                                        <p className="mt-2 font-sans text-xs text-gray-500">
                                            Nilai Filosofis Gerakan Geliyat
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Narasi Latar Belakang */}
                        <div className="flex flex-col items-start lg:col-span-7">
                            <h2 className="font-poppins text-2xl leading-snug font-bold text-[#1d2b2d] sm:text-3xl">
                                Latar Belakang Yayasan
                            </h2>
                            <div className="mt-2 h-1 w-16 rounded-full bg-[#14bace]"></div>

                            <div className="mt-6 space-y-5 font-sans text-sm leading-relaxed text-gray-600 sm:text-base">
                                <p>
                                    <strong>
                                        Yayasan Geliyat Mahdiesa Nahate
                                    </strong>{' '}
                                    diinisiasi oleh{' '}
                                    <strong>
                                        Nina Mahdiah, S.Ag., M.Sos.
                                    </strong>{' '}
                                    sebagai founder, lahir sebagai wujud gerakan
                                    yang bukan sekadar aktivitas sosial biasa.
                                    Berlandaskan nilai filosofis{' '}
                                    <em>
                                        "Sebaik-baiknya manusia adalah yang
                                        paling bermanfaat bagi orang lain"
                                    </em>
                                    , nilai tersebut menjadi napas utama dalam
                                    setiap langkah pengabdian Gerakan Geliyat.
                                </p>
                                <p>
                                    Geliyat bukanlah sekadar program penyaluran
                                    bantuan, melainkan pergerakan yang dimulai
                                    dari hati, tumbuh dari rasa peduli, dan
                                    digerakkan oleh cinta sejati untuk
                                    menghadirkan kebermanfaatan yang nyata.
                                </p>
                                <p>
                                    Anak yatim bukan hanya menjadi penerima
                                    santunan, tetapi juga generasi yang perlu
                                    dibina dan dipersiapkan masa depannya.
                                    Sementara itu, ibu yatim bukan sekadar
                                    pendamping anak, melainkan sosok yang juga
                                    perlu diperhatikan, dikuatkan, dan
                                    diberdayakan.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Visi & Misi Section */}
            <section className="border-t border-[#e4eaec] bg-[#f7fcfd] py-16 sm:py-20">
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
                                        Visi Yayasan
                                    </h3>
                                </div>
                                <blockquote className="mt-6 rounded-2xl border-l-4 border-[#14bace] bg-[#f7fcfd] p-5 font-sans text-base leading-relaxed font-medium text-[#1b373b] sm:text-lg">
                                    "Menjadi Yayasan yang Amanah, profesional,
                                    dan berkelanjutan dalam membina serta
                                    memberdayakan anak yatim agar tumbuh menjadi
                                    generasi yang beriman, berilmu, mandiri, dan
                                    bermanfaat bagi masyarakat."
                                </blockquote>
                            </div>
                            <div className="mt-8 border-t border-gray-100 pt-6 text-xs text-gray-500">
                                Yayasan Geliyat Mahdiesa Nahate
                            </div>
                        </div>

                        {/* Misi */}
                        <div className="rounded-3xl border border-[#e4eaec] bg-white p-8 shadow-sm sm:p-10">
                            <div className="flex items-center gap-3">
                                <div className="flex size-12 items-center justify-center rounded-2xl bg-[#e8f8fa] text-[#186972]">
                                    <Target className="size-6" />
                                </div>
                                <h3 className="font-poppins text-2xl font-bold text-[#1d2b2d]">
                                    Misi Yayasan
                                </h3>
                            </div>
                            <ol className="mt-6 space-y-3.5 font-sans text-sm text-gray-600 sm:text-base">
                                {daftarMisi.map((misi, idx) => (
                                    <li
                                        key={idx}
                                        className="flex items-start gap-3"
                                    >
                                        <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-[#14bace] text-xs font-bold text-white">
                                            {idx + 1}
                                        </span>
                                        <span>{misi}</span>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
