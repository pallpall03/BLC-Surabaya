<?php

namespace App\Modules\Instruktur\Absensi\Contracts;

use App\Modules\Instruktur\Absensi\Domain\Absensi;

interface AbsensiRepository
{
    public function all(): array;
    public function find(int $id): ?Absensi;
    public function findByKelasId(int $kelasId): array;
    public function findByPesertaId(int $pesertaId): array;
    public function findByTanggal(string $tanggal): array;
    public function create(Absensi $absensi): Absensi;
    public function update(Absensi $absensi): Absensi;
    public function delete(int $id): void;
}