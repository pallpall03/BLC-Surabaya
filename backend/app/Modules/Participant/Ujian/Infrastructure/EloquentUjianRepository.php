<?php

namespace App\Modules\Participant\Ujian\Infrastructure;

use App\Modules\Participant\Ujian\Contracts\UjianRepository;
use App\Modules\Participant\Ujian\Domain\Ujian;
use RuntimeException;

/**
 * Placeholder penyimpanan Ujian (Participant). 
 * Belum ada query sebelum tabel `ujian` dipetakan.
 */
final class EloquentUjianRepository implements UjianRepository
{
    public function all(): array
    {
        throw new RuntimeException('Ujian (Participant): penyimpanan belum diimplementasi.');
    }

    public function find(int $id): mixed
    {
        throw new RuntimeException('Ujian (Participant): penyimpanan belum diimplementasi.');
    }

    public function create(array $data): mixed
    {
        throw new RuntimeException('Ujian (Participant): create tidak tersedia untuk peserta.');
    }

    public function update(int $id, array $data): mixed
    {
        throw new RuntimeException('Ujian (Participant): update tidak tersedia untuk peserta.');
    }

    public function delete(int $id): void
    {
        throw new RuntimeException('Ujian (Participant): delete tidak tersedia untuk peserta.');
    }
}
