<?php

namespace App\Modules\Instruktur\Laporan\Domain;

final class Laporan
{
    public function __construct(
        public readonly int $id,
        public readonly string $tanggal,
        public readonly ?int $kelasId,
        public readonly ?string $kelas,
        public readonly ?string $materi,
        public readonly int $hadir,
        public readonly int $total,
        public readonly string $aktivitas,
        /** @var list<string> */
        public readonly array $foto,
        /** @var list<string> */
        public readonly array $fotoDeskripsi,
    ) {
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'tanggal' => $this->tanggal,
            'kelas_id' => $this->kelasId,
            'kelas' => $this->kelas,
            'materi' => $this->materi,
            'hadir' => $this->hadir,
            'total' => $this->total,
            'aktivitas' => $this->aktivitas,
            'foto' => $this->foto,
            'foto_deskripsi' => $this->fotoDeskripsi,
        ];
    }
}
