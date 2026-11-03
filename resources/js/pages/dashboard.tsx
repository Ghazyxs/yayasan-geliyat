import { Head, Link, usePage } from '@inertiajs/react';
import {
    UsersRound,
    HeartHandshake,
    Wallet,
    CalendarPlus,
    UserPlus,
    ArrowUpRight,
    TrendingUp,
    TrendingDown,
    ShieldCheck,
    GraduationCap,
    Clock,
    CheckCircle2,
    Sparkles,
    LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { dashboard } from '@/routes';
import type { User } from '@/types';

export default function Dashboard() {
    const { auth, appEnv } = usePage().props as unknown as {
        auth: { user: User };
        appEnv: string;
    };
    const user = auth?.user;
    const isSuperAdmin = user?.role === 'super_admin';
    const isLocalEnv = appEnv === 'local';

    // Chart bar data (Mei - Okt 2026 in millions)
    const monthlyData = [
        {
            month: 'Mei',
            pemasukan: 10,
            pengeluaran: 8,
            heightP: '45%',
            heightE: '35%',
        },
        {
            month: 'Jun',
            pemasukan: 12,
            pengeluaran: 9,
            heightP: '52%',
            heightE: '40%',
        },
        {
            month: 'Jul',
            pemasukan: 14,
            pengeluaran: 11,
            heightP: '60%',
            heightE: '48%',
        },
        {
            month: 'Agu',
            pemasukan: 13,
            pengeluaran: 10,
            heightP: '56%',
            heightE: '44%',
        },
        {
            month: 'Sep',
            pemasukan: 16,
            pengeluaran: 13,
            heightP: '72%',
            heightE: '58%',
        },
        {
            month: 'Okt',
            pemasukan: 19.5,
            pengeluaran: 16.25,
            heightP: '85%',
            heightE: '70%',
        },
    ];

    const educationData = [
        {
            label: 'Sekolah Dasar (SD)',
            count: 56,
            percent: '44%',
            color: 'bg-[#14bace]',
        },
        {
            label: 'Sekolah Menengah Pertama (SMP)',
            count: 38,
            percent: '30%',
            color: 'bg-[#087f8c]',
        },
        {
            label: 'Sekolah Menengah Atas (SMA)',
            count: 24,
            percent: '19%',
            color: 'bg-amber-400',
        },
        {
            label: 'Perguruan Tinggi / Kuliah',
            count: 10,
            percent: '7%',
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
                            Jumat, 30 Oktober 2026
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#cbebf0] bg-[#e8f8fa] px-2.5 py-0.5 text-[10px] font-semibold text-[#087f8c]">
                            <span className="size-1.5 animate-pulse rounded-full bg-[#14bace]" />
                            {isSuperAdmin
                                ? 'Ruang Kerja Super Admin (Ketua)'
                                : `Admin Bidang: ${user?.bidang || 'Operasional'}`}
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
                            ? `Selamat datang kembali, ${user?.name}. Berikut ringkasan amanah donasi dan pergerakan kas yayasan.`
                            : 'Pantau pendampingan anak dan aktivitas yayasan dalam satu ruang kerja aman.'}
                    </p>
                </div>

                {/* Role Switcher (Development Only) & Account Controls */}
                <div className="flex flex-wrap items-center gap-2">
                    {/* Fast Role Switch — hanya tampil di local development */}
                    {isLocalEnv && (
                        <div className="flex items-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 p-1 text-xs shadow-xs" title="Dev only — tidak tampil di production">
                            <span className="px-2 text-[10px] font-medium text-amber-500">
                                Dev:
                            </span>
                            <a
                                href="/switch-role/super_admin"
                                className={`rounded-lg px-2.5 py-1 font-medium transition-colors ${isSuperAdmin ? 'bg-purple-100 font-semibold text-purple-700' : 'text-gray-600 hover:bg-gray-100'}`}
                                title="Beralih ke Super Admin (Ketua)"
                            >
                                Super Admin
                            </a>
                            <a
                                href="/switch-role/admin"
                                className={`rounded-lg px-2.5 py-1 font-medium transition-colors ${!isSuperAdmin ? 'bg-teal-100 font-semibold text-teal-800' : 'text-gray-600 hover:bg-gray-100'}`}
                                title="Beralih ke Admin (Bidang Kemanusiaan)"
                            >
                                Admin Yatim
                            </a>
                        </div>
                    )}

                    <div className="flex items-center gap-2.5 rounded-xl border border-[#e4eaec] bg-white p-2 shadow-xs">
                        <div
                            className={`flex size-8 items-center justify-center rounded-lg text-xs font-bold ${isSuperAdmin ? 'bg-purple-100 text-purple-700' : 'bg-teal-100 text-teal-800'}`}
                        >
                            {user?.name?.slice(0, 2).toUpperCase() || 'AD'}
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
                            title="Keluar ke Halaman Login"
                        >
                            <LogOut className="size-4" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* SUPER ADMIN VIEW: Comprehensive Finance & Foundation Overview */}
            {isSuperAdmin ? (
                <>
                    {/* 5 Financial & Foundation Metrics */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                        <div className="flex flex-col justify-between rounded-2xl border border-[#e4eaec] bg-white p-6 shadow-xs transition-colors hover:border-[#14bace]/40">
                            <div className="space-y-1">
                                <span className="block text-[11px] font-medium tracking-wider text-[#718083] uppercase">
                                    Total Anak Yatim
                                </span>
                                <div className="text-3xl font-bold text-[#1b2929]">
                                    128
                                </div>
                            </div>
                            <div className="mt-4 flex items-center justify-between border-t border-[#f0f4f5] pt-3 text-xs font-medium text-[#087f8c]">
                                <span>Anak binaan aktif</span>
                                <UsersRound className="size-4 text-[#14bace]" />
                            </div>
                        </div>

                        <div className="flex flex-col justify-between rounded-2xl border border-[#e4eaec] bg-white p-6 shadow-xs transition-colors hover:border-[#14bace]/40">
                            <div className="space-y-1">
                                <span className="block text-[11px] font-medium tracking-wider text-[#718083] uppercase">
                                    Total Donasi
                                </span>
                                <div className="text-2xl font-bold text-[#1b2929]">
                                    Rp84.500.000
                                </div>
                            </div>
                            <div className="mt-4 flex items-center justify-between border-t border-[#f0f4f5] pt-3 text-xs font-medium text-[#087f8c]">
                                <span>Terverifikasi saja</span>
                                <HeartHandshake className="size-4 text-[#14bace]" />
                            </div>
                        </div>

                        <div className="flex flex-col justify-between rounded-2xl border border-[#e4eaec] bg-white p-6 shadow-xs transition-colors hover:border-emerald-300">
                            <div className="space-y-1">
                                <span className="block text-[11px] font-medium tracking-wider text-[#718083] uppercase">
                                    Total Pemasukan
                                </span>
                                <div className="text-2xl font-bold text-emerald-600">
                                    Rp102.500.000
                                </div>
                            </div>
                            <div className="mt-4 flex items-center justify-between border-t border-[#f0f4f5] pt-3 text-xs font-medium text-emerald-700">
                                <span>Termasuk unit usaha</span>
                                <TrendingUp className="size-4 text-emerald-500" />
                            </div>
                        </div>

                        <div className="flex flex-col justify-between rounded-2xl border border-[#e4eaec] bg-white p-6 shadow-xs transition-colors hover:border-rose-300">
                            <div className="space-y-1">
                                <span className="block text-[11px] font-medium tracking-wider text-[#718083] uppercase">
                                    Total Pengeluaran
                                </span>
                                <div className="text-2xl font-bold text-rose-600">
                                    Rp67.250.000
                                </div>
                            </div>
                            <div className="mt-4 flex items-center justify-between border-t border-[#f0f4f5] pt-3 text-xs font-medium text-rose-600">
                                <span>Mei–Oktober 2026</span>
                                <TrendingDown className="size-4 text-rose-500" />
                            </div>
                        </div>

                        <div className="flex flex-col justify-between rounded-2xl border border-[#cbebf0] bg-[#e8f8fa] p-6 shadow-xs">
                            <div className="space-y-1">
                                <span className="block text-[11px] font-semibold tracking-wider text-[#087f8c] uppercase">
                                    Saldo Kas Bersih
                                </span>
                                <div className="text-2xl font-bold text-[#1b2929]">
                                    Rp35.250.000
                                </div>
                            </div>
                            <div className="mt-4 flex items-center justify-between border-t border-[#cbebf0] pt-3 text-xs font-semibold text-[#087f8c]">
                                <span>Likuiditas Aman</span>
                                <Wallet className="size-4 text-[#087f8c]" />
                            </div>
                        </div>
                    </div>

                    {/* Quick Super Admin Actions */}
                    <div className="flex flex-wrap items-center gap-3">
                        <Link href="/admin/keuangan">
                            <Button className="flex h-10 items-center gap-2 rounded-lg bg-[#12b8c8] px-4 text-xs font-semibold text-white shadow-xs hover:bg-[#0fa0ae]">
                                <Wallet className="size-4" /> Kelola Keuangan
                                Yayasan
                            </Button>
                        </Link>
                        <Link href="/admin/pengguna">
                            <Button
                                variant="outline"
                                className="flex h-10 items-center gap-2 rounded-lg border-[#e4eaec] bg-white px-4 text-xs font-semibold text-[#1b2929] hover:border-[#14bace]"
                            >
                                <ShieldCheck className="size-4 text-[#087f8c]" />{' '}
                                Manajemen Pengurus
                            </Button>
                        </Link>
                        <Link href="/admin/anak-yatim">
                            <Button
                                variant="outline"
                                className="flex h-10 items-center gap-2 rounded-lg border-[#e4eaec] bg-white px-4 text-xs font-semibold text-[#1b2929] hover:border-[#14bace]"
                            >
                                <UsersRound className="size-4 text-[#087f8c]" />{' '}
                                Data Binaan
                            </Button>
                        </Link>
                    </div>

                    {/* Cash Flow Dual Bar Chart & Allocation Cards */}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* Dual Bar Chart: Pemasukan vs Pengeluaran */}
                        <div className="rounded-2xl border border-[#e4eaec] bg-white p-6 shadow-xs lg:col-span-2">
                            <div className="flex flex-col gap-2 border-b border-[#f0f4f5] pb-6 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <h3 className="text-base font-semibold text-[#1b2929]">
                                        Arus Kas: Pemasukan & Pengeluaran
                                    </h3>
                                    <p className="text-xs text-[#718083]">
                                        Mei–Oktober 2026 • dalam juta rupiah
                                        (Total Pemasukan: Rp102,5 Juta)
                                    </p>
                                </div>
                                <div className="flex items-center gap-4 text-xs font-medium">
                                    <div className="flex items-center gap-1.5">
                                        <span className="size-2.5 rounded-xs bg-[#12b8c8]" />
                                        <span>Pemasukan</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <span className="size-2.5 rounded-xs bg-rose-400" />
                                        <span>Pengeluaran</span>
                                    </div>
                                </div>
                            </div>

                            {/* Chart Area */}
                            <div className="flex h-64 items-end justify-between gap-3 px-2 pt-6 sm:gap-6">
                                {monthlyData.map((d) => (
                                    <div
                                        key={d.month}
                                        className="group flex h-full flex-1 flex-col items-center justify-end"
                                    >
                                        <div className="relative flex h-48 w-full items-end justify-center gap-1.5">
                                            {/* Pemasukan Bar */}
                                            <div
                                                style={{ height: d.heightP }}
                                                className="relative flex w-1/2 max-w-[28px] justify-center rounded-t-sm bg-[#12b8c8] transition-all hover:bg-[#0fa0ae]"
                                                title={`Pemasukan: Rp${d.pemasukan} Juta`}
                                            />
                                            {/* Pengeluaran Bar */}
                                            <div
                                                style={{ height: d.heightE }}
                                                className="relative flex w-1/2 max-w-[28px] justify-center rounded-t-sm bg-rose-400 transition-all hover:bg-rose-500"
                                                title={`Pengeluaran: Rp${d.pengeluaran} Juta`}
                                            />
                                        </div>
                                        <span className="mt-3 text-xs font-medium text-gray-500 group-hover:text-[#1b2929]">
                                            {d.month}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Education Breakdown & Budget Allocation */}
                        <div className="flex flex-col justify-between rounded-2xl border border-[#e4eaec] bg-white p-6 shadow-xs">
                            <div>
                                <h3 className="text-base font-semibold text-[#1b2929]">
                                    Sebaran Jenjang Binaan
                                </h3>
                                <p className="mt-0.5 mb-6 text-xs text-[#718083]">
                                    128 anak di 5 kelurahan binaan
                                </p>

                                <div className="space-y-4">
                                    {educationData.map((item) => (
                                        <div
                                            key={item.label}
                                            className="space-y-1.5"
                                        >
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="font-medium text-[#1b2929]">
                                                    {item.label}
                                                </span>
                                                <span className="font-semibold text-gray-500">
                                                    {item.count} anak (
                                                    {item.percent})
                                                </span>
                                            </div>
                                            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                                                <div
                                                    className={`h-full rounded-full ${item.color}`}
                                                    style={{
                                                        width: item.percent,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-6 flex items-center justify-between border-t border-[#f0f4f5] pt-4 text-xs text-gray-500">
                                <span>Tercakup di 5 Kelurahan</span>
                                <Link
                                    href="/admin/anak-yatim"
                                    className="flex items-center gap-1 font-semibold text-[#087f8c] hover:underline"
                                >
                                    Rincian <ArrowUpRight className="size-3" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                /* ADMIN OPERASIONAL VIEW: Field & Orphan Program Focus */
                <>
                    {/* 4 Focus Statistic Cards */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="flex flex-col justify-between rounded-2xl border border-[#e4eaec] bg-white p-6 shadow-xs transition-colors hover:border-[#14bace]/40">
                            <div className="space-y-1">
                                <span className="block text-[11px] font-medium tracking-wider text-[#718083] uppercase">
                                    Total Anak Yatim
                                </span>
                                <div className="text-3xl font-bold text-[#1b2929]">
                                    128
                                </div>
                            </div>
                            <div className="mt-4 flex items-center justify-between border-t border-[#f0f4f5] pt-3 text-xs font-medium text-[#087f8c]">
                                <span>Anak binaan aktif</span>
                                <UsersRound className="size-4 text-[#14bace]" />
                            </div>
                        </div>

                        <div className="flex flex-col justify-between rounded-2xl border border-[#e4eaec] bg-white p-6 shadow-xs transition-colors hover:border-[#14bace]/40">
                            <div className="space-y-1">
                                <span className="block text-[11px] font-medium tracking-wider text-[#718083] uppercase">
                                    Total Anak SD
                                </span>
                                <div className="text-3xl font-bold text-[#1b2929]">
                                    56
                                </div>
                            </div>
                            <div className="mt-4 flex items-center justify-between border-t border-[#f0f4f5] pt-3 text-xs font-medium text-[#087f8c]">
                                <span>44% total binaan</span>
                                <GraduationCap className="size-4 text-[#14bace]" />
                            </div>
                        </div>

                        <div className="flex flex-col justify-between rounded-2xl border border-[#e4eaec] bg-white p-6 shadow-xs transition-colors hover:border-[#14bace]/40">
                            <div className="space-y-1">
                                <span className="block text-[11px] font-medium tracking-wider text-[#718083] uppercase">
                                    Total Anak SMP
                                </span>
                                <div className="text-3xl font-bold text-[#1b2929]">
                                    38
                                </div>
                            </div>
                            <div className="mt-4 flex items-center justify-between border-t border-[#f0f4f5] pt-3 text-xs font-medium text-[#087f8c]">
                                <span>30% total binaan</span>
                                <GraduationCap className="size-4 text-[#14bace]" />
                            </div>
                        </div>

                        <div className="flex flex-col justify-between rounded-2xl border border-[#e4eaec] bg-white p-6 shadow-xs transition-colors hover:border-[#14bace]/40">
                            <div className="space-y-1">
                                <span className="block text-[11px] font-medium tracking-wider text-[#718083] uppercase">
                                    Total SMA & Kuliah
                                </span>
                                <div className="text-3xl font-bold text-[#1b2929]">
                                    34
                                </div>
                            </div>
                            <div className="mt-4 flex items-center justify-between border-t border-[#f0f4f5] pt-3 text-xs font-medium text-[#087f8c]">
                                <span>SMA: 24 • Kuliah: 10</span>
                                <GraduationCap className="size-4 text-[#14bace]" />
                            </div>
                        </div>
                    </div>

                    {/* Operational Quick Actions Matching Figma 314:6711 */}
                    <div className="flex flex-wrap items-center gap-3">
                        <Link href="/admin/anak-yatim">
                            <Button className="flex h-11 items-center gap-2 rounded-lg bg-[#12b8c8] px-5 text-xs font-semibold text-white shadow-xs hover:bg-[#0fa0ae]">
                                <UserPlus className="size-4" /> Tambah Data Anak
                            </Button>
                        </Link>
                        <Link href="/admin/kegiatan">
                            <Button
                                variant="outline"
                                className="flex h-11 items-center gap-2 rounded-lg border-[#e4eaec] bg-white px-5 text-xs font-semibold text-[#1b2929] hover:border-[#14bace]"
                            >
                                <CalendarPlus className="size-4 text-[#087f8c]" />{' '}
                                Tambah Kegiatan
                            </Button>
                        </Link>
                        <Link href="/admin/donasi">
                            <Button
                                variant="outline"
                                className="flex h-11 items-center gap-2 rounded-lg border-[#e4eaec] bg-white px-5 text-xs font-semibold text-[#1b2929] hover:border-[#14bace]"
                            >
                                <HeartHandshake className="size-4 text-[#087f8c]" />{' '}
                                Kelola Donasi Masuk
                            </Button>
                        </Link>
                    </div>

                    {/* Donation Trend & Education Breakdown Grid */}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* Donation Trend Bar Chart */}
                        <div className="rounded-2xl border border-[#e4eaec] bg-white p-6 shadow-xs lg:col-span-2">
                            <div className="flex flex-col gap-2 border-b border-[#f0f4f5] pb-6 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <h3 className="text-base font-semibold text-[#1b2929]">
                                        Tren Donasi Terverifikasi
                                    </h3>
                                    <p className="text-xs text-[#718083]">
                                        Mei–Oktober 2026 • dalam juta rupiah
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 text-xs font-semibold text-[#087f8c]">
                                    <span className="size-2 rounded-full bg-[#12b8c8]" />
                                    Donasi terverifikasi
                                </div>
                            </div>

                            {/* Single Bar Chart */}
                            <div className="flex h-64 items-end justify-between gap-3 px-2 pt-6 sm:gap-6">
                                {monthlyData.map((d) => (
                                    <div
                                        key={d.month}
                                        className="group flex h-full flex-1 flex-col items-center justify-end"
                                    >
                                        <div className="relative flex h-48 w-full items-end justify-center">
                                            <div
                                                style={{ height: d.heightP }}
                                                className="relative flex w-full max-w-[42px] justify-center rounded-t-md bg-[#12b8c8] transition-all hover:bg-[#0fa0ae]"
                                                title={`Rp${d.pemasukan} Juta`}
                                            />
                                        </div>
                                        <span className="mt-3 text-xs font-medium text-gray-500 group-hover:text-[#1b2929]">
                                            {d.month}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4 border-t border-[#f0f4f5] pt-3 text-xs text-[#718083]">
                                Total akumulasi donasi:{' '}
                                <strong className="text-[#1b2929]">
                                    Rp84.500.000
                                </strong>{' '}
                                (hanya donasi terkonfirmasi valid)
                            </div>
                        </div>

                        {/* Education Breakdown */}
                        <div className="flex flex-col justify-between rounded-2xl border border-[#e4eaec] bg-white p-6 shadow-xs">
                            <div>
                                <h3 className="text-base font-semibold text-[#1b2929]">
                                    Jenjang Pendidikan Binaan
                                </h3>
                                <p className="mt-0.5 mb-6 text-xs text-[#718083]">
                                    Kategori pendidikan anak asuh binaan
                                </p>

                                <div className="space-y-4">
                                    {educationData.map((item) => (
                                        <div
                                            key={item.label}
                                            className="space-y-1.5"
                                        >
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="font-medium text-[#1b2929]">
                                                    {item.label}
                                                </span>
                                                <span className="font-semibold text-gray-500">
                                                    {item.count} ({item.percent}
                                                    )
                                                </span>
                                            </div>
                                            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                                                <div
                                                    className={`h-full rounded-full ${item.color}`}
                                                    style={{
                                                        width: item.percent,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-6 flex items-center justify-between border-t border-[#f0f4f5] pt-4 text-xs text-gray-500">
                                <span>Distribusi 5 Kelurahan</span>
                                <Link
                                    href="/admin/anak-yatim"
                                    className="flex items-center gap-1 font-semibold text-[#087f8c] hover:underline"
                                >
                                    Lihat Semua{' '}
                                    <ArrowUpRight className="size-3" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Security and Confidentiality Banner */}
            <div className="flex flex-col justify-between gap-4 rounded-2xl border border-[#d2eff3] bg-[#e8f8fa]/80 p-5 sm:flex-row sm:items-center">
                <div className="flex items-start gap-3">
                    <ShieldCheck className="mt-0.5 size-5 shrink-0 text-[#087f8c]" />
                    <div>
                        <h4 className="text-xs font-bold text-[#1b2929]">
                            Prinsip Perlindungan Privasi Data Anak Binaan
                            (Sesuai UU PDP)
                        </h4>
                        <p className="mt-0.5 text-xs text-[#526b70]">
                            Data pribadi dan detail riwayat anak binaan dijaga
                            kerahasiaannya dan hanya dapat diakses oleh pengurus
                            yayasan yang berwenang.
                        </p>
                    </div>
                </div>
                <Link href="/anak-yatim">
                    <Button
                        variant="outline"
                        className="border-[#b7e4ea] bg-white text-xs font-semibold whitespace-nowrap text-[#087f8c] hover:bg-white/80"
                    >
                        Cek Tampilan Publik
                    </Button>
                </Link>
            </div>
        </div>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
