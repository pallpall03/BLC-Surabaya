<?php

namespace App\Modules\Admin\Data\TimBlc\Domain;

/**
 * Entitas modul TimBlc. Field sengaja belum diisi:
 * skema database admin yang berjalan belum tersedia.
 */
final class TimBlc
{
    public function __construct(
        public readonly ?int $id = null,
        public readonly ?string $userId = null,
        public readonly string $namaLengkap = '',
        public readonly ?string $gender = null,
        public readonly ?string $email = null,
        public readonly ?string $role = 'instruktur',
        public readonly ?string $avatar = null,
        public readonly ?string $phone = null,
        public readonly ?int $lokasiBlcId = null,
        public readonly ?string $namaLokasi = null,
        public readonly ?string $username = null,
        public readonly bool $isDelete = false,
        public readonly ?string $createdAt = null,
        public readonly ?string $updatedAt = null,
    ) {}
}
