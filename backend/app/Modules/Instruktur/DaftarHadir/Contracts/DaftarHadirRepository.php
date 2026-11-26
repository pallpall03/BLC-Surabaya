<?php

namespace App\Modules\Instruktur\DaftarHadir\Contracts;

/**
 * Operasi kelas dan peserta kelas untuk instruktur yang sedang login.
 * Setiap metode yang mengakses kelas menerima tim_blc.id hasil resolusi
 * dari users.id, sehingga query selalu dibatasi kepemilikan instruktur.
 */
interface DaftarHadirRepository
{
    public function resolveInstrukturId(string $userId): ?int;

    /**
     * @return list<array<string, mixed>>
     */
    public function listKelas(int $instrukturId, string $search = ''): array;

    /**
     * @return array<string, mixed>|null
     */
    public function findKelas(int $instrukturId, int $kelasId): ?array;

    /**
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    public function createKelas(int $instrukturId, array $data): array;

    /**
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>|null
     */
    public function updateKelas(int $instrukturId, int $kelasId, array $data): ?array;

    public function deleteKelas(int $instrukturId, int $kelasId): bool;

    /**
     * @return array{sesi: list<array{id: int, sesi: int|null, jam: string}>, materi: list<array{id: string, nama_materi: string}>, blc: list<array{id: int, nama_blc: string}>}
     */
    public function opsiKelas(): array;

    /**
     * @return list<array{id: int, sesi: int|null, jam: string}>
     */
    public function opsiSesi(): array;

    /**
     * @return list<array{id: string, nama_materi: string}>
     */
    public function opsiMateri(): array;

    /**
     * @return list<array<string, mixed>>|null
     */
    public function calonPeserta(int $instrukturId, int $kelasId): ?array;

    /**
     * @return list<array<string, mixed>>|null
     */
    public function pesertaKelas(int $instrukturId, int $kelasId): ?array;

    /**
     * @param  list<int>  $pesertaIds
     * @return list<array<string, mixed>>|null
     */
    public function tambahPeserta(int $instrukturId, int $kelasId, array $pesertaIds): ?array;

    public function keluarkanPeserta(int $instrukturId, int $kelasId, int $pesertaId): ?bool;

    /**
     * Rekap absensi belum tersedia karena tabel absensi tidak ada.
     *
     * @return list<array<string, mixed>>|null
     */
    public function rekapKelas(int $instrukturId, int $kelasId): ?array;
}
