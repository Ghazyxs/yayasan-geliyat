export default function AppLogo({ className = '' }: { className?: string }) {
    return (
        <div className={`flex items-center gap-2.5 ${className}`}>
            <img
                src="/images/logo.png"
                alt="Yayasan Geliyat"
                className="size-8 object-contain shrink-0 rounded-md"
            />
            <div className="flex flex-col text-left">
                <span className="font-poppins font-bold text-sm tracking-wide text-[#1b2929] dark:text-white leading-tight">
                    GELIYAT
                </span>
                <span className="font-poppins text-[10px] text-[#087f8c] dark:text-[#14bace] tracking-wider leading-tight">
                    Gerakan Peduli Yatim
                </span>
            </div>
        </div>
    );
}
