<?php

namespace App\Modules\Instruktur\Materi\Infrastructure;

use App\Modules\Instruktur\Materi\Domain\Materi;
use App\Modules\Instruktur\Materi\Contracts\MateriRepository;

class EloquentMateriRepository implements MateriRepository
{
    protected $model;
    
    public function __construct()
    {
        $this->model = \App\Models\Materi::class;
    }
    
    public function all(): array
    {
        return $this->model::all()->map(function ($materi) {
            return new Materi(
                $materi->id,
                $materi->judul,
                $materi->deskripsi,
                $materi->file_pdf,
                $materi->pertemuan_ke,
                $materi->kelas_id
            );
        })->toArray();
    }
    
    public function find(int $id): ?Materi
    {
        $materi = $this->model::find($id);
        return $materi ? new Materi(
            $materi->id,
            $materi->judul,
            $materi->deskripsi,
            $materi->file_pdf,
            $materi->pertemuan_ke,
            $materi->kelas_id
        ) : null;
    }
    
    public function findByKelasId(int $kelasId): array
    {
        return $this->model::where('kelas_id', $kelasId)->map(function ($materi) {
            return new Materi(
                $materi->id,
                $materi->judul,
                $materi->deskripsi,
                $materi->file_pdf,
                $materi->pertemuan_ke,
                $materi->kelas_id
            );
        })->toArray();
    }
    
    public function findByPertemuanKe(int $pertemuanKe): array
    {
        return $this->model::where('pertemuan_ke', $pertemuanKe)->map(function ($materi) {
            return new Materi(
                $materi->id,
                $materi->judul,
                $materi->deskripsi,
                $materi->file_pdf,
                $materi->pertemuan_ke,
                $materi->kelas_id
            );
        })->toArray();
    }
    
    public function create(Materi $materi): Materi
    {
        $this->model::create($materi->toArray());
        return $this->model::where('id', $this->model::max('id'))->first();
    }
    
    public function update(Materi $materi): Materi
    {
        $this->model::where('id', $materi->id)->update($materi->toArray());
        return $this->model::where('id', $materi->id)->first();
    }
    
    public function delete(int $id): void
    {
        $this->model::where('id', $id)->delete();
    }
    
    public function toArray(): array
    {
        return [
            'id' => $this->model::get('id'),
            'judul' => $this->model::get('judul'),
            'deskripsi' => $this->model::get('deskripsi'),
            'file_pdf' => $this->model::get('file_pdf'),
            'pertemuan_ke' => $this->model::get('pertemuan_ke'),
            'kelas_id' => $this->model::get('kelas_id'),
        ];
    }
}