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
    const { auth } = usePage().props as unknown as { auth: { user: User } };
    const user = auth?.user;
    const isSuperAdmin = user?.role === 'super_admin';

    // Chart bar data (Mei - Okt 2026 in millions)
    const monthlyData = [
        { month: 'Mei', pemasukan: 10, pengeluaran: 8, heightP: '45%', heightE: '35%' },
        { month: 'Jun', pemasukan: 12, pengeluaran: 9, heightP: '52%', heightE: '40%' },
        { month: 'Jul', pemasukan: 14, pengeluaran: 11, heightP: '60%', heightE: '48%' },
        { month: 'Agu', pemasukan: 13, pengeluaran: 10, heightP: '56%', heightE: '44%' },
        { month: 'Sep', pemasukan: 16, pengeluaran: 13, heightP: '72%', heightE: '58%' },
        { month: 'Okt', pemasukan: 19.5, pengeluaran: 16.25, heightP: '85%', heightE: '70%' },
    ];

    const educationData = [
        { label: 'Sekolah Dasar (SD)', count: 56, percent: '44%', color: 'bg-[#14bace]' },
        { label: 'Sekolah Menengah Pertama (SMP)', count: 38, percent: '30%', color: 'bg-[#087f8c]' },
        { label: 'Sekolah Menengah Atas (SMA)', count: 24, percent: '19%', color: 'bg-amber-400' },
        { label: 'Perguruan Tinggi / Kuliah', count: 10, percent: '7%', color: 'bg-purple-500' },
    ];

    return (
        <div className="flex flex-col gap-8 p-6 md:p-8 font-poppins text-[#1d2b2d] bg-[#f7f9fa] min-h-screen">
            <Head title={`Dashboard - ${isSuperAdmin ? 'Super Admin' : 'Admin Yayasan'}`} />

            {/* Top Greeting Header */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-[#718083] font-medium">
                            Jumat, 30 Oktober 2026
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#e8f8fa] text-[#087f8c] border border-[#cbebf0]">
                            <span className="size-1.5 rounded-full bg-[#14bace] animate-pulse" />
                            {isSuperAdmin ? 'Ruang Kerja Super Admin (Ketua)' : `Admin Bidang: ${user?.bidang || 'Operasional'}`}
                        </span>
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-bold text-[#1b2929] tracking-tight">
                        {isSuperAdmin ? (
                            'Gambaran besar, dampak nyata.'
                        ) : (
                            <>Selamat pagi, {user?.name ? user.name.split(' ')[0] : 'Pengurus'} 👋</>
                        )}
                    </h1>
                    <p className="text-sm text-[#718083] mt-1.5">
                        {isSuperAdmin
                            ? `Selamat datang kembali, ${user?.name}. Berikut ringkasan amanah donasi dan pergerakan kas yayasan.`
                            : 'Pantau pendampingan anak dan aktivitas yayasan dalam satu ruang kerja aman.'}
                    </p>
                </div>

                {/* Role Switcher & Account Controls */}
                <div className="flex flex-wrap items-center gap-2">
                    {/* Fast Role Switch for Testing */}
                    <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white border border-[#e4eaec] shadow-xs text-xs">
                        <span className="text-[10px] text-gray-400 font-medium px-2">Uji Peran:</span>
                        <a
                            href="/switch-role/super_admin"
                            className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${isSuperAdmin ? 'bg-purple-100 text-purple-700 font-semibold' : 'text-gray-600 hover:bg-gray-100'}`}
                            title="Beralih ke Super Admin (Ketua)"
                        >
                            Super Admin
                        </a>
                        <a
                            href="/switch-role/admin"
                            className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${!isSuperAdmin ? 'bg-teal-100 text-teal-800 font-semibold' : 'text-gray-600 hover:bg-gray-100'}`}
                            title="Beralih ke Admin (Bidang Kemanusiaan)"
                        >
                            Admin Yatim
                        </a>
                    </div>

                    <div className="p-2 rounded-xl bg-white border border-[#e4eaec] shadow-xs flex items-center gap-2.5">
                        <div className={`size-8 rounded-lg flex items-center justify-center font-bold text-xs ${isSuperAdmin ? 'bg-purple-100 text-purple-700' : 'bg-teal-100 text-teal-800'}`}>
                            {user?.name?.slice(0, 2).toUpperCase() || 'AD'}
                        </div>
                        <div className="text-left text-xs">
                            <span className="font-semibold block text-[#1b2929]">{user?.name}</span>
                            <span className="text-[10px] text-gray-500 capitalize">{user?.role?.replace('_', ' ')}</span>
                        </div>
                        <Link
                            href="/logout"
                            method="post"
                            as="button"
                            className="ml-2 p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition-colors"
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                        <div className="bg-white rounded-2xl border border-[#e4eaec] p-6 shadow-xs flex flex-col justify-between hover:border-[#14bace]/40 transition-colors">
                            <div className="space-y-1">
                                <span className="text-[11px] font-medium text-[#718083] uppercase tracking-wider block">
                                    Total Anak Yatim
                                </span>
                                <div className="text-3xl font-bold text-[#1b2929]">128</div>
                            </div>
                            <div className="mt-4 pt-3 border-t border-[#f0f4f5] flex items-center justify-between text-xs text-[#087f8c] font-medium">
                                <span>Anak binaan aktif</span>
                                <UsersRound className="size-4 text-[#14bace]" />
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-[#e4eaec] p-6 shadow-xs flex flex-col justify-between hover:border-[#14bace]/40 transition-colors">
                            <div className="space-y-1">
                                <span className="text-[11px] font-medium text-[#718083] uppercase tracking-wider block">
                                    Total Donasi
                                </span>
                                <div className="text-2xl font-bold text-[#1b2929]">Rp84.500.000</div>
                            </div>
                            <div className="mt-4 pt-3 border-t border-[#f0f4f5] flex items-center justify-between text-xs text-[#087f8c] font-medium">
                                <span>Terverifikasi saja</span>
                                <HeartHandshake className="size-4 text-[#14bace]" />
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-[#e4eaec] p-6 shadow-xs flex flex-col justify-between hover:border-emerald-300 transition-colors">
                            <div className="space-y-1">
                                <span className="text-[11px] font-medium text-[#718083] uppercase tracking-wider block">
                                    Total Pemasukan
                                </span>
                                <div className="text-2xl font-bold text-emerald-600">Rp102.500.000</div>
                            </div>
                            <div className="mt-4 pt-3 border-t border-[#f0f4f5] flex items-center justify-between text-xs text-emerald-700 font-medium">
                                <span>Termasuk unit usaha</span>
                                <TrendingUp className="size-4 text-emerald-500" />
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-[#e4eaec] p-6 shadow-xs flex flex-col justify-between hover:border-rose-300 transition-colors">
                            <div className="space-y-1">
                                <span className="text-[11px] font-medium text-[#718083] uppercase tracking-wider block">
                                    Total Pengeluaran
                                </span>
                                <div className="text-2xl font-bold text-rose-600">Rp67.250.000</div>
                            </div>
                            <div className="mt-4 pt-3 border-t border-[#f0f4f5] flex items-center justify-between text-xs text-rose-600 font-medium">
                                <span>Mei–Oktober 2026</span>
                                <TrendingDown className="size-4 text-rose-500" />
                            </div>
                        </div>

                        <div className="bg-[#e8f8fa] rounded-2xl border border-[#cbebf0] p-6 shadow-xs flex flex-col justify-between">
                            <div className="space-y-1">
                                <span className="text-[11px] font-semibold text-[#087f8c] uppercase tracking-wider block">
                                    Saldo Kas Bersih
                                </span>
                                <div className="text-2xl font-bold text-[#1b2929]">Rp35.250.000</div>
                            </div>
                            <div className="mt-4 pt-3 border-t border-[#cbebf0] flex items-center justify-between text-xs text-[#087f8c] font-semibold">
                                <span>Likuiditas Aman</span>
                                <Wallet className="size-4 text-[#087f8c]" />
                            </div>
                        </div>
                    </div>

                    {/* Quick Super Admin Actions */}
                    <div className="flex flex-wrap items-center gap-3">
                        <Link href="/admin/keuangan">
                            <Button className="bg-[#12b8c8] hover:bg-[#0fa0ae] text-white flex items-center gap-2 h-10 px-4 text-xs font-semibold rounded-lg shadow-xs">
                                <Wallet className="size-4" /> Kelola Keuangan Yayasan
                            </Button>
                        </Link>
                        <Link href="/admin/pengguna">
                            <Button variant="outline" className="flex items-center gap-2 h-10 px-4 text-xs font-semibold rounded-lg bg-white border-[#e4eaec] hover:border-[#14bace] text-[#1b2929]">
                                <ShieldCheck className="size-4 text-[#087f8c]" /> Manajemen Pengurus
                            </Button>
                        </Link>
                        <Link href="/admin/anak-yatim">
                            <Button variant="outline" className="flex items-center gap-2 h-10 px-4 text-xs font-semibold rounded-lg bg-white border-[#e4eaec] hover:border-[#14bace] text-[#1b2929]">
                                <UsersRound className="size-4 text-[#087f8c]" /> Data Binaan
                            </Button>
                        </Link>
                    </div>

                    {/* Cash Flow Dual Bar Chart & Allocation Cards */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Dual Bar Chart: Pemasukan vs Pengeluaran */}
                        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#e4eaec] p-6 shadow-xs">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-[#f0f4f5] gap-2">
                                <div>
                                    <h3 className="font-semibold text-base text-[#1b2929]">
                                        Arus Kas: Pemasukan & Pengeluaran
                                    </h3>
                                    <p className="text-xs text-[#718083]">
                                        Mei–Oktober 2026 • dalam juta rupiah (Total Pemasukan: Rp102,5 Juta)
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
                            <div className="h-64 pt-6 flex items-end justify-between gap-3 sm:gap-6 px-2">
                                {monthlyData.map((d) => (
                                    <div key={d.month} className="flex-1 flex flex-col items-center h-full justify-end group">
                                        <div className="w-full flex items-end justify-center gap-1.5 h-48 relative">
                                            {/* Pemasukan Bar */}
                                            <div
                                                style={{ height: d.heightP }}
                                                className="w-1/2 max-w-[28px] bg-[#12b8c8] hover:bg-[#0fa0ae] rounded-t-sm transition-all relative flex justify-center"
                                                title={`Pemasukan: Rp${d.pemasukan} Juta`}
                                            />
                                            {/* Pengeluaran Bar */}
                                            <div
                                                style={{ height: d.heightE }}
                                                className="w-1/2 max-w-[28px] bg-rose-400 hover:bg-rose-500 rounded-t-sm transition-all relative flex justify-center"
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
                        <div className="bg-white rounded-2xl border border-[#e4eaec] p-6 shadow-xs flex flex-col justify-between">
                            <div>
                                <h3 className="font-semibold text-base text-[#1b2929]">
                                    Sebaran Jenjang Binaan
                                </h3>
                                <p className="text-xs text-[#718083] mt-0.5 mb-6">
                                    128 anak di 5 kelurahan binaan
                                </p>

                                <div className="space-y-4">
                                    {educationData.map((item) => (
                                        <div key={item.label} className="space-y-1.5">
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="font-medium text-[#1b2929]">{item.label}</span>
                                                <span className="text-gray-500 font-semibold">{item.count} anak ({item.percent})</span>
                                            </div>
                                            <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${item.color}`}
                                                    style={{ width: item.percent }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-6 pt-4 border-t border-[#f0f4f5] flex items-center justify-between text-xs text-gray-500">
                                <span>Tercakup di 5 Kelurahan</span>
                                <Link href="/admin/anak-yatim" className="text-[#087f8c] font-semibold hover:underline flex items-center gap-1">
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-white rounded-2xl border border-[#e4eaec] p-6 shadow-xs flex flex-col justify-between hover:border-[#14bace]/40 transition-colors">
                            <div className="space-y-1">
                                <span className="text-[11px] font-medium text-[#718083] uppercase tracking-wider block">
                                    Total Anak Yatim
                                </span>
                                <div className="text-3xl font-bold text-[#1b2929]">128</div>
                            </div>
                            <div className="mt-4 pt-3 border-t border-[#f0f4f5] flex items-center justify-between text-xs text-[#087f8c] font-medium">
                                <span>Anak binaan aktif</span>
                                <UsersRound className="size-4 text-[#14bace]" />
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-[#e4eaec] p-6 shadow-xs flex flex-col justify-between hover:border-[#14bace]/40 transition-colors">
                            <div className="space-y-1">
                                <span className="text-[11px] font-medium text-[#718083] uppercase tracking-wider block">
                                    Total Anak SD
                                </span>
                                <div className="text-3xl font-bold text-[#1b2929]">56</div>
                            </div>
                            <div className="mt-4 pt-3 border-t border-[#f0f4f5] flex items-center justify-between text-xs text-[#087f8c] font-medium">
                                <span>44% total binaan</span>
                                <GraduationCap className="size-4 text-[#14bace]" />
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-[#e4eaec] p-6 shadow-xs flex flex-col justify-between hover:border-[#14bace]/40 transition-colors">
                            <div className="space-y-1">
                                <span className="text-[11px] font-medium text-[#718083] uppercase tracking-wider block">
                                    Total Anak SMP
                                </span>
                                <div className="text-3xl font-bold text-[#1b2929]">38</div>
                            </div>
                            <div className="mt-4 pt-3 border-t border-[#f0f4f5] flex items-center justify-between text-xs text-[#087f8c] font-medium">
                                <span>30% total binaan</span>
                                <GraduationCap className="size-4 text-[#14bace]" />
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-[#e4eaec] p-6 shadow-xs flex flex-col justify-between hover:border-[#14bace]/40 transition-colors">
                            <div className="space-y-1">
                                <span className="text-[11px] font-medium text-[#718083] uppercase tracking-wider block">
                                    Total SMA & Kuliah
                                </span>
                                <div className="text-3xl font-bold text-[#1b2929]">34</div>
                            </div>
                            <div className="mt-4 pt-3 border-t border-[#f0f4f5] flex items-center justify-between text-xs text-[#087f8c] font-medium">
                                <span>SMA: 24 • Kuliah: 10</span>
                                <GraduationCap className="size-4 text-[#14bace]" />
                            </div>
                        </div>
                    </div>

                    {/* Operational Quick Actions Matching Figma 314:6711 */}
                    <div className="flex flex-wrap items-center gap-3">
                        <Link href="/admin/anak-yatim">
                            <Button className="bg-[#12b8c8] hover:bg-[#0fa0ae] text-white flex items-center gap-2 h-11 px-5 text-xs font-semibold rounded-lg shadow-xs">
                                <UserPlus className="size-4" /> Tambah Data Anak
                            </Button>
                        </Link>
                        <Link href="/admin/kegiatan">
                            <Button variant="outline" className="flex items-center gap-2 h-11 px-5 text-xs font-semibold rounded-lg bg-white border-[#e4eaec] hover:border-[#14bace] text-[#1b2929]">
                                <CalendarPlus className="size-4 text-[#087f8c]" /> Tambah Kegiatan
                            </Button>
                        </Link>
                        <Link href="/admin/donasi">
                            <Button variant="outline" className="flex items-center gap-2 h-11 px-5 text-xs font-semibold rounded-lg bg-white border-[#e4eaec] hover:border-[#14bace] text-[#1b2929]">
                                <HeartHandshake className="size-4 text-[#087f8c]" /> Kelola Donasi Masuk
                            </Button>
                        </Link>
                    </div>

                    {/* Donation Trend & Education Breakdown Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Donation Trend Bar Chart */}
                        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#e4eaec] p-6 shadow-xs">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-[#f0f4f5] gap-2">
                                <div>
                                    <h3 className="font-semibold text-base text-[#1b2929]">
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
                            <div className="h-64 pt-6 flex items-end justify-between gap-3 sm:gap-6 px-2">
                                {monthlyData.map((d) => (
                                    <div key={d.month} className="flex-1 flex flex-col items-center h-full justify-end group">
                                        <div className="w-full flex items-end justify-center h-48 relative">
                                            <div
                                                style={{ height: d.heightP }}
                                                className="w-full max-w-[42px] bg-[#12b8c8] hover:bg-[#0fa0ae] rounded-t-md transition-all relative flex justify-center"
                                                title={`Rp${d.pemasukan} Juta`}
                                            />
                                        </div>
                                        <span className="mt-3 text-xs font-medium text-gray-500 group-hover:text-[#1b2929]">
                                            {d.month}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4 pt-3 border-t border-[#f0f4f5] text-xs text-[#718083]">
                                Total akumulasi donasi: <strong className="text-[#1b2929]">Rp84.500.000</strong> (hanya donasi terkonfirmasi valid)
                            </div>
                        </div>

                        {/* Education Breakdown */}
                        <div className="bg-white rounded-2xl border border-[#e4eaec] p-6 shadow-xs flex flex-col justify-between">
                            <div>
                                <h3 className="font-semibold text-base text-[#1b2929]">
                                    Jenjang Pendidikan Binaan
                                </h3>
                                <p className="text-xs text-[#718083] mt-0.5 mb-6">
                                    Kategori pendidikan anak asuh binaan
                                </p>

                                <div className="space-y-4">
                                    {educationData.map((item) => (
                                        <div key={item.label} className="space-y-1.5">
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="font-medium text-[#1b2929]">{item.label}</span>
                                                <span className="text-gray-500 font-semibold">{item.count} ({item.percent})</span>
                                            </div>
                                            <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${item.color}`}
                                                    style={{ width: item.percent }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-6 pt-4 border-t border-[#f0f4f5] flex items-center justify-between text-xs text-gray-500">
                                <span>Distribusi 5 Kelurahan</span>
                                <Link href="/admin/anak-yatim" className="text-[#087f8c] font-semibold hover:underline flex items-center gap-1">
                                    Lihat Semua <ArrowUpRight className="size-3" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Security and Confidentiality Banner */}
            <div className="rounded-2xl border border-[#d2eff3] bg-[#e8f8fa]/80 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                    <ShieldCheck className="size-5 text-[#087f8c] shrink-0 mt-0.5" />
                    <div>
                        <h4 className="text-xs font-bold text-[#1b2929]">
                            Prinsip Perlindungan Privasi Data Anak Binaan (Sesuai UU PDP)
                        </h4>
                        <p className="text-xs text-[#526b70] mt-0.5">
                            Data pribadi dan detail riwayat anak binaan dijaga kerahasiaannya dan hanya dapat diakses oleh pengurus yayasan yang berwenang.
                        </p>
                    </div>
                </div>
                <Link href="/anak-yatim">
                    <Button variant="outline" className="text-xs bg-white border-[#b7e4ea] hover:bg-white/80 text-[#087f8c] font-semibold whitespace-nowrap">
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
