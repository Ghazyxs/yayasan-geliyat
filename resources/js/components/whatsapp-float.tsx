import { useEffect, useRef, useState } from 'react';
import { ChevronDown, MessageCircle, X } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';

interface FaqItem {
    id: number;
    questionId: string;
    questionEn: string;
    answerId: string;
    answerEn: string;
    waTextId: string;
    waTextEn: string;
}

const FAQ_ITEMS: FaqItem[] = [
    {
        id: 1,
        questionId: 'Bagaimana cara menyalurkan donasi secara online?',
        questionEn: 'How can I donate online?',
        answerId:
            'Anda dapat membuka menu Donasi, mengisi nama (atau pilih Hamba Allah), nomor WhatsApp, dan nominal donasi (pilihan tersedia atau isi nominal sendiri), lalu melanjutkan ke pembayaran.',
        answerEn:
            'Open the Donate menu, enter your name (or choose Anonymous), WhatsApp number, and donation amount (preset or custom), then proceed to payment.',
        waTextId:
            'Halo Yayasan Geliyat, saya ingin bertanya mengenai tata cara penyaluran donasi online.',
        waTextEn:
            'Hello Yayasan Geliyat, I would like to ask about how to make an online donation.',
    },
    {
        id: 2,
        questionId: 'Apa saja 4 bidang program pembinaan di Geliyat?',
        questionEn: 'What are the 4 main program divisions at Geliyat?',
        answerId:
            'Yayasan Geliyat menjalankan 4 bidang utama: Pendidikan (BINAYA), Keagamaan (BINATUYA), Kemanusiaan (SATIN & UBAY), serta Pengembangan Ekonomi bagi anak dan ibu yatim.',
        answerEn:
            'Yayasan Geliyat runs 4 main divisions: Education (BINAYA), Religious Affairs (BINATUYA), Humanity (SATIN & UBAY), and Economic Development for orphans and their mothers.',
        waTextId:
            'Halo Yayasan Geliyat, saya ingin mengetahui informasi lebih lanjut mengenai 4 bidang program pembinaan.',
        waTextEn:
            'Hello Yayasan Geliyat, I would like to know more about the 4 program divisions.',
    },
    {
        id: 3,
        questionId: 'Di mana lokasi sekretariat Yayasan Geliyat?',
        questionEn: 'Where is the Yayasan Geliyat secretariat located?',
        answerId:
            'Sekretariat kami berlokasi di Jl. Kampung Baru RT/RW 02/05 No. 42, Kel. Cigending, Kec. Ujungberung, Kota Bandung, 40611.',
        answerEn:
            'Our secretariat is located at Jl. Kampung Baru RT/RW 02/05 No. 42, Cigending, Ujungberung, Bandung City, 40611.',
        waTextId:
            'Halo Yayasan Geliyat, saya ingin menanyakan informasi kunjungan atau lokasi sekretariat yayasan.',
        waTextEn:
            'Hello Yayasan Geliyat, I would like to ask about visiting or the secretariat location.',
    },
    {
        id: 4,
        questionId: 'Bagaimana cara berkolaborasi atau menyalurkan santunan langsung?',
        questionEn: 'How can I collaborate or deliver aid directly?',
        answerId:
            'Anda dapat menghubungi pengurus langsung melalui WhatsApp untuk menjadwalkan kunjungan, kolaborasi program, maupun penyaluran santunan barang/dana.',
        answerEn:
            'You can contact our team directly via WhatsApp to schedule a visit, program collaboration, or direct aid distribution.',
        waTextId:
            'Halo Yayasan Geliyat, saya tertarik untuk berkolaborasi atau menyalurkan santunan secara langsung.',
        waTextEn:
            'Hello Yayasan Geliyat, I am interested in collaborating or delivering aid directly.',
    },
    {
        id: 5,
        questionId: 'Di mana saya dapat melihat laporan tahunan yayasan?',
        questionEn: 'Where can I view the foundation annual reports?',
        answerId:
            'Laporan tahunan dan rekapitulasi kegiatan dapat diakses secara terbuka melalui menu Laporan Tahunan di bilah navigasi atas.',
        answerEn:
            'Annual reports and activity summaries are publicly accessible through the Annual Report menu in the top navigation bar.',
        waTextId:
            'Halo Yayasan Geliyat, saya ingin bertanya mengenai laporan tahunan dan transparansi program.',
        waTextEn:
            'Hello Yayasan Geliyat, I would like to ask about the annual report and program transparency.',
    },
];

