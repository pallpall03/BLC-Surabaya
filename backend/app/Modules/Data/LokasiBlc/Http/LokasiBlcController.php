<?php

namespace App\Modules\Data\LokasiBlc\Http;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

/**
 * Endpoint admin untuk LokasiBlc. Sengaja belum memanggil use case:
 * ini hanya menandai bahwa rute modul sudah terdaftar.
 */
final class LokasiBlcController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'module' => 'lokasi-blc',
            'status' => 'not_implemented',
        ], 501);
    }
}
