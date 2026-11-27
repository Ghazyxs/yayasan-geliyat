import { type SVGProps } from 'react';
import { cn } from '@/lib/utils';

interface BidangIconProps extends SVGProps<SVGSVGElement> {
    kode: string;
}

interface BidangIconBadgeProps {
    kode: string;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const BADGE_STYLES: Record<string, string> = {
    pendidikan:
        'bg-gradient-to-br from-[#e0f7fa] via-[#ecfeff] to-[#cffafe] ring-[#14bace]/20',
    keagamaan:
        'bg-gradient-to-br from-[#e6f9f3] via-[#ecfdf5] to-[#d1fae5] ring-[#10b981]/20',
    kemanusiaan:
        'bg-gradient-to-br from-[#fff1f2] via-[#fff5f6] to-[#ffe4e6] ring-[#f43f5e]/20',
    ekonomi:
        'bg-gradient-to-br from-[#fef9e7] via-[#fffbeb] to-[#fef3c7] ring-[#f59e0b]/25',
};

const SIZE_CLASSES: Record<'sm' | 'md' | 'lg', { box: string; icon: string }> =
    {
        sm: { box: 'size-11 rounded-xl', icon: 'size-6' },
        md: { box: 'size-13 rounded-2xl', icon: 'size-7' },
        lg: { box: 'size-14 rounded-2xl', icon: 'size-8' },
    };

function PendidikanIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" {...props}>
            {/* Graduation cap */}
            <path
                d="M16 4.5L6 9.2L16 13.9L26 9.2L16 4.5Z"
                fill="#14bace"
                fillOpacity="0.22"
                stroke="#0891b2"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M10.5 11.4V15.3C10.5 16.7 13 17.8 16 17.8C19 17.8 21.5 16.7 21.5 15.3V11.4"
                stroke="#0891b2"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M24.5 10V15"
                stroke="#0891b2"
                strokeWidth="1.6"
                strokeLinecap="round"
            />
            <circle cx="24.5" cy="16.2" r="1.2" fill="#14bace" />

            {/* Open book */}
            <path
                d="M6.5 20.6C9.8 20.6 13.5 21.4 16 23.3V27.2C13.5 25.5 9.8 24.8 6.5 24.8V20.6Z"
                fill="#14bace"
                fillOpacity="0.16"
                stroke="#0e7490"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M25.5 20.6C22.2 20.6 18.5 21.4 16 23.3V27.2C18.5 25.5 22.2 24.8 25.5 24.8V20.6Z"
                fill="#14bace"
                fillOpacity="0.28"
                stroke="#0e7490"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function KeagamaanIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" {...props}>
            {/* Crescent moon */}
            <path
                d="M24.2 5.1C22.7 5.5 21.8 6.9 22.1 8.4C22.4 9.9 23.9 10.8 25.4 10.5C26 10.4 26.5 10 26.9 9.5C25.8 9.8 24.7 9 24.5 7.9C24.3 6.8 24.9 5.7 25.8 5.2C25.3 5 24.7 5 24.2 5.1Z"
                fill="#10b981"
                fillOpacity="0.32"
                stroke="#059669"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* Mosque dome */}
            <path
                d="M15.5 7.5V10"
                stroke="#0f766e"
                strokeWidth="1.75"
                strokeLinecap="round"
            />
            <path
                d="M8.5 17.5C8.5 13.1 11.7 10 15.5 10C19.3 10 22.5 13.1 22.5 17.5H8.5Z"
                fill="#14b8a6"
                fillOpacity="0.24"
                stroke="#0f766e"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* Mosque base wall */}
            <path
                d="M7 17.5H24V26.5H7V17.5Z"
                fill="#14b8a6"
                fillOpacity="0.1"
                stroke="#0f766e"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* Arched doorway */}
            <path
                d="M13 26.5V22.3C13 20.8 14.1 19.7 15.5 19.7C16.9 19.7 18 20.8 18 22.3V26.5"
                fill="#059669"
                fillOpacity="0.22"
                stroke="#0f766e"
                strokeWidth="1.65"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* Ground line */}
            <path
                d="M5 26.5H26"
                stroke="#0f766e"
                strokeWidth="1.75"
                strokeLinecap="round"
            />
        </svg>
    );
}

function KemanusiaanIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" {...props}>
            {/* Warm heart */}
            <path
                d="M16.5 17.3C16.5 17.3 10.2 13.5 10.2 9.6C10.2 7.6 11.8 6 13.7 6C14.9 6 16 6.7 16.5 7.6C17 6.7 18.1 6 19.3 6C21.2 6 22.8 7.6 22.8 9.6C22.8 13.5 16.5 17.3 16.5 17.3Z"
                fill="#fb7185"
                fillOpacity="0.3"
                stroke="#e11d48"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* Wrist cuff */}
            <path
                d="M5.5 20.8H8.5V26.5H5.5V20.8Z"
                fill="#fda4af"
                fillOpacity="0.35"
                stroke="#be123c"
                strokeWidth="1.65"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* Caring cupped hand */}
            <path
                d="M8.5 25.5H18.4C19.6 25.5 20.7 25 21.6 24.2L25.6 20.5C26.3 19.9 26.3 18.8 25.7 18.2C25 17.5 23.9 17.5 23.2 18.2L19.7 21.2H14.8"
                stroke="#be123c"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M8.5 21.5H12.8C13.9 21.5 14.9 22 15.6 22.8"
                stroke="#be123c"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function EkonomiIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" {...props}>
            {/* Growing sprout */}
            <path
                d="M16 17V10.5"
                stroke="#0d9488"
                strokeWidth="1.75"
                strokeLinecap="round"
            />
            <path
                d="M16 13.4C16 10.1 13.3 7.5 9.6 7.5C9.6 11.2 12.2 13.8 16 13.4Z"
                fill="#14b8a6"
                fillOpacity="0.28"
                stroke="#0d9488"
                strokeWidth="1.65"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M16 11.1C16 7.8 18.7 5.2 22.4 5.2C22.4 8.9 19.8 11.5 16 11.1Z"
                fill="#14b8a6"
                fillOpacity="0.28"
                stroke="#0d9488"
                strokeWidth="1.65"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* Stacked coins */}
            <ellipse
                cx="16"
                cy="19.8"
                rx="7.5"
                ry="2.7"
                fill="#fbbf24"
                fillOpacity="0.32"
                stroke="#d97706"
                strokeWidth="1.75"
            />
            <path
                d="M8.5 19.8V23.4C8.5 24.9 11.9 26.2 16 26.2C20.1 26.2 23.5 24.9 23.5 23.4V19.8"
                fill="#fbbf24"
                fillOpacity="0.14"
                stroke="#d97706"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M8.5 21.6C8.5 23.1 11.9 24.4 16 24.4C20.1 24.4 23.5 23.1 23.5 21.6"
                stroke="#d97706"
                strokeWidth="1.5"
                strokeLinecap="round"
            />
        </svg>
    );
}

export function BidangIcon({ kode, ...props }: BidangIconProps) {
    switch (kode) {
        case 'pendidikan':
            return <PendidikanIcon {...props} />;
        case 'keagamaan':
            return <KeagamaanIcon {...props} />;
        case 'kemanusiaan':
            return <KemanusiaanIcon {...props} />;
        case 'ekonomi':
            return <EkonomiIcon {...props} />;
        default:
            return <PendidikanIcon {...props} />;
    }
}

export function BidangIconBadge({
    kode,
    size = 'md',
    className,
}: BidangIconBadgeProps) {
    const badgeColor = BADGE_STYLES[kode] ?? BADGE_STYLES.pendidikan;
    const sizeStyle = SIZE_CLASSES[size];

    return (
        <div
            className={cn(
                'flex items-center justify-center shadow-xs ring-1 transition-transform duration-200 group-hover:scale-110',
                badgeColor,
                sizeStyle.box,
                className,
            )}
        >
            <BidangIcon kode={kode} className={sizeStyle.icon} />
        </div>
    );
}
