<?php

namespace App\Models;

use DomainException;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

/**
 * @property int $id
 * @property string $kode_donasi
 * @property string $nama_donatur
 * @property string $jenis_donasi
 * @property int|null $anak_yatim_id
 * @property int|null $rekening_id
 * @property string|null $rekening_nama_bank
 * @property string|null $rekening_nomor
 * @property string|null $rekening_atas_nama
 * @property string $rekening_tujuan
 * @property int $nominal
 * @property string $status_verifikasi
 * @property int|null $verified_by
 * @property string|null $no_whatsapp
 * @property string|null $email_donatur
 * @property string|null $metode_pembayaran
 * @property string|null $snap_token
 * @property string|null $snap_redirect_url
 * @property string|null $midtrans_transaction_id
 * @property string|null $midtrans_transaction_status
 * @property string|null $midtrans_payment_type
 * @property string|null $midtrans_fraud_status
 * @property array<string, mixed>|null $midtrans_payload
 * @property \Illuminate\Support\Carbon|null $paid_at
 * @property \Illuminate\Support\Carbon|null $payment_expires_at
 */
#[Table('donasi')]
#[Fillable([
    'kode_donasi',
    'nama_donatur',
    'no_whatsapp',
    'jenis_donasi',
    'anak_yatim_id',
    'rekening_id',
    'rekening_nama_bank',
    'rekening_nomor',
    'rekening_atas_nama',
    'rekening_tujuan',
    'nominal',
    'pesan_doa',
    'bukti_transfer',
    'status_verifikasi',
    'verified_at',
    'verified_by',
    'catatan_verifikasi',
    'metode_pembayaran',
    'email_donatur',
    'snap_token',
    'snap_redirect_url',
    'midtrans_transaction_id',
    'midtrans_transaction_status',
    'midtrans_payment_type',
    'midtrans_fraud_status',
    'midtrans_payload',
    'midtrans_notified_at',
    'paid_at',
    'payment_expires_at',
])]
class Donasi extends Model
{
    public const METODE_MIDTRANS = 'midtrans';
    public const STATUS_MENUNGGU = 'menunggu';

    public const STATUS_TERVERIFIKASI = 'terverifikasi';

    public const STATUS_DITOLAK = 'ditolak';

    public const STATUS_DIBATALKAN = 'dibatalkan';

    public const STATUS_LIST = [
        self::STATUS_MENUNGGU,
        self::STATUS_TERVERIFIKASI,
        self::STATUS_DITOLAK,
        self::STATUS_DIBATALKAN,
    ];

    public const JENIS_DONASI_UMUM = 'Donasi Umum';

    public const JENIS_SANTUNAN_RUTIN = 'Santunan Rutin';

    public const JENIS_ORANG_TUA_ASUH = 'Orang Tua Asuh';

    public const JENIS_BIMBEL_SINAR = 'Bimbel Sinar';

    public const JENIS_ZAKAT = 'Zakat';

    public const JENIS_DONASI_LIST = [
        self::JENIS_DONASI_UMUM,
        self::JENIS_SANTUNAN_RUTIN,
        self::JENIS_ORANG_TUA_ASUH,
        self::JENIS_BIMBEL_SINAR,
        self::JENIS_ZAKAT,
    ];

    /**
     * Pilihan nominal donasi yang tersedia pada formulir publik.
     *
     * @var list<int>
     */
    public const NOMINAL_PILIHAN_PUBLIK = [
        5000,
        10000,
        15000,
        20000,
        25000,
        50000,
        100000,
    ];

    public const REKENING_DEFAULT_PUBLIK = 'Pembayaran Digital';

    /**
     * Daftar rekening resmi Yayasan Geliyat Mahdiesa Nahate.
     *
     * @var array<int, array{kode: string, bank: string, nomor: string, atas_nama: string, icon: string}>
     */
    public const REKENING_RESMI = [
        [
            'kode' => 'BSI - 7256194821',
            'bank' => 'Bank Syariah Indonesia (BSI)',
            'nomor' => '7256194821',
            'atas_nama' => 'Yayasan Geliyat Mahdiesa Nahate',
            'icon' => 'BSI',
        ],
        [
            'kode' => 'BRI - 0123-01-098765-53-1',
            'bank' => 'Bank Rakyat Indonesia (BRI)',
            'nomor' => '0123-01-098765-53-1',
            'atas_nama' => 'Yayasan Geliyat Mahdiesa Nahate',
            'icon' => 'BRI',
        ],
    ];

