<?php

namespace App\Modules\Koordinator\LaporanAbsensi\Http;

use App\Modules\Koordinator\LaporanAbsensi\Contracts\LaporanAbsensiRepositoryInterface;
use App\Modules\Koordinator\LaporanAbsensi\Domain\ValueObjects\LaporanAbsensiId;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class LaporanAbsensiController extends \App\Http\Controllers\Controller
{
    public function __construct(
        private readonly LaporanAbsensiRepositoryInterface $repository
    ) {}

    public function index(): JsonResponse
    {
        return response()->json(array_map(fn($l) => $l->toArray(), $this->repository->all()));
    }

    public function show(string $id): JsonResponse
    {
        $laporan = $this->repository->find(new LaporanAbsensiId($id));
        if (!$laporan) {
            return response()->json(['message' => 'LaporanAbsensi not found'], 404);
        }
        return response()->json($laporan->toArray());
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'sesiId' => 'required|string',
            'instrukturId' => 'required|string',
            'lokasiBlcId' => 'required|string',
            'periodeMulai' => 'required|date',
            'periodeAkhir' => 'required|date',
            'totalPeserta' => 'required|integer|min:0',
            'totalHadir' => 'required|integer|min:0',
            'totalTidakHadir' => 'required|integer|min:0',
            'persentaseKehadiran' => 'required|numeric|min:0|max:100',
        ]);

        $laporan = $this->repository->create($validated);
        return response()->json($laporan->toArray(), 201);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $validated = $request->validate([
            'sesiId' => 'nullable|string',
            'instrukturId' => 'nullable|string',
            'lokasiBlcId' => 'nullable|string',
            'periodeMulai' => 'nullable|date',
            'periodeAkhir' => 'nullable|date',
            'totalPeserta' => 'nullable|integer|min:0',
            'totalHadir' => 'nullable|integer|min:0',
            'totalTidakHadir' => 'nullable|integer|min:0',
            'persentaseKehadiran' => 'nullable|numeric|min:0|max:100',
        ]);

        $laporan = $this->repository->update(new LaporanAbsensiId($id), $validated);
        return response()->json($laporan->toArray());
    }

    public function destroy(string $id): JsonResponse
    {
        $this->repository->delete(new LaporanAbsensiId($id));
        return response()->json(null, 204);
    }

    public function generate(string $sesiId, string $periodeMulai, string $periodeAkhir): JsonResponse
    {
        $laporan = $this->repository->generateLaporan($sesiId, $periodeMulai, $periodeAkhir);
        return response()->json($laporan->toArray());
    }
}