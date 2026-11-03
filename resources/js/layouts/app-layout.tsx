import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import type { BreadcrumbItem } from '@/types';

export default function AppLayout({
    breadcrumbs = [],
    children,
}: {
    breadcrumbs?: BreadcrumbItem[];
    children: React.ReactNode;
}) {
    const pageBreadcrumbs: BreadcrumbItem[] =
        breadcrumbs.length > 0
            ? breadcrumbs
            : ((
                  children as unknown as {
                      type?: { layout?: { breadcrumbs?: BreadcrumbItem[] } };
                  }
              )?.type?.layout?.breadcrumbs ?? []);

    return (
        <AppLayoutTemplate breadcrumbs={pageBreadcrumbs}>
            {children}
        </AppLayoutTemplate>
    );
}
