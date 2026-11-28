<?php

namespace App\Modules\Instruktur\DaftarHadir\Infrastructure;

use App\Modules\Admin\Data\LokasiBlc\Infrastructure\LokasiBlcModel;
use App\Modules\Admin\Data\TimBlc\Infrastructure\TimBlcModel;
use App\Modules\Instruktur\DaftarHadir\Contracts\DaftarHadirRepository;
use Illuminate\Database\Eloquent\Builder as EloquentBuilder;
use Illuminate\Database\Query\Builder as QueryBuilder;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

/**
 * Implementasi Eloquent untuk operasi kelas, peserta kelas, dan absensi Instruktur.
 */
final class EloquentDaftarHadirRepository implements DaftarHadirRepository
{
    private const RELASI = ['instruktur', 'materi', 'sesi', 'lokasiBlc'];

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

    public function listKelas(int $instrukturId, string $search = ''): array
    {
        $query = $this->kelasQuery($instrukturId)
            ->with(self::RELASI)
            ->withCount($this->relasiPesertaAktif())
            ->orderBy('nama_kelas')
            ->orderBy('id');

        $search = trim($search);
        if ($search !== '') {
            $pola = '%'.$search.'%';
            $query->where(function (EloquentBuilder $inner) use ($pola): void {
                $inner->where('nama_kelas', 'like', $pola)
                    ->orWhereHas('materi', fn (EloquentBuilder $materi) => $materi->where('nama_materi', 'like', $pola));
            });
        }

        return $query->get()
            ->map(fn (KelasModel $kelas) => $this->kelasToArray($kelas))
            ->all();
    }

    public function findKelas(int $instrukturId, int $kelasId): ?array
    {
        $kelas = $this->kelasQuery($instrukturId)
            ->with(self::RELASI)
            ->withCount($this->relasiPesertaAktif())
            ->find($kelasId);

        return $kelas === null ? null : $this->kelasToArray($kelas);
    }

    public function createKelas(int $instrukturId, array $data): array
    {
        $data['instruktur_id'] = $instrukturId;
        $data['status'] = 1;
        $data['is_delete'] = false;

        $kelas = KelasModel::create($data);
        $kelas->load(self::RELASI);
        $kelas->loadCount($this->relasiPesertaAktif());

        return $this->kelasToArray($kelas);
    }

    public function updateKelas(int $instrukturId, int $kelasId, array $data): ?array
    {
        $kelas = $this->kelasQuery($instrukturId)->find($kelasId);
        if ($kelas === null) {
            return null;
        }

        $kelas->update($data);
        $kelas->load(self::RELASI);
        $kelas->loadCount($this->relasiPesertaAktif());

        return $this->kelasToArray($kelas);
    }

    public function deleteKelas(int $instrukturId, int $kelasId): bool
    {
        $kelas = $this->kelasQuery($instrukturId)->find($kelasId);
        if ($kelas === null) {
            return false;
        }

        $kelas->forceFill(['is_delete' => true])->save();

        return true;
    }

    public function opsiKelas(): array
    {
        return [
            'sesi' => $this->opsiSesi(),
            'materi' => $this->opsiMateri(),
            'blc' => LokasiBlcModel::query()
                ->where('is_delete', false)
                ->where('aktif', true)
                ->orderBy('nama_blc')
                ->get(['id', 'nama_blc'])
                ->map(fn (LokasiBlcModel $blc) => [
                    'id' => (int) $blc->id,
                    'nama_blc' => $blc->nama_blc,
                ])
                ->all(),
        ];
    }

    public function opsiSesi(): array
    {
        return SesiModel::query()
            ->where('is_delete', false)
            ->orderBy('sesi')
            ->orderBy('id')
            ->get(['id', 'sesi', 'jam'])
            ->map(fn (SesiModel $sesi) => [
                'id' => (int) $sesi->id,
                'sesi' => $sesi->sesi,
                'jam' => $sesi->jam,
            ])
            ->all();
    }

    public function opsiMateri(): array
    {
        return MateriModel::query()
            ->where('is_delete', false)
            ->orderBy('id_index')
            ->orderBy('id')
            ->get(['id', 'nama_materi'])
            ->map(fn (MateriModel $materi) => [
                'id' => $materi->id,
                'nama_materi' => $materi->nama_materi,
            ])
            ->all();
    }

