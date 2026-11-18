<?php

namespace App\Modules\Koordinator\MasterData\Http;

use App\Modules\Koordinator\MasterData\Infrastructure\MateriPerPertemuanEloquentModel;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class MateriPerPertemuanController extends \App\Http\Controllers\Controller
{
    private MateriPerPertemuanEloquentModel $model;

    public function __construct()
    {
        $this->model = new MateriPerPertemuanEloquentModel();
    }

    public function index(): JsonResponse
    {
        return response()->json($this->model->all());
    }

    public function show(int $id): JsonResponse
    {
        $item = $this->model->find($id);
        if (!$item) {
            return response()->json(['message' => 'MateriPerPertemuan not found'], 404);
        }
        return response()->json($item);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'materiId' => 'required|string',
            'pertemuanKe' => 'required|integer|min:1',
            'judul' => 'required|string',
            'deskripsi' => 'nullable|string',
            'filePath' => 'nullable|string',
        ]);

        $data = [
            'materi_id' => $validated['materiId'],
            'pertemuan_ke' => $validated['pertemuanKe'],
            'judul' => $validated['judul'],
            'deskripsi' => $validated['deskripsi'] ?? null,
            'file_path' => $validated['filePath'] ?? null,
        ];

        $item = $this->model->create($data);
        return response()->json($item, 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'materiId' => 'nullable|string',
            'pertemuanKe' => 'nullable|integer|min:1',
            'judul' => 'nullable|string',
            'deskripsi' => 'nullable|string',
            'filePath' => 'nullable|string',
        ]);

        $data = [
            'materi_id' => $validated['materiId'] ?? $this->model->find($id)->getMateriId(),
            'pertemuan_ke' => $validated['pertemuanKe'] ?? $this->model->find($id)->getPertemuanKe(),
            'judul' => $validated['judul'] ?? $this->model->find($id)->getJudul(),
            'deskripsi' => $validated['deskripsi'] ?? $this->model->find($id)->getDeskripsi(),
            'file_path' => $validated['filePath'] ?? $this->model->find($id)->getFilePath(),
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