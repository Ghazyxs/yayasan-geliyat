import { Head } from '@inertiajs/react';
import { ChartNoAxesCombined, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LaporanAdmin() {
    return (
        <>
            <Head title="Laporan Operasional" />
            <div className="flex flex-col gap-6 p-6 font-poppins">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-[#087f8c] bg-[#e8f8fa] px-2.5 py-1 rounded-md w-fit mb-2">
                            <ChartNoAxesCombined className="size-3.5" />
                            Transparansi & Akuntabilitas
                        </div>
                        <h1 className="text-2xl font-bold text-[#1b2929]">
                            Laporan Operasional & Penyaluran
                        </h1>
                        <p className="text-sm text-[#718083] mt-1">
                            Laporan rekapitulasi data binaan, aktivitas bidang, dan distribusi bantuan.
                        </p>
                    </div>
                    <Button variant="outline" className="flex items-center gap-2">
                        <Download className="size-4" /> Unduh Rekap PDF
                    </Button>
                </div>

                <div className="rounded-xl border border-[#e4eaec] bg-white p-6 shadow-xs">
                    <div className="flex items-center gap-3 text-sm text-[#718083]">
                        <ChartNoAxesCombined className="size-5 text-[#087f8c]" />
                        <span>Modul Laporan Operasional & Penyaluran Yayasan.</span>
                    </div>
                </div>
            </div>
        </>
    );
}

LaporanAdmin.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Laporan', href: '/admin/laporan' },
    ],
};

