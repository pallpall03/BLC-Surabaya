<?php

namespace App\Modules\Koordinator\KoordinatorProfile\Domain;

class KoordinatorProfile
{
    public $kantor_ku_user_id;
    public $lokasi_blc_ids;

    public function __construct($kantor_ku_user_id, array $lokasi_blc_ids)
    {
        $this->kantor_ku_user_id = $kantor_ku_user_id;
        $this->lokasi_blc_ids = $lokasi_blc_ids;
    }
}