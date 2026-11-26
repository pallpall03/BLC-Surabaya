<?php

namespace App\Modules\Instruktur\Ujian\Infrastructure;

use App\Modules\Instruktur\Ujian\Contracts\UjianRepository;
use App\Modules\Koordinator\Monitoring\Infrastructure\MasterUjianModel;
use App\Modules\Koordinator\Monitoring\Infrastructure\SoalUjianModel;
use App\Modules\Koordinator\Monitoring\Infrastructure\HasilUjianModel;
use App\Modules\Koordinator\Monitoring\Infrastructure\JadwalUjianModel;
use App\Modules\Instruktur\DaftarHadir\Infrastructure\KelasModel;
use App\Modules\Instruktur\DaftarHadir\Infrastructure\MateriModel;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

final class EloquentUjianRepository implements UjianRepository
{
    public function all(): array
    {
        return $this->ujianQuery()
            ->orderBy('judul')
            ->orderBy('id')
            ->get()
            ->map(fn (MasterUjianModel $ujian): array => $this->ujianToArray($ujian))
            ->all();
    }

    public function find(int $id): mixed
    {
        $ujian = $this->ujianQuery()->find($id);

        return $ujian === null ? null : $this->ujianToArray($ujian);
    }

    public function create(array $data): mixed
    {
        return DB::transaction(function () use ($data): array {
            $soal = $data['soal'];
            unset($data['soal']);

            $data = array_merge([
                'materi_id' => null,
                'nilai_minimum' => 70,
                'acak_soal' => false,
                'is_aktif' => true,
                'is_delete' => false,
            ], $data);

            $ujian = MasterUjianModel::create($data);
            $this->simpanSoal($ujian, $soal);

            return $this->ujianToArray($this->ujianQuery()->findOrFail($ujian->id));
        });
    }

    public function update(int $id, array $data): mixed
    {
        return DB::transaction(function () use ($id, $data): ?array {
            $ujian = $this->ujianQuery()->lockForUpdate()->find($id);
            if ($ujian === null) {
                return null;
            }

            $soal = $data['soal'] ?? null;
            unset($data['soal']);
            $ujian->update($data);

            if ($soal !== null) {
                $this->simpanSoal($ujian, $soal);
            }

            return $this->ujianToArray($this->ujianQuery()->findOrFail($id));
        });
    }

    public function delete(int $id): void
    {
        DB::transaction(function () use ($id): void {
            $ujian = $this->ujianQuery()->lockForUpdate()->findOrFail($id);
            $ujian->update(['is_delete' => true]);
            $ujian->jadwal()->update(['is_delete' => true]);
        });
    }

    public function opsi(int $instrukturId): array
    {
        $materi = MateriModel::query()
            ->where('is_delete', false)
            ->orderBy('id_index')
            ->orderBy('id')
            ->get(['id', 'nama_materi'])
            ->map(fn (MateriModel $item): array => [
                'id' => $item->id,
                'nama' => $item->nama_materi,
            ])
            ->all();

        $kelas = $this->kelasQuery($instrukturId)
            ->with(['materi', 'lokasiBlc'])
            ->withCount(['kelasPeserta' => fn (Builder $query): Builder => $query
                ->where('kelas_peserta.is_delete', false)
                ->whereHas('peserta', fn (Builder $peserta): Builder => $peserta->where('peserta.is_delete', false))])
            ->orderBy('nama_kelas')
            ->orderBy('id')
            ->get()
            ->map(fn (KelasModel $item): array => [
                'id' => (int) $item->id,
                'nama_kelas' => $item->nama_kelas,
                'materi_id' => $item->materi_id,
                'materi' => $item->materi?->nama_materi,
                'lokasi_blc_id' => $item->lokasi_blc_id === null ? null : (int) $item->lokasi_blc_id,
                'blc' => $item->lokasiBlc?->nama_blc,
                'jumlah_peserta' => (int) $item->kelas_peserta_count,
            ])
            ->all();

        return compact('materi', 'kelas');
    }

