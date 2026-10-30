import { Link, usePage } from '@inertiajs/react';
import {
    LayoutDashboard,
    UsersRound,
    HeartHandshake,
    CalendarDays,
    Wallet,
    ChartNoAxesCombined,
    ShieldCheck,
    Globe,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

export function AppSidebar() {
    const { auth } = usePage().props as unknown as {
        auth?: { user?: { name: string; email: string; role?: string } };
    };
    const { state } = useSidebar();
    const isSuperAdmin = auth?.user?.role === 'super_admin';

    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: dashboard(),
            icon: LayoutDashboard,
        },
        {
            title: 'Pengelolaan Anak Yatim',
            href: '/admin/anak-yatim',
            icon: UsersRound,
        },
        {
            title: 'Pengelolaan Donasi',
            href: '/admin/donasi',
            icon: HeartHandshake,
        },
        {
            title: 'Pengelolaan Kegiatan',
            href: '/admin/kegiatan',
            icon: CalendarDays,
        },
        ...(isSuperAdmin
            ? [
                  {
                      title: 'Keuangan',
                      href: '/admin/keuangan',
                      icon: Wallet,
                  },
              ]
            : []),
        {
            title: 'Laporan',
            href: '/admin/laporan',
            icon: ChartNoAxesCombined,
        },
        ...(isSuperAdmin
            ? [
                  {
                      title: 'Manajemen Pengguna',
                      href: '/admin/pengguna',
                      icon: ShieldCheck,
                  },
              ]
            : []),
    ];

    const publicSiteItem: NavItem[] = [
        {
            title: 'Kunjungi Website Publik',
            href: '/',
            icon: Globe,
        },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset" className="border-r border-[#e4eaec] bg-white">
            <SidebarHeader className="border-b border-[#f0f4f5] pb-3">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild className="hover:bg-transparent">
                            <Link href={dashboard()} prefetch className="flex items-center gap-3">
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="gap-4 pt-3">
                <NavMain items={mainNavItems} label="RUANG KERJA" />

                {/* Security Reminder Box (From Figma) */}
                {state !== 'collapsed' && (
                    <div className="mx-3 mt-auto rounded-xl bg-[#f7f9fa] border border-[#e4eaec] p-3 text-left">
                        <div className="flex items-center gap-2 text-[#087f8c] font-semibold text-xs font-poppins">
                            <ShieldCheck className="size-4 shrink-0" />
                            <span>Ruang aman untuk peduli</span>
                        </div>
                        <p className="mt-1.5 text-[11px] leading-relaxed text-[#718083] font-poppins">
                            Data anak bersifat rahasia. Gunakan hanya untuk tujuan pendampingan dan amanah donasi.
                        </p>
                    </div>
                )}
            </SidebarContent>

            <SidebarFooter className="border-t border-[#f0f4f5] pt-2">
                <NavMain items={publicSiteItem} label="TAUTAN SITUS" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
