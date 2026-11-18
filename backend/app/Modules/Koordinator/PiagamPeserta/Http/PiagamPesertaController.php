<?php

namespace App\Modules\Koordinator\PiagamPeserta\Http;

use App\Modules\Koordinator\PiagamPeserta\Contracts\PiagamPesertaRepositoryInterface;
use App\Modules\Koordinator\PiagamPeserta\Domain\ValueObjects\PiagamPesertaId;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class PiagamPesertaController extends \App\Http\Controllers\Controller
{
    public function __construct(
        private readonly PiagamPesertaRepositoryInterface $repository
    ) {}

    public function index(): JsonResponse
    {
        return response()->json(array_map(fn($p) => $p->toArray(), $this->repository->all()));
    }

    public function show(string $id): JsonResponse
    {
        $piagam = $this->repository->find(new PiagamPesertaId($id));
        if (!$piagam) {
            return response()->json(['message' => 'PiagamPeserta not found'], 404);
        }
        return response()->json($piagam->toArray());
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'pesertaId' => 'required|string',
            'sesiId' => 'required|string',
            'judul' => 'required|string',
            'deskripsi' => 'required|string',
            'filePath' => 'required|string',
            'status' => 'nullable|in:draft,terbit',
            'tanggalTerbit' => 'nullable|date',
        ]);

        $piagam = $this->repository->create($validated);
        return response()->json($piagam->toArray(), 201);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $validated = $request->validate([
            'pesertaId' => 'nullable|string',
            'sesiId' => 'nullable|string',
            'judul' => 'nullable|string',
            'deskripsi' => 'nullable|string',
            'filePath' => 'nullable|string',
            'status' => 'nullable|in:draft,terbit',
            'tanggalTerbit' => 'nullable|date',
        ]);

        $piagam = $this->repository->update(new PiagamPesertaId($id), $validated);
        return response()->json($piagam->toArray());
    }

    public function destroy(string $id): JsonResponse
    {
        $this->repository->delete(new PiagamPesertaId($id));
        return response()->json(null, 204);
    }

    public function publish(string $id): JsonResponse
    {
        $piagam = $this->repository->find(new PiagamPesertaId($id));
        if (!$piagam) {
            return response()->json(['message' => 'PiagamPeserta not found'], 404);
        }

        $piagam->publish();
        // Update via repository
        $updated = $this->repository->update(new PiagamPesertaId($id), [
            'status' => $piagam->getStatus(),
            'tanggal_terbit' => $piagam->getTanggalTerbit()->toISOString(),
        ]);

        return response()->json($updated->toArray());
    }
}