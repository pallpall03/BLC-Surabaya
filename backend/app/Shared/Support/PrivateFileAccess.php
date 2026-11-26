<?php

namespace App\Shared\Support;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\URL;

final class PrivateFileAccess
{
    private const FOLDERS = [
        'laporan-kegiatan-pelatihan',
        'foto-kegiatan-pengunjung',
    ];

    public static function isPrivatePath(string $path): bool
    {
        foreach (self::FOLDERS as $folder) {
            if (str_starts_with($path, $folder.'/')) {
                return true;
            }
        }

        return false;
    }

    public static function url(string $path): string
    {
        if (! self::isPrivatePath($path)) {
            return Storage::disk('public')->url($path);
        }

        return URL::temporarySignedRoute('storage.file', now()->addDay(), ['path' => $path]);
    }
}
