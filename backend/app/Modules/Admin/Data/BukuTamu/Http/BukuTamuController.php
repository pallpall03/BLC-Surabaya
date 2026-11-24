<?php

namespace App\Modules\Admin\Data\BukuTamu\Http;

use App\Http\Controllers\Controller;
use App\Modules\Admin\Data\BukuTamu\Contracts\BukuTamuRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class BukuTamuController extends Controller
{
    public function __construct(
        private readonly BukuTamuRepository $repository
    ) {}

    public function index(): JsonResponse
    {
        $buku = $this->repository->getAktif();
        return response()->json(['data' => $buku]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'email' => 'nullable|string|email|max:255',
            'pesan' => 'required|string',
            'rating' => 'nullable|integer|min:1|max:5',
            'urutan' => 'sometimes|integer|min:0',
            'is_aktif' => 'sometimes|boolean',
        ]);

        $buku = $this->repository->create($validated);
        return response()->json(['data' => $buku], 201);
    }

    public function show(int $id): JsonResponse
    {
        $buku = $this->repository->find($id);
        if (!$buku) {
            return response()->json(['message' => 'Buku Tamu not found'], 404);
        }
        return response()->json(['data' => $buku]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'nama' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|nullable|string|email|max:255',
            'pesan' => 'sometimes|required|string',
            'rating' => 'sometimes|nullable|integer|min:1|max:5',
            'urutan' => 'sometimes|integer|min:0',
            'is_aktif' => 'sometimes|boolean',
        ]);

        $buku = $this->repository->update($id, $validated);
        return response()->json(['data' => $buku]);
    }

    public function destroy(int $id): JsonResponse
    {
        $this->repository->delete($id);
        return response()->json(['message' => 'Deleted']);
    }
}