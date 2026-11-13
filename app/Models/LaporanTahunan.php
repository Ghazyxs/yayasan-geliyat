<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Model Laporan Kegiatan Tahunan Yayasan Geliyat.
 *
 * @property int $id
 * @property int $tahun
 * @property string $judul
 * @property string|null $nomor_dokumen
 * @property \Illuminate\Support\Carbon|null $tanggal_penerbitan
 * @property string|null $latar_belakang
 * @property string|null $tujuan_laporan
 * @property string|null $kesimpulan
 * @property string|null $harapan_evaluasi
 * @property string $penandatangan_ketua
 * @property string $penandatangan_sekretaris
 * @property bool $is_published
 * @property int|null $created_by
 */
#[Table('laporan_tahunan')]
#[Fillable([
    'tahun',
    'judul',
    'nomor_dokumen',
    'tanggal_penerbitan',
    'latar_belakang',
    'tujuan_laporan',
    'kesimpulan',
    'harapan_evaluasi',
    'penandatangan_ketua',
    'penandatangan_sekretaris',
    'is_published',
    'created_by',
])]
class LaporanTahunan extends Model
{
    protected function casts(): array
    {
        return [
            'tahun' => 'integer',
            'tanggal_penerbitan' => 'date',
            'is_published' => 'boolean',
        ];
    }

    /** @return BelongsTo<User, $this> */
    public function pembuat(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Dapatkan data laporan untuk tahun tertentu, atau buat model default jika belum tersimpan.
     */
    public static function getOrDefault(int $tahun): self
    {
        $existing = self::query()->where('tahun', $tahun)->first();

        if ($existing) {
            return $existing;
        }

        $laporan = new self();
        $laporan->tahun = $tahun;
        $laporan->judul = "Laporan Kegiatan Tahunan Yayasan Geliyat Mahdiesa Nahate Tahun {$tahun}";
        $laporan->nomor_dokumen = sprintf('01/LKT/YGM/XII/%04d', $tahun);
        $laporan->tanggal_penerbitan = Carbon::create($tahun, 12, 31);
        $laporan->latar_belakang = "Yayasan Geliyat Mahdiesa Nahate berkedudukan di Kecamatan Ujungberung, Kota Bandung, senantiasa berkomitmen menjalankan amanah kepedulian sosial, pendidikan, pembinaan keagamaan, dan pemberdayaan ekonomi bagi anak yatim serta ibu yatim. Sepanjang tahun {$tahun}, yayasan mengoptimalkan pelaksanaan program kerja pada empat bidang utama untuk memberikan manfaat nyata yang berkelanjutan.";
        $laporan->tujuan_laporan = "1. Memberikan pertanggungjawaban formal atas amanah donatur, mitra, dan masyarakat sepanjang tahun {$tahun}.\n2. Mendokumentasikan rekam jejak pelaksanaan seluruh program kerja yayasan.\n3. Menjadi acuan evaluasi untuk meningkatkan kualitas pembinaan anak yatim dan pemberdayaan keluarga penerima manfaat pada periode mendatang.";
        $laporan->kesimpulan = "Pelaksanaan seluruh program kerja Yayasan Geliyat Mahdiesa Nahate pada tahun {$tahun} telah dilaksanakan sesuai data kegiatan yang tercatat, dengan dukungan para donatur, pengurus, dan masyarakat.";
        $laporan->harapan_evaluasi = "Pada tahun berikutnya, yayasan berkomitmen untuk terus menjaga amanah, profesionalitas, dan keberlanjutan pembinaan guna memperluas manfaat program bagi anak yatim dan ibu yatim.";
        $laporan->penandatangan_ketua = 'Nina Mahdiah, S.Ag., M.Sos.';
        $laporan->penandatangan_sekretaris = 'Juaningsih';
        $laporan->is_published = true;

        return $laporan;
    }
}

