<?php

namespace App\Modules\Setting\HakAkses\Contracts;

use App\Shared\Contracts\Repository;
use App\Modules\Setting\HakAkses\Domain\HakAkses;

/**
 * @extends Repository<HakAkses>
 */
interface HakAksesRepository extends Repository
{
    public function findByLevelAndModulAksi(int $levelPenggunaId, string $modul, string $aksi): mixed;
    public function getByLevel(int $levelPenggunaId): array;
}
