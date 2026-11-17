<?php

namespace App\Modules\Setting\KoordinatorProfile\Http;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

final class KoordinatorProfileController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'module' => 'setting.koordinator_profile',
            'status' => 'not_implemented',
        ], 501);
    }
}