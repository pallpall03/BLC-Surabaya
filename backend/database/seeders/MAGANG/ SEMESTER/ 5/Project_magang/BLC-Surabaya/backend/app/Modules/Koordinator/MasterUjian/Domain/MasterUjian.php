<?php

namespace App\Modules\Koordinator\MasterUjian\Domain;

class MasterUjian
{
    public $id;
    public $nama;
    public $pertemuan_ke;
    public $soal;

    public function __construct($id, $nama, $pertemuan_ke, $soal)
    {
        $this->id = $id;
        $this->nama = $nama;
        $this->pertemuan_ke = $pertemuan_ke;
        $this->soal = $soal;
    }
}