<?php

namespace App\Modules\Setting\InstrukturProfile\Contracts;

use App\Shared\Contracts\Repository;
use App\Modules\Setting\InstrukturProfile\Domain\InstrukturProfile;

/**
 * @extends Repository<InstrukturProfile>
 */
interface InstrukturProfileRepository extends Repository
{
    public function findByPengguna(int $penggunaId): mixed;
    public function findByLokasiBlc(int $lokasiBlcId): array;
    public function findByKantorKuUserId(string $kantorKuUserId): mixed;
    public function findAktifByLokasiBlc(int $lokasiBlcId): array;
}