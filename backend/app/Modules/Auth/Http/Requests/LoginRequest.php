<?php

namespace App\Modules\Auth\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

final class LoginRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        if (is_string($this->input('nik'))) {
            $this->merge(['nik' => preg_replace('/\s+/', '', $this->input('nik'))]);
        }
    }

    /**
     * Login semua role memakai NIK. captcha_id dan captcha hanya wajib setelah
     * dua kali salah password (dicek di LoginUser, bukan di sini).
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'nik' => ['required', 'string', 'digits:16'],
            'password' => ['required', 'string'],
            'captcha_id' => ['nullable', 'string', 'max:64'],
            'captcha' => ['nullable', 'string', 'max:10'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'nik.required' => 'NIK wajib diisi.',
            'nik.digits' => 'NIK harus 16 digit angka.',
            'password.required' => 'Password wajib diisi.',
        ];
    }
}
