<?php

namespace App\Modules\Participant\Ujian\Http;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use App\Modules\Participant\Ujian\Application\ListUjian;
use App\Modules\Participant\Ujian\Application\GetUjian;
use App\Modules\Participant\Ujian\Application\GetMyJadwal;
use App\Modules\Participant\Ujian\Application\StartUjian;
use App\Modules\Participant\Ujian\Application\SubmitUjian;

/**
 * Endpoint portal peserta untuk Ujian.
 * Read-only + action khusus peserta.
 */
final class UjianController extends Controller
{
    public function __construct(
        private readonly ListUjian $list,
        private readonly GetUjian $get,
        private readonly GetMyJadwal $jadwal,
        private readonly StartUjian $start,
        private readonly SubmitUjian $submit,
    ) {
    }

    public function index(): JsonResponse
    {
        return response()->json($this->list->handle());
    }

    public function jadwal(): JsonResponse
    {
        return response()->json($this->jadwal->handle());
    }

    public function show(int $id): JsonResponse
    {
        $item = $this->get->handle($id);
        return $item
            ? response()->json($item)
            : response()->json(['message' => 'Not found'], 404);
    }

    public function start(int $id): JsonResponse
    {
        return response()->json($this->start->handle($id));
    }

    public function submit(int $id): JsonResponse
    {
        $jawaban = request()->validate(['jawaban' => 'array']);
        return response()->json($this->submit->handle($id, $jawaban['jawaban']));
    }
}
