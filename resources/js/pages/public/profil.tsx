import { Head, Link } from '@inertiajs/react';
import { ChevronRight, Quote } from 'lucide-react';
import BaganOrganisasi from '@/components/public/bagan-organisasi';
import PublicLayout from '@/layouts/public-layout';
import { useLanguage } from '@/hooks/use-language';

export default function ProfilPage() {
    const { t } = useLanguage();

    const daftarMisi = t(
        [
            'Menyelenggarakan pembinaan keagamaan yang berkelanjutan.',
            'Memberikan perlindungan dan pelayanan sosial bagi anak yatim.',
            'Mengembangkan kemandirian ekonomi keluarga penerima manfaat.',
            'Meningkatkan kualitas pendidikan melalui beasiswa, pembinaan, dan pengembangan potensi.',
            'Membangun kolaborasi dengan masyarakat, pemerintah, dan dunia usaha untuk memperluas manfaat program yayasan.',
        ],
        [
            'Conduct sustainable religious mentoring and spiritual guidance.',
            'Provide social protection and care services for orphans.',
            'Develop economic independence for beneficiary families.',
            'Improve education quality through scholarships, mentoring, and potential development.',
            'Build collaborations with society, government, and business partners to expand the reach of foundation programs.',
        ],
    );

    return (
        <PublicLayout>
            <Head
                title={t(
                    'Profil Yayasan - Yayasan Geliyat Mahdiesa Nahate',
                    'Foundation Profile - Yayasan Geliyat Mahdiesa Nahate',
                )}
            />

            {/* Banner Header with Breadcrumbs */}
            <div className="border-b border-[#e4eaec] bg-gradient-to-r from-[#d1f6fa]/60 via-[#e8f8fa] to-[#f7fcfd] py-10 sm:py-14">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <h1 className="font-poppins text-3xl font-bold text-[#1d2b2d] sm:text-4xl">
                        {t('Profil Yayasan', 'Foundation Profile')}
                    </h1>
                    <nav className="mt-2 flex items-center gap-2 font-poppins text-sm text-gray-500">
                        <Link
                            href="/"
                            className="transition-colors hover:text-[#14bace]"
                        >
                            {t('Beranda', 'Home')}
                        </Link>
                        <ChevronRight className="size-4 text-gray-400" />
                        <span className="font-semibold text-[#186972]">
                            {t('Profil Yayasan', 'Foundation Profile')}
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
                                            {t(
                                                '"Sebaik-baiknya manusia adalah yang paling bermanfaat bagi orang lain."',
                                                '"The best of people are those who bring the most benefit to others."',
                                            )}
                                        </p>
                                        <p className="mt-2 font-sans text-xs text-gray-500">
                                            {t(
                                                'Nilai Filosofis Gerakan Geliyat',
                                                'Philosophical Value of the Geliyat Movement',
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Narasi Latar Belakang */}
                        <div className="flex flex-col items-start lg:col-span-7">
                            <h2 className="font-poppins text-2xl leading-snug font-bold text-[#1d2b2d] sm:text-3xl">
                                {t('Latar Belakang Yayasan', 'Foundation Background')}
                            </h2>
                            <div className="mt-2 h-1 w-16 rounded-full bg-[#14bace]"></div>

                            <div className="mt-6 space-y-5 font-sans text-sm leading-relaxed text-gray-600 sm:text-base">
                                <p>
                                    {t(
                                        'Geliyat diinisiasi oleh Nina Mahdiah, S.Ag., M.Sos. Penyuluh Agama Islam pada Kementerian Agama Kota Bandung, sekaligus founder Gerakan Peduli Yatim (Geliyat).',
                                        'Geliyat was initiated by Nina Mahdiah, S.Ag., M.Sos., an Islamic Religious Counselor at the Ministry of Religious Affairs of Bandung City and founder of the Orphan Care Movement (Geliyat).',
                                    )}
                                </p>
                                <p>
                                    {t(
                                        'Berawal dari keinginan untuk merealisasikan ajaran agama secara real di tengah masyarakat terutama terkait dengan keberadaan anak yatim/yatim piatu (yang tidak terakomodir oleh Lembaga atau Yayasan yatim/yatim piatu) yang secara realitas sebaran jumlahnya cukup banyak di tengah masyarakat dan perhatian sekitar pun hanya di waktu tertentu saja seperti di hari-hari besar Agama Islam, artinya konsentrasi berbasis masyarakat terhadap anak-anak yatim/piatu tidak dilakukan secara simultan.',
                                        'It began with a desire to tangibly realize religious teachings within society—particularly regarding orphans who are unaccommodated by formal orphanages. In reality, many orphans live across the community while public attention often occurs only on certain Islamic holidays, meaning community-based care for orphans had not been carried out continuously.',
                                    )}
                                </p>
                                <p>
                                    {t(
                                        'Hal ini menjadi motivasi awal selain terdorong oleh keinginan untuk membangun umat menjadi sebaik-baiknya umat yaitu yang mampu memberikan kemanfaatan bukan hanya untuk diri sendiri akan tetapi untuk masyarakat sekitar, sebagaimana dipesankan oleh Rasulullah SAW “Khairunnaas Anfauhum Linnaas” dan inilah yang menjadi nafas utama adanya Gerakan Peduli Yatim yang bukan sekadar gerakan biasa, tetapi upaya mengonstruksi masyarakat memiliki kepedulian dengan rasa empati dan simpati terlebih terhadap keberadaan yatim/yatim piatu di sekelilingnya.',
                                        'This served as the initial motivation, alongside the aspiration to build a community that brings benefit not only to oneself but also to others, as taught by the Prophet Muhammad (PBUH): “Khairunnaas Anfauhum Linnaas” (The best of people are those most beneficial to others). This spirit is the core breath of the Orphan Care Movement—not merely an ordinary movement, but an effort to cultivate social empathy and care for orphans in our surroundings.',
                                    )}
                                </p>
                                <p>
                                    {t(
                                        'Geliyat hadir dan lahir dari hati, rasa peduli dan digerakkan oleh cinta sejati. Anak yatim/yatim piatu bukan hanya sebagai penerima santunan, tetapi generasi yang perlu dibina dan dipersiapkan masa depannya, sementara Ibu Yatim/yatim piatu bukan sekadar pendamping anak melainkan sosok yang perlu diperhatikan, dikuatkan dan diberdayakan karena mereka memikul tugas menjadi seorang ibu sekaligus ayah untuk anak-anaknya.',
                                        'Geliyat was born from the heart, driven by genuine care and love. Orphans are not merely recipients of charity, but a generation that must be mentored and prepared for their future; meanwhile, mothers of orphans are not merely companions to their children, but resilient figures who deserve care, strength, and empowerment as they carry the dual role of both mother and father.',
                                    )}
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
                                <h3 className="font-poppins text-2xl font-bold text-[#1d2b2d]">
                                    {t('Visi Yayasan', 'Foundation Vision')}
                                </h3>
                                <blockquote className="mt-6 rounded-2xl border-l-4 border-[#14bace] bg-[#f7fcfd] p-5 font-sans text-base leading-relaxed font-medium text-[#1b373b] sm:text-lg">
                                    {t(
                                        '"Menjadi Yayasan yang Amanah, profesional, dan berkelanjutan dalam membina serta memberdayakan anak yatim agar tumbuh menjadi generasi yang beriman, berilmu, mandiri, dan bermanfaat bagi masyarakat."',
                                        '"To become a trustworthy, professional, and sustainable foundation in mentoring and empowering orphans so they grow into a faithful, knowledgeable, independent, and beneficial generation for society."',
                                    )}
                                </blockquote>
                            </div>
                            <div className="mt-8 border-t border-gray-100 pt-6 text-xs text-gray-500">
                                Yayasan Geliyat Mahdiesa Nahate
                            </div>
                        </div>

                        {/* Misi */}
                        <div className="rounded-3xl border border-[#e4eaec] bg-white p-8 shadow-sm sm:p-10">
                            <h3 className="font-poppins text-2xl font-bold text-[#1d2b2d]">
                                {t('Misi Yayasan', 'Foundation Mission')}
                            </h3>
                            <ol className="mt-6 list-decimal space-y-3.5 pl-5 font-sans text-sm text-gray-600 sm:text-base">
                                {daftarMisi.map((misi, idx) => (
                                    <li key={idx} className="leading-relaxed">
                                        {misi}
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </div>
                </div>
            </section>

            {/* Struktur Organisasi Yayasan */}
            <section className="border-t border-[#e4eaec] bg-white py-16 sm:py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="font-poppins text-2xl font-bold text-[#1d2b2d] sm:text-3xl">
                            {t(
                                'Struktur Organisasi Yayasan',
                                'Foundation Organizational Structure',
                            )}
                        </h2>
                        <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-[#14bace]"></div>
                    </div>

                    <div className="mt-10 rounded-3xl border border-[#e4eaec] bg-[#fbfdfd] p-4 shadow-sm sm:p-8">
                        <BaganOrganisasi />
                        <p className="mt-3 text-center font-sans text-xs text-gray-400 lg:hidden">
                            {t(
                                'Geser ke kanan atau kiri untuk melihat seluruh bagan organisasi.',
                                'Scroll horizontally to view the full organizational chart.',
                            )}
                        </p>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
