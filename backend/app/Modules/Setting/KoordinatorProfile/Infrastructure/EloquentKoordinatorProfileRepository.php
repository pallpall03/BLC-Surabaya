<?php

namespace App\Modules\Setting\KoordinatorProfile\Infrastructure;

use App\Modules\Setting\KoordinatorProfile\Contracts\KoordinatorProfileRepository;
use App\Modules\Setting\KoordinatorProfile\Domain\KoordinatorProfile;
use App\Modules\Setting\KoordinatorProfile\Infrastructure\KoordinatorProfileModel;

final class EloquentKoordinatorProfileRepository implements KoordinatorProfileRepository
{
    public function all(): array
    {
        return KoordinatorProfileModel::aktif()->get()->map(fn ($m) => $this->toDomain($m))->all();
    }

    public function find(int $id): mixed
    {
        $model = KoordinatorProfileModel::with('pengguna')->find($id);
        return $model ? $this->toDomain($model) : null;
    }

    public function findByPengguna(int $penggunaId): mixed
    {
        $model = KoordinatorProfileModel::where('pengguna_id', $penggunaId)->first();
        return $model ? $this->toDomain($model) : null;
    }

    public function findByLokasiBlc(int $lokasiBlcId): array
    {
        return KoordinatorProfileModel::byLokasiBlc($lokasiBlcId)->aktif()->get()->map(fn ($m) => $this->toDomain($m))->all();
    }

    public function findByKantorKuUserId(string $kantorKuUserId): mixed
    {
        $model = KoordinatorProfileModel::byKantorKuUserId($kantorKuUserId)->first();
        return $model ? $this->toDomain($model) : null;
    }

    public function findAktif(): array
    {
        return KoordinatorProfileModel::aktif()->get()->map(fn ($m) => $this->toDomain($m))->all();
    }

    public function create(array $data): mixed
    {
        $model = KoordinatorProfileModel::create($data);
        return $this->toDomain($model->fresh());
    }

    public function update(int $id, array $data): mixed
    {
        $model = KoordinatorProfileModel::findOrFail($id);
        $model->update($data);
        return $this->toDomain($model->fresh());
    }

    public function delete(int $id): void
    {
        KoordinatorProfileModel::findOrFail($id)->delete();
    }

    private function toDomain(KoordinatorProfileModel $model): KoordinatorProfile
    {
        return new KoordinatorProfile(
            id: $model->id,
            penggunaId: $model->pengguna_id,
            nip: $model->nip,
            nik: $model->nik,
            lokasiBlcIds: $model->lokasi_blc_ids ?? [],
            jabatan: $model->jabatan,
            bidangKoordinasi: $model->bidang_koordinasi,
            tglBergabung: $model->tgl_bergabung,
            status: $model->status,
            kantorKuUserId: $model->kantor_ku_user_id,
            createdAt: $model->created_at?->toIso8601String(),
            updatedAt: $model->updated_at?->toIso8601String(),
        );
    }
}