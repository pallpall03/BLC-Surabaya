<?php

namespace App\Modules\Admin\Konten\Contracts;

use App\Shared\Contracts\Repository;
use App\Modules\Admin\Konten\Domain\Konten;

/**
 * @extends Repository<Konten>
 */
interface KontenRepository extends Repository
{
    public function getByParent(?int $parentId): array;
    public function getAktif(): array;
    public function getOrdered(): array;
    public function getTree(): array;
    public function getBySlug(string $slug): ?Konten;
}