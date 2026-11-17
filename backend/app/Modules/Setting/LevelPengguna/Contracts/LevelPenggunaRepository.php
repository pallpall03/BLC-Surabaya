<?php

namespace App\Modules\Setting\LevelPengguna\Contracts;

use App\Shared\Contracts\Repository;
use App\Modules\Setting\LevelPengguna\Domain\LevelPengguna;

/**
 * @extends Repository<LevelPengguna>
 */
interface LevelPenggunaRepository extends Repository
{
    public function findBySlug(string $slug): mixed;
}
