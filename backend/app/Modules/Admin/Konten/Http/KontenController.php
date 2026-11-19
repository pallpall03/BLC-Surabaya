<?php

namespace App\Modules\Admin\Konten\Http;

use App\Http\Controllers\Controller;
use App\Modules\Admin\Konten\Contracts\KontenRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class KontenController extends Controller
{
    public function __construct(
        private readonly KontenRepository $repository
    ) {}

    public function index(): JsonResponse
    {
        $tree = $this->repository->getTree();
        return response()->json(['data' => $tree]);
    }

    public function flat(): JsonResponse
    {
        $konten = $this->repository->getOrdered();
        return response()->json(['data' => $konten]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'parent_id' => 'nullable|exists:konten,id',
            'judul' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:konten,slug',
            'konten' => 'nullable|string',
            'ikon' => 'nullable|string|max:50',
            'urutan' => 'integer|min:0',
            'is_aktif' => 'boolean',
        ]);

        $konten = $this->repository->create($validated);
        return response()->json(['data' => $konten], 201);
    }

    public function show(int $id): JsonResponse
    {
        $konten = $this->repository->find($id);
        if (!$konten) {
            return response()->json(['message' => 'Konten not found'], 404);
        }
        return response()->json(['data' => $konten]);
    }

    public function bySlug(string $slug): JsonResponse
    {
        $konten = $this->repository->getBySlug($slug);
        if (!$konten) {
            return response()->json(['message' => 'Konten not found'], 404);
        }
        return response()->json(['data' => $konten]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'parent_id' => 'nullable|exists:konten,id',
            'judul' => 'sometimes|string|max:255',
            'slug' => 'sometimes|string|max:255|unique:konten,slug,' . $id,
            'konten' => 'nullable|string',
            'ikon' => 'nullable|string|max:50',
            'urutan' => 'integer|min:0',
            'is_aktif' => 'boolean',
        ]);

        $konten = $this->repository->update($id, $validated);
        return response()->json(['data' => $konten]);
    }

    public function destroy(int $id): JsonResponse
    {
        $this->repository->delete($id);
        return response()->json(['message' => 'Deleted']);
    }
}