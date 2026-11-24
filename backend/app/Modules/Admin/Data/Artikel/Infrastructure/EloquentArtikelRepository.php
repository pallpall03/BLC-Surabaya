<?php

namespace App\Modules\Admin\Data\Artikel\Infrastructure;

use App\Modules\Admin\Data\Artikel\Contracts\ArtikelRepository;
use App\Modules\Admin\Data\Artikel\Domain\Artikel;
use App\Modules\Admin\Data\Artikel\Domain\ArtikelFoto;
use App\Modules\Admin\Data\Artikel\Infrastructure\ArtikelModel;
use App\Modules\Admin\Data\Artikel\Infrastructure\ArtikelFotoModel;

/** Implementasi Repository untuk Artikel menggunakan Eloquent. */
final class EloquentArtikelRepository implements ArtikelRepository
{
    public function all(): array
    {
        return ArtikelModel::aktif()->latest()->get()->map(fn ($m) => $this->toDomain($m))->all();
    }

    public function find(int $id): mixed
    {
        $model = ArtikelModel::aktif()->find($id);
        return $model ? $this->toDomain($model) : null;
    }

    public function create(array $data): mixed
    {
        $model = ArtikelModel::create($data);
        return $this->toDomain($model->fresh());
    }

    public function update(int $id, array $data): mixed
    {
        $model = ArtikelModel::findOrFail($id);
        $model->update($data);
        return $this->toDomain($model->fresh());
    }

    public function delete(int $id): void
    {
        ArtikelModel::findOrFail($id)->delete();
    }

    public function getByKategori(int $kategoriArtikelId): array
    {
        return ArtikelModel::aktif()->where('kategori_artikel_id', $kategoriArtikelId)
            ->latest()
            ->get()
            ->map(fn ($m) => $this->toDomain($m))
            ->all();
    }

    public function getLatest(int $limit = 10): array
    {
        return ArtikelModel::aktif()->latest()->limit($limit)
            ->get()
            ->map(fn ($m) => $this->toDomain($m))
            ->all();
    }

    public function getArtikelWithFotos(int $id): mixed
    {
        $model = ArtikelModel::with('fotos')->aktif()->find($id);
        if (!$model) {
            return null;
        }

        $artikel = $this->toDomain($model);
        $fotos = $model->fotos->map(fn ($f) => new ArtikelFoto(
            id: $f->id,
            artikelId: $f->artikel_id,
            foto: $f->foto,
            createdAt: $f->created_at?->toIso8601String(),
            updatedAt: $f->updated_at?->toIso8601String(),
        ))->all();

        return ['artikel' => $artikel, 'fotos' => $fotos];
    }

    /** Convert Eloquent Model ke Domain Entity */
    private function toDomain(ArtikelModel $model): Artikel
    {
        return new Artikel(
            id: $model->id,
            kategoriArtikelId: $model->kategori_artikel_id,
            judul: $model->judul,
            slug: $model->slug,
            keterangan: $model->keterangan ?? '',
            konten: $model->konten,
            ringkasan: $model->ringkasan,
            gambarUtama: $model->gambar_utama,
            penulis: $model->penulis,
            tanggalPublikasi: $model->tanggal_publikasi?->toIso8601String(),
            isAktif: $model->is_aktif,
            lokasi: $model->lokasi,
            createdBy: $model->created_by,
            sesiId: $model->sesi_id,
            isDelete: $model->is_delete,
            createdAt: $model->created_at?->toIso8601String(),
            updatedAt: $model->updated_at?->toIso8601String(),
        );
    }

    public function getAktif(): array
    {
        return ArtikelModel::aktif()->latest()->get()->map(fn ($m) => $this->toDomain($m))->all();
    }
}
