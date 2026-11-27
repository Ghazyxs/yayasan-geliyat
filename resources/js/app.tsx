import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import type { ComponentType, ReactNode } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { initializeTheme } from '@/hooks/use-appearance';

type LayoutComponent = ComponentType<{ children: ReactNode }>;
type PageComponent = ComponentType<Record<string, unknown>>;

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

const loadedLayouts: {
    app?: LayoutComponent;
    auth?: LayoutComponent;
    settings?: LayoutComponent;
} = {};

const isPublicPage = (name: string): boolean =>
    name === 'welcome' || name.startsWith('public/') || name === 'auth/login';

async function preloadLayouts(name: string): Promise<void> {
    if (isPublicPage(name)) {
        return;
    }

    if (name.startsWith('auth/')) {
        if (!loadedLayouts.auth) {
            loadedLayouts.auth = (
                await import('@/layouts/auth-layout')
            ).default;
        }
        return;
    }

    if (name.startsWith('settings/')) {
        await Promise.all([
            loadedLayouts.app
                ? Promise.resolve()
                : import('@/layouts/app-layout').then((m) => {
                      loadedLayouts.app = m.default;
                  }),
            loadedLayouts.settings
                ? Promise.resolve()
                : import('@/layouts/settings/layout').then((m) => {
                      loadedLayouts.settings = m.default;
                  }),
        ]);
        return;
    }

    if (!loadedLayouts.app) {
        loadedLayouts.app = (await import('@/layouts/app-layout')).default;
    }
}

void createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: async (name) => {
        const [page] = await Promise.all([
            resolvePageComponent<{ default: PageComponent }>(
                `./pages/${name}.tsx`,
                import.meta.glob<{ default: PageComponent }>(
                    './pages/**/*.tsx',
                ),
            ),
            preloadLayouts(name),
        ]);

        return page.default;
    },
    layout: (name) => {
        if (isPublicPage(name)) {
            return null;
        }

        if (name.startsWith('auth/')) {
            return loadedLayouts.auth ?? null;
        }

        if (name.startsWith('settings/')) {
            return [loadedLayouts.app, loadedLayouts.settings].filter(
                (item): item is LayoutComponent => Boolean(item),
            );
        }

        return loadedLayouts.app ?? null;
    },
    strictMode: true,
    withApp(app) {
        return (
            <>
                {app}
                <Toaster />
            </>
        );
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
