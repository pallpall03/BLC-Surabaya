<?php

namespace App\Modules\Koordinator\MasterData\Http;

use App\Modules\Koordinator\MasterData\Contracts\MasterDataRepositoryInterface;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class MasterDataController extends \App\Http\Controllers\Controller
{
    public function __construct(
        private readonly MasterDataRepositoryInterface $repository
    ) {}

    public function index(): JsonResponse
    {
        return response()->json($this->repository->all());
    }

    public function show(string $namaModul): JsonResponse
    {
        $masterData = $this->repository->find($namaModul);
        if (!$masterData) {
            return response()->json(['message' => 'MasterData not found'], 404);
        }
        return response()->json($masterData);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'namaModul' => 'required|string|unique:master_data,nama_modul',
            'namaTampil' => 'required|string',
            'deskripsi' => 'nullable|string',
            'isAktif' => 'boolean',
        ]);

        $data = [
            'nama_modul' => $validated['namaModul'],
            'nama_tampil' => $validated['namaTampil'],
            'deskripsi' => $validated['deskripsi'] ?? null,
            'is_aktif' => $validated['isAktif'] ?? true,
        ];

        $masterData = $this->repository->create($data);
        return response()->json($masterData, 201);
    }

    public function update(Request $request, string $namaModul): JsonResponse
    {
        $validated = $request->validate([
            'namaTampil' => 'nullable|string',
            'deskripsi' => 'nullable|string',
            'isAktif' => 'boolean',
        ]);

        $data = [
            'nama_tampil' => $validated['namaTampil'] ?? $this->repository->find($namaModul)->getNamaTampil(),
            'deskripsi' => $validated['deskripsi'] ?? $this->repository->find($namaModul)->getDeskripsi(),
            'is_aktif' => $validated['isAktif'] ?? $this->repository->find($namaModul)->isAktif(),
        ];

        $masterData = $this->repository->update($namaModul, $data);
        return response()->json($masterData);
    }

    public function destroy(string $namaModul): JsonResponse
    {
        $this->repository->delete($namaModul);
        return response()->json(null, 204);
    }
}