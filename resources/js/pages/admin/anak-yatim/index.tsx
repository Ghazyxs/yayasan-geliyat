import { Head } from '@inertiajs/react';
import { UsersRound, Plus, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AnakYatimAdmin() {
    return (
        <>
            <Head title="Pengelolaan Anak Yatim" />
            <div className="flex flex-col gap-6 p-6 font-poppins">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-[#087f8c] bg-[#e8f8fa] px-2.5 py-1 rounded-md w-fit mb-2">
                            <ShieldCheck className="size-3.5" />
                            Data Rahasia Binaan Yayasan
                        </div>
                        <h1 className="text-2xl font-bold text-[#1b2929]">
                            Pengelolaan Data Anak Yatim
                        </h1>
                        <p className="text-sm text-[#718083] mt-1">
                            Kelola profil anak binaan di 5 kelurahan binaan Yayasan Geliyat.
                        </p>
                    </div>
                    <Button className="bg-[#12b8c8] hover:bg-[#0fa0ae] text-white flex items-center gap-2">
                        <Plus className="size-4" /> Tambah Data Anak
                    </Button>
                </div>

                <div className="rounded-xl border border-[#e4eaec] bg-white p-6 shadow-xs">
                    <div className="flex items-center gap-3 text-sm text-[#718083]">
                        <UsersRound className="size-5 text-[#087f8c]" />
                        <span>Modul CRUD Pengelolaan Anak Yatim (Phase 4). Data saat ini siap dihubungkan ke database.</span>
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

