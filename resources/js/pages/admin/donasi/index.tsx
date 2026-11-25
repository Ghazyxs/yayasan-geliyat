import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { BrandSelect } from '@/components/admin/brand-select';
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
    jenjang: string;
    kelurahan: string;
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
    no_whatsapp: string | null;
    jenis_donasi: string;
    anak_yatim_id: number | null;
    rekening_tujuan: string;
    nominal: number;
    pesan_doa: string | null;
    metode_pembayaran?: string | null;
    metode_label?: string | null;
    midtrans_transaction_id?: string | null;
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

interface DonasiAdminProps {
    donasi?: PaginatedDonasi;
    stats?: {
        total: number;
        menunggu: number;
        terverifikasi: number;
        dibatalkan: number;
        total_nominal_terverifikasi: number;
        nominal_menunggu: number;
    };
    filters?: {
        search: string;
        status_verifikasi: string;
        metode_pembayaran: string;
        tanggal_dari: string;
        tanggal_sampai: string;
        tanggal: string;
    };
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
    dibatalkan: 0,
    total_nominal_terverifikasi: 0,
    nominal_menunggu: 0,
};

const DEFAULT_FILTERS = {
    search: '',
    status_verifikasi: '',
    metode_pembayaran: '',
    tanggal_dari: '',
    tanggal_sampai: '',
    tanggal: '',
};

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
    menunggu: {
        label: 'Menunggu Pembayaran / Verifikasi',
        className: 'border-amber-200 bg-amber-50/90 text-amber-700',
    },
    terverifikasi: {
        label: 'Terverifikasi (Lunas)',
        className: 'border-emerald-200 bg-emerald-50/90 text-emerald-700',
    },
    dibatalkan: {
        label: 'Dibatalkan / Kedaluwarsa',
        className: 'border-slate-200 bg-slate-100 text-slate-600',
    },
    ditolak: {
        label: 'Gagal',
        className: 'border-slate-200 bg-slate-100 text-slate-600',
    },
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
    const [metodeFilter, setMetodeFilter] = useState(
        filters.metode_pembayaran ?? '',
    );
    const [tanggalDari, setTanggalDari] = useState(filters.tanggal_dari ?? '');
    const [tanggalSampai, setTanggalSampai] = useState(
        filters.tanggal_sampai ?? '',
    );

    // Modals state
    const [detailItem, setDetailItem] = useState<DonasiItem | null>(null);
    const [verifyTarget, setVerifyTarget] = useState<DonasiItem | null>(null);
    const [cancelTarget, setCancelTarget] = useState<DonasiItem | null>(null);
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    // Form Create Donasi Manual (Admin)
    const createForm = useForm<{
        nama_donatur: string;
        no_whatsapp: string;
        anak_yatim_id: string;
        nominal: string;
        pesan_doa: string;
    }>({
        nama_donatur: '',
        no_whatsapp: '',
        anak_yatim_id: '',
        nominal: '',
        pesan_doa: '',
    });

    // Form Verifikasi
    const verifyForm = useForm<{ catatan_verifikasi: string }>({
        catatan_verifikasi: '',
    });

    // Form Batalkan (Super Admin)
    const cancelForm = useForm<{ catatan_verifikasi: string }>({
        catatan_verifikasi: '',
    });

    useEffect(() => {
        setSearchInput(filters.search ?? '');
        setStatusFilter(filters.status_verifikasi ?? '');
        setMetodeFilter(filters.metode_pembayaran ?? '');
        setTanggalDari(filters.tanggal_dari ?? '');
        setTanggalSampai(filters.tanggal_sampai ?? '');
    }, [filters]);

    const applyFilters = (
        overrides: Partial<{
            search: string;
            status_verifikasi: string;
            metode_pembayaran: string;
            tanggal_dari: string;
            tanggal_sampai: string;
        }> = {},
    ) => {
        const next = {
            search: overrides.search ?? searchInput,
            status_verifikasi: overrides.status_verifikasi ?? statusFilter,
            metode_pembayaran: overrides.metode_pembayaran ?? metodeFilter,
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
        setMetodeFilter('');
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
        metodeFilter !== '' ||
        tanggalDari !== '' ||
        tanggalSampai !== '';

    const openCreateModal = () => {
        createForm.reset();
        createForm.clearErrors();
        setIsCreateOpen(true);
    };

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post('/admin/donasi', {
            preserveScroll: true,
            onSuccess: () => {
                setIsCreateOpen(false);
                createForm.reset();
            },
        });
    };

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
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50/90 px-4 py-3 text-sm text-emerald-800 shadow-2xs">
                        {pageProps.flash.success}
                    </div>
                )}

                {pageProps.flash?.error && (
                    <div className="rounded-xl border border-rose-200 bg-rose-50/90 px-4 py-3 text-sm text-rose-800 shadow-2xs">
                        {pageProps.flash.error}
                    </div>
                )}

                {/* Header Section */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">
                            Pengelolaan & Verifikasi Donasi
                        </h1>
                        <p className="mt-1 text-sm text-slate-500">
                            Pantau transaksi donasi Midtrans, pencatatan donasi
                            manual, dan integrasi otomatis ke buku kas yayasan.
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
                                className="border-amber-200 bg-amber-50/80 text-xs font-semibold text-amber-800 shadow-none hover:bg-amber-100/80"
                            >
                                {stats.menunggu} Menunggu Verifikasi
                            </Button>
                        )}

                        {permissions.can_create && (
                            <Button
                                type="button"
                                onClick={openCreateModal}
                                className="bg-[#14bace] text-xs font-semibold text-white shadow-xs transition hover:bg-[#0fa0ae]"
                            >
                                + Catat Donasi Manual
                            </Button>
                        )}
                    </div>
                </div>

                {/* Stat Cards (Tanpa Donasi Ditolak) */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-xl border border-t-4 border-[#e4eaec] border-t-[#14bace] bg-white p-4 shadow-2xs">
                        <span className="text-xs font-medium text-slate-500">
                            Total Donasi Terverifikasi
                        </span>
                        <p className="mt-2 text-xl font-bold text-slate-800">
                            {formatRupiah(stats.total_nominal_terverifikasi)}
                        </p>
                        <p className="mt-1 text-[11px] text-emerald-700">
                            {stats.terverifikasi} transaksi sah tercatat di kas
                        </p>
                    </div>

                    <div className="rounded-xl border border-t-4 border-[#e4eaec] border-t-amber-400 bg-white p-4 shadow-2xs">
                        <span className="text-xs font-medium text-slate-500">
                            Menunggu Pembayaran / Verifikasi
                        </span>
                        <p className="mt-2 text-xl font-bold text-slate-800">
                            {stats.menunggu}{' '}
                            <span className="text-sm font-medium text-slate-500">
                                Transaksi
                            </span>
                        </p>
                        <p className="mt-1 text-[11px] text-amber-700">
                            Senilai {formatRupiah(stats.nominal_menunggu)}{' '}
                            (belum masuk kas)
                        </p>
                    </div>

                    <div className="rounded-xl border border-t-4 border-[#e4eaec] border-t-slate-400 bg-white p-4 shadow-2xs">
                        <span className="text-xs font-medium text-slate-500">
                            Dibatalkan / Void
                        </span>
                        <p className="mt-2 text-xl font-bold text-slate-800">
                            {stats.dibatalkan}{' '}
                            <span className="text-sm font-medium text-slate-500">
                                Riwayat
                            </span>
                        </p>
                        <p className="mt-1 text-[11px] text-slate-400">
                            Transaksi kas terkait berstatus VOID atau
                            kedaluwarsa
                        </p>
                    </div>
                </div>

                {/* Filter & Search Bar */}
                <div className="rounded-xl border border-[#e4eaec] bg-white p-4 shadow-2xs">
                    <form
                        onSubmit={handleSearchSubmit}
                        className="grid grid-cols-1 gap-3 md:grid-cols-12"
                    >
                        <div className="flex gap-2 md:col-span-4">
                            <input
                                type="text"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                placeholder="Cari kode donasi, nama donatur, email, WA, anak..."
                                className="h-9 w-full rounded-lg border border-[#cbebf0] bg-white px-3 text-xs text-slate-800 placeholder:text-slate-400 focus:border-[#14bace] focus:ring-2 focus:ring-[#14bace]/20 focus:outline-hidden"
                            />
                            <Button
                                type="submit"
                                className="h-9 shrink-0 bg-[#087f8c] px-3.5 text-xs font-semibold text-white shadow-none hover:bg-[#066570]"
                            >
                                Cari
                            </Button>
                        </div>

                        <div className="md:col-span-2">
                            <BrandSelect
                                ariaLabel="Filter Status Verifikasi"
                                value={statusFilter}
                                onValueChange={(val) => {
                                    setStatusFilter(val);
                                    applyFilters({ status_verifikasi: val });
                                }}
                                options={[
                                    { value: '', label: 'Semua Status' },
                                    { value: 'menunggu', label: 'Menunggu' },
                                    {
                                        value: 'terverifikasi',
                                        label: 'Terverifikasi',
                                    },
                                    {
                                        value: 'dibatalkan',
                                        label: 'Dibatalkan',
                                    },
                                ]}
                            />
                        </div>

                        <div className="md:col-span-2">
                            <BrandSelect
                                ariaLabel="Filter Metode Pembayaran"
                                value={metodeFilter}
                                onValueChange={(val) => {
                                    setMetodeFilter(val);
                                    applyFilters({ metode_pembayaran: val });
                                }}
                                options={[
                                    { value: '', label: 'Semua Metode' },
                                    {
                                        value: 'midtrans',
                                        label: 'Midtrans (Online)',
                                    },
                                    {
                                        value: 'manual',
                                        label: 'Donasi Manual',
                                    },
                                ]}
                            />
                        </div>

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
                                className="h-9 w-full rounded-lg border border-[#cbebf0] bg-[#f7fcfd] px-2.5 text-xs text-[#087f8c] focus:border-[#14bace] focus:ring-2 focus:ring-[#14bace]/20 focus:outline-hidden"
                            />
                        </div>

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
                                className="h-9 w-full rounded-lg border border-[#cbebf0] bg-[#f7fcfd] px-2.5 text-xs text-[#087f8c] focus:border-[#14bace] focus:ring-2 focus:ring-[#14bace]/20 focus:outline-hidden"
                            />

                            {hasActiveFilters && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleResetFilters}
                                    className="h-9 shrink-0 border-[#cbebf0] bg-[#f7fcfd] px-2.5 text-xs font-medium text-[#087f8c] shadow-none hover:bg-[#e8f8fa]"
                                >
                                    Reset
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
                                        Alokasi & Catatan
                                    </th>
                                    <th className="px-4 py-3.5">
                                        Nominal & Pembayaran
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
                                            <div className="mx-auto flex max-w-sm flex-col items-center gap-1.5">
                                                <p className="font-semibold text-slate-700">
                                                    Belum ada data donasi
                                                </p>
                                                <p className="text-xs text-slate-400">
                                                    Transaksi donasi Midtrans
                                                    dan catatan manual sesuai
                                                    filter akan muncul di sini.
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
                                                    <div className="mt-1 text-[11px] text-slate-400">
                                                        {item.created_at_formatted ??
                                                            '-'}
                                                    </div>
                                                </td>

                                                {/* Donatur */}
                                                <td className="px-4 py-3.5 align-top">
                                                    <div className="font-semibold text-slate-800">
                                                        {item.nama_donatur}
                                                    </div>
                                                    {item.email_donatur && (
                                                        <div className="mt-1 max-w-[200px] truncate text-[11px] text-slate-500">
                                                            {item.email_donatur}
                                                        </div>
                                                    )}
                                                    {item.no_whatsapp && (
                                                        <div className="mt-0.5 text-[11px] text-slate-500">
                                                            WA:{' '}
                                                            {item.no_whatsapp}
                                                        </div>
                                                    )}
                                                </td>

                                                {/* Alokasi */}
                                                <td className="px-4 py-3.5 align-top">
                                                    {item.anak_yatim ? (
                                                        <div className="font-medium text-[#087f8c]">
                                                            {
                                                                item.anak_yatim
                                                                    .nama_lengkap
                                                            }
                                                            <span className="block text-[11px] font-normal text-slate-400">
                                                                {
                                                                    item
                                                                        .anak_yatim
                                                                        .jenjang
                                                                }{' '}
                                                                • Kel.{' '}
                                                                {
                                                                    item
                                                                        .anak_yatim
                                                                        .kelurahan
                                                                }
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <div className="text-[11px] text-slate-500">
                                                            Alokasi Umum Yayasan
                                                        </div>
                                                    )}
                                                    {item.pesan_doa && (
                                                        <p className="mt-1 line-clamp-2 max-w-[220px] text-[11px] text-slate-400">
                                                            "{item.pesan_doa}"
                                                        </p>
                                                    )}
                                                </td>

                                                {/* Nominal & Metode Pembayaran */}
                                                <td className="px-4 py-3.5 align-top">
                                                    <div className="font-bold text-slate-800">
                                                        {formatRupiah(
                                                            item.nominal,
                                                        )}
                                                    </div>
                                                    <div className="mt-1">
                                                        {item.metode_pembayaran ===
                                                        'midtrans' ? (
                                                            <span className="inline-flex items-center rounded bg-[#e8f8fa] px-2 py-0.5 text-[10px] font-semibold text-[#087f8c]">
                                                                Midtrans
                                                                {item.midtrans_payment_type
                                                                    ? ` • ${item.midtrans_payment_type.toUpperCase().replace(/_/g, ' ')}`
                                                                    : ''}
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center rounded bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                                                                {item.rekening_tujuan ||
                                                                    'Donasi Manual'}
                                                            </span>
                                                        )}
                                                    </div>
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
                                                            <span className="font-mono text-slate-600">
                                                                {
                                                                    item
                                                                        .transaksi
                                                                        .kode_transaksi
                                                                }
                                                            </span>
                                                            <span
                                                                className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase ${
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
                                                            className="h-7 border-[#cbebf0] bg-[#f7fcfd] px-2.5 text-[11px] font-medium text-[#087f8c] shadow-none hover:bg-[#e8f8fa]"
                                                        >
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
                                                                    Verifikasi
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
                                                        : 'border-[#cbebf0] bg-[#f7fcfd] text-[#087f8c] hover:bg-[#e8f8fa]'
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

            {/* MODAL 1: DETAIL TRANSAKSI DONASI */}
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
                                            ]?.className ??
                                            STATUS_BADGE.menunggu.className
                                        }`}
                                    >
                                        {STATUS_BADGE[
                                            detailItem.status_verifikasi
                                        ]?.label ??
                                            detailItem.status_verifikasi}
                                    </span>
                                </div>
                                <DialogTitle className="mt-1 text-lg font-bold text-slate-800">
                                    Rincian Transaksi Donasi
                                </DialogTitle>
                                <DialogDescription className="text-xs text-slate-500">
                                    Dicatat pada{' '}
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
                                            Kontak Donatur
                                        </span>
                                        <p className="mt-0.5 font-semibold break-all text-slate-800">
                                            {detailItem.email_donatur ||
                                                detailItem.no_whatsapp ||
                                                '-'}
                                        </p>
                                        {detailItem.email_donatur &&
                                            detailItem.no_whatsapp && (
                                                <p className="mt-0.5 text-[11px] text-slate-500">
                                                    WhatsApp:{' '}
                                                    {detailItem.no_whatsapp}
                                                </p>
                                            )}
                                    </div>
                                    <div>
                                        <span className="text-[11px] text-slate-400">
                                            Nominal Donasi
                                        </span>
                                        <p className="mt-0.5 text-sm font-bold text-slate-800">
                                            {formatRupiah(detailItem.nominal)}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-[11px] text-slate-400">
                                            Jalur Pembayaran
                                        </span>
                                        <p className="mt-0.5 font-semibold text-[#087f8c]">
                                            {detailItem.metode_pembayaran ===
                                            'midtrans'
                                                ? `Midtrans (${detailItem.midtrans_payment_type?.toUpperCase().replace(/_/g, ' ') || 'Snap Online'})`
                                                : detailItem.rekening_tujuan ||
                                                  'Donasi Manual'}
                                        </p>
                                        {detailItem.midtrans_transaction_id && (
                                            <p className="mt-0.5 font-mono text-[10px] text-slate-500">
                                                ID Midtrans:{' '}
                                                {
                                                    detailItem.midtrans_transaction_id
                                                }
                                            </p>
                                        )}
                                    </div>
                                    {detailItem.paid_at && (
                                        <div className="sm:col-span-2">
                                            <span className="text-[11px] text-slate-400">
                                                Waktu Pelunasan
                                            </span>
                                            <p className="mt-0.5 font-medium text-emerald-700">
                                                {detailItem.paid_at}
                                            </p>
                                        </div>
                                    )}
                                    {detailItem.pesan_doa && (
                                        <div className="sm:col-span-2">
                                            <span className="text-[11px] text-slate-400">
                                                Pesan / Doa Donatur
                                            </span>
                                            <p className="mt-0.5 text-slate-700">
                                                {detailItem.pesan_doa}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Alokasi Anak Yatim (Jika Ada) */}
                                {detailItem.anak_yatim && (
                                    <div className="rounded-xl border border-[#cbebf0] bg-[#f7fcfd] p-4">
                                        <div className="text-xs font-semibold text-[#087f8c]">
                                            Alokasi Anak Binaan Tujuan
                                        </div>
                                        <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                                            <div>
                                                <span className="text-[11px] text-slate-400">
                                                    Nama Lengkap
                                                </span>
                                                <p className="font-semibold text-slate-800">
                                                    {
                                                        detailItem.anak_yatim
                                                            .nama_lengkap
                                                    }
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
                                                    • Kel.{' '}
                                                    {
                                                        detailItem.anak_yatim
                                                            .kelurahan
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Bukti Transfer (untuk riwayat lama yang memiliki berkas) */}
                                {detailItem.has_bukti_transfer &&
                                    detailItem.bukti_transfer_url && (
                                        <div className="rounded-xl border border-[#e4eaec] bg-white p-4">
                                            <div className="mb-2 flex items-center justify-between">
                                                <span className="font-semibold text-slate-700">
                                                    Lampiran Bukti Transfer
                                                </span>
                                                <a
                                                    href={
                                                        detailItem.bukti_transfer_url
                                                    }
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="font-semibold text-[#087f8c] underline hover:text-[#14bace]"
                                                >
                                                    Buka di Tab Baru
                                                </a>
                                            </div>
                                            {!detailItem.bukti_transfer_is_pdf && (
                                                <img
                                                    src={
                                                        detailItem.bukti_transfer_url
                                                    }
                                                    alt="Bukti Transfer"
                                                    className="max-h-64 w-full rounded-lg border border-[#e4eaec] object-contain"
                                                />
                                            )}
                                        </div>
                                    )}

                                {/* Transaksi Buku Kas & Audit */}
                                {(detailItem.transaksi ||
                                    detailItem.catatan_verifikasi) && (
                                    <div className="rounded-xl border border-[#e4eaec] bg-white p-4">
                                        <span className="font-semibold text-slate-700">
                                            Integrasi Buku Kas & Catatan Audit
                                        </span>
                                        <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                                            {detailItem.transaksi && (
                                                <div>
                                                    <span className="text-[11px] text-slate-400">
                                                        Kode Transaksi Kas
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
                                                            className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase ${
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
                                    Pastikan dana telah diterima yayasan sebelum
                                    melakukan verifikasi ke buku kas.
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
                                        placeholder="Contoh: Dana diterima sesuai catatan bendahara..."
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

            {/* MODAL 3: BATALKAN DONASI TERVERIFIKASI (SUPER ADMIN) */}
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
                                    <strong>VOID</strong> agar saldo kas akurat
                                    dan jejak audit tetap terjaga.
                                </DialogDescription>
                            </DialogHeader>

                            <div className="my-4 space-y-3 text-xs">
                                <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3 text-amber-900">
                                    <p className="font-semibold">
                                        {cancelTarget.kode_donasi} —{' '}
                                        {formatRupiah(cancelTarget.nominal)}
                                    </p>
                                    <p className="mt-0.5 text-[11px] text-amber-800">
                                        Donatur: {cancelTarget.nama_donatur}
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

            {/* MODAL 4: CATAT DONASI MANUAL (ADMIN) */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="max-h-[90vh] overflow-y-auto border-[#e4eaec] bg-white font-poppins text-slate-800 sm:max-w-lg">
                    <form onSubmit={handleCreateSubmit}>
                        <DialogHeader>
                            <DialogTitle className="text-base font-bold text-slate-800">
                                Catat Donasi Manual
                            </DialogTitle>
                            <DialogDescription className="text-xs text-slate-500">
                                Catat penerimaan donasi secara langsung atau
                                melalui konfirmasi pribadi. Donasi baru akan
                                berstatus Menunggu Verifikasi.
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
                                        Nomor WhatsApp (Opsional)
                                    </label>
                                    <input
                                        type="tel"
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

                            <div>
                                <label className="mb-1 block font-medium text-slate-700">
                                    Nominal Donasi (Rp){' '}
                                    <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    required
                                    min="1000"
                                    step="500"
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
                                    : 'Simpan Donasi'}
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
