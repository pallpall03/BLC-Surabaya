<?php

namespace App\Modules\Instruktur\DaftarPeserta\Contracts;

use App\Shared\Contracts\Repository;

/**
 * @extends Repository<array<string, mixed>>
 */
interface DaftarPesertaRepository extends Repository
{
    /**
     * Daftar peserta berhalaman. Filter: q, lokasi_blc_id, kategori_peserta_id, status (semua|valid|non).
     *
     * @param  array<string, mixed>  $filter
     * @return array{data: list<array<string, mixed>>, meta: array<string, int>}
     */
    public function paginate(array $filter, int $perPage, int $page): array;

    /**
     * Jumlah peserta menurut filter q/lokasi/kategori (filter status sengaja diabaikan,
     * supaya kartu statistik tetap menampilkan seluruh pembagiannya).
     *
     * @param  array<string, mixed>  $filter
     * @return array{semua: int, tervalidasi: int, belum: int}
     */
    public function statistik(array $filter): array;

    /** Set status validasi. $oleh = id user yang memvalidasi. */
    public function setValidasi(int $id, bool $valid, ?int $oleh): mixed;

    /**
     * Pilihan untuk dropdown form.
     *
     * @return array{lokasi_blc: list<array{id: int, nama: string}>, kategori_peserta: list<array{id: int, nama: string}>}
     */
    public function opsi(): array;
}
