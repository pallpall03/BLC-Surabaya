<?php

namespace App\Modules\Instruktur\Ujian\Http;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

/**
 * Endpoint Instruktur untuk Ujian (pretest/posttest). Sengaja belum memanggil use case:
 * ini hanya menandai bahwa rute modul sudah terdaftar dan terlindungi role.
 */
final class UjianController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'module' => 'instruktur/ujian',
            'status' => 'not_implemented',
        ], 501);
    }
}
