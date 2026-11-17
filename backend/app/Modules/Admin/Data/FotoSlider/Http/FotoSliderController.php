<?php

namespace App\Modules\Admin\Data\FotoSlider\Http;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

/**
 * Endpoint admin untuk FotoSlider. Sengaja belum memanggil use case:
 * ini hanya menandai bahwa rute modul sudah terdaftar.
 */
final class FotoSliderController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'module' => 'foto-slider',
            'status' => 'not_implemented',
        ], 501);
    }
}
