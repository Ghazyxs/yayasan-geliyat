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
 * Data anak binaan (bersifat privasi / UU PDP, tidak ditampilkan ke halaman publik).
 * - `nik`, `no_kk` dienkripsi di database (cast `encrypted`).
 * - `nik`, `no_kk`, `alamat_detail`, serta path file dokumen disembunyikan dari serialisasi JSON/Inertia.
 *   Tampilkan hanya lewat endpoint terotorisasi.
 *
 * @property int $id
 * @property string|null $nik
 * @property string|null $no_kk
 * @property string $nama_lengkap
 * @property int|null $anak_ke
 * @property string $jenis_kelamin
 * @property string $status_santunan
 * @property string|null $tempat_lahir
 * @property \Carbon\CarbonInterface $tanggal_lahir
 * @property string $jenjang
 * @property string $kelurahan
 * @property string|null $alamat_detail
 * @property string|null $nama_ibu_kandung
 * @property string|null $no_telepon
 * @property string $nama_wali
 * @property string|null $no_telepon_wali
 * @property string|null $foto
 * @property string|null $foto_kk
 * @property string|null $foto_akta_kelahiran
 * @property string|null $foto_akta_kematian_ayah
 * @property string $status_binaan
 * @property int $created_by
 */
#[Table('anak_yatim')]
#[Fillable([
    'nik',
    'no_kk',
    'nama_lengkap',
    'anak_ke',
    'jenis_kelamin',
    'status_santunan',
    'tempat_lahir',
    'tanggal_lahir',
    'jenjang',
    'kelurahan',
    'alamat_detail',
    'nama_ibu_kandung',
    'no_telepon',
    'nama_wali',
    'no_telepon_wali',
    'foto',
    'foto_kk',
    'foto_akta_kelahiran',
    'foto_akta_kematian_ayah',
    'status_binaan',
    'created_by',
])]
#[Hidden([
    'nik',
    'no_kk',
    'alamat_detail',
    'foto',
    'foto_kk',
    'foto_akta_kelahiran',
    'foto_akta_kematian_ayah',
])]
class AnakYatim extends Model
{
    public const STATUS_SANTUNAN_MENERIMA = 'menerima';

    public const STATUS_SANTUNAN_MENUNGGU = 'menunggu';

    public const STATUS_SANTUNAN_LIST = [
        self::STATUS_SANTUNAN_MENERIMA,
        self::STATUS_SANTUNAN_MENUNGGU,
    ];

    public const JENJANG_LIST = [
        'SD',
        'SMP',
        'SMA/SMK',
        'Perguruan Tinggi',
        'Lainnya',
    ];

    /**
     * Atribut yang disembunyikan dari serialisasi JSON/Array (UU PDP).
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'nik',
        'no_kk',
        'alamat_detail',
        'foto',
        'foto_kk',
        'foto_akta_kelahiran',
        'foto_akta_kematian_ayah',
    ];

    protected function casts(): array
    {
        return [
            'nik' => 'encrypted',
            'no_kk' => 'encrypted',
            'tanggal_lahir' => 'date',
            'anak_ke' => 'integer',
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
