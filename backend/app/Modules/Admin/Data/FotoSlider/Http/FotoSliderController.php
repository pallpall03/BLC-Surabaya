<?php

namespace App\Modules\Admin\Data\FotoSlider\Http;

use App\Http\Controllers\Controller;
use App\Modules\Admin\Data\FotoSlider\Contracts\FotoSliderRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class FotoSliderController extends Controller
{
    public function __construct(
        private readonly FotoSliderRepository $repository
    ) {}

    public function index(): JsonResponse
    {
        $fotos = $this->repository->getAktif();
        return response()->json(['data' => $fotos]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'judul' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'gambar' => 'required|string|max:255',
            'urutan' => 'sometimes|integer|min:0',
            'aktif' => 'sometimes|boolean',
        ]);

        $foto = $this->repository->create($validated);
        return response()->json(['data' => $foto], 201);
    }

    public function show(int $id): JsonResponse
    {
        $foto = $this->repository->find($id);
        if (!$foto) {
            return response()->json(['message' => 'Foto Slider not found'], 404);
        }
        return response()->json(['data' => $foto]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'judul' => 'sometimes|required|string|max:255',
            'deskripsi' => 'sometimes|string',
            'gambar' => 'sometimes|string|max:255',
            'urutan' => 'sometimes|integer',
            'aktif' => 'sometimes|boolean',
        ]);

        $foto = $this->repository->update($id, $validated);
        return response()->json(['data' => $foto]);
    }

    public function destroy(int $id): JsonResponse
    {
        $this->repository->delete($id);
        return response()->json(['message' => 'Deleted']);
    }
}
