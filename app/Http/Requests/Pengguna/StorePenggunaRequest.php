<?php

namespace App\Http\Requests\Pengguna;

use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class StorePenggunaRequest extends FormRequest
{
    /**
     * Hanya Super Admin aktif yang diizinkan membuat akun pengurus baru.
     */
    public function authorize(): bool
    {
        return $this->user() !== null
            && $this->user()->is_active
            && $this->user()->isSuperAdmin();
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('email') && is_string($this->input('email'))) {
            $this->merge([
                'email' => Str::lower(trim($this->input('email'))),
            ]);
        }

        if ($this->has('name') && is_string($this->input('name'))) {
            $this->merge([
                'name' => trim($this->input('name')),
            ]);
        }

        if ($this->has('phone') && is_string($this->input('phone')) && trim($this->input('phone')) === '') {
            $this->merge(['phone' => null]);
        }

        if ($this->input('role') === 'super_admin' || $this->input('bidang_id') === '') {
            $this->merge(['bidang_id' => null]);
        }
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique(User::class, 'email')],
            'phone' => ['nullable', 'string', 'max:30', 'regex:/^[0-9+\-\s()]{8,25}$/'],
            'role' => ['required', 'string', Rule::in(['admin', 'super_admin'])],
            'bidang_id' => [
                Rule::requiredIf(fn () => $this->input('role') === 'admin'),
                'nullable',
                'integer',
                Rule::exists('bidang', 'id'),
            ],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Nama lengkap pengurus wajib diisi.',
            'email.required' => 'Alamat email wajib diisi.',
            'email.email' => 'Format alamat email tidak valid.',
            'email.unique' => 'Email ini sudah terdaftar. Gunakan alamat email lain.',
            'phone.regex' => 'Format nomor telepon / WhatsApp tidak valid.',
            'role.required' => 'Peran pengguna wajib dipilih.',
            'role.in' => 'Peran harus Admin Bidang atau Super Admin.',
            'bidang_id.required' => 'Bidang kerja wajib dipilih untuk akun Admin Bidang.',
            'bidang_id.exists' => 'Bidang kerja yang dipilih tidak valid.',
            'password.required' => 'Kata sandi wajib diisi.',
            'password.min' => 'Kata sandi minimal terdiri dari 8 karakter.',
            'password.confirmed' => 'Konfirmasi kata sandi tidak cocok.',
        ];
    }
}