    public function calonPeserta(int $instrukturId, int $kelasId): ?array
    {
        if (! $this->kelasQuery($instrukturId)->whereKey($kelasId)->exists()) {
            return null;
        }

        return $this->pesertaQuery()
            ->whereNotExists(function (QueryBuilder $query) use ($kelasId): void {
                $query->selectRaw('1')
                    ->from('kelas_peserta')
                    ->whereColumn('kelas_peserta.peserta_id', 'p.id')
                    ->where('kelas_peserta.kelas_id', $kelasId)
                    ->where('kelas_peserta.is_delete', false);
            })
            ->orderBy('nama')
            ->orderBy('id')
            ->get()
            ->map(fn ($peserta) => $this->pesertaToArray($peserta))
            ->all();
    }

    public function pesertaKelas(int $instrukturId, int $kelasId): ?array
    {
        if (! $this->kelasQuery($instrukturId)->whereKey($kelasId)->exists()) {
            return null;
        }

        return $this->pesertaQuery()
            ->join('kelas_peserta', 'kelas_peserta.peserta_id', '=', 'p.id')
            ->where('kelas_peserta.kelas_id', $kelasId)
            ->where('kelas_peserta.is_delete', false)
            ->distinct()
            ->orderBy('nama')
            ->orderBy('id')
            ->get()
            ->map(fn ($peserta) => $this->pesertaToArray($peserta))
            ->all();
    }

    public function tambahPeserta(int $instrukturId, int $kelasId, array $pesertaIds): ?array
    {
        $pesertaIds = array_values(array_unique(array_map('intval', $pesertaIds)));

        return DB::transaction(function () use ($instrukturId, $kelasId, $pesertaIds): ?array {
            // Mengunci baris kelas membuat penambahan untuk kelas yang sama
            // terserialisasi walau database belum memiliki unique constraint.
            $kelas = $this->kelasQuery($instrukturId)->lockForUpdate()->find($kelasId);
            if ($kelas === null) {
                return null;
            }

            $pesertaAktif = DB::table('peserta')
                ->whereIn('id', $pesertaIds)
                ->where('is_delete', false)
                ->lockForUpdate()
                ->pluck('id')
                ->all();

            if (count($pesertaAktif) !== count($pesertaIds)) {
                throw ValidationException::withMessages([
                    'peserta_ids' => 'Salah satu peserta tidak ditemukan atau sudah tidak aktif.',
                ]);
            }

            foreach ($pesertaIds as $pesertaId) {
                $rows = KelasPesertaModel::query()
                    ->where('kelas_id', $kelasId)
                    ->where('peserta_id', $pesertaId)
                    ->orderBy('id')
                    ->lockForUpdate()
                    ->get();

                if ($rows->isEmpty()) {
                    KelasPesertaModel::create([
                        'kelas_id' => $kelasId,
                        'peserta_id' => $pesertaId,
                        'instruktur_id' => $instrukturId,
                        'is_delete' => false,
                    ]);

                    continue;
                }

                // Gunakan kembali baris yang dihapus dan nonaktifkan duplikat lama.
                $rows->first()->update([
                    'instruktur_id' => $instrukturId,
                    'is_delete' => false,
                ]);

                foreach ($rows->skip(1) as $duplikat) {
                    $duplikat->update(['is_delete' => true]);
                }
            }

            return $this->pesertaKelas($instrukturId, $kelasId);
        });
    }

    public function keluarkanPeserta(int $instrukturId, int $kelasId, int $pesertaId): ?bool
    {
        return DB::transaction(function () use ($instrukturId, $kelasId, $pesertaId): ?bool {
            $kelas = $this->kelasQuery($instrukturId)->lockForUpdate()->find($kelasId);
            if ($kelas === null) {
                return null;
            }

            KelasPesertaModel::query()
                ->where('kelas_id', $kelasId)
                ->where('peserta_id', $pesertaId)
                ->where('is_delete', false)
                ->update(['is_delete' => true]);

            return true;
        });
    }

