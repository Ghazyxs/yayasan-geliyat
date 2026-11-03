export default function AppLogo({ className = '' }: { className?: string }) {
    return (
        <div className={`flex items-center gap-2.5 ${className}`}>
            <img
                src="/images/logo.png"
                alt="Yayasan Geliyat"
                className="size-8 shrink-0 rounded-md object-contain"
            />
            <div className="flex flex-col text-left">
                <span className="font-poppins text-sm leading-tight font-bold tracking-wide text-slate-800">
                    GELIYAT
                </span>
                <span className="font-poppins text-[10px] leading-tight font-semibold tracking-wider text-[#087f8c]">
                    Gerakan Peduli Yatim
                </span>
            </div>
        </div>
    );
}
