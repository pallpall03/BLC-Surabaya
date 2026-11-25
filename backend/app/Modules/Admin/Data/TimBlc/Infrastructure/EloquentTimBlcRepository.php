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
        return TimBlcModel::with('lokasi')->orderBy('id', 'desc')->get()->map(fn ($m) => $this->toDomain($m))->all();
    }

    public function find(int $id): mixed
    {
        $model = TimBlcModel::with('lokasi')->find($id);
        return $model ? $this->toDomain($model) : null;
    }

    public function create(array $data): mixed
    {
        $model = TimBlcModel::create($data);
        return $this->toDomain($model->fresh('lokasi'));
    }

    public function update(int $id, array $data): mixed
    {
        $model = TimBlcModel::findOrFail($id);
        $model->update($data);
        return $this->toDomain($model->fresh('lokasi'));
    }

    public function delete(int $id): void
    {
        TimBlcModel::findOrFail($id)->delete();
    }

    public function getByRole(string $role): array
    {
        return TimBlcModel::with('lokasi')->where('role', $role)->get()->map(fn ($m) => $this->toDomain($m))->all();
    }

    public function getInstruktur(): array
    {
        return TimBlcModel::with('lokasi')->instruktur()->get()->map(fn ($m) => $this->toDomain($m))->all();
    }

    public function getKoordinator(): array
    {
        return TimBlcModel::with('lokasi')->koordinator()->get()->map(fn ($m) => $this->toDomain($m))->all();
    }

    public function getAktif(): array
    {
        return TimBlcModel::with('lokasi')->aktif()->orderBy('id', 'desc')->get()->map(fn ($m) => $this->toDomain($m))->all();
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
            role: $model->role ?? 'instruktur',
            avatar: $model->avatar,
            phone: $model->phone,
            lokasiBlcId: $model->lokasi_blc_id,
            namaLokasi: $model->lokasi?->nama_blc ?? $model->lokasi?->nama_lokasi ?? $model->lokasi?->nama ?? null,
            username: $model->username,
            isDelete: (bool) $model->is_delete,
            createdAt: $model->created_at?->toIso8601String(),
            updatedAt: $model->updated_at?->toIso8601String(),
        );
    }
}
