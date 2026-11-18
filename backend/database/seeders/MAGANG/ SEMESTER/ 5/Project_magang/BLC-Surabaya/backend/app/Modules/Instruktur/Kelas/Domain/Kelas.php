<?php

namespace App\Modules\Instruktur\Kelas\Domain;

class Kelas
{
    public $id;
    public $nama;
    public $tanggal_pembuatan;
    public $lokasi_blc_id;
    public $sesi_id;

    public function __construct($id, $nama, $tanggal_pembuatan, $lokasi_blc_id, $sesi_id)
    {
        $this->id = $id;
        $this->nama = $nama;
        $this->tanggal_pembuatan = $tanggal_pembuatan;
        $this->lokasi_blc_id = $lokasi_blc_id;
        $this->sesi_id = $sesi_id;
    }
}