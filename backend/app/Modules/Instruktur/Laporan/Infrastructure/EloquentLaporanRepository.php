<?php

namespace App\Modules\Instruktur\Laporan\Infrastructure;

use App\Modules\Instruktur\Laporan\Contracts\LaporanRepository;
use App\Modules\Instruktur\DaftarHadir\Infrastructure\AbsensiModel;
use App\Modules\Instruktur\DaftarHadir\Infrastructure\AbsensiFotoModel;
use App\Modules\Instruktur\DaftarHadir\Infrastructure\KelasModel;
use Illuminate\Support\Collection;

/**
 * Implementasi Eloquent untuk Laporan Kegiatan (Instruktur).
 */
final class EloquentLaporanRepository implements LaporanRepository
{
    public function all(): array
    {
        return [];
    }

    public function find(int $id): mixed
    {
        return null;
    }

    public function create(array $data): mixed
    {
        return [];
    }

    public function update(int $id, array $data): mixed
    {
        return [];
    }

    public function delete(int $id): void
    {
    }

    // Additional methods for Laporan
    public function getRekapHadir(?int $instrukturId, string $mulai, string $sampai): array
    {
        $query = AbsensiModel::with(['peserta', 'kelas.materi', 'kelas.instruktur'])
            ->whereBetween('tanggal', [$mulai, $sampai])
            ->where('status', 'hadir');

        if ($instrukturId) {
            $query->whereHas('kelas', fn ($q) => $q->where('instruktur_id', $instrukturId));
        }

        return $query->get()
            ->groupBy(fn ($a) => $a->peserta_id)
            ->map(function ($absensiList) {
                $first = $absensiList->first();
                $peserta = $first->peserta;
                $materi = $first->kelas->materi?->nama ?? '-';
                $sesi = $absensiList->count();

                return [
                    'id' => $peserta->id,
                    'nama' => $peserta->nama,
                    'jk' => $peserta->jk,
                    'alamat' => $peserta->alamat,
                    'kategori' => $peserta->kategoriPeserta?->nama ?? '-',
                    'sesi' => $sesi,
                    'materi' => $materi,
                    'kehadiran' => $sesi,
                ];
            })
            ->values()
            ->toArray();
    }

    public function getFotoKegiatan(?int $instrukturId, string $mulai, string $sampai): array
    {
        $query = AbsensiFotoModel::with(['absensi.kelas.instruktur'])
            ->whereHas('absensi', fn ($q) => $q->whereBetween('tanggal', [$mulai, $sampai]));

        if ($instrukturId) {
            $query->whereHas('absensi.kelas', fn ($q) => $q->where('instruktur_id', $instrukturId));
        }

        return $query->get()
            ->map(function ($foto) {
                $tanggal = $foto->absensi->tanggal;
                return [
                    'id' => $foto->id,
                    'judul' => $foto->absensi->kelas->nama ?? 'Kegiatan',
                    'tanggal' => $tanggal instanceof \Carbon\Carbon ? $tanggal->format('Y-m-d') : $tanggal,
                    'url' => $foto->path,
                ];
            })
            ->toArray();
    }
}
