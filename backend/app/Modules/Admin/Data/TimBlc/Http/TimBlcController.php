<?php

namespace App\Modules\Admin\Data\TimBlc\Http;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

/**
 * Endpoint admin untuk TimBlc. Sengaja belum memanggil use case:
 * ini hanya menandai bahwa rute modul sudah terdaftar.
 */
final class TimBlcController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'module' => 'tim-blc',
            'status' => 'not_implemented',
        ], 501);
    }
}
