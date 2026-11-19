<?php

namespace App\Modules\Koordinator\Absensi\Contracts;

use App\Modules\Koordinator\Absensi\Domain\Absensi;
use App\Modules\Koordinator\Absensi\Domain\ValueObjects\AbsensiId;

interface AbsensiRepositoryInterface
{
    public function all(): array;
    public function find(AbsensiId $id): ?Absensi;
    public function findByPesertaId(string $pesertaId): array;
    public function findBySesiId(string $sesiId): array;
    public function findByInstrukturId(string $instrukturId): array;
    public function findByLokasiBlcId(string $lokasiBlcId): array;
    public function findByTanggal(string $tanggal): array;
    public function create(array $data): Absensi;
    public function update(AbsensiId $id, array $data): Absensi;
    public function delete(AbsensiId $id): void;
}