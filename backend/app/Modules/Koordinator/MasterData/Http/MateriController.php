<?php

namespace App\Modules\Koordinator\MasterData\Http;

use App\Modules\Koordinator\MasterData\Infrastructure\MateriEloquentModel;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class MateriController extends \App\Http\Controllers\Controller
{
    private MateriEloquentModel $model;

    public function __construct()
    {
        $this->model = new MateriEloquentModel();
    }

    public function index(): JsonResponse
    {
        return response()->json($this->model->all());
    }

    public function show(int $id): JsonResponse
    {
        $materi = $this->model->find($id);
        if (!$materi) {
            return response()->json(['message' => 'Materi not found'], 404);
        }
        return response()->json($materi);
    }

    public function store(Request $request): JsonResponse
        {
            $validated = $request->validate([
                'judul' => 'required|string',
                'deskripsi' => 'nullable|string',
                'filePath' => 'nullable|string',
                'tipe' => ['required', 'string', 'in:materi,tautan'],
                'isAktif' => 'boolean',
            ]);

            $data = [
                'judul' => $validated['judul'],
                'deskripsi' => $validated['deskripsi'] ?? null,
                'file_path' => $validated['filePath'] ?? null,
                'tipe' => $validated['tipe'] ?? 'materi',
                'is_aktif' => $validated['isAktif'] ?? true,
            ];

            $materi = $this->model->create($data);
            return response()->json($materi, 201);
        }

        public function update(Request $request, int $id): JsonResponse
        {
            $validated = $request->validate([
                'judul' => 'nullable|string',
                'deskripsi' => 'nullable|string',
                'filePath' => 'nullable|string',
                'tipe' => ['nullable', 'string', 'in:materi,tautan'],
                'isAktif' => 'boolean',
            ]);

            $data = [
                'judul' => $validated['judul'] ?? $this->model->find($id)->getJudul(),
                'deskripsi' => $validated['deskripsi'] ?? $this->model->find($id)->getDeskripsi(),
                'file_path' => $validated['filePath'] ?? $this->model->find($id)->getFilePath(),
                'tipe' => $validated['tipe'] ?? $this->model->find($id)->getTipe(),
                'is_aktif' => $validated['isAktif'] ?? $this->model->find($id)->isAktif(),
            ];

            $materi = $this->model->update($id, $data);
            return response()->json($materi);
        }

    public function destroy(int $id): JsonResponse
    {
        $this->model->delete($id);
        return response()->json(null, 204);
    }
}