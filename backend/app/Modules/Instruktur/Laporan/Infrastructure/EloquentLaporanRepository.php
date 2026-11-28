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

    public function rekapPeserta(int $instrukturId, string $mulai, string $sampai): array
    {
        $kelasList = $this->kelasQuery($instrukturId)
            ->with(['materi', 'sesi', 'lokasiBlc'])
            ->whereHas('kelasPeserta', fn (Builder $query) => $query->where('is_delete', false))
            ->orderBy('nama_kelas')
            ->get();
        $kelasIds = $kelasList->pluck('id')->map(fn ($id) => (int) $id)->all();

        if ($kelasIds === []) {
            return [
                'per_sesi' => [],
                'per_kegiatan' => [],
                'ringkasan' => $this->ringkasanKosong(),
            ];
        }

        $pesertaPerKelas = [];
        foreach ($kelasIds as $kelasId) {
            $pesertaPerKelas[$kelasId] = [];
        }

        $pendaftaran = DB::table('kelas_peserta as kp')
            ->join('peserta as p', 'p.id', '=', 'kp.peserta_id')
            ->whereIn('kp.kelas_id', $kelasIds)
            ->where('kp.is_delete', false)
            ->where('p.is_delete', false)
            ->orderBy('p.nama_lengkap')
            ->get(['kp.kelas_id', 'kp.peserta_id', 'p.nama_lengkap']);

        foreach ($pendaftaran as $item) {
            $kelasId = (int) $item->kelas_id;
            $pesertaId = (int) $item->peserta_id;
            $pesertaPerKelas[$kelasId][$pesertaId] ??= [
                'peserta_id' => $pesertaId,
                'nama' => $item->nama_lengkap,
                'hadir' => 0,
                'tidak_hadir' => 0,
            ];
        }

        $absensi = DB::table('daftar_hadir as dh')
            ->join('kelas_peserta as kp', 'kp.id', '=', 'dh.kelas_peserta_id')
            ->join('peserta as p', 'p.id', '=', 'kp.peserta_id')
            ->whereIn('kp.kelas_id', $kelasIds)
            ->where('kp.is_delete', false)
            ->where('p.is_delete', false)
            ->whereBetween('dh.tgl_hadir', [$mulai, $sampai])
            ->orderBy('dh.tgl_hadir')
            ->get(['kp.kelas_id', 'kp.peserta_id', 'p.nama_lengkap', 'dh.tgl_hadir', 'dh.hadir']);

        $catatanUnik = [];
        $tanggalPerKelas = [];
        foreach ($absensi as $item) {
            $kelasId = (int) $item->kelas_id;
            $pesertaId = (int) $item->peserta_id;
            $tanggal = $item->tgl_hadir;
            $key = $kelasId.':'.$pesertaId.':'.$tanggal;
            $hadir = filter_var($item->hadir, FILTER_VALIDATE_BOOLEAN);
            $catatanUnik[$key] ??= ['kelas_id' => $kelasId, 'peserta_id' => $pesertaId, 'hadir' => false];
            $catatanUnik[$key]['hadir'] = $catatanUnik[$key]['hadir'] || $hadir;
            $tanggalPerKelas[$kelasId][$tanggal] = true;
        }

        foreach ($catatanUnik as $item) {
            $pesertaPerKelas[$item['kelas_id']][$item['peserta_id']] ??= [
                'peserta_id' => $item['peserta_id'],
                'nama' => 'Peserta',
                'hadir' => 0,
                'tidak_hadir' => 0,
            ];
            $kolom = $item['hadir'] ? 'hadir' : 'tidak_hadir';
            $pesertaPerKelas[$item['kelas_id']][$item['peserta_id']][$kolom]++;
        }

        $perKegiatan = [];
        $perSesi = [];
        $semuaPeserta = [];
        $totalHadir = 0;
        $totalTidakHadir = 0;
        $totalPertemuan = 0;

        foreach ($kelasList as $kelas) {
            $kelasId = (int) $kelas->id;
            $peserta = array_values($pesertaPerKelas[$kelasId]);
            foreach ($peserta as &$item) {
                $dicatat = $item['hadir'] + $item['tidak_hadir'];
                $item['persentase'] = $dicatat === 0 ? 0 : round(($item['hadir'] / $dicatat) * 100, 1);
                $semuaPeserta[$item['peserta_id']] = true;
            }
            unset($item);

            $hadir = array_sum(array_column($peserta, 'hadir'));
            $tidakHadir = array_sum(array_column($peserta, 'tidak_hadir'));
            $pertemuan = count($tanggalPerKelas[$kelasId] ?? []);
            $dicatat = $hadir + $tidakHadir;
            $sesiId = $kelas->sesi_id === null ? null : (int) $kelas->sesi_id;
            $kegiatan = [
                'kelas_id' => $kelasId,
                'nama_kelas' => $kelas->nama_kelas,
                'materi' => $kelas->materi?->nama_materi,
                'sesi_id' => $sesiId,
                'sesi' => $kelas->sesi?->sesi === null ? null : (int) $kelas->sesi->sesi,
                'waktu_sesi' => $kelas->sesi?->jam,
                'lokasi' => $kelas->lokasiBlc?->nama_blc,
                'hari' => preg_split('/\s+/', trim((string) $kelas->hari), -1, PREG_SPLIT_NO_EMPTY) ?: [],
                'total_peserta' => count($peserta),
                'total_pertemuan' => $pertemuan,
                'hadir' => $hadir,
                'tidak_hadir' => $tidakHadir,
                'persentase' => $dicatat === 0 ? 0 : round(($hadir / $dicatat) * 100, 1),
                'peserta' => $peserta,
            ];
            $perKegiatan[] = $kegiatan;
            $totalHadir += $hadir;
            $totalTidakHadir += $tidakHadir;
            $totalPertemuan += $pertemuan;

            $sesiKey = $sesiId === null ? 'tanpa-sesi' : (string) $sesiId;
            $perSesi[$sesiKey] ??= [
                'sesi_id' => $sesiId,
                'sesi' => $kegiatan['sesi'],
                'waktu_sesi' => $kegiatan['waktu_sesi'],
                'jumlah_kegiatan' => 0,
                'total_peserta' => 0,
                'total_pertemuan' => 0,
                'hadir' => 0,
                'tidak_hadir' => 0,
                'peserta' => [],
                'kegiatan' => [],
            ];
            $perSesi[$sesiKey]['jumlah_kegiatan']++;
            $perSesi[$sesiKey]['total_pertemuan'] += $pertemuan;
            $perSesi[$sesiKey]['hadir'] += $hadir;
            $perSesi[$sesiKey]['tidak_hadir'] += $tidakHadir;
            $perSesi[$sesiKey]['kegiatan'][] = ['kelas_id' => $kelasId, 'nama_kelas' => $kelas->nama_kelas];
            foreach ($peserta as $item) {
                $pesertaSesi = $perSesi[$sesiKey]['peserta'][$item['peserta_id']] ?? [
                    'peserta_id' => $item['peserta_id'],
                    'nama' => $item['nama'],
                    'hadir' => 0,
                    'tidak_hadir' => 0,
                ];
                $pesertaSesi['hadir'] += $item['hadir'];
                $pesertaSesi['tidak_hadir'] += $item['tidak_hadir'];
                $dicatatPeserta = $pesertaSesi['hadir'] + $pesertaSesi['tidak_hadir'];
                $pesertaSesi['persentase'] = $dicatatPeserta === 0 ? 0 : round(($pesertaSesi['hadir'] / $dicatatPeserta) * 100, 1);
                $perSesi[$sesiKey]['peserta'][$item['peserta_id']] = $pesertaSesi;
            }
        }

        $perSesi = array_values(array_map(function (array $item): array {
            $item['peserta'] = array_values($item['peserta']);
            $item['total_peserta'] = count($item['peserta']);
            $dicatat = $item['hadir'] + $item['tidak_hadir'];
            $item['persentase'] = $dicatat === 0 ? 0 : round(($item['hadir'] / $dicatat) * 100, 1);

            return $item;
        }, $perSesi));
        usort($perSesi, fn (array $a, array $b) => (($a['sesi'] ?? PHP_INT_MAX) <=> ($b['sesi'] ?? PHP_INT_MAX)));

        $totalDicatat = $totalHadir + $totalTidakHadir;

        return [
            'per_sesi' => $perSesi,
            'per_kegiatan' => $perKegiatan,
            'ringkasan' => [
                'jumlah_kegiatan' => count($perKegiatan),
                'jumlah_peserta' => count($semuaPeserta),
                'total_pertemuan' => $totalPertemuan,
                'hadir' => $totalHadir,
                'tidak_hadir' => $totalTidakHadir,
                'persentase' => $totalDicatat === 0 ? 0 : round(($totalHadir / $totalDicatat) * 100, 1),
            ],
        ];
    }

    private function ringkasanKosong(): array
    {
        return [
            'jumlah_kegiatan' => 0,
            'jumlah_peserta' => 0,
            'total_pertemuan' => 0,
            'hadir' => 0,
            'tidak_hadir' => 0,
            'persentase' => 0,
        ];
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
