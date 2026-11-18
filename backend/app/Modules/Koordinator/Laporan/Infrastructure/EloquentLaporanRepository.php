<?php

namespace App\Modules\Koordinator\Laporan\Infrastructure;

use App\Modules\Koordinator\Laporan\Contracts\LaporanRepository;
use App\Modules\Instruktur\DaftarHadir\Infrastructure\KelasModel;
use App\Modules\Instruktur\DaftarHadir\Infrastructure\AbsensiModel;
use App\Modules\Instruktur\DaftarHadir\Infrastructure\AbsensiFotoModel;
use App\Modules\Instruktur\DaftarPeserta\Infrastructure\PesertaModel;
use App\Modules\Koordinator\Monitoring\Infrastructure\MasterUjianModel;
use App\Modules\Koordinator\Monitoring\Infrastructure\HasilUjianModel;
use App\Modules\Koordinator\Laporan\Infrastructure\PiagamModel;
use Illuminate\Support\Collection;

/**
 * Implementasi Eloquent untuk Laporan Seluruh Kegiatan BLC (Koordinator).
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
    public function getRekapKehadiran(array $lokasiBlcIds, string $mulai, string $sampai): array
    {
        return AbsensiModel::with(['peserta.kategoriPeserta', 'kelas.materi', 'kelas.lokasiBlc', 'kelas.instruktur'])
            ->whereHas('kelas', fn ($q) => $q->whereIn('lokasi_blc_id', $lokasiBlcIds))
            ->whereBetween('tanggal', [$mulai, $sampai])
            ->get()
            ->groupBy(fn ($a) => $a->peserta_id)
            ->map(function ($absensiList) {
                $first = $absensiList->first();
                $peserta = $first->peserta;
                $hadir = $absensiList->where('status', 'hadir')->count();
                $izin = $absensiList->where('status', 'izin')->count();
                $alpha = $absensiList->where('status', 'alpha')->count();
                $total = $absensiList->count();
                $materi = $absensiList->flatMap(fn ($a) => $a->kelas->materi?->nama ?? '-')->unique()->implode(', ');

                return [
                    'id' => $peserta->id,
                    'nik' => $peserta->nik,
                    'nama' => $peserta->nama,
                    'jk' => $peserta->jk,
                    'lokasi' => $peserta->lokasiBlc?->nama ?? '-',
                    'kategori' => $peserta->kategoriPeserta?->nama ?? '-',
                    'hadir' => $hadir,
                    'izin' => $izin,
                    'alpha' => $alpha,
                    'total_sesi' => $total,
                    'persentase' => $total > 0 ? round(($hadir / $total) * 100) : 0,
                    'materi' => $materi,
                ];
            })
            ->values()
            ->toArray();
    }

    public function getRekapUjian(array $lokasiBlcIds): array
    {
        return MasterUjianModel::with(['materi', 'hasil.peserta', 'hasil.kelas'])
            ->whereHas('materi', fn ($q) => $q->whereHas('kelas', fn ($k) => $k->whereIn('lokasi_blc_id', $lokasiBlcIds)))
            ->get()
            ->map(function ($ujian) {
                $hasil = $ujian->hasil;
                $total = $hasil->count();
                $lulus = $hasil->where('lulus', true)->count();
                $rataRata = $total > 0 ? round($hasil->avg('nilai')) : 0;

                $perPeserta = $hasil->map(function ($h) {
                    return [
                        'peserta_id' => $h->peserta_id,
                        'peserta_nama' => $h->peserta?->nama ?? '-',
                        'kelas' => $h->kelas?->nama ?? '-',
                        'nilai' => $h->nilai,
                        'lulus' => $h->lulus,
                    ];
                })->toArray();

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
                    'detail' => $perPeserta,
                ];
            })
            ->toArray();
    }

    public function getFotoKegiatan(array $lokasiBlcIds, string $mulai, string $sampai): array
    {
        return AbsensiFotoModel::with(['absensi.kelas.instruktur', 'absensi.kelas.lokasiBlc', 'absensi.peserta'])
            ->whereHas('absensi.kelas', fn ($q) => $q->whereIn('lokasi_blc_id', $lokasiBlcIds))
            ->whereHas('absensi', fn ($q) => $q->whereBetween('tanggal', [$mulai, $sampai]))
            ->get()
            ->map(function ($foto) {
                $absensi = $foto->absensi;
                $tanggal = $absensi->tanggal;
                return [
                    'id' => $foto->id,
                    'judul' => $absensi->kelas->nama ?? 'Kegiatan',
                    'tanggal' => $tanggal instanceof \Carbon\Carbon ? $tanggal->format('Y-m-d') : $tanggal,
                    'instruktur' => $absensi->kelas->instruktur?->nama_lengkap ?? '-',
                    'lokasi' => $absensi->kelas->lokasiBlc?->nama ?? '-',
                    'peserta' => $absensi->peserta?->nama ?? '-',
                    'url' => $foto->path,
                ];
            })
            ->toArray();
    }

    public function generatePiagam(int $hasilUjianId): mixed
    {
        $hasil = HasilUjianModel::with(['peserta', 'masterUjian.materi', 'masterUjian'])->find($hasilUjianId);
        if (!$hasil || !$hasil->lulus) {
            return null;
        }

        $piagam = PiagamModel::updateOrCreate(
            ['hasil_ujian_id' => $hasilUjianId],
            [
                'nomor' => 'PG-' . date('Ymd') . '-' . str_pad($hasilUjianId, 5, '0', STR_PAD_LEFT),
                'nama_peserta' => $hasil->peserta->nama,
                'judul_ujian' => $hasil->masterUjian->judul,
                'materi' => $hasil->masterUjian->materi?->nama ?? '-',
                'nilai' => $hasil->nilai,
                'tanggal_lulus' => now(),
                'is_dicetak' => false,
            ]
        );

        return [
            'id' => $piagam->id,
            'nomor' => $piagam->nomor,
            'nama_peserta' => $piagam->nama_peserta,
            'judul_ujian' => $piagam->judul_ujian,
            'materi' => $piagam->materi,
            'nilai' => $piagam->nilai,
            'tanggal_lulus' => $piagam->tanggal_lulus?->format('Y-m-d'),
        ];
    }
}