    /**
     * Buat kode donasi unik berformat DON-YYYYMMDD-XXXXXX.
     */
    public static function generateKodeDonasi(): string
    {
        do {
            $kode = sprintf('DON-%s-%s', now()->format('Ymd'), strtoupper(Str::random(6)));
        } while (self::query()->where('kode_donasi', $kode)->exists());

        return $kode;
    }

    /**
     * Dapatkan daftar rekening resmi aktif untuk donasi.
     * Jika database master rekening sudah memiliki data, gunakan data aktif dari database.
     * Jika database master rekening masih kosong sama sekali (fase transisi awal),
     * gunakan fallback konfigurasi REKENING_RESMI agar tidak merusak sistem & pengujian lama.
     *
     * @return array<int, array{id: int|null, kode: string, bank: string, nomor: string, atas_nama: string, icon: string}>
     */
    public static function daftarRekeningAktif(): array
    {
        if (RekeningYayasan::query()->exists()) {
            return RekeningYayasan::aktif()
                ->orderBy('nama_bank')
                ->get()
                ->map(fn (RekeningYayasan $r) => [
                    'id' => $r->id,
                    'kode' => "{$r->nama_bank} - {$r->nomor_rekening}",
                    'bank' => $r->nama_bank,
                    'nomor' => $r->nomor_rekening,
                    'atas_nama' => $r->atas_nama,
                    'icon' => $r->icon ?? 'BANK',
                ])
                ->values()
                ->all();
        }

        return self::REKENING_RESMI;
    }

    /**
     * Terapkan snapshot rekening yayasan ke atribut donasi secara permanen.
     *
     * @param  array<string, mixed>  $attributes
     */
    public static function terapkanSnapshotRekening(array &$attributes, ?RekeningYayasan $rekening = null): void
    {
        if ($rekening !== null) {
            $attributes['rekening_id'] = $rekening->id;
            $attributes['rekening_nama_bank'] = $rekening->nama_bank;
            $attributes['rekening_nomor'] = $rekening->nomor_rekening;
            $attributes['rekening_atas_nama'] = $rekening->atas_nama;
            $attributes['rekening_tujuan'] = "{$rekening->nama_bank} - {$rekening->nomor_rekening}";
        }
    }

    protected function casts(): array
    {
        return [
            'nominal' => 'integer',
            'rekening_id' => 'integer',
            'verified_at' => 'datetime',
            'midtrans_payload' => 'array',
            'midtrans_notified_at' => 'datetime',
            'paid_at' => 'datetime',
            'payment_expires_at' => 'datetime',
        ];
    }

    public function isMidtrans(): bool
    {
        return $this->metode_pembayaran === self::METODE_MIDTRANS;
    }

    /** @return BelongsTo<RekeningYayasan, $this> */
    public function rekening(): BelongsTo
    {
        return $this->belongsTo(RekeningYayasan::class, 'rekening_id');
    }

    /** @return BelongsTo<AnakYatim, $this> */
    public function anakYatim(): BelongsTo
    {
        return $this->belongsTo(AnakYatim::class, 'anak_yatim_id');
    }

    /** @return BelongsTo<User, $this> */
    public function verifikator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    /** @return HasOne<TransaksiKeuangan, $this> */
    public function transaksi(): HasOne
    {
        return $this->hasOne(TransaksiKeuangan::class, 'donasi_id');
    }

