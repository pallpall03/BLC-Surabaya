<?php

namespace App\Modules\Admin\Data\Testimoni\Contracts;

use App\Shared\Contracts\Repository;
use App\Modules\Admin\Data\Testimoni\Domain\Testimoni;

/**
 * @extends Repository<Testimoni>
 */
interface TestimoniRepository extends Repository
{
    public function getByLokasi(int $lokasiBlcId): array;
    public function getByStatus(string $status): array;
    public function getTampil(): array;
    public function getLatest(int $limit = 10): array;
}