<?php

namespace App\Modules\Instruktur\DaftarHadir\Application;

use App\Modules\Instruktur\DaftarHadir\Contracts\DaftarHadirRepository;
use Illuminate\Http\Exceptions\HttpResponseException;

/**
 * Kasus pemakaian daftar kelas untuk instruktur yang sedang login.
 */
final class ListDaftarHadir
{
    public function __construct(private readonly DaftarHadirRepository $repository)
    {
    }

    public function handle(string $userId): array
    {
        $instrukturId = $this->repository->resolveInstrukturId($userId);

        if ($instrukturId === null) {
            throw new HttpResponseException(response()->json([
                'message' => 'Akun instruktur ini tidak memiliki data tim BLC aktif.',
            ], 403));
        }

        return $this->repository->listKelas($instrukturId);
    }
}
