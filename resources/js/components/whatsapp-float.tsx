const WHATSAPP_URL =
    'https://wa.me/6282126854485?text=Halo%20Yayasan%20Geliyat%2C%20saya%20ingin%20bertanya%20mengenai%20informasi%20dan%20program%20Yayasan%20Geliyat%20Mahdiesa%20Nahate.';

export default function WhatsAppFloat() {
    return (
        <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Hubungi Kami via WhatsApp"
            title="Hubungi Kami"
            className="group fixed right-5 bottom-5 z-40 flex items-center gap-2.5 rounded-full bg-[#25D366] px-4 py-3 text-white shadow-lg ring-1 ring-black/5 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#1ebe5d] hover:shadow-xl active:scale-95 sm:right-6 sm:bottom-6"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-6 shrink-0 transition-transform duration-200 group-hover:scale-105"
                aria-hidden="true"
            >
                <path d="M12.031 2c-5.516 0-9.969 4.453-9.969 9.969 0 1.766.469 3.484 1.344 5l-1.406 5.141 5.281-1.391c1.469.797 3.109 1.219 4.75 1.219 5.516 0 9.969-4.453 9.969-9.969S17.547 2 12.031 2zm5.813 14.125c-.25.703-1.438 1.344-2 1.422-.516.078-1.188.109-1.922-.125-.453-.141-1.031-.344-1.766-.656-3.078-1.328-5.094-4.438-5.25-4.641-.156-.203-1.25-1.656-1.25-3.156s.781-2.234 1.063-2.547c.281-.313.609-.391.813-.391s.406 0 .578.016c.188.016.438-.078.688.531.25.609.859 2.094.938 2.25.078.156.125.344.031.547-.094.203-.141.328-.297.5-.156.172-.313.391-.453.516-.156.156-.313.328-.141.641.172.313.781 1.297 1.672 2.094 1.156 1.031 2.125 1.344 2.438 1.5.313.156.484.125.672-.078.188-.203.781-.906.984-1.219.203-.313.406-.266.688-.156.281.109 1.797.844 2.109 1s.516.234.594.359c.078.125.078.734-.172 1.438z" />
            </svg>
            <span className="font-poppins text-xs font-semibold tracking-wide whitespace-nowrap sm:text-sm">
                Hubungi Kami
            </span>
        </a>
    );
}

