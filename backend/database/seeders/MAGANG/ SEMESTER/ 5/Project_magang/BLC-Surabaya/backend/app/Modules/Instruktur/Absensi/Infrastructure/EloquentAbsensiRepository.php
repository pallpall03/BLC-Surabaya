<?php

namespace App\Modules\Instruktur\Absensi\Infrastructure;

use App\Modules\Instruktur\Absensi\Domain\Absensi;
use App\Modules\Instruktur\Absensi\Contracts\AbsensiRepository;

class EloquentAbsensiRepository implements AbsensiRepository
{
    protected $model;
    
    public function __construct()
    {
        $this->model = \App\Models\Absensi::class;
    }
    
    public function all(): array
    {
        return $this->model::all()->map(function ($absensi) {
            return new Absensi(
                $absensi->id,
                $absensi->peserta_id,
                $absensi->kelas_id,
                $absensi->tanggal,
                $absensi->status
            );
        })->toArray();
    }
    
    public function find(int $id): ?Absensi
    {
        $absensi = $this->model::find($id);
        return $absensi ? new Absensi(
            $absensi->id,
            $absensi->peserta_id,
            $absensi->kelas_id,
            $absensi->tanggal,
            $absensi->status
        ) : null;
    }
    
    public function findByKelasId(int $kelasId): array
    {
        return $this->model::where('kelas_id', $kelasId)->map(function ($absensi) {
            return new Absensi(
                $absensi->id,
                $absensi->peserta_id,
                $absensi->kelas_id,
                $absensi->tanggal,
                $absensi->status
            );
        })->toArray();
    }
    
    public function findByPesertaId(int $pesertaId): array
    {
        return $this->model::where('peserta_id', $pesertaId)->map(function ($absensi) {
            return new Absensi(
                $absensi->id,
                $absensi->peserta_id,
                $absensi->kelas_id,
                $absensi->tanggal,
                $absensi->status
            );
        })->toArray();
    }
    
    public function findByTanggal(string $tanggal): array
    {
        return $this->model::where('tanggal', $tanggal)->map(function ($absensi) {
            return new Absensi(
                $absensi->id,
                $absensi->peserta_id,
                $absensi->kelas_id,
                $absensi->tanggal,
                $absensi->status
            );
        })->toArray();
    }
    
    public function create(Absensi $absensi): Absensi
    {
        $this->model::create($absensi->toArray());
        return $this->model::where('id', $this->model::max('id'))->first();
    }
    
    public function update(Absensi $absensi): Absensi
    {
        $this->model::where('id', $absensi->id)->update($absensi->toArray());
        return $this->model::where('id', $absensi->id)->first();
    }
    
    public function delete(int $id): void
    {
        $this->model::where('id', $id)->delete();
    }
    
    public function toArray(): array
    {
        return [
            'id' => $this->model::get('id'),
            'peserta_id' => $this->model::get('peserta_id'),
            'kelas_id' => $this->model::get('kelas_id'),
            'tanggal' => $this->model::get('tanggal'),
            'status' => $this->model::get('status'),
        ];
    }
}