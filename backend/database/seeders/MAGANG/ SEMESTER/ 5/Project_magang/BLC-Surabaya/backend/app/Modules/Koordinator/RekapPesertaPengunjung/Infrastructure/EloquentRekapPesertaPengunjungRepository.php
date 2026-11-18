<?php

namespace App\Modules\Koordinator\RekapPesertaPengunjung\Infrastructure;

use App\Modules\Koordinator\RekapPesertaPengunjung\Domain\RekapPesertaPengunjung;
use App\Modules\Koordinator\RekapPesertaPengunjung\Contracts\RekapPesertaPengunjungRepository;

class EloquentRekapPesertaPengunjungRepository implements RekapPesertaPengunjungRepository
{
    protected $model;
    
    public function __construct()
    {
        $this->model = \App\Models\RekapPesertaPengunjung::class;
    }
    
    public function all(): array
    {
        return $this->model::all()->map(function ($rekap) {
            return new RekapPesertaPengunjung(
                $rekap->id,
                $rekap->lokasi_blc_id,
                $rekap->tanggal,
                $rekap->total_peserta,
                $rekap->total_pengunjung
            );
        })->toArray();
    }
    
    public function find(int $id): ?RekapPesertaPengunjung
    {
        $rekap = $this->model::find($id);
        return $rekap ? new RekapPesertaPengunjung(
            $rekap->id,
            $rekap->lokasi_blc_id,
            $rekap->tanggal,
            $rekap->total_peserta,
            $rekap->total_pengunjung
        ) : null;
    }
    
    public function findByLokasiBlcId(int $lokasiBlcId): array
    {
        return $this->model::where('lokasi_blc_id', $lokasiBlcId)->map(function ($rekap) {
            return new RekapPesertaPengunjung(
                $rekap->id,
                $rekap->lokasi_blc_id,
                $rekap->tanggal,
                $rekap->total_peserta,
                $rekap->total_pengunjung
            );
        })->toArray();
    }
    
    public function findByTanggal(string $tanggal): array
    {
        return $this->model::where('tanggal', $tanggal)->map(function ($rekap) {
            return new RekapPesertaPengunjung(
                $rekap->id,
                $rekap->lokasi_blc_id,
                $rekap->tanggal,
                $rekap->total_peserta,
                $rekap->total_pengunjung
            );
        })->toArray();
    }
    
    public function findByBulanTahun(int $bulan, int $tahun): array
    {
        return $this->model::whereMonth('tanggal', $bulan)
            ->whereYear('tanggal', $tahun)
            ->map(function ($rekap) {
                return new RekapPesertaPengunjung(
                    $rekap->id,
                    $rekap->lokasi_blc_id,
                    $rekap->tanggal,
                    $rekap->total_peserta,
                    $rekap->total_pengunjung
                );
            })->toArray();
    }
    
    public function create(RekapPesertaPengunjung $rekap): RekapPesertaPengunjung
    {
        $this->model::create($rekap->toArray());
        return $this->model::where('id', $this->model::max('id'))->first();
    }
    
    public function update(RekapPesertaPengunjung $rekap): RekapPesertaPengunjung
    {
        $this->model::where('id', $rekap->id)->update($rekap->toArray());
        return $this->model::where('id', $rekap->id)->first();
    }
    
    public function delete(int $id): void
    {
        $this->model::where('id', $id)->delete();
    }
    
    public function toArray(): array
    {
        return [
            'id' => $this->model::get('id'),
            'lokasi_blc_id' => $this->model::get('lokasi_blc_id'),
            'tanggal' => $this->model::get('tanggal'),
            'total_peserta' => $this->model::get('total_peserta'),
            'total_pengunjung' => $this->model::get('total_pengunjung'),
        ];
    }
}