    /**
     * Batasi query donasi berdasarkan hak akses:
     * - Super Admin: seluruh donasi.
     * - Admin Kemanusiaan: seluruh donasi.
     * - Admin bidang lain: donasi umum (anak_yatim_id NULL) ATAU donasi anak yang terhubung ke bidangnya.
     * - Admin tanpa bidang_id / peran lain: kosong (fail-safe).
     *
     * @param  Builder<Donasi>  $query
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

        if ($user->bidang?->kode === Bidang::KEMANUSIAAN) {
            return;
        }

        $query->where(function (Builder $q) use ($user) {
            $q->whereNull('anak_yatim_id')
                ->orWhereHas('anakYatim.bidang', fn (Builder $sub) => $sub->whereKey($user->bidang_id));
        });
    }

    /**
     * Total nominal donasi yang telah terverifikasi.
     * Donasi menunggu, ditolak, dan dibatalkan TIDAK dihitung.
     */
    public static function totalTerverifikasi(?User $user = null): int
    {
        $query = self::query()->where('status_verifikasi', self::STATUS_TERVERIFIKASI);

        if ($user !== null) {
            $query->visibleTo($user);
        }

        return (int) $query->sum('nominal');
    }

    /**
     * Verifikasi donasi dan catat tepat satu transaksi pemasukan.
     *
     * Anti transaksi ganda:
     * 1. Baris donasi dikunci (lockForUpdate) di dalam DB transaction.
     * 2. Hanya status `menunggu` yang boleh diverifikasi (idempoten).
     * 3. UNIQUE `transaksi_keuangan.donasi_id` sebagai pengaman terakhir.
     *
     * @throws DomainException
     */
    public static function verifikasi(int $donasiId, User $verifikator, ?string $catatan = null): self
    {
        return DB::transaction(function () use ($donasiId, $verifikator, $catatan) {
            /** @var self $donasi */
            $donasi = self::query()->whereKey($donasiId)->lockForUpdate()->firstOrFail();

            if ($donasi->status_verifikasi !== self::STATUS_MENUNGGU) {
                throw new DomainException('Hanya donasi berstatus menunggu yang dapat diverifikasi.');
            }

            $updateData = [
                'status_verifikasi' => self::STATUS_TERVERIFIKASI,
                'verified_at' => now(),
                'verified_by' => $verifikator->id,
            ];

            if ($catatan !== null && trim($catatan) !== '') {
                $updateData['catatan_verifikasi'] = trim($catatan);
            }

            $donasi->update($updateData);

            TransaksiKeuangan::create([
                'kode_transaksi' => sprintf('TRX-%s-D%06d', now()->format('Ymd'), $donasi->id),
                'tipe' => TransaksiKeuangan::TIPE_PEMASUKAN,
                'sumber_dana' => TransaksiKeuangan::SUMBER_DONASI,
                'kategori' => 'Donasi Terverifikasi',
                'nominal' => $donasi->nominal,
                'tanggal_transaksi' => now()->toDateString(),
                'donasi_id' => $donasi->id,
                'status_transaksi' => TransaksiKeuangan::STATUS_VALID,
                'keterangan' => "Penerimaan {$donasi->jenis_donasi} dari {$donasi->nama_donatur} ({$donasi->kode_donasi})",
                'created_by' => $verifikator->id,
            ]);

            $donasi->sinkronkanStatusAsuh();

            return $donasi->refresh();
        });
    }

    /**
     * Tolak donasi yang masih menunggu (tidak menyentuh buku kas).
     *
     * @throws DomainException
     */
    public static function tolak(int $donasiId, User $verifikator, string $alasan): self
    {
        return DB::transaction(function () use ($donasiId, $verifikator, $alasan) {
            /** @var self $donasi */
            $donasi = self::query()->whereKey($donasiId)->lockForUpdate()->firstOrFail();

            if ($donasi->status_verifikasi !== self::STATUS_MENUNGGU) {
                throw new DomainException('Hanya donasi berstatus menunggu yang dapat ditolak.');
            }

            $donasi->update([
                'status_verifikasi' => self::STATUS_DITOLAK,
                'verified_at' => now(),
                'verified_by' => $verifikator->id,
                'catatan_verifikasi' => $alasan,
            ]);

            return $donasi->refresh();
        });
    }

