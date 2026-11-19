<?php

namespace App\Modules\Admin\Data\KategoriArtikel\Infrastructure;

use App\Modules\Admin\Data\KategoriArtikel\Contracts\KategoriArtikelRepository;
use App\Modules\Admin\Data\KategoriArtikel\Domain\KategoriArtikel;
use App\Modules\Admin\Data\KategoriArtikel\Infrastructure\KategoriArtikelModel;

/**
 * Implementasi Repository untuk Kategori Artikel menggunakan Eloquent.
 */
final class EloquentKategoriArtikelRepository implements KategoriArtikelRepository
{
    public function all(): array
    {
        return KategoriArtikelModel::ordered()->get()->map(fn ($m) => $this->toDomain($m))->all();
    }

    public function find(int $id): mixed
    {
        $model = KategoriArtikelModel::find($id);
        return $model ? $this->toDomain($model) : null;
    }

    public function create(array $data): mixed
    {
        $model = KategoriArtikelModel::create($data);
        return $this->toDomain($model->fresh());
    }

    public function update(int $id, array $data): mixed
    {
        $model = KategoriArtikelModel::findOrFail($id);
        $model->update($data);
        return $this->toDomain($model->fresh());
    }

    public function delete(int $id): void
    {
        KategoriArtikelModel::findOrFail($id)->delete();
    }

    public function getAktif(): array
    {
        return KategoriArtikelModel::aktif()->ordered()->get()->map(fn ($m) => $this->toDomain($m))->all();
    }

    /**
     * Convert Eloquent Model ke Domain Entity
     */
    private function toDomain(KategoriArtikelModel $model): KategoriArtikel
    {
        return new KategoriArtikel(
            id: $model->id,
            jenisKategori: $model->jenis_kategori,
            namaKelompok: $model->nama_kelompok,
            urutan: $model->urutan,
            isDelete: $model->is_delete,
            createdAt: $model->created_at?->toIso8601String(),
            updatedAt: $model->updated_at?->toIso8601String(),
        );
    }
}
