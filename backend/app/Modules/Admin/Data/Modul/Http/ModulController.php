<?php

namespace App\Modules\Admin\Data\Modul\Http;

use App\Http\Controllers\Controller;
use App\Modules\Admin\Data\Modul\Contracts\ModulRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class ModulController extends Controller
{
    public function __construct(
        private readonly ModulRepository $repository
    ) {}

    public function index(): JsonResponse
    {
        $moduls = $this->repository->getAktif();
        return response()->json(['data' => $moduls]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:modul,slug',
            'deskripsi' => 'nullable|string',
            'urutan' => 'integer|default:0',
            'is_aktif' => 'boolean',
        ]);

        $modul = $this->repository->create($validated);
        return response()->json(['data' => $modul], 201);
    }

    public function show(int $id): JsonResponse
    {
        $modul = $this->repository->find($id);
        if (!$modul) {
            return response()->json(['message' => 'Modul not found'], 404);
        }
        return response()->json(['data' => $modul]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'nama' => 'sometimes|required|string|max:255',
            'slug' => 'sometimes|string|max:255|unique:modul,slug,' . $id,
            'deskripsi' => 'sometimes|string',
            'urutan' => 'sometimes|integer',
            'is_aktif' => 'sometimes|boolean',
        ]);

        $modul = $this->repository->update($id, $validated);
        return response()->json(['data' => $modul]);
    }

    public function destroy(int $id): JsonResponse
    {
        $this->repository->softDelete($id);
        return response()->json(['message' => 'Deleted']);
    }
}
