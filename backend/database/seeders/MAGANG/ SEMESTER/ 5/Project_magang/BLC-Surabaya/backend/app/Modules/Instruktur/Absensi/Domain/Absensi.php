<?php

namespace App\Modules\Instruktur\Absensi\Domain;

class Absensi
{
    public $id;
    public $peserta_id;
    public $kelas_id;
    public $tanggal;
    public $status;

    public function __construct($id, $peserta_id, $kelas_id, $tanggal, $status)
    {
        $this->id = $id;
        $this->peserta_id = $peserta_id;
        $this->kelas_id = $kelas_id;
        $this->tanggal = $tanggal;
        $this->status = $status;
    }
}