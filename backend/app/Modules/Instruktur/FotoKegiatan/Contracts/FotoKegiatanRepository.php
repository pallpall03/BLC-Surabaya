<?php

namespace App\Modules\Instruktur\FotoKegiatan\Contracts;

/**
 * Port data foto kegiatan pengunjung untuk modul Instruktur.
 * Penyimpanan file tetap di Http; port ini hanya menangani data.
 */
interface FotoKegiatanRepository
{
    /** @return array<string, mixed> */
    public function opsi(): array;

    /**
     * @param  array<string, mixed>  $filter
     * @return list<array<string, mixed>>
     */
    public function daftar(array $filter): array;

    /** @return array<string, mixed> */
    public function temukan(int $id): array;

    public function sudahAda(string $tanggal, int $sesiId, int $lokasiBlcId, ?int $ignoreId = null): bool;

    /**
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    public function simpan(?int $id, array $data, int $userId): array;

    /** @return list<mixed> path foto sebelum soft-delete */
    public function hapus(int $id): array;
}
