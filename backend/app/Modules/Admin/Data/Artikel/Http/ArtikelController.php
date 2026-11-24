<?php

namespace App\Modules\Admin\Data\Artikel\Http;

use App\Http\Controllers\Controller;
use App\Modules\Admin\Data\Artikel\Contracts\ArtikelRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class ArtikelController extends Controller
{
    public function __construct(
        private readonly ArtikelRepository $repository
    ) {}

    public function index(): JsonResponse
    {
        $artikels = $this->repository->getAktif();
        return response()->json(['data' => $artikels]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'kategori_artikel_id' => 'required|exists:kategori_artikel,id',
            'judul' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:artikel,slug',
            'konten' => 'nullable|string',
            'ringkasan' => 'nullable|string',
            'gambar_utama' => 'nullable|string|max:255',
            'penulis' => 'nullable|string|max:100',
            'tanggal_publikasi' => 'nullable|date',
            'is_aktif' => 'boolean',
        ]);

        $artikel = $this->repository->create($validated);
        return response()->json(['data' => $artikel], 201);
    }

    public function show(int $id): JsonResponse
    {
        $artikel = $this->repository->find($id);
        if (!$artikel) {
            return response()->json(['message' => 'Artikel not found'], 404);
        }
        return response()->json(['data' => $artikel]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'kategori_artikel_id' => 'sometimes|exists:kategori_artikel,id',
            'judul' => 'sometimes|string|max:255',
            'slug' => 'sometimes|string|max:255|unique:artikel,slug,' . $id,
            'konten' => 'nullable|string',
            'ringkasan' => 'nullable|string',
            'gambar_utama' => 'nullable|string|max:255',
            'penulis' => 'nullable|string|max:100',
            'tanggal_publikasi' => 'nullable|date',
            'is_aktif' => 'boolean',
        ]);

        $artikel = $this->repository->update($id, $validated);
        return response()->json(['data' => $artikel]);
    }

    public function destroy(int $id): JsonResponse
        {
            $this->repository->delete($id);
            return response()->json(['message' => 'Deleted']);
        }

    public function latest(): JsonResponse
    {
        $artikels = $this->repository->getLatest(10);
        return response()->json(['data' => $artikels]);
    }

    public function byKategori(int $kategoriId): JsonResponse
    {
        $artikels = $this->repository->getByKategori($kategoriId);
        return response()->json(['data' => $artikels]);
    }
}
