<?php

namespace App\Modules\Admin\Data\Ujian\Http;

use App\Http\Controllers\Controller;
use App\Modules\Admin\Data\Ujian\Contracts\UjianRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class UjianController extends Controller
{
    public function __construct(
        private readonly UjianRepository $repository
    ) {}

    public function index(): JsonResponse
    {
        $ujians = $this->repository->getAktif();
        return response()->json(['data' => $ujians]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'judul' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:ujian,slug',
            'deskripsi' => 'nullable|string',
            'durasi_menit' => 'integer|default:60',
            'urutan' => 'integer|default:0',
            'is_aktif' => 'boolean',
        ]);

        $ujian = $this->repository->create($validated);
        return response()->json(['data' => $ujian], 201);
    }

    public function show(int $id): JsonResponse
    {
        $ujian = $this->repository->find($id);
        if (!$ujian) {
            return response()->json(['message' => 'Ujian not found'], 404);
        }
        return response()->json(['data' => $ujian]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'judul' => 'sometimes|required|string|max:255',
            'slug' => 'sometimes|string|max:255|unique:ujian,slug,' . $id,
            'deskripsi' => 'sometimes|string',
            'durasi_menit' => 'sometimes|integer',
            'urutan' => 'sometimes|integer',
            'is_aktif' => 'sometimes|boolean',
        ]);

        $ujian = $this->repository->update($id, $validated);
        return response()->json(['data' => $ujian]);
    }

    public function destroy(int $id): JsonResponse
    {
        $this->repository->softDelete($id);
        return response()->json(['message' => 'Deleted']);
    }
}
