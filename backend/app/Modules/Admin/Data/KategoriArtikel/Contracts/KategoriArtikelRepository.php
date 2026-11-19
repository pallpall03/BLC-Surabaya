<?php

namespace App\Modules\Admin\Data\KategoriArtikel\Contracts;

use App\Shared\Contracts\Repository;
use App\Modules\Admin\Data\KategoriArtikel\Domain\KategoriArtikel;

/**
 * @extends Repository<KategoriArtikel>
 */
interface KategoriArtikelRepository extends Repository
{
    public function getAktif(): array;
}
