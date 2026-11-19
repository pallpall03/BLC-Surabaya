<?php

namespace App\Modules\Koordinator\MasterData\Infrastructure;

use App\Modules\Koordinator\MasterData\Contracts\MasterDataRepositoryInterface;
use App\Modules\Koordinator\MasterData\Domain\MasterData;
use App\Modules\Koordinator\MasterData\Domain\ValueObjects\MasterDataId;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;

class MasterDataEloquentModel implements MasterDataRepositoryInterface
{
    public function all(): array
    {
        return $this->model()->get()->map(fn ($m) => $this->toDomain($m))->all();
    }

    public function find(string $namaModul): ?MasterData
    {
        $model = $this->model()->where('nama_modul', $namaModul)->first();
        return $model ? $this->toDomain($model) : null;
    }

    public function create(array $data): MasterData
    {
        $model = $this->model()->create($data);
        return $this->toDomain($model);
    }

    public function update(string $namaModul, array $data): MasterData
    {
        $model = $this->model()->where('nama_modul', $namaModul)->firstOrFail();
        $model->update($data);
        return $this->toDomain($model);
    }

    public function delete(string $namaModul): void
    {
        $this->model()->where('nama_modul', $namaModul)->firstOrFail()->delete();
    }

    private function model(): \Illuminate\Database\Eloquent\Model
    {
        return \App\Modules\Koordinator\MasterData\Infrastructure\MasterDataEloquentModel::class;
    }

    private function toDomain(MasterDataEloquentModel $model): MasterData
    {
        return new MasterData(
            new MasterDataId((string) $model->id),
            $model->nama_modul,
            $model->nama_tampil,
            $model->deskripsi,
            (bool) $model->is_aktif,
            $model->created_at instanceof \Carbon\Carbon ? $model->created_at : \Carbon\Carbon::parse($model->created_at),
            $model->updated_at instanceof \Carbon\Carbon ? $model->updated_at : \Carbon\Carbon::parse($model->updated_at)
        );
    }
}