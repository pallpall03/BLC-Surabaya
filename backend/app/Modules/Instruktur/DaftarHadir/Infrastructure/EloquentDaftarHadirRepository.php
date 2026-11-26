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
 * Implementasi Eloquent untuk operasi kelas dan peserta kelas Daftar Hadir.
 * Tidak ada akses ke tabel absensi atau instruktur_profiles.
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

    public function rekapKelas(int $instrukturId, int $kelasId): ?array
    {
        // Belum ada tabel absensi pada skema aktif. Endpoint tetap memeriksa
        // kepemilikan kelas, lalu mengembalikan rekap kosong.
        return $this->kelasQuery($instrukturId)->whereKey($kelasId)->exists() ? [] : null;
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
