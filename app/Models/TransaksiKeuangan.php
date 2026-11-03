<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Buku kas yayasan. Transaksi tidak pernah dihapus; pembatalan
 * dilakukan dengan status `void`. Seluruh agregasi saldo & grafik
 * WAJIB memakai scope `valid()`.
 *
 * @property int $id
 * @property string $kode_transaksi
 * @property string $tipe
 * @property int $nominal
 * @property int|null $donasi_id
 * @property string $status_transaksi
 * @property string $keterangan
 */
#[Table('transaksi_keuangan')]
#[Fillable([
    'kode_transaksi',
    'tipe',
    'kategori',
    'nominal',
    'tanggal_transaksi',
    'donasi_id',
    'status_transaksi',
    'keterangan',
    'bukti_nota',
    'created_by',
])]
class TransaksiKeuangan extends Model
{
    public const TIPE_PEMASUKAN = 'pemasukan';

    public const TIPE_PENGELUARAN = 'pengeluaran';

    public const STATUS_VALID = 'valid';

    public const STATUS_VOID = 'void';

    protected function casts(): array
    {
        return [
            'nominal' => 'integer',
            'tanggal_transaksi' => 'date',
        ];
    }

    /** @return BelongsTo<Donasi, $this> */
    public function donasi(): BelongsTo
    {
        return $this->belongsTo(Donasi::class, 'donasi_id');
    }

    /** @return BelongsTo<User, $this> */
    public function pencatat(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /** @param  Builder<TransaksiKeuangan>  $query */
    #[Scope]
    protected function valid(Builder $query): void
    {
        $query->where('status_transaksi', self::STATUS_VALID);
    }

    /** @param  Builder<TransaksiKeuangan>  $query */
    #[Scope]
    protected function pemasukan(Builder $query): void
    {
        $query->where('tipe', self::TIPE_PEMASUKAN);
    }

    /** @param  Builder<TransaksiKeuangan>  $query */
    #[Scope]
    protected function pengeluaran(Builder $query): void
    {
        $query->where('tipe', self::TIPE_PENGELUARAN);
    }

    /** Saldo kas bersih: pemasukan valid - pengeluaran valid. */
    public static function saldo(): int
    {
        $pemasukan = (int) self::query()->valid()->pemasukan()->sum('nominal');
        $pengeluaran = (int) self::query()->valid()->pengeluaran()->sum('nominal');

        return $pemasukan - $pengeluaran;
    }
}
