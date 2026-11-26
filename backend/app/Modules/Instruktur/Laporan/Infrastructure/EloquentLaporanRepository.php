<?php

namespace App\Modules\Instruktur\Laporan\Infrastructure;

use App\Modules\Admin\Data\TimBlc\Infrastructure\TimBlcModel;
use App\Modules\Instruktur\DaftarHadir\Infrastructure\KelasModel;
use App\Modules\Instruktur\DaftarHadir\Infrastructure\KelasPesertaModel;
use App\Modules\Instruktur\Laporan\Contracts\LaporanRepository;
use App\Modules\Instruktur\Laporan\Domain\Laporan;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

final class EloquentLaporanRepository implements LaporanRepository
{
    public function resolveInstrukturId(string $userId): ?int
    {
        $id = TimBlcModel::query()
            ->where('user_id', $userId)
            ->where('role', 'instruktur')
            ->where('is_delete', false)
            ->orderBy('id')
            ->value('id');

        return $id === null ? null : (int) $id;
    }

    public function listForInstruktur(int $instrukturId, string $mulai, string $sampai): array
    {
        return $this->query($instrukturId)
            ->whereBetween('tanggal', [$mulai, $sampai])
            ->orderByDesc('tanggal')
            ->orderByDesc('id')
            ->get()
            ->map(fn (LaporanHarianModel $model) => $model->toDomain())
            ->all();
    }

    public function findForInstruktur(int $instrukturId, int $id): ?Laporan
    {
        return $this->query($instrukturId)->find($id)?->toDomain();
    }

    public function createForInstruktur(int $instrukturId, array $data): Laporan
    {
        return DB::transaction(function () use ($instrukturId, $data): Laporan {
            $attributes = $this->attributesForInstruktur($instrukturId, $data);
            $model = LaporanHarianModel::create($attributes);
            $model->load(['kelas.materi']);

            return $model->toDomain();
        });
    }

    public function updateForInstruktur(int $instrukturId, int $id, array $data): ?Laporan
    {
        return DB::transaction(function () use ($instrukturId, $id, $data): ?Laporan {
            $model = $this->query($instrukturId)->lockForUpdate()->find($id);
            if ($model === null) {
                return null;
            }

            $attributes = $this->attributesForInstruktur($instrukturId, $data, $model);
            $model->updateOrFail($attributes);
            $model->load(['kelas.materi']);

            return $model->toDomain();
        });
    }

    public function deleteForInstruktur(int $instrukturId, int $id): bool
    {
        return DB::transaction(function () use ($instrukturId, $id): bool {
            $model = $this->query($instrukturId)->lockForUpdate()->find($id);
            if ($model === null) {
                return false;
            }

            $model->delete();

            return true;
        });
    }

    public function opsiKelas(int $instrukturId): array
    {
        $kelas = $this->kelasQuery($instrukturId)
            ->with('materi')
            ->withCount(['kelasPeserta as jumlah_peserta' => fn (Builder $query) => $query->where('is_delete', false)])
            ->orderBy('nama_kelas')
            ->orderBy('id')
            ->get()
            ->map(fn (KelasModel $model) => [
                'id' => (int) $model->id,
                'nama_kelas' => $model->nama_kelas,
                'materi' => $model->materi?->nama_materi,
                'materi_id' => $model->materi_id,
                'jumlah_peserta' => (int) $model->jumlah_peserta,
            ])
            ->all();

        return ['kelas' => $kelas];
    }

    public function all(): array
    {
        return $this->query($this->currentInstrukturId())
            ->orderByDesc('tanggal')
            ->orderByDesc('id')
            ->get()
            ->map(fn (LaporanHarianModel $model) => $model->toDomain())
            ->all();
    }

    public function find(int $id): mixed
    {
        return $this->findForInstruktur($this->currentInstrukturId(), $id);
    }

    public function create(array $data): mixed
    {
        return $this->createForInstruktur($this->currentInstrukturId(), $data);
    }

    public function update(int $id, array $data): mixed
    {
        $laporan = $this->updateForInstruktur($this->currentInstrukturId(), $id, $data);
        if ($laporan === null) {
            throw (new ModelNotFoundException)->setModel(LaporanHarianModel::class, [$id]);
        }

        return $laporan;
    }

    public function delete(int $id): void
    {
        if (! $this->deleteForInstruktur($this->currentInstrukturId(), $id)) {
            throw (new ModelNotFoundException)->setModel(LaporanHarianModel::class, [$id]);
        }
    }

    private function query(int $instrukturId): Builder
    {
        return LaporanHarianModel::query()
            ->where('instruktur_id', $instrukturId)
            ->with(['kelas.materi']);
    }

    private function kelasQuery(int $instrukturId): Builder
    {
        return KelasModel::query()
            ->where('instruktur_id', $instrukturId)
            ->where('is_delete', false);
    }

    private function attributesForInstruktur(int $instrukturId, array $data, ?LaporanHarianModel $model = null): array
    {
        $kelasId = array_key_exists('kelas_id', $data)
            ? ($data['kelas_id'] === null ? null : (int) $data['kelas_id'])
            : $model?->kelas_id;

        $tanggal = array_key_exists('tanggal', $data)
            ? Carbon::parse($data['tanggal'])->toDateString()
            : $model?->tanggal?->toDateString();
        $hadir = 0;
        $jumlah = 0;
        if ($kelasId !== null) {
            $kelas = $this->kelasQuery($instrukturId)->lockForUpdate()->find($kelasId);
            if ($kelas === null) {
                throw ValidationException::withMessages([
                    'kelas_id' => 'Kelas tidak ditemukan atau bukan milik instruktur ini.',
                ]);
            }

            $pesertaQuery = KelasPesertaModel::query()
                ->where('kelas_id', $kelasId)
                ->where('is_delete', false);
            $jumlah = $pesertaQuery->count();
            if ($tanggal !== null) {
                $hadir = DB::table('daftar_hadir')
                    ->join('kelas_peserta', 'kelas_peserta.id', '=', 'daftar_hadir.kelas_peserta_id')
                    ->where('kelas_peserta.kelas_id', $kelasId)
                    ->where('kelas_peserta.is_delete', false)
                    ->whereDate('daftar_hadir.tgl_hadir', $tanggal)
                    ->where('daftar_hadir.hadir', true)
                    ->count();
            }
        }

        $attributes = [
            'instruktur_id' => $instrukturId,
            'kelas_id' => $kelasId,
            'hadir' => $hadir,
            'total' => $jumlah,
        ];

        if ($tanggal !== null) {
            $attributes['tanggal'] = $tanggal;
        }

        if (array_key_exists('aktivitas', $data)) {
            $attributes['aktivitas'] = $data['aktivitas'];
        }
        if (array_key_exists('foto', $data)) {
            $attributes['foto'] = $data['foto'];
            $attributes['foto_deskripsi'] = $data['foto_deskripsi'];
        }

        return $attributes;
    }

    private function currentInstrukturId(): int
    {
        $userId = Auth::id();
        $instrukturId = $userId === null ? null : $this->resolveInstrukturId((string) $userId);
        if ($instrukturId === null) {
            throw new AuthorizationException('Akun instruktur ini tidak memiliki data tim BLC aktif.');
        }

        return $instrukturId;
    }
}
