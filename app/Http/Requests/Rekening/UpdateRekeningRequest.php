<?php

namespace App\Http\Requests\Rekening;

use App\Models\RekeningYayasan;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;

class UpdateRekeningRequest extends FormRequest
{
    public function authorize(): bool
    {
        $rekening = $this->route('rekening');

        return $rekening instanceof RekeningYayasan
            && Gate::allows('update', $rekening);
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        /** @var RekeningYayasan|null $rekening */
        $rekening = $this->route('rekening');
        $rekeningId = $rekening?->id;

        return [
            'nama_bank' => ['required', 'string', 'max:60'],
            'nomor_rekening' => [
                'required',
                'string',
                'max:50',
                Rule::unique('rekening_yayasan', 'nomor_rekening')->ignore($rekeningId),
            ],
            'atas_nama' => ['required', 'string', 'max:150'],
            'icon' => ['nullable', 'string', 'max:30'],
            'is_active' => ['nullable', 'boolean'],
            'catatan' => ['nullable', 'string', 'max:500'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'nama_bank.required' => 'Nama bank wajib diisi.',
            'nomor_rekening.required' => 'Nomor rekening wajib diisi.',
            'nomor_rekening.unique' => 'Nomor rekening ini sudah digunakan rekening lain.',
            'atas_nama.required' => 'Atas nama rekening wajib diisi.',
        ];
    }
}

