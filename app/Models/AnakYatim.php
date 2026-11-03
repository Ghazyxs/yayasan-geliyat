<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Data anak binaan. Mengandung data pribadi (UU PDP):
 * - `nik` dienkripsi di database (cast `encrypted`).
 * - `nik` dan `alamat_detail` disembunyikan dari serialisasi (Inertia/JSON).
 *   Tampilkan hanya lewat `makeVisible()` setelah lolos policy `viewSensitiveData`.
 *
 * @property int $id
 * @property string|null $nik
 * @property string $nama_lengkap
 * @property string $alias
 * @property string $jenjang
 * @property string $kelurahan
 * @property string $status_binaan
 * @property string $status_asuh
 * @property int $created_by
 */
#[Table('anak_yatim')]
#[Fillable([
    'nik',
    'nama_lengkap',
    'alias',
    'jenis_kelamin',
    'tanggal_lahir',
    'jenjang',
    'kelas',
    'nama_sekolah',
    'kelurahan',
    'alamat_detail',
    'nama_wali',
    'no_telepon_wali',
    'hobi',
    'cita_cita',
    'status_binaan',
    'status_asuh',
    'created_by',
])]
#[Hidden(['nik', 'alamat_detail'])]
class AnakYatim extends Model
{
    public const STATUS_ASUH_BELUM = 'belum_diasuh';

    public const STATUS_ASUH_AKTIF = 'aktif_diasuh';

    /**
     * Atribut yang disembunyikan dari serialisasi JSON/Array (UU PDP).
     * Didefinisikan ganda (atribut class & properti protected) untuk kompatibilitas penuh.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'nik',
        'alamat_detail',
    ];

    protected function casts(): array
    {
        return [
            'nik' => 'encrypted',
            'tanggal_lahir' => 'date',
        ];
    }

    /** @return BelongsToMany<Bidang, $this> */
    public function bidang(): BelongsToMany
    {
        return $this->belongsToMany(Bidang::class, 'anak_yatim_bidang')
            ->withPivot('catatan_program')
            ->withTimestamps();
    }

    /** @return BelongsTo<User, $this> */
    public function pembuat(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /** @return HasMany<Donasi, $this> */
    public function donasi(): HasMany
    {
        return $this->hasMany(Donasi::class, 'anak_yatim_id');
    }

    /**
     * Batasi query ke data anak yang boleh diakses user.
     * - Super Admin: seluruh data.
     * - Admin: hanya anak yang terhubung ke bidangnya.
     * - Admin tanpa bidang / role lain: tidak ada data (fail-safe).
     *
     * @param  Builder<AnakYatim>  $query
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

        $query->whereHas('bidang', fn (Builder $q) => $q->whereKey($user->bidang_id));
    }

    /** Apakah anak ini terhubung ke bidang tertentu. */
    public function terhubungKeBidang(?int $bidangId): bool
    {
        if ($bidangId === null) {
            return false;
        }

        return $this->bidang()->whereKey($bidangId)->exists();
    }
}
