<?php

namespace App\Modules\Instruktur\Pengunjung\Contracts;

/**
 * Port data kunjungan pengunjung untuk modul Instruktur.
 * Implementasi Eloquent ada di Infrastructure agar controller tidak menyentuh model.
 */
interface PengunjungRepository
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

    /**
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    public function buat(array $data): array;

    /**
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    public function ubah(int $id, array $data): array;

    public function hapus(int $id): void;
}