    public function createJadwal(int $instrukturId, array $data): array
    {
        return DB::transaction(function () use ($instrukturId, $data): array {
            $ujian = $this->ujianQuery()->lockForUpdate()->findOrFail((int) $data['master_ujian_id']);
            $kelas = $this->kelasQuery($instrukturId)->lockForUpdate()->findOrFail((int) $data['kelas_id']);
            $this->validasiMateriKelas($ujian, $kelas);

            $existing = JadwalUjianModel::query()
                ->where('master_ujian_id', $ujian->id)
                ->where('kelas_id', $kelas->id)
                ->lockForUpdate()
                ->first();

            if ($existing !== null && ! $existing->is_delete) {
                throw ValidationException::withMessages([
                    'kelas_id' => 'Kelas ini sudah memiliki jadwal untuk ujian tersebut.',
                ]);
            }

            $mulai = Carbon::parse($data['mulai'], 'Asia/Jakarta');
            $selesai = Carbon::parse($data['selesai'], 'Asia/Jakarta');
            $this->validasiRentang($mulai, $selesai);

            $values = [
                'master_ujian_id' => $ujian->id,
                'kelas_id' => $kelas->id,
                'mulai' => $mulai,
                'selesai' => $selesai,
                'token' => filled($data['token'] ?? null) ? $data['token'] : $this->buatToken(),
                'is_delete' => false,
            ];

            if ($existing !== null) {
                $existing->update($values);
                $jadwal = $existing;
            } else {
                $jadwal = $ujian->jadwal()->create($values);
            }

            return $this->jadwalToArray($jadwal->load('kelas'));
        });
    }

    public function updateJadwal(int $instrukturId, int $id, array $data): ?array
    {
        return DB::transaction(function () use ($instrukturId, $id, $data): ?array {
            $jadwal = $this->jadwalQuery($instrukturId)->lockForUpdate()->find($id);
            if ($jadwal === null) {
                return null;
            }

            $ujian = $this->ujianQuery()->lockForUpdate()->findOrFail((int) ($data['master_ujian_id'] ?? $jadwal->master_ujian_id));
            $kelas = $this->kelasQuery($instrukturId)->lockForUpdate()->findOrFail((int) ($data['kelas_id'] ?? $jadwal->kelas_id));
            $this->validasiMateriKelas($ujian, $kelas);

            $duplikat = JadwalUjianModel::query()
                ->where('master_ujian_id', $ujian->id)
                ->where('kelas_id', $kelas->id)
                ->whereKeyNot($id)
                ->exists();

            if ($duplikat) {
                throw ValidationException::withMessages([
                    'kelas_id' => 'Kelas ini sudah memiliki jadwal untuk ujian tersebut.',
                ]);
            }

            $mulai = array_key_exists('mulai', $data) ? Carbon::parse($data['mulai'], 'Asia/Jakarta') : $jadwal->mulai;
            $selesai = array_key_exists('selesai', $data) ? Carbon::parse($data['selesai'], 'Asia/Jakarta') : $jadwal->selesai;
            $this->validasiRentang($mulai, $selesai);

            $values = array_intersect_key($data, array_flip([
                'master_ujian_id',
                'kelas_id',
                'mulai',
                'selesai',
            ]));

            if (filled($data['token'] ?? null)) {
                if ($data['token'] !== $jadwal->token && $this->tokenExists($data['token'], $id)) {
                    throw ValidationException::withMessages([
                        'token' => 'Token sudah digunakan.',
                    ]);
                }
                $values['token'] = $data['token'];
            }

            $jadwal->update($values);

            return $this->jadwalToArray($jadwal->load('kelas'));
        });
    }

    public function deleteJadwal(int $instrukturId, int $id): bool
    {
        return DB::transaction(function () use ($instrukturId, $id): bool {
            $jadwal = $this->jadwalQuery($instrukturId)->lockForUpdate()->find($id);
            if ($jadwal === null) {
                return false;
            }

            $jadwal->update(['is_delete' => true]);

            return true;
        });
    }

    public function getByMateri(int $materiId, string $tipe = 'pretest'): array
    {
        return $this->ujianQuery()
            ->where('materi_id', $materiId)
            ->where('tipe', $tipe)
            ->where('is_aktif', true)
            ->get()
            ->map(fn (MasterUjianModel $ujian): array => $this->ujianToArray($ujian))
            ->all();
    }

