<?php

namespace App\Modules\Setting\InstrukturProfile\Infrastructure;

use App\Modules\Setting\InstrukturProfile\Contracts\InstrukturProfileRepository;
use App\Modules\Setting\InstrukturProfile\Domain\InstrukturProfile;
use App\Modules\Setting\InstrukturProfile\Infrastructure\InstrukturProfileModel;

final class EloquentInstrukturProfileRepository implements InstrukturProfileRepository
{
    public function all(): array
    {
        return InstrukturProfileModel::aktif()->get()->map(fn ($m) => $this->toDomain($m))->all();
    }

    public function find(int $id): mixed
    {
        $model = InstrukturProfileModel::with(['pengguna', 'lokasiBlc'])->find($id);
        return $model ? $this->toDomain($model) : null;
    }

    public function findByPengguna(int $penggunaId): mixed
    {
        $model = InstrukturProfileModel::where('pengguna_id', $penggunaId)->first();
        return $model ? $this->toDomain($model) : null;
    }

    public function findByLokasiBlc(int $lokasiBlcId): array
    {
        return InstrukturProfileModel::byLokasiBlc($lokasiBlcId)->aktif()->get()->map(fn ($m) => $this->toDomain($m))->all();
    }

    public function findByKantorKuUserId(string $kantorKuUserId): mixed
    {
        $model = InstrukturProfileModel::byKantorKuUserId($kantorKuUserId)->first();
        return $model ? $this->toDomain($model) : null;
    }

    public function findAktifByLokasiBlc(int $lokasiBlcId): array
    {
        return InstrukturProfileModel::byLokasiBlc($lokasiBlcId)->aktif()->get()->map(fn ($m) => $this->toDomain($m))->all();
    }

    public function create(array $data): mixed
    {
        $model = InstrukturProfileModel::create($data);
        return $this->toDomain($model->fresh());
    }

    public function update(int $id, array $data): mixed
    {
        $model = InstrukturProfileModel::findOrFail($id);
        $model->update($data);
        return $this->toDomain($model->fresh());
    }

    public function delete(int $id): void
    {
        InstrukturProfileModel::findOrFail($id)->delete();
    }

    private function toDomain(InstrukturProfileModel $model): InstrukturProfile
    {
        return new InstrukturProfile(
            id: $model->id,
            penggunaId: $model->pengguna_id,
            nip: $model->nip,
            nik: $model->nik,
            lokasiBlcId: $model->lokasi_blc_id,
            jabatan: $model->jabatan,
            bidangKeahlian: $model->bidang_keahlian,
            pendidikanTerakhir: $model->pendidikan_terakhir,
            noSertifikat: $model->no_sertifikat,
            tglBergabung: $model->tgl_bergabung,
            status: $model->status,
            kantorKuUserId: $model->kantor_ku_user_id,
            createdAt: $model->created_at?->toIso8601String(),
            updatedAt: $model->updated_at?->toIso8601String(),
        );
    }
}