<?php

namespace App\Modules\Admin\Data\LokasiBlc\Infrastructure;

use App\Modules\Admin\Data\LokasiBlc\Contracts\LokasiBlcRepository;
use App\Modules\Admin\Data\LokasiBlc\Domain\LokasiBlc;
use App\Modules\Admin\Data\LokasiBlc\Infrastructure\LokasiBlcModel;

/**
 * Implementasi Repository untuk Lokasi BLC menggunakan Eloquent.
 */
final class EloquentLokasiBlcRepository implements LokasiBlcRepository
{
    public function all(): array
    {
        return LokasiBlcModel::all()->map(fn ($m) => $this->toDomain($m))->all();
    }

    public function find(int $id): mixed
    {
        $model = LokasiBlcModel::find($id);
        return $model ? $this->toDomain($model) : null;
    }

    public function create(array $data): mixed
    {
        $model = LokasiBlcModel::create($data);
        return $this->toDomain($model->fresh());
    }

    public function update(int $id, array $data): mixed
    {
        $model = LokasiBlcModel::findOrFail($id);
        $model->update($data);
        return $this->toDomain($model->fresh());
    }

    public function delete(int $id): void
    {
        LokasiBlcModel::findOrFail($id)->delete();
    }

    public function getAktif(): array
    {
        return LokasiBlcModel::aktif()->get()->map(fn ($m) => $this->toDomain($m))->all();
    }

    public function getByArea(string $area): array
    {
        return LokasiBlcModel::where('area', $area)->get()->map(fn ($m) => $this->toDomain($m))->all();
    }

    /**
     * Convert Eloquent Model ke Domain Entity
     */
    private function toDomain(LokasiBlcModel $model): LokasiBlc
    {
        return new LokasiBlc(
            id: $model->id,
            namaBlc: $model->nama_blc,
            alamat: $model->alamat,
            fotoBlc: $model->foto_blc,
            foto2Blc: $model->foto2_blc,
            isDelete: $model->is_delete,
            latitude: $model->latitude,
            longitude: $model->longitude,
            area: $model->area,
            aktif: $model->aktif,
            jumlahSlotComputer: $model->jumlah_slot_computer,
            jadwalBlc: $model->jadwal_blc,
            wilayahSurabaya: $model->wilayah_surabaya,
            createdAt: $model->created_at?->toIso8601String(),
            updatedAt: $model->updated_at?->toIso8601String(),
        );
    }
}
