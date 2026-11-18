<?php

namespace App\Modules\Koordinator\KoordinatorProfile\Contracts;

use App\Modules\Koordinator\KoordinatorProfile\Domain\KoordinatorProfile;
use App\Modules\Koordinator\KoordinatorProfile\Domain\ValueObjects\KoordinatorProfileId;
use App\Modules\Koordinator\KoordinatorProfile\Domain\ValueObjects\PenggunaId;
use Illuminate\Database\Eloquent\Builder;

interface KoordinatorProfileRepositoryInterface
{
    public function all(): array;
    public function find(int $id): ?KoordinatorProfile;
    public function create(array $data): KoordinatorProfile;
    public function update(int $id, array $data): KoordinatorProfile;
    public function delete(int $id): void;
    public function findByPenggunaId(string $penggunaId): ?KoordinatorProfile;
    public function findByKantorKuUserId(string $kantorKuUserId): ?KoordinatorProfile;
    public function getByLokasiBlcId(string $lokasiBlcId): array;
}