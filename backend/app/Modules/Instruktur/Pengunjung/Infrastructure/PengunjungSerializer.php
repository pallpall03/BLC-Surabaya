<?php

namespace App\Modules\Instruktur\Pengunjung\Infrastructure;

use App\Modules\Admin\Data\BukuTamu\Infrastructure\BukuTamuModel;

final class PengunjungSerializer
{
    /** @return array<string, mixed> */
    public static function toArray(BukuTamuModel $model): array
    {
        return [
            'id' => (int) $model->id,
            'tanggal' => $model->tanggal_kunjungan?->toDateString() ?? $model->created_at?->toDateString(),
            'sesi' => $model->sesi?->sesi,
            'sesi_id' => $model->sesi_id,
            'lokasi_blc_id' => $model->lokasi_blc_id,
            'blc' => $model->blc?->nama_blc,
            'nama' => $model->nama,
            'email' => $model->email,
            'telepon' => $model->telepon,
            'instansi' => $model->instansi,
            'pesan' => $model->pesan,
            'rating' => $model->rating,
            'jenis_kelamin' => $model->jenis_kelamin,
            'tanggal_lahir' => $model->tanggal_lahir?->toDateString(),
            'alamat' => $model->alamat,
            'kategori' => $model->kategori,
        ];
    }
}
