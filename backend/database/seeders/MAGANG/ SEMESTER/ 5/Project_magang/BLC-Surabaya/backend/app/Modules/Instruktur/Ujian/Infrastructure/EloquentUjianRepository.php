<?php

namespace App\Modules\Instruktur\Ujian\Infrastructure;

use App\Modules\Instruktur\Ujian\Domain\Ujian;
use App\Modules\Instruktur\Ujian\Contracts\UjianRepository;

class EloquentUjianRepository implements UjianRepository
{
    protected $model;
    
    public function __construct()
    {
        $this->model = \App\Models\Ujian::class;
    }
    
    public function all(): array
    {
        return $this->model::all()->map(function ($ujian) {
            return new Ujian(
                $ujian->id,
                $ujian->nama,
                $ujian->kelas_id,
                $ujian->pertemuan_ke,
                $ujian->soal_id
            );
        })->toArray();
    }
    
    public function find(int $id): ?Ujian
    {
        $ujian = $this->model::find($id);
        return $ujian ? new Ujian(
            $ujian->id,
            $ujian->nama,
            $ujian->kelas_id,
            $ujian->pertemuan_ke,
            $ujian->soal_id
        ) : null;
    }
    
    public function findByKelasId(int $kelasId): array
    {
        return $this->model::where('kelas_id', $kelasId)->map(function ($ujian) {
            return new Ujian(
                $ujian->id,
                $ujian->nama,
                $ujian->kelas_id,
                $ujian->pertemuan_ke,
                $ujian->soal_id
            );
        })->toArray();
    }
    
    public function findByPertemuanKe(int $pertemuanKe): array
    {
        return $this->model::where('pertemuan_ke', $pertemuanKe)->map(function ($ujian) {
            return new Ujian(
                $ujian->id,
                $ujian->nama,
                $ujian->kelas_id,
                $ujian->pertemuan_ke,
                $ujian->soal_id
            );
        })->toArray();
    }
    
    public function create(Ujian $ujian): Ujian
    {
        $this->model::create($ujian->toArray());
        return $this->model::where('id', $this->model::max('id'))->first();
    }
    
    public function update(Ujian $ujian): Ujian
    {
        $this->model::where('id', $ujian->id)->update($ujian->toArray());
        return $this->model::where('id', $ujian->id)->first();
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
            'pertemuan_ke' => $this->model::get('pertemuan_ke'),
            'soal_id' => $this->model::get('soal_id'),
        ];
    }
}