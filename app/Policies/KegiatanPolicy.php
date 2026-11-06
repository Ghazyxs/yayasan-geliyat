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
        return $user->role === 'admin' && $user->bidang_id !== null;
    }

    /**
     * Menentukan apakah user dapat melihat detail kegiatan.
     * - Kegiatan umum yayasan (bidang_id = NULL): dapat dilihat seluruh admin aktif.
     * - Kegiatan spesifik bidang: hanya dapat dilihat oleh admin bidang yang bersangkutan.
     *   Mencegah manipulasi URL / ID untuk mengintip agenda internal bidang lain.
     */
    public function view(User $user, Kegiatan $kegiatan): bool
    {
        if ($user->role !== 'admin' || $user->bidang_id === null) {
            return false;
        }

        if ($kegiatan->bidang_id === null) {
            return true;
        }

        return $kegiatan->bidang_id === $user->bidang_id;
    }

    /**
     * Menentukan apakah user dapat membuat kegiatan baru.
     */
    public function create(User $user): bool
    {
        return $user->role === 'admin' && $user->bidang_id !== null;
    }

    /**
     * Menentukan apakah user dapat memperbarui kegiatan.
     * - Kegiatan umum yayasan: hanya Super Admin (lewat before).
     * - Kegiatan bidang: hanya admin bidang yang bersangkutan.
     */
    public function update(User $user, Kegiatan $kegiatan): bool
    {
        if ($user->role !== 'admin' || $user->bidang_id === null) {
            return false;
        }

        if ($kegiatan->bidang_id === null) {
            return false;
        }

        return $kegiatan->bidang_id === $user->bidang_id;
    }

    /**
     * Menentukan apakah user dapat menghapus kegiatan.
     * - Kegiatan umum yayasan: hanya Super Admin (lewat before).
     * - Kegiatan bidang: hanya admin bidang yang bersangkutan.
     */
    public function delete(User $user, Kegiatan $kegiatan): bool
    {
        if ($user->role !== 'admin' || $user->bidang_id === null) {
            return false;
        }

        if ($kegiatan->bidang_id === null) {
            return false;
        }

        return $kegiatan->bidang_id === $user->bidang_id;
    }
}
