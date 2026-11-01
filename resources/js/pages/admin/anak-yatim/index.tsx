import { Head } from '@inertiajs/react';
import { UsersRound, Plus, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AnakYatimAdmin() {
    return (
        <>
            <Head title="Pengelolaan Anak Yatim" />
            <div className="flex flex-col gap-6 p-6 font-poppins">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="mb-2 flex w-fit items-center gap-2 rounded-md bg-[#e8f8fa] px-2.5 py-1 text-xs font-semibold text-[#087f8c]">
                            <ShieldCheck className="size-3.5" />
                            Data Rahasia Binaan Yayasan
                        </div>
                        <h1 className="text-2xl font-bold text-[#1b2929]">
                            Pengelolaan Data Anak Yatim
                        </h1>
                        <p className="mt-1 text-sm text-[#718083]">
                            Kelola profil anak binaan di 5 kelurahan binaan
                            Yayasan Geliyat.
                        </p>
                    </div>
                    <Button className="flex items-center gap-2 bg-[#12b8c8] text-white hover:bg-[#0fa0ae]">
                        <Plus className="size-4" /> Tambah Data Anak
                    </Button>
                </div>

                <div className="rounded-xl border border-[#e4eaec] bg-white p-6 shadow-xs">
                    <div className="flex items-center gap-3 text-sm text-[#718083]">
                        <UsersRound className="size-5 text-[#087f8c]" />
                        <span>
                            Modul CRUD Pengelolaan Anak Yatim (Phase 4). Data
                            saat ini siap dihubungkan ke database.
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
}

AnakYatimAdmin.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Pengelolaan Anak Yatim', href: '/admin/anak-yatim' },
    ],
};
