<?php

namespace App\Modules\Instruktur\InstrukturProfile\Infrastructure;

use App\Modules\Instruktur\InstrukturProfile\Contracts\InstrukturProfileRepository;
use App\Modules\Instruktur\InstrukturProfile\Domain\InstrukturProfile;
use App\Modules\Instruktur\InstrukturProfile\Domain\ValueObjects\InstrukturProfileId;
use App\Modules\Instruktur\InstrukturProfile\Domain\ValueObjects\PenggunaId;
use App\Modules\Instruktur\InstrukturProfile\Domain\ValueObjects\LokasiBlcId;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;

final class EloquentInstrukturProfileRepository implements InstrukturProfileRepository
{
    public function all(): array
    {
        return $this->model()->all()->map(fn ($m) => $this->toDomain($m))->all();
    }

    public function find(int $id): ?InstrukturProfile
    {
        $model = $this->model()->find($id);
        return $model ? $this->toDomain($model) : null;
    }

    public function create(array $data): InstrukturProfile
    {
        $model = $this->model()->create($data);
        return $this->toDomain($model);
    }

    public function update(int $id, array $data): InstrukturProfile
    {
        $model = $this->model()->findOrFail($id);
        $model->update($data);
        return $this->toDomain($model);
    }

    public function delete(int $id): void
    {
        $this->model()->findOrFail($id)->delete();
    }

    public function findByPenggunaId(string $penggunaId): ?InstrukturProfile
    {
        $model = $this->model()->where('pengguna_id', $penggunaId)->first();
        return $model ? $this->toDomain($model) : null;
    }

    public function findByKantorKuUserId(string $kantorKuUserId): ?InstrukturProfile
    {
        $model = $this->model()->where('kantor_ku_user_id', $kantorKuUserId)->first();
        return $model ? $this->toDomain($model) : null;
    }

    public function getByLokasiBlcId(string $lokasiBlcId): array
    {
        return $this->model()->where('lokasi_blc_id', $lokasiBlcId)
            ->get()
            ->map(fn ($m) => $this->toDomain($m))
            ->all();
    }

    private function model(): \Illuminate\Database\Eloquent\Builder
    {
        return InstrukturProfileModel::query();
    }

    private function toDomain(InstrukturProfileModel $model): InstrukturProfile
    {
        return new InstrukturProfile(
            new InstrukturProfileId((string) $model->id),
            new PenggunaId((string) $model->pengguna_id),
            $model->kantor_ku_user_id,
            $model->lokasi_blc_id ? new LokasiBlcId((string) $model->lokasi_blc_id) : null,
            $model->nip,
            $model->bidang_keahlian,
            $model->riwayat_pendidikan,
            $model->riwayat_pelatihan,
            (bool) $model->is_aktif,
            $model->created_at instanceof Carbon ? $model->created_at : Carbon::parse($model->created_at),
            $model->updated_at instanceof Carbon ? $model->updated_at : Carbon::parse($model->updated_at)
        );
    }
}