<?php

namespace App\Modules\Koordinator\Monitoring\Infrastructure;

use App\Modules\Koordinator\Monitoring\Contracts\MonitoringRepository;
use App\Modules\Instruktur\DaftarHadir\Infrastructure\KelasModel;
use App\Modules\Instruktur\DaftarHadir\Infrastructure\AbsensiModel;
use App\Modules\Instruktur\DaftarPeserta\Infrastructure\PesertaModel;
use App\Modules\Instruktur\DaftarHadir\Infrastructure\AbsensiFotoModel;
use App\Modules\Koordinator\Monitoring\Infrastructure\MasterUjianModel;
use App\Modules\Koordinator\Monitoring\Infrastructure\HasilUjianModel;
use Illuminate\Support\Collection;

/**
 * Implementasi Eloquent untuk Monitoring (Koordinator).
 */
final class EloquentMonitoringRepository implements MonitoringRepository
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

    // Additional methods for Monitoring
    public function getStatistik(array $lokasiBlcIds): array
    {
        $pesertaCount = PesertaModel::whereIn('lokasi_blc_id', $lokasiBlcIds)->count();
        $kelasCount = KelasModel::whereIn('lokasi_blc_id', $lokasiBlcIds)->count();
        $kelasAktif = KelasModel::whereIn('lokasi_blc_id', $lokasiBlcIds)
            ->where('status', 'berlangsung')
            ->count();
        $ujianCount = MasterUjianModel::whereHas('materi', fn ($q) => $q->whereHas('kelas', fn ($k) => $k->whereIn('lokasi_blc_id', $lokasiBlcIds)))
            ->count();

        return [
            'total_peserta' => $pesertaCount,
            'total_kelas' => $kelasCount,
            'kelas_berlangsung' => $kelasAktif,
            'total_ujian' => $ujianCount,
        ];
    }

    public function getKelasPerLokasi(array $lokasiBlcIds): array
    {
        return KelasModel::with(['materi', 'instruktur', 'lokasiBlc'])
            ->whereIn('lokasi_blc_id', $lokasiBlcIds)
            ->orderBy('tanggal_mulai', 'desc')
            ->get()
            ->map(fn ($k) => [
                'id' => $k->id,
                'nama' => $k->nama,
                'materi' => $k->materi?->nama ?? '-',
                'instruktur' => $k->instruktur?->nama_lengkap ?? '-',
                'lokasi' => $k->lokasiBlc?->nama ?? '-',
                'tanggal_mulai' => $k->tanggal_mulai?->format('Y-m-d'),
                'tanggal_selesai' => $k->tanggal_selesai?->format('Y-m-d'),
                'status' => $k->status,
            ])
            ->toArray();
    }

    public function getPesertaPerLokasi(array $lokasiBlcIds): array
    {
        return PesertaModel::with(['kategoriPeserta', 'lokasiBlc'])
            ->whereIn('lokasi_blc_id', $lokasiBlcIds)
            ->orderBy('nama')
            ->get()
            ->map(fn ($p) => [
                'id' => $p->id,
                'nik' => $p->nik,
                'nama' => $p->nama,
                'jk' => $p->jk,
                'lokasi' => $p->lokasiBlc?->nama ?? '-',
                'kategori' => $p->kategoriPeserta?->nama ?? '-',
                'tervalidasi' => $p->tervalidasi,
            ])
            ->toArray();
    }

    public function getAbsensiRekap(array $lokasiBlcIds, string $mulai, string $sampai): array
    {
        return AbsensiModel::with(['peserta', 'kelas.materi', 'kelas.lokasiBlc'])
            ->whereHas('kelas', fn ($q) => $q->whereIn('lokasi_blc_id', $lokasiBlcIds))
            ->whereBetween('tanggal', [$mulai, $sampai])
            ->get()
            ->groupBy(fn ($a) => $a->kelas_id)
            ->map(function ($absensiList) {
                $first = $absensiList->first();
                $hadir = $absensiList->where('status', 'hadir')->count();
                $izin = $absensiList->where('status', 'izin')->count();
                $alpha = $absensiList->where('status', 'alpha')->count();
                $total = $absensiList->count();

                return [
                    'kelas_id' => $first->kelas_id,
                    'kelas_nama' => $first->kelas->nama ?? '-',
                    'materi' => $first->kelas->materi?->nama ?? '-',
                    'lokasi' => $first->kelas->lokasiBlc?->nama ?? '-',
                    'hadir' => $hadir,
                    'izin' => $izin,
                    'alpha' => $alpha,
                    'total' => $total,
                    'persentase' => $total > 0 ? round(($hadir / $total) * 100) : 0,
                ];
            })
            ->values()
            ->toArray();
    }

    public function getUjianRekap(array $lokasiBlcIds): array
    {
        return MasterUjianModel::with(['materi', 'hasil'])
            ->whereHas('materi', fn ($q) => $q->whereHas('kelas', fn ($k) => $k->whereIn('lokasi_blc_id', $lokasiBlcIds)))
            ->get()
            ->map(function ($ujian) {
                $hasil = $ujian->hasil;
                $total = $hasil->count();
                $lulus = $hasil->where('lulus', true)->count();
                $rataRata = $total > 0 ? round($hasil->avg('nilai')) : 0;

                return [
                    'id' => $ujian->id,
                    'judul' => $ujian->judul,
                    'materi' => $ujian->materi?->nama ?? '-',
                    'tipe' => $ujian->tipe,
                    'total_peserta' => $total,
                    'lulus' => $lulus,
                    'tidak_lulus' => $total - $lulus,
                    'rata_rata_nilai' => $rataRata,
                    'nilai_minimum' => $ujian->nilai_minimum,
                ];
            })
            ->toArray();
    }

    public function getHasilUjianPerPeserta(int $ujianId): array
    {
        return HasilUjianModel::with(['peserta', 'kelas'])
            ->where('master_ujian_id', $ujianId)
            ->get()
            ->map(function ($h) {
                return [
                    'id' => $h->id,
                    'peserta_id' => $h->peserta_id,
                    'peserta_nama' => $h->peserta?->nama ?? '-',
                    'kelas' => $h->kelas?->nama ?? '-',
                    'nilai' => $h->nilai,
                    'skor' => $h->skor,
                    'lulus' => $h->lulus,
                    'waktu_selesai' => $h->waktu_selesai,
                ];
            })
            ->toArray();
    }
}
