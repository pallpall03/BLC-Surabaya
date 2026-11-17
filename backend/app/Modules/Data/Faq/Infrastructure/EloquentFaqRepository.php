<?php

namespace App\Modules\Data\Faq\Infrastructure;

use App\Modules\Data\Faq\Contracts\FaqRepository;
use App\Modules\Data\Faq\Domain\Faq;
use RuntimeException;

/**
 * Placeholder penyimpanan. Jangan diisi query sebelum tabel `faq`
 * dipetakan dari database admin yang berjalan.
 */
final class EloquentFaqRepository implements FaqRepository
{
    public function all(): array
    {
        throw new RuntimeException('Faq: penyimpanan belum diimplementasi.');
    }

    public function find(int $id): mixed
    {
        throw new RuntimeException('Faq: penyimpanan belum diimplementasi.');
    }

    public function create(array $data): mixed
    {
        throw new RuntimeException('Faq: penyimpanan belum diimplementasi.');
    }

    public function update(int $id, array $data): mixed
    {
        throw new RuntimeException('Faq: penyimpanan belum diimplementasi.');
    }

    public function delete(int $id): void
    {
        throw new RuntimeException('Faq: penyimpanan belum diimplementasi.');
    }
}
