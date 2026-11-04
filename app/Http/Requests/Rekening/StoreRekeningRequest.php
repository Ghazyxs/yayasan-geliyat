<?php

namespace App\Http\Requests\Rekening;

use App\Models\RekeningYayasan;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class StoreRekeningRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Gate::allows('create', RekeningYayasan::class);
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'nama_bank' => ['required', 'string', 'max:60'],
            'nomor_rekening' => ['required', 'string', 'max:50', 'unique:rekening_yayasan,nomor_rekening'],
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
            'nomor_rekening.unique' => 'Nomor rekening ini sudah terdaftar.',
            'atas_nama.required' => 'Atas nama rekening wajib diisi.',
        ];
    }
}

