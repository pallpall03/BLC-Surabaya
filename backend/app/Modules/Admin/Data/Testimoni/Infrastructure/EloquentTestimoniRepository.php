<?php

namespace App\Modules\Admin\Data\Testimoni\Infrastructure;

use App\Modules\Admin\Data\Testimoni\Contracts\TestimoniRepository;
use App\Modules\Admin\Data\Testimoni\Domain\Testimoni;
use App\Modules\Admin\Data\Testimoni\Infrastructure\TestimoniModel;

/** Implementasi Repository untuk Testimoni menggunakan Eloquent. */
final class EloquentTestimoniRepository implements TestimoniRepository
{
    public function all(): array
    {
        return TestimoniModel::with('lokasi')->latest()->get()->map(fn ($m) => $this->toDomain($m))->all();
    }

    public function find(int $id): mixed
    {
        $model = TestimoniModel::with('lokasi')->find($id);
        return $model ? $this->toDomain($model) : null;
    }

    public function create(array $data): mixed
    {
        $model = TestimoniModel::create($data);
        return $this->toDomain($model->load('lokasi'));
    }

    public function update(int $id, array $data): mixed
    {
        $model = TestimoniModel::findOrFail($id);
        $model->update($data);
        return $this->toDomain($model->fresh('lokasi'));
    }

    public function delete(int $id): void
    {
        TestimoniModel::findOrFail($id)->delete();
    }

    public function getByLokasi(int $lokasiBlcId): array
    {
        return TestimoniModel::aktif()->with('lokasi')->where('lokasi_blc_id', $lokasiBlcId)
            ->latest()
            ->get()
            ->map(fn ($m) => $this->toDomain($m))
            ->all();
    }

    public function getSurabaya(): array
    {
        return TestimoniModel::aktif()->with('lokasi')->latest()->get()->map(fn ($m) => $this->toDomain($m))->all();
    }

    public function getLatest(int $limit = 10): array
    {
        return TestimoniModel::aktif()->with('lokasi')->latest()->limit($limit)->get()->map(fn ($m) => $this->toDomain($m))->all();
    }

    public function getAktif(): array
    {
        return TestimoniModel::aktif()->with('lokasi')->latest()->get()->map(fn ($m) => $this->toDomain($m))->all();
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
            namaLokasi: $model->lokasi?->nama_blc,
            isiTestimoni: $model->isi_testimoni,
            rating: $model->rating ? (int) $model->rating : null,
            status: $model->status ?? 'pending',
            createdAt: $model->created_at?->toIso8601String(),
            updatedAt: $model->updated_at?->toIso8601String()
        );
    }
}
