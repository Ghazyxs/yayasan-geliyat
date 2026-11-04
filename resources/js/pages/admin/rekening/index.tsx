import { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import {
    CreditCard,
    Plus,
    CheckCircle2,
    XCircle,
    Copy,
    Check,
    Pencil,
    Trash2,
    ShieldAlert,
    AlertCircle,
    Building2,
    ToggleLeft,
    ToggleRight,
    Lock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

interface RekeningItem {
    id: number;
    nama_bank: string;
    nomor_rekening: string;
    atas_nama: string;
    icon: string | null;
    is_active: boolean;
    catatan: string | null;
    donasi_count: number;
    created_at: string;
    pembuat?: {
        id: number;
        name: string;
    } | null;
}

interface RekeningAdminProps {
    rekeningList: RekeningItem[];
    stats: {
        total: number;
        aktif: number;
        nonaktif: number;
        total_donasi: number;
    };
    flash?: {
        success?: string;
        error?: string;
    };
}

export default function RekeningAdmin({
    rekeningList,
    stats,
}: RekeningAdminProps) {
    const [copiedNomor, setCopiedNomor] = useState<string | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<RekeningItem | null>(null);
    const [deleteItem, setDeleteItem] = useState<RekeningItem | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [togglingId, setTogglingId] = useState<number | null>(null);

    const form = useForm({
        nama_bank: '',
        nomor_rekening: '',
        atas_nama: 'Yayasan Geliyat Mahdiesa Nahate',
        icon: '',
        is_active: true,
        catatan: '',
    });

    const openCreateModal = () => {
        setEditingItem(null);
        form.reset();
        form.clearErrors();
        form.setData({
            nama_bank: '',
            nomor_rekening: '',
            atas_nama: 'Yayasan Geliyat Mahdiesa Nahate',
            icon: '',
            is_active: true,
            catatan: '',
        });
        setIsFormOpen(true);
    };

    const openEditModal = (item: RekeningItem) => {
        setEditingItem(item);
        form.clearErrors();
        form.setData({
            nama_bank: item.nama_bank,
            nomor_rekening: item.nomor_rekening,
            atas_nama: item.atas_nama,
            icon: item.icon ?? '',
            is_active: item.is_active,
            catatan: item.catatan ?? '',
        });
        setIsFormOpen(true);
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingItem) {
            form.put(`/admin/rekening/${editingItem.id}`, {
                onSuccess: () => {
                    setIsFormOpen(false);
                    setEditingItem(null);
                    form.reset();
                },
            });
        } else {
            form.post('/admin/rekening', {
                onSuccess: () => {
                    setIsFormOpen(false);
                    form.reset();
                },
            });
        }
    };

    const handleToggleActive = (item: RekeningItem) => {
        setTogglingId(item.id);
        router.patch(
            `/admin/rekening/${item.id}/toggle-active`,
            {},
            {
                onFinish: () => setTogglingId(null),
                preserveScroll: true,
            },
        );
    };

    const handleDelete = () => {
        if (!deleteItem) return;
        setIsDeleting(true);
        router.delete(`/admin/rekening/${deleteItem.id}`, {
            onFinish: () => {
                setIsDeleting(false);
                setDeleteItem(null);
            },
            preserveScroll: true,
        });
    };

    const copyToClipboard = (nomor: string) => {
        navigator.clipboard
            .writeText(nomor)
            .then(() => {
                setCopiedNomor(nomor);
                setTimeout(() => setCopiedNomor(null), 2000);
            })
            .catch(() => {
                // fallback tanpa error
            });
    };

    return (
        <>
            <Head title="Manajemen Rekening Yayasan - Super Admin" />

            <div className="flex flex-col gap-6 p-6 font-poppins">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="mb-2 flex w-fit items-center gap-2 rounded-md border border-[#cbebf0] bg-[#e8f8fa] px-2.5 py-1 text-xs font-semibold text-[#087f8c]">
                            <CreditCard className="size-3.5" />
                            Akses Khusus Super Admin
                        </div>
                        <h1 className="text-2xl font-bold text-slate-800">
                            Manajemen Rekening Yayasan
                        </h1>
                        <p className="mt-1 text-xs text-slate-500">
                            Kelola rekening bank resmi penampung donasi yayasan,
                            atur status aktif untuk publik, dan amankan riwayat
                            transaksi.
                        </p>
                    </div>
                    <Button
                        onClick={openCreateModal}
                        className="flex items-center gap-2 bg-[#14bace] text-xs font-semibold text-white shadow-xs hover:bg-[#0fa0ae]"
                    >
                        <Plus className="size-4" /> Tambah Rekening Baru
                    </Button>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                    <div className="rounded-xl border border-[#e4eaec] bg-white p-5 shadow-xs">
                        <span className="block text-xs font-medium text-slate-500">
                            Total Rekening Bank
                        </span>
                        <div className="mt-2 flex items-center justify-between">
                            <span className="text-2xl font-bold text-slate-800">
                                {stats.total}
                            </span>
                            <div className="flex size-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                                <Building2 className="size-5" />
                            </div>
                        </div>
                        <span className="mt-1 block text-[11px] text-slate-400">
                            Terdaftar di sistem
                        </span>
                    </div>

                    <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-5 shadow-xs">
                        <span className="block text-xs font-medium text-emerald-800">
                            Rekening Aktif
                        </span>
                        <div className="mt-2 flex items-center justify-between">
                            <span className="text-2xl font-bold text-emerald-700">
                                {stats.aktif}
                            </span>
                            <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                                <CheckCircle2 className="size-5" />
                            </div>
                        </div>
                        <span className="mt-1 block text-[11px] text-emerald-600">
                            Tampil di halaman donasi publik
                        </span>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 shadow-xs">
                        <span className="block text-xs font-medium text-slate-600">
                            Rekening Nonaktif
                        </span>
                        <div className="mt-2 flex items-center justify-between">
                            <span className="text-2xl font-bold text-slate-600">
                                {stats.nonaktif}
                            </span>
                            <div className="flex size-9 items-center justify-center rounded-lg bg-slate-200 text-slate-600">
                                <XCircle className="size-5" />
                            </div>
                        </div>
                        <span className="mt-1 block text-[11px] text-slate-500">
                            Disembunyikan dari pilihan donatur
                        </span>
                    </div>

                    <div className="rounded-xl border border-[#cbebf0] bg-[#e8f8fa]/60 p-5 shadow-xs">
                        <span className="block text-xs font-semibold text-[#087f8c]">
                            Total Donasi Terkait
                        </span>
                        <div className="mt-2 flex items-center justify-between">
                            <span className="text-2xl font-bold text-[#087f8c]">
                                {stats.total_donasi}
                            </span>
                            <div className="flex size-9 items-center justify-center rounded-lg bg-[#14bace]/20 text-[#087f8c]">
                                <Lock className="size-5" />
                            </div>
                        </div>
                        <span className="mt-1 block text-[11px] text-[#087f8c]">
                            Transaksi donasi yang terlindungi
                        </span>
                    </div>
                </div>

                {/* Info Alert */}
                <div className="flex items-start gap-3 rounded-xl border border-sky-200 bg-sky-50/70 p-4 text-xs text-sky-800">
                    <ShieldAlert className="mt-0.5 size-4 shrink-0 text-sky-600" />
                    <div>
                        <span className="font-semibold">
                            Kebijakan Integritas Rekening Yayasan:
                        </span>
                        <p className="mt-0.5 text-sky-700">
                            Hanya rekening berstatus <strong>Aktif</strong> yang
                            dapat dipilih oleh donatur pada form donasi publik.
                            Rekening yang pernah memiliki riwayat transaksi
                            donasi dilindungi secara otomatis dan tidak dapat
                            dihapus secara fisik; Anda cukup menonaktifkannya
                            jika sudah tidak digunakan lagi.
                        </p>
                    </div>
                </div>

                {/* Table Card */}
                <div className="rounded-xl border border-[#e4eaec] bg-white shadow-xs">
                    <div className="border-b border-[#e4eaec] px-6 py-4">
                        <h2 className="text-sm font-bold text-slate-800">
                            Daftar Rekening Resmi Yayasan
                        </h2>
                        <p className="text-xs text-slate-500">
                            Daftar seluruh rekening penampung donasi yang
                            terdaftar.
                        </p>
                    </div>

                    {rekeningList.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-12 text-center">
                            <div className="flex size-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                                <CreditCard className="size-7" />
                            </div>
                            <h3 className="mt-4 text-base font-bold text-slate-800">
                                Belum Ada Rekening Yayasan
                            </h3>
                            <p className="mt-1.5 max-w-md text-xs text-slate-500">
                                Master rekening yayasan masih kosong. Tambahkan
                                data rekening resmi pertama yayasan agar donatur
                                dapat memilih rekening tujuan transfer.
                            </p>
                            <Button
                                onClick={openCreateModal}
                                className="mt-4 flex items-center gap-2 bg-[#14bace] text-xs font-semibold text-white hover:bg-[#0fa0ae]"
                            >
                                <Plus className="size-4" /> Tambah Rekening
                                Pertama
                            </Button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead>
                                    <tr className="border-b border-[#e4eaec] bg-slate-50/70 font-semibold text-slate-600">
                                        <th className="px-6 py-3.5">
                                            Bank & Identitas
                                        </th>
                                        <th className="px-6 py-3.5">
                                            Nomor Rekening
                                        </th>
                                        <th className="px-6 py-3.5">
                                            Atas Nama
                                        </th>
                                        <th className="px-6 py-3.5 text-center">
                                            Status Publik
                                        </th>
                                        <th className="px-6 py-3.5 text-center">
                                            Riwayat Donasi
                                        </th>
                                        <th className="px-6 py-3.5 text-right">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#e4eaec]">
                                    {rekeningList.map((item) => {
                                        const hasDonasi = item.donasi_count > 0;
                                        return (
                                            <tr
                                                key={item.id}
                                                className={`transition-colors hover:bg-slate-50/60 ${
                                                    !item.is_active
                                                        ? 'bg-slate-50/30 opacity-75'
                                                        : ''
                                                }`}
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white font-mono text-xs font-bold text-slate-700 shadow-2xs">
                                                            {item.icon ||
                                                                'BANK'}
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-slate-800">
                                                                {item.nama_bank}
                                                            </p>
                                                            {item.catatan && (
                                                                <p className="text-[11px] text-slate-400">
                                                                    {
                                                                        item.catatan
                                                                    }
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-mono font-medium text-slate-700">
                                                            {
                                                                item.nomor_rekening
                                                            }
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                copyToClipboard(
                                                                    item.nomor_rekening,
                                                                )
                                                            }
                                                            className="rounded p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                                                            title="Salin Nomor Rekening"
                                                        >
                                                            {copiedNomor ===
                                                            item.nomor_rekening ? (
                                                                <Check className="size-3.5 text-emerald-600" />
                                                            ) : (
                                                                <Copy className="size-3.5" />
                                                            )}
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 font-medium text-slate-700">
                                                    {item.atas_nama}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleToggleActive(
                                                                item,
                                                            )
                                                        }
                                                        disabled={
                                                            togglingId ===
                                                            item.id
                                                        }
                                                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                                                            item.is_active
                                                                ? 'border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                                                : 'border border-slate-300 bg-slate-100 text-slate-600 hover:bg-slate-200'
                                                        }`}
                                                        title="Klik untuk mengubah status aktif/nonaktif"
                                                    >
                                                        {item.is_active ? (
                                                            <>
                                                                <ToggleRight className="size-3.5 text-emerald-600" />
                                                                <span>
                                                                    Aktif
                                                                </span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <ToggleLeft className="size-3.5 text-slate-400" />
                                                                <span>
                                                                    Nonaktif
                                                                </span>
                                                            </>
                                                        )}
                                                    </button>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    {hasDonasi ? (
                                                        <span className="inline-flex items-center gap-1 rounded-md border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
                                                            <Lock className="size-3" />
                                                            {item.donasi_count}{' '}
                                                            transaksi
                                                        </span>
                                                    ) : (
                                                        <span className="text-[11px] text-slate-400">
                                                            Belum ada
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() =>
                                                                openEditModal(
                                                                    item,
                                                                )
                                                            }
                                                            className="h-8 px-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                                            title="Edit Rekening"
                                                        >
                                                            <Pencil className="size-3.5" />
                                                        </Button>

                                                        {hasDonasi ? (
                                                            <div
                                                                title="Rekening terkunci karena memiliki riwayat donasi. Gunakan toggle status untuk menonaktifkan."
                                                                className="cursor-not-allowed p-1.5 text-slate-300"
                                                            >
                                                                <Trash2 className="size-3.5" />
                                                            </div>
                                                        ) : (
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() =>
                                                                    setDeleteItem(
                                                                        item,
                                                                    )
                                                                }
                                                                className="h-8 px-2 text-rose-500 hover:bg-rose-50 hover:text-rose-700"
                                                                title="Hapus Rekening"
                                                            >
                                                                <Trash2 className="size-3.5" />
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
                    )}
                </div>
            </div>

            {/* Modal Form Tambah / Edit */}
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="font-poppins text-lg font-bold text-slate-800">
                            {editingItem
                                ? 'Edit Rekening Yayasan'
                                : 'Tambah Rekening Yayasan'}
                        </DialogTitle>
                        <DialogDescription className="text-xs text-slate-500">
                            {editingItem
                                ? 'Perbarui informasi nomor rekening atau nama bank resmi yayasan.'
                                : 'Daftarkan nomor rekening bank resmi baru untuk menerima donasi.'}
                        </DialogDescription>
                    </DialogHeader>

                    <form
                        onSubmit={handleFormSubmit}
                        className="space-y-4 pt-2 font-poppins text-xs"
                    >
                        <div>
                            <label
                                htmlFor="nama_bank"
                                className="mb-1 block font-semibold text-slate-700"
                            >
                                Nama Bank{' '}
                                <span className="text-rose-500">*</span>
                            </label>
                            <input
                                id="nama_bank"
                                type="text"
                                placeholder="mis. Bank Syariah Indonesia (BSI)"
                                value={form.data.nama_bank}
                                onChange={(e) =>
                                    form.setData('nama_bank', e.target.value)
                                }
                                className="w-full rounded-lg border border-[#e4eaec] bg-white px-3 py-2 text-xs text-slate-800 outline-none focus:border-[#14bace]"
                                required
                            />
                            {form.errors.nama_bank && (
                                <p className="mt-1 text-[11px] text-rose-500">
                                    {form.errors.nama_bank}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="nomor_rekening"
                                className="mb-1 block font-semibold text-slate-700"
                            >
                                Nomor Rekening{' '}
                                <span className="text-rose-500">*</span>
                            </label>
                            <input
                                id="nomor_rekening"
                                type="text"
                                placeholder="mis. 7256194821"
                                value={form.data.nomor_rekening}
                                onChange={(e) =>
                                    form.setData(
                                        'nomor_rekening',
                                        e.target.value,
                                    )
                                }
                                className="w-full rounded-lg border border-[#e4eaec] bg-white px-3 py-2 font-mono text-xs text-slate-800 outline-none focus:border-[#14bace]"
                                required
                            />
                            {form.errors.nomor_rekening && (
                                <p className="mt-1 text-[11px] text-rose-500">
                                    {form.errors.nomor_rekening}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="atas_nama"
                                className="mb-1 block font-semibold text-slate-700"
                            >
                                Atas Nama Rekening{' '}
                                <span className="text-rose-500">*</span>
                            </label>
                            <input
                                id="atas_nama"
                                type="text"
                                value={form.data.atas_nama}
                                onChange={(e) =>
                                    form.setData('atas_nama', e.target.value)
                                }
                                className="w-full rounded-lg border border-[#e4eaec] bg-white px-3 py-2 text-xs text-slate-800 outline-none focus:border-[#14bace]"
                                required
                            />
                            {form.errors.atas_nama && (
                                <p className="mt-1 text-[11px] text-rose-500">
                                    {form.errors.atas_nama}
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label
                                    htmlFor="icon"
                                    className="mb-1 block font-semibold text-slate-700"
                                >
                                    Badge / Singkatan Bank
                                </label>
                                <input
                                    id="icon"
                                    type="text"
                                    placeholder="mis. BSI / BRI / MANDIRI"
                                    value={form.data.icon}
                                    onChange={(e) =>
                                        form.setData('icon', e.target.value)
                                    }
                                    className="w-full rounded-lg border border-[#e4eaec] bg-white px-3 py-2 text-xs text-slate-800 uppercase outline-none focus:border-[#14bace]"
                                />
                                {form.errors.icon && (
                                    <p className="mt-1 text-[11px] text-rose-500">
                                        {form.errors.icon}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-1 block font-semibold text-slate-700">
                                    Status Publik
                                </label>
                                <label className="mt-1.5 flex cursor-pointer items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={form.data.is_active}
                                        onChange={(e) =>
                                            form.setData(
                                                'is_active',
                                                e.target.checked,
                                            )
                                        }
                                        className="size-4 rounded border-slate-300 text-[#14bace] focus:ring-[#14bace]"
                                    />
                                    <span className="text-xs text-slate-700">
                                        Aktifkan Rekening
                                    </span>
                                </label>
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="catatan"
                                className="mb-1 block font-semibold text-slate-700"
                            >
                                Catatan Peruntukan (Opsional)
                            </label>
                            <textarea
                                id="catatan"
                                rows={2}
                                placeholder="mis. Rekening khusus program Orang Tua Asuh & Donasi Umum..."
                                value={form.data.catatan}
                                onChange={(e) =>
                                    form.setData('catatan', e.target.value)
                                }
                                className="w-full rounded-lg border border-[#e4eaec] bg-white px-3 py-2 text-xs text-slate-800 outline-none focus:border-[#14bace]"
                            />
                        </div>

                        <DialogFooter className="gap-2 pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsFormOpen(false)}
                                className="border-[#e4eaec] text-xs text-slate-600 hover:bg-slate-50"
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
                                    : editingItem
                                      ? 'Simpan Perubahan'
                                      : 'Tambah Rekening'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Modal Dialog Konfirmasi Hapus */}
            <Dialog
                open={Boolean(deleteItem)}
                onOpenChange={(open) => !open && setDeleteItem(null)}
            >
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <div className="mb-2 flex size-10 items-center justify-center rounded-full bg-rose-100 text-rose-600">
                            <AlertCircle className="size-5" />
                        </div>
                        <DialogTitle className="font-poppins text-lg font-bold text-slate-800">
                            Hapus Rekening Yayasan?
                        </DialogTitle>
                        <DialogDescription className="text-xs text-slate-500">
                            Apakah Anda yakin ingin menghapus rekening bank{' '}
                            <strong>{deleteItem?.nama_bank}</strong> (
                            {deleteItem?.nomor_rekening})? Tindakan ini bersifat
                            permanen dan tidak dapat dibatalkan.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setDeleteItem(null)}
                            disabled={isDeleting}
                            className="border-[#e4eaec] text-xs text-slate-600"
                        >
                            Batal
                        </Button>
                        <Button
                            type="button"
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="bg-rose-600 text-xs font-semibold text-white hover:bg-rose-700"
                        >
                            {isDeleting ? 'Menghapus...' : 'Ya, Hapus Rekening'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

RekeningAdmin.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Rekening Yayasan', href: '/admin/rekening' },
    ],
};
