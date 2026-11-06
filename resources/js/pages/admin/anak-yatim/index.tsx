import { Head, router, useForm, usePage } from '@inertiajs/react';
import {
    UsersRound,
    Plus,
    ShieldCheck,
    Search,
    Eye,
    EyeOff,
    Pencil,
    Trash2,
    GraduationCap,
    MapPin,
    Heart,
    CheckCircle2,
    AlertTriangle,
    Lock,
    X,
    ChevronLeft,
    ChevronRight,
    RotateCcw,
    Loader2,
    Phone,
    Sparkles,
    Building2,
} from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';
import { toast } from 'sonner';
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

interface AnakYatimItem {
    id: number;
    nama_lengkap: string;
    alias: string;
    jenis_kelamin: 'L' | 'P';
    tanggal_lahir: string;
    jenjang: 'SD' | 'SMP' | 'SMA' | 'Kuliah';
    kelas: string;
    nama_sekolah: string | null;
    kelurahan: string;
    nama_wali: string;
    no_telepon_wali: string | null;
    hobi: string | null;
    cita_cita: string | null;
    status_binaan: 'aktif' | 'alumni' | 'nonaktif';
    status_asuh: 'belum_diasuh' | 'aktif_diasuh';
    donasi_count?: number;
    bidang: BidangItem[];
    pembuat?: {
        id: number;
        name: string;
    } | null;
    can_view_sensitive: boolean;
    can_update: boolean;
    can_delete: boolean;
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
        total: number;
        aktif: number;
        belum_diasuh: number;
        aktif_diasuh: number;
    };
    filters: {
        search: string;
        jenjang: string;
        status_binaan: string;
        status_asuh: string;
        kelurahan: string;
        bidang_id: string;
    };
    bidangList: BidangItem[];
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
    nama_lengkap: string;
    alias: string;
    jenis_kelamin: 'L' | 'P';
    tanggal_lahir: string;
    jenjang: 'SD' | 'SMP' | 'SMA' | 'Kuliah';
    kelas: string;
    nama_sekolah: string;
    kelurahan: string;
    alamat_detail: string;
    nama_wali: string;
    no_telepon_wali: string;
    hobi: string;
    cita_cita: string;
    status_binaan: 'aktif' | 'alumni' | 'nonaktif';
    status_asuh: 'belum_diasuh' | 'aktif_diasuh';
    bidang_ids: number[];
    catatan_program: string;
    update_sensitive: boolean;
}

const bidangBadgeColor: Record<string, string> = {
    kemanusiaan: 'border-teal-200 bg-[#e8f8fa] text-[#087f8c]',
    pendidikan: 'border-blue-200 bg-blue-50 text-blue-700',
    keagamaan: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    ekonomi: 'border-amber-200 bg-amber-50 text-amber-700',
};

