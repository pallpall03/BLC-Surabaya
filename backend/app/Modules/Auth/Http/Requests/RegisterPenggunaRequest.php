<?php

namespace App\Modules\Auth\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

final class RegisterPenggunaRequest extends FormRequest
{
    public const PASSWORD_MIN = 8;

    public const PASSWORD_MAX = 12;

    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        if (is_string($this->input('nik'))) {
            $this->merge(['nik' => preg_replace('/\s+/', '', $this->input('nik'))]);
        }

        if (is_string($this->input('email'))) {
            $this->merge(['email' => mb_strtolower(trim($this->input('email')))]);
        }
    }

    /**
     * Sengaja tidak ada field role: role peserta ditetapkan di server.
     * Panjang password: PASSWORD_MIN sampai PASSWORD_MAX karakter (keputusan tim: maksimal 12).
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'nik' => ['required', 'string', 'digits:16', 'unique:users,nik'],
            'email' => ['required', 'string', 'email:rfc', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'confirmed', 'max:'.self::PASSWORD_MAX, Password::min(self::PASSWORD_MIN)],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Nama lengkap wajib diisi.',
            'nik.required' => 'NIK wajib diisi.',
            'nik.digits' => 'NIK harus 16 digit angka.',
            'nik.unique' => 'NIK sudah terdaftar.',
            'email.required' => 'Email wajib diisi.',
            'email.email' => 'Format email tidak valid.',
            'email.unique' => 'Email sudah terdaftar.',
            'password.required' => 'Password wajib diisi.',
            'password.confirmed' => 'Konfirmasi password tidak sama.',
            'password.min' => 'Password minimal '.self::PASSWORD_MIN.' karakter.',
            'password.max' => 'Password maksimal '.self::PASSWORD_MAX.' karakter.',
        ];
    }
}
