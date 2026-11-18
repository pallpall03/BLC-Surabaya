<?php

namespace App\Modules\Instruktur\DaftarHadir\Infrastructure;

use App\Modules\Instruktur\DaftarHadir\Contracts\DaftarHadirRepository;
use Illuminate\Support\Collection;

/**
 * Implementasi Eloquent untuk Daftar Hadir (Instruktur).
 */
final class EloquentDaftarHadirRepository implements DaftarHadirRepository
{
    public function all(): array
    {
        return KelasModel::with(['instruktur', 'materi', 'lokasiBlc'])
            ->orderBy('nama')
            ->get()
            ->map(fn ($k) => $this->kelasToArray($k))
            ->toArray();
    }

    public function find(int $id): mixed
    {
        $kelas = KelasModel::with(['instruktur', 'materi', 'lokasiBlc'])->find($id);
        return $kelas ? $this->kelasToArray($kelas) : null;
    }

    public function create(array $data): mixed
    {
        $kelas = KelasModel::create($data);
        $kelas->load(['instruktur', 'materi', 'lokasiBlc']);
        return $this->kelasToArray($kelas);
    }

    public function update(int $id, array $data): mixed
    {
        $kelas = KelasModel::findOrFail($id);
        $kelas->update($data);
        $kelas->load(['instruktur', 'materi', 'lokasiBlc']);
        return $this->kelasToArray($kelas);
    }

    public function delete(int $id): void
    {
        KelasModel::destroy($id);
    }

    // Additional methods for Daftar Hadir
    public function getAbsensi(int $kelasId, string $tanggal): array
    {
        return AbsensiModel::with(['peserta', 'foto'])
            ->where('kelas_id', $kelasId)
            ->where('tanggal', $tanggal)
            ->get()
            ->map(fn ($a) => $this->absensiToArray($a))
            ->toArray();
    }

    public function saveAbsensi(int $kelasId, string $tanggal, array $kehadiran, array $foto = [], ?int $userId = null): array
    {
        $results = [];
        foreach ($kehadiran as $pesertaId => $status) {
            $absensi = AbsensiModel::updateOrCreate(
                ['kelas_id' => $kelasId, 'peserta_id' => $pesertaId, 'tanggal' => $tanggal],
                ['status' => $status, 'dicatat_oleh' => $userId]
            );
            $results[] = $this->absensiToArray($absensi);
        }

        // Handle foto uploads
        foreach ($foto as $absensiId => $files) {
            foreach ($files as $file) {
                AbsensiFotoModel::create([
                    'absensi_id' => $absensiId,
                    'path' => $file['path'],
                    'nama_file' => $file['name'] ?? null,
                    'mime_type' => $file['mime'] ?? null,
                    'ukuran' => $file['size'] ?? null,
                    'diunggah_oleh' => $userId,
                ]);
            }
        }

        return $results;
    }

    public function getPesertaByKelas(int $kelasId): array
    {
        $kelas = KelasModel::with(['absensi.peserta'])->find($kelasId);
        if (!$kelas) return [];

        return $kelas->absensi
            ->groupBy('peserta_id')
            ->map(function ($absensiList, $pesertaId) {
                $first = $absensiList->first();
                return [
                    'id' => $first->peserta->id,
                    'nama' => $first->peserta->nama,
                    'jk' => $first->peserta->jk,
                    'phone' => $first->peserta->telepon,
                    'alamat' => $first->peserta->alamat,
                    'kategori' => $first->peserta->kategoriPeserta?->nama ?? '-',
                ];
            })
            ->values()
            ->toArray();
    }

    private function kelasToArray(KelasModel $k): array
    {
        return [
            'id' => $k->id,
            'nama' => $k->nama,
            'materi' => $k->materi?->nama ?? '-',
            'instruktur' => $k->instruktur?->nama_lengkap ?? '-',
            'lokasi' => $k->lokasiBlc?->nama ?? '-',
            'tanggal_mulai' => $k->tanggal_mulai?->format('Y-m-d'),
            'tanggal_selesai' => $k->tanggal_selesai?->format('Y-m-d'),
            'status' => $k->status,
        ];
    }

    private function absensiToArray(AbsensiModel $a): array
    {
        return [
            'id' => $a->id,
            'peserta_id' => $a->peserta_id,
            'peserta_nama' => $a->peserta?->nama ?? '-',
            'status' => $a->status,
            'keterangan' => $a->keterangan,
            'foto' => $a->foto->map(fn ($f) => [
                'id' => $f->id,
                'path' => $f->path,
                'nama_file' => $f->nama_file,
            ])->toArray(),
        ];
    }
}
