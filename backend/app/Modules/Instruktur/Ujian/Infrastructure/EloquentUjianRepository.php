<?php

namespace App\Modules\Instruktur\Ujian\Infrastructure;

use App\Modules\Instruktur\Ujian\Contracts\UjianRepository;
use App\Modules\Koordinator\Monitoring\Infrastructure\MasterUjianModel;
use App\Modules\Koordinator\Monitoring\Infrastructure\SoalUjianModel;
use App\Modules\Koordinator\Monitoring\Infrastructure\HasilUjianModel;
use App\Modules\Instruktur\DaftarHadir\Infrastructure\KelasModel;

/**
 * Implementasi Eloquent untuk Ujian (pretest/posttest) (Instruktur).
 */
final class EloquentUjianRepository implements UjianRepository
{
    public function all(): array
    {
        return MasterUjianModel::with(['materi'])
            ->orderBy('judul')
            ->get()
            ->map(fn ($u) => $this->ujianToArray($u))
            ->toArray();
    }

    public function find(int $id): mixed
    {
        $ujian = MasterUjianModel::with(['materi', 'soal'])->find($id);
        return $ujian ? $this->ujianToArray($ujian, true) : null;
    }

    public function create(array $data): mixed
    {
        $soal = $data['soal'] ?? [];
        unset($data['soal']);
        $ujian = MasterUjianModel::create($data);
        foreach ($soal as $index => $s) {
            $s['nomor'] = $s['nomor'] ?? ($index + 1);
            $ujian->soal()->create($s);
        }
        $ujian->load(['materi', 'soal']);
        return $this->ujianToArray($ujian, true);
    }

    public function update(int $id, array $data): mixed
    {
        $ujian = MasterUjianModel::findOrFail($id);
        $soal = $data['soal'] ?? null;
        unset($data['soal']);
        $ujian->update($data);
        if ($soal !== null) {
            $ujian->soal()->delete();
            foreach ($soal as $index => $s) {
                $s['nomor'] = $s['nomor'] ?? ($index + 1);
                $ujian->soal()->create($s);
            }
        }
        $ujian->load(['materi', 'soal']);
        return $this->ujianToArray($ujian, true);
    }

    public function delete(int $id): void
    {
        MasterUjianModel::destroy($id);
    }

    // Additional methods for Ujian
    public function getByMateri(int $materiId, string $tipe = 'pretest'): array
    {
        return MasterUjianModel::where('materi_id', $materiId)
            ->where('tipe', $tipe)
            ->where('is_aktif', true)
            ->get()
            ->map(fn ($u) => $this->ujianToArray($u))
            ->toArray();
    }

    public function submitJawaban(int $ujianId, int $pesertaId, ?int $kelasId, array $jawaban): array
    {
        $ujian = MasterUjianModel::with('soal')->findOrFail($ujianId);
        $skor = 0;
        $totalBobot = 0;

        foreach ($ujian->soal as $soal) {
            $totalBobot += $soal->bobot;
            $userJawaban = $jawaban[$soal->id] ?? null;
            if ($userJawaban === $soal->jawaban_benar) {
                $skor += $soal->bobot;
            }
        }

        $nilai = $totalBobot > 0 ? round(($skor / $totalBobot) * 100) : 0;
        $lulus = $nilai >= $ujian->nilai_minimum;

        $hasil = HasilUjianModel::create([
            'master_ujian_id' => $ujianId,
            'peserta_id' => $pesertaId,
            'kelas_id' => $kelasId,
            'jawaban' => $jawaban,
            'skor' => $skor,
            'nilai' => $nilai,
            'lulus' => $lulus,
            'waktu_mulai' => time(),
            'waktu_selesai' => time(),
        ]);

        return [
            'id' => $hasil->id,
            'nilai' => $nilai,
            'skor' => $skor,
            'lulus' => $lulus,
            'nilai_minimum' => $ujian->nilai_minimum,
        ];
    }

    public function getHasilByPeserta(int $ujianId, int $pesertaId): mixed
    {
        return HasilUjianModel::where('master_ujian_id', $ujianId)
            ->where('peserta_id', $pesertaId)
            ->latest()
            ->first();
    }

    public function getHasilByKelas(int $kelasId, int $ujianId): array
    {
        return HasilUjianModel::with('peserta')
            ->where('kelas_id', $kelasId)
            ->where('master_ujian_id', $ujianId)
            ->get()
            ->map(function ($h) {
                return [
                    'id' => $h->id,
                    'peserta_id' => $h->peserta_id,
                    'peserta_nama' => $h->peserta?->nama ?? '-',
                    'nilai' => $h->nilai,
                    'lulus' => $h->lulus,
                    'waktu_selesai' => $h->waktu_selesai,
                ];
            })
            ->toArray();
    }

    private function ujianToArray(MasterUjianModel $u, bool $withSoal = false): array
    {
        $arr = [
            'id' => $u->id,
            'judul' => $u->judul,
            'materi' => $u->materi?->nama ?? '-',
            'tipe' => $u->tipe,
            'durasi_menit' => $u->durasi_menit,
            'jumlah_soal' => $u->soal_count ?? $u->soal->count(),
            'nilai_minimum' => $u->nilai_minimum,
            'tanggal_mulai' => $u->tanggal_mulai?->format('Y-m-d'),
            'tanggal_selesai' => $u->tanggal_selesai?->format('Y-m-d'),
            'is_aktif' => $u->is_aktif,
        ];

        if ($withSoal) {
            $arr['soal'] = $u->soal->map(function ($s) {
                return [
                    'id' => $s->id,
                    'pertanyaan' => $s->pertanyaan,
                    'pilihan' => $s->pilihan,
                    'jawaban_benar' => $s->jawaban_benar,
                    'nomor' => $s->nomor,
                    'bobot' => $s->bobot,
                    'penjelasan' => $s->penjelasan,
                ];
            })->toArray();
        }

        return $arr;
    }
}
