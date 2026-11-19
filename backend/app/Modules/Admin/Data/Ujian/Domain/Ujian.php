<?php

namespace App\Modules\Admin\Data\Ujian\Domain;

final class Ujian
{
    public function __construct(
        public readonly ?int $id,
        public readonly string $judul,
        public readonly string $slug,
        public readonly ?string $deskripsi,
        public readonly int $durasiMenit,
        public readonly int $urutan,
        public readonly bool $isAktif,
        public readonly ?string $createdAt,
        public readonly ?string $updatedAt,
    ) {}
}
