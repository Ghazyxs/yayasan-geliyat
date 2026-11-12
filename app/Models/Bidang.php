<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Master bidang (unit kerja) yayasan.
 *
 * @property int $id
 * @property string $kode
 * @property string $nama
 * @property string|null $subjudul
 * @property string|null $deskripsi
 * @property string|null $deskripsi_lengkap
 * @property string|null $gambar
 * @property array<int, string>|null $tujuan
 * @property array<int, array<string, string>|string>|null $program_kerja
 * @property array<string, string>|null $informasi_tambahan
 */
#[Table('bidang')]
#[Fillable([
    'kode',
    'nama',
    'subjudul',
    'deskripsi',
    'deskripsi_lengkap',
    'gambar',
    'tujuan',
    'program_kerja',
    'informasi_tambahan',
])]
class Bidang extends Model
{
    public const KEMANUSIAAN = 'kemanusiaan';

    public const PENDIDIKAN = 'pendidikan';

    public const KEAGAMAAN = 'keagamaan';

    public const EKONOMI = 'ekonomi';

    protected function casts(): array
    {
        return [
            'tujuan' => 'array',
            'program_kerja' => 'array',
            'informasi_tambahan' => 'array',
        ];
    }

    /** @return HasMany<User, $this> */
    public function users(): HasMany
    {
        return $this->hasMany(User::class, 'bidang_id');
    }

    /** @return BelongsToMany<AnakYatim, $this> */
    public function anakYatim(): BelongsToMany
    {
        return $this->belongsToMany(AnakYatim::class, 'anak_yatim_bidang')
            ->withPivot('catatan_program')
            ->withTimestamps();
    }

    /** @return HasMany<Kegiatan, $this> */
    public function kegiatan(): HasMany
    {
        return $this->hasMany(Kegiatan::class, 'bidang_id');
    }
}
