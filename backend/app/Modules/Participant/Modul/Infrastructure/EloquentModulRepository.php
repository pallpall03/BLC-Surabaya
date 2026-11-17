<?php

namespace App\Modules\Participant\Modul\Infrastructure;

use App\Modules\Participant\Modul\Contracts\ModulRepository;
use App\Modules\Participant\Modul\Domain\Modul;
use RuntimeException;

/**
 * Placeholder penyimpanan Modul (Participant). 
 * Belum ada query sebelum tabel `modul` dipetakan.
 */
final class EloquentModulRepository implements ModulRepository
{
    public function all(): array
    {
        throw new RuntimeException('Modul (Participant): penyimpanan belum diimplementasi.');
    }

    public function find(int $id): mixed
    {
        throw new RuntimeException('Modul (Participant): penyimpanan belum diimplementasi.');
    }

    public function create(array $data): mixed
    {
        throw new RuntimeException('Modul (Participant): create tidak tersedia untuk peserta.');
    }

    public function update(int $id, array $data): mixed
    {
        throw new RuntimeException('Modul (Participant): update tidak tersedia untuk peserta.');
    }

    public function delete(int $id): void
    {
        throw new RuntimeException('Modul (Participant): delete tidak tersedia untuk peserta.');
    }
}
