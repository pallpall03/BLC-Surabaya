<?php

namespace App\Modules\Participant\Piagam\Http;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use App\Modules\Participant\Piagam\Application\ListPiagam;
use App\Modules\Participant\Piagam\Application\GetPiagam;

/**
 * Endpoint portal peserta untuk Piagam.
 * Read-only: daftar dan detail milik sendiri.
 */
final class PiagamController extends Controller
{
    public function __construct(
        private readonly ListPiagam $list,
        private readonly GetPiagam $get,
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
