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
        $laporan->judul = "Laporan Kegiatan Tahunan Yayasan Geliyat Tahun {$tahun}";
        $laporan->nomor_dokumen = sprintf('01/LKT/YGM/XII/%04d', $tahun);
        $laporan->tanggal_penerbitan = Carbon::create($tahun, 12, 31);
        $laporan->latar_belakang = "Yayasan Geliyat Mahdiesa Nahate berkedudukan di Kecamatan Ujungberung, Kota Bandung, senantiasa berkomitmen menjalankan amanah kepedulian sosial bagi anak-anak yatim dan dhuafa. Sepanjang tahun {$tahun}, yayasan mengoptimalkan kolaborasi seluruh bidang kerja (Pendidikan, Kemanusiaan, Keagamaan, dan Ekonomi) untuk memberikan dampak nyata yang berkelanjutan dan terukur.";
        $laporan->tujuan_laporan = "1. Memberikan pertanggungjawaban formal atas amanah donatur, mitra, dan masyarakat sepanjang tahun {$tahun}.\n2. Mendokumentasikan rekam jejak pelaksanaan seluruh program kerja yayasan.\n3. Menjadi acuan evaluasi strategis guna meningkatkan efektivitas pembinaan 420 anak yatim binaan pada periode mendatang.";
        $laporan->kesimpulan = "Pelaksanaan seluruh program kerja Yayasan Geliyat pada tahun {$tahun} telah berjalan dengan baik, transparan, dan tepat sasaran berkat dukungan para donatur, relawan, pengurus, serta aparat kewilayahan setempat.";
        $laporan->harapan_evaluasi = "Pada tahun berikutnya, yayasan menargetkan perluasan jangkauan program beasiswa pendidikan perguruan tinggi, peningkatan fasilitas bimbel, dan penguatan kemandirian ekonomi keluarga binaan melalui unit usaha koperasi yayasan.";
        $laporan->penandatangan_ketua = 'H. Ahmad Fauzi';
        $laporan->penandatangan_sekretaris = 'M. Ridwan, S.Pd.';
        $laporan->is_published = true;

        return $laporan;
    }
}

