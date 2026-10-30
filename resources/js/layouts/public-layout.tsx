import { ReactNode } from 'react';
import PublicNavbar from '@/components/public-navbar';
import PublicFooter from '@/components/public-footer';

interface PublicLayoutProps {
    children: ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
    return (
        <div className="min-h-screen flex flex-col bg-[#fbfdfd] text-[#1d2b2d] font-sans antialiased selection:bg-[#14bace]/20 selection:text-[#087f8c]">
            {/* Top Navigation */}
            <PublicNavbar />

            {/* Main Content Area */}
            <main className="flex-1 w-full">
                {children}
            </main>

            {/* Footer */}
            <PublicFooter />
        </div>
    );
}

