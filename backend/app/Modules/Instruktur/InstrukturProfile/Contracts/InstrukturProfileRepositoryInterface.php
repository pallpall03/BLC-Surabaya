<?php

namespace App\Modules\Instruktur\InstrukturProfile\Contracts;

use App\Shared\Contracts\Repository;
use App\Modules\Instruktur\InstrukturProfile\Domain\InstrukturProfile;

/** @extends Repository<InstrukturProfile> */
interface InstrukturProfileRepositoryInterface extends Repository
{
    public function findByPenggunaId(string $penggunaId): ?InstrukturProfile;
    public function findByKantorKuUserId(string $kantorKuUserId): ?InstrukturProfile;
    public function getByLokasiBlcId(string $lokasiBlcId): array;
}