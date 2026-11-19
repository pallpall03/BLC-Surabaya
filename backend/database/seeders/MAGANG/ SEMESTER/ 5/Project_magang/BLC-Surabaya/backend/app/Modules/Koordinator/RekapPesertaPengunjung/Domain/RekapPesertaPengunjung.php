<?php

namespace App\Modules\Koordinator\RekapPesertaPengunjung\Domain;

class RekapPesertaPengunjung
{
    public $id;
    public $lokasi_blc_id;
    public $tanggal;
    public $total_peserta;
    public $total_pengunjung;

    public function __construct($id, $lokasi_blc_id, $tanggal, $total_peserta, $total_pengunjung)
    {
        $this->id = $id;
        $this->lokasi_blc_id = $lokasi_blc_id;
        $this->tanggal = $tanggal;
        $this->total_peserta = $total_peserta;
        $this->total_pengunjung = $total_pengunjung;
    }
}