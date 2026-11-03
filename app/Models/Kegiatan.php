<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Kegiatan yayasan. `bidang_id` NULL = kegiatan umum/lintas bidang.
 *
 * @property int $id
 * @property string $judul
 * @property int|null $bidang_id
 * @property string $kategori
 */
#[Table('kegiatan')]
#[Fillable([
    'judul',
    'bidang_id',
    'kategori',
    'deskripsi',
    'lokasi',
    'tanggal_kegiatan',
    'gambar',
    'created_by',
])]
class Kegiatan extends Model
{
    protected function casts(): array
    {
        return [
            'tanggal_kegiatan' => 'date',
        ];
    }

    /** @return BelongsTo<Bidang, $this> */
    public function bidang(): BelongsTo
    {
        return $this->belongsTo(Bidang::class, 'bidang_id');
    }

    /** @return BelongsTo<User, $this> */
    public function pembuat(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Batasi query kegiatan berdasarkan hak akses:
     * - Super Admin: seluruh kegiatan.
     * - Admin: kegiatan bidangnya + kegiatan umum yayasan (bidang_id NULL).
     * - Admin tanpa bidang_id / peran lain: kosong (fail-safe).
     *
     * @param  Builder<Kegiatan>  $query
     */
    #[Scope]
    protected function visibleTo(Builder $query, User $user): void
    {
        if ($user->isSuperAdmin()) {
            return;
        }

        if ($user->role !== 'admin' || $user->bidang_id === null) {
            $query->whereRaw('1 = 0');

            return;
        }

        $query->where(function (Builder $q) use ($user) {
            $q->where('bidang_id', $user->bidang_id)
                ->orWhereNull('bidang_id');
        });
    }
}
