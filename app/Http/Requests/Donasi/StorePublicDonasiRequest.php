<?php

namespace App\Http\Requests\Donasi;

use App\Models\Donasi;
use App\Models\RekeningYayasan;
use Closure;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\UploadedFile;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class StorePublicDonasiRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('anak_yatim_id') && ($this->input('anak_yatim_id') === '' || $this->input('anak_yatim_id') === 'null')) {
            $this->merge(['anak_yatim_id' => null]);
        }

        if ($this->has('nominal') && is_string($this->input('nominal'))) {
            $cleanedNominal = preg_replace('/[^0-9]/', '', $this->input('nominal'));
            if ($cleanedNominal !== '') {
                $this->merge(['nominal' => (int) $cleanedNominal]);
            }
        }
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'nama_donatur' => ['required', 'string', 'max:255'],
            'no_whatsapp' => ['required', 'string', 'max:30', 'regex:/^[0-9+\-\s()]{8,25}$/'],
            'jenis_donasi' => ['required', 'string', Rule::in(Donasi::JENIS_DONASI_LIST)],
            'anak_yatim_id' => [
                'nullable',
                'integer',
                Rule::exists('anak_yatim', 'id'),
            ],
            'rekening_id' => [
                'nullable',
                'integer',
                Rule::exists('rekening_yayasan', 'id')->where('is_active', true),
            ],
            'rekening_tujuan' => ['required', 'string', 'max:100'],
            'nominal' => ['required', 'integer', 'min:10000', 'max:100000000000'],
            'pesan_doa' => ['nullable', 'string', 'max:1000'],
            'bukti_transfer' => [
                'required',
                'file',
                'mimes:jpg,jpeg,png,webp,pdf',
                'mimetypes:image/jpeg,image/png,image/webp,application/pdf',
                'max:5120',
                function (string $attribute, mixed $value, Closure $fail): void {
                    if (! $value instanceof UploadedFile) {
                        $fail('File bukti transfer tidak valid.');

                        return;
                    }

                    $originalName = $value->getClientOriginalName();

                    if ($originalName === '' || mb_strlen($originalName) > 200) {
                        $fail('Nama file bukti transfer tidak valid atau terlalu panjang.');

                        return;
                    }

                    if (
                        str_contains($originalName, '..')
                        || str_contains($originalName, '/')
                        || str_contains($originalName, '\\')
                        || str_contains($originalName, "\0")
                    ) {
                        $fail('Nama file bukti transfer mengandung karakter yang tidak diizinkan.');

                        return;
                    }

                    if (preg_match('/\.(php\d*|phtml|phar|exe|sh|bat|cmd|js|jsp|asp|aspx|cgi|pl|py|svg|html|htm)(\.|$)/i', $originalName)) {
                        $fail('Ekstensi atau nama file bukti transfer tidak diizinkan.');
                    }
                },
            ],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'nama_donatur.required' => 'Nama donatur wajib diisi.',
            'no_whatsapp.required' => 'Nomor WhatsApp wajib diisi.',
            'no_whatsapp.regex' => 'Format nomor WhatsApp tidak valid.',
            'jenis_donasi.required' => 'Jenis donasi wajib dipilih.',
            'jenis_donasi.in' => 'Jenis donasi yang dipilih tidak valid.',
            'anak_yatim_id.exists' => 'Data anak binaan yang dipilih tidak ditemukan.',
            'rekening_id.exists' => 'Rekening tujuan transfer tidak aktif atau tidak ditemukan.',
            'rekening_tujuan.required' => 'Rekening tujuan transfer wajib dipilih.',
            'nominal.required' => 'Nominal donasi wajib diisi.',
            'nominal.integer' => 'Nominal donasi harus berupa angka.',
            'nominal.min' => 'Nominal donasi minimal Rp 10.000.',
            'bukti_transfer.required' => 'Bukti transfer wajib diunggah.',
            'bukti_transfer.file' => 'Bukti transfer harus berupa file.',
            'bukti_transfer.mimes' => 'Bukti transfer harus berformat JPG, JPEG, PNG, WEBP, atau PDF.',
            'bukti_transfer.mimetypes' => 'Tipe MIME file bukti transfer tidak diizinkan.',
            'bukti_transfer.max' => 'Ukuran file bukti transfer maksimal 5 MB.',
        ];
    }

    /**
     * Pastikan rekening tujuan yang dipilih tidak dalam status nonaktif.
     */
    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $v) {
            $rekeningId = $this->input('rekening_id');
            $rekeningTujuan = trim((string) $this->input('rekening_tujuan'));

            if ($rekeningId) {
                $rekening = RekeningYayasan::find($rekeningId);
                if ($rekening && ! $rekening->is_active) {
                    $v->errors()->add('rekening_id', 'Rekening tujuan transfer sedang nonaktif dan tidak dapat menerima donasi baru.');
                }
            } elseif ($rekeningTujuan !== '' && RekeningYayasan::query()->exists()) {
                $isInactive = RekeningYayasan::where('is_active', false)
                    ->where(function ($query) use ($rekeningTujuan) {
                        $query->where('nomor_rekening', $rekeningTujuan)
                            ->orWhereRaw("CONCAT(nama_bank, ' - ', nomor_rekening) = ?", [$rekeningTujuan]);
                    })
                    ->exists();

                if ($isInactive) {
                    $v->errors()->add('rekening_tujuan', 'Rekening tujuan transfer sedang nonaktif dan tidak dapat menerima donasi baru.');
                }
            }
        });
    }
}
