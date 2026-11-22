import { useSyncExternalStore, useCallback } from 'react';
import type { BidangItem } from '@/pages/public/bidang';

export type Language = 'id' | 'en';

const STORAGE_KEY = 'geliyat_lang';

let currentLang: Language = 'id';

if (typeof window !== 'undefined') {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === 'en' || saved === 'id') {
        currentLang = saved;
    }
    document.documentElement.lang = currentLang;
}

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
        listeners.delete(listener);
    };
}

function getSnapshot(): Language {
    return currentLang;
}

function getServerSnapshot(): Language {
    return 'id';
}

export function setLanguage(lang: Language) {
    if (currentLang === lang) return;
    currentLang = lang;
    if (typeof window !== 'undefined') {
        window.localStorage.setItem(STORAGE_KEY, lang);
        document.documentElement.lang = lang;
    }
    listeners.forEach((listener) => listener());
}

export function toggleLanguage() {
    setLanguage(currentLang === 'id' ? 'en' : 'id');
}

const BIDANG_EN_MAP: Record<
    string,
    {
        nama: string;
        subjudul: string;
        deskripsi: string;
        deskripsi_lengkap: string;
        tujuan: string[];
        program_kerja: Array<{
            nama: string;
            deskripsi: string;
            jadwal: string;
            sasaran: string;
        }>;
        informasi_tambahan: {
            sasaran_utama: string;
            lokasi_pelaksanaan: string;
            frekuensi_kegiatan: string;
            koordinator_unit: string;
        };
    }
> = {
    pendidikan: {
        nama: 'Education Division',
        subjudul: 'BINAYA (Orphan Education & Mentoring)',
        deskripsi:
            'BINAYA focuses on improving education quality and developing the potential of orphans through mentoring, tutoring, Quranic education, and educational access support to build an intelligent, virtuous, and competitive generation.',
        deskripsi_lengkap:
            'BINAYA (Orphan Education & Mentoring) focuses on improving education quality and developing the potential of orphans through mentoring, study assistance, Quranic education, and educational access support to build an intelligent, virtuous, and competitive generation.',
        tujuan: [
            'Improve education quality through mentoring and study assistance for orphans.',
            'Develop the potential, intelligence, and competitiveness of mentored children from early childhood to school age.',
            'Provide Quranic education to shape a generation of noble character.',
            'Support educational access for orphans so they grow into intelligent and independent individuals.',
        ],
        program_kerja: [
            {
                nama: 'KOBER (Playgroup / Early Childhood)',
                deskripsi:
                    'Early childhood education program supporting growth, basic learning introduction, and character building from an early age.',
                jadwal: 'According to KOBER Schedule',
                sasaran: 'Early Childhood',
            },
            {
                nama: 'SINAR (Children & Youth Inspiration Friends)',
                deskripsi:
                    'Tutoring program aimed at elementary school children for homework assistance and subject comprehension.',
                jadwal: 'Regularly Scheduled',
                sasaran: 'Elementary School Children',
            },
            {
                nama: 'GEMAR (Children Quran Recitation Movement)',
                deskripsi:
                    'Quranic learning and recitation mentoring program for all children mentored by Yayasan Geliyat Mahdiesa Nahate.',
                jadwal: 'Regularly Scheduled',
                sasaran: 'All Mentored Children',
            },
            {
                nama: 'GEMILANG (Dedicated Fighter Movement)',
                deskripsi:
                    'Capacity, commitment, and solidarity strengthening program dedicated to foundation board members.',
                jadwal: 'Internal Board',
                sasaran: 'Foundation Board (Internal)',
            },
        ],
        informasi_tambahan: {
            sasaran_utama:
                'Early childhood, elementary school children, and all mentored children',
            lokasi_pelaksanaan: 'Ujungberung District, Bandung City',
            frekuensi_kegiatan: 'Regularly Scheduled',
            koordinator_unit: 'Education Division Committee',
        },
    },
    keagamaan: {
        nama: 'Religious Division',
        subjudul: 'Spiritual Mentoring for Orphans & Mothers of Orphans',
        deskripsi:
            'Focuses on spiritual mentoring for orphans and mothers of orphans by enhancing understanding and practice of Islamic values, Quranic learning, strengthening faith, worship, and noble character.',
        deskripsi_lengkap:
            'The Religious Division focuses on spiritual mentoring for orphans and mothers of orphans through enhancing understanding and practice of Islamic values, Quranic learning, strengthening faith (aqidah), worship, and noble character building.',
        tujuan: [
            'Conduct sustainable religious mentoring for orphans and mothers of orphans.',
            'Enhance understanding and practice of Islamic values through Quranic learning.',
            'Strengthen faith, worship, and cultivate noble character in daily life.',
        ],
        program_kerja: [
            {
                nama: 'BINATUYA (Mentoring for Mothers of Orphans)',
                deskripsi:
                    'Spiritual and religious strengthening program for mothers/guardians of orphans (Ummu Geliyat) held once every month.',
                jadwal: 'Once Every Month',
                sasaran: 'Mothers of Orphans (Ummu Geliyat)',
            },
        ],
        informasi_tambahan: {
            sasaran_utama: 'Orphans and mothers of orphans (Ummu Geliyat)',
            lokasi_pelaksanaan: 'Ujungberung District, Bandung City',
            frekuensi_kegiatan: 'Once Every Month',
            koordinator_unit: 'Religious Division Committee',
        },
    },
    kemanusiaan: {
        nama: 'Humanitarian Division',
        subjudul: 'Social Care & Protection for Orphans & Mothers of Orphans',
        deskripsi:
            'Focuses on social care and protection for orphans and mothers of orphans through regular aid, social assistance, basic needs fulfillment, mentoring, and activities supporting family welfare.',
        deskripsi_lengkap:
            'The Humanitarian Division focuses on social care and protection for orphans and mothers of orphans through regular charity programs, social assistance, basic needs fulfillment, accompaniment, and activities supporting quality of life and welfare.',
        tujuan: [
            'Provide social protection and services for orphans and mothers of orphans.',
            'Distribute regular aid and basic needs assistance sustainably.',
            'Support the improvement of quality of life, happiness, and welfare of orphan families.',
        ],
        program_kerja: [
            {
                nama: 'SATIN (Regular Monthly Aid)',
                deskripsi:
                    'More than just financial aid held every fourth Saturday of the month—this program brings attention, warmth, hugs, and smiles to orphaned children.',
                jadwal: 'Every Fourth Saturday of the Month',
                sasaran: 'Mentored Orphans',
            },
            {
                nama: 'UBAY (Recreation with Orphans)',
                deskripsi:
                    'More than just a picnic, it is a time for children to laugh, forget their burdens, and feel part of a caring family. An annual program to build emotional bonds and support psychological well-being.',
                jadwal: 'Annual (Once a Year)',
                sasaran: 'Orphans & Foundation Board',
            },
            {
                nama: 'RAMADHAN WITH ORPHANS',
                deskripsi:
                    'An annual agenda ahead of the holy month of Ramadhan providing basic food packages (sembako) to orphans and their families so they can welcome Ramadhan with joy and peace.',
                jadwal: 'Annual (Ahead of Ramadhan)',
                sasaran: 'Orphans & Their Families',
            },
            {
                nama: 'EID AL-FITR WITH ORPHANS',
                deskripsi:
                    'A program sharing happiness ahead of Eid al-Fitr by providing food packages to orphans as an expression of love so they can celebrate the day of victory knowing they are not alone.',
                jadwal: 'Annual (Ahead of Eid al-Fitr)',
                sasaran: 'Mentored Orphans',
            },
        ],
        informasi_tambahan: {
            sasaran_utama: 'Mentored orphans and mothers of orphans',
            lokasi_pelaksanaan: 'Ujungberung District, Bandung City',
            frekuensi_kegiatan: 'Monthly (4th Saturday) & Annual Agenda',
            koordinator_unit: 'Humanitarian Division Committee',
        },
    },
    ekonomi: {
        nama: 'Economic Development Division',
        subjudul: 'Economic Empowerment & Independence for Orphan Families',
        deskripsi:
            'Focuses on economic empowerment for mothers of orphans through skill enhancement, business mentoring, entrepreneurship development, and productive economic activities to foster independence and family welfare.',
        deskripsi_lengkap:
            'The Economic Development Division focuses on empowering mothers of orphans economically through skill enhancement, business mentoring, entrepreneurship development, and establishing productive economic activities to encourage self-reliance and welfare.',
        tujuan: [
            'Develop economic independence for beneficiary families.',
            'Enhance skills, business mentoring, and entrepreneurship for mothers of orphans.',
            'Establish productive economic activities to improve the welfare of orphan families.',
        ],
        program_kerja: [
            {
                nama: 'Savings & Loan Cooperative',
                deskripsi:
                    'Covers urgent needs assistance as well as installment facilities for mentored families.',
                jadwal: 'Cooperative Operations',
                sasaran: 'Mothers of Orphans & Mentored Families',
            },
            {
                nama: 'Basic Needs Provision',
                deskripsi:
                    'Provision of daily staple necessities to support the livelihood of mentored families.',
                jadwal: 'Ongoing / Sustainable',
                sasaran: 'Foundation Mentored Families',
            },
        ],
        informasi_tambahan: {
            sasaran_utama: 'Mothers of orphans and beneficiary families',
            lokasi_pelaksanaan: 'Ujungberung District, Bandung City',
            frekuensi_kegiatan: 'Ongoing / Sustainable',
            koordinator_unit: 'Economic Development Division Committee',
        },
    },
};

