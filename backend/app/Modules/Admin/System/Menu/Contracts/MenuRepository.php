<?php

namespace App\Modules\Admin\System\Menu\Contracts;

use App\Shared\Contracts\Repository;
use App\Modules\Admin\System\Menu\Domain\Menu;

/**
 * @extends Repository<Menu>
 */
interface MenuRepository extends Repository
{
    public function getByParent(?int $parentId): array;
    public function getAktif(): array;
    public function getOrdered(): array;
    public function getTree(): array; // nested hierarchy
}
