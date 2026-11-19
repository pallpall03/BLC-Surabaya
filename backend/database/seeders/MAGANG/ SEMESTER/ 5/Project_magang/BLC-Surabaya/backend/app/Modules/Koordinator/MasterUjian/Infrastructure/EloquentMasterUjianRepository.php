<?php

namespace App\Modules\Koordinator\MasterUjian\Infrastructure;

use App\Modules\Koordinator\MasterUjian\Domain\MasterUjian;
use App\Modules\Koordinator\MasterUjian\Contracts\MasterUjianRepository;

class EloquentMasterUjianRepository implements MasterUjianRepository
{
    protected $model;
    
    public function __construct()
    {
        $this->model = \App\Models\MasterUjian::class;
    }
    
    public function all(): array
    {
        return $this->model::all()->map(function ($ujian) {
            return new MasterUjian(
                $ujian->id,
                $ujian->nama,
                $ujian->pertemuan_ke,
                $ujian->soal
            );
        })->toArray();
    }
    
    public function find(int $id): ?MasterUjian
    {
        $ujian = $this->model::find($id);
        return $ujian ? new MasterUjian(
            $ujian->id,
            $ujian->nama,
            $ujian->pertemuan_ke,
            $ujian->soal
        ) : null;
    }
    
    public function findByPertemuanKe(int $pertemuanKe): array
    {
        return $this->model::where('pertemuan_ke', $pertemuanKe)->map(function ($ujian) {
            return new MasterUjian(
                $ujian->id,
                $ujian->nama,
                $ujian->pertemuan_ke,
                $ujian->soal
            );
        })->toArray();
    }
    
    public function create(MasterUjian $ujian): MasterUjian
    {
        $this->model::create($ujian->toArray());
        return $this->model::where('id', $this->model::max('id'))->first();
    }
    
    public function update(MasterUjian $ujian): MasterUjian
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
            'pertemuan_ke' => $this->model::get('pertemuan_ke'),
            'soal' => $this->model::get('soal'),
        ];
    }
}