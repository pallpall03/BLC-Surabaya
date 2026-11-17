<?php

namespace App\Modules\Setting\InstrukturProfile\Http;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

final class InstrukturProfileController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'module' => 'setting.instruktur_profile',
            'status' => 'not_implemented',
        ], 501);
    }
}