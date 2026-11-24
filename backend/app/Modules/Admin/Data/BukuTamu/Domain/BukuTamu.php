<?php

namespace App\Modules\Admin\Data\BukuTamu\Domain;

final class BukuTamu
{
    public int $id;
    public string $nama;
    public ?string $email;
    public string $pesan;
    public ?int $rating;
    public bool $isAktif;
    public int $urutan;
    public string $createdAt;
    public string $updatedAt;

    public function __construct(
        int $id,
        string $nama,
        ?string $email,
        string $pesan,
        ?int $rating,
        bool $isAktif,
        int $urutan,
        string $createdAt,
        string $updatedAt
    ) {
        $this->id = $id;
        $this->nama = $nama;
        $this->email = $email;
        $this->pesan = $pesan;
        $this->rating = $rating;
        $this->isAktif = $isAktif;
        $this->urutan = $urutan;
        $this->createdAt = $createdAt;
        $this->updatedAt = $updatedAt;
    }
}