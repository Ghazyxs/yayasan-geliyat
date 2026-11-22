<?php

namespace App\Http\Requests\Kegiatan;

use App\Http\Requests\Concerns\HasSafeFileValidation;
use App\Models\Kegiatan;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;

class StoreKegiatanRequest extends FormRequest
{
    use HasSafeFileValidation;

    public function authorize(): bool
    {
        return Gate::allows('create', Kegiatan::class);
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $isSuperAdmin = $this->user()?->isSuperAdmin() ?? false;
        $jenisKonten = (string) $this->input('jenis_konten', 'berita_kegiatan');

        $imageRule = [
            'nullable',
            'file',
            'mimes:jpg,jpeg,png,webp',
            'mimetypes:image/jpeg,image/png,image/webp',
            'max:5120',
            $this->safeFilenameRule('gambar'),
        ];

        $base = [
            'jenis_konten' => ['required', Rule::in(['berita_kegiatan', 'berita_umum'])],
            'judul' => ['required', 'string', 'max:255'],
            'gambar' => $imageRule,
        ];

        if ($jenisKonten === 'berita_umum') {
            return array_merge($base, [
                'isi' => ['required', 'string'],
                'tanggal_publikasi' => ['nullable', 'date'],
            ]);
        }

        return array_merge($base, [
            'bidang_id' => $isSuperAdmin
                ? ['required', 'integer', 'exists:bidang,id']
                : ['nullable', 'integer', 'exists:bidang,id'],
            'tanggal_kegiatan' => ['required', 'date'],
            'lokasi' => ['required', 'string', 'max:255'],
            'isi_berita' => ['required', 'string'],
            'ringkasan' => ['nullable', 'string', 'max:500'],
            'dokumentasi_files' => ['nullable', 'array', 'max:10'],
            'dokumentasi_files.*' => [
                'file',
                'mimes:jpg,jpeg,png,webp',
                'mimetypes:image/jpeg,image/png,image/webp',
                'max:5120',
                $this->safeFilenameRule('dokumentasi'),
            ],
            'dokumentasi_captions' => ['nullable', 'array'],
            'dokumentasi_captions.*' => ['nullable', 'string', 'max:255'],
        ]);
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'jenis_konten.required' => 'Jenis konten wajib dipilih.',
            'jenis_konten.in' => 'Jenis konten harus Berita Kegiatan atau Berita Umum.',
            'judul.required' => 'Judul wajib diisi.',
            'bidang_id.required' => 'Kategori bidang wajib dipilih.',
            'bidang_id.exists' => 'Kategori bidang yang dipilih tidak valid.',
            'tanggal_kegiatan.required' => 'Tanggal pelaksanaan wajib diisi.',
            'tanggal_kegiatan.date' => 'Format tanggal pelaksanaan tidak valid.',
            'lokasi.required' => 'Lokasi kegiatan wajib diisi.',
            'isi_berita.required' => 'Deskripsi isi berita kegiatan wajib diisi.',
            'isi.required' => 'Deskripsi isi berita umum wajib diisi.',
            'gambar.mimes' => 'Gambar utama harus berformat JPG, JPEG, PNG, atau WEBP.',
            'gambar.mimetypes' => 'Tipe file gambar utama tidak valid.',
            'gambar.max' => 'Ukuran gambar utama maksimal 5 MB.',
            'dokumentasi_files.max' => 'Maksimal 10 foto dokumentasi dapat diunggah sekaligus.',
            'dokumentasi_files.*.mimes' => 'Foto dokumentasi harus berformat JPG, JPEG, PNG, atau WEBP.',
            'dokumentasi_files.*.mimetypes' => 'Tipe file foto dokumentasi tidak valid.',
            'dokumentasi_files.*.max' => 'Ukuran setiap foto dokumentasi maksimal 5 MB.',
        ];
    }
}
