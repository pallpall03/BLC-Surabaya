<?php

namespace App\Modules\Instruktur\Sesi\Contracts;

use App\Modules\Instruktur\Sesi\Domain\Sesi;

interface SesiRepository
{
    public function all(): array;
    public function find(int $id): ?Sesi;
    public function findByLokasiBlcId(int $lokasiBlcId): array;
    public function create(Sesi $sesi): Sesi;
    public function update(Sesi $sesi): Sesi;
    public function delete(int $id): void;
}