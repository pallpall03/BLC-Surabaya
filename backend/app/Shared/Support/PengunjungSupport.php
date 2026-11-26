<?php

namespace App\Shared\Support;

use App\Modules\Admin\Data\LokasiBlc\Infrastructure\LokasiBlcModel;
use App\Modules\Instruktur\DaftarHadir\Infrastructure\SesiModel;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Exists;

final class PengunjungSupport
{
    /** @return list<string> */
    public static function kategori(): array
    {
        return [
            'SD',
            'SMP',
            'SMA/SMK',
            'Mahasiswa',
            'PNS',
            'Karyawan',
            'Guru',
            'Wiraswasta',
            'BK',
            'IRT',
            'Pensiunan',
            'UKM',
            'PKK',
            'Kartar',
            'Pendidik PAUD',
            'KIM',
            'Kader (KSH)',
        ];
    }

    /** @return array{blc: list<array{id: int, nama: string}>, sesi: list<array{id: int, sesi: int, jam: string}>, kategori: list<string>} */
    public static function opsi(): array
    {
        $blc = LokasiBlcModel::query()
            ->aktif()
            ->orderBy('nama_blc')
            ->get(['id', 'nama_blc'])
            ->map(fn (LokasiBlcModel $model) => [
                'id' => (int) $model->id,
                'nama' => $model->nama_blc,
            ])
            ->all();

        $sesi = SesiModel::query()
            ->aktif()
            ->orderBy('sesi')
            ->get(['id', 'sesi', 'jam'])
            ->map(fn (SesiModel $model) => [
                'id' => (int) $model->id,
                'sesi' => (int) $model->sesi,
                'jam' => $model->jam,
            ])
            ->all();

        return compact('blc', 'sesi') + ['kategori' => self::kategori()];
    }

    public static function lokasiRule(?int $currentId = null): Exists
    {
        return Rule::exists('lokasi_blc', 'id')->where(function ($query) use ($currentId): void {
            $query->where(fn ($active) => $active->where('aktif', true)->where('is_delete', false));
            if ($currentId !== null) {
                $query->orWhere('id', $currentId);
            }
        });
    }

    public static function sesiRule(?int $currentId = null): Exists
    {
        return Rule::exists('sesi', 'id')->where(function ($query) use ($currentId): void {
            $query->where('is_delete', false);
            if ($currentId !== null) {
                $query->orWhere('id', $currentId);
            }
        });
    }

    /** @return array<string, mixed> */
    public static function rules(bool $partial = false, bool $pesanWajib = true, ?int $lokasiId = null, ?int $sesiId = null): array
    {
        $required = $partial ? 'sometimes|required' : 'required';
        $nullable = $partial ? 'sometimes|nullable' : 'nullable';

        return [
            'nama' => [$required, 'string', 'max:255'],
            'instansi' => [$nullable, 'string', 'max:255'],
            'email' => [$nullable, 'string', 'email', 'max:255'],
            'telepon' => [$nullable, 'string', 'max:255'],
            'pesan' => $pesanWajib
                ? [$required, 'string']
                : [$nullable, 'string'],
            'rating' => [$nullable, 'integer', 'min:1', 'max:5'],
            'lokasi_blc_id' => [$required, 'integer', self::lokasiRule($lokasiId)],
            'sesi_id' => [$required, 'integer', self::sesiRule($sesiId)],
            'jenis_kelamin' => [$nullable, Rule::in(['L', 'P'])],
            'tanggal_lahir' => [$nullable, 'date'],
            'alamat' => [$nullable, 'string'],
            'kategori' => [$nullable, 'string', 'max:100', Rule::in(self::kategori())],
        ];
    }
}
