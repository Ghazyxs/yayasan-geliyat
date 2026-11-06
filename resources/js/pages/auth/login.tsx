import { useState } from 'react';
import { Form, Head, Link, usePage } from '@inertiajs/react';
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
    const { appEnv } = usePage().props as unknown as { appEnv: string };
    const isLocalEnv = appEnv === 'local';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(true);

    // Fungsi ini hanya dipakai pada lingkungan development lokal
    const fillTestAccount = (userEmail: string) => {
        setEmail(userEmail);
        setPassword('password');
    };

    return (
        <div className="flex min-h-screen w-full flex-col bg-white font-poppins text-[#1d2b2d] selection:bg-[#14bace]/20 selection:text-[#087f8c] lg:flex-row">
            <Head title="Masuk ke Admin Panel - Yayasan Geliyat" />

            {/* Left Column: Geliyat Story & Visual Banner (Hidden on mobile, visible on desktop) */}
            <div className="hidden flex-col justify-between border-r border-[#cbebf0] bg-[#e8f8fa] p-10 lg:flex lg:w-1/2 xl:w-[52%] xl:p-14">
                {/* Branding Top */}
                <div className="flex items-center gap-3.5">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-[#d2f0f4] bg-white p-1 shadow-sm">
                        <img
                            src="/images/logo.png"
                            alt="Logo Yayasan Geliyat"
                            className="size-10 object-contain"
                        />
                    </div>
                    <div>
                        <h2 className="font-poppins text-lg leading-none font-bold tracking-tight text-[#1b2929]">
                            GELIYAT
                        </h2>
                        <span className="font-poppins text-[11px] font-medium tracking-wider text-[#718083] uppercase">
                            Admin Panel
                        </span>
                    </div>
                </div>

                {/* Banner Photo & Mission Quote */}
                <div className="my-auto max-w-lg py-6">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border-2 border-white bg-teal-100 shadow-md">
                        <img
                            src="/images/login-banner.png"
                            alt="Kegiatan pendampingan anak yatim Yayasan Geliyat"
                            className="size-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    </div>

                    <div className="mt-8 space-y-3">
                        <h3 className="font-poppins text-2xl leading-snug font-bold text-[#1b2929] xl:text-3xl">
                            Bersama merawat harapan, satu langkah setiap hari.
                        </h3>
                        <p className="font-poppins text-sm leading-relaxed text-[#718083]">
                            Ruang kerja untuk mendampingi anak binaan, mengelola
                            donasi secara transparan, dan menjaga amanah para
                            donatur demi generasi masa depan.
                        </p>
                    </div>
                </div>

                {/* Left Bottom Footer */}
                <div className="flex items-center justify-between border-t border-[#d2eff3] pt-4 text-xs text-[#718083]">
                    <span className="text-[11px] font-semibold tracking-wider uppercase">
                        GERAKAN PEDULI YATIM • YAYASAN GELIYAT
                    </span>
                    <Link
                        href={home()}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-[#087f8c] hover:underline"
                    >
                        <ArrowLeft className="size-3.5" /> Beranda Web
                    </Link>
                </div>
            </div>

            {/* Right Column: Login Form */}
            <div className="flex min-h-screen w-full flex-col justify-between p-6 sm:p-10 md:p-14 lg:w-1/2 lg:p-12 xl:w-[48%] xl:p-16">
                {/* Mobile Top Navigation */}
                <div className="flex items-center justify-between border-b border-gray-100 pb-6 lg:hidden">
                    <Link href={home()} className="flex items-center gap-2.5">
                        <img
                            src="/images/logo.png"
                            alt="Geliyat"
                            className="size-9 object-contain"
                        />
                        <div>
                            <span className="block text-sm leading-tight font-bold text-[#1b2929]">
                                GELIYAT
                            </span>
                            <span className="text-[10px] font-medium text-gray-500">
                                Admin Panel
                            </span>
                        </div>
                    </Link>
                    <Link
                        href={home()}
                        className="inline-flex items-center gap-1 text-xs font-medium text-[#087f8c]"
                    >
                        <ArrowLeft className="size-3" /> Beranda
                    </Link>
                </div>

                {/* Form Container */}
                <div className="mx-auto my-auto w-full max-w-md py-6">
                    {/* Status Badge */}
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#cbebf0] bg-[#e8f8fa] px-3 py-1 text-xs font-semibold text-[#087f8c]">
                        <span className="size-2 animate-pulse rounded-full bg-[#14bace]" />
                        Akses internal yayasan
                    </div>

                    {/* Header Text */}
                    <h1 className="font-poppins text-2xl font-bold tracking-tight text-[#1b2929] sm:text-3xl">
                        Selamat Datang di Admin Panel Geliyat
                    </h1>
                    <p className="mt-2 mb-8 font-poppins text-sm text-[#718083]">
                        Masuk untuk melanjutkan kebaikan dan mengelola amanah
                        bersama.
                    </p>

                    {status && (
                        <div className="mb-6 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-3.5 text-xs font-medium text-green-700">
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
                                    <Label
                                        htmlFor="email"
                                        className="font-poppins text-xs font-semibold text-[#1b2929]"
                                    >
                                        Email / Username
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="email"
                                        placeholder="nama@geliyat.example"
                                        className="h-11 rounded-lg border-gray-200 text-sm focus-visible:border-[#14bace] focus-visible:ring-[#14bace]"
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                <div className="space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        <Label
                                            htmlFor="password"
                                            className="font-poppins text-xs font-semibold text-[#1b2929]"
                                        >
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
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        required
                                        tabIndex={2}
                                        autoComplete="current-password"
                                        placeholder="Masukkan password Anda"
                                        className="h-11 rounded-lg border-gray-200 text-sm focus-visible:border-[#14bace] focus-visible:ring-[#14bace]"
                                    />
                                    <InputError message={errors.password} />
                                </div>

                                <div className="flex items-center justify-between pt-1">
                                    <div className="flex items-center space-x-2.5">
                                        <Checkbox
                                            id="remember"
                                            name="remember"
                                            checked={remember}
                                            onCheckedChange={(c) =>
                                                setRemember(c === true)
                                            }
                                            tabIndex={3}
                                        />
                                        <Label
                                            htmlFor="remember"
                                            className="cursor-pointer text-xs font-normal text-gray-600"
                                        >
                                            Ingat saya di perangkat ini
                                        </Label>
                                    </div>
                                    <span className="text-xs text-[#718083]">
                                        Gunakan akun terdaftar
                                    </span>
                                </div>

                                <Button
                                    type="submit"
                                    className="mt-2 h-11 w-full rounded-lg bg-[#12b8c8] text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-[#0ea5b5]"
                                    tabIndex={4}
                                    disabled={processing}
                                >
                                    {processing && (
                                        <Spinner className="mr-2 size-4" />
                                    )}
                                    Masuk ke Admin Panel
                                </Button>
                            </>
                        )}
                    </Form>

                    {/* Role Access Information Card */}
                    <div className="mt-6 flex items-start gap-3 rounded-xl border border-[#dff1f4] bg-[#f8fbfb] p-3.5">
                        <ShieldCheck className="mt-0.5 size-5 shrink-0 text-[#087f8c]" />
                        <div className="text-xs leading-relaxed text-[#526b70]">
                            <strong className="font-medium text-[#1b2929]">
                                Keamanan & Hak Akses:
                            </strong>
                            <p className="mt-0.5">
                                Hak akses menu disesuaikan dengan peran Anda
                                (Admin Bidang / Super Admin). Hubungi Super
                                Admin jika membutuhkan perubahan wewenang.
                            </p>
                        </div>
                    </div>

                    {/* Testing Convenience: Demo Credentials Pills — hanya di local development */}
                    {isLocalEnv && (
                        <div className="mt-6 rounded-lg border border-dashed border-amber-200 bg-amber-50 p-3 text-xs">
                            <div className="mb-2 flex items-center justify-between font-medium text-amber-600">
                                <span>Akun Demo (Dev Only):</span>
                                <span className="text-[10px] text-amber-400">
                                    Klik untuk isi otomatis
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    type="button"
                                    onClick={() =>
                                        fillTestAccount('ketua@geliyat.or.id')
                                    }
                                    className="flex items-center gap-1.5 rounded-md border border-amber-200 bg-white px-2.5 py-1.5 text-[11px] font-medium text-[#1b2929] transition-colors hover:border-[#14bace] hover:text-[#087f8c]"
                                >
                                    <span className="size-1.5 rounded-full bg-purple-500" />
                                    Super Admin (Ketua)
                                </button>
                                <button
                                    type="button"
                                    onClick={() =>
                                        fillTestAccount('admin@geliyat.or.id')
                                    }
                                    className="flex items-center gap-1.5 rounded-md border border-amber-200 bg-white px-2.5 py-1.5 text-[11px] font-medium text-[#1b2929] transition-colors hover:border-[#14bace] hover:text-[#087f8c]"
                                >
                                    <span className="size-1.5 rounded-full bg-teal-500" />
                                    Admin (Bidang Kemanusiaan)
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Bottom Copyright */}
                <div className="border-t border-gray-100 pt-6 text-center text-xs text-[#718083]">
                    <p>
                        © 2026 Yayasan Geliyat • Akses Terbatas Khusus Pengurus
                    </p>
                </div>
            </div>
        </div>
    );
}
