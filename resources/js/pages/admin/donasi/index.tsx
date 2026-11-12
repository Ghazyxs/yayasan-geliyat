import { Head, router, useForm, usePage } from '@inertiajs/react';
import {
    HeartHandshake,
    CheckCircle2,
    Clock,
    XCircle,
    Ban,
    Search,
    RotateCcw,
    Eye,
    Plus,
    FileText,
    ExternalLink,
    ShieldCheck,
    AlertTriangle,
    Wallet,
    Calendar,
    UserCheck,
    Phone,
    CreditCard,
    Receipt,
    Upload,
    FileCheck2,
    X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

interface BidangOption {
    id: number;
    kode: string;
    nama: string;
}

interface AnakYatimOption {
    id: number;
    nama_lengkap: string;
    alias: string;
    jenjang: string;
    kelas: string;
    kelurahan: string;
    status_asuh: 'belum_diasuh' | 'aktif_diasuh';
    bidang?: BidangOption[];
}

interface VerifikatorInfo {
    id: number;
    name: string;
}

interface TransaksiInfo {
    id: number;
    kode_transaksi: string;
    tipe: 'pemasukan' | 'pengeluaran';
    kategori: string;
    nominal: number;
    status_transaksi: 'valid' | 'void';
    tanggal_transaksi: string | null;
    keterangan: string;
}

interface DonasiItem {
    id: number;
    kode_donasi: string;
    nama_donatur: string;
    no_whatsapp: string;
    jenis_donasi: string;
    anak_yatim_id: number | null;
    rekening_tujuan: string;
    nominal: number;
    pesan_doa: string | null;
    metode_pembayaran?: string | null;
    midtrans_payment_type?: string | null;
    midtrans_transaction_status?: string | null;
    email_donatur?: string | null;
    paid_at?: string | null;
    status_verifikasi: 'menunggu' | 'terverifikasi' | 'ditolak' | 'dibatalkan';
    verified_at: string | null;
    verified_at_formatted: string | null;
    verified_by: number | null;
    catatan_verifikasi: string | null;
    created_at: string | null;
    created_at_formatted: string | null;
    created_date: string | null;
    has_bukti_transfer: boolean;
    bukti_transfer_url: string | null;
    bukti_transfer_is_pdf: boolean;
    anak_yatim: AnakYatimOption | null;
    verifikator: VerifikatorInfo | null;
    transaksi: TransaksiInfo | null;
    can_verify: boolean;
    can_reject: boolean;
    can_cancel: boolean;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedDonasi {
    data: DonasiItem[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    links: PaginationLink[];
}

interface RekeningItem {
    id?: number;
    kode: string;
    bank: string;
    nomor: string;
    atas_nama: string;
    icon: string;
}

interface DonasiAdminProps {
    donasi?: PaginatedDonasi;
    stats?: {
        total: number;
        menunggu: number;
        terverifikasi: number;
        ditolak: number;
        dibatalkan: number;
        total_nominal_terverifikasi: number;
        nominal_menunggu: number;
    };
    filters?: {
        search: string;
        status_verifikasi: string;
        jenis_donasi: string;
        tanggal_dari: string;
        tanggal_sampai: string;
        tanggal: string;
    };
    jenisDonasiList?: string[];
    rekeningList?: RekeningItem[];
    anakYatimList?: AnakYatimOption[];
    permissions?: {
        is_super_admin: boolean;
        can_create: boolean;
        user_bidang: BidangOption | null;
    };
}

const DEFAULT_PAGINATION: PaginatedDonasi = {
    data: [],
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
    from: null,
    to: null,
    links: [],
};

const DEFAULT_STATS = {
    total: 0,
    menunggu: 0,
    terverifikasi: 0,
    ditolak: 0,
    dibatalkan: 0,
    total_nominal_terverifikasi: 0,
    nominal_menunggu: 0,
};

const DEFAULT_FILTERS = {
    search: '',
    status_verifikasi: '',
    jenis_donasi: '',
    tanggal_dari: '',
    tanggal_sampai: '',
    tanggal: '',
};

const DEFAULT_JENIS_DONASI = [
    'Donasi Umum',
    'Santunan Rutin',
    'Orang Tua Asuh',
    'Bimbel Sinar',
    'Zakat',
];

const DEFAULT_REKENING: RekeningItem[] = [
    {
        kode: 'BSI - 7256194821',
        bank: 'Bank Syariah Indonesia (BSI)',
        nomor: '7256194821',
        atas_nama: 'Yayasan Geliyat Mahdiesa Nahate',
        icon: 'BSI',
    },
    {
        kode: 'BRI - 0123-01-098765-53-1',
        bank: 'Bank Rakyat Indonesia (BRI)',
        nomor: '0123-01-098765-53-1',
        atas_nama: 'Yayasan Geliyat Mahdiesa Nahate',
        icon: 'BRI',
    },
];

const JENIS_DENGAN_ANAK = ['Orang Tua Asuh', 'Santunan Rutin', 'Bimbel Sinar'];

const STATUS_BADGE: Record<
    DonasiItem['status_verifikasi'],
    { label: string; className: string }
> = {
    menunggu: {
        label: 'Menunggu Verifikasi',
        className: 'border-amber-200 bg-amber-50/90 text-amber-700',
    },
    terverifikasi: {
        label: 'Terverifikasi',
        className: 'border-emerald-200 bg-emerald-50/90 text-emerald-700',
    },
    ditolak: {
        label: 'Ditolak',
        className: 'border-rose-200 bg-rose-50/90 text-rose-700',
    },
    dibatalkan: {
        label: 'Dibatalkan (Void)',
        className: 'border-slate-200 bg-slate-100 text-slate-600',
    },
};

const JENIS_BADGE: Record<string, string> = {
    'Donasi Umum': 'border-sky-200 bg-sky-50/90 text-sky-700',
    'Orang Tua Asuh': 'border-[#b6e9f0] bg-[#e8f8fa] text-[#087f8c]',
    'Santunan Rutin': 'border-indigo-200 bg-indigo-50/90 text-indigo-700',
    'Bimbel Sinar': 'border-teal-200 bg-teal-50/90 text-teal-700',
    Zakat: 'border-emerald-200 bg-emerald-50/90 text-emerald-700',
};

function formatRupiah(nominal: number): string {
    return `Rp ${Number(nominal || 0).toLocaleString('id-ID')}`;
}

function decodePaginationLabel(label: string): string {
    return label
        .replace(/&laquo;\s*Previous/i, 'Sebelumnya')
        .replace(/Next\s*&raquo;/i, 'Berikutnya')
        .replace(/&laquo;/g, '«')
        .replace(/&raquo;/g, '»');
}

export default function DonasiAdmin({
    donasi = DEFAULT_PAGINATION,
    stats = DEFAULT_STATS,
    filters = DEFAULT_FILTERS,
    jenisDonasiList = DEFAULT_JENIS_DONASI,
    rekeningList = DEFAULT_REKENING,
    anakYatimList = [],
    permissions = {
        is_super_admin: false,
        can_create: false,
        user_bidang: null,
    },
}: DonasiAdminProps) {
    const pageProps = usePage<{
        flash?: { success?: string | null; error?: string | null };
    }>().props;

    // Filter state
    const [searchInput, setSearchInput] = useState(filters.search ?? '');
    const [statusFilter, setStatusFilter] = useState(
        filters.status_verifikasi ?? '',
    );
    const [jenisFilter, setJenisFilter] = useState(filters.jenis_donasi ?? '');
    const [tanggalDari, setTanggalDari] = useState(filters.tanggal_dari ?? '');
    const [tanggalSampai, setTanggalSampai] = useState(
        filters.tanggal_sampai ?? '',
    );

    // Modals state
    const [detailItem, setDetailItem] = useState<DonasiItem | null>(null);
    const [verifyTarget, setVerifyTarget] = useState<DonasiItem | null>(null);
    const [rejectTarget, setRejectTarget] = useState<DonasiItem | null>(null);
    const [cancelTarget, setCancelTarget] = useState<DonasiItem | null>(null);
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const createFileRef = useRef<HTMLInputElement | null>(null);

    // Form Create Donasi Manual (Admin)
    const createForm = useForm<{
        nama_donatur: string;
        no_whatsapp: string;
        jenis_donasi: string;
        anak_yatim_id: string;
        rekening_id: number | null;
        rekening_tujuan: string;
        nominal: string;
        pesan_doa: string;
        bukti_transfer: File | null;
    }>({
        nama_donatur: '',
        no_whatsapp: '',
        jenis_donasi: jenisDonasiList[0] ?? 'Donasi Umum',
        anak_yatim_id: '',
        rekening_id: rekeningList[0]?.id ?? null,
        rekening_tujuan: rekeningList[0]?.kode ?? 'BSI - 7256194821',
        nominal: '',
        pesan_doa: '',
        bukti_transfer: null,
    });

    // Form Verifikasi
    const verifyForm = useForm<{ catatan_verifikasi: string }>({
        catatan_verifikasi: '',
    });

    // Form Tolak
    const rejectForm = useForm<{ catatan_verifikasi: string }>({
        catatan_verifikasi: '',
    });

    // Form Batalkan (Super Admin)
    const cancelForm = useForm<{ catatan_verifikasi: string }>({
        catatan_verifikasi: '',
    });

    useEffect(() => {
        setSearchInput(filters.search ?? '');
        setStatusFilter(filters.status_verifikasi ?? '');
        setJenisFilter(filters.jenis_donasi ?? '');
        setTanggalDari(filters.tanggal_dari ?? '');
        setTanggalSampai(filters.tanggal_sampai ?? '');
    }, [filters]);

    const applyFilters = (
        overrides: Partial<{
            search: string;
            status_verifikasi: string;
            jenis_donasi: string;
            tanggal_dari: string;
            tanggal_sampai: string;
        }> = {},
    ) => {
        const next = {
            search: overrides.search ?? searchInput,
            status_verifikasi: overrides.status_verifikasi ?? statusFilter,
            jenis_donasi: overrides.jenis_donasi ?? jenisFilter,
            tanggal_dari: overrides.tanggal_dari ?? tanggalDari,
            tanggal_sampai: overrides.tanggal_sampai ?? tanggalSampai,
        };

        const query: Record<string, string> = {};
        Object.entries(next).forEach(([key, val]) => {
            if (val && val.trim() !== '') {
                query[key] = val.trim();
            }
        });

        router.get('/admin/donasi', query, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilters({ search: searchInput });
    };

    const handleResetFilters = () => {
        setSearchInput('');
        setStatusFilter('');
        setJenisFilter('');
        setTanggalDari('');
        setTanggalSampai('');
        router.get(
            '/admin/donasi',
            {},
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    const hasActiveFilters =
        searchInput !== '' ||
        statusFilter !== '' ||
        jenisFilter !== '' ||
        tanggalDari !== '' ||
        tanggalSampai !== '';

    // Handlers for Create Modal
    const openCreateModal = () => {
        createForm.reset();
        createForm.clearErrors();
        if (createFileRef.current) {
            createFileRef.current.value = '';
        }
        setIsCreateOpen(true);
    };

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post('/admin/donasi', {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setIsCreateOpen(false);
                createForm.reset();
                if (createFileRef.current) {
                    createFileRef.current.value = '';
                }
            },
        });
    };

    // Handlers for Verify Modal
    const openVerifyModal = (item: DonasiItem) => {
        verifyForm.reset();
        verifyForm.clearErrors();
        setVerifyTarget(item);
    };

    const handleVerifySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!verifyTarget) return;

        verifyForm.post(`/admin/donasi/${verifyTarget.id}/verify`, {
            preserveScroll: true,
            onSuccess: () => {
                setVerifyTarget(null);
                setDetailItem(null);
                verifyForm.reset();
            },
        });
    };

    // Handlers for Reject Modal
    const openRejectModal = (item: DonasiItem) => {
        rejectForm.reset();
        rejectForm.clearErrors();
        setRejectTarget(item);
    };

    const handleRejectSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!rejectTarget) return;

        rejectForm.post(`/admin/donasi/${rejectTarget.id}/reject`, {
            preserveScroll: true,
            onSuccess: () => {
                setRejectTarget(null);
                setDetailItem(null);
                rejectForm.reset();
            },
        });
    };

    // Handlers for Cancel Modal (Super Admin)
    const openCancelModal = (item: DonasiItem) => {
        cancelForm.reset();
        cancelForm.clearErrors();
        setCancelTarget(item);
    };

    const handleCancelSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!cancelTarget) return;

        cancelForm.post(`/admin/donasi/${cancelTarget.id}/cancel`, {
            preserveScroll: true,
            onSuccess: () => {
                setCancelTarget(null);
                setDetailItem(null);
                cancelForm.reset();
            },
        });
    };

    return (
        <>
            <Head title="Pengelolaan & Verifikasi Donasi" />

            <div className="flex min-h-screen flex-col gap-6 bg-[#f8fafb] p-4 font-poppins text-slate-800 sm:p-6 lg:p-8">
                {/* Flash Notification Banner */}
                {pageProps.flash?.success && (
                    <div className="flex items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50/90 px-4 py-3 text-sm text-emerald-800 shadow-2xs">
                        <div className="flex items-center gap-2.5">
                            <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
                            <span>{pageProps.flash.success}</span>
                        </div>
                    </div>
                )}

                {pageProps.flash?.error && (
                    <div className="flex items-center justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50/90 px-4 py-3 text-sm text-rose-800 shadow-2xs">
                        <div className="flex items-center gap-2.5">
                            <AlertTriangle className="size-4 shrink-0 text-rose-600" />
                            <span>{pageProps.flash.error}</span>
                        </div>
                    </div>
                )}

                {/* Header Section */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="mb-2 flex w-fit items-center gap-2 rounded-md bg-[#e8f8fa] px-2.5 py-1 text-xs font-semibold text-[#087f8c]">
                            <HeartHandshake className="size-3.5" />
                            <span>
                                {permissions.is_super_admin
                                    ? 'Akses Lintas Bidang (Super Admin)'
                                    : permissions.user_bidang
                                      ? `Cakupan: ${permissions.user_bidang.nama}`
                                      : 'Amanah Donatur'}
                            </span>
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">
                            Pengelolaan & Verifikasi Donasi
                        </h1>
                        <p className="mt-1 text-sm text-slate-500">
                            Verifikasi bukti transfer donatur, kelola program
                            Orang Tua Asuh, dan integrasi otomatis ke buku kas
                            yayasan.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                        {stats.menunggu > 0 && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setStatusFilter('menunggu');
                                    applyFilters({
                                        status_verifikasi: 'menunggu',
                                    });
                                }}
                                className="flex items-center gap-2 border-amber-200 bg-amber-50/80 text-xs font-semibold text-amber-800 shadow-none hover:bg-amber-100/80"
                            >
                                <Clock className="size-4 text-amber-600" />
                                <span>
                                    {stats.menunggu} Menunggu Verifikasi
                                </span>
                            </Button>
                        )}

                        {permissions.can_create && (
                            <Button
                                type="button"
                                onClick={openCreateModal}
                                className="flex items-center gap-2 bg-[#14bace] text-xs font-semibold text-white shadow-xs transition hover:bg-[#0fa0ae]"
                            >
                                <Plus className="size-4" />
                                <span>Catat Donasi Manual</span>
                            </Button>
                        )}
                    </div>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-xl border border-[#e4eaec] bg-white p-4 shadow-2xs">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-slate-500">
                                Total Donasi Terverifikasi
                            </span>
                            <div className="flex size-8 items-center justify-center rounded-lg bg-[#e8f8fa] text-[#087f8c]">
                                <Wallet className="size-4" />
                            </div>
                        </div>
                        <p className="mt-2 text-xl font-bold text-slate-800">
                            {formatRupiah(stats.total_nominal_terverifikasi)}
                        </p>
                        <p className="mt-1 text-[11px] text-emerald-700">
                            {stats.terverifikasi} donasi sah tercatat di kas
                        </p>
                    </div>

                    <div className="rounded-xl border border-[#e4eaec] bg-white p-4 shadow-2xs">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-slate-500">
                                Menunggu Verifikasi
                            </span>
                            <div className="flex size-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                                <Clock className="size-4" />
                            </div>
                        </div>
                        <p className="mt-2 text-xl font-bold text-slate-800">
                            {stats.menunggu}{' '}
                            <span className="text-sm font-medium text-slate-500">
                                Pengajuan
                            </span>
                        </p>
                        <p className="mt-1 text-[11px] text-amber-700">
                            Senilai {formatRupiah(stats.nominal_menunggu)}{' '}
                            (belum masuk kas)
                        </p>
                    </div>

                    <div className="rounded-xl border border-[#e4eaec] bg-white p-4 shadow-2xs">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-slate-500">
                                Donasi Ditolak
                            </span>
                            <div className="flex size-8 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
                                <XCircle className="size-4" />
                            </div>
                        </div>
                        <p className="mt-2 text-xl font-bold text-slate-800">
                            {stats.ditolak}{' '}
                            <span className="text-sm font-medium text-slate-500">
                                Pengajuan
                            </span>
                        </p>
                        <p className="mt-1 text-[11px] text-slate-400">
                            Tidak menghasilkan transaksi kas
                        </p>
                    </div>

                    <div className="rounded-xl border border-[#e4eaec] bg-white p-4 shadow-2xs">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-slate-500">
                                Dibatalkan (Void)
                            </span>
                            <div className="flex size-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                                <Ban className="size-4" />
                            </div>
                        </div>
                        <p className="mt-2 text-xl font-bold text-slate-800">
                            {stats.dibatalkan}{' '}
                            <span className="text-sm font-medium text-slate-500">
                                Riwayat
                            </span>
                        </p>
                        <p className="mt-1 text-[11px] text-slate-400">
                            Transaksi kas terkait berstatus VOID
                        </p>
                    </div>
                </div>

                {/* Filter & Search Bar */}
                <div className="rounded-xl border border-[#e4eaec] bg-white p-4 shadow-2xs">
                    <form
                        onSubmit={handleSearchSubmit}
                        className="grid grid-cols-1 gap-3 md:grid-cols-12"
                    >
                        {/* Search Input */}
                        <div className="relative md:col-span-4">
                            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                placeholder="Cari kode donasi, nama donatur, WA, anak..."
                                className="h-9 w-full rounded-lg border border-[#e4eaec] bg-white pr-3 pl-9 text-xs text-slate-800 placeholder:text-slate-400 focus:border-[#14bace] focus:ring-2 focus:ring-[#14bace]/20 focus:outline-hidden"
                            />
                        </div>

                        {/* Status Verifikasi Filter */}
                        <div className="md:col-span-2">
                            <select
                                value={statusFilter}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setStatusFilter(val);
                                    applyFilters({ status_verifikasi: val });
                                }}
                                aria-label="Filter Status Verifikasi"
                                className="h-9 w-full rounded-lg border border-[#e4eaec] bg-white px-2.5 text-xs text-slate-700 focus:border-[#14bace] focus:ring-2 focus:ring-[#14bace]/20 focus:outline-hidden"
                            >
                                <option value="">Semua Status</option>
                                <option value="menunggu">Menunggu</option>
                                <option value="terverifikasi">
                                    Terverifikasi
                                </option>
                                <option value="ditolak">Ditolak</option>
                                <option value="dibatalkan">Dibatalkan</option>
                            </select>
                        </div>

                        {/* Jenis Donasi Filter */}
                        <div className="md:col-span-2">
                            <select
                                value={jenisFilter}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setJenisFilter(val);
                                    applyFilters({ jenis_donasi: val });
                                }}
                                aria-label="Filter Jenis Donasi"
                                className="h-9 w-full rounded-lg border border-[#e4eaec] bg-white px-2.5 text-xs text-slate-700 focus:border-[#14bace] focus:ring-2 focus:ring-[#14bace]/20 focus:outline-hidden"
                            >
                                <option value="">Semua Jenis Program</option>
                                {jenisDonasiList.map((jenis) => (
                                    <option key={jenis} value={jenis}>
                                        {jenis}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Tanggal Dari */}
                        <div className="md:col-span-2">
                            <input
                                type="date"
                                value={tanggalDari}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setTanggalDari(val);
                                    applyFilters({ tanggal_dari: val });
                                }}
                                title="Dari Tanggal"
                                aria-label="Filter Dari Tanggal"
                                className="h-9 w-full rounded-lg border border-[#e4eaec] bg-white px-2.5 text-xs text-slate-700 focus:border-[#14bace] focus:ring-2 focus:ring-[#14bace]/20 focus:outline-hidden"
                            />
                        </div>

                        {/* Tanggal Sampai & Actions */}
                        <div className="flex items-center gap-2 md:col-span-2">
                            <input
                                type="date"
                                value={tanggalSampai}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setTanggalSampai(val);
                                    applyFilters({ tanggal_sampai: val });
                                }}
                                title="Sampai Tanggal"
                                aria-label="Filter Sampai Tanggal"
                                className="h-9 w-full rounded-lg border border-[#e4eaec] bg-white px-2.5 text-xs text-slate-700 focus:border-[#14bace] focus:ring-2 focus:ring-[#14bace]/20 focus:outline-hidden"
                            />

                            {hasActiveFilters && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleResetFilters}
                                    title="Reset Filter"
                                    className="h-9 shrink-0 border-[#e4eaec] bg-white px-2.5 text-xs text-slate-600 shadow-none hover:bg-slate-50 hover:text-slate-800"
                                >
                                    <RotateCcw className="size-3.5" />
                                </Button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Data Table */}
                <div className="overflow-hidden rounded-xl border border-[#e4eaec] bg-white shadow-2xs">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left text-xs">
                            <thead>
                                <tr className="border-b border-[#e4eaec] bg-[#f8fafb] text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                                    <th className="px-4 py-3.5">
                                        Kode & Tanggal
                                    </th>
                                    <th className="px-4 py-3.5">Donatur</th>
                                    <th className="px-4 py-3.5">
                                        Program & Alokasi
                                    </th>
                                    <th className="px-4 py-3.5">
                                        Nominal & Rekening
                                    </th>
                                    <th className="px-4 py-3.5">
                                        Status & Buku Kas
                                    </th>
                                    <th className="px-4 py-3.5 text-right">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#e4eaec]">
                                {donasi.data.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="px-4 py-12 text-center text-sm text-slate-500"
                                        >
                                            <div className="mx-auto flex max-w-sm flex-col items-center gap-2">
                                                <div className="flex size-10 items-center justify-center rounded-full bg-[#e8f8fa] text-[#087f8c]">
                                                    <HeartHandshake className="size-5" />
                                                </div>
                                                <p className="font-semibold text-slate-700">
                                                    Belum ada data donasi
                                                </p>
                                                <p className="text-xs text-slate-400">
                                                    Data pengajuan donasi yang
                                                    sesuai dengan filter atau
                                                    cakupan bidang Anda akan
                                                    muncul di sini.
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    donasi.data.map((item) => {
                                        const badge =
                                            STATUS_BADGE[
                                                item.status_verifikasi
                                            ] ?? STATUS_BADGE.menunggu;
                                        const jenisBadge =
                                            JENIS_BADGE[item.jenis_donasi] ??
                                            'border-slate-200 bg-slate-50 text-slate-700';

                                        return (
                                            <tr
                                                key={item.id}
                                                className="transition hover:bg-slate-50/70"
                                            >
                                                {/* Kode & Tanggal */}
                                                <td className="px-4 py-3.5 align-top">
                                                    <div className="font-mono text-xs font-bold text-slate-800">
                                                        {item.kode_donasi}
                                                    </div>
                                                    <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-400">
                                                        <Calendar className="size-3" />
                                                        <span>
                                                            {item.created_at_formatted ??
                                                                '-'}
                                                        </span>
                                                    </div>
                                                </td>

                                                {/* Donatur */}
                                                <td className="px-4 py-3.5 align-top">
                                                    <div className="font-semibold text-slate-800">
                                                        {item.nama_donatur}
                                                    </div>
                                                    <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-500">
                                                        <Phone className="size-3 text-slate-400" />
                                                        <span>
                                                            {item.no_whatsapp}
                                                        </span>
                                                    </div>
                                                </td>

                                                {/* Program & Alokasi */}
                                                <td className="px-4 py-3.5 align-top">
                                                    <span
                                                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${jenisBadge}`}
                                                    >
                                                        {item.jenis_donasi}
                                                    </span>
                                                    {item.anak_yatim ? (
                                                        <div className="mt-1.5 flex items-center gap-1 text-[11px] text-slate-600">
                                                            <UserCheck className="size-3.5 shrink-0 text-[#14bace]" />
                                                            <span className="font-medium text-slate-700">
                                                                {
                                                                    item
                                                                        .anak_yatim
                                                                        .nama_lengkap
                                                                }{' '}
                                                                (
                                                                {
                                                                    item
                                                                        .anak_yatim
                                                                        .alias
                                                                }
                                                                )
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <div className="mt-1 text-[11px] text-slate-400">
                                                            Alokasi Umum Yayasan
                                                        </div>
                                                    )}
                                                </td>

                                                {/* Nominal & Rekening */}
                                                <td className="px-4 py-3.5 align-top">
                                                    <div className="font-bold text-slate-800">
                                                        {formatRupiah(
                                                            item.nominal,
                                                        )}
                                                    </div>
                                                    <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-500">
                                                        <CreditCard className="size-3 text-slate-400" />
                                                        <span>
                                                            {
                                                                item.rekening_tujuan
                                                            }
                                                        </span>
                                                    </div>
                                                    {item.metode_pembayaran === 'midtrans' && (
                                                        <div className="mt-1">
                                                            <span className="inline-flex items-center gap-1 rounded bg-[#e8f8fa] px-1.5 py-0.5 text-[10px] font-semibold text-[#087f8c]">
                                                                Midtrans{item.midtrans_payment_type ? ` • ${item.midtrans_payment_type.toUpperCase().replace(/_/g, ' ')}` : ''}
                                                            </span>
                                                        </div>
                                                    )}
                                                </td>

                                                {/* Status & Buku Kas */}
                                                <td className="px-4 py-3.5 align-top">
                                                    <span
                                                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${badge.className}`}
                                                    >
                                                        {badge.label}
                                                    </span>

                                                    {item.transaksi && (
                                                        <div className="mt-1.5 flex items-center gap-1.5 text-[11px]">
                                                            <Receipt className="size-3 text-slate-400" />
                                                            <span className="font-mono text-slate-600">
                                                                {
                                                                    item
                                                                        .transaksi
                                                                        .kode_transaksi
                                                                }
                                                            </span>
                                                            <span
                                                                className={`py-0.2 rounded px-1.5 text-[10px] font-semibold uppercase ${
                                                                    item
                                                                        .transaksi
                                                                        .status_transaksi ===
                                                                    'valid'
                                                                        ? 'bg-emerald-50 text-emerald-700'
                                                                        : 'bg-slate-100 text-slate-600 line-through'
                                                                }`}
                                                            >
                                                                {
                                                                    item
                                                                        .transaksi
                                                                        .status_transaksi
                                                                }
                                                            </span>
                                                        </div>
                                                    )}

                                                    {item.verifikator && (
                                                        <div className="mt-1 text-[11px] text-slate-400">
                                                            Oleh:{' '}
                                                            {
                                                                item.verifikator
                                                                    .name
                                                            }
                                                        </div>
                                                    )}
                                                </td>

                                                {/* Aksi */}
                                                <td className="px-4 py-3.5 text-right align-top">
                                                    <div className="flex flex-wrap items-center justify-end gap-1.5">
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                setDetailItem(
                                                                    item,
                                                                )
                                                            }
                                                            className="h-7 border-[#e4eaec] bg-white px-2.5 text-[11px] font-medium text-slate-600 shadow-none hover:bg-slate-50 hover:text-slate-800"
                                                        >
                                                            <Eye className="mr-1 size-3.5 text-[#14bace]" />
                                                            Detail
                                                        </Button>

                                                        {item.can_verify &&
                                                            item.status_verifikasi ===
                                                                'menunggu' && (
                                                                <Button
                                                                    type="button"
                                                                    size="sm"
                                                                    onClick={() =>
                                                                        openVerifyModal(
                                                                            item,
                                                                        )
                                                                    }
                                                                    className="h-7 bg-[#14bace] px-2.5 text-[11px] font-semibold text-white shadow-none hover:bg-[#0fa0ae]"
                                                                >
                                                                    <CheckCircle2 className="mr-1 size-3.5" />
                                                                    Verifikasi
                                                                </Button>
                                                            )}

                                                        {item.can_reject &&
                                                            item.status_verifikasi ===
                                                                'menunggu' && (
                                                                <Button
                                                                    type="button"
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() =>
                                                                        openRejectModal(
                                                                            item,
                                                                        )
                                                                    }
                                                                    className="h-7 border-rose-200 bg-white px-2.5 text-[11px] font-medium text-rose-600 shadow-none hover:bg-rose-50 hover:text-rose-700"
                                                                >
                                                                    <XCircle className="mr-1 size-3.5" />
                                                                    Tolak
                                                                </Button>
                                                            )}

                                                        {item.can_cancel &&
                                                            item.status_verifikasi ===
                                                                'terverifikasi' && (
                                                                <Button
                                                                    type="button"
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() =>
                                                                        openCancelModal(
                                                                            item,
                                                                        )
                                                                    }
                                                                    className="h-7 border-amber-200 bg-white px-2.5 text-[11px] font-medium text-amber-700 shadow-none hover:bg-amber-50"
                                                                >
                                                                    <Ban className="mr-1 size-3.5" />
                                                                    Batalkan
                                                                </Button>
                                                            )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Footer */}
                    {donasi.total > 0 && (
                        <div className="flex flex-col items-center justify-between gap-3 border-t border-[#e4eaec] bg-[#f8fafb] px-4 py-3 text-xs text-slate-500 sm:flex-row">
                            <div>
                                Menampilkan{' '}
                                <span className="font-semibold text-slate-700">
                                    {donasi.from ?? 0}
                                </span>{' '}
                                –{' '}
                                <span className="font-semibold text-slate-700">
                                    {donasi.to ?? 0}
                                </span>{' '}
                                dari{' '}
                                <span className="font-semibold text-slate-700">
                                    {donasi.total}
                                </span>{' '}
                                data donasi
                            </div>

                            {donasi.last_page > 1 && (
                                <div className="flex flex-wrap items-center gap-1">
                                    {donasi.links.map((link, idx) => {
                                        const label = decodePaginationLabel(
                                            link.label,
                                        );
                                        if (!link.url) {
                                            return (
                                                <span
                                                    key={idx}
                                                    className="rounded-lg border border-[#e4eaec] bg-slate-50 px-2.5 py-1 text-xs text-slate-300"
                                                >
                                                    {label}
                                                </span>
                                            );
                                        }

                                        return (
                                            <button
                                                key={idx}
                                                type="button"
                                                onClick={() =>
                                                    router.get(
                                                        link.url!,
                                                        {},
                                                        {
                                                            preserveState: true,
                                                            preserveScroll: true,
                                                        },
                                                    )
                                                }
                                                className={`rounded-lg border px-2.5 py-1 text-xs font-medium transition ${
                                                    link.active
                                                        ? 'border-[#14bace] bg-[#14bace] text-white'
                                                        : 'border-[#e4eaec] bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                                                }`}
                                            >
                                                {label}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* MODAL 1: DETAIL DONASI & BUKTI TRANSFER */}
            <Dialog
                open={detailItem !== null}
                onOpenChange={(open) => !open && setDetailItem(null)}
            >
                <DialogContent className="max-h-[90vh] overflow-y-auto border-[#e4eaec] bg-white font-poppins text-slate-800 sm:max-w-2xl">
                    {detailItem && (
                        <>
                            <DialogHeader>
                                <div className="flex items-center justify-between gap-2 pr-6">
                                    <span className="font-mono text-xs font-bold text-[#087f8c]">
                                        {detailItem.kode_donasi}
                                    </span>
                                    <span
                                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${
                                            STATUS_BADGE[
                                                detailItem.status_verifikasi
                                            ]?.className
                                        }`}
                                    >
                                        {
                                            STATUS_BADGE[
                                                detailItem.status_verifikasi
                                            ]?.label
                                        }
                                    </span>
                                </div>
                                <DialogTitle className="mt-1 text-lg font-bold text-slate-800">
                                    Rincian Pengajuan Donasi
                                </DialogTitle>
                                <DialogDescription className="text-xs text-slate-500">
                                    Diajukan pada{' '}
                                    {detailItem.created_at_formatted ?? '-'}
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4 py-2 text-xs">
                                {/* Informasi Donatur & Nominal */}
                                <div className="grid grid-cols-1 gap-3 rounded-xl border border-[#e4eaec] bg-[#f8fafb] p-4 sm:grid-cols-2">
                                    <div>
                                        <span className="text-[11px] text-slate-400">
                                            Nama Donatur
                                        </span>
                                        <p className="mt-0.5 font-semibold text-slate-800">
                                            {detailItem.nama_donatur}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-[11px] text-slate-400">
                                            Kontak WhatsApp
                                        </span>
                                        <p className="mt-0.5 font-semibold text-slate-800">
                                            {detailItem.no_whatsapp}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-[11px] text-slate-400">
                                            Jenis Program Donasi
                                        </span>
                                        <p className="mt-0.5 font-semibold text-[#087f8c]">
                                            {detailItem.jenis_donasi}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-[11px] text-slate-400">
                                            Nominal Transfer
                                        </span>
                                        <p className="mt-0.5 text-sm font-bold text-slate-800">
                                            {formatRupiah(detailItem.nominal)}
                                        </p>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <span className="text-[11px] text-slate-400">
                                            Rekening / Jalur Donasi
                                        </span>
                                        <p className="mt-0.5 font-medium text-slate-700">
                                            {detailItem.rekening_tujuan}
                                            {detailItem.metode_pembayaran === 'midtrans' && (
                                                <span className="ml-2 inline-flex items-center rounded-full bg-[#e8f8fa] px-2 py-0.5 text-[10px] font-bold text-[#087f8c]">
                                                    Midtrans Snap ({detailItem.midtrans_payment_type?.toUpperCase().replace(/_/g, ' ') || 'Online'})
                                                </span>
                                            )}
                                        </p>
                                        {detailItem.email_donatur && (
                                            <p className="mt-1 text-xs text-slate-500">
                                                Email Donatur: {detailItem.email_donatur}
                                            </p>
                                        )}
                                        {detailItem.paid_at && (
                                            <p className="mt-0.5 text-xs text-emerald-600 font-medium">
                                                Waktu Pembayaran: {detailItem.paid_at}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Alokasi Anak Yatim (Jika Ada) */}
                                {detailItem.anak_yatim && (
                                    <div className="rounded-xl border border-[#cbebf0] bg-[#f7fcfd] p-4">
                                        <div className="flex items-center gap-2 text-xs font-semibold text-[#087f8c]">
                                            <UserCheck className="size-4 text-[#14bace]" />
                                            <span>
                                                Alokasi Anak Binaan Tujuan
                                            </span>
                                        </div>
                                        <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                                            <div>
                                                <span className="text-[11px] text-slate-400">
                                                    Nama Lengkap & Inisial
                                                </span>
                                                <p className="font-semibold text-slate-800">
                                                    {
                                                        detailItem.anak_yatim
                                                            .nama_lengkap
                                                    }{' '}
                                                    (
                                                    {
                                                        detailItem.anak_yatim
                                                            .alias
                                                    }
                                                    )
                                                </p>
                                            </div>
                                            <div>
                                                <span className="text-[11px] text-slate-400">
                                                    Jenjang & Kelurahan
                                                </span>
                                                <p className="font-medium text-slate-700">
                                                    {
                                                        detailItem.anak_yatim
                                                            .jenjang
                                                    }{' '}
                                                    (
                                                    {
                                                        detailItem.anak_yatim
                                                            .kelas
                                                    }
                                                    ) • Kel.{' '}
                                                    {
                                                        detailItem.anak_yatim
                                                            .kelurahan
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Pesan & Doa */}
                                {detailItem.pesan_doa && (
                                    <div className="rounded-xl border border-[#e4eaec] bg-white p-3.5">
                                        <span className="text-[11px] font-medium text-slate-400">
                                            Pesan & Doa Donatur
                                        </span>
                                        <p className="mt-1 leading-relaxed text-slate-700 italic">
                                            "{detailItem.pesan_doa}"
                                        </p>
                                    </div>
                                )}

                                {/* Bukti Transfer (Akses File Terotorisasi) */}
                                <div className="rounded-xl border border-[#e4eaec] bg-white p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 font-semibold text-slate-800">
                                            <FileText className="size-4 text-[#14bace]" />
                                            <span>Lampiran Bukti Transfer</span>
                                        </div>
                                        {detailItem.has_bukti_transfer &&
                                            detailItem.bukti_transfer_url && (
                                                <a
                                                    href={
                                                        detailItem.bukti_transfer_url
                                                    }
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex items-center gap-1 rounded-lg border border-[#cbebf0] bg-[#e8f8fa] px-2.5 py-1 text-[11px] font-semibold text-[#087f8c] transition hover:bg-[#14bace] hover:text-white"
                                                >
                                                    <ExternalLink className="size-3.5" />
                                                    <span>
                                                        Buka Bukti di Tab Baru
                                                    </span>
                                                </a>
                                            )}
                                    </div>

                                    {!detailItem.has_bukti_transfer ||
                                    !detailItem.bukti_transfer_url ? (
                                        <p className="mt-2 text-xs text-slate-400">
                                            Tidak ada file bukti transfer yang
                                            terlampir.
                                        </p>
                                    ) : detailItem.bukti_transfer_is_pdf ? (
                                        <div className="mt-3 flex items-center justify-between rounded-lg border border-[#e4eaec] bg-[#f8fafb] p-3">
                                            <span className="text-xs text-slate-600">
                                                Dokumen PDF Bukti Transfer
                                                Terenkripsi
                                            </span>
                                            <a
                                                href={
                                                    detailItem.bukti_transfer_url
                                                }
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-xs font-semibold text-[#087f8c] underline"
                                            >
                                                Lihat Dokumen PDF
                                            </a>
                                        </div>
                                    ) : (
                                        <div className="mt-3 overflow-hidden rounded-lg border border-[#e4eaec] bg-[#f8fafb] p-2">
                                            <img
                                                src={
                                                    detailItem.bukti_transfer_url
                                                }
                                                alt={`Bukti Transfer ${detailItem.kode_donasi}`}
                                                className="mx-auto max-h-72 rounded object-contain"
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Informasi Audit Verifikasi & Transaksi Kas */}
                                {(detailItem.verifikator ||
                                    detailItem.catatan_verifikasi ||
                                    detailItem.transaksi) && (
                                    <div className="rounded-xl border border-[#e4eaec] bg-[#f8fafb] p-4">
                                        <div className="flex items-center gap-2 font-semibold text-slate-800">
                                            <ShieldCheck className="size-4 text-[#087f8c]" />
                                            <span>
                                                Jejak Audit & Integrasi Buku Kas
                                            </span>
                                        </div>

                                        <div className="mt-2.5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                                            {detailItem.verifikator && (
                                                <div>
                                                    <span className="text-[11px] text-slate-400">
                                                        Diverifikasi / Diproses
                                                        Oleh
                                                    </span>
                                                    <p className="font-medium text-slate-700">
                                                        {
                                                            detailItem
                                                                .verifikator
                                                                .name
                                                        }
                                                    </p>
                                                </div>
                                            )}
                                            {detailItem.verified_at_formatted && (
                                                <div>
                                                    <span className="text-[11px] text-slate-400">
                                                        Waktu Pemrosesan
                                                    </span>
                                                    <p className="font-medium text-slate-700">
                                                        {
                                                            detailItem.verified_at_formatted
                                                        }
                                                    </p>
                                                </div>
                                            )}
                                            {detailItem.transaksi && (
                                                <div className="sm:col-span-2">
                                                    <span className="text-[11px] text-slate-400">
                                                        Kode Transaksi Keuangan
                                                        Terkait
                                                    </span>
                                                    <div className="mt-0.5 flex items-center gap-2">
                                                        <span className="font-mono font-bold text-slate-800">
                                                            {
                                                                detailItem
                                                                    .transaksi
                                                                    .kode_transaksi
                                                            }
                                                        </span>
                                                        <span
                                                            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                                                                detailItem
                                                                    .transaksi
                                                                    .status_transaksi ===
                                                                'valid'
                                                                    ? 'bg-emerald-100 text-emerald-800'
                                                                    : 'bg-slate-200 text-slate-700'
                                                            }`}
                                                        >
                                                            {
                                                                detailItem
                                                                    .transaksi
                                                                    .status_transaksi
                                                            }
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                            {detailItem.catatan_verifikasi && (
                                                <div className="sm:col-span-2">
                                                    <span className="text-[11px] text-slate-400">
                                                        Catatan Verifikasi /
                                                        Audit
                                                    </span>
                                                    <p className="mt-0.5 text-slate-700">
                                                        {
                                                            detailItem.catatan_verifikasi
                                                        }
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <DialogFooter className="flex flex-wrap items-center justify-between gap-2 sm:justify-between">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setDetailItem(null)}
                                    className="border-[#e4eaec] bg-white text-xs font-medium text-slate-600 shadow-none hover:bg-slate-50"
                                >
                                    Tutup
                                </Button>

                                <div className="flex flex-wrap items-center gap-2">
                                    {detailItem.can_reject &&
                                        detailItem.status_verifikasi ===
                                            'menunggu' && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() =>
                                                    openRejectModal(detailItem)
                                                }
                                                className="border-rose-200 bg-white text-xs font-medium text-rose-600 shadow-none hover:bg-rose-50"
                                            >
                                                <XCircle className="mr-1.5 size-3.5" />
                                                Tolak Donasi
                                            </Button>
                                        )}

                                    {detailItem.can_verify &&
                                        detailItem.status_verifikasi ===
                                            'menunggu' && (
                                            <Button
                                                type="button"
                                                onClick={() =>
                                                    openVerifyModal(detailItem)
                                                }
                                                className="bg-[#14bace] text-xs font-semibold text-white shadow-none hover:bg-[#0fa0ae]"
                                            >
                                                <CheckCircle2 className="mr-1.5 size-3.5" />
                                                Verifikasi & Catat Kas
                                            </Button>
                                        )}

                                    {detailItem.can_cancel &&
                                        detailItem.status_verifikasi ===
                                            'terverifikasi' && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() =>
                                                    openCancelModal(detailItem)
                                                }
                                                className="border-amber-200 bg-amber-50/70 text-xs font-medium text-amber-800 shadow-none hover:bg-amber-100"
                                            >
                                                <Ban className="mr-1.5 size-3.5" />
                                                Batalkan Donasi (Void)
                                            </Button>
                                        )}
                                </div>
                            </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>

            {/* MODAL 2: KONFIRMASI VERIFIKASI DONASI */}
            <Dialog
                open={verifyTarget !== null}
                onOpenChange={(open) => !open && setVerifyTarget(null)}
            >
                <DialogContent className="border-[#e4eaec] bg-white font-poppins text-slate-800 sm:max-w-md">
                    {verifyTarget && (
                        <form onSubmit={handleVerifySubmit}>
                            <DialogHeader>
                                <DialogTitle className="text-base font-bold text-slate-800">
                                    Verifikasi Penerimaan Donasi
                                </DialogTitle>
                                <DialogDescription className="text-xs text-slate-500">
                                    Pastikan dana telah masuk ke rekening resmi
                                    yayasan sebelum melakukan verifikasi.
                                </DialogDescription>
                            </DialogHeader>

                            <div className="my-4 space-y-3 text-xs">
                                <div className="rounded-xl border border-[#cbebf0] bg-[#f7fcfd] p-3.5">
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">
                                            Kode Donasi:
                                        </span>
                                        <span className="font-mono font-bold text-slate-800">
                                            {verifyTarget.kode_donasi}
                                        </span>
                                    </div>
                                    <div className="mt-1.5 flex justify-between">
                                        <span className="text-slate-500">
                                            Donatur:
                                        </span>
                                        <span className="font-semibold text-slate-800">
                                            {verifyTarget.nama_donatur}
                                        </span>
                                    </div>
                                    <div className="mt-1.5 flex justify-between">
                                        <span className="text-slate-500">
                                            Program:
                                        </span>
                                        <span className="font-medium text-[#087f8c]">
                                            {verifyTarget.jenis_donasi}
                                        </span>
                                    </div>
                                    <div className="mt-1.5 flex justify-between border-t border-[#cbebf0] pt-1.5">
                                        <span className="font-medium text-slate-600">
                                            Nominal Masuk Kas:
                                        </span>
                                        <span className="text-sm font-bold text-emerald-700">
                                            {formatRupiah(verifyTarget.nominal)}
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-1 block text-xs font-medium text-slate-700">
                                        Catatan Verifikasi (Opsional)
                                    </label>
                                    <textarea
                                        rows={2}
                                        value={
                                            verifyForm.data.catatan_verifikasi
                                        }
                                        onChange={(e) =>
                                            verifyForm.setData(
                                                'catatan_verifikasi',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Contoh: Mutasi BSI sesuai pada tanggal transfer..."
                                        className="w-full rounded-lg border border-[#e4eaec] bg-white px-3 py-2 text-xs text-slate-800 focus:border-[#14bace] focus:ring-2 focus:ring-[#14bace]/20 focus:outline-hidden"
                                    />
                                </div>
                            </div>

                            <DialogFooter className="gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setVerifyTarget(null)}
                                    className="border-[#e4eaec] bg-white text-xs font-medium text-slate-600 shadow-none hover:bg-slate-50"
                                >
                                    Batal
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={verifyForm.processing}
                                    className="bg-[#14bace] text-xs font-semibold text-white shadow-none hover:bg-[#0fa0ae]"
                                >
                                    {verifyForm.processing
                                        ? 'Memproses...'
                                        : 'Ya, Verifikasi Sekarang'}
                                </Button>
                            </DialogFooter>
                        </form>
                    )}
                </DialogContent>
            </Dialog>

            {/* MODAL 3: TOLAK DONASI */}
            <Dialog
                open={rejectTarget !== null}
                onOpenChange={(open) => !open && setRejectTarget(null)}
            >
                <DialogContent className="border-[#e4eaec] bg-white font-poppins text-slate-800 sm:max-w-md">
                    {rejectTarget && (
                        <form onSubmit={handleRejectSubmit}>
                            <DialogHeader>
                                <DialogTitle className="text-base font-bold text-slate-800">
                                    Tolak Pengajuan Donasi
                                </DialogTitle>
                                <DialogDescription className="text-xs text-slate-500">
                                    Donasi yang ditolak tidak akan menghasilkan
                                    transaksi pemasukan pada buku kas yayasan.
                                </DialogDescription>
                            </DialogHeader>

                            <div className="my-4 space-y-3 text-xs">
                                <div className="rounded-xl border border-rose-200 bg-rose-50/60 p-3">
                                    <p className="font-medium text-slate-700">
                                        {rejectTarget.kode_donasi} —{' '}
                                        {rejectTarget.nama_donatur} (
                                        {formatRupiah(rejectTarget.nominal)})
                                    </p>
                                </div>

                                <div>
                                    <label className="mb-1 block text-xs font-medium text-slate-700">
                                        Alasan Penolakan{' '}
                                        <span className="text-rose-500">*</span>
                                    </label>
                                    <textarea
                                        rows={3}
                                        required
                                        value={
                                            rejectForm.data.catatan_verifikasi
                                        }
                                        onChange={(e) =>
                                            rejectForm.setData(
                                                'catatan_verifikasi',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Tuliskan alasan penolakan (mis. bukti transfer tidak terbaca / dana belum masuk di mutasi rekening)..."
                                        className="w-full rounded-lg border border-[#e4eaec] bg-white px-3 py-2 text-xs text-slate-800 focus:border-[#14bace] focus:ring-2 focus:ring-[#14bace]/20 focus:outline-hidden"
                                    />
                                    {rejectForm.errors.catatan_verifikasi && (
                                        <p className="mt-1 text-xs text-rose-600">
                                            {
                                                rejectForm.errors
                                                    .catatan_verifikasi
                                            }
                                        </p>
                                    )}
                                </div>
                            </div>

                            <DialogFooter className="gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setRejectTarget(null)}
                                    className="border-[#e4eaec] bg-white text-xs font-medium text-slate-600 shadow-none hover:bg-slate-50"
                                >
                                    Batal
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={rejectForm.processing}
                                    className="bg-rose-600 text-xs font-medium text-white shadow-none hover:bg-rose-700"
                                >
                                    {rejectForm.processing
                                        ? 'Memproses...'
                                        : 'Konfirmasi Tolak'}
                                </Button>
                            </DialogFooter>
                        </form>
                    )}
                </DialogContent>
            </Dialog>

            {/* MODAL 4: BATALKAN DONASI TERVERIFIKASI (SUPER ADMIN) */}
            <Dialog
                open={cancelTarget !== null}
                onOpenChange={(open) => !open && setCancelTarget(null)}
            >
                <DialogContent className="border-[#e4eaec] bg-white font-poppins text-slate-800 sm:max-w-md">
                    {cancelTarget && (
                        <form onSubmit={handleCancelSubmit}>
                            <DialogHeader>
                                <DialogTitle className="text-base font-bold text-slate-800">
                                    Batalkan Donasi Terverifikasi (Void)
                                </DialogTitle>
                                <DialogDescription className="text-xs text-slate-500">
                                    Tindakan khusus Super Admin. Transaksi
                                    keuangan terkait tidak dihapus, melainkan
                                    diubah menjadi berstatus{' '}
                                    <strong>VOID</strong> agar saldo kas kembali
                                    akurat dan jejak audit tetap terjaga.
                                </DialogDescription>
                            </DialogHeader>

                            <div className="my-4 space-y-3 text-xs">
                                <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3 text-amber-900">
                                    <p className="font-semibold">
                                        {cancelTarget.kode_donasi} —{' '}
                                        {formatRupiah(cancelTarget.nominal)}
                                    </p>
                                    <p className="mt-0.5 text-[11px] text-amber-800">
                                        Donatur: {cancelTarget.nama_donatur} (
                                        {cancelTarget.jenis_donasi})
                                    </p>
                                </div>

                                <div>
                                    <label className="mb-1 block text-xs font-medium text-slate-700">
                                        Alasan Pembatalan / Audit{' '}
                                        <span className="text-rose-500">*</span>
                                    </label>
                                    <textarea
                                        rows={3}
                                        required
                                        value={
                                            cancelForm.data.catatan_verifikasi
                                        }
                                        onChange={(e) =>
                                            cancelForm.setData(
                                                'catatan_verifikasi',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Tuliskan alasan pembatalan untuk catatan audit buku kas..."
                                        className="w-full rounded-lg border border-[#e4eaec] bg-white px-3 py-2 text-xs text-slate-800 focus:border-[#14bace] focus:ring-2 focus:ring-[#14bace]/20 focus:outline-hidden"
                                    />
                                    {cancelForm.errors.catatan_verifikasi && (
                                        <p className="mt-1 text-xs text-rose-600">
                                            {
                                                cancelForm.errors
                                                    .catatan_verifikasi
                                            }
                                        </p>
                                    )}
                                </div>
                            </div>

                            <DialogFooter className="gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setCancelTarget(null)}
                                    className="border-[#e4eaec] bg-white text-xs font-medium text-slate-600 shadow-none hover:bg-slate-50"
                                >
                                    Kembali
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={cancelForm.processing}
                                    className="bg-rose-600 text-xs font-medium text-white shadow-none hover:bg-rose-700"
                                >
                                    {cancelForm.processing
                                        ? 'Memproses...'
                                        : 'Batalkan & Void Transaksi'}
                                </Button>
                            </DialogFooter>
                        </form>
                    )}
                </DialogContent>
            </Dialog>

            {/* MODAL 5: CATAT DONASI MANUAL (ADMIN) */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="max-h-[90vh] overflow-y-auto border-[#e4eaec] bg-white font-poppins text-slate-800 sm:max-w-lg">
                    <form onSubmit={handleCreateSubmit}>
                        <DialogHeader>
                            <DialogTitle className="text-base font-bold text-slate-800">
                                Catat Pengajuan Donasi Baru
                            </DialogTitle>
                            <DialogDescription className="text-xs text-slate-500">
                                Gunakan formulir ini untuk mencatat konfirmasi
                                donasi yang diterima melalui WhatsApp atau
                                secara langsung. Donasi baru akan berstatus
                                Menunggu Verifikasi.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="my-4 space-y-3.5 text-xs">
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1 block font-medium text-slate-700">
                                        Nama Donatur{' '}
                                        <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={createForm.data.nama_donatur}
                                        onChange={(e) =>
                                            createForm.setData(
                                                'nama_donatur',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Nama lengkap / Hamba Allah"
                                        className="w-full rounded-lg border border-[#e4eaec] bg-white px-3 py-2 text-xs text-slate-800 focus:border-[#14bace] focus:ring-2 focus:ring-[#14bace]/20 focus:outline-hidden"
                                    />
                                    {createForm.errors.nama_donatur && (
                                        <p className="mt-1 text-rose-600">
                                            {createForm.errors.nama_donatur}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-1 block font-medium text-slate-700">
                                        Nomor WhatsApp{' '}
                                        <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        required
                                        value={createForm.data.no_whatsapp}
                                        onChange={(e) =>
                                            createForm.setData(
                                                'no_whatsapp',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="081234567890"
                                        className="w-full rounded-lg border border-[#e4eaec] bg-white px-3 py-2 text-xs text-slate-800 focus:border-[#14bace] focus:ring-2 focus:ring-[#14bace]/20 focus:outline-hidden"
                                    />
                                    {createForm.errors.no_whatsapp && (
                                        <p className="mt-1 text-rose-600">
                                            {createForm.errors.no_whatsapp}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1 block font-medium text-slate-700">
                                        Jenis Program Donasi{' '}
                                        <span className="text-rose-500">*</span>
                                    </label>
                                    <select
                                        value={createForm.data.jenis_donasi}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            createForm.setData((prev) => ({
                                                ...prev,
                                                jenis_donasi: val,
                                                anak_yatim_id:
                                                    JENIS_DENGAN_ANAK.includes(
                                                        val,
                                                    )
                                                        ? prev.anak_yatim_id
                                                        : '',
                                            }));
                                        }}
                                        className="w-full rounded-lg border border-[#e4eaec] bg-white px-3 py-2 text-xs text-slate-800 focus:border-[#14bace] focus:ring-2 focus:ring-[#14bace]/20 focus:outline-hidden"
                                    >
                                        {jenisDonasiList.map((j) => (
                                            <option key={j} value={j}>
                                                {j}
                                            </option>
                                        ))}
                                    </select>
                                    {createForm.errors.jenis_donasi && (
                                        <p className="mt-1 text-rose-600">
                                            {createForm.errors.jenis_donasi}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-1 block font-medium text-slate-700">
                                        Nominal Donasi (Rp){' '}
                                        <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        min="10000"
                                        step="1000"
                                        value={createForm.data.nominal}
                                        onChange={(e) =>
                                            createForm.setData(
                                                'nominal',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="100000"
                                        className="w-full rounded-lg border border-[#e4eaec] bg-white px-3 py-2 text-xs text-slate-800 focus:border-[#14bace] focus:ring-2 focus:ring-[#14bace]/20 focus:outline-hidden"
                                    />
                                    {createForm.errors.nominal && (
                                        <p className="mt-1 text-rose-600">
                                            {createForm.errors.nominal}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {JENIS_DENGAN_ANAK.includes(
                                createForm.data.jenis_donasi,
                            ) && (
                                <div>
                                    <label className="mb-1 block font-medium text-slate-700">
                                        Anak Binaan Tujuan (Opsional)
                                    </label>
                                    <select
                                        value={createForm.data.anak_yatim_id}
                                        onChange={(e) =>
                                            createForm.setData(
                                                'anak_yatim_id',
                                                e.target.value,
                                            )
                                        }
                                        className="w-full rounded-lg border border-[#e4eaec] bg-white px-3 py-2 text-xs text-slate-800 focus:border-[#14bace] focus:ring-2 focus:ring-[#14bace]/20 focus:outline-hidden"
                                    >
                                        <option value="">
                                            -- Alokasi Umum Program --
                                        </option>
                                        {anakYatimList.map((anak) => (
                                            <option
                                                key={anak.id}
                                                value={String(anak.id)}
                                            >
                                                {anak.nama_lengkap} (
                                                {anak.alias}) — {anak.jenjang} •
                                                Kel. {anak.kelurahan}
                                            </option>
                                        ))}
                                    </select>
                                    {createForm.errors.anak_yatim_id && (
                                        <p className="mt-1 text-rose-600">
                                            {createForm.errors.anak_yatim_id}
                                        </p>
                                    )}
                                </div>
                            )}

                            <div>
                                <label className="mb-1 block font-medium text-slate-700">
                                    Rekening Tujuan Transfer{' '}
                                    <span className="text-rose-500">*</span>
                                </label>
                                <select
                                    value={createForm.data.rekening_tujuan}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        const selected = rekeningList.find(
                                            (r) => r.kode === val,
                                        );
                                        createForm.setData((prev) => ({
                                            ...prev,
                                            rekening_tujuan: val,
                                            rekening_id: selected?.id ?? null,
                                        }));
                                    }}
                                    className="w-full rounded-lg border border-[#e4eaec] bg-white px-3 py-2 text-xs text-slate-800 focus:border-[#14bace] focus:ring-2 focus:ring-[#14bace]/20 focus:outline-hidden"
                                >
                                    {rekeningList.map((rek) => (
                                        <option key={rek.kode} value={rek.kode}>
                                            {rek.bank} - {rek.nomor}
                                        </option>
                                    ))}
                                </select>
                                {createForm.errors.rekening_tujuan && (
                                    <p className="mt-1 text-rose-600">
                                        {createForm.errors.rekening_tujuan}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-1 block font-medium text-slate-700">
                                    Unggah Bukti Transfer{' '}
                                    <span className="text-rose-500">*</span>
                                </label>
                                {!createForm.data.bukti_transfer ? (
                                    <label
                                        htmlFor="admin_bukti_transfer"
                                        className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-[#cbd5e1] bg-[#f8fafb] p-4 text-center transition hover:border-[#14bace]"
                                    >
                                        <Upload className="size-4 text-[#087f8c]" />
                                        <span className="text-xs text-slate-600">
                                            Pilih file bukti transfer (JPG, PNG,
                                            WEBP, PDF maks 5 MB)
                                        </span>
                                    </label>
                                ) : (
                                    <div className="flex items-center justify-between rounded-lg border border-[#cbebf0] bg-[#f7fcfd] px-3 py-2">
                                        <div className="flex items-center gap-2 truncate">
                                            <FileCheck2 className="size-4 shrink-0 text-[#087f8c]" />
                                            <span className="truncate font-medium text-slate-700">
                                                {
                                                    createForm.data
                                                        .bukti_transfer.name
                                                }
                                            </span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                createForm.setData(
                                                    'bukti_transfer',
                                                    null,
                                                );
                                                if (createFileRef.current) {
                                                    createFileRef.current.value =
                                                        '';
                                                }
                                            }}
                                            className="text-slate-400 hover:text-rose-600"
                                        >
                                            <X className="size-4" />
                                        </button>
                                    </div>
                                )}
                                <input
                                    ref={createFileRef}
                                    id="admin_bukti_transfer"
                                    type="file"
                                    accept=".jpg,.jpeg,.png,.webp,.pdf,image/jpeg,image/png,image/webp,application/pdf"
                                    onChange={(e) =>
                                        createForm.setData(
                                            'bukti_transfer',
                                            e.target.files?.[0] ?? null,
                                        )
                                    }
                                    className="sr-only"
                                />
                                {createForm.errors.bukti_transfer && (
                                    <p className="mt-1 text-rose-600">
                                        {createForm.errors.bukti_transfer}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-1 block font-medium text-slate-700">
                                    Pesan / Keterangan Donatur (Opsional)
                                </label>
                                <textarea
                                    rows={2}
                                    value={createForm.data.pesan_doa}
                                    onChange={(e) =>
                                        createForm.setData(
                                            'pesan_doa',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Keterangan tambahan..."
                                    className="w-full rounded-lg border border-[#e4eaec] bg-white px-3 py-2 text-xs text-slate-800 focus:border-[#14bace] focus:ring-2 focus:ring-[#14bace]/20 focus:outline-hidden"
                                />
                            </div>
                        </div>

                        <DialogFooter className="gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsCreateOpen(false)}
                                className="border-[#e4eaec] bg-white text-xs font-medium text-slate-600 shadow-none hover:bg-slate-50"
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                disabled={createForm.processing}
                                className="bg-[#14bace] text-xs font-semibold text-white shadow-none hover:bg-[#0fa0ae]"
                            >
                                {createForm.processing
                                    ? 'Menyimpan...'
                                    : 'Simpan Pengajuan Donasi'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

DonasiAdmin.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Pengelolaan Donasi', href: '/admin/donasi' },
    ],
};
