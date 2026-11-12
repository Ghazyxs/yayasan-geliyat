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
            'jenis_donasi' => ['required', 'string', Rule::in(Donasi::JENIS_DONASI_LIST)],
            'rekening_tujuan' => ['required', 'string', 'max:100'],
            'nominal' => ['required', 'integer', 'min:10000', 'max:100000000000'],
            'bukti_transfer' => [
                'required',
                'file',
                'mimes:jpg,jpeg,png,webp,pdf',
                'mimetypes:image/jpeg,image/png,image/webp,application/pdf',
                'max:5120',
                $this->buktiTransferFileRule(),
            ],
        ]);
    }
}
