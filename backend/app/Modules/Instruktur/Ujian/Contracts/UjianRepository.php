<?php

namespace App\Modules\Instruktur\Ujian\Contracts;

use App\Shared\Contracts\Repository;
use App\Modules\Instruktur\Ujian\Domain\Ujian;

/**
 * @extends Repository<Ujian>
 */
interface UjianRepository extends Repository
{
    public function opsi(int $instrukturId): array;

    public function createJadwal(int $instrukturId, array $data): array;

    public function updateJadwal(int $instrukturId, int $id, array $data): ?array;

    public function deleteJadwal(int $instrukturId, int $id): bool;
}
