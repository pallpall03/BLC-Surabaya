<?php

namespace App\Modules\Admin\Data\Modul\Domain;

final class Modul
{
    public function __construct(
        public readonly ?int $id,
        public readonly string $nama,
        public readonly string $slug,
        public readonly ?string $deskripsi,
        public readonly int $urutan,
        public readonly bool $isAktif,
        public readonly ?string $createdAt,
        public readonly ?string $updatedAt,
    ) {}
}
