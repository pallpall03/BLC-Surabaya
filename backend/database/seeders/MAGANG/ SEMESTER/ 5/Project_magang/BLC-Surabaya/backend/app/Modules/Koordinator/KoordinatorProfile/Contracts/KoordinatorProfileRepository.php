<?php

namespace App\Modules\Koordinator\KoordinatorProfile\Contracts;

use App\Modules\Koordinator\KoordinatorProfile\Domain\KoordinatorProfile;

interface KoordinatorProfileRepository
{
    public function findByKantorKuUserId(string $kantorKuUserId): ?KoordinatorProfile;
    public function findByLokasiBlcIds(array $lokasiBlcIds): array;
    public function create(KoordinatorProfile $profile): KoordinatorProfile;
    public function update(KoordinatorProfile $profile): KoordinatorProfile;
    public function delete(int $id): void;
}