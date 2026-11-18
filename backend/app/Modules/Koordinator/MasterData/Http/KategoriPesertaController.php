<?php

namespace App\Modules\Koordinator\MasterData\Http;

use App\Modules\Koordinator\MasterData\Infrastructure\KategoriPesertaEloquentModel;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class KategoriPesertaController extends \App\Http\Controllers\Controller
{
    private KategoriPesertaEloquentModel $model;

    public function __construct()
    {
        $this->model = new KategoriPesertaEloquentModel();
    }

    public function index(): JsonResponse
    {
        return response()->json($this->model->all());
    }

    public function show(int $id): JsonResponse
    {
        $item = $this->model->find($id);
        if (!$item) {
            return response()->json(['message' => 'KategoriPeserta not found'], 404);
        }
        return response()->json($item);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nama' => 'required|string',
            'deskripsi' => 'nullable|string',
            'isAktif' => 'boolean',
        ]);

        $data = [
            'nama' => $validated['nama'],
            'deskripsi' => $validated['deskripsi'] ?? null,
            'is_aktif' => $validated['isAktif'] ?? true,
        ];

        $item = $this->model->create($data);
        return response()->json($item, 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'nama' => 'nullable|string',
            'deskripsi' => 'nullable|string',
            'isAktif' => 'boolean',
        ]);

        $data = [
            'nama' => $validated['nama'] ?? $this->model->find($id)->getNama(),
            'deskripsi' => $validated['deskripsi'] ?? $this->model->find($id)->getDeskripsi(),
            'is_aktif' => $validated['isAktif'] ?? $this->model->find($id)->isAktif(),
        ];

        $item = $this->model->update($id, $data);
        return response()->json($item);
    }

    public function destroy(int $id): JsonResponse
    {
        $this->model->delete($id);
        return response()->json(null, 204);
    }
}