const CATEGORY_EN_MAP: Record<string, string> = {
    semua: 'All',
    pendidikan: 'Education',
    keagamaan: 'Religious',
    ekonomi: 'Economic',
    'pengembangan ekonomi': 'Economic Development',
    kemanusiaan: 'Humanitarian',
    artikel: 'Article',
    informasi: 'Information',
    pengumuman: 'Announcement',
    'berita lainnya': 'Other News',
};

export function useLanguage() {
    const lang = useSyncExternalStore(
        subscribe,
        getSnapshot,
        getServerSnapshot,
    );

    const t = useCallback(
        <T>(idVal: T, enVal: T): T => {
            return lang === 'en' ? enVal : idVal;
        },
        [lang],
    );

    const translateBidang = useCallback(
        (bidang: BidangItem): BidangItem => {
            if (lang !== 'en') return bidang;
            const enData = BIDANG_EN_MAP[bidang.kode?.toLowerCase()];
            if (!enData) return bidang;
            return {
                ...bidang,
                nama: enData.nama,
                subjudul: enData.subjudul,
                deskripsi: enData.deskripsi,
                deskripsi_lengkap: enData.deskripsi_lengkap,
                tujuan: enData.tujuan,
                program_kerja: enData.program_kerja,
                informasi_tambahan: enData.informasi_tambahan,
            };
        },
        [lang],
    );

    const translateCategory = useCallback(
        (category: string): string => {
            if (lang !== 'en' || !category) return category;
            return CATEGORY_EN_MAP[category.toLowerCase()] ?? category;
        },
        [lang],
    );

    return {
        lang,
        setLang: setLanguage,
        toggleLang: toggleLanguage,
        t,
        translateBidang,
        translateCategory,
    };
}
