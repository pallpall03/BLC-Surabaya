<?php

namespace App\Modules\Instruktur\Laporan\Contracts;

use App\Shared\Contracts\Repository;
use App\Modules\Instruktur\Laporan\Domain\Laporan;

/**
 * @extends Repository<Laporan>
 */
interface LaporanRepository extends Repository
{
    public function resolveInstrukturId(string $userId): ?int;

    public function listForInstruktur(int $instrukturId, string $mulai, string $sampai): array;

    public function findForInstruktur(int $instrukturId, int $id): ?Laporan;

    public function createForInstruktur(int $instrukturId, array $data): Laporan;

    public function updateForInstruktur(int $instrukturId, int $id, array $data): ?Laporan;

    public function deleteForInstruktur(int $instrukturId, int $id): bool;

    public function opsiKelas(int $instrukturId): array;
}