    /**
     * Batalkan donasi yang sudah terverifikasi.
     * Transaksi pemasukan TIDAK dihapus, melainkan di-void sehingga
     * saldo & grafik (yang hanya menghitung status `valid`) tetap benar
     * dan jejak audit tetap utuh.
     *
     * @throws DomainException
     */
    public static function batalkan(int $donasiId, User $pengguna, string $alasan): self
    {
        return DB::transaction(function () use ($donasiId, $pengguna, $alasan) {
            /** @var self $donasi */
            $donasi = self::query()->whereKey($donasiId)->lockForUpdate()->firstOrFail();

            if ($donasi->status_verifikasi !== self::STATUS_TERVERIFIKASI) {
                throw new DomainException('Hanya donasi terverifikasi yang dapat dibatalkan.');
            }

            $donasi->update([
                'status_verifikasi' => self::STATUS_DIBATALKAN,
                'catatan_verifikasi' => "Dibatalkan oleh {$pengguna->name}: {$alasan}",
            ]);

            $transaksi = TransaksiKeuangan::query()
                ->where('donasi_id', $donasi->id)
                ->lockForUpdate()
                ->first();

            if ($transaksi !== null && $transaksi->status_transaksi === TransaksiKeuangan::STATUS_VALID) {
                $transaksi->update([
                    'status_transaksi' => TransaksiKeuangan::STATUS_VOID,
                    'keterangan' => $transaksi->keterangan." [VOID: {$alasan}]",
                ]);
            }

            $donasi->sinkronkanStatusAsuh();

            return $donasi->refresh();
        });
    }

