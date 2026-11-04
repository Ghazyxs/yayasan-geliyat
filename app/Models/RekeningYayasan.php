<?php

namespace App\Models;

use DomainException;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property string $nama_bank
 * @property string $nomor_rekening
 * @property string $atas_nama
 * @property string|null $icon
 * @property bool $is_active
 * @property string|null $catatan
 * @property int|null $created_by
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User|null $pembuat
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Donasi> $donasi
 */
#[Table('rekening_yayasan')]
#[Fillable([
    'nama_bank',
    'nomor_rekening',
    'atas_nama',
    'icon',
    'is_active',
    'catatan',
    'created_by',
])]
class RekeningYayasan extends Model
{
    protected static function booted(): void
    {
        static::deleting(function (RekeningYayasan $rekening) {
            if ($rekening->donasi()->exists()) {
                throw new DomainException(
                    'Rekening yang sudah pernah digunakan untuk transaksi donasi tidak dapat dihapus. Silakan nonaktifkan status rekening.'
                );
            }
        });
    }

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    /**
     * Scope untuk rekening yang berstatus aktif.
     *
     * @param  Builder<$this>  $query
     */
    public function scopeAktif(Builder $query): void
    {
        $query->where('is_active', true);
    }

    /**
     * Apakah rekening ini aman untuk dihapus fisik (belum ada donasi terkait).
     */
    public function bisaDihapus(): bool
    {
        return $this->donasi()->doesntExist();
    }

    /**
     * Relasi ke Super Admin yang membuat master rekening ini.
     *
     * @return BelongsTo<User, $this>
     */
    public function pembuat(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Relasi ke seluruh transaksi donasi yang ditujukan ke rekening ini.
     *
     * @return HasMany<Donasi, $this>
     */
    public function donasi(): HasMany
    {
        return $this->hasMany(Donasi::class, 'rekening_id');
    }
}

