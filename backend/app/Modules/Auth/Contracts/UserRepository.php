<?php

namespace App\Modules\Auth\Contracts;

use App\Models\User;

interface UserRepository
{
    /** Login memakai NIK (16 digit). */
    public function findByNik(string $nik): ?User;

    /** Pencarian email tidak peka huruf besar/kecil. */
    public function findByEmail(string $email): ?User;

    /**
     * @param  array{name: string, nik: string, email: string, password: string}  $data
     */
    public function createWithRole(array $data, string $roleSlug): User;
}
