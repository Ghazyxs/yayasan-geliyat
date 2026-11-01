import { Head } from '@inertiajs/react';
import { Wallet, Plus, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function KeuanganAdmin() {
    return (
        <>
            <Head title="Manajemen Keuangan - Super Admin" />
            <div className="flex flex-col gap-6 p-6 font-poppins">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="mb-2 flex w-fit items-center gap-2 rounded-md border border-purple-200 bg-purple-50 px-2.5 py-1 text-xs font-semibold text-purple-700">
                            <Wallet className="size-3.5" />
                            Akses Khusus Super Admin (Ketua)
                        </div>
                        <h1 className="text-2xl font-bold text-[#1b2929]">
                            Manajemen Keuangan & Kas Yayasan
                        </h1>
                        <p className="mt-1 text-sm text-[#718083]">
                            Pencatatan arus kas, rekap donasi masuk, dan
                            verifikasi pengeluaran operasional.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button className="flex items-center gap-2 bg-[#12b8c8] text-xs text-white hover:bg-[#0fa0ae]">
                            <Plus className="size-4" /> Catat Pemasukan
                        </Button>
                        <Button
                            variant="outline"
                            className="flex items-center gap-2 border-rose-200 text-xs text-rose-600 hover:bg-rose-50"
                        >
                            <Plus className="size-4" /> Catat Pengeluaran
                        </Button>
                    </div>
                </div>

                {/* Financial Summary Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-xl border border-[#e4eaec] bg-white p-5 shadow-xs">
                        <span className="block text-xs font-medium text-[#718083]">
                            Total Pemasukan (Mei–Okt)
                        </span>
                        <div className="mt-2 flex items-center justify-between">
                            <span className="text-xl font-bold text-emerald-600">
                                Rp102.500.000
                            </span>
                            <TrendingUp className="size-5 text-emerald-500" />
                        </div>
                    </div>
                    <div className="rounded-xl border border-[#e4eaec] bg-white p-5 shadow-xs">
                        <span className="block text-xs font-medium text-[#718083]">
                            Total Pengeluaran (Mei–Okt)
                        </span>
                        <div className="mt-2 flex items-center justify-between">
                            <span className="text-xl font-bold text-rose-600">
                                Rp67.250.000
                            </span>
                            <TrendingDown className="size-5 text-rose-500" />
                        </div>
                    </div>
                    <div className="rounded-xl border border-[#cbebf0] bg-[#e8f8fa] p-5 shadow-xs">
                        <span className="block text-xs font-semibold text-[#087f8c]">
                            Sisa Saldo Kas
                        </span>
                        <div className="mt-2 flex items-center justify-between">
                            <span className="text-xl font-bold text-[#1b2929]">
                                Rp35.250.000
                            </span>
                            <Wallet className="size-5 text-[#087f8c]" />
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border border-[#e4eaec] bg-white p-6 shadow-xs">
                    <div className="flex items-center gap-3 text-sm text-[#718083]">
                        <Wallet className="size-5 text-[#087f8c]" />
                        <span>
                            Modul Pembukuan & Laporan Keuangan Yayasan (Phase
                            6).
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
}

KeuanganAdmin.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Keuangan', href: '/admin/keuangan' },
    ],
};
