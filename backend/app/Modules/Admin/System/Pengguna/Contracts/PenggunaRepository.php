<?php

namespace App\Modules\Admin\System\Pengguna\Contracts;

use App\Shared\Contracts\Repository;
use App\Modules\Admin\System\Pengguna\Domain\Pengguna;

/**
 * @extends Repository<Pengguna>
 */
interface PenggunaRepository extends Repository
{
    public function getAktif(): array;
    public function getByEmail(string $email): ?Pengguna;
    public function getByRole(string $roleSlug): array;
    public function createWithRole(array $data, string $roleSlug): Pengguna;
}