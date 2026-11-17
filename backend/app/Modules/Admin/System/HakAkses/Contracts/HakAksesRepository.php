<?php

namespace App\Modules\Admin\System\HakAkses\Contracts;

use App\Shared\Contracts\Repository;
use App\Modules\Admin\System\HakAkses\Domain\HakAkses;

/**
 * @extends Repository<HakAkses>
 */
interface HakAksesRepository extends Repository
{
    public function findByLevelAndModulAksi(int $levelPenggunaId, string $modul, string $aksi): mixed;
    public function getByLevel(int $levelPenggunaId): array;
}
