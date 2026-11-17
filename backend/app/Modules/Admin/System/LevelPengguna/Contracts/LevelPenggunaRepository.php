<?php

namespace App\Modules\Admin\System\LevelPengguna\Contracts;

use App\Shared\Contracts\Repository;
use App\Modules\Admin\System\LevelPengguna\Domain\LevelPengguna;

/**
 * @extends Repository<LevelPengguna>
 */
interface LevelPenggunaRepository extends Repository
{
    public function findBySlug(string $slug): mixed;
}
