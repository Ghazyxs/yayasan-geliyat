<?php

namespace App\Http\Requests\AnakYatim;

use App\Models\AnakYatim;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;

class UpdateAnakYatimRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $anakYatim = $this->route('anak_yatim');

        return $anakYatim instanceof AnakYatim && Gate::allows('update', $anakYatim);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $isSuperAdmin = $this->user()?->isSuperAdmin() ?? false;

        return [
            'nik' => ['nullable', 'string', 'digits:16'],
            'nama_lengkap' => ['required', 'string', 'max:255'],
            'alias' => ['required', 'string', 'max:100'],
            'jenis_kelamin' => ['required', Rule::in(['L', 'P'])],
            'tanggal_lahir' => ['required', 'date', 'before_or_equal:today'],
            'jenjang' => ['required', Rule::in(['SD', 'SMP', 'SMA', 'Kuliah'])],
            'kelas' => ['required', 'string', 'max:50'],
            'nama_sekolah' => ['nullable', 'string', 'max:255'],
            'kelurahan' => ['required', 'string', 'max:100'],
            'alamat_detail' => ['nullable', 'string', 'max:1000'],
            'nama_wali' => ['required', 'string', 'max:255'],
            'no_telepon_wali' => ['nullable', 'string', 'max:30', 'regex:/^[0-9+\-\s()]+$/'],
            'hobi' => ['nullable', 'string', 'max:255'],
            'cita_cita' => ['nullable', 'string', 'max:255'],
            'status_binaan' => ['required', Rule::in(['aktif', 'alumni', 'nonaktif'])],
            'status_asuh' => ['required', Rule::in(['belum_diasuh', 'aktif_diasuh'])],
            'bidang_ids' => $isSuperAdmin
                ? ['required', 'array', 'min:1']
                : ['nullable', 'array'],
            'bidang_ids.*' => ['integer', 'exists:bidang,id'],
            'catatan_program' => ['nullable', 'string', 'max:500'],
            'update_sensitive' => ['nullable', 'boolean'],
        ];
    }

    /**
     * Custom pesan validasi dalam Bahasa Indonesia.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'nik.digits' => 'Format NIK harus terdiri dari tepat 16 digit angka.',
            'nama_lengkap.required' => 'Nama lengkap anak wajib diisi.',
            'alias.required' => 'Nama panggilan / alias wajib diisi.',
            'jenis_kelamin.required' => 'Jenis kelamin wajib dipilih.',
            'jenis_kelamin.in' => 'Jenis kelamin harus Laki-laki (L) atau Perempuan (P).',
            'tanggal_lahir.required' => 'Tanggal lahir wajib diisi.',
            'tanggal_lahir.date' => 'Format tanggal lahir tidak valid.',
            'tanggal_lahir.before_or_equal' => 'Tanggal lahir tidak boleh melebihi hari ini.',
            'jenjang.required' => 'Jenjang pendidikan wajib dipilih.',
            'jenjang.in' => 'Jenjang pendidikan harus salah satu dari SD, SMP, SMA, atau Kuliah.',
            'kelas.required' => 'Informasi kelas / semester wajib diisi.',
            'kelurahan.required' => 'Kelurahan domisili wajib diisi.',
            'nama_wali.required' => 'Nama wali / pengasuh wajib diisi.',
            'no_telepon_wali.regex' => 'Format nomor telepon wali tidak valid.',
            'status_binaan.required' => 'Status binaan wajib dipilih.',
            'status_asuh.required' => 'Status orang tua asuh wajib dipilih.',
            'bidang_ids.required' => 'Minimal satu bidang binaan wajib dipilih.',
            'bidang_ids.min' => 'Minimal satu bidang binaan wajib dipilih.',
            'bidang_ids.*.exists' => 'Bidang binaan yang dipilih tidak valid.',
        ];
    }
}
