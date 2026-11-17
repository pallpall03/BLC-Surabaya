<?php

namespace App\Modules\Admin\KontenStatis\SubKonten\Http;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

/**
 * Endpoint admin untuk SubKonten. Sengaja belum memanggil use case:
 * ini hanya menandai bahwa rute modul sudah terdaftar.
 */
final class SubKontenController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'module' => 'sub-konten',
            'status' => 'not_implemented',
        ], 501);
    }
}
