import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { BrandSelect } from '@/components/admin/brand-select';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

interface RingkasanPos {
    masuk: number;
    keluar: number;
    saldo: number;
}

interface RingkasanKonsolidasi {
    total_pemasukan: number;
    total_pengeluaran: number;
    saldo_bersih: number;
    belum_terklasifikasi: number;
}

interface RingkasanKeuangan {
    donasi: RingkasanPos;
    operasional: RingkasanPos;
    konsolidasi: RingkasanKonsolidasi;
}

interface TransaksiItem {
    id: number;
    kode_transaksi: string;
    tipe: 'pemasukan' | 'pengeluaran';
    sumber_dana: 'donasi' | 'operasional' | null;
    sumber_dana_label?: string;
    kategori: string;
    nominal: number;
    tanggal_transaksi: string;
    tanggal_formatted?: string;
    status_transaksi: 'valid' | 'void';
    keterangan: string;
    has_bukti_nota?: boolean;
    bukti_nota_url?: string | null;
    bukti_nota_is_pdf?: boolean;
    created_at_formatted?: string | null;
    pencatat?: { id: number; name: string } | null;
    donasi?: { id: number; kode_donasi: string; nama_donatur: string } | null;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedTransaksi {
    data: TransaksiItem[];
    current_page: number;
    last_page: number;
    per_page?: number;
    total: number;
    from?: number | null;
    to?: number | null;
    links?: PaginationLink[];
}

interface KeuanganStats {
    total_pemasukan: number;
    total_pengeluaran: number;
    saldo_kas: number;
    jumlah_pemasukan: number;
    jumlah_pengeluaran: number;
}

interface KeuanganFilters {
    search: string;
    tipe: string;
    sumber_dana: string;
    tanggal_dari: string;
    tanggal_sampai: string;
    tanggal: string;
}

interface KeuanganAdminProps {
    ringkasan?: RingkasanKeuangan;
    stats?: KeuanganStats;
    transaksiList?: PaginatedTransaksi;
    filters?: KeuanganFilters;
}

const DEFAULT_PAGINATION: PaginatedTransaksi = {
    data: [],
    current_page: 1,
    last_page: 1,
    total: 0,
    from: null,
    to: null,
    links: [],
};

const DEFAULT_FILTERS: KeuanganFilters = {
    search: '',
    tipe: '',
    sumber_dana: '',
    tanggal_dari: '',
    tanggal_sampai: '',
    tanggal: '',
};

function formatRupiah(val: number): string {
    return `Rp ${Number(val || 0).toLocaleString('id-ID')}`;
}

function decodePaginationLabel(label: string): string {
    return label
        .replace(/&laquo;\s*Previous/i, 'Sebelumnya')
        .replace(/Next\s*&raquo;/i, 'Berikutnya')
        .replace(/&laquo;/g, '«')
        .replace(/&raquo;/g, '»');
}

export default function KeuanganAdmin({
    ringkasan = {
        donasi: { masuk: 0, keluar: 0, saldo: 0 },
        operasional: { masuk: 0, keluar: 0, saldo: 0 },
        konsolidasi: {
            total_pemasukan: 0,
            total_pengeluaran: 0,
            saldo_bersih: 0,
            belum_terklasifikasi: 0,
        },
    },
    stats,
    transaksiList = DEFAULT_PAGINATION,
    filters = DEFAULT_FILTERS,
}: KeuanganAdminProps) {
    const pageProps = usePage<{
        flash?: { success?: string | null; error?: string | null };
    }>().props;

    const summaryStats: KeuanganStats = stats ?? {
        total_pemasukan: ringkasan.konsolidasi.total_pemasukan,
        total_pengeluaran: ringkasan.konsolidasi.total_pengeluaran,
        saldo_kas: ringkasan.konsolidasi.saldo_bersih,
        jumlah_pemasukan: 0,
        jumlah_pengeluaran: 0,
    };

    // Filter state
    const [searchInput, setSearchInput] = useState(filters.search ?? '');
    const [tipeFilter, setTipeFilter] = useState(filters.tipe ?? '');
    const [tanggalDari, setTanggalDari] = useState(filters.tanggal_dari ?? '');
    const [tanggalSampai, setTanggalSampai] = useState(
        filters.tanggal_sampai ?? '',
    );

    // Modals
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [detailItem, setDetailItem] = useState<TransaksiItem | null>(null);
    const buktiInputRef = useRef<HTMLInputElement | null>(null);

    const form = useForm<{
        tipe: 'pemasukan' | 'pengeluaran';
        sumber_dana: 'donasi' | 'operasional';
        kategori: string;
        nominal: string;
        tanggal_transaksi: string;
        keterangan: string;
        bukti_nota: File | null;
    }>({
        tipe: 'pengeluaran',
        sumber_dana: 'operasional',
        kategori: '',
        nominal: '',
        tanggal_transaksi: new Date().toISOString().split('T')[0],
        keterangan: '',
        bukti_nota: null,
    });

    useEffect(() => {
        setSearchInput(filters.search ?? '');
        setTipeFilter(filters.tipe ?? '');
        setTanggalDari(filters.tanggal_dari ?? '');
        setTanggalSampai(filters.tanggal_sampai ?? '');
    }, [filters]);

    useEffect(() => {
        if (pageProps.flash?.success) {
            toast.success(pageProps.flash.success);
        } else if (pageProps.flash?.error) {
            toast.error(pageProps.flash.error);
        }
    }, [pageProps.flash]);

    const applyFilters = (
        overrides: Partial<{
            search: string;
            tipe: string;
            tanggal_dari: string;
            tanggal_sampai: string;
        }> = {},
    ) => {
        const next = {
            search: overrides.search ?? searchInput,
            tipe: overrides.tipe ?? tipeFilter,
            tanggal_dari: overrides.tanggal_dari ?? tanggalDari,
            tanggal_sampai: overrides.tanggal_sampai ?? tanggalSampai,
        };

        const query: Record<string, string> = {};
        Object.entries(next).forEach(([key, val]) => {
            if (val && val.trim() !== '') {
                query[key] = val.trim();
            }
        });

        router.get('/admin/keuangan', query, {
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
        setTipeFilter('');
        setTanggalDari('');
        setTanggalSampai('');
        router.get(
            '/admin/keuangan',
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
        tipeFilter !== '' ||
        tanggalDari !== '' ||
        tanggalSampai !== '';

    const openModalWithTipe = (
        tipe: 'pemasukan' | 'pengeluaran',
        sumber: 'donasi' | 'operasional' = 'operasional',
    ) => {
        form.clearErrors();
        if (buktiInputRef.current) {
            buktiInputRef.current.value = '';
        }
        form.setData({
            tipe,
            sumber_dana: sumber,
            kategori: '',
            nominal: '',
            tanggal_transaksi: new Date().toISOString().split('T')[0],
            keterangan: '',
            bukti_nota: null,
        });
        setIsModalOpen(true);
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post('/admin/transaksi', {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setIsModalOpen(false);
                form.reset();
                if (buktiInputRef.current) {
                    buktiInputRef.current.value = '';
                }
            },
        });
    };

    return (
        <>
            <Head title="Pengelolaan Keuangan Yayasan" />

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

                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <span className="mb-2 inline-block rounded-md bg-[#e8f8fa] px-2.5 py-1 text-xs font-semibold text-[#087f8c]">
                            Keuangan Yayasan (Super Admin)
                        </span>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">
                            Pengelolaan Keuangan Yayasan
                        </h1>
                        <p className="mt-1 text-sm text-slate-500">
                            Catatan pemasukan, pengeluaran, dan riwayat
                            transaksi keuangan yayasan secara jelas dan
                            transparan.
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2.5">
                        <Button
                            type="button"
                            onClick={() =>
                                openModalWithTipe('pemasukan', 'operasional')
                            }
                            className="bg-[#14bace] text-xs font-semibold text-white shadow-xs transition hover:bg-[#0fa0ae]"
                        >
                            + Catat Pemasukan
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                                openModalWithTipe('pengeluaran', 'operasional')
                            }
                            className="border-rose-200 bg-white text-xs font-semibold text-rose-600 shadow-none hover:bg-rose-50 hover:text-rose-700"
                        >
                            + Catat Pengeluaran
                        </Button>
                    </div>
                </div>

                {/* Ringkasan Keuangan Sederhana (3 Kartu) */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-xl border border-t-4 border-[#e4eaec] border-t-emerald-500 bg-white p-5 shadow-2xs">
                        <span className="text-xs font-medium text-slate-500">
                            Total Pemasukan
                        </span>
                        <p className="mt-2 text-2xl font-bold text-emerald-700">
                            + {formatRupiah(summaryStats.total_pemasukan)}
                        </p>
                        <p className="mt-1 text-[11px] text-slate-400">
                            {summaryStats.jumlah_pemasukan} transaksi pemasukan
                            tercatat
                        </p>
                    </div>

                    <div className="rounded-xl border border-t-4 border-[#e4eaec] border-t-rose-500 bg-white p-5 shadow-2xs">
                        <span className="text-xs font-medium text-slate-500">
                            Total Pengeluaran
                        </span>
                        <p className="mt-2 text-2xl font-bold text-rose-600">
                            - {formatRupiah(summaryStats.total_pengeluaran)}
                        </p>
                        <p className="mt-1 text-[11px] text-slate-400">
                            {summaryStats.jumlah_pengeluaran} transaksi
                            pengeluaran tercatat
                        </p>
                    </div>

                    <div className="rounded-xl border border-t-4 border-[#cbebf0] border-t-[#14bace] bg-white p-5 shadow-2xs">
                        <span className="text-xs font-semibold text-[#087f8c]">
                            Saldo Kas Saat Ini
                        </span>
                        <p className="mt-2 text-2xl font-bold text-slate-800">
                            {formatRupiah(summaryStats.saldo_kas)}
                        </p>
                        <p className="mt-1 text-[11px] text-slate-500">
                            Selisih pemasukan dan pengeluaran aktif yayasan
                        </p>
                    </div>
                </div>

                {/* Section Riwayat Transaksi */}
                <div className="flex flex-col gap-4">
                    <div>
                        <h2 className="text-base font-bold text-slate-800">
                            Riwayat Transaksi Keuangan
                        </h2>
                        <p className="text-xs text-slate-500">
                            Seluruh pemasukan donasi, pemasukan lainnya, dan
                            pengeluaran operasional yayasan.
                        </p>
                    </div>

                    {/* Filter & Search Bar */}
                    <div className="rounded-xl border border-[#e4eaec] bg-white p-4 shadow-2xs">
                        <form
                            onSubmit={handleSearchSubmit}
                            className="grid grid-cols-1 gap-3 md:grid-cols-12"
                        >
                            <div className="flex gap-2 md:col-span-5">
                                <input
                                    type="text"
                                    value={searchInput}
                                    onChange={(e) =>
                                        setSearchInput(e.target.value)
                                    }
                                    placeholder="Cari kode transaksi, keperluan, keterangan, atau donatur..."
                                    className="h-9 w-full rounded-lg border border-[#cbebf0] bg-white px-3 text-xs text-slate-800 placeholder:text-slate-400 focus:border-[#14bace] focus:ring-2 focus:ring-[#14bace]/20 focus:outline-hidden"
                                />
                                <Button
                                    type="submit"
                                    className="h-9 shrink-0 bg-[#087f8c] px-4 text-xs font-semibold text-white shadow-none hover:bg-[#066570]"
                                >
                                    Cari
                                </Button>
                            </div>

                            <div className="md:col-span-3">
                                <BrandSelect
                                    ariaLabel="Filter Jenis Transaksi"
                                    value={tipeFilter}
                                    onValueChange={(val) => {
                                        setTipeFilter(val);
                                        applyFilters({ tipe: val });
                                    }}
                                    options={[
                                        {
                                            value: '',
                                            label: 'Semua Jenis Transaksi',
                                        },
                                        {
                                            value: 'pemasukan',
                                            label: 'Pemasukan',
                                        },
                                        {
                                            value: 'pengeluaran',
                                            label: 'Pengeluaran',
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
                                        <th className="px-4 py-3.5">
                                            Jenis Transaksi
                                        </th>
                                        <th className="px-4 py-3.5">
                                            Keperluan & Keterangan
                                        </th>
                                        <th className="px-4 py-3.5">Nominal</th>
                                        <th className="px-4 py-3.5">Status</th>
                                        <th className="px-4 py-3.5 text-right">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#e4eaec]">
                                    {transaksiList.data.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={6}
                                                className="px-4 py-12 text-center text-sm text-slate-500"
                                            >
                                                <div className="mx-auto flex max-w-sm flex-col items-center gap-1.5">
                                                    <p className="font-semibold text-slate-700">
                                                        {hasActiveFilters
                                                            ? 'Tidak ada transaksi yang sesuai filter'
                                                            : 'Belum ada catatan transaksi'}
                                                    </p>
                                                    <p className="text-xs text-slate-400">
                                                        {hasActiveFilters
                                                            ? 'Coba ubah kata kunci pencarian, jenis transaksi, atau rentang tanggal.'
                                                            : 'Pemasukan dari donasi serta catatan pemasukan/pengeluaran manual akan muncul di sini.'}
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        transaksiList.data.map((item) => {
                                            const isPemasukan =
                                                item.tipe === 'pemasukan';
                                            return (
                                                <tr
                                                    key={item.id}
                                                    className="transition hover:bg-slate-50/70"
                                                >
                                                    <td className="px-4 py-3.5 align-top">
                                                        <div className="font-mono font-bold text-slate-800">
                                                            {
                                                                item.kode_transaksi
                                                            }
                                                        </div>
                                                        <div className="mt-1 text-[11px] text-slate-400">
                                                            {item.tanggal_formatted ||
                                                                item.tanggal_transaksi}
                                                        </div>
                                                    </td>

                                                    <td className="px-4 py-3.5 align-top">
                                                        <span
                                                            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${
                                                                isPemasukan
                                                                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                                                                    : 'border-rose-200 bg-rose-50 text-rose-700'
                                                            }`}
                                                        >
                                                            {isPemasukan
                                                                ? 'Pemasukan (Dana Masuk)'
                                                                : 'Pengeluaran (Dana Keluar)'}
                                                        </span>
                                                        <div className="mt-1 text-[11px] text-slate-500">
                                                            {item.sumber_dana_label ||
                                                                (item.sumber_dana ===
                                                                'donasi'
                                                                    ? 'Dana Donasi'
                                                                    : 'Dana Operasional')}
                                                        </div>
                                                    </td>

                                                    <td className="px-4 py-3.5 align-top">
                                                        <div className="font-semibold text-slate-800">
                                                            {item.kategori}
                                                        </div>
                                                        <p className="mt-0.5 line-clamp-2 max-w-sm text-[11px] text-slate-500">
                                                            {item.keterangan}
                                                        </p>
                                                        {item.donasi && (
                                                            <div className="mt-1 text-[11px] font-medium text-[#087f8c]">
                                                                Donasi:{' '}
                                                                {
                                                                    item.donasi
                                                                        .kode_donasi
                                                                }{' '}
                                                                (
                                                                {
                                                                    item.donasi
                                                                        .nama_donatur
                                                                }
                                                                )
                                                            </div>
                                                        )}
                                                    </td>

                                                    <td className="px-4 py-3.5 align-top">
                                                        <span
                                                            className={`text-sm font-bold ${
                                                                isPemasukan
                                                                    ? 'text-emerald-700'
                                                                    : 'text-rose-600'
                                                            }`}
                                                        >
                                                            {isPemasukan
                                                                ? '+'
                                                                : '-'}{' '}
                                                            {formatRupiah(
                                                                item.nominal,
                                                            )}
                                                        </span>
                                                    </td>

                                                    <td className="px-4 py-3.5 align-top">
                                                        <span
                                                            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${
                                                                item.status_transaksi ===
                                                                'valid'
                                                                    ? 'border-emerald-200 bg-emerald-50/90 text-emerald-700'
                                                                    : 'border-slate-200 bg-slate-100 text-slate-600 line-through'
                                                            }`}
                                                        >
                                                            {item.status_transaksi ===
                                                            'valid'
                                                                ? 'Tercatat'
                                                                : 'Dibatalkan'}
                                                        </span>
                                                    </td>

                                                    <td className="px-4 py-3.5 text-right align-top">
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
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Footer */}
                        {transaksiList.total > 0 && (
                            <div className="flex flex-col items-center justify-between gap-3 border-t border-[#e4eaec] bg-[#f8fafb] px-4 py-3 text-xs text-slate-500 sm:flex-row">
                                <div>
                                    Menampilkan{' '}
                                    <span className="font-semibold text-slate-700">
                                        {transaksiList.from ?? 0}
                                    </span>{' '}
                                    –{' '}
                                    <span className="font-semibold text-slate-700">
                                        {transaksiList.to ?? 0}
                                    </span>{' '}
                                    dari{' '}
                                    <span className="font-semibold text-slate-700">
                                        {transaksiList.total}
                                    </span>{' '}
                                    transaksi
                                </div>

                                {transaksiList.last_page > 1 &&
                                    transaksiList.links && (
                                        <div className="flex flex-wrap items-center gap-1">
                                            {transaksiList.links.map(
                                                (link, idx) => {
                                                    const label =
                                                        decodePaginationLabel(
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
                                                },
                                            )}
                                        </div>
                                    )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* MODAL DETAIL TRANSAKSI */}
            <Dialog
                open={detailItem !== null}
                onOpenChange={(open) => !open && setDetailItem(null)}
            >
                <DialogContent className="max-h-[90vh] overflow-y-auto border-[#e4eaec] bg-white font-poppins text-slate-800 sm:max-w-xl">
                    {detailItem && (
                        <>
                            <DialogHeader>
                                <div className="flex items-center justify-between gap-2 pr-6">
                                    <span className="font-mono text-xs font-bold text-[#087f8c]">
                                        {detailItem.kode_transaksi}
                                    </span>
                                    <span
                                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${
                                            detailItem.status_transaksi ===
                                            'valid'
                                                ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                                                : 'border-slate-200 bg-slate-100 text-slate-600'
                                        }`}
                                    >
                                        {detailItem.status_transaksi === 'valid'
                                            ? 'Tercatat'
                                            : 'Dibatalkan'}
                                    </span>
                                </div>
                                <DialogTitle className="mt-1 text-lg font-bold text-slate-800">
                                    Rincian Transaksi Keuangan
                                </DialogTitle>
                                <DialogDescription className="text-xs text-slate-500">
                                    Tanggal transaksi:{' '}
                                    {detailItem.tanggal_formatted ||
                                        detailItem.tanggal_transaksi}
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4 py-2 text-xs">
                                <div className="grid grid-cols-1 gap-3 rounded-xl border border-[#e4eaec] bg-[#f8fafb] p-4 sm:grid-cols-2">
                                    <div>
                                        <span className="text-[11px] text-slate-400">
                                            Jenis Transaksi
                                        </span>
                                        <p className="mt-0.5">
                                            <span
                                                className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${
                                                    detailItem.tipe ===
                                                    'pemasukan'
                                                        ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                                                        : 'border-rose-200 bg-rose-50 text-rose-700'
                                                }`}
                                            >
                                                {detailItem.tipe === 'pemasukan'
                                                    ? 'Pemasukan (Dana Masuk)'
                                                    : 'Pengeluaran (Dana Keluar)'}
                                            </span>
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-[11px] text-slate-400">
                                            Nominal Transaksi
                                        </span>
                                        <p
                                            className={`mt-0.5 text-base font-bold ${
                                                detailItem.tipe === 'pemasukan'
                                                    ? 'text-emerald-700'
                                                    : 'text-rose-600'
                                            }`}
                                        >
                                            {detailItem.tipe === 'pemasukan'
                                                ? '+'
                                                : '-'}{' '}
                                            {formatRupiah(detailItem.nominal)}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-[11px] text-slate-400">
                                            Keperluan / Kategori
                                        </span>
                                        <p className="mt-0.5 font-semibold text-slate-800">
                                            {detailItem.kategori}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-[11px] text-slate-400">
                                            Sumber Dana
                                        </span>
                                        <p className="mt-0.5 font-medium text-[#087f8c]">
                                            {detailItem.sumber_dana_label ||
                                                (detailItem.sumber_dana ===
                                                'donasi'
                                                    ? 'Dana Donasi'
                                                    : 'Dana Operasional')}
                                        </p>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <span className="text-[11px] text-slate-400">
                                            Keterangan Transaksi
                                        </span>
                                        <p className="mt-0.5 leading-relaxed text-slate-700">
                                            {detailItem.keterangan}
                                        </p>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <span className="text-[11px] text-slate-400">
                                            Dicatat Oleh
                                        </span>
                                        <p className="mt-0.5 font-medium text-slate-700">
                                            {detailItem.pencatat?.name ||
                                                'Otomatis dari Sistem Donasi'}
                                        </p>
                                    </div>
                                </div>

                                {detailItem.donasi && (
                                    <div className="rounded-xl border border-[#cbebf0] bg-[#f7fcfd] p-4">
                                        <span className="text-xs font-semibold text-[#087f8c]">
                                            Sumber Donasi Terkait
                                        </span>
                                        <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                                            <div>
                                                <span className="text-[11px] text-slate-400">
                                                    Kode Donasi
                                                </span>
                                                <p className="font-mono font-bold text-slate-800">
                                                    {
                                                        detailItem.donasi
                                                            .kode_donasi
                                                    }
                                                </p>
                                            </div>
                                            <div>
                                                <span className="text-[11px] text-slate-400">
                                                    Nama Donatur
                                                </span>
                                                <p className="font-semibold text-slate-800">
                                                    {
                                                        detailItem.donasi
                                                            .nama_donatur
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {detailItem.has_bukti_nota &&
                                    detailItem.bukti_nota_url && (
                                        <div className="rounded-xl border border-[#e4eaec] bg-white p-4">
                                            <div className="mb-2 flex items-center justify-between">
                                                <span className="font-semibold text-slate-700">
                                                    Lampiran Bukti / Nota
                                                </span>
                                                <a
                                                    href={
                                                        detailItem.bukti_nota_url
                                                    }
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="font-semibold text-[#087f8c] underline hover:text-[#14bace]"
                                                >
                                                    Buka di Tab Baru
                                                </a>
                                            </div>
                                            {!detailItem.bukti_nota_is_pdf && (
                                                <img
                                                    src={
                                                        detailItem.bukti_nota_url
                                                    }
                                                    alt="Lampiran Nota Transaksi"
                                                    className="max-h-64 w-full rounded-lg border border-[#e4eaec] object-contain"
                                                />
                                            )}
                                        </div>
                                    )}
                            </div>

                            <DialogFooter>
                                <Button
                                    type="button"
                                    onClick={() => setDetailItem(null)}
                                    className="bg-[#14bace] text-xs font-semibold text-white shadow-none hover:bg-[#0fa0ae]"
                                >
                                    Tutup
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>

            {/* MODAL INPUT TRANSAKSI BARU */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-h-[90vh] overflow-y-auto border-[#e4eaec] bg-white font-poppins text-slate-800 sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="font-poppins text-lg font-bold text-slate-800">
                            {form.data.tipe === 'pemasukan'
                                ? 'Catat Pemasukan Kas'
                                : 'Catat Pengeluaran Kas'}
                        </DialogTitle>
                        <DialogDescription className="text-xs text-slate-500">
                            Catat rincian transaksi pemasukan atau pengeluaran
                            secara akurat pada buku kas yayasan.
                        </DialogDescription>
                    </DialogHeader>

                    <form
                        onSubmit={handleFormSubmit}
                        className="space-y-4 pt-2 font-poppins text-xs"
                    >
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <div>
                                <label className="mb-1 block font-semibold text-slate-700">
                                    Jenis Transaksi{' '}
                                    <span className="text-rose-500">*</span>
                                </label>
                                <BrandSelect
                                    ariaLabel="Jenis Transaksi"
                                    value={form.data.tipe}
                                    onValueChange={(val) =>
                                        form.setData(
                                            'tipe',
                                            val as 'pemasukan' | 'pengeluaran',
                                        )
                                    }
                                    options={[
                                        {
                                            value: 'pengeluaran',
                                            label: 'Pengeluaran (Keluar)',
                                        },
                                        {
                                            value: 'pemasukan',
                                            label: 'Pemasukan (Masuk)',
                                        },
                                    ]}
                                />
                                <InputError message={form.errors.tipe} />
                            </div>

                            <div>
                                <label className="mb-1 block font-semibold text-slate-700">
                                    Sumber Dana{' '}
                                    <span className="text-rose-500">*</span>
                                </label>
                                <BrandSelect
                                    ariaLabel="Sumber Dana"
                                    value={form.data.sumber_dana}
                                    onValueChange={(val) =>
                                        form.setData(
                                            'sumber_dana',
                                            val as 'donasi' | 'operasional',
                                        )
                                    }
                                    options={[
                                        {
                                            value: 'operasional',
                                            label: 'Dana Operasional',
                                        },
                                        {
                                            value: 'donasi',
                                            label: 'Dana Donasi',
                                        },
                                    ]}
                                />
                                <InputError message={form.errors.sumber_dana} />
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="kategori_trx"
                                className="mb-1 block font-semibold text-slate-700"
                            >
                                Keperluan / Kategori{' '}
                                <span className="text-rose-500">*</span>
                            </label>
                            <input
                                id="kategori_trx"
                                type="text"
                                placeholder="Contoh: Santunan Yatim / Listrik / Perlengkapan Kantor"
                                value={form.data.kategori}
                                onChange={(e) =>
                                    form.setData('kategori', e.target.value)
                                }
                                className="w-full rounded-lg border border-[#e4eaec] bg-white px-3 py-2 text-xs text-slate-800 outline-none focus:border-[#14bace] focus:ring-2 focus:ring-[#14bace]/20"
                                required
                            />
                            <InputError message={form.errors.kategori} />
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <div>
                                <label
                                    htmlFor="nominal_trx"
                                    className="mb-1 block font-semibold text-slate-700"
                                >
                                    Nominal Transaksi (Rp){' '}
                                    <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    id="nominal_trx"
                                    type="number"
                                    min="1000"
                                    placeholder="500000"
                                    value={form.data.nominal}
                                    onChange={(e) =>
                                        form.setData('nominal', e.target.value)
                                    }
                                    className="w-full rounded-lg border border-[#e4eaec] bg-white px-3 py-2 text-xs text-slate-800 outline-none focus:border-[#14bace] focus:ring-2 focus:ring-[#14bace]/20"
                                    required
                                />
                                <InputError message={form.errors.nominal} />
                            </div>

                            <div>
                                <label
                                    htmlFor="tanggal_trx"
                                    className="mb-1 block font-semibold text-slate-700"
                                >
                                    Tanggal Transaksi{' '}
                                    <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    id="tanggal_trx"
                                    type="date"
                                    value={form.data.tanggal_transaksi}
                                    onChange={(e) =>
                                        form.setData(
                                            'tanggal_transaksi',
                                            e.target.value,
                                        )
                                    }
                                    className="w-full rounded-lg border border-[#e4eaec] bg-white px-3 py-2 text-xs text-slate-800 outline-none focus:border-[#14bace] focus:ring-2 focus:ring-[#14bace]/20"
                                    required
                                />
                                <InputError
                                    message={form.errors.tanggal_transaksi}
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="keterangan_trx"
                                className="mb-1 block font-semibold text-slate-700"
                            >
                                Keterangan Transaksi{' '}
                                <span className="text-rose-500">*</span>
                            </label>
                            <textarea
                                id="keterangan_trx"
                                rows={2}
                                placeholder="Tuliskan rincian keperluan atau sumber pemasukan..."
                                value={form.data.keterangan}
                                onChange={(e) =>
                                    form.setData('keterangan', e.target.value)
                                }
                                className="w-full rounded-lg border border-[#e4eaec] bg-white px-3 py-2 text-xs text-slate-800 outline-none focus:border-[#14bace] focus:ring-2 focus:ring-[#14bace]/20"
                                required
                            />
                            <InputError message={form.errors.keterangan} />
                        </div>

                        <div>
                            <label
                                htmlFor="bukti_nota_trx"
                                className="mb-1 block font-semibold text-slate-700"
                            >
                                Lampiran Nota / Bukti (Opsional)
                            </label>
                            <input
                                ref={buktiInputRef}
                                id="bukti_nota_trx"
                                type="file"
                                accept=".jpg,.jpeg,.png,.webp,.pdf,image/jpeg,image/png,image/webp,application/pdf"
                                onChange={(e) =>
                                    form.setData(
                                        'bukti_nota',
                                        e.target.files?.[0] ?? null,
                                    )
                                }
                                className="block w-full cursor-pointer text-[11px] text-slate-600 file:mr-2.5 file:cursor-pointer file:rounded-md file:border file:border-[#cbebf0] file:bg-[#f7fcfd] file:px-2.5 file:py-1 file:text-[11px] file:font-semibold file:text-[#087f8c] hover:file:bg-[#e8f8fa]"
                            />
                            <InputError message={form.errors.bukti_nota} />
                        </div>

                        <DialogFooter className="gap-2 pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsModalOpen(false)}
                                className="border-[#e4eaec] text-xs text-slate-600"
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                disabled={form.processing}
                                className="bg-[#14bace] text-xs font-semibold text-white hover:bg-[#0fa0ae]"
                            >
                                {form.processing
                                    ? 'Menyimpan...'
                                    : 'Simpan Transaksi'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

KeuanganAdmin.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Keuangan', href: '/admin/keuangan' },
    ],
};
