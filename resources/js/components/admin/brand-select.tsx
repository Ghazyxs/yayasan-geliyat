import * as SelectPrimitive from '@radix-ui/react-select';
import { cn } from '@/lib/utils';

export interface BrandSelectOption {
    value: string;
    label: string;
}

interface BrandSelectProps {
    id?: string;
    value: string;
    onValueChange: (val: string) => void;
    options: BrandSelectOption[];
    placeholder?: string;
    disabled?: boolean;
    ariaLabel?: string;
    className?: string;
}

const ALL_SENTINEL = '__ALL__';

/**
 * Dropdown bergaya identitas warna primer/sekunder Yayasan Geliyat (tanpa ikon).
 */
export function BrandSelect({
    id,
    value,
    onValueChange,
    options,
    placeholder = 'Pilih opsi...',
    disabled = false,
    ariaLabel,
    className,
}: BrandSelectProps) {
    const internalValue = value === '' ? ALL_SENTINEL : value;

    const handleChange = (nextVal: string) => {
        onValueChange(nextVal === ALL_SENTINEL ? '' : nextVal);
    };

    return (
        <SelectPrimitive.Root
            value={internalValue}
            onValueChange={handleChange}
            disabled={disabled}
        >
            <SelectPrimitive.Trigger
                id={id}
                aria-label={ariaLabel}
                className={cn(
                    'flex h-9 w-full items-center justify-between gap-2 rounded-lg border border-[#cbebf0] bg-[#f7fcfd] px-3 py-1.5 font-poppins text-xs font-medium text-[#087f8c] transition-colors outline-none hover:border-[#14bace] hover:bg-[#e8f8fa] focus:border-[#14bace] focus:ring-2 focus:ring-[#14bace]/25 disabled:cursor-not-allowed disabled:opacity-50',
                    className,
                )}
            >
                <span className="truncate text-left">
                    <SelectPrimitive.Value placeholder={placeholder} />
                </span>
                <span
                    aria-hidden="true"
                    className="ml-2 inline-block size-2 shrink-0 -translate-y-0.5 rotate-45 border-r-2 border-b-2 border-[#087f8c]"
                />
            </SelectPrimitive.Trigger>

            <SelectPrimitive.Portal>
                <SelectPrimitive.Content
                    position="popper"
                    sideOffset={4}
                    avoidCollisions={false}
                    className="z-[70] max-h-60 min-w-[var(--radix-select-trigger-width)] overflow-y-auto rounded-xl border border-[#cbebf0] bg-white p-1.5 font-poppins shadow-lg shadow-[#087f8c]/10"
                >
                    <SelectPrimitive.Viewport className="w-full space-y-0.5">
                        {options.map((opt) => {
                            const optionVal =
                                opt.value === '' ? ALL_SENTINEL : opt.value;
                            return (
                                <SelectPrimitive.Item
                                    key={optionVal}
                                    value={optionVal}
                                    className="relative flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-xs font-medium text-slate-700 transition-colors outline-none select-none data-[highlighted]:bg-[#e8f8fa] data-[highlighted]:text-[#087f8c] data-[state=checked]:bg-[#14bace] data-[state=checked]:font-semibold data-[state=checked]:text-white"
                                >
                                    <SelectPrimitive.ItemText>
                                        {opt.label}
                                    </SelectPrimitive.ItemText>
                                </SelectPrimitive.Item>
                            );
                        })}
                    </SelectPrimitive.Viewport>
                </SelectPrimitive.Content>
            </SelectPrimitive.Portal>
        </SelectPrimitive.Root>
    );
}
