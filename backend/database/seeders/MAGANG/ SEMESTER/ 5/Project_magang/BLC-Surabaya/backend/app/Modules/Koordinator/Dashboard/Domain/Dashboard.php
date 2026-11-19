<?php

namespace App\Modules\Koordinator\Dashboard\Domain;

class Dashboard
{
    public $totalPeserta;
    public $totalPengunjung;
    public $totalKelas;
    public $totalBLC;
    public $rekapHarian;
    public $rekapMingguan;
    public $rekapBulanan;
    public $rekapTahunan;
    public $rekapKegiatanLuarBLC;

    public function __construct($totalPeserta, $totalPengunjung, $totalKelas, $totalBLC, $rekapHarian, $rekapMingguan, $rekapBulanan, $rekapTahunan, $rekapKegiatanLuarBLC)
    {
        $this->totalPeserta = $totalPeserta;
        $this->totalPengunjung = $totalPengunjung;
        $this->totalKelas = $totalKelas;
        $this->totalBLC = $totalBLC;
        $this->rekapHarian = $rekapHarian;
        $this->rekapMingguan = $rekapMingguan;
        $this->rekapBulanan = $rekapBulanan;
        $this->rekapTahunan = $rekapTahunan;
        $this->rekapKegiatanLuarBLC = $rekapKegiatanLuarBLC;
    }
}