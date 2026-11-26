<?php

namespace App\Modules\Instruktur\DaftarPeserta\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Validasi tambah (POST) dan ubah (PUT/PATCH) peserta.
 * PUT/POST: field wajib dikirim lengkap. PATCH: hanya field yang dikirim yang divalidasi.
 */
final class SimpanPesertaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        foreach (['nik', 'nama', 'telepon', 'alamat'] as $kolom) {
            if (is_string($this->input($kolom))) {
                $this->merge([$kolom => trim($this->input($kolom))]);
            }
        }
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $wajib = $this->isMethod('PATCH') ? 'sometimes' : 'required';
        $id = $this->route('id');

        return [
            'nik' => [
                $wajib, 'string', 'digits:16',
                Rule::unique('peserta', 'nik')->ignore($id)->where('is_delete', false),
            ],
            'nama' => [$wajib, 'string', 'max:255'],
            'jk' => [$wajib, 'string', Rule::in(['L', 'P'])],
            'tanggal_lahir' => ['nullable', 'date', 'before_or_equal:today'],
            'telepon' => ['nullable', 'string', 'max:20', 'regex:/^[0-9+\-\s()]+$/'],
            'alamat' => ['nullable', 'string', 'max:1000'],
            'lokasi_blc_id' => [
                $wajib, 'integer',
                Rule::exists('lokasi_blc', 'id')
                    ->where('is_delete', false)
                    ->where('aktif', true),
            ],
            'kategori_peserta_id' => [
                'nullable', 'integer',
                Rule::exists('kategori_artikel', 'id')
                    ->where('is_delete', false)
                    ->where('jenis_kategori', 'Peserta'),
            ],
            'email' => ['nullable', 'string', 'email', 'max:255'],
            'kecamatan' => ['nullable', 'string', 'max:255'],
            'kelurahan' => ['nullable', 'string', 'max:255'],
            'kecamatan_lain' => ['nullable', 'string', 'max:255'],
            'kelurahan_lain' => ['nullable', 'string', 'max:255'],
            'is_surabaya' => ['nullable', 'boolean'],
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
            'nik.unique' => 'NIK sudah terdaftar.',
            'nama.required' => 'Nama wajib diisi.',
            'jk.required' => 'Jenis kelamin wajib dipilih.',
            'jk.in' => 'Jenis kelamin harus L atau P.',
            'tanggal_lahir.date' => 'Tanggal lahir tidak valid.',
            'tanggal_lahir.before_or_equal' => 'Tanggal lahir tidak boleh di masa depan.',
            'telepon.regex' => 'Nomor telepon hanya boleh berisi angka dan tanda + - ( ).',
            'lokasi_blc_id.required' => 'BLC wajib dipilih.',
            'lokasi_blc_id.exists' => 'BLC tidak ditemukan.',
            'kategori_peserta_id.exists' => 'Kategori peserta aktif tidak ditemukan.',
            'email.email' => 'Email tidak valid.',
            'email.max' => 'Email maksimal 255 karakter.',
            'is_surabaya.boolean' => 'Status Surabaya harus boolean.',
        ];
    }
}
