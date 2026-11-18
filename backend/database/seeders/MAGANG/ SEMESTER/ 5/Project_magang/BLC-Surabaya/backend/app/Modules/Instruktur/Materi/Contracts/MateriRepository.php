<?php

namespace App\Modules\Instruktur\Materi\Contracts;

use App\Modules\Instruktur\Materi\Domain\Materi;

interface MateriRepository
{
    public function all(): array;
    public function find(int $id): ?Materi;
    public function findByKelasId(int $kelasId): array;
    public function findByPertemuanKe(int $pertemuanKe): array;
    public function create(Materi $materi): Materi;
    public function update(Materi $materi): Materi;
    public function delete(int $id): void;
}