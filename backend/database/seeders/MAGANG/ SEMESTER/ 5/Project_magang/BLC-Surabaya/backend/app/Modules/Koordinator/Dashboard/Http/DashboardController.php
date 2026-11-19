<?php

namespace App\Modules\Koordinator\Dashboard\Http;

use App\Http\Controllers\Controller;
use App\Modules\Koordinator\Dashboard\Contracts\DashboardRepository;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function index(): JsonResponse
    {
        $dashboard = app(DashboardRepository::class)->getDashboardData();
        return response()->json($dashboard);
    }
}