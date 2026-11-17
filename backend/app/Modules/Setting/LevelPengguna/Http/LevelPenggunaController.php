<?php

namespace App\Modules\Setting\LevelPengguna\Http;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

/**
 * Endpoint admin untuk LevelPengguna. Sengaja belum memanggil use case:
 * ini hanya menandai bahwa rute modul sudah terdaftar.
 */
final class LevelPenggunaController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'module' => 'level-pengguna',
            'status' => 'not_implemented',
        ], 501);
    }
}
