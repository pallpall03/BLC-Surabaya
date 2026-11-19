<?php

namespace App\Modules\Instruktur\InstrukturProfile\Domain;

class InstrukturProfile
{
    public $kantor_ku_user_id;
    public $lokasi_blc_id;

    public function __construct($kantor_ku_user_id, $lokasi_blc_id)
    {
        $this->kantor_ku_user_id = $kantor_ku_user_id;
        $this->lokasi_blc_id = $lokasi_blc_id;
    }
}