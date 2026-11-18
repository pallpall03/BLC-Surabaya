<?php

namespace App\Modules\Koordinator\MasterUjian\Contracts;

use App\Modules\Koordinator\MasterUjian\Domain\MasterUjian;

interface MasterUjianRepository
{
    public function all(): array;
    public function find(int $id): ?MasterUjian;
    public function findByPertemuanKe(int $pertemuanKe): array;
    public function create(MasterUjian $ujian): MasterUjian;
    public function update(MasterUjian $ujian): MasterUjian;
    public function delete(int $id): void;
}