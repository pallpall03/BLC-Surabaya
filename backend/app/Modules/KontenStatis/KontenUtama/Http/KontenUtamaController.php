<?php

namespace App\Modules\KontenStatis\KontenUtama\Http;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

/**
 * Endpoint admin untuk KontenUtama. Sengaja belum memanggil use case:
 * ini hanya menandai bahwa rute modul sudah terdaftar.
 */
final class KontenUtamaController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'module' => 'konten-utama',
            'status' => 'not_implemented',
        ], 501);
    }
}
