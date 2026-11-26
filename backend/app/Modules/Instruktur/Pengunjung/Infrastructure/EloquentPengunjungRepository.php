<?php

namespace App\Modules\Instruktur\Pengunjung\Infrastructure;

use App\Modules\Admin\Data\BukuTamu\Infrastructure\BukuTamuModel;
use App\Modules\Instruktur\Pengunjung\Contracts\PengunjungRepository;
use App\Shared\Support\PengunjungSupport;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Carbon;

final class EloquentPengunjungRepository implements PengunjungRepository
{
    public function opsi(): array
    {
        return PengunjungSupport::opsi();
    }

    public function daftar(array $filter): array
    {
        $query = $this->query();

        if (! empty($filter['mulai'])) {
            $query->whereRaw('DATE(COALESCE(tanggal_kunjungan, created_at)) >= ?', [Carbon::parse($filter['mulai'])->toDateString()]);
        }

        if (! empty($filter['sampai'])) {
            $query->whereRaw('DATE(COALESCE(tanggal_kunjungan, created_at)) <= ?', [Carbon::parse($filter['sampai'])->toDateString()]);
        }

        if (! empty($filter['lokasi_blc_id'])) {
            $query->where('lokasi_blc_id', $filter['lokasi_blc_id']);
        }

        if (! empty($filter['sesi_id'])) {
            $query->where('sesi_id', $filter['sesi_id']);
        }

        if (! empty($filter['q'])) {
            $q = $filter['q'];
            $query->where(function (Builder $builder) use ($q): void {
                $builder->where('nama', 'like', '%'.$q.'%')
                    ->orWhere('instansi', 'like', '%'.$q.'%')
                    ->orWhere('email', 'like', '%'.$q.'%')
                    ->orWhere('telepon', 'like', '%'.$q.'%')
                    ->orWhere('alamat', 'like', '%'.$q.'%');
            });
        }

        return $query->orderByDesc('created_at')
            ->orderByDesc('id')
            ->get()
            ->map(fn (BukuTamuModel $model) => PengunjungSerializer::toArray($model))
            ->all();
    }

    public function temukan(int $id): array
    {
        return PengunjungSerializer::toArray($this->query()->findOrFail($id));
    }

    public function buat(array $data): array
    {
        $model = BukuTamuModel::create($data);
        $model->load(['blc', 'sesi']);

        return PengunjungSerializer::toArray($model);
    }

    public function ubah(int $id, array $data): array
    {
        $model = $this->query()->findOrFail($id);
        $model->updateOrFail($data);
        $model->load(['blc', 'sesi']);

        return PengunjungSerializer::toArray($model);
    }

    public function hapus(int $id): void
    {
        $this->query()->findOrFail($id)->updateOrFail(['is_delete' => true]);
    }

    private function query(): Builder
    {
        return BukuTamuModel::query()
            ->notDeleted()
            ->with(['blc', 'sesi']);
    }
}
