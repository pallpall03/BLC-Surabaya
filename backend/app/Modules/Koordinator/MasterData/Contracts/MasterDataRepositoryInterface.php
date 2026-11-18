<?php

namespace App\Modules\Koordinator\MasterData\Contracts;

use App\Modules\Koordinator\MasterData\Domain\MasterData;

interface MasterDataRepositoryInterface
{
    public function all(): array;
    public function find(string $namaModul): ?MasterData;
    public function create(array $data): MasterData;
    public function update(string $namaModul, array $data): MasterData;
    public function delete(string $namaModul): void;
}