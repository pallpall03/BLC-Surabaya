<?php

namespace App\Modules\Admin\Data\BukuTamu\Contracts;

use App\Modules\Admin\Data\BukuTamu\Domain\BukuTamu;
use App\Shared\Contracts\Repository;

interface BukuTamuRepository extends Repository
{
    public function all(): array;

    public function find(int $id): ?BukuTamu;

    public function create(array $data): BukuTamu;

    public function update(int $id, array $data): BukuTamu;

    public function delete(int $id): void;

    public function getAktif(): array;

    public function getByUrutan(): array;
}