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
    public ?string $instansi;
    public ?string $telepon;
    public ?string $tanggalKunjungan;
    public ?int $lokasiBlcId;
    public ?int $sesiId;
    public ?string $jenisKelamin;
    public ?string $tanggalLahir;
    public ?string $alamat;
    public ?string $kategori;
    public bool $isDelete;
    public ?string $blc;
    public ?int $sesi;

    public function __construct(
        int $id,
        string $nama,
        ?string $email,
        string $pesan,
        ?int $rating,
        bool $isAktif,
        int $urutan,
        string $createdAt,
        string $updatedAt,
        ?string $instansi = null,
        ?string $telepon = null,
        ?string $tanggalKunjungan = null,
        ?int $lokasiBlcId = null,
        ?int $sesiId = null,
        ?string $jenisKelamin = null,
        ?string $tanggalLahir = null,
        ?string $alamat = null,
        ?string $kategori = null,
        bool $isDelete = false,
        ?string $blc = null,
        ?int $sesi = null
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
        $this->instansi = $instansi;
        $this->telepon = $telepon;
        $this->tanggalKunjungan = $tanggalKunjungan;
        $this->lokasiBlcId = $lokasiBlcId;
        $this->sesiId = $sesiId;
        $this->jenisKelamin = $jenisKelamin;
        $this->tanggalLahir = $tanggalLahir;
        $this->alamat = $alamat;
        $this->kategori = $kategori;
        $this->isDelete = $isDelete;
        $this->blc = $blc;
        $this->sesi = $sesi;
    }

    /** Public serializer; contact fields are deliberately excluded. */
    public function toPublicArray(): array
    {
        return [
            'id' => $this->id,
            'nama' => $this->nama,
            'instansi' => $this->instansi,
            'pesan' => $this->pesan,
            'rating' => $this->rating,
            'tanggal' => $this->tanggalKunjungan ?? substr($this->createdAt, 0, 10),
            'blc' => $this->blc,
            'sesi' => $this->sesi,
        ];
    }

    /** Admin serializer; contact fields are only exposed behind authenticated routes. */
    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'nama' => $this->nama,
            'instansi' => $this->instansi,
            'email' => $this->email,
            'telepon' => $this->telepon,
            'pesan' => $this->pesan,
            'rating' => $this->rating,
            'tanggal' => $this->tanggalKunjungan ?? substr($this->createdAt, 0, 10),
            'blc' => $this->blc,
            'sesi' => $this->sesi,
            'lokasi_blc_id' => $this->lokasiBlcId,
            'sesi_id' => $this->sesiId,
            'jenis_kelamin' => $this->jenisKelamin,
            'tanggal_lahir' => $this->tanggalLahir,
            'alamat' => $this->alamat,
            'kategori' => $this->kategori,
            'is_aktif' => $this->isAktif,
            'is_delete' => $this->isDelete,
            'urutan' => $this->urutan,
            'created_at' => $this->createdAt,
            'updated_at' => $this->updatedAt,
        ];
    }
}