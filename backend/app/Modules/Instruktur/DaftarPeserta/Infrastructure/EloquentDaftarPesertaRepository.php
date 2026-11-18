<?php

namespace App\Modules\Instruktur\DaftarPeserta\Infrastructure;

use App\Modules\Instruktur\DaftarPeserta\Contracts\DaftarPesertaRepository;
use Illuminate\Support\Collection;

/**
 * Implementasi Eloquent untuk Daftar Peserta (Instruktur).
 */
final class EloquentDaftarPesertaRepository implements DaftarPesertaRepository
{
    public function all(): array
    {
        return PesertaModel::with(['lokasiBlc', 'kategoriPeserta'])
            ->orderBy('nama')
            ->get()
            ->map(fn ($p) => $this->toArray($p))
            ->toArray();
    }

    public function find(int $id): mixed
    {
        $peserta = PesertaModel::with(['lokasiBlc', 'kategoriPeserta'])->find($id);
        return $peserta ? $this->toArray($peserta) : null;
    }

    public function create(array $data): mixed
    {
        $peserta = PesertaModel::create($data);
        $peserta->load(['lokasiBlc', 'kategoriPeserta']);
        return $this->toArray($peserta);
    }

    public function update(int $id, array $data): mixed
    {
        $peserta = PesertaModel::findOrFail($id);
        $peserta->update($data);
        $peserta->load(['lokasiBlc', 'kategoriPeserta']);
        return $this->toArray($peserta);
    }

    public function delete(int $id): void
    {
        PesertaModel::destroy($id);
    }

    private function toArray(PesertaModel $p): array
    {
        return [
            'id' => $p->id,
            'nik' => $p->nik,
            'nama' => $p->nama,
            'blc' => $p->lokasiBlc?->nama ?? '-',
            'jk' => $p->jk,
            'tervalidasi' => $p->tervalidasi,
            'telepon' => $p->telepon,
            'alamat' => $p->alamat,
            'kategori' => $p->kategoriPeserta?->nama ?? '-',
        ];
    }
}
