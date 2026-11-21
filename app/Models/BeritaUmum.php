<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

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
    use HasFactory;

    protected function casts(): array
    {
        return [
            'tanggal_publikasi' => 'date',
            'is_published' => 'boolean',
        ];
    }

    public function pembuat(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}

