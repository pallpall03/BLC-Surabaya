<?php

namespace App\Modules\Instruktur\LaporanKegiatan\Domain;

class LaporanKegiatan
{
    public $id;
    public $kelas_id;
    public $tanggal;
    public $kecamatan;
    public $kelurahan;
    public $deskripsi;

    public function __construct($id, $kelas_id, $tanggal, $kecamatan, $kelurahan, $deskripsi)
    {
        $this->id = $id;
        $this->kelas_id = $kelas_id;
        $this->tanggal = $tanggal;
        $this->kecamatan = $kecamatan;
        $this->kelurahan = $kelurahan;
        $this->deskripsi = $deskripsi;
    }
}