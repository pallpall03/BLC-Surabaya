<?php

namespace App\Modules\Data\Faq\Http;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

/**
 * Endpoint admin untuk Faq. Sengaja belum memanggil use case:
 * ini hanya menandai bahwa rute modul sudah terdaftar.
 */
final class FaqController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'module' => 'faq',
            'status' => 'not_implemented',
        ], 501);
    }
}
