<?php

namespace App\Modules\Instruktur\Sesi\Infrastructure;

use App\Modules\Instruktur\Sesi\Domain\Sesi;
use App\Modules\Instruktur\Sesi\Contracts\SesiRepository;

class EloquentSesiRepository implements SesiRepository
{
    protected $model;
    
    public function __construct()
    {
        $this->model = \App\Models\Sesi::class;
    }
    
    public function all(): array
    {
        return $this->model::all()->map(function ($sesi) {
            return new Sesi(
                $sesi->id,
                $sesi->nama,
                $sesi->tanggal_mulai,
                $sesi->tanggal_selesai,
                $sesi->lokasi_blc_id,
                $sesi->status
            );
        })->toArray();
    }
    
    public function find(int $id): ?Sesi
    {
        $sesi = $this->model::find($id);
        return $sesi ? new Sesi(
            $sesi->id,
            $sesi->nama,
            $sesi->tanggal_mulai,
            $sesi->tanggal_selesai,
            $sesi->lokasi_blc_id,
            $sesi->status
        ) : null;
    }
    
    public function findByLokasiBlcId(int $lokasiBlcId): array
    {
        return $this->model::where('lokasi_blc_id', $lokasiBlcId)->map(function ($sesi) {
            return new Sesi(
                $sesi->id,
                $sesi->nama,
                $sesi->tanggal_mulai,
                $sesi->tanggal_selesai,
                $sesi->lokasi_blc_id,
                $sesi->status
            );
        })->toArray();
    }
    
    public function create(Sesi $sesi): Sesi
    {
        $this->model::create($sesi->toArray());
        return $this->model::where('id', $this->model::max('id'))->first();
    }
    
    public function update(Sesi $sesi): Sesi
    {
        $this->model::where('id', $sesi->id)->update($sesi->toArray());
        return $this->model::where('id', $sesi->id)->first();
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
            'tanggal_mulai' => $this->model::get('tanggal_mulai'),
            'tanggal_selesai' => $this->model::get('tanggal_selesai'),
            'lokasi_blc_id' => $this->model::get('lokasi_blc_id'),
            'status' => $this->model::get('status'),
        ];
    }
}