const WHATSAPP_NUMBER = '6282126854485';

export default function WhatsAppFloat() {
    const { t } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [activeFaqId, setActiveFaqId] = useState<number | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const activeFaq = FAQ_ITEMS.find((item) => item.id === activeFaqId) ?? null;

    const defaultWaText = t(
        'Halo Yayasan Geliyat, saya ingin bertanya mengenai informasi dan program Yayasan Geliyat Mahdiesa Nahate.',
        'Hello Yayasan Geliyat, I would like to inquire about the information and programs of Yayasan Geliyat Mahdiesa Nahate.',
    );

    const waText = activeFaq
        ? t(activeFaq.waTextId, activeFaq.waTextEn)
        : defaultWaText;

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waText)}`;
    const label = t('Hubungi Kami', 'Contact Us');

    const clearCloseTimer = () => {
        if (closeTimerRef.current) {
            clearTimeout(closeTimerRef.current);
            closeTimerRef.current = null;
        }
    };

    const handleMouseEnter = () => {
        // Only trigger hover-open on devices with fine pointer (desktop/laptop)
        if (
            typeof window !== 'undefined' &&
            window.matchMedia('(hover: hover) and (pointer: fine)').matches
        ) {
            clearCloseTimer();
            setIsOpen(true);
        }
    };

    const handleMouseLeave = () => {
        if (
            typeof window !== 'undefined' &&
            window.matchMedia('(hover: hover) and (pointer: fine)').matches
        ) {
            clearCloseTimer();
            closeTimerRef.current = setTimeout(() => {
                setIsOpen(false);
            }, 180);
        }
    };

    useEffect(() => {
        const handleOutsideInteraction = (event: MouseEvent | TouchEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleOutsideInteraction);
        document.addEventListener('touchstart', handleOutsideInteraction);
        document.addEventListener('keydown', handleEscape);

        return () => {
            clearCloseTimer();
            document.removeEventListener('mousedown', handleOutsideInteraction);
            document.removeEventListener(
                'touchstart',
                handleOutsideInteraction,
            );
            document.removeEventListener('keydown', handleEscape);
        };
    }, []);

    const toggleFaq = (id: number) => {
        setActiveFaqId((prev) => (prev === id ? null : id));
    };

    return (
        <div
            ref={containerRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="fixed right-4 bottom-5 z-40 flex flex-col items-end sm:right-6 sm:bottom-6"
        >
            {/* Floating FAQ Card */}
            {isOpen && (
                <div className="mb-3 w-[calc(100vw-2rem)] max-w-[360px] overflow-hidden rounded-2xl border border-[#e4eaec] bg-white shadow-2xl ring-1 ring-black/5">
                    {/* Card Header */}
                    <div className="flex items-start justify-between gap-3 bg-gradient-to-r from-[#186972] to-[#14bace] px-4 py-3.5 text-white">
                        <div>
                            <h3 className="font-poppins text-sm font-bold">
                                {t('Pertanyaan Umum (FAQ)', 'Quick Help & FAQ')}
                            </h3>
                            <p className="mt-0.5 text-[11px] text-white/90">
                                {t(
                                    'Pilih topik untuk melihat jawaban singkat atau lanjut ke WhatsApp.',
                                    'Select a topic to view a quick answer or chat on WhatsApp.',
                                )}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            aria-label={t('Tutup FAQ', 'Close FAQ')}
                            className="rounded-lg p-1 text-white/80 transition-colors hover:bg-white/15 hover:text-white"
                        >
                            <X className="size-4" />
                        </button>
                    </div>

                    {/* FAQ Accordion List */}
                    <div className="max-h-[52vh] divide-y divide-[#eef3f4] overflow-y-auto px-3 py-2">
                        {FAQ_ITEMS.map((item) => {
                            const isExpanded = activeFaqId === item.id;
                            return (
                                <div key={item.id} className="py-1">
                                    <button
                                        type="button"
                                        onClick={() => toggleFaq(item.id)}
                                        aria-expanded={isExpanded}
                                        className="flex w-full items-start justify-between gap-2 rounded-xl px-2 py-2 text-left transition-colors hover:bg-[#f5fbfc]"
                                    >
                                        <span
                                            className={`font-poppins text-xs leading-snug font-medium ${
                                                isExpanded
                                                    ? 'font-semibold text-[#186972]'
                                                    : 'text-[#1d2b2d]'
                                            }`}
                                        >
                                            {t(item.questionId, item.questionEn)}
                                        </span>
                                        <ChevronDown
                                            className={`mt-0.5 size-4 shrink-0 text-[#14bace] transition-transform duration-200 ${
                                                isExpanded ? 'rotate-180' : ''
                                            }`}
                                        />
                                    </button>
                                    {isExpanded && (
                                        <div className="mx-2 mb-2 rounded-xl bg-[#f7fcfd] px-3 py-2.5 text-xs leading-relaxed text-gray-600">
                                            {t(item.answerId, item.answerEn)}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Footer CTA to WhatsApp */}
                    <div className="border-t border-[#e4eaec] bg-[#fbfdfd] p-3">
                        <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-2.5 font-poppins text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[#1ebe5d]"
                        >
                            <MessageCircle className="size-4" />
                            <span>
                                {activeFaq
                                    ? t(
                                          'Tanya Topik Ini via WhatsApp',
                                          'Ask About This via WhatsApp',
                                      )
                                    : t(
                                          'Chat Langsung via WhatsApp',
                                          'Chat Directly via WhatsApp',
                                      )}
                            </span>
                        </a>
                    </div>
                </div>
            )}

            {/* Floating Trigger Button */}
            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                aria-expanded={isOpen}
                aria-label={t(
                    'Buka FAQ & Hubungi Kami via WhatsApp',
                    'Open FAQ & Contact Us via WhatsApp',
                )}
                className="group flex items-center gap-2.5 rounded-full bg-[#25D366] px-4 py-3 text-white shadow-lg ring-1 ring-black/5 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#1ebe5d] hover:shadow-xl active:scale-95"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-6 shrink-0 transition-transform duration-200 group-hover:scale-105"
                    aria-hidden="true"
                >
                    <path d="M12.031 2c-5.516 0-9.969 4.453-9.969 9.969 0 1.766.469 3.484 1.344 5l-1.406 5.141 5.281-1.391c1.469.797 3.109 1.219 4.75 1.219 5.516 0 9.969-4.453 9.969-9.969S17.547 2 12.031 2zm5.813 14.125c-.25.703-1.438 1.344-2 1.422-.516.078-1.188.109-1.922-.125-.453-.141-1.031-.344-1.766-.656-3.078-1.328-5.094-4.438-5.25-4.641-.156-.203-1.25-1.656-1.25-3.156s.781-2.234 1.063-2.547c.281-.313.609-.391.813-.391s.406 0 .578.016c.188.016.438-.078.688.531.25.609.859 2.094.938 2.25.078.156.125.344.031.547-.094.203-.141.328-.297.5-.156.172-.313.391-.453.516-.156.156-.313.328-.141.641.172.313.781 1.297 1.672 2.094 1.156 1.031 2.125 1.344 2.438 1.5.313.156.484.125.672-.078.188-.203.781-.906.984-1.219.203-.313.406-.266.688-.156.281.109 1.797.844 2.109 1s.516.234.594.359c.078.125.078.734-.172 1.438z" />
                </svg>
                <span className="font-poppins text-xs font-semibold tracking-wide whitespace-nowrap sm:text-sm">
                    {label}
                </span>
            </button>
        </div>
    );
}
