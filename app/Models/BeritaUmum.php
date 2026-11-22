<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $judul
 * @property string $slug
 * @property string|null $kategori
 * @property string|null $ringkasan
 * @property string $isi
 * @property string|null $gambar
 * @property Carbon|null $tanggal_publikasi
 * @property bool $is_published
 * @property int|null $created_by
 */
#[Table('berita_umum')]
#[Fillable([
    'judul',
    'slug',
    'kategori',
    'ringkasan',
    'isi',
    'gambar',
    'tanggal_publikasi',
    'is_published',
    'created_by',
])]
class BeritaUmum extends Model
{
    /** @use HasFactory<Factory<self>> */
    use HasFactory;

    protected function casts(): array
    {
        return [
            'tanggal_publikasi' => 'date',
            'is_published' => 'boolean',
        ];
    }

    /** @return BelongsTo<User, $this> */
    public function pembuat(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
