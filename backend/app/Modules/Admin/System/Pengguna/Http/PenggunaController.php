<?php

namespace App\Modules\Admin\System\Pengguna\Http;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

/**
 * Endpoint admin untuk Pengguna. Sengaja belum memanggil use case:
 * ini hanya menandai bahwa rute modul sudah terdaftar.
 */
final class PenggunaController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'module' => 'pengguna',
            'status' => 'not_implemented',
        ], 501);
    }
}
