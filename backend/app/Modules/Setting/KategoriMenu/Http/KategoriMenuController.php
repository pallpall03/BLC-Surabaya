<?php

namespace App\Modules\Setting\KategoriMenu\Http;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

/**
 * Endpoint admin untuk KategoriMenu. Sengaja belum memanggil use case:
 * ini hanya menandai bahwa rute modul sudah terdaftar.
 */
final class KategoriMenuController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'module' => 'kategori-menu',
            'status' => 'not_implemented',
        ], 501);
    }
}
