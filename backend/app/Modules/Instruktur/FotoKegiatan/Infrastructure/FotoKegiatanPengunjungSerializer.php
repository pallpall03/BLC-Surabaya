<?php

namespace App\Modules\Instruktur\FotoKegiatan\Infrastructure;

use App\Shared\Support\PrivateFileAccess;

final class FotoKegiatanPengunjungSerializer
{
    /** @return array<string, mixed> */
    public static function toArray(FotoKegiatanPengunjungModel $model): array
    {
        $foto = array_values(array_filter(
            $model->foto ?? [],
            fn ($path) => is_string($path) && $path !== '',
        ));
        $fotoDeskripsi = array_map(
            fn ($deskripsi) => is_string($deskripsi) ? $deskripsi : '',
            array_values($model->foto_deskripsi ?? []),
        );

        return [
            'id' => (int) $model->id,
            'tanggal' => $model->tanggal?->toDateString(),
            'sesi' => $model->sesi?->sesi,
            'sesi_id' => $model->sesi_id,
            'lokasi_blc_id' => $model->lokasi_blc_id,
            'blc' => $model->blc?->nama_blc,
            'keterangan' => $model->keterangan,
            'foto' => $foto,
            'foto_deskripsi' => $fotoDeskripsi,
            'foto_url' => array_map(
                fn (string $path) => PrivateFileAccess::url($path),
                $foto,
            ),
            'created_by' => $model->created_by,
        ];
    }
}