    public function rekapPeserta(int $instrukturId, string $search = ''): array
    {
        $query = DB::table('peserta as p')
            ->join('kelas_peserta as kp', 'kp.peserta_id', '=', 'p.id')
            ->join('kelas as k', 'k.id', '=', 'kp.kelas_id')
            ->leftJoin('materi as m', 'm.id', '=', 'k.materi_id')
            ->leftJoin('sesi as s', 's.id', '=', 'k.sesi_id')
            ->leftJoin('lokasi_blc as blc', 'blc.id', '=', 'k.lokasi_blc_id')
            ->leftJoin('kategori_artikel as kategori', 'kategori.id', '=', 'p.kategori_id')
            ->where('p.is_delete', false)
            ->where('kp.is_delete', false)
            ->where('k.is_delete', false)
            ->where('k.instruktur_id', $instrukturId);

        $search = trim($search);
        if ($search !== '') {
            $pola = '%'.$search.'%';
            $query->where(function (QueryBuilder $inner) use ($pola): void {
                $inner->where('p.nama_lengkap', 'like', $pola)
                    ->orWhere('p.nik', 'like', $pola)
                    ->orWhere('k.nama_kelas', 'like', $pola);
            });
        }

        $rows = $query
            ->orderBy('p.nama_lengkap')
            ->orderBy('p.id')
            ->orderBy('k.nama_kelas')
            ->get([
                'p.id as peserta_id',
                'p.nik',
                'p.nama_lengkap as nama',
                'p.gender as jk',
                'p.phone',
                'p.alamat',
                'p.is_validated',
                'blc.nama_blc',
                'kategori.nama_kelompok',
                'kp.id as kelas_peserta_id',
                'k.id as kelas_id',
                'k.nama_kelas',
                'k.hari',
                'm.nama_materi',
                's.sesi',
                's.jam',
                'k.lokasi_blc_id',
            ]);

        $peserta = [];
        foreach ($rows as $row) {
            $key = (int) $row->peserta_id;
            if (! isset($peserta[$key])) {
                $peserta[$key] = [
                    'id' => $key,
                    'nik' => $row->nik,
                    'nama' => $row->nama,
                    'jk' => $row->jk,
                    'phone' => $row->phone,
                    'telepon' => $row->phone,
                    'alamat' => $row->alamat,
                    'blc' => $row->nama_blc ?? '-',
                    'kategori' => $row->nama_kelompok ?? '-',
                    'tervalidasi' => filter_var($row->is_validated, FILTER_VALIDATE_BOOLEAN),
                    'kelas' => [],
                ];
            }

            $peserta[$key]['kelas'][] = [
                'id' => (int) $row->kelas_id,
                'nama_kelas' => $row->nama_kelas,
                'materi' => $row->nama_materi ?? '-',
                'sesi' => $row->sesi === null ? null : (int) $row->sesi,
                'waktu_sesi' => $row->jam,
                'lokasi' => $row->nama_blc ?? '-',
                'lokasi_blc_id' => $row->lokasi_blc_id === null ? null : (int) $row->lokasi_blc_id,
                'hari' => preg_split('/\s+/', trim((string) $row->hari), -1, PREG_SPLIT_NO_EMPTY) ?: [],
            ];
        }

        $kehadiran = DB::table('daftar_hadir as dh')
            ->join('kelas_peserta as kp', 'kp.id', '=', 'dh.kelas_peserta_id')
            ->whereIn('kp.peserta_id', array_keys($peserta))
            ->where('kp.is_delete', false)
            ->whereIn('kp.kelas_id', function (QueryBuilder $query) use ($instrukturId): void {
                $query->select('id')
                    ->from('kelas')
                    ->where('instruktur_id', $instrukturId)
                    ->where('is_delete', false);
            })
            ->select('kp.peserta_id', 'kp.kelas_id', DB::raw('COUNT(*) as total_pertemuan'), DB::raw('SUM(CASE WHEN dh.hadir = true THEN 1 ELSE 0 END) as total_hadir'))
            ->groupBy('kp.peserta_id', 'kp.kelas_id')
            ->get();

        $rekap = [];
        foreach ($kehadiran as $item) {
            $rekap[(int) $item->peserta_id.':'.(int) $item->kelas_id] = [
                'total_pertemuan' => (int) $item->total_pertemuan,
                'total_hadir' => (int) $item->total_hadir,
            ];
        }

        return array_values(array_map(function (array $item) use ($rekap): array {
            $totalPertemuan = 0;
            $totalHadir = 0;
            $item['kelas'] = array_map(function (array $kelas) use (&$totalPertemuan, &$totalHadir, $rekap): array {
                $key = $item['id'].':'.$kelas['id'];
                $hadir = $rekap[$key] ?? ['total_pertemuan' => 0, 'total_hadir' => 0];
                $totalPertemuan += $hadir['total_pertemuan'];
                $totalHadir += $hadir['total_hadir'];

                return [
                    ...$kelas,
                    'total_pertemuan' => $hadir['total_pertemuan'],
                    'total_hadir' => $hadir['total_hadir'],
                ];
            }, $item['kelas']);
            $item['total_pertemuan'] = $totalPertemuan;
            $item['total_hadir'] = $totalHadir;

            return $item;
        }, $peserta));
    }

