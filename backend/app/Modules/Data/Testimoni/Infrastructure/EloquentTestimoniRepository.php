<?php

namespace App\Modules\Data\Testimoni\Infrastructure;

use App\Modules\Data\Testimoni\Contracts\TestimoniRepository;
use App\Modules\Data\Testimoni\Domain\Testimoni;
use RuntimeException;

/**
 * Placeholder penyimpanan. Jangan diisi query sebelum tabel `testimoni`
 * dipetakan dari database admin yang berjalan.
 */
final class EloquentTestimoniRepository implements TestimoniRepository
{
    public function all(): array
    {
        throw new RuntimeException('Testimoni: penyimpanan belum diimplementasi.');
    }

    public function find(int $id): mixed
    {
        throw new RuntimeException('Testimoni: penyimpanan belum diimplementasi.');
    }

    public function create(array $data): mixed
    {
        throw new RuntimeException('Testimoni: penyimpanan belum diimplementasi.');
    }

    public function update(int $id, array $data): mixed
    {
        throw new RuntimeException('Testimoni: penyimpanan belum diimplementasi.');
    }

    public function delete(int $id): void
    {
        throw new RuntimeException('Testimoni: penyimpanan belum diimplementasi.');
    }
}
