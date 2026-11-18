<?php

namespace App\Modules\Koordinator\Dashboard\Infrastructure;

use App\Modules\Koordinator\Dashboard\Domain\Dashboard;
use App\Modules\Koordinator\Dashboard\Contracts\DashboardRepository;

class EloquentDashboardRepository implements DashboardRepository
{
    protected $model;
    
    public function __construct()
    {
        $this->model = \App\Models\Dashboard::class;
    }
    
    public function all(): array
    {
        return $this->model::all()->map(function ($dashboard) {
            return new Dashboard(
                $dashboard->total_peserta,
                $dashboard->total_pengunjung,
                $dashboard->total_kelas,
                $dashboard->total_blc,
                $dashboard->rekap_harian,
                $dashboard->rekap_mingguan,
                $dashboard->rekap_bulanan,
                $dashboard->rekap_tahunan,
                $dashboard->rekap_kegiatan_luar_blc
            );
        })->toArray();
    }
    
    public function find(int $id): ?Dashboard
    {
        $dashboard = $this->model::find($id);
        return $dashboard ? new Dashboard(
            $dashboard->total_peserta,
            $dashboard->total_pengunjung,
            $dashboard->total_kelas,
            $dashboard->total_blc,
            $dashboard->rekap_harian,
            $dashboard->rekap_mingguan,
            $dashboard->rekap_bulanan,
            $dashboard->rekap_tahunan,
            $dashboard->rekap_kegiatan_luar_blc
        ) : null;
    }
    
    public function getDashboardData(): array
    {
        $dashboard = $this->model::first();
        return $dashboard ? [
            'totalPeserta' => $dashboard->total_peserta,
            'totalPengunjung' => $dashboard->total_pengunjung,
            'totalKelas' => $dashboard->total_kelas,
            'totalBLC' => $dashboard->total_blc,
            'rekapHarian' => $dashboard->rekap_harian,
            'rekapMingguan' => $dashboard->rekap_mingguan,
            'rekapBulanan' => $dashboard->rekap_bulanan,
            'rekapTahunan' => $dashboard->rekap_tahunan,
            'rekapKegiatanLuarBLC' => $dashboard->rekap_kegiatan_luar_blc,
        ] : [];
    }
    
    public function create(Dashboard $dashboard): Dashboard
    {
        $this->model::create($dashboard->toArray());
        return $this->model::where('id', $this->model::max('id'))->first();
    }
    
    public function update(Dashboard $dashboard): Dashboard
    {
        $this->model::where('id', $dashboard->id)->update($dashboard->toArray());
        return $this->model::where('id', $dashboard->id)->first();
    }
    
    public function delete(int $id): void
    {
        $this->model::where('id', $id)->delete();
    }
    
    public function toArray(): array
    {
        return [
            'totalPeserta' => $this->model::get('total_peserta'),
            'totalPengunjung' => $this->model::get('total_pengunjung'),
            'totalKelas' => $this->model::get('total_kelas'),
            'totalBLC' => $this->model::get('total_blc'),
            'rekapHarian' => $this->model::get('rekap_harian'),
            'rekapMingguan' => $this->model::get('rekap_mingguan'),
            'rekapBulanan' => $this->model::get('rekap_bulanan'),
            'rekapTahunan' => $this->model::get('rekap_tahunan'),
            'rekapKegiatanLuarBLC' => $this->model::get('rekap_kegiatan_luar_blc'),
        ];
    }
}