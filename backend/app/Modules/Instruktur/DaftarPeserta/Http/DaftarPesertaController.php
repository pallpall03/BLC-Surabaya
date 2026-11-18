<?php

namespace App\Modules\Instruktur\DaftarPeserta\Http;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

/**
 * Endpoint Instruktur untuk Daftar Peserta. Sengaja belum memanggil use case:
 * ini hanya menandai bahwa rute modul sudah terdaftar dan terlindungi role.
 */
final class DaftarPesertaController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'module' => 'instruktur/daftar-peserta',
            'status' => 'not_implemented',
        ], 501);
    }

    public function store(): JsonResponse
    {
        return response()->json([
            'module' => 'instruktur/daftar-peserta',
            'status' => 'not_implemented',
        ], 501);
    }
}
