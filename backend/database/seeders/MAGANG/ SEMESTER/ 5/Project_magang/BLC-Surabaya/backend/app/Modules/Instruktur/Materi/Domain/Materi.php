<?php

namespace App\Modules\Instruktur\Materi\Domain;

class Materi
{
    public $id;
    public $judul;
    public $deskripsi;
    public $file_pdf;
    public $pertemuan_ke;
    public $kelas_id;

    public function __construct($id, $judul, $deskripsi, $file_pdf, $pertemuan_ke, $kelas_id)
    {
        $this->id = $id;
        $this->judul = $judul;
        $this->deskripsi = $deskripsi;
        $this->file_pdf = $file_pdf;
        $this->pertemuan_ke = $pertemuan_ke;
        $this->kelas_id = $kelas_id;
    }
}