import { Head, useForm, usePage } from '@inertiajs/react';
import {
    ShieldCheck,
    UserPlus,
    CheckCircle2,
    AlertTriangle,
} from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface BidangOption {
    id: number;
    kode: string;
    nama: string;
}

interface UserItem {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    role: 'admin' | 'super_admin';
    role_label: string;
    bidang_id: number | null;
    bidang_nama: string;
    is_active: boolean;
    status_label: string;
    created_at_formatted?: string | null;
}

interface PenggunaAdminProps {
    users?: UserItem[];
    bidangList?: BidangOption[];
}

export default function PenggunaAdmin({
    users = [],
    bidangList = [],
}: PenggunaAdminProps) {
    const pageProps = usePage<{
        flash?: { success?: string | null; error?: string | null };
    }>().props;

    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const defaultBidangId = bidangList[0] ? String(bidangList[0].id) : '';

    const form = useForm<{
        name: string;
        email: string;
        phone: string;
        role: 'admin' | 'super_admin';
        bidang_id: string;
        password: string;
        password_confirmation: string;
    }>({
        name: '',
        email: '',
        phone: '',
        role: 'admin',
        bidang_id: defaultBidangId,
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        if (pageProps.flash?.success) {
            toast.success(pageProps.flash.success);
        } else if (pageProps.flash?.error) {
            toast.error(pageProps.flash.error);
        }
    }, [pageProps.flash]);

    const openCreateModal = () => {
        form.clearErrors();
        form.setData({
            name: '',
            email: '',
            phone: '',
            role: 'admin',
            bidang_id: bidangList[0] ? String(bidangList[0].id) : '',
            password: '',
            password_confirmation: '',
        });
        setIsCreateOpen(true);
    };

    const handleRoleChange = (val: string) => {
        const nextRole = val as 'admin' | 'super_admin';
        form.setData((prev) => ({
            ...prev,
            role: nextRole,
            bidang_id:
                nextRole === 'super_admin'
                    ? ''
                    : prev.bidang_id || defaultBidangId,
        }));
    };

    const handleCreateSubmit = (e: FormEvent) => {
        e.preventDefault();
        form.post('/admin/pengguna', {
            preserveScroll: true,
            onSuccess: () => {
                setIsCreateOpen(false);
                form.reset();
            },
            onError: () => {
                toast.error(
                    'Gagal menambahkan akun pengurus. Periksa kembali isian formulir.',
                );
            },
        });
    };

    return (
        <>
            <Head title="Manajemen Pengguna - Super Admin" />

            <div className="flex flex-col gap-6 p-6 font-poppins">
                {/* Flash Notification Banner */}
                {pageProps.flash?.success && (
                    <div className="flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50/90 px-4 py-3 text-sm text-emerald-800 shadow-2xs">
                        <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
                        <span>{pageProps.flash.success}</span>
                    </div>
                )}

                {pageProps.flash?.error && (
                    <div className="flex items-center gap-2.5 rounded-xl border border-rose-200 bg-rose-50/90 px-4 py-3 text-sm text-rose-800 shadow-2xs">
                        <AlertTriangle className="size-4 shrink-0 text-rose-600" />
                        <span>{pageProps.flash.error}</span>
                    </div>
                )}

                {/* Header Section */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="mb-2 flex w-fit items-center gap-2 rounded-md border border-purple-200 bg-purple-50 px-2.5 py-1 text-xs font-semibold text-purple-700">
                            <ShieldCheck className="size-3.5" />
                            Akses Khusus Super Admin
                        </div>
                        <h1 className="text-2xl font-bold text-[#1b2929]">
                            Manajemen Akun Pengurus Yayasan
                        </h1>
                        <p className="mt-1 text-sm text-[#718083]">
                            Kelola kredensial pengurus, hak akses bidang, dan
                            wewenang operasional.
                        </p>
                    </div>
                    <Button
                        type="button"
                        onClick={openCreateModal}
                        className="flex items-center gap-2 bg-[#12b8c8] text-xs font-semibold text-white hover:bg-[#0fa0ae]"
                    >
                        <UserPlus className="size-4" /> Tambah Pengurus Baru
                    </Button>
                </div>

                {/* Tabel Pengguna Terdaftar dari Database */}
                <div className="overflow-hidden rounded-xl border border-[#e4eaec] bg-white shadow-xs">
                    <div className="flex flex-col justify-between gap-2 border-b border-[#f0f4f5] bg-gray-50 p-4 sm:flex-row sm:items-center">
                        <span className="text-xs font-semibold text-gray-700">
                            Daftar Pengguna Terdaftar ({users.length})
                        </span>
                        <span className="text-xs text-gray-500">
                            Pendaftaran akun mandiri dinonaktifkan demi keamanan
                        </span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-[#1b2929]">
                            <thead className="border-b border-[#f0f4f5] bg-white text-xs font-semibold text-gray-500 uppercase">
                                <tr>
                                    <th className="px-6 py-3.5">
                                        Nama & Kontak
                                    </th>
                                    <th className="px-6 py-3.5">Peran</th>
                                    <th className="px-6 py-3.5">
                                        Bidang Kerja
                                    </th>
                                    <th className="px-6 py-3.5">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#f0f4f5]">
                                {users.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="px-6 py-10 text-center text-xs text-gray-500"
                                        >
                                            Belum ada akun pengurus terdaftar.
                                        </td>
                                    </tr>
                                ) : (
                                    users.map((u) => (
                                        <tr
                                            key={u.id}
                                            className="transition-colors hover:bg-gray-50/50"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-semibold">
                                                    {u.name}
                                                </div>
                                                <div className="text-xs text-[#718083]">
                                                    {u.email}
                                                    {u.phone
                                                        ? ` • ${u.phone}`
                                                        : ''}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                        u.role === 'super_admin'
                                                            ? 'bg-purple-100 text-purple-700'
                                                            : 'bg-teal-100 text-teal-800'
                                                    }`}
                                                >
                                                    {u.role_label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-xs font-medium text-gray-600">
                                                {u.bidang_nama}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                                                        u.is_active
                                                            ? 'text-emerald-700'
                                                            : 'text-rose-600'
                                                    }`}
                                                >
                                                    <CheckCircle2
                                                        className={`size-3.5 ${
                                                            u.is_active
                                                                ? 'text-emerald-600'
                                                                : 'text-rose-500'
                                                        }`}
                                                    />
                                                    {u.status_label}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* MODAL TAMBAH PENGURUS BARU */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="max-h-[90vh] overflow-y-auto border-[#e4eaec] bg-white font-poppins text-slate-800 sm:max-w-lg">
                    <form onSubmit={handleCreateSubmit} className="space-y-4">
                        <DialogHeader>
                            <DialogTitle className="text-lg font-bold text-slate-800">
                                Tambah Akun Pengurus Baru
                            </DialogTitle>
                            <DialogDescription className="text-xs text-slate-500">
                                Buat akun pengurus agar dapat masuk ke sistem
                                sesuai peran dan bidang kerjanya. Kata sandi
                                otomatis terenkripsi aman.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-3.5 pt-1 text-xs">
                            <div className="space-y-1.5">
                                <Label
                                    htmlFor="pengguna_name"
                                    className="text-xs font-medium text-slate-700"
                                >
                                    Nama Lengkap Pengurus{' '}
                                    <span className="text-rose-500">*</span>
                                </Label>
                                <Input
                                    id="pengguna_name"
                                    required
                                    value={form.data.name}
                                    onChange={(e) =>
                                        form.setData('name', e.target.value)
                                    }
                                    placeholder="Contoh: Ust. Ahmad Fauzi"
                                    className="border-[#e4eaec] bg-white text-slate-800 shadow-none focus-visible:border-[#14bace] focus-visible:ring-2 focus-visible:ring-[#14bace]/20"
                                />
                                <InputError message={form.errors.name} />
                            </div>

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <div className="space-y-1.5">
                                    <Label
                                        htmlFor="pengguna_email"
                                        className="text-xs font-medium text-slate-700"
                                    >
                                        Alamat Email{' '}
                                        <span className="text-rose-500">*</span>
                                    </Label>
                                    <Input
                                        id="pengguna_email"
                                        type="email"
                                        required
                                        value={form.data.email}
                                        onChange={(e) =>
                                            form.setData(
                                                'email',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="nama@geliyat.or.id"
                                        className="border-[#e4eaec] bg-white text-slate-800 shadow-none focus-visible:border-[#14bace] focus-visible:ring-2 focus-visible:ring-[#14bace]/20"
                                    />
                                    <InputError message={form.errors.email} />
                                </div>

                                <div className="space-y-1.5">
                                    <Label
                                        htmlFor="pengguna_phone"
                                        className="text-xs font-medium text-slate-700"
                                    >
                                        Nomor Telepon / WhatsApp (Opsional)
                                    </Label>
                                    <Input
                                        id="pengguna_phone"
                                        type="tel"
                                        value={form.data.phone}
                                        onChange={(e) =>
                                            form.setData(
                                                'phone',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="081234567890"
                                        className="border-[#e4eaec] bg-white text-slate-800 shadow-none focus-visible:border-[#14bace] focus-visible:ring-2 focus-visible:ring-[#14bace]/20"
                                    />
                                    <InputError message={form.errors.phone} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <div className="space-y-1.5">
                                    <Label
                                        htmlFor="pengguna_role"
                                        className="text-xs font-medium text-slate-700"
                                    >
                                        Peran & Hak Akses{' '}
                                        <span className="text-rose-500">*</span>
                                    </Label>
                                    <BrandSelect
                                        id="pengguna_role"
                                        value={form.data.role}
                                        onValueChange={handleRoleChange}
                                        options={[
                                            {
                                                value: 'admin',
                                                label: 'Admin Bidang',
                                            },
                                            {
                                                value: 'super_admin',
                                                label: 'Super Admin',
                                            },
                                        ]}
                                    />
                                    <InputError message={form.errors.role} />
                                </div>

                                {form.data.role === 'admin' ? (
                                    <div className="space-y-1.5">
                                        <Label
                                            htmlFor="pengguna_bidang"
                                            className="text-xs font-medium text-slate-700"
                                        >
                                            Bidang Kerja{' '}
                                            <span className="text-rose-500">
                                                *
                                            </span>
                                        </Label>
                                        <BrandSelect
                                            id="pengguna_bidang"
                                            value={form.data.bidang_id}
                                            onValueChange={(val) =>
                                                form.setData('bidang_id', val)
                                            }
                                            options={bidangList.map((b) => ({
                                                value: String(b.id),
                                                label: b.nama,
                                            }))}
                                        />
                                        <InputError
                                            message={form.errors.bidang_id}
                                        />
                                    </div>
                                ) : (
                                    <div className="flex items-center rounded-lg border border-purple-200 bg-purple-50/70 px-3 py-2 text-[11px] text-purple-800">
                                        Super Admin memiliki wewenang akses
                                        lintas seluruh bidang yayasan.
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <div className="space-y-1.5">
                                    <Label
                                        htmlFor="pengguna_password"
                                        className="text-xs font-medium text-slate-700"
                                    >
                                        Kata Sandi{' '}
                                        <span className="text-rose-500">*</span>
                                    </Label>
                                    <Input
                                        id="pengguna_password"
                                        type="password"
                                        required
                                        minLength={8}
                                        value={form.data.password}
                                        onChange={(e) =>
                                            form.setData(
                                                'password',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Minimal 8 karakter"
                                        className="border-[#e4eaec] bg-white text-slate-800 shadow-none focus-visible:border-[#14bace] focus-visible:ring-2 focus-visible:ring-[#14bace]/20"
                                    />
                                    <InputError
                                        message={form.errors.password}
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label
                                        htmlFor="pengguna_password_confirmation"
                                        className="text-xs font-medium text-slate-700"
                                    >
                                        Konfirmasi Kata Sandi{' '}
                                        <span className="text-rose-500">*</span>
                                    </Label>
                                    <Input
                                        id="pengguna_password_confirmation"
                                        type="password"
                                        required
                                        minLength={8}
                                        value={form.data.password_confirmation}
                                        onChange={(e) =>
                                            form.setData(
                                                'password_confirmation',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Ulangi kata sandi"
                                        className="border-[#e4eaec] bg-white text-slate-800 shadow-none focus-visible:border-[#14bace] focus-visible:ring-2 focus-visible:ring-[#14bace]/20"
                                    />
                                    <InputError
                                        message={
                                            form.errors.password_confirmation
                                        }
                                    />
                                </div>
                            </div>
                        </div>

                        <DialogFooter className="gap-2 pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsCreateOpen(false)}
                                className="border-[#e4eaec] text-xs text-slate-600"
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                disabled={form.processing}
                                className="bg-[#12b8c8] text-xs font-semibold text-white hover:bg-[#0fa0ae]"
                            >
                                {form.processing
                                    ? 'Menyimpan...'
                                    : 'Simpan Akun Pengurus'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

PenggunaAdmin.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Manajemen Pengguna', href: '/admin/pengguna' },
    ],
};
