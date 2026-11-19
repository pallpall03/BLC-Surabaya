<?php

namespace App\Modules\Instruktur\Ujian\Contracts;

use App\Modules\Instruktur\Ujian\Domain\Ujian;

interface UjianRepository
{
    public function all(): array;
    public function find(int $id): ?Ujian;
    public function findByKelasId(int $kelasId): array;
    public function findByPertemuanKe(int $pertemuanKe): array;
    public function create(Ujian $ujian): Ujian;
    public function update(Ujian $ujian): Ujian;
    public function delete(int $id): void;
}