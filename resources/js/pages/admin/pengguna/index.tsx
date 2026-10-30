import { Head } from '@inertiajs/react';
import { ShieldCheck, UserPlus, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PenggunaAdmin() {
    const mockUsers = [
        {
            name: 'H. Ahmad Fauzi',
            email: 'ketua@geliyat.or.id',
            role: 'Super Admin',
            bidang: 'Pimpinan Yayasan',
            phone: '081234567890',
            status: 'Aktif',
        },
        {
            name: 'Ibu Siti Rahmah',
            email: 'admin@geliyat.or.id',
            role: 'Admin',
            bidang: 'Kemanusiaan & Yatim',
            phone: '081298765432',
            status: 'Aktif',
        },
    ];

    return (
        <>
            <Head title="Manajemen Pengguna - Super Admin" />
            <div className="flex flex-col gap-6 p-6 font-poppins">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-purple-700 bg-purple-50 border border-purple-200 px-2.5 py-1 rounded-md w-fit mb-2">
                            <ShieldCheck className="size-3.5" />
                            Akses Khusus Super Admin
                        </div>
                        <h1 className="text-2xl font-bold text-[#1b2929]">
                            Manajemen Akun Pengurus Yayasan
                        </h1>
                        <p className="text-sm text-[#718083] mt-1">
                            Kelola kredensial pengurus, hak akses bidang, dan wewenang operasional.
                        </p>
                    </div>
                    <Button className="bg-[#12b8c8] hover:bg-[#0fa0ae] text-white flex items-center gap-2 text-xs">
                        <UserPlus className="size-4" /> Tambah Pengurus Baru
                    </Button>
                </div>

                <div className="overflow-hidden rounded-xl border border-[#e4eaec] bg-white shadow-xs">
                    <div className="p-4 border-b border-[#f0f4f5] bg-gray-50 flex items-center justify-between">
                        <span className="text-xs font-semibold text-gray-700">Daftar Pengguna Terdaftar ({mockUsers.length})</span>
                        <span className="text-xs text-gray-500">Pendaftaran akun mandiri dinonaktifkan demi keamanan</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-[#1b2929]">
                            <thead className="border-b border-[#f0f4f5] text-xs font-semibold uppercase text-gray-500 bg-white">
                                <tr>
                                    <th className="px-6 py-3.5">Nama & Kontak</th>
                                    <th className="px-6 py-3.5">Peran</th>
                                    <th className="px-6 py-3.5">Bidang Kerja</th>
                                    <th className="px-6 py-3.5">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#f0f4f5]">
                                {mockUsers.map((u) => (
                                    <tr key={u.email} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-sm">{u.name}</div>
                                            <div className="text-xs text-[#718083]">{u.email} • {u.phone}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${u.role === 'Super Admin' ? 'bg-purple-100 text-purple-700' : 'bg-teal-100 text-teal-800'}`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-xs font-medium text-gray-600">
                                            {u.bidang}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
                                                <CheckCircle2 className="size-3.5 text-emerald-600" /> {u.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}

PenggunaAdmin.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Manajemen Pengguna', href: '/admin/pengguna' },
    ],
};

