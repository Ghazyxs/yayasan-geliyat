<?php

namespace App\Http\Requests\Donasi;

use App\Models\Donasi;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class VerifyDonasiRequest extends FormRequest
{
    public function authorize(): bool
    {
        $donasi = $this->route('donasi');

        return $this->user() !== null
            && $donasi instanceof Donasi
            && Gate::forUser($this->user())->allows('verify', $donasi);
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
            'catatan_verifikasi' => ['nullable', 'string', 'max:1000'],
        ];
    }
}
