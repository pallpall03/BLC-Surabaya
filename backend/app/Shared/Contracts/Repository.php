<?php

namespace App\Shared\Contracts;

/**
 * Kontrak penyimpanan data. Implementasinya (Eloquent, query builder, dsb.)
 * menyusul setelah skema database diketahui. Belum ada query di sini.
 *
 * @template T
 */
interface Repository
{
    /**
     * @return list<T>
     */
    public function all(): array;

    /**
     * @return T|null
     */
    public function find(int $id): mixed;

    /**
     * @param  array<string, mixed>  $data
     * @return T
     */
    public function create(array $data): mixed;

    /**
     * @param  array<string, mixed>  $data
     * @return T
     */
    public function update(int $id, array $data): mixed;

    public function delete(int $id): void;
}
