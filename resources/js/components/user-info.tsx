import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import type { User } from '@/types';

export function UserInfo({
    user,
    showEmail = false,
}: {
    user: User;
    showEmail?: boolean;
}) {
    const getInitials = useInitials();
    const bidangLabel =
        typeof user.bidang === 'object' && user.bidang !== null
            ? ((user.bidang as { nama?: string; kode?: string }).nama ?? '')
            : typeof user.bidang === 'string'
              ? user.bidang
              : '';

    return (
        <>
            <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg bg-[#e8f8fa] font-bold text-[#087f8c]">
                    {getInitials(user.name)}
                </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold text-slate-800">
                    {user.name}
                </span>
                {showEmail ? (
                    <span className="truncate text-xs text-muted-foreground">
                        {user.email}
                    </span>
                ) : (
                    <span className="truncate text-[11px] font-semibold text-[#087f8c]">
                        {user.role === 'super_admin'
                            ? 'Super Admin (Ketua)'
                            : `Admin ${bidangLabel ? `• ${bidangLabel}` : ''}`}
                    </span>
                )}
            </div>
        </>
    );
}
