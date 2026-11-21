<?php

namespace App\Http\Requests\AnakYatim;

use App\Http\Requests\Concerns\HasSafeFileValidation;
use App\Models\AnakYatim;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;

class StoreAnakYatimRequest extends FormRequest
{
    use HasSafeFileValidation;

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return Gate::allows('create', AnakYatim::class);
    }

    protected function prepareForValidation(): void
    {
        foreach (['nik', 'no_kk', 'no_telepon', 'no_telepon_wali', 'alamat_detail'] as $field) {
            if ($this->has($field) && is_string($this->input($field)) && trim($this->input($field)) === '') {
                $this->merge([$field => null]);
            }
        }
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $dokumenRule = [
            'nullable',
            'file',
            'mimes:pdf,png,jpg,jpeg',
            'mimetypes:application/pdf,image/png,image/jpeg',
            'max:5120',
            $this->safeFilenameRule('dokumen anak'),
        ];

        return [
            'nik' => ['nullable', 'string', 'digits:16'],
            'no_kk' => ['nullable', 'string', 'digits:16'],
            'nama_lengkap' => ['required', 'string', 'max:255'],
            'anak_ke' => ['required', 'integer', 'min:1', 'max:30'],
            'jenis_kelamin' => ['required', Rule::in(['L', 'P'])],
            'status_santunan' => ['required', Rule::in(AnakYatim::STATUS_SANTUNAN_LIST)],
            'tempat_lahir' => ['required', 'string', 'max:100'],
            'tanggal_lahir' => ['required', 'date', 'before_or_equal:today'],
            'jenjang' => ['required', Rule::in(AnakYatim::JENJANG_LIST)],
            'kelurahan' => ['required', 'string', 'max:100'],
            'alamat_detail' => ['nullable', 'string', 'max:1000'],
            'nama_ibu_kandung' => ['required', 'string', 'max:255'],
            'no_telepon' => ['nullable', 'string', 'max:30', 'regex:/^[0-9+\-\s()]+$/'],
            'nama_wali' => ['required', 'string', 'max:255'],
            'no_telepon_wali' => ['nullable', 'string', 'max:30', 'regex:/^[0-9+\-\s()]+$/'],
            'foto_anak' => $dokumenRule,
            'foto_kk' => $dokumenRule,
            'foto_akta_kelahiran' => $dokumenRule,
            'foto_akta_kematian_ayah' => $dokumenRule,
            'status_binaan' => ['nullable', Rule::in(['aktif', 'alumni', 'nonaktif'])],
            'bidang_ids' => ['nullable', 'array'],
            'bidang_ids.*' => ['integer', 'exists:bidang,id'],
            'catatan_program' => ['nullable', 'string', 'max:500'],
        ];
    }

    /**
     * Custom pesan validasi dalam Bahasa Indonesia.
     * Jangan menyertakan nilai input sensitif (seperti NIK/No KK) di dalam pesan error.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'nik.digits' => 'Format NIK harus terdiri dari tepat 16 digit angka.',
            'no_kk.digits' => 'Format Nomor KK harus terdiri dari tepat 16 digit angka.',
            'nama_lengkap.required' => 'Nama lengkap anak wajib diisi.',
            'anak_ke.required' => 'Urutan anak ke- wajib diisi.',
            'anak_ke.integer' => 'Urutan anak ke- harus berupa angka.',
            'anak_ke.min' => 'Urutan anak ke- minimal bernilai 1.',
            'jenis_kelamin.required' => 'Jenis kelamin wajib dipilih.',
            'jenis_kelamin.in' => 'Jenis kelamin harus Laki-laki (L) atau Perempuan (P).',
            'status_santunan.required' => 'Status penerima santunan wajib dipilih.',
            'status_santunan.in' => 'Status penerima santunan harus Menerima atau Menunggu.',
            'tempat_lahir.required' => 'Tempat lahir wajib diisi.',
            'tanggal_lahir.required' => 'Tanggal lahir wajib diisi.',
            'tanggal_lahir.date' => 'Format tanggal lahir tidak valid.',
            'tanggal_lahir.before_or_equal' => 'Tanggal lahir tidak boleh melebihi hari ini.',
            'jenjang.required' => 'Jenjang pendidikan wajib dipilih.',
            'jenjang.in' => 'Jenjang pendidikan harus SD, SMP, SMA/SMK, Perguruan Tinggi, atau Lainnya.',
            'kelurahan.required' => 'Kelurahan domisili wajib diisi.',
            'nama_ibu_kandung.required' => 'Nama ibu kandung wajib diisi.',
            'no_telepon.regex' => 'Format nomor telepon tidak valid.',
            'nama_wali.required' => 'Nama wali / pengasuh wajib diisi.',
            'no_telepon_wali.regex' => 'Format nomor telepon wali tidak valid.',
            'foto_anak.mimes' => 'Foto anak harus berformat PDF, PNG, atau JPG.',
            'foto_anak.mimetypes' => 'Tipe MIME foto anak harus PDF, PNG, atau JPG.',
            'foto_anak.max' => 'Ukuran berkas foto anak maksimal 5 MB.',
            'foto_kk.mimes' => 'Foto KK harus berformat PDF, PNG, atau JPG.',
            'foto_kk.mimetypes' => 'Tipe MIME foto KK harus PDF, PNG, atau JPG.',
            'foto_kk.max' => 'Ukuran berkas foto KK maksimal 5 MB.',
            'foto_akta_kelahiran.mimes' => 'Foto akta kelahiran harus berformat PDF, PNG, atau JPG.',
            'foto_akta_kelahiran.mimetypes' => 'Tipe MIME foto akta kelahiran harus PDF, PNG, atau JPG.',
            'foto_akta_kelahiran.max' => 'Ukuran berkas foto akta kelahiran maksimal 5 MB.',
            'foto_akta_kematian_ayah.mimes' => 'Foto akta kematian ayah harus berformat PDF, PNG, atau JPG.',
            'foto_akta_kematian_ayah.mimetypes' => 'Tipe MIME foto akta kematian ayah harus PDF, PNG, atau JPG.',
            'foto_akta_kematian_ayah.max' => 'Ukuran berkas foto akta kematian ayah maksimal 5 MB.',
            'bidang_ids.*.exists' => 'Bidang binaan yang dipilih tidak valid.',
        ];
    }
}
