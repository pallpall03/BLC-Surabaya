<?php

namespace App\Modules\Admin\Data\Testimoni\Http;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

/**
 * Endpoint admin untuk Testimoni. Sengaja belum memanggil use case:
 * ini hanya menandai bahwa rute modul sudah terdaftar.
 */
final class TestimoniController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'module' => 'testimoni',
            'status' => 'not_implemented',
        ], 501);
    }
}
