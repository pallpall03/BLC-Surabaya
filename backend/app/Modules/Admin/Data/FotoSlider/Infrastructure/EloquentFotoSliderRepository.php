<?php

namespace App\Modules\Admin\Data\FotoSlider\Infrastructure;

use App\Modules\Admin\Data\FotoSlider\Contracts\FotoSliderRepository;
use App\Modules\Admin\Data\FotoSlider\Domain\FotoSlider;
use App\Modules\Admin\Data\FotoSlider\Infrastructure\FotoSliderModel;

/**
 * Implementasi Repository untuk Foto Slider menggunakan Eloquent.
 */
final class EloquentFotoSliderRepository implements FotoSliderRepository
{
    public function all(): array
    {
        return FotoSliderModel::ordered()->get()->map(fn ($m) => $this->toDomain($m))->all();
    }

    public function find(int $id): mixed
    {
        $model = FotoSliderModel::find($id);
        return $model ? $this->toDomain($model) : null;
    }

    public function create(array $data): mixed
    {
        $model = FotoSliderModel::create($data);
        return $this->toDomain($model->fresh());
    }

    public function update(int $id, array $data): mixed
    {
        $model = FotoSliderModel::findOrFail($id);
        $model->update($data);
        return $this->toDomain($model->fresh());
    }

    public function delete(int $id): void
    {
        FotoSliderModel::findOrFail($id)->delete();
    }

    public function getByTipe(string $tipe): array
    {
        return FotoSliderModel::tipe($tipe)->ordered()->get()->map(fn ($m) => $this->toDomain($m))->all();
    }

    public function getAktif(): array
    {
        return FotoSliderModel::aktif()->ordered()->get()->map(fn ($m) => $this->toDomain($m))->all();
    }

    public function getByStatus(string $status): array
    {
        return FotoSliderModel::where('status', $status)->ordered()->get()->map(fn ($m) => $this->toDomain($m))->all();
    }

    /**
     * Convert Eloquent Model ke Domain Entity
     */
    private function toDomain(FotoSliderModel $model): FotoSlider
    {
        return new FotoSlider(
            id: $model->id,
            fileBrosur: $model->file_brosur,
            ketBrosur: $model->ket_brosur,
            tgl: $model->tgl?->toIso8601String(),
            tipe: $model->tipe,
            status: $model->status,
            urutan: $model->urutan,
            createdAt: $model->created_at?->toIso8601String(),
            updatedAt: $model->updated_at?->toIso8601String(),
        );
    }
}
