<?php

namespace App\Modules\Instruktur\DaftarHadir\Http;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

/**
 * Endpoint Instruktur untuk Daftar Hadir. Sengaja belum memanggil use case:
 * ini hanya menandai bahwa rute modul sudah terdaftar dan terlindungi role.
 */
final class DaftarHadirController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'module' => 'instruktur/daftar-hadir',
            'status' => 'not_implemented',
        ], 501);
    }

    public function store(): JsonResponse
    {
        return response()->json([
            'module' => 'instruktur/daftar-hadir',
            'status' => 'not_implemented',
        ], 501);
    }
}
