<?php

namespace App\Modules\Instruktur\Kelas\Infrastructure;

use App\Modules\Instruktur\Kelas\Domain\Kelas;
use App\Modules\Instruktur\Kelas\Contracts\KelasRepository;

class EloquentKelasRepository implements KelasRepository
{
    protected $model;
    
    public function __construct()
    {
        $this->model = \App\Models\Kelas::class;
    }
    
    public function all(): array
    {
        return $this->model::all()->map(function ($kelas) {
            return new Kelas(
                $kelas->id,
                $kelas->nama,
                $kelas->tanggal_pembuatan,
                $kelas->lokasi_blc_id,
                $kelas->sesi_id
            );
        })->toArray();
    }
    
    public function find(int $id): ?Kelas
    {
        $kelas = $this->model::find($id);
        return $kelas ? new Kelas(
            $kelas->id,
            $kelas->nama,
            $kelas->tanggal_pembuatan,
            $kelas->lokasi_blc_id,
            $kelas->sesi_id
        ) : null;
    }
    
    public function findByLokasiBlcId(int $lokasiBlcId): array
    {
        return $this->model::where('lokasi_blc_id', $lokasiBlcId)->map(function ($kelas) {
            return new Kelas(
                $kelas->id,
                $kelas->nama,
                $kelas->tanggal_pembuatan,
                $kelas->lokasi_blc_id,
                $kelas->sesi_id
            );
        })->toArray();
    }
    
    public function findBySesiId(int $sesiId): array
    {
        return $this->model::where('sesi_id', $sesiId)->map(function ($kelas) {
            return new Kelas(
                $kelas->id,
                $kelas->nama,
                $kelas->tanggal_pembuatan,
                $kelas->lokasi_blc_id,
                $kelas->sesi_id
            );
        })->toArray();
    }
    
    public function create(Kelas $kelas): Kelas
    {
        $this->model::create($kelas->toArray());
        return $this->model::where('id', $this->model::max('id'))->first();
    }
    
    public function update(Kelas $kelas): Kelas
    {
        $this->model::where('id', $kelas->id)->update($kelas->toArray());
        return $this->model::where('id', $kelas->id)->first();
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
            'tanggal_pembuatan' => $this->model::get('tanggal_pembuatan'),
            'lokasi_blc_id' => $this->model::get('lokasi_blc_id'),
            'sesi_id' => $this->model::get('sesi_id'),
        ];
    }
}