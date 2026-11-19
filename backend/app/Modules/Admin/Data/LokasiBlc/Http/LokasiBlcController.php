<?php

namespace App\Modules\Admin\Data\LokasiBlc\Http;

use App\Http\Controllers\Controller;
use App\Modules\Admin\Data\LokasiBlc\Contracts\LokasiBlcRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class LokasiBlcController extends Controller
{
    public function __construct(
        private readonly LokasiBlcRepository $repository
    ) {}

    public function index(): JsonResponse
    {
        $lokasis = $this->repository->getAktif();
        return response()->json(['data' => $lokasis]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'alamat' => 'required|string',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'keterangan' => 'nullable|string',
            'urutan' => 'integer|default:0',
            'is_aktif' => 'boolean',
        ]);

        $lokasi = $this->repository->create($validated);
        return response()->json(['data' => $lokasi], 201);
    }

    public function show(int $id): JsonResponse
    {
        $lokasi = $this->repository->find($id);
        if (!$lokasi) {
            return response()->json(['message' => 'Lokasi BLC not found'], 404);
        }
        return response()->json(['data' => $lokasi]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'nama' => 'sometimes|required|string|max:255',
            'alamat' => 'sometimes|required|string',
            'latitude' => 'sometimes|nullable|numeric',
            'longitude' => 'sometimes|nullable|numeric',
            'keterangan' => 'sometimes|string',
            'urutan' => 'sometimes|integer',
            'is_aktif' => 'sometimes|boolean',
        ]);

        $lokasi = $this->repository->update($id, $validated);
        return response()->json(['data' => $lokasi]);
    }

    public function destroy(int $id): JsonResponse
    {
        $this->repository->softDelete($id);
        return response()->json(['message' => 'Deleted']);
    }
}
