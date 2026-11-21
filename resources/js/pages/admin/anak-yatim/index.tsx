import { Head, router, useForm, usePage } from '@inertiajs/react';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { BrandSelect } from '@/components/admin/brand-select';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface BidangItem {
    id: number;
    kode: string;
    nama: string;
    pivot?: {
        catatan_program?: string | null;
    };
}

interface DokumenMeta {
    exists: boolean;
    url: string | null;
    is_pdf: boolean;
}

interface AnakYatimItem {
    id: number;
    nama_lengkap: string;
    anak_ke: number | null;
    jenis_kelamin: 'L' | 'P';
    status_santunan: 'menerima' | 'menunggu';
    tempat_lahir: string | null;
    tanggal_lahir: string;
    jenjang: string;
    kelurahan: string;
    nama_ibu_kandung: string | null;
    no_telepon: string | null;
    nama_wali: string;
    no_telepon_wali: string | null;
    status_binaan: 'aktif' | 'alumni' | 'nonaktif';
    donasi_count?: number;
    bidang: BidangItem[];
    pembuat?: {
        id: number;
        name: string;
    } | null;
    can_view_sensitive: boolean;
    can_update: boolean;
    can_delete: boolean;
    dokumen: {
        foto_anak: DokumenMeta | null;
        foto_kk: DokumenMeta | null;
        foto_akta_kelahiran: DokumenMeta | null;
        foto_akta_kematian_ayah: DokumenMeta | null;
    };
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedAnakYatim {
    data: AnakYatimItem[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    links: PaginationLink[];
}

interface PageProps {
    anakYatim: PaginatedAnakYatim;
    stats: {
        sd: number;
        smp: number;
        sma: number;
        perguruan_tinggi: number;
    };
    filters: {
        search: string;
        jenis_kelamin: string;
        jenjang: string;
        kelurahan: string;
    };
    jenjangList: string[];
    kelurahanList: string[];
    permissions: {
        is_super_admin: boolean;
        can_create: boolean;
        user_bidang: BidangItem | null;
    };
    flash?: {
        success?: string | null;
        error?: string | null;
    };
    [key: string]: unknown;
}

interface AnakFormData {
    nik: string;
    no_kk: string;
    nama_lengkap: string;
    anak_ke: string;
    jenis_kelamin: 'L' | 'P';
    status_santunan: 'menerima' | 'menunggu';
    tempat_lahir: string;
    tanggal_lahir: string;
    jenjang: string;
    kelurahan: string;
    alamat_detail: string;
    nama_ibu_kandung: string;
    no_telepon: string;
    nama_wali: string;
    no_telepon_wali: string;
    foto_anak: File | null;
    foto_kk: File | null;
    foto_akta_kelahiran: File | null;
    foto_akta_kematian_ayah: File | null;
    update_sensitive: boolean;
}

const jenjangBadgeColor: Record<string, string> = {
    SD: 'border-teal-200/70 bg-teal-50/60 text-[#087f8c]',
    SMP: 'border-sky-200/70 bg-sky-50/60 text-sky-700',
    'SMA/SMK': 'border-indigo-200/70 bg-indigo-50/60 text-indigo-700',
    'Perguruan Tinggi': 'border-cyan-200/70 bg-cyan-50/60 text-cyan-800',
    Lainnya: 'border-slate-200 bg-slate-50 text-slate-700',
};

function formatTanggalIndo(dateStr: string | null | undefined): string {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

function hitungUsia(dateStr: string | null | undefined): string {
    if (!dateStr) return '';
    const birth = new Date(dateStr);
    if (Number.isNaN(birth.getTime())) return '';
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    return age >= 0 ? `${age} thn` : '';
}

function countUploadedDocs(dokumen?: AnakYatimItem['dokumen']): number {
    if (!dokumen) return 0;
    return [
        dokumen.foto_anak,
        dokumen.foto_kk,
        dokumen.foto_akta_kelahiran,
        dokumen.foto_akta_kematian_ayah,
    ].filter((d) => d?.exists).length;
}

export default function AnakYatimAdmin() {
    const {
        anakYatim,
        stats,
        filters,
        jenjangList = ['SD', 'SMP', 'SMA/SMK', 'Perguruan Tinggi', 'Lainnya'],
        kelurahanList = [],
        permissions,
        flash,
    } = usePage<PageProps>().props;

    // Filter state
    const [search, setSearch] = useState(filters.search || '');
    const [jenisKelamin, setJenisKelamin] = useState(
        filters.jenis_kelamin || '',
    );
    const [jenjang, setJenjang] = useState(filters.jenjang || '');
    const [kelurahan, setKelurahan] = useState(filters.kelurahan || '');
    const [isFiltering, setIsFiltering] = useState(false);

    // Modals state
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<AnakYatimItem | null>(null);
    const [detailItem, setDetailItem] = useState<AnakYatimItem | null>(null);
    const [deletingItem, setDeletingItem] = useState<AnakYatimItem | null>(
        null,
    );
    const [isDeleting, setIsDeleting] = useState(false);

    // Sensitive data state (Detail & Edit)
    const [sensitiveData, setSensitiveData] = useState<{
        nik: string | null;
        no_kk: string | null;
        alamat_detail: string | null;
    } | null>(null);
    const [isLoadingSensitive, setIsLoadingSensitive] = useState(false);
    const [isLoadingEditSensitive, setIsLoadingEditSensitive] = useState(false);

    // Refs for file inputs
    const fotoAnakRef = useRef<HTMLInputElement | null>(null);
    const fotoKkRef = useRef<HTMLInputElement | null>(null);
    const fotoAktaLahirRef = useRef<HTMLInputElement | null>(null);
    const fotoAktaKematianRef = useRef<HTMLInputElement | null>(null);

    // Flash notification banner
    const [bannerMessage, setBannerMessage] = useState<{
        type: 'success' | 'error';
        text: string;
    } | null>(null);

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
            setBannerMessage({ type: 'success', text: flash.success });
        } else if (flash?.error) {
            toast.error(flash.error);
            setBannerMessage({ type: 'error', text: flash.error });
        }
    }, [flash]);

    const form = useForm<AnakFormData>({
        nik: '',
        no_kk: '',
        nama_lengkap: '',
        anak_ke: '1',
        jenis_kelamin: 'L',
        status_santunan: 'menunggu',
        tempat_lahir: '',
        tanggal_lahir: '',
        jenjang: 'SD',
        kelurahan: kelurahanList[0] || 'Cigending',
        alamat_detail: '',
        nama_ibu_kandung: '',
        no_telepon: '',
        nama_wali: '',
        no_telepon_wali: '',
        foto_anak: null,
        foto_kk: null,
        foto_akta_kelahiran: null,
        foto_akta_kematian_ayah: null,
        update_sensitive: false,
    });

    const resetFileInputs = () => {
        if (fotoAnakRef.current) fotoAnakRef.current.value = '';
        if (fotoKkRef.current) fotoKkRef.current.value = '';
        if (fotoAktaLahirRef.current) fotoAktaLahirRef.current.value = '';
        if (fotoAktaKematianRef.current) fotoAktaKematianRef.current.value = '';
    };

