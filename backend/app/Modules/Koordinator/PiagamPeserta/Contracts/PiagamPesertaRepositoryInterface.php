<?php

namespace App\Modules\Koordinator\PiagamPeserta\Contracts;

use App\Modules\Koordinator\PiagamPeserta\Domain\PiagamPeserta;
use App\Modules\Koordinator\PiagamPeserta\Domain\ValueObjects\PiagamPesertaId;

interface PiagamPesertaRepositoryInterface
{
    public function all(): array;
    public function find(PiagamPesertaId $id): ?PiagamPeserta;
    public function findByPesertaId(string $pesertaId): array;
    public function findBySesiId(string $sesiId): array;
    public function findByJudul(string $judul): ?PiagamPeserta;
    public function create(array $data): PiagamPeserta;
    public function update(PiagamPesertaId $id, array $data): PiagamPeserta;
    public function delete(PiagamPesertaId $id): void;
}