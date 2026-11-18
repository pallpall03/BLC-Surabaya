<?php

namespace App\Modules\Koordinator\Monitoring\Http;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

/**
 * Endpoint Koordinator untuk Monitoring. Sengaja belum memanggil use case:
 * ini hanya menandai bahwa rute modul sudah terdaftar dan terlindungi role.
 */
final class MonitoringController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'module' => 'koordinator/monitoring',
            'status' => 'not_implemented',
        ], 501);
    }
}
