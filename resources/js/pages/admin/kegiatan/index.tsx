import { Head } from '@inertiajs/react';
import { CalendarDays, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function KegiatanAdmin() {
    return (
        <>
            <Head title="Pengelolaan Kegiatan" />
            <div className="flex flex-col gap-6 p-6 font-poppins">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="mb-2 flex w-fit items-center gap-2 rounded-md bg-[#e8f8fa] px-2.5 py-1 text-xs font-semibold text-[#087f8c]">
                            <CalendarDays className="size-3.5" />
                            Aktivitas & Program
                        </div>
                        <h1 className="text-2xl font-bold text-[#1b2929]">
                            Pengelolaan Kegiatan Yayasan
                        </h1>
                        <p className="mt-1 text-sm text-[#718083]">
                            Publikasikan agenda pendampingan, santunan, dan
                            dokumentasi kegiatan.
                        </p>
                    </div>
                    <Button className="flex items-center gap-2 bg-[#12b8c8] text-white hover:bg-[#0fa0ae]">
                        <Plus className="size-4" /> Tambah Kegiatan
                    </Button>
                </div>

                <div className="rounded-xl border border-[#e4eaec] bg-white p-6 shadow-xs">
                    <div className="flex items-center gap-3 text-sm text-[#718083]">
                        <CalendarDays className="size-5 text-[#087f8c]" />
                        <span>
                            Modul Pengelolaan Kegiatan (Phase 5). Dilengkapi
                            integrasi AI untuk ringkasan artikel kegiatan.
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
}

KegiatanAdmin.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Pengelolaan Kegiatan', href: '/admin/kegiatan' },
    ],
};
