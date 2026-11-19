<?php

namespace App\Modules\Koordinator\MasterData\Http;

use App\Modules\Koordinator\MasterData\Infrastructure\BlcAreaEloquentModel;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class BlcAreaController extends \App\Http\Controllers\Controller
{
    private BlcAreaEloquentModel $model;

    public function __construct()
    {
        $this->model = new BlcAreaEloquentModel();
    }

    public function index(): JsonResponse
    {
        return response()->json($this->model->all());
    }

    public function show(int $id): JsonResponse
    {
        $item = $this->model->find($id);
        if (!$item) {
            return response()->json(['message' => 'BlcArea not found'], 404);
        }
        return response()->json($item);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nama' => 'required|string',
            'alamat' => 'nullable|string',
            'koordinatorId' => 'nullable|string',
            'isAktif' => 'boolean',
        ]);

        $data = [
            'nama' => $validated['nama'],
            'alamat' => $validated['alamat'] ?? null,
            'koordinator_id' => $validated['koordinatorId'] ?? null,
            'is_aktif' => $validated['isAktif'] ?? true,
        ];

        $item = $this->model->create($data);
        return response()->json($item, 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'nama' => 'nullable|string',
            'alamat' => 'nullable|string',
            'koordinatorId' => 'nullable|string',
            'isAktif' => 'boolean',
        ]);

        $data = [
            'nama' => $validated['nama'] ?? $this->model->find($id)->getNama(),
            'alamat' => $validated['alamat'] ?? $this->model->find($id)->getAlamat(),
            'koordinator_id' => $validated['koordinatorId'] ?? $this->model->find($id)->getKoordinatorId(),
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