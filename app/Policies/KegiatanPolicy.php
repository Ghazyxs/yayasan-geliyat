<?php

namespace App\Policies;

use App\Models\Kegiatan;
use App\Models\User;

class KegiatanPolicy
{
    /**
     * Super Admin bypass & inactive check.
     */
    public function before(User $user, string $ability): ?bool
    {
        if (! $user->is_active) {
            return false;
        }

        if ($user->isSuperAdmin()) {
            return true;
        }

        return null;
    }

    /**
     * Menentukan apakah user dapat melihat daftar kegiatan.
     */
    public function viewAny(User $user): bool
    {
        return $user->role === 'admin' || $user->isSuperAdmin();
    }

    /**
     * Menentukan apakah user dapat melihat detail kegiatan.
     */
    public function view(User $user, Kegiatan $kegiatan): bool
    {
        return $user->role === 'admin' || $user->isSuperAdmin();
    }

    /**
     * Menentukan apakah user dapat membuat kegiatan baru.
     */
    public function create(User $user): bool
    {
        return $user->role === 'admin' || $user->isSuperAdmin();
    }

    /**
     * Menentukan apakah user dapat memperbarui kegiatan.
     */
    public function update(User $user, Kegiatan $kegiatan): bool
    {
        return $user->role === 'admin' || $user->isSuperAdmin();
    }

    /**
     * Menentukan apakah user dapat menghapus kegiatan.
     */
    public function delete(User $user, Kegiatan $kegiatan): bool
    {
        return $user->role === 'admin' || $user->isSuperAdmin();
    }
}
