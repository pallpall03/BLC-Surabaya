<?php

namespace App\Modules\Setting\KoordinatorProfile\Contracts;

use App\Shared\Contracts\Repository;
use App\Modules\Setting\KoordinatorProfile\Domain\KoordinatorProfile;

/**
 * @extends Repository<KoordinatorProfile>
 */
interface KoordinatorProfileRepository extends Repository
{
    public function findByPengguna(int $penggunaId): mixed;
    public function findByLokasiBlc(int $lokasiBlcId): array;
    public function findByKantorKuUserId(string $kantorKuUserId): mixed;
    public function findAktif(): array;
}