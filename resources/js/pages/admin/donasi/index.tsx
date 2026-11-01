import { Head } from '@inertiajs/react';
import { HeartHandshake, CheckCircle2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DonasiAdmin() {
    return (
        <>
            <Head title="Pengelolaan Donasi" />
            <div className="flex flex-col gap-6 p-6 font-poppins">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="mb-2 flex w-fit items-center gap-2 rounded-md bg-[#e8f8fa] px-2.5 py-1 text-xs font-semibold text-[#087f8c]">
                            <HeartHandshake className="size-3.5" />
                            Amanah Donatur
                        </div>
                        <h1 className="text-2xl font-bold text-[#1b2929]">
                            Pengelolaan & Verifikasi Donasi
                        </h1>
                        <p className="mt-1 text-sm text-[#718083]">
                            Verifikasi bukti transfer WhatsApp dan kelola
                            alokasi donasi anak yatim.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            className="flex items-center gap-2"
                        >
                            <Clock className="size-4 text-amber-500" /> 3
                            Menunggu Verifikasi
                        </Button>
                    </div>
                </div>

                <div className="rounded-xl border border-[#e4eaec] bg-white p-6 shadow-xs">
                    <div className="flex items-center gap-3 text-sm text-[#718083]">
                        <CheckCircle2 className="size-5 text-[#087f8c]" />
                        <span>
                            Modul Pengelolaan Donasi (Phase 4). Dilengkapi
                            pencocokan bukti transfer WhatsApp.
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
}

DonasiAdmin.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Pengelolaan Donasi', href: '/admin/donasi' },
    ],
};
