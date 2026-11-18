<?php

namespace App\Modules\Instruktur\LaporanKegiatan\Infrastructure;

use App\Modules\Instruktur\LaporanKegiatan\Domain\LaporanKegiatan;
use App\Modules\Instruktur\LaporanKegiatan\Contracts\LaporanKegiatanRepository;

class EloquentLaporanKegiatanRepository implements LaporanKegiatanRepository
{
    protected $model;
    
    public function __construct()
    {
        $this->model = \App\Models\LaporanKegiatan::class;
    }
    
    public function all(): array
    {
        return $this->model::all()->map(function ($laporan) {
            return new LaporanKegiatan(
                $laporan->id,
                $laporan->kelas_id,
                $laporan->tanggal,
                $laporan->kecamatan,
                $laporan->kelurahan,
                $laporan->deskripsi
            );
        })->toArray();
    }
    
    public function find(int $id): ?LaporanKegiatan
    {
        $laporan = $this->model::find($id);
        return $laporan ? new LaporanKegiatan(
            $laporan->id,
            $laporan->kelas_id,
            $laporan->tanggal,
            $laporan->kecamatan,
            $laporan->kelurahan,
            $laporan->deskripsi
        ) : null;
    }
    
    public function findByKelasId(int $kelasId): array
    {
        return $this->model::where('kelas_id', $kelasId)->map(function ($laporan) {
            return new LaporanKegiatan(
                $laporan->id,
                $laporan->kelas_id,
                $laporan->tanggal,
                $laporan->kecamatan,
                $laporan->kelurahan,
                $laporan->deskripsi
            );
        })->toArray();
    }
    
    public function findByTanggal(string $tanggal): array
    {
        return $this->model::where('tanggal', $tanggal)->map(function ($laporan) {
            return new LaporanKegiatan(
                $laporan->id,
                $laporan->kelas_id,
                $laporan->tanggal,
                $laporan->kecamatan,
                $laporan->kelurahan,
                $laporan->deskripsi
            );
        })->toArray();
    }
    
    public function findByBulanTahun(int $bulan, int $tahun): array
    {
        return $this->model::whereMonth('tanggal', $bulan)
            ->whereYear('tanggal', $tahun)
            ->map(function ($laporan) {
                return new LaporanKegiatan(
                    $laporan->id,
                    $laporan->kelas_id,
                    $laporan->tanggal,
                    $laporan->kecamatan,
                    $laporan->kelurahan,
                    $laporan->deskripsi
                );
            })->toArray();
    }
    
    public function create(LaporanKegiatan $laporan): LaporanKegiatan
    {
        $this->model::create($laporan->toArray());
        return $this->model::where('id', $this->model::max('id'))->first();
    }
    
    public function update(LaporanKegiatan $laporan): LaporanKegiatan
    {
        $this->model::where('id', $laporan->id)->update($laporan->toArray());
        return $this->model::where('id', $laporan->id)->first();
    }
    
    public function delete(int $id): void
    {
        $this->model::where('id', $id)->delete();
    }
    
    public function toArray(): array
    {
        return [
            'id' => $this->model::get('id'),
            'kelas_id' => $this->model::get('kelas_id'),
            'tanggal' => $this->model::get('tanggal'),
            'kecamatan' => $this->model::get('kecamatan'),
            'kelurahan' => $this->model::get('kelurahan'),
            'deskripsi' => $this->model::get('deskripsi'),
        ];
    }
}