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
 * @property string|null $sumber_dana
 * @property string $kategori
 * @property int $nominal
 * @property \Illuminate\Support\Carbon $tanggal_transaksi
 * @property int|null $donasi_id
 * @property string $status_transaksi
 * @property string $keterangan
 * @property string|null $bukti_nota
 * @property int $created_by
 */
#[Table('transaksi_keuangan')]
#[Fillable([
    'kode_transaksi',
    'tipe',
    'sumber_dana',
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

    public const SUMBER_DONASI = 'donasi';

    public const SUMBER_OPERASIONAL = 'operasional';

    public const SUMBER_DANA_LIST = [
        self::SUMBER_DONASI,
        self::SUMBER_OPERASIONAL,
    ];

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

    /** @param  Builder<TransaksiKeuangan>  $query */
    #[Scope]
    protected function sumberDonasi(Builder $query): void
    {
        $query->where(function (Builder $q) {
            $q->where('sumber_dana', self::SUMBER_DONASI)
                ->orWhereNotNull('donasi_id');
        });
    }

    /** @param  Builder<TransaksiKeuangan>  $query */
    #[Scope]
    protected function sumberOperasional(Builder $query): void
    {
        $query->where('sumber_dana', self::SUMBER_OPERASIONAL);
    }

    /** @param  Builder<TransaksiKeuangan>  $query */
    #[Scope]
    protected function belumTerklasifikasi(Builder $query): void
    {
        $query->whereNull('donasi_id')
            ->whereNull('sumber_dana');
    }

    /** Total donasi terverifikasi yang masuk ke buku kas. */
    public static function totalDonasiMasuk(): int
    {
        return (int) self::query()
            ->valid()
            ->pemasukan()
            ->where(function (Builder $q) {
                $q->where('sumber_dana', self::SUMBER_DONASI)
                    ->orWhereNotNull('donasi_id');
            })
            ->sum('nominal');
    }

    /** Total pengeluaran yang secara eksplisit menggunakan dana donasi. */
    public static function totalPengeluaranDonasi(): int
    {
        return (int) self::query()
            ->valid()
            ->pengeluaran()
            ->where('sumber_dana', self::SUMBER_DONASI)
            ->sum('nominal');
    }

    /** Saldo dana donasi amanah: donasi masuk valid - pengeluaran donasi valid. */
    public static function saldoDonasi(): int
    {
        return self::totalDonasiMasuk() - self::totalPengeluaranDonasi();
    }

    /** Total pemasukan kas operasional (non-donasi). */
    public static function totalPemasukanOperasional(): int
    {
        return (int) self::query()
            ->valid()
            ->pemasukan()
            ->where('sumber_dana', self::SUMBER_OPERASIONAL)
            ->whereNull('donasi_id')
            ->sum('nominal');
    }

    /** Total pengeluaran operasional internal yayasan. */
    public static function totalPengeluaranOperasional(): int
    {
        return (int) self::query()
            ->valid()
            ->pengeluaran()
            ->where('sumber_dana', self::SUMBER_OPERASIONAL)
            ->sum('nominal');
    }

    /** Saldo kas operasional: pemasukan operasional - pengeluaran operasional. */
    public static function saldoOperasional(): int
    {
        return self::totalPemasukanOperasional() - self::totalPengeluaranOperasional();
    }

    /** Saldo kas konsolidasi (terklasifikasi): saldo donasi + saldo operasional. */
    public static function saldoKonsolidasi(): int
    {
        return self::saldoDonasi() + self::saldoOperasional();
    }

    /** Nominal transaksi valid non-donasi yang belum terklasifikasi sumber dananya (sumber_dana = NULL). */
    public static function totalBelumTerklasifikasi(): int
    {
        return (int) self::query()
            ->valid()
            ->whereNull('donasi_id')
            ->whereNull('sumber_dana')
            ->sum('nominal');
    }

    /**
     * Ringkasan terstruktur keuangan yayasan untuk dashboard Super Admin.
     *
     * @return array<string, array<string, int>>
     */
    public static function ringkasanKeuangan(): array
    {
        return [
            'donasi' => [
                'masuk' => self::totalDonasiMasuk(),
                'keluar' => self::totalPengeluaranDonasi(),
                'saldo' => self::saldoDonasi(),
            ],
            'operasional' => [
                'masuk' => self::totalPemasukanOperasional(),
                'keluar' => self::totalPengeluaranOperasional(),
                'saldo' => self::saldoOperasional(),
            ],
            'konsolidasi' => [
                'total_pemasukan' => self::totalDonasiMasuk() + self::totalPemasukanOperasional(),
                'total_pengeluaran' => self::totalPengeluaranDonasi() + self::totalPengeluaranOperasional(),
                'saldo_bersih' => self::saldoKonsolidasi(),
                'belum_terklasifikasi' => self::totalBelumTerklasifikasi(),
            ],
        ];
    }

    /** Saldo kas bersih: pemasukan valid - pengeluaran valid. */
    public static function saldo(): int
    {
        $pemasukan = (int) self::query()->valid()->pemasukan()->sum('nominal');
        $pengeluaran = (int) self::query()->valid()->pengeluaran()->sum('nominal');

        return $pemasukan - $pengeluaran;
    }
}