const jenjangBadgeColor: Record<string, string> = {
    SD: 'border-teal-200/70 bg-teal-50/60 text-[#087f8c]',
    SMP: 'border-sky-200/70 bg-sky-50/60 text-sky-700',
    SMA: 'border-indigo-200/70 bg-indigo-50/60 text-indigo-700',
    Kuliah: 'border-cyan-200/70 bg-cyan-50/60 text-cyan-800',
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

export default function AnakYatimAdmin() {
    const {
        anakYatim,
        stats,
        filters,
        bidangList,
        kelurahanList,
        permissions,
        flash,
    } = usePage<PageProps>().props;

    // Filter state
    const [search, setSearch] = useState(filters.search || '');
    const [jenjang, setJenjang] = useState(filters.jenjang || '');
    const [statusBinaan, setStatusBinaan] = useState(
        filters.status_binaan || '',
    );
    const [statusAsuh, setStatusAsuh] = useState(filters.status_asuh || '');
    const [kelurahan, setKelurahan] = useState(filters.kelurahan || '');
    const [bidangId, setBidangId] = useState(filters.bidang_id || '');
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
        alamat_detail: string | null;
    } | null>(null);
    const [isLoadingSensitive, setIsLoadingSensitive] = useState(false);
    const [isLoadingEditSensitive, setIsLoadingEditSensitive] = useState(false);

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

    const defaultBidangIds = permissions.is_super_admin
        ? bidangList.length > 0
            ? [bidangList[0].id]
            : []
        : permissions.user_bidang
          ? [permissions.user_bidang.id]
          : [];

    const form = useForm<AnakFormData>({
        nik: '',
        nama_lengkap: '',
        alias: '',
        jenis_kelamin: 'L',
        tanggal_lahir: '',
        jenjang: 'SD',
        kelas: '',
        nama_sekolah: '',
        kelurahan: kelurahanList[0] || 'Cigending',
        alamat_detail: '',
        nama_wali: '',
        no_telepon_wali: '',
        hobi: '',
        cita_cita: '',
        status_binaan: 'aktif',
        status_asuh: 'belum_diasuh',
        bidang_ids: defaultBidangIds,
        catatan_program: '',
        update_sensitive: false,
    });

    const applyFilters = (overrides?: Partial<typeof filters>) => {
        const params: Record<string, string> = {
            search: overrides?.search !== undefined ? overrides.search : search,
            jenjang:
                overrides?.jenjang !== undefined ? overrides.jenjang : jenjang,
            status_binaan:
                overrides?.status_binaan !== undefined
                    ? overrides.status_binaan
                    : statusBinaan,
            status_asuh:
                overrides?.status_asuh !== undefined
                    ? overrides.status_asuh
                    : statusAsuh,
            kelurahan:
                overrides?.kelurahan !== undefined
                    ? overrides.kelurahan
                    : kelurahan,
            bidang_id:
                overrides?.bidang_id !== undefined
                    ? overrides.bidang_id
                    : bidangId,
        };

        // Bersihkan parameter kosong agar URL tetap rapi
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
        setJenjang('');
        setStatusBinaan('');
        setStatusAsuh('');
        setKelurahan('');
        setBidangId('');
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
        search ||
        jenjang ||
        statusBinaan ||
        statusAsuh ||
        kelurahan ||
        bidangId,
    );

    const openCreateModal = () => {
        setEditingItem(null);
        form.clearErrors();
        form.setData({
            nik: '',
            nama_lengkap: '',
            alias: '',
            jenis_kelamin: 'L',
            tanggal_lahir: '',
            jenjang: 'SD',
            kelas: '',
            nama_sekolah: '',
            kelurahan: kelurahanList[0] || 'Cigending',
            alamat_detail: '',
            nama_wali: '',
            no_telepon_wali: '',
            hobi: '',
            cita_cita: '',
            status_binaan: 'aktif',
            status_asuh: 'belum_diasuh',
            bidang_ids: defaultBidangIds,
            catatan_program: '',
            update_sensitive: true,
        });
        setIsFormOpen(true);
    };

    const openEditModal = (item: AnakYatimItem) => {
        setEditingItem(item);
        form.clearErrors();
        const existingCatatan =
            item.bidang.find((b) => b.pivot?.catatan_program)?.pivot
                ?.catatan_program || '';
        form.setData({
            nik: '',
            nama_lengkap: item.nama_lengkap,
            alias: item.alias,
            jenis_kelamin: item.jenis_kelamin,
            tanggal_lahir: item.tanggal_lahir || '',
            jenjang: item.jenjang,
            kelas: item.kelas,
            nama_sekolah: item.nama_sekolah || '',
            kelurahan: item.kelurahan,
            alamat_detail: '',
            nama_wali: item.nama_wali,
            no_telepon_wali: item.no_telepon_wali || '',
            hobi: item.hobi || '',
            cita_cita: item.cita_cita || '',
            status_binaan: item.status_binaan,
            status_asuh: item.status_asuh,
            bidang_ids: item.bidang.map((b) => b.id),
            catatan_program: existingCatatan,
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
                alamat_detail: json.data?.alamat_detail || '',
                update_sensitive: true,
            }));
            toast.success(
                'Data sensitif (NIK & alamat detail) berhasil dimuat.',
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

        if (editingItem) {
            form.put(`/admin/anak-yatim/${editingItem.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    setIsFormOpen(false);
                    setEditingItem(null);
                },
            });
        } else {
            form.post('/admin/anak-yatim', {
                preserveScroll: true,
                onSuccess: () => {
                    setIsFormOpen(false);
                },
            });
        }
    };

    const toggleBidangSelection = (id: number) => {
        const current = form.data.bidang_ids;
        if (current.includes(id)) {
            if (current.length > 1) {
                form.setData(
                    'bidang_ids',
                    current.filter((item) => item !== id),
                );
            }
        } else {
            form.setData('bidang_ids', [...current, id]);
        }
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

    return (
        <>
            <Head title="Pengelolaan Anak Yatim" />
            <div className="flex min-h-screen flex-col gap-6 bg-[#f8fafb] p-4 font-poppins text-slate-800 sm:p-6 lg:p-8">
                {/* Header Section */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                            <div className="flex w-fit items-center gap-2 rounded-md border border-[#cbebf0] bg-[#e8f8fa] px-2.5 py-1 text-xs font-semibold text-[#087f8c]">
                                <ShieldCheck className="size-3.5" />
                                Data Rahasia Binaan Yayasan (UU PDP)
                            </div>
                            {permissions.is_super_admin ? (
                                <span className="inline-flex items-center gap-1.5 rounded-md border border-purple-200 bg-purple-50 px-2.5 py-1 text-xs font-semibold text-purple-700">
                                    Akses Lintas Seluruh Bidang (Super Admin)
                                </span>
                            ) : (
                                permissions.user_bidang && (
                                    <span className="inline-flex items-center gap-1.5 rounded-md border border-teal-200 bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-800">
                                        <Building2 className="size-3.5" />
                                        Unit Kerja:{' '}
                                        {permissions.user_bidang.nama}
                                    </span>
                                )
                            )}
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">
                            Pengelolaan Data Anak Yatim
                        </h1>
                        <p className="mt-1 text-sm text-slate-500">
                            Kelola profil, pendidikan, wali, dan keterkaitan
                            bidang anak binaan Yayasan Geliyat secara
                            terenkripsi.
                        </p>
                    </div>
                    {permissions.can_create && (
                        <Button
                            onClick={openCreateModal}
                            className="flex items-center gap-2 bg-[#14bace] text-white shadow-none hover:bg-[#0fa0ae] focus-visible:ring-2 focus-visible:ring-[#14bace]/30"
                        >
                            <Plus className="size-4" /> Tambah Data Anak
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
                        <div className="flex items-center gap-2.5">
                            {bannerMessage.type === 'success' ? (
                                <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
                            ) : (
                                <AlertTriangle className="size-4 shrink-0 text-rose-600" />
                            )}
                            <span className="font-medium">
                                {bannerMessage.text}
                            </span>
                        </div>
                        <button
                            type="button"
                            onClick={() => setBannerMessage(null)}
                            className="rounded-md p-1 text-slate-400 hover:text-slate-700"
                        >
                            <X className="size-4" />
                        </button>
                    </div>
                )}

                {/* Summary Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-xl border border-[#e4eaec] bg-white p-5 shadow-xs transition-shadow hover:shadow-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-slate-500">
                                Total Anak Terdata
                            </span>
                            <div className="rounded-lg bg-[#e8f8fa] p-2 text-[#087f8c]">
                                <UsersRound className="size-4" />
                            </div>
                        </div>
                        <p className="mt-2 text-2xl font-bold text-slate-800">
                            {stats.total}
                        </p>
                        <span className="text-[11px] text-slate-400">
                            Sesuai cakupan wewenang bidang
                        </span>
                    </div>

                    <div className="rounded-xl border border-[#e4eaec] bg-white p-5 shadow-xs transition-shadow hover:shadow-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-slate-500">
                                Status Binaan Aktif
                            </span>
                            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
                                <CheckCircle2 className="size-4" />
                            </div>
                        </div>
                        <p className="mt-2 text-2xl font-bold text-emerald-600">
                            {stats.aktif}
                        </p>
                        <span className="text-[11px] text-slate-400">
                            Anak aktif dalam pendampingan
                        </span>
                    </div>

                    <div className="rounded-xl border border-[#e4eaec] bg-white p-5 shadow-xs transition-shadow hover:shadow-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-slate-500">
                                Membutuhkan Orang Tua Asuh
                            </span>
                            <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
                                <Heart className="size-4" />
                            </div>
                        </div>
                        <p className="mt-2 text-2xl font-bold text-amber-600">
                            {stats.belum_diasuh}
                        </p>
                        <span className="text-[11px] text-slate-400">
                            Prioritas penyaluran donatur asuh
                        </span>
                    </div>

                    <div className="rounded-xl border border-[#cbebf0] bg-[#f4fbfc] p-5 shadow-xs transition-shadow hover:shadow-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-[#087f8c]">
                                Aktif Diasuh Donatur
                            </span>
                            <div className="rounded-lg bg-[#14bace] p-2 text-white">
                                <Sparkles className="size-4" />
                            </div>
                        </div>
                        <p className="mt-2 text-2xl font-bold text-slate-800">
                            {stats.aktif_diasuh}
                        </p>
                        <span className="text-[11px] text-[#087f8c]">
                            Terhubung program Orang Tua Asuh
                        </span>
                    </div>
                </div>

                {/* Search & Filter Controls */}
                <div className="rounded-xl border border-[#e4eaec] bg-white p-4 shadow-xs">
                    <form
                        onSubmit={handleSearchSubmit}
                        className="flex flex-col gap-3 lg:flex-row lg:items-center"
                    >
                        <div className="relative flex-1">
                            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
                            <Input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari nama lengkap, nama panggilan, sekolah, wali, hobi..."
                                className="border-[#e4eaec] bg-white pl-9 text-sm text-slate-800 shadow-none placeholder:text-slate-400 focus-visible:border-[#14bace] focus-visible:ring-2 focus-visible:ring-[#14bace]/20"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:flex lg:items-center">
                            <select
                                value={jenjang}
                                onChange={(e) => {
                                    setJenjang(e.target.value);
                                    applyFilters({ jenjang: e.target.value });
                                }}
                                aria-label="Filter Jenjang"
                                className="h-9 rounded-lg border border-[#e4eaec] bg-white px-3 text-xs font-medium text-slate-700 transition-colors hover:border-slate-300 focus:border-[#14bace] focus:ring-2 focus:ring-[#14bace]/20 focus:outline-none"
                            >
                                <option value="">Semua Jenjang</option>
                                <option value="SD">SD</option>
                                <option value="SMP">SMP</option>
                                <option value="SMA">SMA</option>
                                <option value="Kuliah">Kuliah</option>
                            </select>

                            <select
                                value={statusBinaan}
                                onChange={(e) => {
                                    setStatusBinaan(e.target.value);
                                    applyFilters({
                                        status_binaan: e.target.value,
                                    });
                                }}
                                aria-label="Filter Status Binaan"
                                className="h-9 rounded-lg border border-[#e4eaec] bg-white px-3 text-xs font-medium text-slate-700 transition-colors hover:border-slate-300 focus:border-[#14bace] focus:ring-2 focus:ring-[#14bace]/20 focus:outline-none"
                            >
                                <option value="">Semua Status Binaan</option>
                                <option value="aktif">Aktif</option>
                                <option value="alumni">Alumni</option>
                                <option value="nonaktif">Nonaktif</option>
                            </select>

                            <select
                                value={statusAsuh}
                                onChange={(e) => {
                                    setStatusAsuh(e.target.value);
                                    applyFilters({
                                        status_asuh: e.target.value,
                                    });
                                }}
                                aria-label="Filter Status Asuh"
                                className="h-9 rounded-lg border border-[#e4eaec] bg-white px-3 text-xs font-medium text-slate-700 transition-colors hover:border-slate-300 focus:border-[#14bace] focus:ring-2 focus:ring-[#14bace]/20 focus:outline-none"
                            >
                                <option value="">Semua Status Asuh</option>
                                <option value="belum_diasuh">
                                    Belum Diasuh
                                </option>
                                <option value="aktif_diasuh">
                                    Aktif Diasuh
                                </option>
                            </select>

                            <select
                                value={kelurahan}
                                onChange={(e) => {
                                    setKelurahan(e.target.value);
                                    applyFilters({ kelurahan: e.target.value });
                                }}
                                aria-label="Filter Kelurahan"
                                className="h-9 rounded-lg border border-[#e4eaec] bg-white px-3 text-xs font-medium text-slate-700 transition-colors hover:border-slate-300 focus:border-[#14bace] focus:ring-2 focus:ring-[#14bace]/20 focus:outline-none"
                            >
                                <option value="">Semua Kelurahan</option>
                                {kelurahanList.map((kel) => (
                                    <option key={kel} value={kel}>
                                        {kel}
                                    </option>
                                ))}
                            </select>

                            {permissions.is_super_admin && (
                                <select
                                    value={bidangId}
                                    onChange={(e) => {
                                        setBidangId(e.target.value);
                                        applyFilters({
                                            bidang_id: e.target.value,
                                        });
                                    }}
                                    aria-label="Filter Bidang"
                                    className="h-9 rounded-lg border border-[#e4eaec] bg-white px-3 text-xs font-medium text-slate-700 transition-colors hover:border-slate-300 focus:border-[#14bace] focus:ring-2 focus:ring-[#14bace]/20 focus:outline-none"
                                >
                                    <option value="">Semua Bidang</option>
                                    {bidangList.map((b) => (
                                        <option key={b.id} value={String(b.id)}>
                                            {b.nama}
                                        </option>
                                    ))}
                                </select>
                            )}

                            <Button
                                type="submit"
                                disabled={isFiltering}
                                className="h-9 bg-[#14bace] text-xs font-medium text-white shadow-none hover:bg-[#0fa0ae] focus-visible:ring-2 focus-visible:ring-[#14bace]/30"
                            >
                                {isFiltering ? (
                                    <Loader2 className="size-3.5 animate-spin" />
                                ) : (
                                    'Cari'
                                )}
                            </Button>

                            {hasActiveFilters && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleResetFilters}
                                    className="h-9 border border-[#e4eaec] bg-white text-xs font-medium text-slate-600 shadow-none hover:bg-slate-50 hover:text-slate-800"
                                >
                                    <RotateCcw className="mr-1.5 size-3.5" />
                                    Reset
                                </Button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Data Table Card */}
                <div className="overflow-hidden rounded-xl border border-[#e4eaec] bg-white shadow-xs">
                    <div className="flex flex-col gap-2 border-b border-[#f0f4f5] bg-slate-50/70 px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between">
                        <span className="text-xs font-semibold text-slate-700">
                            Daftar Anak Binaan ({anakYatim.total} anak)
                        </span>
                        <span className="flex items-center gap-1.5 text-xs text-slate-500">
                            <Lock className="size-3.5 text-[#087f8c]" />
                            NIK & alamat detail dienkripsi dan disembunyikan
                            dari tabel publik
                        </span>
                    </div>

                    {anakYatim.data.length === 0 ? (
                        <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
                            <div className="mb-3 rounded-full bg-[#e8f8fa] p-3.5 text-[#087f8c]">
                                <UsersRound className="size-7" />
                            </div>
                            <h3 className="text-base font-semibold text-slate-800">
                                {hasActiveFilters
                                    ? 'Tidak ada data anak yang sesuai filter'
                                    : 'Belum ada data anak yatim binaan'}
                            </h3>
                            <p className="mt-1 max-w-md text-xs text-slate-500">
                                {hasActiveFilters
                                    ? 'Coba ubah kata kunci pencarian atau atur ulang filter untuk melihat data lainnya.'
                                    : 'Tambahkan data anak binaan baru untuk mulai mengelola program pendampingan yayasan.'}
                            </p>
                            <div className="mt-4 flex items-center gap-2">
                                {hasActiveFilters && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleResetFilters}
                                        className="border border-[#e4eaec] bg-white text-xs text-slate-700 hover:bg-slate-50"
                                    >
                                        Atur Ulang Filter
                                    </Button>
                                )}
                                {permissions.can_create && (
                                    <Button
                                        type="button"
                                        onClick={openCreateModal}
                                        className="bg-[#14bace] text-xs font-medium text-white shadow-none hover:bg-[#0fa0ae]"
                                    >
                                        <Plus className="mr-1.5 size-3.5" />
                                        Tambah Data Anak
                                    </Button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Desktop & Tablet Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm text-slate-800">
                                    <thead className="border-b border-[#e4eaec] bg-slate-50/80 text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                                        <tr>
                                            <th className="px-5 py-3.5">
                                                Profil Anak
                                            </th>
                                            <th className="px-5 py-3.5">
                                                Pendidikan
                                            </th>
                                            <th className="px-5 py-3.5">
                                                Domisili & Wali
                                            </th>
                                            <th className="px-5 py-3.5">
                                                Bidang Binaan
                                            </th>
                                            <th className="px-5 py-3.5">
                                                Status
                                            </th>
                                            <th className="px-5 py-3.5 text-right">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#f0f4f5]">
                                        {anakYatim.data.map((item) => (
                                            <tr
                                                key={item.id}
                                                className="transition-colors hover:bg-[#f8fcfe]"
                                            >
                                                <td className="px-5 py-4 align-top">
                                                    <div className="font-semibold text-slate-800">
                                                        {item.nama_lengkap}
                                                    </div>
                                                    <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
                                                        <span>
                                                            Panggilan:{' '}
                                                            <strong className="font-medium text-[#087f8c]">
                                                                {item.alias}
                                                            </strong>
                                                        </span>
                                                        <span>•</span>
                                                        <span>
                                                            {item.jenis_kelamin ===
                                                            'L'
                                                                ? 'Laki-laki'
                                                                : 'Perempuan'}
                                                        </span>
                                                        {hitungUsia(
                                                            item.tanggal_lahir,
                                                        ) && (
                                                            <>
                                                                <span>•</span>
                                                                <span>
                                                                    {hitungUsia(
                                                                        item.tanggal_lahir,
                                                                    )}
                                                                </span>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>

                                                <td className="px-5 py-4 align-top">
                                                    <div className="flex items-center gap-1.5">
                                                        <span
                                                            className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-semibold ${jenjangBadgeColor[item.jenjang] || 'border-slate-200 bg-slate-50 text-slate-700'}`}
                                                        >
                                                            {item.jenjang}
                                                        </span>
                                                        <span className="text-xs font-medium text-slate-700">
                                                            {item.kelas}
                                                        </span>
                                                    </div>
                                                    {item.nama_sekolah && (
                                                        <div className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                                                            <GraduationCap className="size-3.5 shrink-0 text-[#087f8c]" />
                                                            <span className="line-clamp-1">
                                                                {
                                                                    item.nama_sekolah
                                                                }
                                                            </span>
                                                        </div>
                                                    )}
                                                </td>

                                                <td className="px-5 py-4 align-top">
                                                    <div className="flex items-center gap-1 text-xs font-semibold text-slate-800">
                                                        <MapPin className="size-3.5 shrink-0 text-[#14bace]" />
                                                        <span>
                                                            Kel.{' '}
                                                            {item.kelurahan}
                                                        </span>
                                                    </div>
                                                    <div className="mt-1 text-xs text-slate-500">
                                                        Wali: {item.nama_wali}
                                                    </div>
                                                    {item.no_telepon_wali && (
                                                        <div className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-500">
                                                            <Phone className="size-3" />
                                                            <span>
                                                                {
                                                                    item.no_telepon_wali
                                                                }
                                                            </span>
                                                        </div>
                                                    )}
                                                </td>

                                                <td className="px-5 py-4 align-top">
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {item.bidang.map(
                                                            (b) => (
                                                                <span
                                                                    key={b.id}
                                                                    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${bidangBadgeColor[b.kode] || 'border-slate-200 bg-slate-50 text-slate-700'}`}
                                                                >
                                                                    {b.nama.replace(
                                                                        'Bidang ',
                                                                        '',
                                                                    )}
                                                                </span>
                                                            ),
                                                        )}
                                                    </div>
                                                </td>

                                                <td className="px-5 py-4 align-top">
                                                    <div className="flex flex-col gap-1.5">
                                                        <span
                                                            className={`inline-flex w-fit items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold capitalize ${
                                                                item.status_binaan ===
                                                                'aktif'
                                                                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                                                                    : item.status_binaan ===
                                                                        'alumni'
                                                                      ? 'border-sky-200 bg-sky-50 text-sky-700'
                                                                      : 'border-slate-200 bg-slate-50 text-slate-600'
                                                            }`}
                                                        >
                                                            {item.status_binaan}
                                                        </span>
                                                        <span
                                                            className={`inline-flex w-fit items-center rounded-full border px-2.5 py-0.5 text-[10px] font-medium ${
                                                                item.status_asuh ===
                                                                'aktif_diasuh'
                                                                    ? 'border-teal-200 bg-[#e8f8fa] text-[#087f8c]'
                                                                    : 'border-amber-200 bg-amber-50 text-amber-700'
                                                            }`}
                                                        >
                                                            {item.status_asuh ===
                                                            'aktif_diasuh'
                                                                ? 'Aktif Diasuh'
                                                                : 'Belum Diasuh'}
                                                        </span>
                                                    </div>
                                                </td>

                                                <td className="px-5 py-4 text-right align-top">
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                openDetailModal(
                                                                    item,
                                                                )
                                                            }
                                                            title="Lihat Detail"
                                                            className="h-8 border border-[#e4eaec] bg-white px-2.5 text-xs font-medium text-[#087f8c] shadow-none hover:border-[#cbebf0] hover:bg-[#e8f8fa]"
                                                        >
                                                            <Eye className="size-3.5" />
                                                            <span className="sr-only sm:not-sr-only sm:ml-1">
                                                                Detail
                                                            </span>
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
                                                                title="Edit Data"
                                                                className="h-8 border border-[#e4eaec] bg-white px-2.5 text-xs text-slate-600 shadow-none hover:bg-slate-50 hover:text-slate-900"
                                                            >
                                                                <Pencil className="size-3.5" />
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
                                                                title="Hapus Data"
                                                                className="h-8 border border-rose-200 bg-white px-2.5 text-xs text-rose-600 shadow-none hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700"
                                                            >
                                                                <Trash2 className="size-3.5" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
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

                                    <div className="flex items-center gap-1">
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
                                            className="h-8 border border-[#e4eaec] bg-white px-2.5 text-xs font-medium text-slate-600 shadow-none hover:bg-slate-50 hover:text-slate-800 disabled:opacity-40"
                                        >
                                            <ChevronLeft className="size-3.5" />
                                            Prev
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
                                            className="h-8 border border-[#e4eaec] bg-white px-2.5 text-xs font-medium text-slate-600 shadow-none hover:bg-slate-50 hover:text-slate-800 disabled:opacity-40"
                                        >
                                            Next
                                            <ChevronRight className="size-3.5" />
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
                            Lengkapi data identitas, pendidikan, domisili, dan
                            bidang pendampingan. NIK akan otomatis dienkripsi di
                            database.
                        </DialogDescription>
                    </DialogHeader>

                    <form
                        onSubmit={handleFormSubmit}
                        className="space-y-5 pt-2"
                    >
                        {/* Bagian 1: Identitas Anak */}
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
                                        htmlFor="alias"
                                        className="text-xs font-medium text-slate-700"
                                    >
                                        Nama Panggilan / Alias Publik{' '}
                                        <span className="text-rose-500">*</span>
                                    </Label>
                                    <Input
                                        id="alias"
                                        value={form.data.alias}
                                        onChange={(e) =>
                                            form.setData(
                                                'alias',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Contoh: Fauzan (A.F.)"
                                        className="border-[#e4eaec] bg-white text-slate-800 shadow-none placeholder:text-slate-400 focus-visible:border-[#14bace] focus-visible:ring-2 focus-visible:ring-[#14bace]/20"
                                        required
                                    />
                                    <InputError message={form.errors.alias} />
                                </div>

                                <div className="space-y-1.5">
                                    <Label
                                        htmlFor="jenis_kelamin"
                                        className="text-xs font-medium text-slate-700"
                                    >
                                        Jenis Kelamin{' '}
                                        <span className="text-rose-500">*</span>
                                    </Label>
                                    <select
                                        id="jenis_kelamin"
                                        value={form.data.jenis_kelamin}
                                        onChange={(e) =>
                                            form.setData(
                                                'jenis_kelamin',
                                                e.target.value as 'L' | 'P',
                                            )
                                        }
                                        className="flex h-9 w-full rounded-md border border-[#e4eaec] bg-white px-3 py-1 text-sm text-slate-800 shadow-none transition-colors focus:border-[#14bace] focus:ring-2 focus:ring-[#14bace]/20 focus:outline-none"
                                    >
                                        <option value="L">Laki-laki (L)</option>
                                        <option value="P">Perempuan (P)</option>
                                    </select>
                                    <InputError
                                        message={form.errors.jenis_kelamin}
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
                                        htmlFor="hobi"
                                        className="text-xs font-medium text-slate-700"
                                    >
                                        Hobi / Minat
                                    </Label>
                                    <Input
                                        id="hobi"
                                        value={form.data.hobi}
                                        onChange={(e) =>
                                            form.setData('hobi', e.target.value)
                                        }
                                        placeholder="Contoh: Menggambar & Membaca"
                                        className="border-[#e4eaec] bg-white text-slate-800 shadow-none placeholder:text-slate-400 focus-visible:border-[#14bace] focus-visible:ring-2 focus-visible:ring-[#14bace]/20"
                                    />
                                    <InputError message={form.errors.hobi} />
                                </div>

                                <div className="space-y-1.5">
                                    <Label
                                        htmlFor="cita_cita"
                                        className="text-xs font-medium text-slate-700"
                                    >
                                        Cita-cita
                                    </Label>
                                    <Input
                                        id="cita_cita"
                                        value={form.data.cita_cita}
                                        onChange={(e) =>
                                            form.setData(
                                                'cita_cita',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Contoh: Dokter / Guru"
                                        className="border-[#e4eaec] bg-white text-slate-800 shadow-none placeholder:text-slate-400 focus-visible:border-[#14bace] focus-visible:ring-2 focus-visible:ring-[#14bace]/20"
                                    />
                                    <InputError
                                        message={form.errors.cita_cita}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Bagian 2: Pendidikan & Domisili */}
                        <div className="space-y-3 rounded-xl border border-[#e4eaec] bg-[#fbfcfc] p-4">
                            <h4 className="text-xs font-semibold tracking-wider text-[#087f8c] uppercase">
                                2. Pendidikan, Domisili & Wali
                            </h4>
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                                <div className="space-y-1.5">
                                    <Label
                                        htmlFor="jenjang"
                                        className="text-xs font-medium text-slate-700"
                                    >
                                        Jenjang Pendidikan{' '}
                                        <span className="text-rose-500">*</span>
                                    </Label>
                                    <select
                                        id="jenjang"
                                        value={form.data.jenjang}
                                        onChange={(e) =>
                                            form.setData(
                                                'jenjang',
                                                e.target.value as
                                                    | 'SD'
                                                    | 'SMP'
                                                    | 'SMA'
                                                    | 'Kuliah',
                                            )
                                        }
                                        className="flex h-9 w-full rounded-md border border-[#e4eaec] bg-white px-3 py-1 text-sm text-slate-800 shadow-none transition-colors focus:border-[#14bace] focus:ring-2 focus:ring-[#14bace]/20 focus:outline-none"
                                    >
                                        <option value="SD">SD</option>
                                        <option value="SMP">SMP</option>
                                        <option value="SMA">SMA</option>
                                        <option value="Kuliah">Kuliah</option>
                                    </select>
                                    <InputError message={form.errors.jenjang} />
                                </div>

                                <div className="space-y-1.5">
                                    <Label
                                        htmlFor="kelas"
                                        className="text-xs font-medium text-slate-700"
                                    >
                                        Kelas / Semester{' '}
                                        <span className="text-rose-500">*</span>
                                    </Label>
                                    <Input
                                        id="kelas"
                                        value={form.data.kelas}
                                        onChange={(e) =>
                                            form.setData(
                                                'kelas',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Contoh: Kelas 4 SD"
                                        className="border-[#e4eaec] bg-white text-slate-800 shadow-none placeholder:text-slate-400 focus-visible:border-[#14bace] focus-visible:ring-2 focus-visible:ring-[#14bace]/20"
                                        required
                                    />
                                    <InputError message={form.errors.kelas} />
                                </div>

                                <div className="space-y-1.5">
                                    <Label
                                        htmlFor="nama_sekolah"
                                        className="text-xs font-medium text-slate-700"
                                    >
                                        Nama Sekolah / Kampus
                                    </Label>
                                    <Input
                                        id="nama_sekolah"
                                        value={form.data.nama_sekolah}
                                        onChange={(e) =>
                                            form.setData(
                                                'nama_sekolah',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Contoh: SDN 1 Cigending"
                                        className="border-[#e4eaec] bg-white text-slate-800 shadow-none placeholder:text-slate-400 focus-visible:border-[#14bace] focus-visible:ring-2 focus-visible:ring-[#14bace]/20"
                                    />
                                    <InputError
                                        message={form.errors.nama_sekolah}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
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

                        {/* Bagian 3: Data Sensitif (UU PDP - NIK & Alamat Detail) */}
                        <div className="space-y-3 rounded-xl border border-[#cbebf0] bg-[#f7fcfd] p-4">
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex items-center gap-2">
                                    <Lock className="size-4 text-[#087f8c]" />
                                    <h4 className="text-xs font-semibold tracking-wider text-[#087f8c] uppercase">
                                        3. Data Sensitif Terenkripsi (UU PDP)
                                    </h4>
                                </div>

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
                                            {isLoadingEditSensitive ? (
                                                <Loader2 className="mr-1.5 size-3 animate-spin" />
                                            ) : (
                                                <Eye className="mr-1.5 size-3" />
                                            )}
                                            Muat & Ubah NIK / Alamat
                                        </Button>
                                    )}
                            </div>

                            {editingItem && !editingItem.can_view_sensitive ? (
                                <p className="text-xs text-slate-600">
                                    Akses NIK dan alamat rumah detail dibatasi
                                    khusus untuk Super Admin & Bidang
                                    Kemanusiaan. Data sensitif anak ini tetap
                                    aman dan tidak akan berubah.
                                </p>
                            ) : editingItem && !form.data.update_sensitive ? (
                                <p className="text-xs text-slate-600">
                                    NIK dan alamat detail saat ini tersimpan
                                    dalam kondisi terenkripsi. Klik tombol{' '}
                                    <strong className="font-semibold text-[#087f8c]">
                                        Muat & Ubah NIK / Alamat
                                    </strong>{' '}
                                    di atas bila Anda perlu memperbaruinya.
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

                        {/* Bagian 4: Status & Bidang Binaan */}
                        <div className="space-y-3 rounded-xl border border-[#e4eaec] bg-[#fbfcfc] p-4">
                            <h4 className="text-xs font-semibold tracking-wider text-[#087f8c] uppercase">
                                4. Status & Bidang Binaan Yayasan
                            </h4>

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <div className="space-y-1.5">
                                    <Label
                                        htmlFor="status_binaan"
                                        className="text-xs font-medium text-slate-700"
                                    >
                                        Status Binaan{' '}
                                        <span className="text-rose-500">*</span>
                                    </Label>
                                    <select
                                        id="status_binaan"
                                        value={form.data.status_binaan}
                                        onChange={(e) =>
                                            form.setData(
                                                'status_binaan',
                                                e.target.value as
                                                    | 'aktif'
                                                    | 'alumni'
                                                    | 'nonaktif',
                                            )
                                        }
                                        className="flex h-9 w-full rounded-md border border-[#e4eaec] bg-white px-3 py-1 text-sm text-slate-800 shadow-none transition-colors focus:border-[#14bace] focus:ring-2 focus:ring-[#14bace]/20 focus:outline-none"
                                    >
                                        <option value="aktif">Aktif</option>
                                        <option value="alumni">Alumni</option>
                                        <option value="nonaktif">
                                            Nonaktif
                                        </option>
                                    </select>
                                    <InputError
                                        message={form.errors.status_binaan}
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label
                                        htmlFor="status_asuh"
                                        className="text-xs font-medium text-slate-700"
                                    >
                                        Status Orang Tua Asuh{' '}
                                        <span className="text-rose-500">*</span>
                                    </Label>
                                    <select
                                        id="status_asuh"
                                        value={form.data.status_asuh}
                                        onChange={(e) =>
                                            form.setData(
                                                'status_asuh',
                                                e.target.value as
                                                    | 'belum_diasuh'
                                                    | 'aktif_diasuh',
                                            )
                                        }
                                        className="flex h-9 w-full rounded-md border border-[#e4eaec] bg-white px-3 py-1 text-sm text-slate-800 shadow-none transition-colors focus:border-[#14bace] focus:ring-2 focus:ring-[#14bace]/20 focus:outline-none"
                                    >
                                        <option value="belum_diasuh">
                                            Belum Diasuh (Membutuhkan)
                                        </option>
                                        <option value="aktif_diasuh">
                                            Aktif Diasuh
                                        </option>
                                    </select>
                                    <InputError
                                        message={form.errors.status_asuh}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 pt-1">
                                <Label className="text-xs font-medium text-slate-700">
                                    Bidang Binaan yang Mengelola{' '}
                                    <span className="text-rose-500">*</span>
                                </Label>

                                {permissions.is_super_admin ? (
                                    <>
                                        <p className="text-[11px] text-slate-500">
                                            Satu anak dapat dikelola oleh satu
                                            atau beberapa bidang sekaligus.
                                        </p>
                                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                            {bidangList.map((b) => {
                                                const checked =
                                                    form.data.bidang_ids.includes(
                                                        b.id,
                                                    );
                                                return (
                                                    <label
                                                        key={b.id}
                                                        className={`flex cursor-pointer items-center gap-2.5 rounded-lg border p-2.5 text-xs transition-colors ${
                                                            checked
                                                                ? 'border-[#14bace] bg-[#e8f8fa] font-medium text-slate-800'
                                                                : 'border-[#e4eaec] bg-white text-slate-600 hover:bg-slate-50'
                                                        }`}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={checked}
                                                            onChange={() =>
                                                                toggleBidangSelection(
                                                                    b.id,
                                                                )
                                                            }
                                                            className="size-4 rounded border-slate-300 text-[#14bace] accent-[#14bace] focus:ring-[#14bace]"
                                                        />
                                                        <span>{b.nama}</span>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    </>
                                ) : (
                                    <div className="rounded-lg border border-teal-200 bg-[#e8f8fa]/60 p-3 text-xs text-[#087f8c]">
                                        Anak ini terhubung otomatis ke unit
                                        kerja Anda:{' '}
                                        <strong className="font-semibold text-slate-800">
                                            {permissions.user_bidang?.nama}
                                        </strong>
                                        . (Sesuai kebijakan akses, Admin hanya
                                        mengelola keterkaitan pada bidangnya
                                        sendiri).
                                    </div>
                                )}
                                <InputError message={form.errors.bidang_ids} />
                            </div>

                            <div className="space-y-1.5 pt-1">
                                <Label
                                    htmlFor="catatan_program"
                                    className="text-xs font-medium text-slate-700"
                                >
                                    Catatan Program Pendampingan (Opsional)
                                </Label>
                                <Input
                                    id="catatan_program"
                                    value={form.data.catatan_program}
                                    onChange={(e) =>
                                        form.setData(
                                            'catatan_program',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Contoh: Penerima santunan rutin & bimbingan belajar"
                                    className="border-[#e4eaec] bg-white text-slate-800 shadow-none placeholder:text-slate-400 focus-visible:border-[#14bace] focus-visible:ring-2 focus-visible:ring-[#14bace]/20"
                                />
                                <InputError
                                    message={form.errors.catatan_program}
                                />
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
                                className="bg-[#14bace] text-xs font-medium text-white shadow-none hover:bg-[#0fa0ae] focus-visible:ring-2 focus-visible:ring-[#14bace]/30"
                            >
                                {form.processing && (
                                    <Loader2 className="mr-1.5 size-4 animate-spin" />
                                )}
                                {editingItem
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
                                        Profil Anak Binaan
                                    </Badge>
                                    <span className="text-xs text-slate-400">
                                        ID #{detailItem.id}
                                    </span>
                                </div>
                                <DialogTitle className="mt-1 text-xl font-bold tracking-tight text-slate-800">
                                    {detailItem.nama_lengkap}
                                </DialogTitle>
                                <DialogDescription className="text-xs text-slate-500">
                                    Nama Panggilan / Alias Publik:{' '}
                                    <strong className="font-semibold text-[#087f8c]">
                                        {detailItem.alias}
                                    </strong>
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
                                            Tanggal Lahir & Usia
                                        </span>
                                        <span className="font-semibold text-slate-800">
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
                                            Pendidikan
                                        </span>
                                        <span className="font-semibold text-slate-800">
                                            {detailItem.jenjang} —{' '}
                                            {detailItem.kelas}
                                        </span>
                                        {detailItem.nama_sekolah && (
                                            <span className="block text-xs text-slate-500">
                                                {detailItem.nama_sekolah}
                                            </span>
                                        )}
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
                                    <div>
                                        <span className="block text-[11px] text-slate-500">
                                            Hobi & Cita-cita
                                        </span>
                                        <span className="font-semibold text-slate-800">
                                            {detailItem.hobi || '-'} /{' '}
                                            {detailItem.cita_cita || '-'}
                                        </span>
                                    </div>
                                </div>

                                {/* Bidang Binaan */}
                                <div className="rounded-xl border border-[#e4eaec] bg-white p-4">
                                    <span className="block text-xs font-semibold text-slate-700">
                                        Bidang Binaan yang Mengelola
                                    </span>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {detailItem.bidang.map((b) => (
                                            <div
                                                key={b.id}
                                                className={`rounded-lg border px-3 py-1.5 text-xs ${bidangBadgeColor[b.kode] || 'border-slate-200 bg-slate-50 text-slate-700'}`}
                                            >
                                                <div className="font-semibold">
                                                    {b.nama}
                                                </div>
                                                {b.pivot?.catatan_program && (
                                                    <div className="mt-0.5 text-[11px] opacity-85">
                                                        Catatan:{' '}
                                                        {
                                                            b.pivot
                                                                .catatan_program
                                                        }
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Proteksi Data Sensitif (NIK & Alamat Detail) */}
                                <div className="rounded-xl border border-[#cbebf0] bg-[#f7fcfd] p-4">
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-2">
                                            <Lock className="size-4 text-[#087f8c]" />
                                            <span className="text-xs font-semibold text-[#087f8c]">
                                                Data Identitas Sensitif (UU PDP)
                                            </span>
                                        </div>

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
                                                {isLoadingSensitive ? (
                                                    <Loader2 className="mr-1.5 size-3.5 animate-spin" />
                                                ) : sensitiveData ? (
                                                    <EyeOff className="mr-1.5 size-3.5" />
                                                ) : (
                                                    <Eye className="mr-1.5 size-3.5" />
                                                )}
                                                {sensitiveData
                                                    ? 'Sembunyikan'
                                                    : 'Tampilkan NIK & Alamat'}
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
                                                ? 'NIK (••••••••••••••••) dan alamat lengkap disembunyikan secara default. Klik tombol di atas untuk mendekripsi.'
                                                : 'Sesuai prinsip minimisasi data UU PDP, rincian NIK dan alamat rumah hanya dapat dibuka oleh Super Admin dan Admin Bidang Kemanusiaan.'}
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
                                        <Pencil className="mr-1.5 size-3.5" />
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
                                <div className="mb-2 flex size-10 items-center justify-center rounded-full bg-rose-50 text-rose-600">
                                    <AlertTriangle className="size-5" />
                                </div>
                                <DialogTitle className="text-base font-bold text-slate-800">
                                    Hapus Data Anak Binaan?
                                </DialogTitle>
                                <DialogDescription className="text-xs text-slate-600">
                                    Anda akan menghapus data{' '}
                                    <strong className="font-semibold text-slate-800">
                                        {deletingItem.nama_lengkap}
                                    </strong>{' '}
                                    ({deletingItem.alias}).
                                </DialogDescription>
                            </DialogHeader>

                            {(deletingItem.donasi_count ?? 0) > 0 && (
                                <div className="rounded-lg border border-amber-200 bg-amber-50/80 p-3 text-xs text-amber-800">
                                    <strong>Perhatian Audit:</strong> Anak ini
                                    memiliki{' '}
                                    <strong>{deletingItem.donasi_count}</strong>{' '}
                                    riwayat donasi tercatat. Demi keutuhan audit
                                    keuangan, penghapusan fisik akan ditolak
                                    oleh sistem—silakan ubah status binaan
                                    menjadi <strong>Alumni</strong> atau{' '}
                                    <strong>Nonaktif</strong>.
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
                                    {isDeleting && (
                                        <Loader2 className="mr-1.5 size-4 animate-spin" />
                                    )}
                                    Ya, Hapus Data
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
