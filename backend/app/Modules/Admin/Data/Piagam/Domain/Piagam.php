<?php

namespace App\Modules\Admin\Data\Piagam\Domain;

final class Piagam
{
    public function __construct(
        public readonly ?int $id,
        public readonly string $judul,
        public readonly string $slug,
        public readonly ?string $deskripsi,
        public readonly ?string $templateFile,
        public readonly int $urutan,
        public readonly bool $isAktif,
        public readonly ?string $createdAt,
        public readonly ?string $updatedAt,
    ) {}
}
