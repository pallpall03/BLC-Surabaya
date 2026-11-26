<?php

namespace App\Modules\Instruktur\DaftarHadir\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Validasi tambah (POST) dan ubah (PUT/PATCH) kelas.
 * POST mewajibkan seluruh field utama; PUT/PATCH bersifat parsial.
 */
final class SimpanKelasRequest extends FormRequest
{
    private const HARI = [
        'Senin',
        'Selasa',
        'Rabu',
        'Kamis',
        'Jumat',
        'Sabtu',
        'Minggu',
    ];

    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        if (is_string($this->input('nama_kelas'))) {
            $this->merge(['nama_kelas' => trim($this->input('nama_kelas'))]);
        }

        if (is_array($this->input('hari'))) {
            $this->merge([
                'hari' => array_map(
                    static fn ($hari) => is_string($hari) ? trim($hari) : $hari,
                    $this->input('hari'),
                ),
            ]);
        }
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $wajib = $this->isMethod('POST') ? 'required' : 'sometimes';

        return [
            'nama_kelas' => [$wajib, 'string', 'max:255'],
            'materi_id' => [
                $wajib,
                'string',
                'max:50',
                Rule::exists('materi', 'id')->where('is_delete', false),
            ],
            'sesi_id' => [
                $wajib,
                'integer',
                Rule::exists('sesi', 'id')->where('is_delete', false),
            ],
            'hari' => [$wajib, 'array', 'min:1', 'distinct'],
            'hari.*' => ['required', 'string', Rule::in(self::HARI)],
            'lokasi_blc_id' => [
                $wajib,
                'integer',
                Rule::exists('lokasi_blc', 'id')
                    ->where('is_delete', false)
                    ->where('aktif', true),
            ],
            'status' => ['sometimes', 'integer', 'in:0,1'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'nama_kelas.required' => 'Nama kelas wajib diisi.',
            'materi_id.required' => 'Materi wajib dipilih.',
            'materi_id.exists' => 'Materi tidak ditemukan atau sudah tidak aktif.',
            'sesi_id.required' => 'Sesi wajib dipilih.',
            'sesi_id.exists' => 'Sesi tidak ditemukan atau sudah tidak aktif.',
            'hari.required' => 'Hari wajib dipilih.',
            'hari.array' => 'Hari harus berupa array.',
            'hari.min' => 'Pilih minimal satu hari.',
            'hari.distinct' => 'Hari tidak boleh duplikat.',
            'hari.*.required' => 'Setiap hari wajib diisi.',
            'hari.*.in' => 'Nilai hari harus Senin sampai Minggu.',
            'lokasi_blc_id.required' => 'BLC wajib dipilih.',
            'lokasi_blc_id.exists' => 'BLC tidak ditemukan atau sudah tidak aktif.',
            'status.in' => 'Status kelas hanya boleh 0 atau 1.',
        ];
    }

    /**
     * Data tervalidasi yang siap disimpan. Hari disimpan sebagai string
     * dengan pemisah spasi, misalnya "Senin Rabu".
     *
     * @return array<string, mixed>
     */
    public function kelasData(): array
    {
        $data = $this->validated();

        if (array_key_exists('hari', $data)) {
            $data['hari'] = implode(' ', $data['hari']);
        }

        return $data;
    }
}
