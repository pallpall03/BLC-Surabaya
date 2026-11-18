<?php

namespace App\Modules\Auth\Contracts;

use App\Modules\Admin\System\Pengguna\Infrastructure\PenggunaModel;

interface UserRepository
{
    public function findByEmail(string $email): ?PenggunaModel;

    /**
     * @param  array{name: string, email: string, password: string}  $data
     */
    public function createWithRole(array $data, string $roleSlug): PenggunaModel;
}
