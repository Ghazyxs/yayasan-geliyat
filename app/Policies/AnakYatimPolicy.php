<?php

namespace App\Policies;

use App\Models\AnakYatim;
use App\Models\Bidang;
use App\Models\User;

class AnakYatimPolicy
{
    /**
     * Super Admin bypass:
     * - User tidak aktif (is_active = false) otomatis ditolak untuk seluruh aksi.
     * - Super Admin memiliki akses penuh ke seluruh anak yatim di seluruh bidang.
     * - Nilai null melanjutkan pemeriksaan ke method kemampuan spesifik.
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
     * Menentukan apakah user dapat melihat daftar anak yatim.
     * - Super Admin diizinkan (lewat before).
     * - Admin hanya diizinkan jika akun aktif dan terhubung ke bidang_id (tidak boleh NULL).
     * - Role lain / Admin tanpa bidang_id ditolak secara fail-safe.
     */
    public function viewAny(User $user): bool
    {
        return $user->role === 'admin' && $user->bidang_id !== null;
    }

    /**
     * Menentukan apakah user dapat melihat data detail anak yatim.
     * - Super Admin diizinkan (lewat before).
     * - Admin hanya boleh melihat jika anak terhubung ke bidang user.
     * - Admin tanpa bidang_id atau mencoba mengakses anak bidang lain ditolak.
     */
    public function view(User $user, AnakYatim $anakYatim): bool
    {
        if ($user->role !== 'admin' || $user->bidang_id === null) {
            return false;
        }

        return $anakYatim->terhubungKeBidang($user->bidang_id);
    }

    /**
     * Menentukan apakah user dapat mendaftarkan anak yatim baru.
     * - Super Admin diizinkan (lewat before).
     * - Admin yang memiliki bidang_id valid diizinkan.
     */
    public function create(User $user): bool
    {
        return $user->role === 'admin' && $user->bidang_id !== null;
    }

    /**
     * Menentukan apakah user dapat memperbarui data anak yatim.
     * - Super Admin diizinkan (lewat before).
     * - Admin hanya dapat memperbarui anak yang terhubung ke bidangnya.
     */
    public function update(User $user, AnakYatim $anakYatim): bool
    {
        if ($user->role !== 'admin' || $user->bidang_id === null) {
            return false;
        }

        return $anakYatim->terhubungKeBidang($user->bidang_id);
    }

    /**
     * Menentukan apakah user dapat menghapus data anak yatim.
     * - Super Admin diizinkan (lewat before).
     * - Admin hanya dapat menghapus jika anak terhubung ke bidangnya.
     */
    public function delete(User $user, AnakYatim $anakYatim): bool
    {
        if ($user->role !== 'admin' || $user->bidang_id === null) {
            return false;
        }

        return $anakYatim->terhubungKeBidang($user->bidang_id);
    }

    /**
     * Menentukan apakah user dapat menghubungkan bidang tertentu ke anak yatim.
     * Mencegah parameter tampering (Admin tidak boleh menambahkan bidang orang lain).
     */
    public function attachBidang(User $user, AnakYatim $anakYatim, int $targetBidangId): bool
    {
        if ($user->role !== 'admin' || $user->bidang_id === null) {
            return false;
        }

        // Admin hanya boleh mengaitkan anak ke bidangnya sendiri
        return $user->bidang_id === $targetBidangId;
    }

    /**
     * Menentukan apakah user dapat melepaskan relasi bidang tertentu dari anak yatim.
     * Mencegah parameter tampering.
     */
    public function detachBidang(User $user, AnakYatim $anakYatim, int $targetBidangId): bool
    {
        if ($user->role !== 'admin' || $user->bidang_id === null) {
            return false;
        }

        // Admin hanya boleh melepas keterkaitan dari bidangnya sendiri
        return $user->bidang_id === $targetBidangId;
    }

    /**
     * Otorisasi khusus data sensitif (UU PDP):
     * NIK dan alamat_detail hanya boleh dibuka ke:
     * - Super Admin (lewat before).
     * - Admin Bidang Kemanusiaan & Yatim yang mengasuh anak tersebut.
     * Admin bidang lain (Pendidikan, Keagamaan, Ekonomi) atau admin tanpa bidang_id
     * DITOLAK mengakses data sensitif meskipun anak terhubung ke program mereka.
     */
    public function viewSensitiveData(User $user, AnakYatim $anakYatim): bool
    {
        if ($user->role !== 'admin' || $user->bidang_id === null) {
            return false;
        }

        if (! $anakYatim->terhubungKeBidang($user->bidang_id)) {
            return false;
        }

        return $user->bidang?->kode === Bidang::KEMANUSIAAN;
    }
}
