<?php

namespace App\Modules\Participant\Piagam\Infrastructure;

use App\Modules\Participant\Piagam\Contracts\PiagamRepository;
use App\Modules\Participant\Piagam\Domain\Piagam;
use RuntimeException;

/**
 * Placeholder penyimpanan Piagam (Participant). 
 * Belum ada query sebelum tabel `piagam` dipetakan.
 */
final class EloquentPiagamRepository implements PiagamRepository
{
    public function all(): array
    {
        throw new RuntimeException('Piagam (Participant): penyimpanan belum diimplementasi.');
    }

    public function find(int $id): mixed
    {
        throw new RuntimeException('Piagam (Participant): penyimpanan belum diimplementasi.');
    }

    public function create(array $data): mixed
    {
        throw new RuntimeException('Piagam (Participant): create tidak tersedia untuk peserta.');
    }

    public function update(int $id, array $data): mixed
    {
        throw new RuntimeException('Piagam (Participant): update tidak tersedia untuk peserta.');
    }

    public function delete(int $id): void
    {
        throw new RuntimeException('Piagam (Participant): delete tidak tersedia untuk peserta.');
    }
}