    const applyFilters = (overrides?: Partial<typeof filters>) => {
        const params: Record<string, string> = {
            search: overrides?.search !== undefined ? overrides.search : search,
            jenis_kelamin:
                overrides?.jenis_kelamin !== undefined
                    ? overrides.jenis_kelamin
                    : jenisKelamin,
            jenjang:
                overrides?.jenjang !== undefined ? overrides.jenjang : jenjang,
            kelurahan:
                overrides?.kelurahan !== undefined
                    ? overrides.kelurahan
                    : kelurahan,
        };

        Object.keys(params).forEach((key) => {
            if (!params[key]) {
                delete params[key];
            }
        });

        setIsFiltering(true);
        router.get('/admin/anak-yatim', params, {
            preserveState: true,
            preserveScroll: true,
            onFinish: () => setIsFiltering(false),
        });
    };

    const handleSearchSubmit = (e: FormEvent) => {
        e.preventDefault();
        applyFilters();
    };

    const handleResetFilters = () => {
        setSearch('');
        setJenisKelamin('');
        setJenjang('');
        setKelurahan('');
        setIsFiltering(true);
        router.get(
            '/admin/anak-yatim',
            {},
            {
                preserveState: true,
                preserveScroll: true,
                onFinish: () => setIsFiltering(false),
            },
        );
    };

    const hasActiveFilters = Boolean(
        search || jenisKelamin || jenjang || kelurahan,
    );

    const openCreateModal = () => {
        setEditingItem(null);
        form.clearErrors();
        resetFileInputs();
        form.setData({
            nik: '',
            no_kk: '',
            nama_lengkap: '',
            anak_ke: '1',
            jenis_kelamin: 'L',
            status_santunan: 'menunggu',
            tempat_lahir: '',
            tanggal_lahir: '',
            jenjang: 'SD',
            kelurahan: kelurahanList[0] || 'Cigending',
            alamat_detail: '',
            nama_ibu_kandung: '',
            no_telepon: '',
            nama_wali: '',
            no_telepon_wali: '',
            foto_anak: null,
            foto_kk: null,
            foto_akta_kelahiran: null,
            foto_akta_kematian_ayah: null,
            update_sensitive: true,
        });
        setIsFormOpen(true);
    };

    const openEditModal = (item: AnakYatimItem) => {
        setEditingItem(item);
        form.clearErrors();
        resetFileInputs();
        form.setData({
            nik: '',
            no_kk: '',
            nama_lengkap: item.nama_lengkap,
            anak_ke: item.anak_ke ? String(item.anak_ke) : '1',
            jenis_kelamin: item.jenis_kelamin,
            status_santunan: item.status_santunan || 'menunggu',
            tempat_lahir: item.tempat_lahir || '',
            tanggal_lahir: item.tanggal_lahir || '',
            jenjang: item.jenjang,
            kelurahan: item.kelurahan,
            alamat_detail: '',
            nama_ibu_kandung: item.nama_ibu_kandung || '',
            no_telepon: item.no_telepon || '',
            nama_wali: item.nama_wali,
            no_telepon_wali: item.no_telepon_wali || '',
            foto_anak: null,
            foto_kk: null,
            foto_akta_kelahiran: null,
            foto_akta_kematian_ayah: null,
            update_sensitive: false,
        });
        setIsFormOpen(true);
    };

    const loadSensitiveForEdit = async (item: AnakYatimItem) => {
        setIsLoadingEditSensitive(true);
        try {
            const res = await fetch(`/admin/anak-yatim/${item.id}/sensitive`, {
                headers: { Accept: 'application/json' },
            });
            if (!res.ok) {
                throw new Error('Gagal memuat data sensitif.');
            }
            const json = await res.json();
            form.setData((prev) => ({
                ...prev,
                nik: json.data?.nik || '',
                no_kk: json.data?.no_kk || '',
                alamat_detail: json.data?.alamat_detail || '',
                update_sensitive: true,
            }));
            toast.success(
                'Data sensitif (NIK, No. KK & alamat detail) berhasil dimuat.',
            );
        } catch {
            toast.error(
                'Anda tidak memiliki akses untuk membuka data sensitif anak ini.',
            );
        } finally {
            setIsLoadingEditSensitive(false);
        }
    };

