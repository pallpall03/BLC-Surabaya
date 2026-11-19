<?php

namespace App\Modules\Admin\Data\TimBlc\Infrastructure;

use App\Modules\Admin\Data\TimBlc\Contracts\TimBlcRepository;
use App\Modules\Admin\Data\TimBlc\Domain\TimBlc;
use App\Modules\Admin\Data\TimBlc\Infrastructure\TimBlcModel;

/**
 * Implementasi Repository untuk Tim BLC menggunakan Eloquent.
 */
final class EloquentTimBlcRepository implements TimBlcRepository
{
    public function all(): array
    {
        return TimBlcModel::all()->map(fn ($m) => $this->toDomain($m))->all();
    }

    public function find(int $id): mixed
    {
        $model = TimBlcModel::find($id);
        return $model ? $this->toDomain($model) : null;
    }

    public function create(array $data): mixed
    {
        $model = TimBlcModel::create($data);
        return $this->toDomain($model->fresh());
    }

    public function update(int $id, array $data): mixed
    {
        $model = TimBlcModel::findOrFail($id);
        $model->update($data);
        return $this->toDomain($model->fresh());
    }

    public function delete(int $id): void
    {
        TimBlcModel::findOrFail($id)->delete();
    }

    public function getByRole(string $role): array
    {
        return TimBlcModel::where('role', $role)->get()->map(fn ($m) => $this->toDomain($m))->all();
    }

    public function getInstruktur(): array
    {
        return TimBlcModel::instruktur()->get()->map(fn ($m) => $this->toDomain($m))->all();
    }

    public function getKoordinator(): array
    {
        return TimBlcModel::koordinator()->get()->map(fn ($m) => $this->toDomain($m))->all();
    }

    public function getAktif(): array
    {
        return TimBlcModel::aktif()->get()->map(fn ($m) => $this->toDomain($m))->all();
    }

    /**
     * Convert Eloquent Model ke Domain Entity
     */
    private function toDomain(TimBlcModel $model): TimBlc
    {
        return new TimBlc(
            id: $model->id,
            userId: $model->user_id,
            namaLengkap: $model->nama_lengkap,
            gender: $model->gender,
            email: $model->email,
            alamat: $model->alamat,
            role: $model->role,
            avatar: $model->avatar,
            phone: $model->phone,
            kategoriId: $model->kategori_id,
            lokasiBlcId: $model->lokasi_blc_id,
            nik: $model->nik,
            tanggalLahir: $model->tanggal_lahir?->toIso8601String(),
            kecamatan: $model->kecamatan,
            kelurahan: $model->kelurahan,
            username: $model->username,
            isDelete: $model->is_delete,
            isSurabaya: $model->is_surabaya,
            createdAt: $model->created_at?->toIso8601String(),
            updatedAt: $model->updated_at?->toIso8601String(),
        );
    }
}
