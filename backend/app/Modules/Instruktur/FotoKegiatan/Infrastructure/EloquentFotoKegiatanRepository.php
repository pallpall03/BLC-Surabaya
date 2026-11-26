<?php

namespace App\Modules\Instruktur\FotoKegiatan\Infrastructure;

use App\Modules\Instruktur\FotoKegiatan\Contracts\FotoKegiatanRepository;
use App\Shared\Support\PengunjungSupport;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

final class EloquentFotoKegiatanRepository implements FotoKegiatanRepository
{
    public function opsi(): array
    {
        $opsi = PengunjungSupport::opsi();

        return [
            'blc' => $opsi['blc'],
            'sesi' => $opsi['sesi'],
        ];
    }

    public function daftar(array $filter): array
    {
        $query = $this->query();

        if (! empty($filter['mulai'])) {
            $query->whereDate('tanggal', '>=', Carbon::parse($filter['mulai'])->toDateString());
        }

        if (! empty($filter['sampai'])) {
            $query->whereDate('tanggal', '<=', Carbon::parse($filter['sampai'])->toDateString());
        }

        if (! empty($filter['lokasi_blc_id'])) {
            $query->where('lokasi_blc_id', $filter['lokasi_blc_id']);
        }

        if (! empty($filter['sesi_id'])) {
            $query->where('sesi_id', $filter['sesi_id']);
        }

        return $query->orderByDesc('tanggal')
            ->orderByDesc('id')
            ->get()
            ->map(fn (FotoKegiatanPengunjungModel $model) => FotoKegiatanPengunjungSerializer::toArray($model))
            ->all();
    }

    public function temukan(int $id): array
    {
        return FotoKegiatanPengunjungSerializer::toArray($this->query()->findOrFail($id));
    }

    public function sudahAda(string $tanggal, int $sesiId, int $lokasiBlcId, ?int $ignoreId = null): bool
    {
        $query = FotoKegiatanPengunjungModel::query()
            ->notDeleted()
            ->where('tanggal', $tanggal)
            ->where('sesi_id', $sesiId)
            ->where('lokasi_blc_id', $lokasiBlcId);

        if ($ignoreId !== null) {
            $query->whereKeyNot($ignoreId);
        }

        return $query->exists();
    }

    public function simpan(?int $id, array $data, int $userId): array
    {
        $saved = DB::transaction(function () use ($id, $data, $userId): FotoKegiatanPengunjungModel {
            if ($id !== null) {
                $model = $this->query()->findOrFail($id);
                $model->updateOrFail($data);

                return $model;
            }

            $data['created_by'] = $userId;

            return FotoKegiatanPengunjungModel::create($data);
        });

        $saved->load(['blc', 'sesi']);

        return FotoKegiatanPengunjungSerializer::toArray($saved);
    }

    public function hapus(int $id): array
    {
        $model = $this->query()->findOrFail($id);
        $foto = $model->foto ?? [];

        $model->updateOrFail(['is_delete' => true]);

        return is_array($foto) ? array_values($foto) : [];
    }

    private function query(): Builder
    {
        return FotoKegiatanPengunjungModel::query()
            ->notDeleted()
            ->with(['blc', 'sesi']);
    }
}
