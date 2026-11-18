<?php

namespace App\Modules\Koordinator\MasterData\Http;

use App\Modules\Koordinator\MasterData\Infrastructure\SesiEloquentModel;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class SesiController extends \App\Http\Controllers\Controller
{
    private SesiEloquentModel $model;

    public function __construct()
    {
        $this->model = new SesiEloquentModel();
    }

    public function index(): JsonResponse
    {
        return response()->json($this->model->all());
    }

    public function show(int $id): JsonResponse
    {
        $item = $this->model->find($id);
        if (!$item) {
            return response()->json(['message' => 'Sesi not found'], 404);
        }
        return response()->json($item);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'judul' => 'required|string',
            'deskripsi' => 'nullable|string',
            'tanggalMulai' => 'required|date',
            'tanggalAkhir' => 'required|date',
            'isAktif' => 'boolean',
        ]);

        $data = [
            'judul' => $validated['judul'],
            'deskripsi' => $validated['deskripsi'] ?? null,
            'tanggal_mulai' => $validated['tanggalMulai'],
            'tanggal_akhir' => $validated['tanggalAkhir'],
            'is_aktif' => $validated['isAktif'] ?? true,
        ];

        $item = $this->model->create($data);
        return response()->json($item, 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'judul' => 'nullable|string',
            'deskripsi' => 'nullable|string',
            'tanggalMulai' => 'nullable|date',
            'tanggalAkhir' => 'nullable|date',
            'isAktif' => 'boolean',
        ]);

        $data = [
            'judul' => $validated['judul'] ?? $this->model->find($id)->getJudul(),
            'deskripsi' => $validated['deskripsi'] ?? $this->model->find($id)->getDeskripsi(),
            'tanggalMulai' => $validated['tanggalMulai'] ?? $this->model->find($id)->getTanggalMulai(),
            'tanggalAkhir' => $validated['tanggalAkhir'] ?? $this->model->find($id)->getTanggalAkhir(),
            'isAktif' => $validated['isAktif'] ?? $this->model->find($id)->isAktif(),
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