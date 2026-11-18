<?php

namespace App\Modules\Koordinator\KategoriPeserta\Infrastructure;

use App\Modules\Koordinator\KategoriPeserta\Domain\KategoriPeserta;
use App\Modules\Koordinator\KategoriPeserta\Contracts\KategoriPesertaRepository;

class EloquentKategoriPesertaRepository implements KategoriPesertaRepository
{
    protected $model;
    
    public function __construct()
    {
        $this->model = \App\Models\KategoriPeserta::class;
    }
    
    public function all(): array
    {
        return $this->model::all()->map(function ($kategori) {
            return new KategoriPeserta(
                $kategori->id,
                $kategori->nama,
                $kategori->deskripsi
            );
        })->toArray();
    }
    
    public function find(int $id): ?KategoriPeserta
    {
        $kategori = $this->model::find($id);
        return $kategori ? new KategoriPeserta(
            $kategori->id,
            $kategori->nama,
            $kategori->deskripsi
        ) : null;
    }
    
    public function findByNama(string $nama): ?KategoriPeserta
    {
        $kategori = $this->model::where('nama', $nama)->first();
        return $kategori ? new KategoriPeserta(
            $kategori->id,
            $kategori->nama,
            $kategori->deskripsi
        ) : null;
    }
    
    public function create(KategoriPeserta $kategori): KategoriPeserta
    {
        $this->model::create($kategori->toArray());
        return $this->model::where('id', $this->model::max('id'))->first();
    }
    
    public function update(KategoriPeserta $kategori): KategoriPeserta
    {
        $this->model::where('id', $kategori->id)->update($kategori->toArray());
        return $this->model::where('id', $kategori->id)->first();
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
            'deskripsi' => $this->model::get('deskripsi'),
        ];
    }
}