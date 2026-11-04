import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import {
    Wallet,
    Plus,
    TrendingUp,
    TrendingDown,
    HeartHandshake,
    Building2,
    AlertTriangle,
    FileText,
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
    kategori: string;
    nominal: number;
    tanggal_transaksi: string;
    status_transaksi: 'valid' | 'void';
    keterangan: string;
    bukti_nota: string | null;
    pencatat?: { id: number; name: string } | null;
    donasi?: { id: number; kode_donasi: string; nama_donatur: string } | null;
}

interface KeuanganAdminProps {
    ringkasan?: RingkasanKeuangan;
    transaksiList?: {
        data: TransaksiItem[];
        current_page: number;
        last_page: number;
        total: number;
    };
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
    transaksiList,
}: KeuanganAdminProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const form = useForm({
        tipe: 'pengeluaran',
        sumber_dana: 'donasi',
        kategori: '',
        nominal: '',
        tanggal_transaksi: new Date().toISOString().split('T')[0],
        keterangan: '',
        bukti_nota: null as File | null,
    });

    const formatRupiah = (val: number) => {
        return 'Rp' + new Intl.NumberFormat('id-ID').format(val);
    };

    const openModalWithTipe = (
        tipe: 'pemasukan' | 'pengeluaran',
        sumber: 'donasi' | 'operasional' = 'donasi',
    ) => {
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
            onSuccess: () => {
                setIsModalOpen(false);
                form.reset();
            },
        });
    };

    return (
        <>
            <Head title="Manajemen Keuangan - Super Admin" />
            <div className="flex flex-col gap-6 p-6 font-poppins">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="mb-2 flex w-fit items-center gap-2 rounded-md border border-[#cbebf0] bg-[#e8f8fa] px-2.5 py-1 text-xs font-semibold text-[#087f8c]">
                            <Wallet className="size-3.5" />
                            Akses Khusus Super Admin (Ketua)
                        </div>
                        <h1 className="text-2xl font-bold text-[#1b2929]">
                            Buku Kas & Manajemen Keuangan
                        </h1>
                        <p className="mt-1 text-xs text-[#718083]">
                            Pemisahan pembukuan dana donasi amanah dan kas
                            operasional yayasan secara transparan.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            onClick={() =>
                                openModalWithTipe('pemasukan', 'operasional')
                            }
                            className="flex items-center gap-2 bg-[#14bace] text-xs font-semibold text-white shadow-xs hover:bg-[#0fa0ae]"
                        >
                            <Plus className="size-4" /> Catat Pemasukan
                            Operasional
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() =>
                                openModalWithTipe('pengeluaran', 'donasi')
                            }
                            className="flex items-center gap-2 border-rose-200 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                        >
                            <Plus className="size-4" /> Catat Pengeluaran
                        </Button>
                    </div>
                </div>

                {/* Alert jika ada transaksi lama belum terklasifikasi */}
                {ringkasan.konsolidasi.belum_terklasifikasi > 0 && (
                    <div className="flex items-start gap-3 rounded-xl border border-amber-300 bg-amber-50/80 p-4 text-xs text-amber-800">
                        <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-600" />
                        <div>
                            <span className="font-semibold">
                                Transaksi Belum Terklasifikasi:
                            </span>
                            <p className="mt-0.5">
                                Terdapat transaksi valid senilai{' '}
                                <strong>
                                    {formatRupiah(
                                        ringkasan.konsolidasi
                                            .belum_terklasifikasi,
                                    )}
                                </strong>{' '}
                                dengan <code>sumber_dana = NULL</code>. Nilai
                                ini diisolasi dan tidak dihitung ke dalam saldo
                                donasi maupun kas operasional sampai
                                diverifikasi sumber dananya.
                            </p>
                        </div>
                    </div>
                )}

                {/* Dua Panel Finansial Terpisah */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Panel 1: Dana Donasi */}
                    <div className="rounded-2xl border border-emerald-200 bg-white p-6 shadow-xs">
                        <div className="flex items-center justify-between border-b border-[#f0f4f5] pb-4">
                            <div className="flex items-center gap-2">
                                <HeartHandshake className="size-5 text-emerald-600" />
                                <div>
                                    <h2 className="text-base font-bold text-slate-800">
                                        Kantong Dana Donasi
                                    </h2>
                                    <p className="text-[11px] text-slate-500">
                                        Amanah donatur khusus program santunan &
                                        binaan
                                    </p>
                                </div>
                            </div>
                            <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
                                Amanah Donatur
                            </span>
                        </div>
                        <div className="mt-4 grid grid-cols-3 gap-3">
                            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5">
                                <span className="block text-[11px] font-medium text-slate-500">
                                    Total Masuk
                                </span>
                                <p className="mt-1 text-base font-bold text-emerald-600">
                                    {formatRupiah(ringkasan.donasi.masuk)}
                                </p>
                            </div>
                            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5">
                                <span className="block text-[11px] font-medium text-slate-500">
                                    Penyaluran
                                </span>
                                <p className="mt-1 text-base font-bold text-rose-600">
                                    {formatRupiah(ringkasan.donasi.keluar)}
                                </p>
                            </div>
                            <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3.5">
                                <span className="block text-[11px] font-semibold text-emerald-800">
                                    Saldo Donasi
                                </span>
                                <p className="mt-1 text-base font-bold text-emerald-700">
                                    {formatRupiah(ringkasan.donasi.saldo)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Panel 2: Kas Operasional */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
                        <div className="flex items-center justify-between border-b border-[#f0f4f5] pb-4">
                            <div className="flex items-center gap-2">
                                <Building2 className="size-5 text-[#087f8c]" />
                                <div>
                                    <h2 className="text-base font-bold text-slate-800">
                                        Kas Operasional Yayasan
                                    </h2>
                                    <p className="text-[11px] text-slate-500">
                                        Arus kas mandiri operasional lembaga
                                    </p>
                                </div>
                            </div>
                            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600">
                                Kas Mandiri
                            </span>
                        </div>
                        <div className="mt-4 grid grid-cols-3 gap-3">
                            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5">
                                <span className="block text-[11px] font-medium text-slate-500">
                                    Pemasukan Non-Donasi
                                </span>
                                <p className="mt-1 text-base font-bold text-emerald-600">
                                    {formatRupiah(ringkasan.operasional.masuk)}
                                </p>
                            </div>
                            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5">
                                <span className="block text-[11px] font-medium text-slate-500">
                                    Pengeluaran Kantor
                                </span>
                                <p className="mt-1 text-base font-bold text-rose-600">
                                    {formatRupiah(ringkasan.operasional.keluar)}
                                </p>
                            </div>
                            <div className="rounded-xl border border-[#cbebf0] bg-[#e8f8fa] p-3.5">
                                <span className="block text-[11px] font-semibold text-[#087f8c]">
                                    Saldo Operasional
                                </span>
                                <p className="mt-1 text-base font-bold text-[#087f8c]">
                                    {formatRupiah(ringkasan.operasional.saldo)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Konsolidasi Ringkasan */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-xl border border-[#e4eaec] bg-white p-5 shadow-xs">
                        <span className="block text-xs font-medium text-[#718083]">
                            Total Pemasukan Terklasifikasi
                        </span>
                        <div className="mt-2 flex items-center justify-between">
                            <span className="text-xl font-bold text-emerald-600">
                                {formatRupiah(
                                    ringkasan.konsolidasi.total_pemasukan,
                                )}
                            </span>
                            <TrendingUp className="size-5 text-emerald-500" />
                        </div>
                    </div>
                    <div className="rounded-xl border border-[#e4eaec] bg-white p-5 shadow-xs">
                        <span className="block text-xs font-medium text-[#718083]">
                            Total Pengeluaran Terklasifikasi
                        </span>
                        <div className="mt-2 flex items-center justify-between">
                            <span className="text-xl font-bold text-rose-600">
                                {formatRupiah(
                                    ringkasan.konsolidasi.total_pengeluaran,
                                )}
                            </span>
                            <TrendingDown className="size-5 text-rose-500" />
                        </div>
                    </div>
                    <div className="rounded-xl border border-[#cbebf0] bg-[#e8f8fa] p-5 shadow-xs">
                        <span className="block text-xs font-semibold text-[#087f8c]">
                            Total Saldo Gabungan (Donasi + Operasional)
                        </span>
                        <div className="mt-2 flex items-center justify-between">
                            <span className="text-xl font-bold text-[#1b2929]">
                                {formatRupiah(
                                    ringkasan.konsolidasi.saldo_bersih,
                                )}
                            </span>
                            <Wallet className="size-5 text-[#087f8c]" />
                        </div>
                    </div>
                </div>

                {/* Daftar Transaksi Kas */}
                <div className="rounded-xl border border-[#e4eaec] bg-white shadow-xs">
                    <div className="border-b border-[#e4eaec] px-6 py-4">
                        <h2 className="text-sm font-bold text-slate-800">
                            Riwayat Transaksi Buku Kas Yayasan
                        </h2>
                        <p className="text-xs text-slate-500">
                            Pencatatan mutasi kas pemasukan donasi, non-donasi,
                            dan pengeluaran operasional.
                        </p>
                    </div>

                    {!transaksiList || transaksiList.data.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-12 text-center">
                            <FileText className="size-10 text-slate-300" />
                            <h3 className="mt-3 text-sm font-bold text-slate-700">
                                Belum Ada Catatan Transaksi
                            </h3>
                            <p className="mt-1 text-xs text-slate-500">
                                Mutasi kas dari verifikasi donasi maupun
                                pencatatan manual akan tampil di sini.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead>
                                    <tr className="border-b border-[#e4eaec] bg-slate-50/70 font-semibold text-slate-600">
                                        <th className="px-6 py-3.5">
                                            Kode & Tanggal
                                        </th>
                                        <th className="px-6 py-3.5">
                                            Sumber Dana
                                        </th>
                                        <th className="px-6 py-3.5">
                                            Kategori & Keterangan
                                        </th>
                                        <th className="px-6 py-3.5">Nominal</th>
                                        <th className="px-6 py-3.5 text-center">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#e4eaec]">
                                    {transaksiList.data.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="hover:bg-slate-50/60"
                                        >
                                            <td className="px-6 py-4">
                                                <span className="font-mono font-medium text-slate-800">
                                                    {item.kode_transaksi}
                                                </span>
                                                <span className="block text-[11px] text-slate-400">
                                                    {item.tanggal_transaksi}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {item.sumber_dana ===
                                                'donasi' ? (
                                                    <span className="inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                                                        <HeartHandshake className="size-3" />{' '}
                                                        Dana Donasi
                                                    </span>
                                                ) : item.sumber_dana ===
                                                  'operasional' ? (
                                                    <span className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                                                        <Building2 className="size-3" />{' '}
                                                        Kas Operasional
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 rounded-md border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
                                                        Belum Terklasifikasi
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="font-semibold text-slate-800">
                                                    {item.kategori}
                                                </p>
                                                <p className="text-[11px] text-slate-500">
                                                    {item.keterangan}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`font-semibold ${
                                                        item.tipe ===
                                                        'pemasukan'
                                                            ? 'text-emerald-600'
                                                            : 'text-rose-600'
                                                    }`}
                                                >
                                                    {item.tipe === 'pemasukan'
                                                        ? '+'
                                                        : '-'}
                                                    {formatRupiah(item.nominal)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span
                                                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                                                        item.status_transaksi ===
                                                        'valid'
                                                            ? 'bg-emerald-50 text-emerald-700'
                                                            : 'bg-rose-50 text-rose-700'
                                                    }`}
                                                >
                                                    {item.status_transaksi}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Input Transaksi */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="font-poppins text-lg font-bold text-slate-800">
                            {form.data.tipe === 'pemasukan'
                                ? 'Catat Pemasukan Kas'
                                : 'Catat Pengeluaran Kas'}
                        </DialogTitle>
                        <DialogDescription className="text-xs text-slate-500">
                            Tentukan sumber dana secara eksplisit untuk menjaga
                            pemisahan buku kas yayasan.
                        </DialogDescription>
                    </DialogHeader>

                    <form
                        onSubmit={handleFormSubmit}
                        className="space-y-4 pt-2 font-poppins text-xs"
                    >
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="mb-1 block font-semibold text-slate-700">
                                    Tipe Transaksi{' '}
                                    <span className="text-rose-500">*</span>
                                </label>
                                <select
                                    value={form.data.tipe}
                                    onChange={(e) =>
                                        form.setData('tipe', e.target.value)
                                    }
                                    className="w-full rounded-lg border border-[#e4eaec] bg-white px-3 py-2 text-xs text-slate-800 outline-none focus:border-[#14bace]"
                                >
                                    <option value="pengeluaran">
                                        Pengeluaran (Kas Keluar)
                                    </option>
                                    <option value="pemasukan">
                                        Pemasukan Non-Donasi
                                    </option>
                                </select>
                            </div>

                            <div>
                                <label className="mb-1 block font-semibold text-slate-700">
                                    Sumber Dana{' '}
                                    <span className="text-rose-500">*</span>
                                </label>
                                <select
                                    value={form.data.sumber_dana}
                                    onChange={(e) =>
                                        form.setData(
                                            'sumber_dana',
                                            e.target.value,
                                        )
                                    }
                                    className="w-full rounded-lg border border-[#e4eaec] bg-white px-3 py-2 text-xs text-slate-800 outline-none focus:border-[#14bace]"
                                >
                                    <option value="donasi">
                                        Dana Donasi (Amanah)
                                    </option>
                                    <option value="operasional">
                                        Kas Operasional Yayasan
                                    </option>
                                </select>
                                {form.errors.sumber_dana && (
                                    <p className="mt-1 text-[11px] text-rose-500">
                                        {form.errors.sumber_dana}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="kategori_trx"
                                className="mb-1 block font-semibold text-slate-700"
                            >
                                Kategori Transaksi{' '}
                                <span className="text-rose-500">*</span>
                            </label>
                            <input
                                id="kategori_trx"
                                type="text"
                                placeholder="mis. Santunan Yatim / Listrik / Alat Tulis"
                                value={form.data.kategori}
                                onChange={(e) =>
                                    form.setData('kategori', e.target.value)
                                }
                                className="w-full rounded-lg border border-[#e4eaec] bg-white px-3 py-2 text-xs text-slate-800 outline-none focus:border-[#14bace]"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label
                                    htmlFor="nominal_trx"
                                    className="mb-1 block font-semibold text-slate-700"
                                >
                                    Nominal (Rp){' '}
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
                                    className="w-full rounded-lg border border-[#e4eaec] bg-white px-3 py-2 text-xs text-slate-800 outline-none focus:border-[#14bace]"
                                    required
                                />
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
                                    className="w-full rounded-lg border border-[#e4eaec] bg-white px-3 py-2 text-xs text-slate-800 outline-none focus:border-[#14bace]"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="keterangan_trx"
                                className="mb-1 block font-semibold text-slate-700"
                            >
                                Keterangan Detail{' '}
                                <span className="text-rose-500">*</span>
                            </label>
                            <textarea
                                id="keterangan_trx"
                                rows={2}
                                placeholder="Tuliskan tujuan mutasi kas secara rinci..."
                                value={form.data.keterangan}
                                onChange={(e) =>
                                    form.setData('keterangan', e.target.value)
                                }
                                className="w-full rounded-lg border border-[#e4eaec] bg-white px-3 py-2 text-xs text-slate-800 outline-none focus:border-[#14bace]"
                                required
                            />
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