    const handleFormSubmit = (e: FormEvent) => {
        e.preventDefault();

        form.transform((data) => {
            const payload: Record<string, unknown> = {
                ...data,
                update_sensitive: data.update_sensitive ? '1' : '0',
            };

            if (!data.foto_anak) delete payload.foto_anak;
            if (!data.foto_kk) delete payload.foto_kk;
            if (!data.foto_akta_kelahiran) delete payload.foto_akta_kelahiran;
            if (!data.foto_akta_kematian_ayah) {
                delete payload.foto_akta_kematian_ayah;
            }

            if (editingItem) {
                payload._method = 'PUT';
            }

            return payload as unknown as AnakFormData;
        });

        const url = editingItem
            ? `/admin/anak-yatim/${editingItem.id}`
            : '/admin/anak-yatim';

        form.post(url, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setIsFormOpen(false);
                setEditingItem(null);
                resetFileInputs();
            },
        });
    };

    const openDetailModal = (item: AnakYatimItem) => {
        setDetailItem(item);
        setSensitiveData(null);
    };

    const handleToggleSensitiveDetail = async (item: AnakYatimItem) => {
        if (sensitiveData) {
            setSensitiveData(null);
            return;
        }

        setIsLoadingSensitive(true);
        try {
            const res = await fetch(`/admin/anak-yatim/${item.id}/sensitive`, {
                headers: { Accept: 'application/json' },
            });
            if (!res.ok) {
                throw new Error('Forbidden');
            }
            const json = await res.json();
            setSensitiveData({
                nik: json.data?.nik || null,
                no_kk: json.data?.no_kk || null,
                alamat_detail: json.data?.alamat_detail || null,
            });
        } catch {
            toast.error('Akses ke data sensitif ditolak.');
        } finally {
            setIsLoadingSensitive(false);
        }
    };

    const handleConfirmDelete = () => {
        if (!deletingItem) return;
        setIsDeleting(true);
        router.delete(`/admin/anak-yatim/${deletingItem.id}`, {
            preserveScroll: true,
            onFinish: () => {
                setIsDeleting(false);
                setDeletingItem(null);
            },
        });
    };

    const dokumenFieldConfigs: Array<{
        key:
            | 'foto_anak'
            | 'foto_kk'
            | 'foto_akta_kelahiran'
            | 'foto_akta_kematian_ayah';
        label: string;
        inputRef: React.RefObject<HTMLInputElement | null>;
        error?: string;
        existingMeta?: DokumenMeta | null;
    }> = [
        {
            key: 'foto_anak',
            label: 'Foto Anak',
            inputRef: fotoAnakRef,
            error: form.errors.foto_anak,
            existingMeta: editingItem?.dokumen?.foto_anak,
        },
        {
            key: 'foto_kk',
            label: 'Foto KK',
            inputRef: fotoKkRef,
            error: form.errors.foto_kk,
            existingMeta: editingItem?.dokumen?.foto_kk,
        },
        {
            key: 'foto_akta_kelahiran',
            label: 'Foto Akta Kelahiran',
            inputRef: fotoAktaLahirRef,
            error: form.errors.foto_akta_kelahiran,
            existingMeta: editingItem?.dokumen?.foto_akta_kelahiran,
        },
        {
            key: 'foto_akta_kematian_ayah',
            label: 'Foto Akta Kematian Ayah',
            inputRef: fotoAktaKematianRef,
            error: form.errors.foto_akta_kematian_ayah,
            existingMeta: editingItem?.dokumen?.foto_akta_kematian_ayah,
        },
    ];

    return (
        <>
            <Head title="Pengelolaan Anak Yatim" />
            <div className="flex min-h-screen flex-col gap-6 bg-[#f8fafb] p-4 font-poppins text-slate-800 sm:p-6 lg:p-8">
                {/* Header Section */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">
                            Pengelolaan Data Anak Yatim
                        </h1>
                        <p className="mt-1 text-sm text-slate-500">
                            Kelola profil identitas, pendidikan, keluarga, dan
                            berkas dokumen anak binaan secara privat dan
                            terenkripsi.
                        </p>
                    </div>
                    {permissions.can_create && (
                        <Button
                            type="button"
                            onClick={openCreateModal}
                            className="w-fit bg-[#14bace] text-xs font-semibold text-white shadow-none hover:bg-[#0fa0ae] focus-visible:ring-2 focus-visible:ring-[#14bace]/30"
                        >
                            + Tambah Data Anak
                        </Button>
                    )}
                </div>

                {/* Flash Alert Banner */}
                {bannerMessage && (
                    <div
                        className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm transition-all ${
                            bannerMessage.type === 'success'
                                ? 'border-emerald-200 bg-emerald-50/80 text-emerald-800'
                                : 'border-rose-200 bg-rose-50/80 text-rose-800'
                        }`}
                    >
                        <span className="font-medium">
                            {bannerMessage.text}
                        </span>
                        <button
                            type="button"
                            onClick={() => setBannerMessage(null)}
                            className="rounded-md border border-current/20 px-2 py-0.5 text-xs font-medium hover:bg-black/5"
                        >
                            Tutup
                        </button>
                    </div>
                )}

                {/* Summary Cards berdasarkan Jenjang Pendidikan */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-xl border border-[#e4eaec] border-t-4 border-t-[#14bace] bg-white p-5 shadow-2xs">
                        <span className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
                            Anak SD
                        </span>
                        <p className="mt-2 text-2xl font-bold text-slate-800">
                            {stats.sd}
                        </p>
                        <span className="text-[11px] text-slate-400">
                            Sekolah Dasar terdata di database
                        </span>
                    </div>

                    <div className="rounded-xl border border-[#e4eaec] border-t-4 border-t-[#087f8c] bg-white p-5 shadow-2xs">
                        <span className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
                            Anak SMP
                        </span>
                        <p className="mt-2 text-2xl font-bold text-slate-800">
                            {stats.smp}
                        </p>
                        <span className="text-[11px] text-slate-400">
                            Sekolah Menengah Pertama terdata
                        </span>
                    </div>

                    <div className="rounded-xl border border-[#e4eaec] border-t-4 border-t-indigo-500 bg-white p-5 shadow-2xs">
                        <span className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
                            Anak SMA
                        </span>
                        <p className="mt-2 text-2xl font-bold text-slate-800">
                            {stats.sma}
                        </p>
                        <span className="text-[11px] text-slate-400">
                            Jenjang SMA / SMK binaan
                        </span>
                    </div>

                    <div className="rounded-xl border border-[#e4eaec] border-t-4 border-t-cyan-700 bg-white p-5 shadow-2xs">
                        <span className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
                            Perguruan Tinggi
                        </span>
                        <p className="mt-2 text-2xl font-bold text-slate-800">
                            {stats.perguruan_tinggi}
                        </p>
                        <span className="text-[11px] text-slate-400">
                            Mahasiswa / Pendidikan Tinggi
                        </span>
                    </div>
                </div>

                {/* Filter & Search Bar */}
                <div className="rounded-xl border border-[#e4eaec] bg-white p-4 shadow-2xs">
                    <form
                        onSubmit={handleSearchSubmit}
                        className="flex flex-col gap-3 lg:flex-row lg:items-center"
                    >
                        <div className="flex flex-1 items-center gap-2">
                            <Input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari nama anak, ibu kandung, wali, telepon, atau kelurahan..."
                                className="h-9 border-[#cbebf0] bg-white text-xs text-slate-800 shadow-none placeholder:text-slate-400 focus-visible:border-[#14bace] focus-visible:ring-2 focus-visible:ring-[#14bace]/20"
                            />
                            <Button
                                type="submit"
                                disabled={isFiltering}
                                className="h-9 shrink-0 bg-[#087f8c] px-4 text-xs font-semibold text-white shadow-none hover:bg-[#066570]"
                            >
                                {isFiltering ? 'Mencari...' : 'Cari'}
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3 lg:flex lg:items-center">
                            <div className="min-w-[165px]">
                                <BrandSelect
                                    ariaLabel="Filter Jenis Kelamin"
                                    value={jenisKelamin}
                                    onValueChange={(val) => {
                                        setJenisKelamin(val);
                                        applyFilters({ jenis_kelamin: val });
                                    }}
                                    options={[
                                        {
                                            value: '',
                                            label: 'Semua Jenis Kelamin',
                                        },
                                        { value: 'L', label: 'Laki-laki' },
                                        { value: 'P', label: 'Perempuan' },
                                    ]}
                                />
                            </div>

                            <div className="min-w-[160px]">
                                <BrandSelect
                                    ariaLabel="Filter Jenjang Pendidikan"
                                    value={jenjang}
                                    onValueChange={(val) => {
                                        setJenjang(val);
                                        applyFilters({ jenjang: val });
                                    }}
                                    options={[
                                        { value: '', label: 'Semua Jenjang' },
                                        ...jenjangList.map((j) => ({
                                            value: j,
                                            label: j,
                                        })),
                                    ]}
                                />
                            </div>

                            <div className="min-w-[165px]">
                                <BrandSelect
                                    ariaLabel="Filter Kelurahan"
                                    value={kelurahan}
                                    onValueChange={(val) => {
                                        setKelurahan(val);
                                        applyFilters({ kelurahan: val });
                                    }}
                                    options={[
                                        {
                                            value: '',
                                            label: 'Semua Kelurahan',
                                        },
                                        ...kelurahanList.map((k) => ({
                                            value: k,
                                            label: `Kel. ${k}`,
                                        })),
                                    ]}
                                />
                            </div>

                            {hasActiveFilters && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleResetFilters}
                                    className="h-9 border border-[#cbebf0] bg-[#f7fcfd] px-3 text-xs font-medium text-[#087f8c] shadow-none hover:bg-[#e8f8fa]"
                                >
                                    Reset Filter
                                </Button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Data Table Card */}
                <div className="overflow-hidden rounded-xl border border-[#e4eaec] bg-white shadow-2xs">
                    {anakYatim.data.length === 0 ? (
                        <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                            <h3 className="text-base font-semibold text-slate-800">
                                {hasActiveFilters
                                    ? 'Tidak ada data anak yang sesuai filter'
                                    : 'Belum ada data anak yatim binaan'}
                            </h3>
                            <p className="mt-1 max-w-md text-xs text-slate-500">
                                {hasActiveFilters
                                    ? 'Coba ubah kata kunci pencarian atau atur ulang filter untuk melihat data lainnya.'
                                    : 'Tambahkan data anak binaan baru untuk mulai mengelola pendataan secara aman.'}
                            </p>
                            <div className="mt-4 flex items-center gap-2">
                                {hasActiveFilters && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleResetFilters}
                                        className="border border-[#cbebf0] bg-[#f7fcfd] text-xs font-medium text-[#087f8c] hover:bg-[#e8f8fa]"
                                    >
                                        Atur Ulang Filter
                                    </Button>
                                )}
                                {permissions.can_create && (
                                    <Button
                                        type="button"
                                        onClick={openCreateModal}
                                        className="bg-[#14bace] text-xs font-semibold text-white shadow-none hover:bg-[#0fa0ae]"
                                    >
                                        + Tambah Data Anak
                                    </Button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm text-slate-800">
                                    <thead className="border-b border-[#e4eaec] bg-[#f8fafb] text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                                        <tr>
                                            <th className="px-5 py-3.5">
                                                Profil Anak
                                            </th>
                                            <th className="px-5 py-3.5">
                                                Pendidikan
                                            </th>
                                            <th className="px-5 py-3.5">
                                                Domisili & Keluarga
                                            </th>
                                            <th className="px-5 py-3.5">
                                                Status Santunan
                                            </th>
                                            <th className="px-5 py-3.5">
                                                Dokumen
                                            </th>
                                            <th className="px-5 py-3.5 text-right">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#f0f4f5]">
                                        {anakYatim.data.map((item) => {
                                            const totalDocs = countUploadedDocs(
                                                item.dokumen,
                                            );
                                            return (
                                                <tr
                                                    key={item.id}
                                                    className="transition-colors hover:bg-[#f8fcfe]"
                                                >
                                                    <td className="px-5 py-4 align-top">
                                                        <div className="font-semibold text-slate-800">
                                                            {item.nama_lengkap}
                                                        </div>
                                                        <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
                                                            {item.anak_ke && (
                                                                <span className="font-medium text-[#087f8c]">
                                                                    Anak ke-
                                                                    {
                                                                        item.anak_ke
                                                                    }
                                                                </span>
                                                            )}
                                                            <span>•</span>
                                                            <span>
                                                                {item.jenis_kelamin ===
                                                                'L'
                                                                    ? 'Laki-laki'
                                                                    : 'Perempuan'}
                                                            </span>
                                                        </div>
                                                        <div className="mt-0.5 text-[11px] text-slate-500">
                                                            {item.tempat_lahir ||
                                                                '-'}
                                                            ,{' '}
                                                            {formatTanggalIndo(
                                                                item.tanggal_lahir,
                                                            )}
                                                            {hitungUsia(
                                                                item.tanggal_lahir,
                                                            ) &&
                                                                ` (${hitungUsia(item.tanggal_lahir)})`}
                                                        </div>
                                                    </td>

                                                    <td className="px-5 py-4 align-top">
                                                        <span
                                                            className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-[11px] font-semibold ${jenjangBadgeColor[item.jenjang] || 'border-slate-200 bg-slate-50 text-slate-700'}`}
                                                        >
                                                            {item.jenjang}
                                                        </span>
                                                    </td>

                                                    <td className="px-5 py-4 align-top">
                                                        <div className="text-xs font-semibold text-slate-800">
                                                            Kel.{' '}
                                                            {item.kelurahan}
                                                        </div>
                                                        {item.nama_ibu_kandung && (
                                                            <div className="mt-1 text-xs text-slate-600">
                                                                Ibu:{' '}
                                                                {
                                                                    item.nama_ibu_kandung
                                                                }
                                                            </div>
                                                        )}
                                                        <div className="mt-0.5 text-xs text-slate-500">
                                                            Wali:{' '}
                                                            {item.nama_wali}
                                                        </div>
                                                        {(item.no_telepon ||
                                                            item.no_telepon_wali) && (
                                                            <div className="mt-0.5 text-[11px] text-slate-500">
                                                                Telp:{' '}
                                                                {item.no_telepon ||
                                                                    item.no_telepon_wali}
                                                            </div>
                                                        )}
                                                    </td>

                                                    <td className="px-5 py-4 align-top">
                                                        <span
                                                            className={`inline-flex w-fit items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold capitalize ${
                                                                item.status_santunan ===
                                                                'menerima'
                                                                    ? 'border-teal-200 bg-[#e8f8fa] text-[#087f8c]'
                                                                    : 'border-amber-200 bg-amber-50 text-amber-700'
                                                            }`}
                                                        >
                                                            {item.status_santunan ===
                                                            'menerima'
                                                                ? 'Menerima'
                                                                : 'Menunggu'}
                                                        </span>
                                                    </td>

                                                    <td className="px-5 py-4 align-top">
                                                        <span
                                                            className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-medium ${
                                                                totalDocs === 4
                                                                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                                                                    : totalDocs >
                                                                        0
                                                                      ? 'border-[#cbebf0] bg-[#f7fcfd] text-[#087f8c]'
                                                                      : 'border-slate-200 bg-slate-50 text-slate-500'
                                                            }`}
                                                        >
                                                            {totalDocs}/4 berkas
                                                        </span>
                                                    </td>

                                                    <td className="px-5 py-4 text-right align-top">
                                                        <div className="flex flex-wrap items-center justify-end gap-1.5">
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() =>
                                                                    openDetailModal(
                                                                        item,
                                                                    )
                                                                }
                                                                className="h-8 border border-[#cbebf0] bg-[#f7fcfd] px-2.5 text-xs font-medium text-[#087f8c] shadow-none hover:border-[#14bace] hover:bg-[#e8f8fa]"
                                                            >
                                                                Detail
                                                            </Button>

                                                            {item.can_update && (
                                                                <Button
                                                                    type="button"
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() =>
                                                                        openEditModal(
                                                                            item,
                                                                        )
                                                                    }
                                                                    className="h-8 border border-[#e4eaec] bg-white px-2.5 text-xs font-medium text-slate-700 shadow-none hover:bg-slate-50"
                                                                >
                                                                    Edit
                                                                </Button>
                                                            )}

                                                            {item.can_delete && (
                                                                <Button
                                                                    type="button"
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() =>
                                                                        setDeletingItem(
                                                                            item,
                                                                        )
                                                                    }
                                                                    className="h-8 border border-rose-200 bg-white px-2.5 text-xs font-medium text-rose-600 shadow-none hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700"
                                                                >
                                                                    Hapus
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination Footer */}
                            {anakYatim.last_page > 1 && (
                                <div className="flex flex-col items-center justify-between gap-3 border-t border-[#e4eaec] bg-white px-5 py-3.5 sm:flex-row">
                                    <span className="text-xs text-slate-500">
                                        Menampilkan{' '}
                                        <strong className="font-semibold text-slate-800">
                                            {anakYatim.from ?? 0}–
                                            {anakYatim.to ?? 0}
                                        </strong>{' '}
                                        dari{' '}
                                        <strong className="font-semibold text-slate-800">
                                            {anakYatim.total}
                                        </strong>{' '}
                                        data anak
                                    </span>

                                    <div className="flex items-center gap-1.5">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            disabled={
                                                anakYatim.current_page <= 1
                                            }
                                            onClick={() => {
                                                const prevLink =
                                                    anakYatim.links[0]?.url;
                                                if (prevLink) {
                                                    router.get(
                                                        prevLink,
                                                        {},
                                                        {
                                                            preserveState: true,
                                                            preserveScroll: true,
                                                        },
                                                    );
                                                }
                                            }}
                                            className="h-8 border border-[#cbebf0] bg-[#f7fcfd] px-3 text-xs font-medium text-[#087f8c] shadow-none hover:bg-[#e8f8fa] disabled:opacity-40"
                                        >
                                            Sebelumnya
                                        </Button>

                                        <span className="px-3 text-xs font-medium text-slate-700">
                                            Hal. {anakYatim.current_page} /{' '}
                                            {anakYatim.last_page}
                                        </span>

                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            disabled={
                                                anakYatim.current_page >=
                                                anakYatim.last_page
                                            }
                                            onClick={() => {
                                                const nextLink =
                                                    anakYatim.links[
                                                        anakYatim.links.length -
                                                            1
                                                    ]?.url;
                                                if (nextLink) {
                                                    router.get(
                                                        nextLink,
                                                        {},
                                                        {
                                                            preserveState: true,
                                                            preserveScroll: true,
                                                        },
                                                    );
                                                }
                                            }}
                                            className="h-8 border border-[#cbebf0] bg-[#f7fcfd] px-3 text-xs font-medium text-[#087f8c] shadow-none hover:bg-[#e8f8fa] disabled:opacity-40"
                                        >
                                            Berikutnya
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Modal Create / Edit Anak Yatim */}
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="max-h-[90vh] overflow-y-auto border border-[#e4eaec] bg-white font-poppins text-slate-800 shadow-xl sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-slate-800">
                            {editingItem
                                ? `Perbarui Data Anak: ${editingItem.nama_lengkap}`
                                : 'Tambah Data Anak Yatim Binaan'}
                        </DialogTitle>
                        <DialogDescription className="text-xs text-slate-500">
                            Seluruh data anak bersifat privasi, disimpan aman
                            dan terenkripsi, serta tidak ditampilkan di halaman
                            publik website.
                        </DialogDescription>
                    </DialogHeader>

                    <form
                        onSubmit={handleFormSubmit}
                        className="space-y-5 pt-2"
                    >
                        {/* Bagian 1: Identitas Dasar Anak */}
                        <div className="space-y-3 rounded-xl border border-[#e4eaec] bg-[#fbfcfc] p-4">
                            <h4 className="text-xs font-semibold tracking-wider text-[#087f8c] uppercase">
                                1. Identitas Dasar Anak
                            </h4>
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <div className="space-y-1.5">
                                    <Label
                                        htmlFor="nama_lengkap"
                                        className="text-xs font-medium text-slate-700"
                                    >
                                        Nama Lengkap{' '}
                                        <span className="text-rose-500">*</span>
                                    </Label>
                                    <Input
                                        id="nama_lengkap"
                                        value={form.data.nama_lengkap}
                                        onChange={(e) =>
                                            form.setData(
                                                'nama_lengkap',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Contoh: Ahmad Fauzan Ramadhan"
                                        className="border-[#e4eaec] bg-white text-slate-800 shadow-none placeholder:text-slate-400 focus-visible:border-[#14bace] focus-visible:ring-2 focus-visible:ring-[#14bace]/20"
                                        required
                                    />
                                    <InputError
                                        message={form.errors.nama_lengkap}
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label
                                        htmlFor="anak_ke"
                                        className="text-xs font-medium text-slate-700"
                                    >
                                        Anak ke-{' '}
                                        <span className="text-rose-500">*</span>
                                    </Label>
                                    <Input
                                        id="anak_ke"
                                        type="number"
                                        min={1}
                                        max={30}
                                        value={form.data.anak_ke}
                                        onChange={(e) =>
                                            form.setData(
                                                'anak_ke',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Contoh: 2"
                                        className="border-[#e4eaec] bg-white text-slate-800 shadow-none placeholder:text-slate-400 focus-visible:border-[#14bace] focus-visible:ring-2 focus-visible:ring-[#14bace]/20"
                                        required
                                    />
                                    <InputError message={form.errors.anak_ke} />
                                </div>

                                <div className="space-y-1.5">
                                    <Label
                                        htmlFor="tempat_lahir"
                                        className="text-xs font-medium text-slate-700"
                                    >
                                        Tempat Lahir{' '}
                                        <span className="text-rose-500">*</span>
                                    </Label>
                                    <Input
                                        id="tempat_lahir"
                                        value={form.data.tempat_lahir}
                                        onChange={(e) =>
                                            form.setData(
                                                'tempat_lahir',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Contoh: Bandung"
                                        className="border-[#e4eaec] bg-white text-slate-800 shadow-none placeholder:text-slate-400 focus-visible:border-[#14bace] focus-visible:ring-2 focus-visible:ring-[#14bace]/20"
                                        required
                                    />
                                    <InputError
                                        message={form.errors.tempat_lahir}
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label
                                        htmlFor="tanggal_lahir"
                                        className="text-xs font-medium text-slate-700"
                                    >
                                        Tanggal Lahir{' '}
                                        <span className="text-rose-500">*</span>
                                    </Label>
                                    <Input
                                        id="tanggal_lahir"
                                        type="date"
                                        value={form.data.tanggal_lahir}
                                        onChange={(e) =>
                                            form.setData(
                                                'tanggal_lahir',
                                                e.target.value,
                                            )
                                        }
                                        className="border-[#e4eaec] bg-white text-slate-800 shadow-none focus-visible:border-[#14bace] focus-visible:ring-2 focus-visible:ring-[#14bace]/20"
                                        required
                                    />
                                    <InputError
                                        message={form.errors.tanggal_lahir}
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label
                                        htmlFor="jenis_kelamin"
                                        className="text-xs font-medium text-slate-700"
                                    >
                                        Jenis Kelamin{' '}
                                        <span className="text-rose-500">*</span>
                                    </Label>
                                    <BrandSelect
                                        id="jenis_kelamin"
                                        value={form.data.jenis_kelamin}
                                        onValueChange={(val) =>
                                            form.setData(
                                                'jenis_kelamin',
                                                val as 'L' | 'P',
                                            )
                                        }
                                        options={[
                                            {
                                                value: 'L',
                                                label: 'Laki-laki (L)',
                                            },
                                            {
                                                value: 'P',
                                                label: 'Perempuan (P)',
                                            },
                                        ]}
                                    />
                                    <InputError
                                        message={form.errors.jenis_kelamin}
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label
                                        htmlFor="status_santunan"
                                        className="text-xs font-medium text-slate-700"
                                    >
                                        Status Penerima Santunan{' '}
                                        <span className="text-rose-500">*</span>
                                    </Label>
                                    <BrandSelect
                                        id="status_santunan"
                                        value={form.data.status_santunan}
                                        onValueChange={(val) =>
                                            form.setData(
                                                'status_santunan',
                                                val as 'menerima' | 'menunggu',
                                            )
                                        }
                                        options={[
                                            {
                                                value: 'menerima',
                                                label: 'Menerima',
                                            },
                                            {
                                                value: 'menunggu',
                                                label: 'Menunggu',
                                            },
                                        ]}
                                    />
                                    <InputError
                                        message={form.errors.status_santunan}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Bagian 2: Pendidikan, Keluarga & Domisili */}
                        <div className="space-y-3 rounded-xl border border-[#e4eaec] bg-[#fbfcfc] p-4">
                            <h4 className="text-xs font-semibold tracking-wider text-[#087f8c] uppercase">
                                2. Pendidikan, Keluarga & Domisili
                            </h4>
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <div className="space-y-1.5">
                                    <Label
                                        htmlFor="jenjang"
                                        className="text-xs font-medium text-slate-700"
                                    >
                                        Jenjang Pendidikan{' '}
                                        <span className="text-rose-500">*</span>
                                    </Label>
                                    <BrandSelect
                                        id="jenjang"
                                        value={form.data.jenjang}
                                        onValueChange={(val) =>
                                            form.setData('jenjang', val)
                                        }
                                        options={jenjangList.map((j) => ({
                                            value: j,
                                            label: j,
                                        }))}
                                    />
                                    <InputError message={form.errors.jenjang} />
                                </div>

                                <div className="space-y-1.5">
                                    <Label
                                        htmlFor="kelurahan"
                                        className="text-xs font-medium text-slate-700"
                                    >
                                        Kelurahan Domisili{' '}
                                        <span className="text-rose-500">*</span>
                                    </Label>
                                    <Input
                                        id="kelurahan"
                                        list="kelurahan-datalist"
                                        value={form.data.kelurahan}
                                        onChange={(e) =>
                                            form.setData(
                                                'kelurahan',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Pilih / ketik kelurahan"
                                        className="border-[#e4eaec] bg-white text-slate-800 shadow-none placeholder:text-slate-400 focus-visible:border-[#14bace] focus-visible:ring-2 focus-visible:ring-[#14bace]/20"
                                        required
                                    />
                                    <datalist id="kelurahan-datalist">
                                        {kelurahanList.map((k) => (
                                            <option key={k} value={k} />
                                        ))}
                                    </datalist>
                                    <InputError
                                        message={form.errors.kelurahan}
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label
                                        htmlFor="nama_ibu_kandung"
                                        className="text-xs font-medium text-slate-700"
                                    >
                                        Nama Ibu Kandung{' '}
                                        <span className="text-rose-500">*</span>
                                    </Label>
                                    <Input
                                        id="nama_ibu_kandung"
                                        value={form.data.nama_ibu_kandung}
                                        onChange={(e) =>
                                            form.setData(
                                                'nama_ibu_kandung',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Nama lengkap ibu kandung"
                                        className="border-[#e4eaec] bg-white text-slate-800 shadow-none placeholder:text-slate-400 focus-visible:border-[#14bace] focus-visible:ring-2 focus-visible:ring-[#14bace]/20"
                                        required
                                    />
                                    <InputError
                                        message={form.errors.nama_ibu_kandung}
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label
                                        htmlFor="no_telepon"
                                        className="text-xs font-medium text-slate-700"
                                    >
                                        Nomor Telepon
                                    </Label>
                                    <Input
                                        id="no_telepon"
                                        value={form.data.no_telepon}
                                        onChange={(e) =>
                                            form.setData(
                                                'no_telepon',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Contoh: 081234567890"
                                        className="border-[#e4eaec] bg-white text-slate-800 shadow-none placeholder:text-slate-400 focus-visible:border-[#14bace] focus-visible:ring-2 focus-visible:ring-[#14bace]/20"
                                    />
                                    <InputError
                                        message={form.errors.no_telepon}
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label
                                        htmlFor="nama_wali"
                                        className="text-xs font-medium text-slate-700"
                                    >
                                        Nama Wali / Pengasuh{' '}
                                        <span className="text-rose-500">*</span>
                                    </Label>
                                    <Input
                                        id="nama_wali"
                                        value={form.data.nama_wali}
                                        onChange={(e) =>
                                            form.setData(
                                                'nama_wali',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Nama Ibu / Wali"
                                        className="border-[#e4eaec] bg-white text-slate-800 shadow-none placeholder:text-slate-400 focus-visible:border-[#14bace] focus-visible:ring-2 focus-visible:ring-[#14bace]/20"
                                        required
                                    />
                                    <InputError
                                        message={form.errors.nama_wali}
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label
                                        htmlFor="no_telepon_wali"
                                        className="text-xs font-medium text-slate-700"
                                    >
                                        No. Telepon / WhatsApp Wali
                                    </Label>
                                    <Input
                                        id="no_telepon_wali"
                                        value={form.data.no_telepon_wali}
                                        onChange={(e) =>
                                            form.setData(
                                                'no_telepon_wali',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Contoh: 081234567890"
                                        className="border-[#e4eaec] bg-white text-slate-800 shadow-none placeholder:text-slate-400 focus-visible:border-[#14bace] focus-visible:ring-2 focus-visible:ring-[#14bace]/20"
                                    />
                                    <InputError
                                        message={form.errors.no_telepon_wali}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Bagian 3: Data Sensitif (UU PDP - NIK, Nomor KK & Alamat Detail) */}
                        <div className="space-y-3 rounded-xl border border-[#cbebf0] bg-[#f7fcfd] p-4">
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                <h4 className="text-xs font-semibold tracking-wider text-[#087f8c] uppercase">
                                    3. Data Kependudukan Terenkripsi (UU PDP)
                                </h4>

                                {editingItem &&
                                    editingItem.can_view_sensitive &&
                                    !form.data.update_sensitive && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            disabled={isLoadingEditSensitive}
                                            onClick={() =>
                                                loadSensitiveForEdit(
                                                    editingItem,
                                                )
                                            }
                                            className="h-7 border border-[#cbebf0] bg-white text-xs font-medium text-[#087f8c] shadow-none hover:bg-[#e8f8fa]"
                                        >
                                            {isLoadingEditSensitive
                                                ? 'Memuat...'
                                                : 'Muat & Ubah NIK / No. KK / Alamat'}
                                        </Button>
                                    )}
                            </div>

                            {editingItem && !editingItem.can_view_sensitive ? (
                                <p className="text-xs text-slate-600">
                                    Akses NIK, Nomor KK, dan alamat rumah detail
                                    dibatasi khusus untuk Super Admin & Bidang
                                    Kemanusiaan. Data sensitif anak ini tetap
                                    aman dan tidak berubah.
                                </p>
                            ) : editingItem && !form.data.update_sensitive ? (
                                <p className="text-xs text-slate-600">
                                    NIK, Nomor KK, dan alamat detail saat ini
                                    tersimpan terenkripsi. Klik tombol di atas
                                    jika perlu memperbaruinya.
                                </p>
                            ) : (
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    <div className="space-y-1.5">
                                        <Label
                                            htmlFor="nik"
                                            className="text-xs font-medium text-slate-700"
                                        >
                                            NIK Anak (16 Digit — Dienkripsi)
                                        </Label>
                                        <Input
                                            id="nik"
                                            maxLength={16}
                                            value={form.data.nik}
                                            onChange={(e) =>
                                                form.setData(
                                                    'nik',
                                                    e.target.value.replace(
                                                        /\D/g,
                                                        '',
                                                    ),
                                                )
                                            }
                                            placeholder="16 digit NIK sesuai KK"
                                            className="border-[#e4eaec] bg-white font-mono text-slate-800 shadow-none placeholder:text-slate-400 focus-visible:border-[#14bace] focus-visible:ring-2 focus-visible:ring-[#14bace]/20"
                                        />
                                        <InputError message={form.errors.nik} />
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label
                                            htmlFor="no_kk"
                                            className="text-xs font-medium text-slate-700"
                                        >
                                            Nomor KK (16 Digit — Dienkripsi)
                                        </Label>
                                        <Input
                                            id="no_kk"
                                            maxLength={16}
                                            value={form.data.no_kk}
                                            onChange={(e) =>
                                                form.setData(
                                                    'no_kk',
                                                    e.target.value.replace(
                                                        /\D/g,
                                                        '',
                                                    ),
                                                )
                                            }
                                            placeholder="16 digit Nomor Kartu Keluarga"
                                            className="border-[#e4eaec] bg-white font-mono text-slate-800 shadow-none placeholder:text-slate-400 focus-visible:border-[#14bace] focus-visible:ring-2 focus-visible:ring-[#14bace]/20"
                                        />
                                        <InputError
                                            message={form.errors.no_kk}
                                        />
                                    </div>

                                    <div className="space-y-1.5 sm:col-span-2">
                                        <Label
                                            htmlFor="alamat_detail"
                                            className="text-xs font-medium text-slate-700"
                                        >
                                            Alamat Rumah Lengkap (Rahasia)
                                        </Label>
                                        <Input
                                            id="alamat_detail"
                                            value={form.data.alamat_detail}
                                            onChange={(e) =>
                                                form.setData(
                                                    'alamat_detail',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Nama jalan, nomor rumah, RT/RW"
                                            className="border-[#e4eaec] bg-white text-slate-800 shadow-none placeholder:text-slate-400 focus-visible:border-[#14bace] focus-visible:ring-2 focus-visible:ring-[#14bace]/20"
                                        />
                                        <InputError
                                            message={form.errors.alamat_detail}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Unggah Dokumen & Foto Anak (Privat - PDF, PNG, JPG) */}
                        <div className="space-y-3 rounded-xl border border-[#e4eaec] bg-[#fbfcfc] p-4">
                            <div>
                                <h4 className="text-xs font-semibold tracking-wider text-[#087f8c] uppercase">
                                    Unggah Dokumen & Foto (Privasi)
                                </h4>
                                <p className="mt-0.5 text-[11px] text-slate-500">
                                    Format file yang diterima: PDF, PNG, JPG
                                    (maksimal 5 MB per berkas).
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                {dokumenFieldConfigs.map((doc) => {
                                    const selectedFile = form.data[doc.key];
                                    return (
                                        <div
                                            key={doc.key}
                                            className="space-y-1.5 rounded-lg border border-[#e4eaec] bg-white p-3"
                                        >
                                            <div className="flex items-center justify-between gap-2">
                                                <Label
                                                    htmlFor={doc.key}
                                                    className="text-xs font-medium text-slate-700"
                                                >
                                                    {doc.label}
                                                </Label>
                                                {doc.existingMeta?.exists &&
                                                    !selectedFile && (
                                                        <span className="rounded bg-[#e8f8fa] px-1.5 py-0.5 text-[10px] font-semibold text-[#087f8c]">
                                                            Tersimpan
                                                        </span>
                                                    )}
                                            </div>

                                            <input
                                                ref={doc.inputRef}
                                                id={doc.key}
                                                type="file"
                                                accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg"
                                                onChange={(e) =>
                                                    form.setData(
                                                        doc.key,
                                                        e.target.files?.[0] ??
                                                            null,
                                                    )
                                                }
                                                className="block w-full cursor-pointer text-[11px] text-slate-600 file:mr-2.5 file:cursor-pointer file:rounded-md file:border file:border-[#cbebf0] file:bg-[#f7fcfd] file:px-2.5 file:py-1 file:text-[11px] file:font-semibold file:text-[#087f8c] hover:file:bg-[#e8f8fa]"
                                            />

                                            {selectedFile && (
                                                <div className="flex items-center justify-between gap-2 rounded bg-[#f7fcfd] px-2 py-1 text-[11px] text-[#087f8c]">
                                                    <span className="truncate font-medium">
                                                        {selectedFile.name}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            form.setData(
                                                                doc.key,
                                                                null,
                                                            );
                                                            if (
                                                                doc.inputRef
                                                                    .current
                                                            ) {
                                                                doc.inputRef.current.value =
                                                                    '';
                                                            }
                                                        }}
                                                        className="shrink-0 font-semibold text-rose-600 hover:underline"
                                                    >
                                                        Batal
                                                    </button>
                                                </div>
                                            )}

                                            {doc.existingMeta?.url &&
                                                !selectedFile && (
                                                    <a
                                                        href={
                                                            doc.existingMeta.url
                                                        }
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="inline-block text-[11px] font-medium text-[#087f8c] underline hover:text-[#14bace]"
                                                    >
                                                        Lihat berkas saat ini
                                                    </a>
                                                )}

                                            <InputError message={doc.error} />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <DialogFooter className="gap-2 pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsFormOpen(false)}
                                className="border border-[#e4eaec] bg-white text-xs font-medium text-slate-600 shadow-none hover:bg-slate-50 hover:text-slate-800"
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                disabled={form.processing}
                                className="bg-[#14bace] text-xs font-semibold text-white shadow-none hover:bg-[#0fa0ae] focus-visible:ring-2 focus-visible:ring-[#14bace]/30"
                            >
                                {form.processing
                                    ? 'Menyimpan...'
                                    : editingItem
                                      ? 'Simpan Perubahan'
                                      : 'Simpan Data Anak'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Modal Detail Anak Yatim */}
            <Dialog
                open={Boolean(detailItem)}
                onOpenChange={(open) => {
                    if (!open) {
                        setDetailItem(null);
                        setSensitiveData(null);
                    }
                }}
            >
                <DialogContent className="max-h-[90vh] overflow-y-auto border border-[#e4eaec] bg-white font-poppins text-slate-800 shadow-xl sm:max-w-xl">
                    {detailItem && (
                        <>
                            <DialogHeader>
                                <div className="flex items-center gap-2">
                                    <Badge
                                        variant="outline"
                                        className="border-[#14bace] bg-[#e8f8fa] text-[11px] font-semibold text-[#087f8c]"
                                    >
                                        Profil Anak Binaan (Privat)
                                    </Badge>
                                    <span className="text-xs text-slate-400">
                                        ID #{detailItem.id}
                                    </span>
                                </div>
                                <DialogTitle className="mt-1 text-xl font-bold tracking-tight text-slate-800">
                                    {detailItem.nama_lengkap}
                                </DialogTitle>
                                <DialogDescription className="text-xs text-slate-500">
                                    {detailItem.anak_ke
                                        ? `Anak ke-${detailItem.anak_ke}`
                                        : 'Data Binaan Yayasan'}
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4 pt-2 text-sm">
                                {/* Grid Info Utama */}
                                <div className="grid grid-cols-2 gap-3 rounded-xl border border-[#e4eaec] bg-[#fbfcfc] p-4">
                                    <div>
                                        <span className="block text-[11px] text-slate-500">
                                            Jenis Kelamin
                                        </span>
                                        <span className="font-semibold text-slate-800">
                                            {detailItem.jenis_kelamin === 'L'
                                                ? 'Laki-laki'
                                                : 'Perempuan'}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="block text-[11px] text-slate-500">
                                            Status Penerima Santunan
                                        </span>
                                        <span
                                            className={`mt-0.5 inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold capitalize ${
                                                detailItem.status_santunan ===
                                                'menerima'
                                                    ? 'border-teal-200 bg-[#e8f8fa] text-[#087f8c]'
                                                    : 'border-amber-200 bg-amber-50 text-amber-700'
                                            }`}
                                        >
                                            {detailItem.status_santunan ===
                                            'menerima'
                                                ? 'Menerima'
                                                : 'Menunggu'}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="block text-[11px] text-slate-500">
                                            Tempat & Tanggal Lahir
                                        </span>
                                        <span className="font-semibold text-slate-800">
                                            {detailItem.tempat_lahir || '-'},{' '}
                                            {formatTanggalIndo(
                                                detailItem.tanggal_lahir,
                                            )}{' '}
                                            {hitungUsia(
                                                detailItem.tanggal_lahir,
                                            ) &&
                                                `(${hitungUsia(detailItem.tanggal_lahir)})`}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="block text-[11px] text-slate-500">
                                            Jenjang Pendidikan
                                        </span>
                                        <span className="font-semibold text-slate-800">
                                            {detailItem.jenjang}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="block text-[11px] text-slate-500">
                                            Kelurahan Domisili
                                        </span>
                                        <span className="font-semibold text-slate-800">
                                            Kel. {detailItem.kelurahan}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="block text-[11px] text-slate-500">
                                            Nomor Telepon
                                        </span>
                                        <span className="font-semibold text-slate-800">
                                            {detailItem.no_telepon || '-'}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="block text-[11px] text-slate-500">
                                            Nama Ibu Kandung
                                        </span>
                                        <span className="font-semibold text-slate-800">
                                            {detailItem.nama_ibu_kandung || '-'}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="block text-[11px] text-slate-500">
                                            Wali / Pengasuh
                                        </span>
                                        <span className="font-semibold text-slate-800">
                                            {detailItem.nama_wali}
                                        </span>
                                        {detailItem.no_telepon_wali && (
                                            <span className="block text-xs text-slate-500">
                                                {detailItem.no_telepon_wali}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Dokumen & Foto Privat */}
                                <div className="rounded-xl border border-[#e4eaec] bg-white p-4">
                                    <span className="block text-xs font-semibold text-slate-700">
                                        Dokumen & Foto Pendukung
                                    </span>
                                    <div className="mt-2.5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                                        {[
                                            {
                                                label: 'Foto Anak',
                                                meta: detailItem.dokumen
                                                    ?.foto_anak,
                                            },
                                            {
                                                label: 'Foto KK',
                                                meta: detailItem.dokumen
                                                    ?.foto_kk,
                                            },
                                            {
                                                label: 'Foto Akta Kelahiran',
                                                meta: detailItem.dokumen
                                                    ?.foto_akta_kelahiran,
                                            },
                                            {
                                                label: 'Foto Akta Kematian Ayah',
                                                meta: detailItem.dokumen
                                                    ?.foto_akta_kematian_ayah,
                                            },
                                        ].map((doc) => (
                                            <div
                                                key={doc.label}
                                                className="flex items-center justify-between rounded-lg border border-[#e4eaec] bg-[#fbfcfc] px-3 py-2 text-xs"
                                            >
                                                <span className="font-medium text-slate-700">
                                                    {doc.label}
                                                </span>
                                                {doc.meta?.exists ? (
                                                    doc.meta.url ? (
                                                        <a
                                                            href={doc.meta.url}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="font-semibold text-[#087f8c] underline hover:text-[#14bace]"
                                                        >
                                                            Lihat Berkas
                                                        </a>
                                                    ) : (
                                                        <span className="text-[11px] text-amber-700">
                                                            Terbatas
                                                        </span>
                                                    )
                                                ) : (
                                                    <span className="text-[11px] text-slate-400">
                                                        Belum ada
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Proteksi Data Sensitif (NIK, Nomor KK & Alamat Detail) */}
                                <div className="rounded-xl border border-[#cbebf0] bg-[#f7fcfd] p-4">
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="text-xs font-semibold text-[#087f8c]">
                                            Data Identitas Sensitif (UU PDP)
                                        </span>

                                        {detailItem.can_view_sensitive ? (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                disabled={isLoadingSensitive}
                                                onClick={() =>
                                                    handleToggleSensitiveDetail(
                                                        detailItem,
                                                    )
                                                }
                                                className="h-7 border border-[#cbebf0] bg-white text-xs font-medium text-[#087f8c] shadow-none hover:bg-[#e8f8fa]"
                                            >
                                                {isLoadingSensitive
                                                    ? 'Memuat...'
                                                    : sensitiveData
                                                      ? 'Sembunyikan'
                                                      : 'Tampilkan NIK, KK & Alamat'}
                                            </Button>
                                        ) : (
                                            <span className="rounded-md border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
                                                Akses Terbatas
                                            </span>
                                        )}
                                    </div>

                                    {sensitiveData ? (
                                        <div className="mt-3 grid grid-cols-1 gap-2 border-t border-[#cbebf0]/70 pt-3 text-xs sm:grid-cols-2">
                                            <div>
                                                <span className="block text-[11px] text-slate-500">
                                                    NIK (Terdekripsi)
                                                </span>
                                                <span className="font-mono font-semibold text-slate-800">
                                                    {sensitiveData.nik ||
                                                        'Belum diisi'}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="block text-[11px] text-slate-500">
                                                    Nomor KK (Terdekripsi)
                                                </span>
                                                <span className="font-mono font-semibold text-slate-800">
                                                    {sensitiveData.no_kk ||
                                                        'Belum diisi'}
                                                </span>
                                            </div>
                                            <div className="sm:col-span-2">
                                                <span className="block text-[11px] text-slate-500">
                                                    Alamat Rumah Detail
                                                </span>
                                                <span className="font-semibold text-slate-800">
                                                    {sensitiveData.alamat_detail ||
                                                        'Belum diisi'}
                                                </span>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="mt-2 text-xs text-slate-500">
                                            {detailItem.can_view_sensitive
                                                ? 'NIK, Nomor KK, dan alamat lengkap disembunyikan secara default. Klik tombol di atas untuk mendekripsi.'
                                                : 'Sesuai prinsip minimisasi data UU PDP, rincian NIK, Nomor KK, dan alamat rumah hanya dapat dibuka oleh Super Admin dan Admin Bidang Kemanusiaan.'}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <DialogFooter className="gap-2 pt-2">
                                {detailItem.can_update && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            const target = detailItem;
                                            setDetailItem(null);
                                            openEditModal(target);
                                        }}
                                        className="border border-[#e4eaec] bg-white text-xs font-medium text-slate-700 shadow-none hover:bg-slate-50"
                                    >
                                        Edit Data
                                    </Button>
                                )}
                                <Button
                                    type="button"
                                    onClick={() => setDetailItem(null)}
                                    className="bg-[#14bace] text-xs font-medium text-white shadow-none hover:bg-[#0fa0ae]"
                                >
                                    Tutup
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>

            {/* Modal Konfirmasi Penghapusan */}
            <Dialog
                open={Boolean(deletingItem)}
                onOpenChange={(open) => {
                    if (!open) setDeletingItem(null);
                }}
            >
                <DialogContent className="border border-[#e4eaec] bg-white font-poppins text-slate-800 shadow-xl sm:max-w-md">
                    {deletingItem && (
                        <>
                            <DialogHeader>
                                <DialogTitle className="text-base font-bold text-slate-800">
                                    Hapus Data Anak Binaan?
                                </DialogTitle>
                                <DialogDescription className="text-xs text-slate-600">
                                    Anda akan menghapus data{' '}
                                    <strong className="font-semibold text-slate-800">
                                        {deletingItem.nama_lengkap}
                                    </strong>
                                    .
                                </DialogDescription>
                            </DialogHeader>

                            {(deletingItem.donasi_count ?? 0) > 0 && (
                                <div className="rounded-lg border border-amber-200 bg-amber-50/80 p-3 text-xs text-amber-800">
                                    <strong>Perhatian Audit:</strong> Anak ini
                                    memiliki{' '}
                                    <strong>{deletingItem.donasi_count}</strong>{' '}
                                    riwayat donasi tercatat. Demi keutuhan audit
                                    keuangan, penghapusan fisik akan ditolak
                                    oleh sistem.
                                </div>
                            )}

                            <DialogFooter className="gap-2 pt-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setDeletingItem(null)}
                                    disabled={isDeleting}
                                    className="border border-[#e4eaec] bg-white text-xs font-medium text-slate-600 shadow-none hover:bg-slate-50 hover:text-slate-800"
                                >
                                    Batal
                                </Button>
                                <Button
                                    type="button"
                                    onClick={handleConfirmDelete}
                                    disabled={isDeleting}
                                    className="bg-rose-600 text-xs font-medium text-white shadow-none hover:bg-rose-700 focus-visible:ring-2 focus-visible:ring-rose-200"
                                >
                                    {isDeleting
                                        ? 'Menghapus...'
                                        : 'Ya, Hapus Data'}
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}

AnakYatimAdmin.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Pengelolaan Anak Yatim', href: '/admin/anak-yatim' },
    ],
};
