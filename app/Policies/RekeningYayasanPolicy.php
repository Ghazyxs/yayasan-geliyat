<?php

namespace App\Policies;

use App\Models\RekeningYayasan;
use App\Models\User;

class RekeningYayasanPolicy
{
    /**
     * Super Admin memiliki otorisasi penuh pada modul rekening yayasan.
     */
    public function before(User $user, string $ability): ?bool
    {
        if ($user->isSuperAdmin()) {
            return null; // Biarkan method spesifik mengecek aturan bisnis (mis. proteksi delete)
        }

        return false; // Tolak peran selain super_admin
    }

    /**
     * Siapa saja yang boleh melihat daftar master rekening di panel admin.
     */
    public function viewAny(User $user): bool
    {
        return $user->isSuperAdmin();
    }

    /**
     * Siapa saja yang boleh melihat detail rekening tertentu.
     */
    public function view(User $user, RekeningYayasan $rekening): bool
    {
        return $user->isSuperAdmin();
    }

    /**
     * Siapa saja yang boleh menambahkan rekening baru.
     */
    public function create(User $user): bool
    {
        return $user->isSuperAdmin();
    }

    /**
     * Siapa saja yang boleh mengedit data rekening.
     */
    public function update(User $user, RekeningYayasan $rekening): bool
    {
        return $user->isSuperAdmin();
    }

    /**
     * Siapa saja yang boleh mengubah status aktif/nonaktif rekening.
     */
    public function toggleActive(User $user, RekeningYayasan $rekening): bool
    {
        return $user->isSuperAdmin();
    }

    /**
     * Hanya Super Admin yang memiliki hak akses menghapus master rekening yayasan.
     */
    public function delete(User $user, RekeningYayasan $rekening): bool
    {
        return $user->isSuperAdmin();
    }
}
