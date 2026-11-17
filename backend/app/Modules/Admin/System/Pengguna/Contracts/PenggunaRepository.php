<?php

namespace App\Modules\Admin\System\Pengguna\Contracts;

use App\Shared\Contracts\Repository;
use App\Modules\Admin\System\Pengguna\Domain\Pengguna;

/**
 * @extends Repository<Pengguna>
 */
interface PenggunaRepository extends Repository
{
    public function findByEmail(string $email): mixed;
    public function findByToken(string $token): mixed;
    public function createToken(int $userId, string $name, array $abilities = ['*']): string;
    public function revokeToken(int $userId, string $tokenId): void;
}
