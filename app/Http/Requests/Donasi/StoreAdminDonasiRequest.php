<?php

namespace App\Http\Requests\Donasi;

use App\Models\Donasi;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;

class StoreAdminDonasiRequest extends StorePublicDonasiRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null && Gate::forUser($this->user())->allows('create', Donasi::class);
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return array_merge(parent::rules(), [
            'no_whatsapp' => ['nullable', 'string', 'max:30', 'regex:/^[0-9+\-\s()]{8,25}$/'],
            'email' => ['nullable', 'email', 'max:255'],
            'jenis_donasi' => ['nullable', 'string', Rule::in(Donasi::JENIS_DONASI_LIST)],
            'rekening_tujuan' => ['nullable', 'string', 'max:100'],
            'nominal' => ['required', 'integer', 'min:1000', 'max:100000000000'],
            'bukti_transfer' => [
                'nullable',
                'file',
                'mimes:jpg,jpeg,png,webp,pdf',
                'mimetypes:image/jpeg,image/png,image/webp,application/pdf',
                'max:5120',
                $this->buktiTransferFileRule(),
            ],
        ]);
    }
}
