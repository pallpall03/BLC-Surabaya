<?php

namespace App\Modules\Setting\Menu\Http;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

/**
 * Endpoint admin untuk Menu. Sengaja belum memanggil use case:
 * ini hanya menandai bahwa rute modul sudah terdaftar.
 */
final class MenuController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'module' => 'menu',
            'status' => 'not_implemented',
        ], 501);
    }
}
