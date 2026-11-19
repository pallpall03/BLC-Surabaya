<?php

namespace App\Modules\Instruktur\Kelas\Contracts;

use App\Modules\Instruktur\Kelas\Domain\Kelas;

interface KelasRepository
{
    public function all(): array;
    public function find(int $id): ?Kelas;
    public function findByLokasiBlcId(int $lokasiBlcId): array;
    public function findBySesiId(int $sesiId): array;
    public function create(Kelas $kelas): Kelas;
    public function update(Kelas $kelas): Kelas;
    public function delete(int $id): void;
}