import { useState } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import {
    UsersRound,
    HeartHandshake,
    Wallet,
    CalendarPlus,
    UserPlus,
    LogOut,
    CreditCard,
    Clock,
    AlertTriangle,
    Plus,
    Building2,
    CalendarDays,
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
import type { User } from '@/types';

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

interface JenjangDistribusi {
    label: string;
    count: number;
    percent: string;
    color: string;
}

interface DashboardProps {
    isSuperAdmin?: boolean;
    ringkasanKeuangan?: RingkasanKeuangan | null;
    totalAnakYatim?: number;
    donasiMenungguCount?: number;
    donasiMenungguNominal?: number;
    rekeningAktifCount?: number;
    kegiatanBidangCount?: number;
    distribusiPendidikan?: JenjangDistribusi[];
    namaBidang?: string;
    appEnv?: string;
}

export default function Dashboard({
    isSuperAdmin: serverIsSuperAdmin,
    ringkasanKeuangan = null,
    totalAnakYatim = 0,
    donasiMenungguCount = 0,
    donasiMenungguNominal = 0,
    rekeningAktifCount = 0,
    kegiatanBidangCount = 0,
    distribusiPendidikan = [],
    namaBidang = 'Unit Kerja',
    appEnv: serverAppEnv,
}: DashboardProps) {
    const { auth, appEnv: sharedAppEnv } = usePage().props as unknown as {
        auth: { user: User };
        appEnv?: string;
    };
    const user = auth?.user;
    const isSuperAdmin = serverIsSuperAdmin ?? user?.role === 'super_admin';
    const currentAppEnv = serverAppEnv ?? sharedAppEnv ?? 'production';
    const isLocalEnv = currentAppEnv === 'local';

    const [isTrxModalOpen, setIsTrxModalOpen] = useState(false);

    const trxForm = useForm({
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

    const handleTrxSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        trxForm.post('/admin/transaksi', {
            onSuccess: () => {
                setIsTrxModalOpen(false);
                trxForm.reset();
            },
        });
    };

    const educationData =
        distribusiPendidikan.length > 0
            ? distribusiPendidikan
            : [
                  {
                      label: 'Sekolah Dasar (SD)',
                      count: 0,
                      percent: '0%',
                      color: 'bg-[#14bace]',
                  },
                  {
                      label: 'Sekolah Menengah Pertama (SMP)',
                      count: 0,
                      percent: '0%',
                      color: 'bg-[#087f8c]',
                  },
                  {
                      label: 'Sekolah Menengah Atas (SMA)',
                      count: 0,
                      percent: '0%',
                      color: 'bg-amber-400',
                  },
                  {
                      label: 'Perguruan Tinggi / Kuliah',
                      count: 0,
                      percent: '0%',
                      color: 'bg-purple-500',
                  },
              ];

    return (
        <div className="flex min-h-screen flex-col gap-8 bg-[#f7f9fa] p-6 font-poppins text-[#1d2b2d] md:p-8">
            <Head
                title={`Dashboard - ${isSuperAdmin ? 'Super Admin' : 'Admin Yayasan'}`}
            />

            {/* Top Greeting Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                    <div className="mb-2 flex items-center gap-2">
                        <span className="text-xs font-medium text-[#718083]">
                            Sistem Informasi Yayasan Geliyat
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#cbebf0] bg-[#e8f8fa] px-2.5 py-0.5 text-[10px] font-semibold text-[#087f8c]">
                            <span className="size-1.5 animate-pulse rounded-full bg-[#14bace]" />
                            {isSuperAdmin
                                ? 'Ruang Kerja Super Admin (Ketua)'
                                : `Admin Bidang: ${namaBidang}`}
                        </span>
                    </div>

                    <h1 className="text-2xl font-bold tracking-tight text-[#1b2929] sm:text-3xl">
                        {isSuperAdmin ? (
                            'Gambaran besar, dampak nyata.'
                        ) : (
                            <>
                                Selamat pagi,{' '}
                                {user?.name
                                    ? user.name.split(' ')[0]
                                    : 'Pengurus'}{' '}
                                👋
                            </>
                        )}
                    </h1>
                    <p className="mt-1.5 text-sm text-[#718083]">
                        {isSuperAdmin
                            ? `Selamat datang kembali, ${user?.name}. Berikut ringkasan amanah donasi dan arus kas terpisah yayasan.`
                            : `Pantau pendampingan binaan dan aktivitas ${namaBidang} dalam ruang kerja aman.`}
                    </p>
                </div>

                {/* Role Switcher & User Account Card */}
                <div className="flex flex-wrap items-center gap-2">
                    {isLocalEnv && (
                        <div
                            className="flex items-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 p-1 text-xs shadow-xs"
                            title="Dev only — tidak tampil di production"
                        >
                            <span className="px-2 text-[10px] font-medium text-amber-500">
                                Uji Peran:
                            </span>
                            <a
                                href="/switch-role/super_admin"
                                className={`rounded-lg px-2.5 py-1 font-medium transition-colors ${
                                    isSuperAdmin
                                        ? 'bg-[#14bace] font-semibold text-white'
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`}
                                title="Beralih ke Super Admin (Ketua)"
                            >
                                Super Admin
                            </a>
                            <a
                                href="/switch-role/admin"
                                className={`rounded-lg px-2.5 py-1 font-medium transition-colors ${
                                    !isSuperAdmin
                                        ? 'bg-[#14bace] font-semibold text-white'
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`}
                                title="Beralih ke Admin (Bidang Kemanusiaan)"
                            >
                                Admin Bidang
                            </a>
                        </div>
                    )}

                    <div className="flex items-center gap-3 rounded-xl border border-[#e4eaec] bg-white px-3 py-1.5 shadow-2xs">
                        <div className="flex size-8 items-center justify-center rounded-lg bg-[#e8f8fa] font-bold text-[#087f8c]">
                            {user?.name ? user.name.charAt(0) : 'U'}
                        </div>
                        <div className="text-left text-xs">
                            <span className="block font-semibold text-[#1b2929]">
                                {user?.name}
                            </span>
                            <span className="text-[10px] text-gray-500 capitalize">
                                {user?.role?.replace('_', ' ')}
                            </span>
                        </div>
                        <Link
                            href="/logout"
                            method="post"
                            as="button"
                            className="ml-2 rounded-lg p-1.5 text-rose-500 transition-colors hover:bg-rose-50 hover:text-rose-700"
                            title="Keluar Akun"
                        >
                            <LogOut className="size-4" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* SUPER ADMIN VIEW: Comprehensive Finance & Foundation Overview */}
            {isSuperAdmin && ringkasanKeuangan ? (
                <>
                    {/* Top KPI Cards */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <Link
                            href="/admin/anak-yatim"
                            className="group flex flex-col justify-between rounded-2xl border border-[#e4eaec] bg-white p-6 shadow-xs transition-colors hover:border-[#14bace]"
                        >
                            <div className="space-y-1">
                                <span className="block text-[11px] font-medium tracking-wider text-[#718083] uppercase">
                                    Total Anak Yatim Binaan
                                </span>
                                <div className="text-3xl font-bold text-[#1b2929]">
                                    {totalAnakYatim}
                                </div>
                            </div>
                            <div className="mt-4 flex items-center justify-between border-t border-[#f0f4f5] pt-3 text-xs font-medium text-[#087f8c]">
                                <span>Anak binaan aktif</span>
                                <UsersRound className="size-4 text-[#14bace] transition-transform group-hover:scale-110" />
                            </div>
                        </Link>

                        <Link
                            href="/admin/donasi"
                            className="group flex flex-col justify-between rounded-2xl border border-[#e4eaec] bg-white p-6 shadow-xs transition-colors hover:border-amber-300"
                        >
                            <div className="space-y-1">
                                <span className="block text-[11px] font-medium tracking-wider text-amber-700 uppercase">
                                    Donasi Menunggu Verifikasi
                                </span>
                                <div className="text-3xl font-bold text-amber-800">
                                    {donasiMenungguCount}
                                </div>
                            </div>
                            <div className="mt-4 flex items-center justify-between border-t border-amber-100 pt-3 text-xs font-medium text-amber-700">
                                <span>
                                    {formatRupiah(donasiMenungguNominal)} belum
                                    masuk kas
                                </span>
                                <Clock className="size-4 text-amber-600 transition-transform group-hover:scale-110" />
                            </div>
                        </Link>

                        <Link
                            href="/admin/rekening"
                            className="group flex flex-col justify-between rounded-2xl border border-[#e4eaec] bg-white p-6 shadow-xs transition-colors hover:border-[#14bace]"
                        >
                            <div className="space-y-1">
                                <span className="block text-[11px] font-medium tracking-wider text-[#718083] uppercase">
                                    Rekening Yayasan Aktif
                                </span>
                                <div className="text-3xl font-bold text-[#1b2929]">
                                    {rekeningAktifCount}
                                </div>
                            </div>
                            <div className="mt-4 flex items-center justify-between border-t border-[#f0f4f5] pt-3 text-xs font-medium text-[#087f8c]">
                                <span>Penampung resmi publik</span>
                                <CreditCard className="size-4 text-[#14bace] transition-transform group-hover:scale-110" />
                            </div>
                        </Link>

                        <Link
                            href="/admin/keuangan"
                            className="group flex flex-col justify-between rounded-2xl border border-[#cbebf0] bg-[#e8f8fa] p-6 shadow-xs transition-colors hover:border-[#14bace]"
                        >
                            <div className="space-y-1">
                                <span className="block text-[11px] font-semibold tracking-wider text-[#087f8c] uppercase">
                                    Saldo Kas Operasional
                                </span>
                                <div className="text-2xl font-bold text-[#1b2929]">
                                    {formatRupiah(
                                        ringkasanKeuangan.operasional.saldo,
                                    )}
                                </div>
                            </div>
                            <div className="mt-4 flex items-center justify-between border-t border-[#cbebf0] pt-3 text-xs font-semibold text-[#087f8c]">
                                <span>Kas mandiri lembaga</span>
                                <Wallet className="size-4 text-[#087f8c] transition-transform group-hover:scale-110" />
                            </div>
                        </Link>
                    </div>

                    {/* Alert Transaksi Belum Terklasifikasi (sumber_dana = NULL) jika ada */}
                    {ringkasanKeuangan.konsolidasi.belum_terklasifikasi > 0 && (
                        <div className="flex items-start gap-3 rounded-2xl border border-amber-300 bg-amber-50/80 p-4 text-xs text-amber-800 shadow-xs">
                            <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-600" />
                            <div>
                                <span className="font-semibold">
                                    Pemberitahuan Transaksi Belum
                                    Terklasifikasi:
                                </span>
                                <p className="mt-0.5">
                                    Terdapat transaksi valid senilai{' '}
                                    <strong>
                                        {formatRupiah(
                                            ringkasanKeuangan.konsolidasi
                                                .belum_terklasifikasi,
                                        )}
                                    </strong>{' '}
                                    dengan sumber dana belum ditentukan (
                                    <code>sumber_dana = NULL</code>). Nilai ini{' '}
                                    <strong>tidak dimasukkan</strong> ke dalam
                                    saldo Dana Donasi maupun Kas Operasional
                                    sampai diklasifikasikan.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Dua Panel Finansial Terpisah */}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        {/* PANEL 1: KANTONG DANA DONASI */}
                        <div className="rounded-2xl border border-emerald-200 bg-white p-6 shadow-xs">
                            <div className="flex flex-col gap-1 border-b border-[#f0f4f5] pb-4 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <HeartHandshake className="size-4 text-emerald-600" />
                                        <h2 className="text-base font-bold text-slate-800">
                                            Kantong Dana Donasi
                                        </h2>
                                    </div>
                                    <p className="mt-0.5 text-xs text-slate-500">
                                        Amanah donatur khusus untuk santunan &
                                        program binaan yatim.
                                    </p>
                                </div>
                                <span className="w-fit rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
                                    Amanah Donatur
                                </span>
                            </div>

                            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
                                <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
                                    <span className="block text-[11px] font-medium text-slate-500">
                                        Total Donasi Masuk
                                    </span>
                                    <p className="mt-1 text-lg font-bold text-emerald-600">
                                        {formatRupiah(
                                            ringkasanKeuangan.donasi.masuk,
                                        )}
                                    </p>
                                    <span className="text-[10px] text-slate-400">
                                        Sah tercatat di kas
                                    </span>
                                </div>

                                <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
                                    <span className="block text-[11px] font-medium text-slate-500">
                                        Penyaluran Donasi
                                    </span>
                                    <p className="mt-1 text-lg font-bold text-rose-600">
                                        {formatRupiah(
                                            ringkasanKeuangan.donasi.keluar,
                                        )}
                                    </p>
                                    <span className="text-[10px] text-slate-400">
                                        Disalurkan ke binaan
                                    </span>
                                </div>

                                <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4">
                                    <span className="block text-[11px] font-semibold text-emerald-800">
                                        Saldo Dana Donasi
                                    </span>
                                    <p className="mt-1 text-lg font-bold text-emerald-700">
                                        {formatRupiah(
                                            ringkasanKeuangan.donasi.saldo,
                                        )}
                                    </p>
                                    <span className="text-[10px] text-emerald-600">
                                        Siap disalurkan
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* PANEL 2: KANTONG KAS OPERASIONAL YAYASAN */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
                            <div className="flex flex-col gap-1 border-b border-[#f0f4f5] pb-4 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <Building2 className="size-4 text-[#087f8c]" />
                                        <h2 className="text-base font-bold text-slate-800">
                                            Kas Operasional Yayasan
                                        </h2>
                                    </div>
                                    <p className="mt-0.5 text-xs text-slate-500">
                                        Arus kas mandiri lembaga di luar dana
                                        donasi amanah.
                                    </p>
                                </div>
                                <span className="w-fit rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600">
                                    Kas Mandiri Lembaga
                                </span>
                            </div>

                            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
                                <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
                                    <span className="block text-[11px] font-medium text-slate-500">
                                        Pemasukan Non-Donasi
                                    </span>
                                    <p className="mt-1 text-lg font-bold text-emerald-600">
                                        {formatRupiah(
                                            ringkasanKeuangan.operasional.masuk,
                                        )}
                                    </p>
                                    <span className="text-[10px] text-slate-400">
                                        Unit usaha & mitra
                                    </span>
                                </div>

                                <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
                                    <span className="block text-[11px] font-medium text-slate-500">
                                        Pengeluaran Operasional
                                    </span>
                                    <p className="mt-1 text-lg font-bold text-rose-600">
                                        {formatRupiah(
                                            ringkasanKeuangan.operasional
                                                .keluar,
                                        )}
                                    </p>
                                    <span className="text-[10px] text-slate-400">
                                        Listrik, cetak, ATK
                                    </span>
                                </div>

                                <div className="rounded-xl border border-[#cbebf0] bg-[#e8f8fa]/70 p-4">
                                    <span className="block text-[11px] font-semibold text-[#087f8c]">
                                        Saldo Kas Operasional
                                    </span>
                                    <p className="mt-1 text-lg font-bold text-[#087f8c]">
                                        {formatRupiah(
                                            ringkasanKeuangan.operasional.saldo,
                                        )}
                                    </p>
                                    <span className="text-[10px] text-[#087f8c]">
                                        Cadangan kas lembaga
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Bar */}
                    <div className="flex flex-wrap items-center gap-3">
                        <Link href="/admin/donasi">
                            <Button className="flex h-10 items-center gap-2 rounded-lg bg-[#14bace] px-4 text-xs font-semibold text-white shadow-xs hover:bg-[#0fa0ae]">
                                <HeartHandshake className="size-4" /> Kelola &
                                Verifikasi Donasi
                            </Button>
                        </Link>
                        <Button
                            onClick={() => setIsTrxModalOpen(true)}
                            variant="outline"
                            className="flex h-10 items-center gap-2 rounded-lg border-[#e4eaec] bg-white px-4 text-xs font-semibold text-[#1b2929] hover:border-[#14bace]"
                        >
                            <Plus className="size-4 text-[#087f8c]" /> Catat
                            Transaksi Kas Manual
                        </Button>
                        <Link href="/admin/keuangan">
                            <Button
                                variant="outline"
                                className="flex h-10 items-center gap-2 rounded-lg border-[#e4eaec] bg-white px-4 text-xs font-semibold text-[#1b2929] hover:border-[#14bace]"
                            >
                                <Wallet className="size-4 text-[#087f8c]" />{' '}
                                Buku Kas Yayasan
                            </Button>
                        </Link>
                        <Link href="/admin/rekening">
                            <Button
                                variant="outline"
                                className="flex h-10 items-center gap-2 rounded-lg border-[#e4eaec] bg-white px-4 text-xs font-semibold text-[#1b2929] hover:border-[#14bace]"
                            >
                                <CreditCard className="size-4 text-[#087f8c]" />{' '}
                                Rekening Yayasan
                            </Button>
                        </Link>
                    </div>

                    {/* Sebaran Jenjang Binaan */}
                    <div className="rounded-2xl border border-[#e4eaec] bg-white p-6 shadow-xs">
                        <h3 className="text-base font-semibold text-[#1b2929]">
                            Sebaran Jenjang Anak Binaan Aktif
                        </h3>
                        <p className="mt-0.5 mb-6 text-xs text-[#718083]">
                            Total {totalAnakYatim} anak binaan aktif yayasan
                        </p>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {educationData.map((item) => (
                                <div
                                    key={item.label}
                                    className="rounded-xl border border-slate-100 bg-slate-50/60 p-4"
                                >
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="font-medium text-[#1b2929]">
                                            {item.label}
                                        </span>
                                        <span className="font-bold text-[#087f8c]">
                                            {item.count} anak
                                        </span>
                                    </div>
                                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                                        <div
                                            className={`h-full rounded-full ${item.color}`}
                                            style={{ width: item.percent }}
                                        />
                                    </div>
                                    <span className="mt-1.5 block text-[11px] text-slate-500">
                                        {item.percent} dari total binaan
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            ) : (
                /* REGULAR ADMIN VIEW: Strictly scoped to their authorized unit kerja without financial leaks */
                <>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <Link
                            href="/admin/anak-yatim"
                            className="group flex flex-col justify-between rounded-2xl border border-[#e4eaec] bg-white p-6 shadow-xs transition-colors hover:border-[#14bace]"
                        >
                            <div className="space-y-1">
                                <span className="block text-[11px] font-medium tracking-wider text-[#718083] uppercase">
                                    Binaan Bidang {namaBidang}
                                </span>
                                <div className="text-3xl font-bold text-[#1b2929]">
                                    {totalAnakYatim}
                                </div>
                            </div>
                            <div className="mt-4 flex items-center justify-between border-t border-[#f0f4f5] pt-3 text-xs font-medium text-[#087f8c]">
                                <span>Anak binaan aktif bidang</span>
                                <UsersRound className="size-4 text-[#14bace] transition-transform group-hover:scale-110" />
                            </div>
                        </Link>

                        <Link
                            href="/admin/kegiatan"
                            className="group flex flex-col justify-between rounded-2xl border border-[#e4eaec] bg-white p-6 shadow-xs transition-colors hover:border-[#14bace]"
                        >
                            <div className="space-y-1">
                                <span className="block text-[11px] font-medium tracking-wider text-[#718083] uppercase">
                                    Kegiatan Bidang
                                </span>
                                <div className="text-3xl font-bold text-[#1b2929]">
                                    {kegiatanBidangCount}
                                </div>
                            </div>
                            <div className="mt-4 flex items-center justify-between border-t border-[#f0f4f5] pt-3 text-xs font-medium text-[#087f8c]">
                                <span>Program kerja tercatat</span>
                                <CalendarDays className="size-4 text-[#14bace] transition-transform group-hover:scale-110" />
                            </div>
                        </Link>

                        <Link
                            href="/admin/donasi"
                            className="group flex flex-col justify-between rounded-2xl border border-[#e4eaec] bg-white p-6 shadow-xs transition-colors hover:border-amber-300"
                        >
                            <div className="space-y-1">
                                <span className="block text-[11px] font-medium tracking-wider text-amber-700 uppercase">
                                    Donasi Binaan Menunggu
                                </span>
                                <div className="text-3xl font-bold text-amber-800">
                                    {donasiMenungguCount}
                                </div>
                            </div>
                            <div className="mt-4 flex items-center justify-between border-t border-amber-100 pt-3 text-xs font-medium text-amber-700">
                                <span>Pengajuan Orang Tua Asuh</span>
                                <Clock className="size-4 text-amber-600 transition-transform group-hover:scale-110" />
                            </div>
                        </Link>
                    </div>

                    {/* Operational Quick Actions */}
                    <div className="flex flex-wrap items-center gap-3">
                        <Link href="/admin/anak-yatim">
                            <Button className="flex h-11 items-center gap-2 rounded-lg bg-[#14bace] px-5 text-xs font-semibold text-white shadow-xs hover:bg-[#0fa0ae]">
                                <UserPlus className="size-4" /> Kelola Data Anak
                                Yatim
                            </Button>
                        </Link>
                        <Link href="/admin/kegiatan">
                            <Button
                                variant="outline"
                                className="flex h-11 items-center gap-2 rounded-lg border-[#e4eaec] bg-white px-5 text-xs font-semibold text-[#1b2929] hover:border-[#14bace]"
                            >
                                <CalendarPlus className="size-4 text-[#087f8c]" />{' '}
                                Agenda Kegiatan
                            </Button>
                        </Link>
                        <Link href="/admin/donasi">
                            <Button
                                variant="outline"
                                className="flex h-11 items-center gap-2 rounded-lg border-[#e4eaec] bg-white px-5 text-xs font-semibold text-[#1b2929] hover:border-[#14bace]"
                            >
                                <HeartHandshake className="size-4 text-[#087f8c]" />{' '}
                                Donasi Masuk
                            </Button>
                        </Link>
                    </div>

                    {/* Education Breakdown for Field */}
                    <div className="rounded-2xl border border-[#e4eaec] bg-white p-6 shadow-xs">
                        <h3 className="text-base font-semibold text-[#1b2929]">
                            Sebaran Jenjang Binaan Bidang {namaBidang}
                        </h3>
                        <p className="mt-0.5 mb-6 text-xs text-[#718083]">
                            Sebaran pendidikan anak binaan di bawah unit kerja
                            Anda
                        </p>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {educationData.map((item) => (
                                <div
                                    key={item.label}
                                    className="rounded-xl border border-slate-100 bg-slate-50/60 p-4"
                                >
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="font-medium text-[#1b2929]">
                                            {item.label}
                                        </span>
                                        <span className="font-bold text-[#087f8c]">
                                            {item.count} anak
                                        </span>
                                    </div>
                                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                                        <div
                                            className={`h-full rounded-full ${item.color}`}
                                            style={{ width: item.percent }}
                                        />
                                    </div>
                                    <span className="mt-1.5 block text-[11px] text-slate-500">
                                        {item.percent} dari binaan bidang
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}

            {/* Modal Dialog Pencatatan Transaksi Kas Manual (Super Admin) */}
            {isSuperAdmin && (
                <Dialog open={isTrxModalOpen} onOpenChange={setIsTrxModalOpen}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle className="font-poppins text-lg font-bold text-slate-800">
                                Catat Transaksi Kas Manual
                            </DialogTitle>
                            <DialogDescription className="text-xs text-slate-500">
                                Catat pengeluaran atau pemasukan non-donasi
                                dengan menentukan sumber dana secara eksplisit.
                            </DialogDescription>
                        </DialogHeader>

                        <form
                            onSubmit={handleTrxSubmit}
                            className="space-y-4 pt-2 font-poppins text-xs"
                        >
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="mb-1 block font-semibold text-slate-700">
                                        Tipe Transaksi{' '}
                                        <span className="text-rose-500">*</span>
                                    </label>
                                    <select
                                        value={trxForm.data.tipe}
                                        onChange={(e) =>
                                            trxForm.setData(
                                                'tipe',
                                                e.target.value,
                                            )
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
                                        value={trxForm.data.sumber_dana}
                                        onChange={(e) =>
                                            trxForm.setData(
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
                                    {trxForm.errors.sumber_dana && (
                                        <p className="mt-1 text-[11px] text-rose-500">
                                            {trxForm.errors.sumber_dana}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="kategori"
                                    className="mb-1 block font-semibold text-slate-700"
                                >
                                    Kategori Transaksi{' '}
                                    <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    id="kategori"
                                    type="text"
                                    placeholder="mis. Santunan Bulanan / Biaya Listrik / ATK Kantor"
                                    value={trxForm.data.kategori}
                                    onChange={(e) =>
                                        trxForm.setData(
                                            'kategori',
                                            e.target.value,
                                        )
                                    }
                                    className="w-full rounded-lg border border-[#e4eaec] bg-white px-3 py-2 text-xs text-slate-800 outline-none focus:border-[#14bace]"
                                    required
                                />
                                {trxForm.errors.kategori && (
                                    <p className="mt-1 text-[11px] text-rose-500">
                                        {trxForm.errors.kategori}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label
                                        htmlFor="nominal"
                                        className="mb-1 block font-semibold text-slate-700"
                                    >
                                        Nominal (Rp){' '}
                                        <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        id="nominal"
                                        type="number"
                                        min="1000"
                                        placeholder="mis. 500000"
                                        value={trxForm.data.nominal}
                                        onChange={(e) =>
                                            trxForm.setData(
                                                'nominal',
                                                e.target.value,
                                            )
                                        }
                                        className="w-full rounded-lg border border-[#e4eaec] bg-white px-3 py-2 text-xs text-slate-800 outline-none focus:border-[#14bace]"
                                        required
                                    />
                                    {trxForm.errors.nominal && (
                                        <p className="mt-1 text-[11px] text-rose-500">
                                            {trxForm.errors.nominal}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label
                                        htmlFor="tanggal_transaksi"
                                        className="mb-1 block font-semibold text-slate-700"
                                    >
                                        Tanggal Transaksi{' '}
                                        <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        id="tanggal_transaksi"
                                        type="date"
                                        value={trxForm.data.tanggal_transaksi}
                                        onChange={(e) =>
                                            trxForm.setData(
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
                                    htmlFor="keterangan"
                                    className="mb-1 block font-semibold text-slate-700"
                                >
                                    Keterangan Detail{' '}
                                    <span className="text-rose-500">*</span>
                                </label>
                                <textarea
                                    id="keterangan"
                                    rows={2}
                                    placeholder="Tuliskan tujuan transaksi secara rinci..."
                                    value={trxForm.data.keterangan}
                                    onChange={(e) =>
                                        trxForm.setData(
                                            'keterangan',
                                            e.target.value,
                                        )
                                    }
                                    className="w-full rounded-lg border border-[#e4eaec] bg-white px-3 py-2 text-xs text-slate-800 outline-none focus:border-[#14bace]"
                                    required
                                />
                                {trxForm.errors.keterangan && (
                                    <p className="mt-1 text-[11px] text-rose-500">
                                        {trxForm.errors.keterangan}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="bukti_nota"
                                    className="mb-1 block font-semibold text-slate-700"
                                >
                                    Unggah Bukti Nota / Kwitansi (Opsional)
                                </label>
                                <input
                                    id="bukti_nota"
                                    type="file"
                                    accept=".jpg,.jpeg,.png,.webp,.pdf"
                                    onChange={(e) =>
                                        trxForm.setData(
                                            'bukti_nota',
                                            e.target.files?.[0] ?? null,
                                        )
                                    }
                                    className="w-full text-xs text-slate-500 file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-slate-700 hover:file:bg-slate-200"
                                />
                            </div>

                            <DialogFooter className="gap-2 pt-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsTrxModalOpen(false)}
                                    className="border-[#e4eaec] text-xs text-slate-600 hover:bg-slate-50"
                                >
                                    Batal
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={trxForm.processing}
                                    className="bg-[#14bace] text-xs font-semibold text-white hover:bg-[#0fa0ae]"
                                >
                                    {trxForm.processing
                                        ? 'Menyimpan...'
                                        : 'Simpan Transaksi'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}

Dashboard.layout = {
    breadcrumbs: [{ title: 'Dashboard', href: '/dashboard' }],
};
