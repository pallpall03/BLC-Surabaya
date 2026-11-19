<?php

namespace App\Modules\Instruktur\Sesi\Domain;

class Sesi
{
    public $id;
    public $nama;
    public $tanggal_mulai;
    public $tanggal_selesai;
    public $lokasi_blc_id;
    public $status;

    public function __construct($id, $nama, $tanggal_mulai, $tanggal_selesai, $lokasi_blc_id, $status)
    {
        $this->id = $id;
        $this->nama = $nama;
        $this->tanggal_mulai = $tanggal_mulai;
        $this->tanggal_selesai = $tanggal_selesai;
        $this->lokasi_blc_id = $lokasi_blc_id;
        $this->status = $status;
    }
}