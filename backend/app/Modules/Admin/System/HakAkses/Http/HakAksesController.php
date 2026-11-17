<?php

namespace App\Modules\Admin\System\HakAkses\Http;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

/**
 * Endpoint admin untuk HakAkses. Sengaja belum memanggil use case:
 * ini hanya menandai bahwa rute modul sudah terdaftar.
 */
final class HakAksesController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'module' => 'hak-akses',
            'status' => 'not_implemented',
        ], 501);
    }
}
