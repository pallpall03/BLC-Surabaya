<?php

namespace App\Modules\Instruktur\Laporan\Http;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

/**
 * Endpoint Instruktur untuk Laporan Kegiatan. Sengaja belum memanggil use case:
 * ini hanya menandai bahwa rute modul sudah terdaftar dan terlindungi role.
 */
final class LaporanController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'module' => 'instruktur/laporan',
            'status' => 'not_implemented',
        ], 501);
    }
}
