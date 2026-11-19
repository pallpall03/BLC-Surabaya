<?php

namespace App\Modules\Admin\Data\Artikel\Contracts;

use App\Shared\Contracts\Repository;
use App\Modules\Admin\Data\Artikel\Domain\Artikel;

/**
 * @extends Repository<Artikel>
 */
interface ArtikelRepository extends Repository
{
    public function getByKategori(int $kategoriArtikelId): array;
    public function getLatest(int $limit = 10): array;
    public function getArtikelWithFotos(int $id): mixed;
    public function getAktif(): array;
}
