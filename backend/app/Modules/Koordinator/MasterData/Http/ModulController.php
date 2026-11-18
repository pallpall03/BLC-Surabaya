<?php

namespace App\Modules\Koordinator\MasterData\Http;

use App\Modules\Koordinator\MasterData\Infrastructure\ModulEloquentModel;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ModulController extends \App\Http\Controllers\Controller
{
    private ModulEloquentModel $model;

    public function __construct()
    {
        $this->model = new ModulEloquentModel();
    }

    public function index(): JsonResponse
    {
        return response()->json($this->model->all());
    }

    public function show(int $id): JsonResponse
    {
        $modul = $this->model->find($id);
        if (!$modul) {
            return response()->json(['message' => 'Modul not found'], 404);
        }
        return response()->json($modul);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'judul' => 'required|string',
            'deskripsi' => 'nullable|string',
            'tipe' => 'required|string|in:materi,soal',
            'isAktif' => 'boolean',
        ]);

        $data = [
            'judul' => $validated['judul'],
            'deskripsi' => $validated['deskripsi'] ?? null,
            'tipe' => $validated['tipe'] ?? 'materi',
            'isAktif' => $validated['isAktif'] ?? true,
        ];

        $modul = $this->model->create($data);
        return response()->json($modul, 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'judul' => 'nullable|string',
            'deskripsi' => 'nullable|string',
            'tipe' => 'nullable|string|in:materi,soal',
            'isAktif' => 'boolean',
        ]);

        $data = [
            'judul' => $validated['judul'] ?? $this->model->find($id)->getJudul(),
            'deskripsi' => $validated['deskripsi'] ?? $this->model->find($id)->getDeskripsi(),
            'tipe' => $validated['tipe'] ?? $this->model->find($id)->getTipe(),
            'isAktif' => $validated['isAktif'] ?? $this->model->find($id)->isAktif(),
        ];

        $modul = $this->model->update($id, $data);
        return response()->json($modul);
    }

    public function destroy(int $id): JsonResponse
    {
        $this->model->delete($id);
        return response()->json(null, 204);
    }
}