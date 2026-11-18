<?php

namespace App\Modules\Instruktur\Peserta\Infrastructure;

use App\Modules\Instruktur\Peserta\Domain\Peserta;
use App\Modules\Instruktur\Peserta\Contracts\PesertaRepository;

class EloquentPesertaRepository implements PesertaRepository
{
    protected $model;
    
    public function __construct()
    {
        $this->model = \App\Models\Peserta::class;
    }
    
    public function all(): array
    {
        return $this->model::all()->map(function ($peserta) {
            return new Peserta(
                $peserta->id,
                $peserta->nama,
                $peserta->kelas_id,
                $peserta->kecamatan,
                $peserta->kelurahan,
                $peserta->kategori
            );
        })->toArray();
    }
    
    public function find(int $id): ?Peserta
    {
        $peserta = $this->model::find($id);
        return $peserta ? new Peserta(
            $peserta->id,
            $peserta->nama,
            $peserta->kelas_id,
            $peserta->kecamatan,
            $peserta->kelurahan,
            $peserta->kategori
        ) : null;
    }
    
    public function findByKelasId(int $kelasId): array
    {
        return $this->model::where('kelas_id', $kelasId)->map(function ($peserta) {
            return new Peserta(
                $peserta->id,
                $peserta->nama,
                $peserta->kelas_id,
                $peserta->kecamatan,
                $peserta->kelurahan,
                $peserta->kategori
            );
        })->toArray();
    }
    
    public function findByKecamatanKelurahan(string $kecamatan, string $kelurahan): array
    {
        return $this->model::where('kecamatan', $kecamatan)
            ->where('kelurahan', $kelurahan)
            ->map(function ($peserta) {
                return new Peserta(
                    $peserta->id,
                    $peserta->nama,
                    $peserta->kelas_id,
                    $peserta->kecamatan,
                    $peserta->kelurahan,
                    $peserta->kategori
                );
            })->toArray();
    }
    
    public function findByKategori(string $kategori): array
    {
        return $this->model::where('kategori', $kategori)->map(function ($peserta) {
            return new Peserta(
                $peserta->id,
                $peserta->nama,
                $peserta->kelas_id,
                $peserta->kecamatan,
                $peserta->kelurahan,
                $peserta->kategori
            );
        })->toArray();
    }
    
    public function create(Peserta $peserta): Peserta
    {
        $this->model::create($peserta->toArray());
        return $this->model::where('id', $this->model::max('id'))->first();
    }
    
    public function update(Peserta $peserta): Peserta
    {
        $this->model::where('id', $peserta->id)->update($peserta->toArray());
        return $this->model::where('id', $peserta->id)->first();
    }
    
    public function delete(int $id): void
    {
        $this->model::where('id', $id)->delete();
    }
    
    public function toArray(): array
    {
        return [
            'id' => $this->model::get('id'),
            'nama' => $this->model::get('nama'),
            'kelas_id' => $this->model::get('kelas_id'),
            'kecamatan' => $this->model::get('kecamatan'),
            'kelurahan' => $this->model::get('kelurahan'),
            'kategori' => $this->model::get('kategori'),
        ];
    }
}