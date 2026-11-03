<?php

namespace App\Http\Requests\Donasi;

use App\Models\Donasi;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class CancelDonasiRequest extends FormRequest
{
    public function authorize(): bool
    {
        $donasi = $this->route('donasi');

        return $this->user() !== null
            && $donasi instanceof Donasi
            && Gate::forUser($this->user())->allows('cancel', $donasi);
    }

    protected function prepareForValidation(): void
    {
        if (! $this->filled('catatan_verifikasi') && $this->filled('alasan')) {
            $this->merge(['catatan_verifikasi' => $this->input('alasan')]);
        }
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'catatan_verifikasi' => ['required', 'string', 'min:3', 'max:1000'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'catatan_verifikasi.required' => 'Alasan pembatalan donasi wajib diisi.',
            'catatan_verifikasi.min' => 'Alasan pembatalan minimal 3 karakter.',
        ];
    }
}
