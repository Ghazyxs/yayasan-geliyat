import { useState } from 'react';
import { Form, Head, Link } from '@inertiajs/react';
import { ShieldCheck, ArrowLeft, CheckCircle2 } from 'lucide-react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { home } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

type Props = {
    status?: string;
    canResetPassword: boolean;
};

export default function Login({ status, canResetPassword }: Props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(true);

    const fillTestAccount = (userEmail: string) => {
        setEmail(userEmail);
        setPassword('password');
    };

    return (
        <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white font-poppins text-[#1d2b2d] selection:bg-[#14bace]/20 selection:text-[#087f8c]">
            <Head title="Masuk ke Admin Panel - Yayasan Geliyat" />

            {/* Left Column: Geliyat Story & Visual Banner (Hidden on mobile, visible on desktop) */}
            <div className="hidden lg:flex lg:w-1/2 xl:w-[52%] bg-[#e8f8fa] flex-col justify-between p-10 xl:p-14 border-r border-[#cbebf0]">
                {/* Branding Top */}
                <div className="flex items-center gap-3.5">
                    <div className="size-12 shrink-0 rounded-xl bg-white p-1 shadow-sm border border-[#d2f0f4] flex items-center justify-center">
                        <img
                            src="/images/logo.png"
                            alt="Logo Yayasan Geliyat"
                            className="size-10 object-contain"
                        />
                    </div>
                    <div>
                        <h2 className="font-poppins font-bold text-lg text-[#1b2929] tracking-tight leading-none">
                            GELIYAT
                        </h2>
                        <span className="font-poppins text-[11px] font-medium text-[#718083] uppercase tracking-wider">
                            Admin Panel
                        </span>
                    </div>
                </div>

                {/* Banner Photo & Mission Quote */}
                <div className="my-auto py-6 max-w-lg">
                    <div className="relative overflow-hidden rounded-3xl shadow-md border-2 border-white aspect-[4/3] bg-teal-100">
                        <img
                            src="/images/login-banner.png"
                            alt="Kegiatan pendampingan anak yatim Yayasan Geliyat"
                            className="size-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    </div>

                    <div className="mt-8 space-y-3">
                        <h3 className="font-poppins font-bold text-2xl xl:text-3xl text-[#1b2929] leading-snug">
                            Bersama merawat harapan, satu langkah setiap hari.
                        </h3>
                        <p className="font-poppins text-sm text-[#718083] leading-relaxed">
                            Ruang kerja untuk mendampingi anak binaan, mengelola donasi secara transparan,
                            dan menjaga amanah para donatur demi generasi masa depan.
                        </p>
                    </div>
                </div>

                {/* Left Bottom Footer */}
                <div className="pt-4 border-t border-[#d2eff3] flex items-center justify-between text-xs text-[#718083]">
                    <span className="font-semibold tracking-wider uppercase text-[11px]">
                        GERAKAN PEDULI YATIM • YAYASAN GELIYAT
                    </span>
                    <Link
                        href={home()}
                        className="inline-flex items-center gap-1.5 text-[#087f8c] font-medium hover:underline text-xs"
                    >
                        <ArrowLeft className="size-3.5" /> Beranda Web
                    </Link>
                </div>
            </div>

            {/* Right Column: Login Form */}
            <div className="w-full lg:w-1/2 xl:w-[48%] min-h-screen flex flex-col justify-between p-6 sm:p-10 md:p-14 lg:p-12 xl:p-16">
                {/* Mobile Top Navigation */}
                <div className="flex lg:hidden items-center justify-between pb-6 border-b border-gray-100">
                    <Link href={home()} className="flex items-center gap-2.5">
                        <img src="/images/logo.png" alt="Geliyat" className="size-9 object-contain" />
                        <div>
                            <span className="font-bold text-sm text-[#1b2929] block leading-tight">GELIYAT</span>
                            <span className="text-[10px] text-gray-500 font-medium">Admin Panel</span>
                        </div>
                    </Link>
                    <Link
                        href={home()}
                        className="inline-flex items-center gap-1 text-xs text-[#087f8c] font-medium"
                    >
                        <ArrowLeft className="size-3" /> Beranda
                    </Link>
                </div>

                {/* Form Container */}
                <div className="my-auto max-w-md w-full mx-auto py-6">
                    {/* Status Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e8f8fa] text-[#087f8c] text-xs font-semibold mb-4 border border-[#cbebf0]">
                        <span className="size-2 rounded-full bg-[#14bace] animate-pulse" />
                        Akses internal yayasan
                    </div>

                    {/* Header Text */}
                    <h1 className="font-poppins font-bold text-2xl sm:text-3xl text-[#1b2929] tracking-tight">
                        Selamat Datang di Admin Panel Geliyat
                    </h1>
                    <p className="font-poppins text-sm text-[#718083] mt-2 mb-8">
                        Masuk untuk melanjutkan kebaikan dan mengelola amanah bersama.
                    </p>

                    {status && (
                        <div className="mb-6 rounded-lg bg-green-50 border border-green-200 p-3.5 text-xs font-medium text-green-700 flex items-center gap-2">
                            <CheckCircle2 className="size-4 shrink-0 text-green-600" />
                            <span>{status}</span>
                        </div>
                    )}

                    {/* Login Form */}
                    <Form
                        {...store.form()}
                        resetOnSuccess={['password']}
                        className="space-y-5"
                    >
                        {({ processing, errors }) => (
                            <>
                                <div className="space-y-1.5">
                                    <Label htmlFor="email" className="font-poppins font-semibold text-xs text-[#1b2929]">
                                        Email / Username
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="email"
                                        placeholder="nama@geliyat.example"
                                        className="h-11 rounded-lg border-gray-200 focus-visible:border-[#14bace] focus-visible:ring-[#14bace] text-sm"
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                <div className="space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="password" className="font-poppins font-semibold text-xs text-[#1b2929]">
                                            Password
                                        </Label>
                                        {canResetPassword && (
                                            <TextLink
                                                href={request()}
                                                className="text-xs text-[#087f8c] hover:underline"
                                                tabIndex={5}
                                            >
                                                Lupa password?
                                            </TextLink>
                                        )}
                                    </div>
                                    <PasswordInput
                                        id="password"
                                        name="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        tabIndex={2}
                                        autoComplete="current-password"
                                        placeholder="Masukkan password Anda"
                                        className="h-11 rounded-lg border-gray-200 focus-visible:border-[#14bace] focus-visible:ring-[#14bace] text-sm"
                                    />
                                    <InputError message={errors.password} />
                                </div>

                                <div className="flex items-center justify-between pt-1">
                                    <div className="flex items-center space-x-2.5">
                                        <Checkbox
                                            id="remember"
                                            name="remember"
                                            checked={remember}
                                            onCheckedChange={(c) => setRemember(c === true)}
                                            tabIndex={3}
                                        />
                                        <Label htmlFor="remember" className="text-xs text-gray-600 font-normal cursor-pointer">
                                            Ingat saya di perangkat ini
                                        </Label>
                                    </div>
                                    <span className="text-xs text-[#718083]">
                                        Gunakan akun terdaftar
                                    </span>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full h-11 bg-[#12b8c8] hover:bg-[#0ea5b5] text-white font-medium rounded-lg text-sm shadow-sm transition-all duration-200 mt-2"
                                    tabIndex={4}
                                    disabled={processing}
                                >
                                    {processing && <Spinner className="size-4 mr-2" />}
                                    Masuk ke Admin Panel
                                </Button>
                            </>
                        )}
                    </Form>

                    {/* Role Access Information Card */}
                    <div className="mt-6 flex items-start gap-3 p-3.5 rounded-xl bg-[#f8fbfb] border border-[#dff1f4]">
                        <ShieldCheck className="size-5 text-[#087f8c] shrink-0 mt-0.5" />
                        <div className="text-xs text-[#526b70] leading-relaxed">
                            <strong className="text-[#1b2929] font-medium">Keamanan & Hak Akses:</strong>
                            <p className="mt-0.5">
                                Hak akses menu disesuaikan dengan peran Anda (Admin Bidang / Super Admin). Hubungi Super Admin jika membutuhkan perubahan wewenang.
                            </p>
                        </div>
                    </div>

                    {/* Testing Convenience: Demo Credentials Pills */}
                    <div className="mt-6 p-3 rounded-lg bg-gray-50 border border-dashed border-gray-200 text-xs">
                        <div className="text-gray-500 font-medium mb-2 flex items-center justify-between">
                            <span>Akun Demo Pengurus:</span>
                            <span className="text-[10px] text-gray-400">Klik untuk isi otomatis</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <button
                                type="button"
                                onClick={() => fillTestAccount('ketua@geliyat.or.id')}
                                className="px-2.5 py-1.5 rounded-md bg-white border border-gray-200 text-[#1b2929] hover:border-[#14bace] hover:text-[#087f8c] transition-colors flex items-center gap-1.5 font-medium text-[11px]"
                            >
                                <span className="size-1.5 rounded-full bg-purple-500" />
                                Super Admin (Ketua)
                            </button>
                            <button
                                type="button"
                                onClick={() => fillTestAccount('admin@geliyat.or.id')}
                                className="px-2.5 py-1.5 rounded-md bg-white border border-gray-200 text-[#1b2929] hover:border-[#14bace] hover:text-[#087f8c] transition-colors flex items-center gap-1.5 font-medium text-[11px]"
                            >
                                <span className="size-1.5 rounded-full bg-teal-500" />
                                Admin (Bidang Kemanusiaan)
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Copyright */}
                <div className="pt-6 border-t border-gray-100 text-center text-xs text-[#718083]">
                    <p>© 2026 Yayasan Geliyat • Akses Terbatas Khusus Pengurus</p>
                </div>
            </div>
        </div>
    );
}
