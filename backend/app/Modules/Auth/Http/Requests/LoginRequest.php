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
        $loginIdentifier = $this->input('nik') ?? $this->input('username');
        if (is_string($loginIdentifier)) {
            $this->merge(['login_identifier' => trim($loginIdentifier)]);
        }
    }

    /**
     * @return array<string, mixed>
     */
    protected function rules(): array
    {
        return [
            'login_identifier' => ['required', 'string', 'max:50'],
            'password' => ['required', 'string'],
            'captcha' => ['sometimes', 'string'],
            'captcha_key' => ['sometimes', 'string'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'login_identifier.required' => 'NIK atau username wajib diisi.',
            'login_identifier.string' => 'NIK atau username tidak valid.',
            'password.required' => 'Password wajib diisi.',
            'captcha.required' => 'Captcha wajib diisi.',
        ];
    }
}
