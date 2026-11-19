<?php

namespace App\Modules\Admin\Data\KategoriArtikel\Http;

use App\Http\Controllers\Controller;
use App\Modules\Admin\Data\KategoriArtikel\Contracts\KategoriArtikelRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class KategoriArtikelController extends Controller
{
    public function __construct(
        private readonly KategoriArtikelRepository $repository
    ) {}

    public function index(): JsonResponse
    {
        $kategoris = $this->repository->getAktif();
        return response()->json(['data' => $kategoris]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:kategori_artikel,slug',
            'deskripsi' => 'nullable|string',
            'urutan' => 'integer|default:0',
            'is_aktif' => 'boolean',
        ]);

        $kategori = $this->repository->create($validated);
        return response()->json(['data' => $kategori], 201);
    }

    public function show(int $id): JsonResponse
    {
        $kategori = $this->repository->find($id);
        if (!$kategori) {
            return response()->json(['message' => 'Kategori Artikel not found'], 404);
        }
        return response()->json(['data' => $kategori]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'nama' => 'sometimes|required|string|max:255',
            'slug' => 'sometimes|string|max:255|unique:kategori_artikel,slug,' . $id,
            'deskripsi' => 'sometimes|string',
            'urutan' => 'sometimes|integer',
            'is_aktif' => 'sometimes|boolean',
        ]);

        $kategori = $this->repository->update($id, $validated);
        return response()->json(['data' => $kategori]);
    }

    public function destroy(int $id): JsonResponse
    {
        $this->repository->softDelete($id);
        return response()->json(['message' => 'Deleted']);
    }
}
