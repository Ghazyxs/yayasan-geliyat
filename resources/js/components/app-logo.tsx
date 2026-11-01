export default function AppLogo({ className = '' }: { className?: string }) {
    return (
        <div className={`flex items-center gap-2.5 ${className}`}>
            <img
                src="/images/logo.png"
                alt="Yayasan Geliyat"
                className="size-8 shrink-0 rounded-md object-contain"
            />
            <div className="flex flex-col text-left">
                <span className="font-poppins text-sm leading-tight font-bold tracking-wide text-[#1b2929] dark:text-white">
                    GELIYAT
                </span>
                <span className="font-poppins text-[10px] leading-tight tracking-wider text-[#087f8c] dark:text-[#14bace]">
                    Gerakan Peduli Yatim
                </span>
            </div>
        </div>
    );
}
