<?php

namespace App\Modules\Auth\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

final class RegisterPenggunaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Sengaja tidak ada field role: role pengguna ditetapkan di server.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email:rfc', 'max:255', 'unique:pengguna,email'],
            'password' => ['required', 'string', 'confirmed', Password::min(8)],
            'telepon' => ['nullable', 'string', 'max:20'],
            'alamat' => ['nullable', 'string'],
            'foto_profil' => ['nullable', 'string', 'max:255'],
        ];
    }
}
