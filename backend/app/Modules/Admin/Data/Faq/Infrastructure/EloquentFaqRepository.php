<?php

namespace App\Modules\Admin\Data\Faq\Infrastructure;

use App\Modules\Admin\Data\Faq\Contracts\FaqRepository;
use App\Modules\Admin\Data\Faq\Domain\Faq;
use App\Modules\Admin\Data\Faq\Infrastructure\FaqModel;

/**
 * Implementasi Repository untuk FAQ menggunakan Eloquent.
 */
final class EloquentFaqRepository implements FaqRepository
{
    public function all(): array
    {
        return FaqModel::ordered()->get()->map(fn ($m) => $this->toDomain($m))->all();
    }

    public function find(int $id): mixed
    {
        $model = FaqModel::find($id);
        return $model ? $this->toDomain($model) : null;
    }

    public function create(array $data): mixed
    {
        $model = FaqModel::create($data);
        return $this->toDomain($model->fresh());
    }

    public function update(int $id, array $data): mixed
    {
        $model = FaqModel::findOrFail($id);
        $model->update($data);
        return $this->toDomain($model->fresh());
    }

    public function delete(int $id): void
    {
        FaqModel::findOrFail($id)->delete();
    }

    public function getByKategori(int $kategoriId): array
    {
        return FaqModel::where('kategori_id', $kategoriId)->ordered()->get()->map(fn ($m) => $this->toDomain($m))->all();
    }

    public function getAktif(): array
    {
        return FaqModel::aktif()->ordered()->get()->map(fn ($m) => $this->toDomain($m))->all();
    }

    /**
     * Convert Eloquent Model ke Domain Entity
     */
    private function toDomain(FaqModel $model): Faq
    {
        return new Faq(
            id: $model->id,
            pertanyaan: $model->pertanyaan,
            jawaban: $model->jawaban,
            kategoriId: $model->kategori_id,
            urutan: $model->urutan,
            isAktif: $model->is_aktif,
            createdAt: $model->created_at?->toIso8601String(),
            updatedAt: $model->updated_at?->toIso8601String(),
        );
    }
}
