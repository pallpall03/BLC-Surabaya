<?php

namespace App\Modules\Participant\Modul\Http;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use App\Modules\Participant\Modul\Application\ListModul;
use App\Modules\Participant\Modul\Application\GetModul;

/**
 * Endpoint portal peserta untuk Modul.
 * Read-only: daftar dan detail milik sendiri.
 */
final class ModulController extends Controller
{
    public function __construct(
        private readonly ListModul $list,
        private readonly GetModul $get,
    ) {
    }

    public function index(): JsonResponse
    {
        return response()->json($this->list->handle());
    }

    public function show(int $id): JsonResponse
    {
        $item = $this->get->handle($id);
        return $item
            ? response()->json($item)
            : response()->json(['message' => 'Not found'], 404);
    }
}