    public function absensiKelas(int $instrukturId, int $kelasId, string $tanggal): ?array
    {
        if (! $this->kelasQuery($instrukturId)->whereKey($kelasId)->exists()) {
            return null;
        }

        $peserta = DB::table('peserta as p')
            ->join('kelas_peserta as kp', 'kp.peserta_id', '=', 'p.id')
            ->leftJoin('daftar_hadir as dh', function (QueryBuilder $join) use ($tanggal): void {
                $join->on('dh.kelas_peserta_id', '=', 'kp.id')
                    ->where('dh.tgl_hadir', $tanggal);
            })
            ->leftJoin('lokasi_blc as blc', 'blc.id', '=', 'p.lokasi_blc_id')
            ->leftJoin('kategori_artikel as kategori', 'kategori.id', '=', 'p.kategori_id')
            ->where('kp.kelas_id', $kelasId)
            ->where('kp.is_delete', false)
            ->where('p.is_delete', false)
            ->orderBy('p.nama_lengkap')
            ->orderBy('p.id')
            ->get([
                'p.id',
                'p.nik',
                'p.nama_lengkap as nama',
                'p.gender as jk',
                'p.phone',
                'p.alamat',
                'p.is_validated',
                'blc.nama_blc',
                'kategori.nama_kelompok',
                'kp.id as kelas_peserta_id',
                'dh.hadir',
            ])
            ->map(fn ($peserta) => [
                ...$this->pesertaToArray($peserta),
                'hadir' => $peserta->hadir === null ? null : filter_var($peserta->hadir, FILTER_VALIDATE_BOOLEAN),
            ])
            ->all();

        return [
            'data' => $peserta,
            'meta' => [
                'tanggal' => $tanggal,
                'sudah_dicatat' => collect($peserta)->contains(fn (array $item) => $item['hadir'] !== null),
            ],
        ];
    }

    public function simpanAbsensi(int $instrukturId, int $kelasId, string $tanggal, array $peserta): ?array
    {
        return DB::transaction(function () use ($instrukturId, $kelasId, $tanggal, $peserta): ?array {
            $kelas = $this->kelasQuery($instrukturId)->lockForUpdate()->find($kelasId);
            if ($kelas === null) {
                return null;
            }

            $pesertaIds = array_column($peserta, 'peserta_id');
            $terdaftar = DB::table('kelas_peserta')
                ->where('kelas_id', $kelasId)
                ->where('is_delete', false)
                ->whereIn('peserta_id', $pesertaIds)
                ->lockForUpdate()
                ->get(['id', 'peserta_id']);

            if ($terdaftar->pluck('peserta_id')->map(fn ($id) => (int) $id)->unique()->count() !== count($pesertaIds)) {
                throw ValidationException::withMessages([
                    'peserta' => 'Salah satu peserta tidak terdaftar di kelas ini.',
                ]);
            }

            foreach ($peserta as $item) {
                $kelasPeserta = $terdaftar->firstWhere('peserta_id', $item['peserta_id']);
                DB::table('daftar_hadir')->updateOrInsert(
                    ['kelas_peserta_id' => $kelasPeserta->id, 'tgl_hadir' => $tanggal],
                    ['hadir' => $item['hadir'], 'updated_at' => now()],
                );
            }

            return $this->absensiKelas($instrukturId, $kelasId, $tanggal);
        });
    }

