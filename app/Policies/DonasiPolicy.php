<?php

namespace App\Policies;

use App\Models\Bidang;
use App\Models\Donasi;
use App\Models\User;

class DonasiPolicy
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
     * Menentukan apakah user dapat melihat daftar donasi.
     */
    public function viewAny(User $user): bool
    {
        return $user->role === 'admin' && $user->bidang_id !== null;
    }

    /**
     * Menentukan apakah user dapat melihat detail donasi.
     * - Donasi umum (tanpa anak spesifik): seluruh admin aktif dapat melihat.
     * - Donasi anak spesifik: hanya Admin Kemanusiaan atau Admin yang bidangnya
     *   terhubung ke anak tersebut yang dapat mengakses.
     */
    public function view(User $user, Donasi $donasi): bool
    {
        if ($user->role !== 'admin' || $user->bidang_id === null) {
            return false;
        }

        if ($donasi->anak_yatim_id !== null) {
            if ($user->bidang?->kode === Bidang::KEMANUSIAAN) {
                return true;
            }

            return $donasi->anakYatim?->terhubungKeBidang($user->bidang_id) ?? false;
        }

        return true;
    }

    /**
     * Menentukan apakah user dapat mencatat donasi baru.
     */
    public function create(User $user): bool
    {
        return $user->role === 'admin' && $user->bidang_id !== null;
    }

    /**
     * Menentukan apakah user dapat memperbarui data donasi sebelum diverifikasi.
     */
    public function update(User $user, Donasi $donasi): bool
    {
        if ($donasi->status_verifikasi !== Donasi::STATUS_MENUNGGU) {
            return false;
        }

        return $this->view($user, $donasi);
    }

    /**
     * Menentukan apakah user dapat memverifikasi donasi.
     * Hanya donasi dengan status `menunggu` yang boleh diverifikasi.
     * Super Admin diizinkan (lewat before).
     * Admin Kemanusiaan atau admin dari bidang anak yang bersangkutan diizinkan.
     */
    public function verify(User $user, Donasi $donasi): bool
    {
        if ($donasi->status_verifikasi !== Donasi::STATUS_MENUNGGU) {
            return false;
        }

        return $this->view($user, $donasi);
    }

    /**
     * Menentukan apakah user dapat menolak donasi.
     */
    public function reject(User $user, Donasi $donasi): bool
    {
        if ($donasi->status_verifikasi !== Donasi::STATUS_MENUNGGU) {
            return false;
        }

        return $this->view($user, $donasi);
    }

    /**
     * Menentukan apakah user dapat membatalkan donasi terverifikasi.
     * Pembatalan donasi mengubah transaksi keuangan menjadi VOID.
     * Demi integritas audit dan kepatuhan finansial, pembatalan donasi
     * dibatasi eksklusif hanya untuk Super Admin (ditangani via before).
     */
    public function cancel(User $user, Donasi $donasi): bool
    {
        return false;
    }

    /**
     * Menghapus catatan donasi.
     * Donasi keuangan tidak boleh dihapus sembarangan untuk jejak audit;
     * dibatasi hanya untuk Super Admin jika benar-benar darurat (via before).
     */
    public function delete(User $user, Donasi $donasi): bool
    {
        return false;
    }
}
