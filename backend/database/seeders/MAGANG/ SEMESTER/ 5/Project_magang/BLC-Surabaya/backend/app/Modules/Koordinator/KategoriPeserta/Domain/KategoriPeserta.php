<?php

namespace App\Modules\Koordinator\KategoriPeserta\Domain;

class KategoriPeserta
{
    public $id;
    public $nama;
    public $deskripsi;

    public function __construct($id, $nama, $deskripsi)
    {
        $this->id = $id;
        $this->nama = $nama;
        $this->deskripsi = $deskripsi;
    }
}