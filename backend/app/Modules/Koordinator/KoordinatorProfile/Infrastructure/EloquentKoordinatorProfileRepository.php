<?php

namespace App\Modules\Koordinator\KoordinatorProfile\Infrastructure;

use App\Modules\Koordinator\KoordinatorProfile\Contracts\KoordinatorProfileRepositoryInterface;
use App\Modules\Koordinator\KoordinatorProfile\Domain\ValueObjects\KoordinatorProfileId;
use App\Modules\Koordinator\KoordinatorProfile\Domain\ValueObjects\PenggunaId;
use Illuminate\Support\Collection;
use Illuminate\Database\Eloquent\Builder;
use Carbon\Carbon;

class EloquentKoordinatorProfileRepository implements KoordinatorProfileRepositoryInterface
{
    public function all(): array
    {
        return $this->model()->all()->map(fn ($m) => $this->toDomain($m))->all();
    }

    public function find(int $id): ?KoordinatorProfile
    {
        $model = $this->model()->find($id);
        return $model ? $this->toDomain($model) : null;
    }

    public function create(array $data): KoordinatorProfile
    {
        $model = $this->model()->create($data);
        return $this->toDomain($model);
    }

    public function update(int $id, array $data): KoordinatorProfile
    {
        $model = $this->model()->findOrFail($id);
        $model->update($data);
        return $this->toDomain($model);
    }

    public function delete(int $id): void
    {
        $this->model()->findOrFail($id)->delete();
    }

    public function findByPenggunaId(string $penggunaId): ?KoordinatorProfile
    {
        $model = $this->model()->where('pengguna_id', $penggunaId)->first();
        return $model ? $this->toDomain($model) : null;
    }

    public function findByKantorKuUserId(string $kantorKuUserId): ?KoordinatorProfile
    {
        $model = $this->model()->where('kantor_ku_user_id', $kantorKuUserId)->first();
        return $model ? $this->toDomain($model) : null;
    }

    public function getByLokasiBlcId(string $lokasiBlcId): array
    {
        return $this->model()->whereJsonContains('lokasi_blc_ids', $lokasiBlcId)
            ->get()
            ->map(fn ($m) => $this->toDomain($m))
            ->all();
    }

    private function model(): Builder
    {
        return KoordinatorProfileModel::query();
    }

    private function toDomain(KoordinatorProfileModel $model): KoordinatorProfile
    {
        return new KoordinatorProfile(
            new KoordinatorProfileId((string) $model->id),
            new PenggunaId((string) $model->pengguna_id),
            $model->kantor_ku_user_id,
            $model->lokasi_blc_ids,
            $model->nip,
            $model->bidang_keahlian,
            (bool) $model->is_aktif,
            $model->created_at instanceof Carbon ? $model->created_at : Carbon::parse($model->created_at),
            $model->updated_at instanceof Carbon ? $model->updated_at : Carbon::parse($model->updated_at)
        );
    }
}