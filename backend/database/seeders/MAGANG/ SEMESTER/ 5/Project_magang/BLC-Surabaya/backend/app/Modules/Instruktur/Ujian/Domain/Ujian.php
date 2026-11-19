<?php

namespace App\Modules\Instruktur\Ujian\Domain;

class Ujian
{
    public $id;
    public $nama;
    public $kelas_id;
    public $pertemuan_ke;
    public $soal_id;

    public function __construct($id, $nama, $kelas_id, $pertemuan_ke, $soal_id)
    {
        $this->id = $id;
        $this->nama = $nama;
        $this->kelas_id = $kelas_id;
        $this->pertemuan_ke = $pertemuan_ke;
        $this->soal_id = $soal_id;
    }
}