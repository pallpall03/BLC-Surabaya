<?php

namespace App\Modules\Instruktur\Peserta\Domain;

class Peserta
{
    public $id;
    public $nama;
    public $kelas_id;
    public $kecamatan;
    public $kelurahan;
    public $kategori;

    public function __construct($id, $nama, $kelas_id, $kecamatan, $kelurahan, $kategori)
    {
        $this->id = $id;
        $this->nama = $nama;
        $this->kelas_id = $kelas_id;
        $this->kecamatan = $kecamatan;
        $this->kelurahan = $kelurahan;
        $this->kategori = $kategori;
    }
}