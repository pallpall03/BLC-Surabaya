<?php

namespace App\Modules\Instruktur\InstrukturProfile\Contracts;

use App\Modules\Instruktur\InstrukturProfile\Domain\InstrukturProfile;

interface InstrukturProfileRepository
{
    public function findByKantorKuUserId(string $kantorKuUserId): ?InstrukturProfile;
    public function findByLokasiBlcId(int $lokasiBlcId): ?InstrukturProfile;
    public function create(InstrukturProfile $profile): InstrukturProfile;
    public function update(InstrukturProfile $profile): InstrukturProfile;
    public function delete(int $id): void;
}