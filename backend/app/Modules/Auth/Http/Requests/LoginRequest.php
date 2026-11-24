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
        if (is_string($this->input('login'))) {
            $this->merge(['login' => trim($this->input('login'))]);
        }
    }

    /**
     * Login semua role memakai NIK atau username. captcha_id dan captcha hanya wajib setelah
     * dua kali salah password (dicek di LoginUser, bukan di sini).
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'login' => ['required', 'string', 'max:255'],
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
            'login.required' => 'NIK atau username wajib diisi.',
            'password.required' => 'Password wajib diisi.',
        ];
    }
}
