<?php

namespace App\Modules\Koordinator\Pengguna\Contracts;

use App\Modules\Koordinator\Pengguna\Domain\Pengguna;
use App\Modules\Koordinator\Pengguna\Domain\ValueObjects\PenggunaId;

interface PenggunaRepositoryInterface
{
    public function all(): array;
    public function find(PenggunaId $id): ?Pengguna;
    public function findByUsername(string $username): ?Pengguna;
    public function findByEmail(string $email): ?Pengguna;
    public function findByPeran(string $peran): array;
    public function create(array $data): Pengguna;
    public function update(PenggunaId $id, array $data): Pengguna;
    public function delete(PenggunaId $id): void;
    public function updateLastLogin(PenggunaId $id): void;
}