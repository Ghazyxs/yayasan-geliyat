<?php

namespace App\Http\Requests\Keuangan;

use App\Models\TransaksiKeuangan;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;

class StoreTransaksiRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Gate::allows('create', TransaksiKeuangan::class);
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'tipe' => [
                'required',
                Rule::in([
                    TransaksiKeuangan::TIPE_PEMASUKAN,
                    TransaksiKeuangan::TIPE_PENGELUARAN,
                ]),
            ],
            'sumber_dana' => [
                'required',
                Rule::in(TransaksiKeuangan::SUMBER_DANA_LIST),
            ],
            'kategori' => ['required', 'string', 'max:100'],
            'nominal' => ['required', 'integer', 'min:1000', 'max:100000000000'],
            'tanggal_transaksi' => ['required', 'date', 'before_or_equal:today'],
            'keterangan' => ['required', 'string', 'max:1000'],
            'bukti_nota' => [
                'nullable',
                'file',
                'mimes:jpg,jpeg,png,webp,pdf',
                'max:5120',
            ],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'tipe.required' => 'Tipe transaksi wajib dipilih (Pemasukan atau Pengeluaran).',
            'tipe.in' => 'Tipe transaksi tidak valid.',
            'sumber_dana.required' => 'Sumber dana wajib dipilih (Dana Donasi atau Kas Operasional Yayasan).',
            'sumber_dana.in' => 'Sumber dana yang dipilih tidak valid.',
            'kategori.required' => 'Kategori transaksi wajib diisi.',
            'nominal.required' => 'Nominal transaksi wajib diisi.',
            'nominal.integer' => 'Nominal transaksi harus berupa angka bulat.',
            'nominal.min' => 'Nominal transaksi minimal Rp 1.000.',
            'tanggal_transaksi.required' => 'Tanggal transaksi wajib diisi.',
            'tanggal_transaksi.before_or_equal' => 'Tanggal transaksi tidak boleh mendahului hari ini.',
            'keterangan.required' => 'Keterangan transaksi wajib diisi.',
            'bukti_nota.mimes' => 'Bukti nota harus berupa file gambar (JPG, PNG, WEBP) atau PDF.',
            'bukti_nota.max' => 'Ukuran file bukti nota maksimal 5 MB.',
        ];
    }
}

