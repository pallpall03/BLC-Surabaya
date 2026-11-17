<?php

namespace App\Modules\Admin\Data\KategoriArtikel\Http;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

/**
 * Endpoint admin untuk KategoriArtikel. Sengaja belum memanggil use case:
 * ini hanya menandai bahwa rute modul sudah terdaftar.
 */
final class KategoriArtikelController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'module' => 'kategori-artikel',
            'status' => 'not_implemented',
        ], 501);
    }
}