    /**
     * Proses notifikasi status transaksi dari Midtrans (Webhook).
     * Idempoten: pemanggilan berulang tidak akan menggandakan pencatatan kas.
     *
     * @param  array<string, mixed>  $payload
     *
     * @throws DomainException
     */
    public static function prosesNotifikasiMidtrans(array $payload): self
    {
        $orderId = (string) ($payload['order_id'] ?? '');
        $transactionStatus = (string) ($payload['transaction_status'] ?? '');
        $fraudStatus = (string) ($payload['fraud_status'] ?? '');
        $paymentType = (string) ($payload['payment_type'] ?? '');
        $transactionId = (string) ($payload['transaction_id'] ?? '');

        return DB::transaction(function () use ($orderId, $transactionStatus, $fraudStatus, $paymentType, $transactionId, $payload) {
            /** @var self $donasi */
            $donasi = self::query()->where('kode_donasi', $orderId)->lockForUpdate()->firstOrFail();

            $commonUpdates = [
                'metode_pembayaran' => self::METODE_MIDTRANS,
                'midtrans_transaction_id' => $transactionId ?: $donasi->midtrans_transaction_id,
                'midtrans_transaction_status' => $transactionStatus,
                'midtrans_payment_type' => $paymentType ?: $donasi->midtrans_payment_type,
                'midtrans_fraud_status' => $fraudStatus ?: $donasi->midtrans_fraud_status,
                'midtrans_payload' => $payload,
                'midtrans_notified_at' => now(),
            ];

            // 1. Sukses / Lunas: settlement ATAU (capture dengan fraud_status accept)
            if ($transactionStatus === 'settlement' || ($transactionStatus === 'capture' && $fraudStatus === 'accept')) {
                // Idempoten: Jika sudah terverifikasi, perbarui metadata notifikasi tanpa duplikasi transaksi buku kas
                if ($donasi->status_verifikasi !== self::STATUS_TERVERIFIKASI) {
                    $commonUpdates['status_verifikasi'] = self::STATUS_TERVERIFIKASI;
                    $commonUpdates['verified_at'] = now();
                    $commonUpdates['paid_at'] = now();
                    $commonUpdates['catatan_verifikasi'] = "Pembayaran Midtrans berhasil ({$paymentType})";
                }

                $donasi->update($commonUpdates);

                // Catat transaksi keuangan otomatis hanya jika belum pernah dicatat
                $sudahDicatat = TransaksiKeuangan::query()
                    ->where('donasi_id', $donasi->id)
                    ->exists();

                if (! $sudahDicatat) {
                    $paymentLabel = $paymentType ? strtoupper(str_replace('_', ' ', $paymentType)) : 'MIDTRANS';
                    TransaksiKeuangan::create([
                        'kode_transaksi' => sprintf('TRX-%s-D%06d', now()->format('Ymd'), $donasi->id),
                        'tipe' => TransaksiKeuangan::TIPE_PEMASUKAN,
                        'sumber_dana' => TransaksiKeuangan::SUMBER_DONASI,
                        'kategori' => 'Donasi Terverifikasi',
                        'nominal' => $donasi->nominal,
                        'tanggal_transaksi' => now()->toDateString(),
                        'donasi_id' => $donasi->id,
                        'status_transaksi' => TransaksiKeuangan::STATUS_VALID,
                        'keterangan' => "Penerimaan {$donasi->jenis_donasi} dari {$donasi->nama_donatur} ({$donasi->kode_donasi}) [{$paymentLabel}]",
                        'created_by' => null, // Dicatat otomatis oleh sistem
                    ]);
                }

                $donasi->sinkronkanStatusAsuh();

                return $donasi->refresh();
            }

            // 2. Pending: Menunggu pembayaran oleh donatur
            if ($transactionStatus === 'pending') {
                if ($donasi->status_verifikasi === self::STATUS_MENUNGGU) {
                    $commonUpdates['catatan_verifikasi'] = "Menunggu pembayaran ({$paymentType})";
                    $donasi->update($commonUpdates);
                } else {
                    $donasi->update([
                        'midtrans_transaction_id' => $commonUpdates['midtrans_transaction_id'],
                        'midtrans_transaction_status' => $transactionStatus,
                        'midtrans_payload' => $payload,
                        'midtrans_notified_at' => now(),
                    ]);
                }

                return $donasi->refresh();
            }

            // 3. Expire / Cancel: Kedaluwarsa atau Dibatalkan
            if ($transactionStatus === 'expire' || $transactionStatus === 'cancel') {
                if ($donasi->status_verifikasi !== self::STATUS_TERVERIFIKASI) {
                    $commonUpdates['status_verifikasi'] = self::STATUS_DIBATALKAN;
                    $commonUpdates['catatan_verifikasi'] = $transactionStatus === 'expire'
                        ? 'Waktu pembayaran Midtrans kedaluwarsa.'
                        : 'Pembayaran Midtrans dibatalkan.';
                }
                $donasi->update($commonUpdates);
                $donasi->sinkronkanStatusAsuh();

                return $donasi->refresh();
            }

            // 4. Deny: Ditolak oleh payment provider / fraud detection
            if ($transactionStatus === 'deny') {
                if ($donasi->status_verifikasi !== self::STATUS_TERVERIFIKASI) {
                    $commonUpdates['status_verifikasi'] = self::STATUS_DITOLAK;
                    $commonUpdates['catatan_verifikasi'] = 'Pembayaran ditolak oleh Midtrans.';
                }
                $donasi->update($commonUpdates);
                $donasi->sinkronkanStatusAsuh();

                return $donasi->refresh();
            }

            // Fallback status lainnya
            $donasi->update($commonUpdates);

            return $donasi->refresh();
        });
    }

    /**
     * Status asuh anak mengikuti ada/tidaknya donasi Orang Tua Asuh
     * yang terverifikasi untuk anak tersebut.
     */
    protected function sinkronkanStatusAsuh(): void
    {
        if ($this->jenis_donasi !== self::JENIS_ORANG_TUA_ASUH || $this->anak_yatim_id === null) {
            return;
        }

        $masihDiasuh = self::query()
            ->where('anak_yatim_id', $this->anak_yatim_id)
            ->where('jenis_donasi', self::JENIS_ORANG_TUA_ASUH)
            ->where('status_verifikasi', self::STATUS_TERVERIFIKASI)
            ->exists();

        AnakYatim::query()
            ->whereKey($this->anak_yatim_id)
            ->update([
                'status_asuh' => $masihDiasuh
                    ? AnakYatim::STATUS_ASUH_AKTIF
                    : AnakYatim::STATUS_ASUH_BELUM,
            ]);
    }
}
