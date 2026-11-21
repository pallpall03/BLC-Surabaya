<?php

namespace App\Modules\Instruktur\DaftarPeserta\Infrastructure;

use App\Modules\Admin\Data\LokasiBlc\Infrastructure\LokasiBlcModel;
use App\Modules\Instruktur\DaftarPeserta\Contracts\DaftarPesertaRepository;
use Illuminate\Database\Eloquent\Builder;

/**
 * Implementasi Eloquent untuk Daftar Peserta (Instruktur).
 * Instruktur bersifat global (tidak dibatasi area), jadi tidak ada filter lokasi otomatis.
 */
final class EloquentDaftarPesertaRepository implements DaftarPesertaRepository
{
    private const RELASI = ['lokasiBlc', 'kategoriPeserta'];

    public function all(): array
    {
        return PesertaModel::with(self::RELASI)
            ->orderBy('nama')
            ->orderBy('id')
            ->get()
            ->map(fn (PesertaModel $p) => $this->toArray($p))
            ->all();
    }

    public function paginate(array $filter, int $perPage, int $page): array
    {
        $hasil = $this->query($filter, denganStatus: true)
            ->with(self::RELASI)
            ->orderBy('nama')
            ->orderBy('id')
            ->paginate($perPage, ['*'], 'page', $page);

        return [
            'data' => collect($hasil->items())->map(fn (PesertaModel $p) => $this->toArray($p))->all(),
            'meta' => [
                'page' => $hasil->currentPage(),
                'per_page' => $hasil->perPage(),
                'total' => $hasil->total(),
                'last_page' => $hasil->lastPage(),
            ],
        ];
    }

    public function statistik(array $filter): array
    {
        $dasar = $this->query($filter, denganStatus: false);

        $semua = (clone $dasar)->count();
        $valid = (clone $dasar)->where('tervalidasi', true)->count();

        return ['semua' => $semua, 'tervalidasi' => $valid, 'belum' => $semua - $valid];
    }

    public function find(int $id): mixed
    {
        $peserta = PesertaModel::with(self::RELASI)->find($id);

        return $peserta ? $this->toArray($peserta) : null;
    }

    public function create(array $data): mixed
    {
        $peserta = PesertaModel::create($data);

        return $this->toArray($peserta->load(self::RELASI));
    }

    public function update(int $id, array $data): mixed
    {
        $peserta = PesertaModel::findOrFail($id);
        $peserta->update($data);

        return $this->toArray($peserta->load(self::RELASI));
    }

    public function delete(int $id): void
    {
        PesertaModel::findOrFail($id)->delete();
    }

    public function setValidasi(int $id, bool $valid, ?int $oleh): mixed
    {
        $peserta = PesertaModel::findOrFail($id);
        $peserta->forceFill([
            'tervalidasi' => $valid,
            'tanggal_validasi' => $valid ? now() : null,
            'divalidasi_oleh' => $valid ? $oleh : null,
        ])->save();

        return $this->toArray($peserta->load(self::RELASI));
    }

    public function opsi(): array
    {
        return [
            'lokasi_blc' => LokasiBlcModel::aktif()
                ->orderBy('nama_blc')
                ->get(['id', 'nama_blc'])
                ->map(fn ($l) => ['id' => $l->id, 'nama' => $l->nama_blc])
                ->all(),
            'kategori_peserta' => KategoriPesertaModel::where('is_aktif', true)
                ->orderBy('nama')
                ->get(['id', 'nama'])
                ->map(fn ($k) => ['id' => $k->id, 'nama' => $k->nama])
                ->all(),
        ];
    }

    /** @param  array<string, mixed>  $filter */
    private function query(array $filter, bool $denganStatus): Builder
    {
        $query = PesertaModel::query();

        $kata = isset($filter['q']) ? trim((string) $filter['q']) : '';
        if ($kata !== '') {
            $pola = '%'.mb_strtolower($kata).'%';
            $query->where(function (Builder $w) use ($pola): void {
                $w->whereRaw('LOWER(nama) LIKE ?', [$pola])->orWhere('nik', 'like', $pola);
            });
        }

        if (! empty($filter['lokasi_blc_id'])) {
            $query->where('lokasi_blc_id', (int) $filter['lokasi_blc_id']);
        }

        if (! empty($filter['kategori_peserta_id'])) {
            $query->where('kategori_peserta_id', (int) $filter['kategori_peserta_id']);
        }

        $status = $filter['status'] ?? 'semua';
        if ($denganStatus && in_array($status, ['valid', 'non'], true)) {
            $query->where('tervalidasi', $status === 'valid');
        }

        return $query;
    }

    /** @return array<string, mixed> */
    private function toArray(PesertaModel $p): array
    {
        return [
            'id' => $p->id,
            'nik' => $p->nik,
            'nama' => $p->nama,
            'jk' => $p->jk,
            'tanggal_lahir' => $p->tanggal_lahir?->format('Y-m-d'),
            'telepon' => $p->telepon,
            'alamat' => $p->alamat,
            'lokasi_blc_id' => $p->lokasi_blc_id,
            'blc' => $p->lokasiBlc?->nama_blc ?? '-',
            'kategori_peserta_id' => $p->kategori_peserta_id,
            'kategori' => $p->kategoriPeserta?->nama ?? '-',
            'tervalidasi' => (bool) $p->tervalidasi,
            'tanggal_validasi' => $p->tanggal_validasi?->toIso8601String(),
        ];
    }
}
