<?php

namespace App\Modules\Instruktur\Ujian\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

final class SimpanUjianRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        if (is_string($this->input('judul'))) {
            $this->merge(['judul' => trim($this->input('judul'))]);
        }

        if (is_array($this->input('soal'))) {
            $soal = array_map(function (mixed $item): mixed {
                if (! is_array($item)) {
                    return $item;
                }

                if (is_string($item['pertanyaan'] ?? null)) {
                    $item['pertanyaan'] = trim($item['pertanyaan']);
                }

                if (is_array($item['pilihan'] ?? null)) {
                    $item['pilihan'] = array_map(
                        static fn (mixed $pilihan): mixed => is_string($pilihan) ? trim($pilihan) : $pilihan,
                        $item['pilihan'],
                    );
                }

                if (array_key_exists('penjelasan', $item)) {
                    $item['penjelasan'] = is_string($item['penjelasan']) ? trim($item['penjelasan']) : $item['penjelasan'];
                    if ($item['penjelasan'] === '') {
                        $item['penjelasan'] = null;
                    }
                }

                return $item;
            }, $this->input('soal'));

            $this->merge(['soal' => $soal]);
        }
    }

    public function rules(): array
    {
        $wajib = $this->isMethod('POST') ? 'required' : 'sometimes';

        return [
            'judul' => [$wajib, 'string', 'max:255'],
            'materi_id' => [
                'sometimes',
                'nullable',
                'string',
                'max:50',
                Rule::exists('materi', 'id')->where('is_delete', false),
            ],
            'tipe' => [$wajib, Rule::in(['pretest', 'posttest'])],
            'durasi_menit' => [$wajib, 'integer', 'min:1', 'max:480'],
            'nilai_minimum' => ['sometimes', 'integer', 'min:0', 'max:100'],
            'acak_soal' => ['sometimes', 'boolean'],
            'is_aktif' => ['sometimes', 'boolean'],
            'soal' => [$wajib, 'array', 'min:1', 'max:10'],
            'soal.*.pertanyaan' => ['required', 'string', 'max:65535'],
            'soal.*.pilihan' => ['required', 'array', 'size:4', 'distinct'],
            'soal.*.pilihan.*' => ['required', 'string', 'max:65535'],
            'soal.*.jawaban_benar' => ['required', 'integer', 'min:0', 'max:3'],
            'soal.*.nomor' => ['sometimes', 'integer', 'min:1', 'max:10', 'distinct'],
            'soal.*.bobot' => ['sometimes', 'integer', 'min:1', 'max:4294967295'],
            'soal.*.penjelasan' => ['nullable', 'string', 'max:65535'],
        ];
    }

    public function messages(): array
    {
        return [
            'judul.required' => 'Judul ujian wajib diisi.',
            'materi_id.exists' => 'Materi tidak ditemukan atau sudah tidak aktif.',
            'tipe.required' => 'Tipe ujian wajib dipilih.',
            'tipe.in' => 'Tipe ujian harus pretest atau posttest.',
            'durasi_menit.required' => 'Durasi ujian wajib diisi.',
            'durasi_menit.min' => 'Durasi ujian minimal 1 menit.',
            'durasi_menit.max' => 'Durasi ujian maksimal 480 menit.',
            'nilai_minimum.min' => 'Nilai minimum minimal 0.',
            'nilai_minimum.max' => 'Nilai minimum maksimal 100.',
            'soal.required' => 'Soal ujian wajib diisi.',
            'soal.min' => 'Ujian harus memiliki minimal satu soal.',
            'soal.max' => 'Ujian maksimal memiliki 10 soal.',
            'soal.*.pilihan.size' => 'Setiap soal harus memiliki tepat 4 pilihan jawaban.',
            'soal.*.pilihan.distinct' => 'Pilihan jawaban pada setiap soal harus berbeda.',
            'soal.*.jawaban_benar.min' => 'Kunci jawaban harus bernilai 0 sampai 3.',
            'soal.*.jawaban_benar.max' => 'Kunci jawaban harus bernilai 0 sampai 3.',
            'soal.*.nomor.distinct' => 'Nomor soal tidak boleh duplikat.',
        ];
    }
}
