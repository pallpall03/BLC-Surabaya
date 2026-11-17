<?php

namespace App\Modules\Admin\Data\Artikel\Http;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

/**
 * Endpoint admin untuk Artikel. Sengaja belum memanggil use case:
 * ini hanya menandai bahwa rute modul sudah terdaftar.
 */
final class ArtikelController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'module' => 'artikel',
            'status' => 'not_implemented',
        ], 501);
    }
}