    public function submitJawaban(int $ujianId, int $pesertaId, ?int $kelasId, array $jawaban): array
    {
        $ujian = MasterUjianModel::with('soal')->where('is_delete', false)->findOrFail($ujianId);
        $skor = 0;
        $totalBobot = 0;

        foreach ($ujian->soal as $soal) {
            $totalBobot += $soal->bobot;
            $userJawaban = $jawaban[$soal->id] ?? $jawaban[(string) $soal->id] ?? null;
            if ($userJawaban !== null && (int) $userJawaban === (int) $soal->jawaban_benar) {
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

    private function ujianQuery(): Builder
    {
        return MasterUjianModel::query()
            ->where('is_delete', false)
            ->with([
                'materi',
                'soal',
                'jadwal' => fn (Builder $query): Builder => $query->where('is_delete', false)->orderBy('mulai')->orderBy('id'),
                'jadwal.kelas',
            ])
            ->withCount('soal');
    }

    private function kelasQuery(int $instrukturId): Builder
    {
        return KelasModel::query()
            ->where('instruktur_id', $instrukturId)
            ->where('is_delete', false);
    }

    private function jadwalQuery(int $instrukturId): Builder
    {
        return JadwalUjianModel::query()
            ->where('jadwal_ujian.is_delete', false)
            ->whereHas('masterUjian', fn (Builder $query): Builder => $query->where('master_ujian.is_delete', false))
            ->whereHas('kelas', fn (Builder $query): Builder => $query
                ->where('kelas.instruktur_id', $instrukturId)
                ->where('kelas.is_delete', false));
    }

    private function simpanSoal(MasterUjianModel $ujian, array $soal): void
    {
        if (count($soal) < 1 || count($soal) > 10) {
            throw ValidationException::withMessages([
                'soal' => 'Ujian harus memiliki 1 sampai 10 soal.',
            ]);
        }

        $ujian->soal()->delete();

        foreach ($soal as $index => $item) {
            $ujian->soal()->create([
                'pertanyaan' => $item['pertanyaan'],
                'pilihan' => $item['pilihan'],
                'jawaban_benar' => $item['jawaban_benar'],
                'nomor' => $item['nomor'] ?? ($index + 1),
                'bobot' => $item['bobot'] ?? 1,
                'penjelasan' => $item['penjelasan'] ?? null,
                'is_aktif' => true,
            ]);
        }
    }

    private function validasiMateriKelas(MasterUjianModel $ujian, KelasModel $kelas): void
    {
        if ($ujian->materi_id !== null && $kelas->materi_id !== null && (string) $ujian->materi_id !== (string) $kelas->materi_id) {
            throw ValidationException::withMessages([
                'kelas_id' => 'Materi kelas harus sama dengan materi ujian.',
            ]);
        }
    }

    private function validasiRentang(Carbon $mulai, Carbon $selesai): void
    {
        if (! $mulai->lt($selesai)) {
            throw ValidationException::withMessages([
                'selesai' => 'Waktu selesai harus setelah waktu mulai.',
            ]);
        }
    }

    private function buatToken(): string
    {
        do {
            $token = Str::upper(Str::random(6));
        } while ($this->tokenExists($token));

        return $token;
    }

    private function tokenExists(string $token, ?int $ignoreId = null): bool
    {
        return JadwalUjianModel::query()
            ->where('token', $token)
            ->when($ignoreId !== null, fn (Builder $query): Builder => $query->whereKeyNot($ignoreId))
            ->exists();
    }

    private function ujianToArray(MasterUjianModel $ujian): array
    {
        return [
            'id' => (int) $ujian->id,
            'judul' => $ujian->judul,
            'materi_id' => $ujian->materi_id,
            'materi' => $ujian->materi?->nama_materi,
            'tipe' => $ujian->tipe,
            'durasi_menit' => (int) $ujian->durasi_menit,
            'nilai_minimum' => (int) $ujian->nilai_minimum,
            'acak_soal' => (bool) $ujian->acak_soal,
            'is_aktif' => (bool) $ujian->is_aktif,
            'jumlah_soal' => (int) ($ujian->soal_count ?? $ujian->soal->count()),
            'soal' => $ujian->soal->map(fn (SoalUjianModel $soal): array => [
                'id' => (int) $soal->id,
                'pertanyaan' => $soal->pertanyaan,
                'pilihan' => $soal->pilihan,
                'jawaban_benar' => (int) $soal->jawaban_benar,
                'nomor' => (int) $soal->nomor,
                'bobot' => (int) $soal->bobot,
                'penjelasan' => $soal->penjelasan,
            ])->all(),
            'jadwal' => $ujian->jadwal->map(fn (JadwalUjianModel $jadwal): array => $this->jadwalToArray($jadwal))->all(),
        ];
    }

    private function jadwalToArray(JadwalUjianModel $jadwal): array
    {
        return [
            'id' => (int) $jadwal->id,
            'kelas_id' => (int) $jadwal->kelas_id,
            'kelas' => $jadwal->kelas?->nama_kelas,
            'mulai' => $jadwal->mulai?->toIso8601String(),
            'selesai' => $jadwal->selesai?->toIso8601String(),
            'token' => $jadwal->token,
        ];
    }
}