    public function rekapKelas(int $instrukturId, int $kelasId): ?array
    {
        if (! $this->kelasQuery($instrukturId)->whereKey($kelasId)->exists()) {
            return null;
        }

        return DB::table('peserta as p')
            ->join('kelas_peserta as kp', 'kp.peserta_id', '=', 'p.id')
            ->leftJoin('daftar_hadir as dh', 'dh.kelas_peserta_id', '=', 'kp.id')
            ->where('kp.kelas_id', $kelasId)
            ->where('kp.is_delete', false)
            ->where('p.is_delete', false)
            ->groupBy('p.id', 'p.nama_lengkap')
            ->orderBy('p.nama_lengkap')
            ->get([
                'p.id as peserta_id',
                'p.nama_lengkap as nama',
                DB::raw('COUNT(dh.id) as total_pertemuan'),
                DB::raw('SUM(CASE WHEN dh.hadir = true THEN 1 ELSE 0 END) as hadir'),
                DB::raw('SUM(CASE WHEN dh.hadir = false THEN 1 ELSE 0 END) as tidak_hadir'),
            ])
            ->map(fn ($item) => [
                'peserta_id' => (int) $item->peserta_id,
                'nama' => $item->nama,
                'hadir' => (int) $item->hadir,
                'tidak_hadir' => (int) $item->tidak_hadir,
                'total_pertemuan' => (int) $item->total_pertemuan,
            ])
            ->all();
    }

    private function kelasQuery(int $instrukturId): EloquentBuilder
    {
        return KelasModel::query()
            ->where('instruktur_id', $instrukturId)
            ->where('is_delete', false);
    }

    /**
     * @return array<string, \Closure>
     */
    private function relasiPesertaAktif(): array
    {
        return [
            'kelasPeserta' => fn (EloquentBuilder $query) => $query->where('is_delete', false),
        ];
    }

    private function pesertaQuery(): QueryBuilder
    {
        return DB::table('peserta as p')
            ->leftJoin('lokasi_blc as blc', 'blc.id', '=', 'p.lokasi_blc_id')
            ->leftJoin('kategori_artikel as kategori', 'kategori.id', '=', 'p.kategori_id')
            ->select([
                'p.id',
                'p.nik',
                'p.nama_lengkap as nama',
                'p.gender as jk',
                'p.phone',
                'p.alamat',
                'p.is_validated',
                'blc.nama_blc',
                'kategori.nama_kelompok',
            ])
            ->where('p.is_delete', false);
    }

    /**
     * @return array<string, mixed>
     */
    private function pesertaToArray(object $peserta): array
    {
        return [
            'id' => (int) $peserta->id,
            'nik' => $peserta->nik,
            'nama' => $peserta->nama,
            'jk' => $peserta->jk,
            'blc' => $peserta->nama_blc ?? '-',
            'kategori' => $peserta->nama_kelompok ?? '-',
            'tervalidasi' => filter_var($peserta->is_validated, FILTER_VALIDATE_BOOLEAN),
            'telepon' => $peserta->phone,
            'phone' => $peserta->phone,
            'alamat' => $peserta->alamat,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function kelasToArray(KelasModel $kelas): array
    {
        $hari = preg_split('/\s+/', trim((string) $kelas->hari), -1, PREG_SPLIT_NO_EMPTY);

        return [
            'id' => (int) $kelas->id,
            'nama_kelas' => $kelas->nama_kelas,
            'materi' => $kelas->materi?->nama_materi ?? '-',
            'materi_id' => $kelas->materi_id,
            'instruktur' => $kelas->instruktur?->nama_lengkap ?? '-',
            'lokasi' => $kelas->lokasiBlc?->nama_blc ?? '-',
            'lokasi_blc_id' => (int) $kelas->lokasi_blc_id,
            'hari' => $hari ?: [],
            'jam' => (int) $kelas->sesi_id,
            'sesi_id' => (int) $kelas->sesi_id,
            'nomor_sesi' => (int) ($kelas->sesi?->sesi ?? $kelas->sesi_id),
            'waktu_sesi' => $kelas->sesi?->jam,
            'jumlah_peserta' => (int) ($kelas->kelas_peserta_count ?? 0),
            'status' => (int) $kelas->status,
        ];
    }
}
