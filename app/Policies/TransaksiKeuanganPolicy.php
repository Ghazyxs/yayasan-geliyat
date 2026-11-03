<?php

namespace App\Policies;

use App\Models\TransaksiKeuangan;
use App\Models\User;

class TransaksiKeuanganPolicy
{
    /**
     * Super Admin bypass & inactive check.
     * Modul Keuangan yayasan memiliki proteksi tingkat tinggi (eksklusif Super Admin).
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
     * Menentukan apakah user dapat melihat daftar buku kas keuangan.
     */
    public function viewAny(User $user): bool
    {
        return false;
    }

    /**
     * Menentukan apakah user dapat melihat rincian transaksi kas.
     */
    public function view(User $user, TransaksiKeuangan $transaksi): bool
    {
        return false;
    }

    /**
     * Menentukan apakah user dapat mencatat transaksi keuangan manual.
     */
    public function create(User $user): bool
    {
        return false;
    }

    /**
     * Menentukan apakah transaksi kas boleh diubah secara langsung.
     * Prinsip akuntansi yayasan: transaksi tidak boleh diubah untuk integritas jejak audit.
     */
    public function update(User $user, TransaksiKeuangan $transaksi): bool
    {
        return false;
    }

    /**
     * Menentukan apakah transaksi kas boleh dihapus.
     * Transaksi kas tidak boleh dihapus fisik (harus melalui mekanisme void).
     */
    public function delete(User $user, TransaksiKeuangan $transaksi): bool
    {
        return false;
    }

    /**
     * Menentukan apakah user dapat melakukan void terhadap transaksi kas.
     * Hanya Super Admin yang diizinkan (lewat before).
     */
    public function void(User $user, TransaksiKeuangan $transaksi): bool
    {
        return false;
    }
}
