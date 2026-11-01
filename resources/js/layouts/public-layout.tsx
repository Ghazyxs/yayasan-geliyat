import { ReactNode } from 'react';
import PublicNavbar from '@/components/public-navbar';
import PublicFooter from '@/components/public-footer';

interface PublicLayoutProps {
    children: ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
    return (
        <div className="flex min-h-screen flex-col bg-[#fbfdfd] font-sans text-[#1d2b2d] antialiased selection:bg-[#14bace]/20 selection:text-[#087f8c]">
            {/* Top Navigation */}
            <PublicNavbar />

            {/* Main Content Area */}
            <main className="w-full flex-1">{children}</main>

            {/* Footer */}
            <PublicFooter />
        </div>
    );
}
