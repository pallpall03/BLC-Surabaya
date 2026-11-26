<?php

namespace App\Modules\Admin\Data\Testimoni\Infrastructure;

use App\Modules\Admin\Data\Testimoni\Contracts\TestimoniRepository;
use App\Modules\Admin\Data\Testimoni\Domain\Testimoni;

/** Implementasi Repository untuk Testimoni menggunakan Eloquent. */
final class EloquentTestimoniRepository implements TestimoniRepository
{
    /** Semua status (dipakai panel admin). */
    public function all(): array
    {
        return $this->map(TestimoniModel::latest()->get());
    }

    public function find(int $id): mixed
    {
        $model = TestimoniModel::find($id);
        return $model ? $this->toDomain($model) : null;
    }

    public function create(array $data): mixed
    {
        $model = TestimoniModel::create($data);
        return $this->toDomain($model->fresh());
    }

    public function update(int $id, array $data): mixed
    {
        $model = TestimoniModel::findOrFail($id);
        $model->update($data);
        return $this->toDomain($model->fresh());
    }

    public function delete(int $id): void
    {
        TestimoniModel::findOrFail($id)->delete();
    }

    public function getByLokasi(int $lokasiBlcId): array
    {
        return $this->map(
            TestimoniModel::tampil()->where('lokasi_blc_id', $lokasiBlcId)->latest()->get()
        );
    }

    public function getByStatus(string $status): array
    {
        return $this->map(TestimoniModel::where('status', $status)->latest()->get());
    }

    public function getTampil(): array
    {
        return $this->map(TestimoniModel::tampil()->latest()->get());
    }

    public function getLatest(int $limit = 10): array
    {
        return $this->map(TestimoniModel::tampil()->latest()->limit($limit)->get());
    }

    private function map($models): array
    {
        return $models->map(fn ($m) => $this->toDomain($m))->all();
    }

    /** Convert Eloquent Model ke Domain Entity */
    private function toDomain(TestimoniModel $model): Testimoni
    {
        return new Testimoni(
            id: $model->id,
            nama: $model->nama,
            phone: $model->phone,
            email: $model->email,
            kategoriId: $model->kategori_id,
            lokasiBlcId: $model->lokasi_blc_id,
            isiTestimoni: $model->isi_testimoni,
            rating: $model->rating,
            status: $model->status ?? TestimoniModel::PENDING,
            createdAt: $model->created_at?->toIso8601String(),
            updatedAt: $model->updated_at?->toIso8601String(),
        );
    }
}