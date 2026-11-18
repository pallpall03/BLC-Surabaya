<?php

namespace App\Modules\Koordinator\MasterData\Http;

use App\Modules\Koordinator\MasterData\Infrastructure\SoalEloquentModel;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class SoalController extends \App\Http\Controllers\Controller
{
    private SoalEloquentModel $model;

    public function __construct()
    {
        $this->model = new SoalEloquentModel();
    }

    public function index(): JsonResponse
    {
        return response()->json($this->model->all());
    }

    public function show(int $id): JsonResponse
    {
        $soal = $this->model->find($id);
        if (!$soal) {
            return response()->json(['message' => 'Soal not found'], 404);
        }
        return response()->json($soal);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'judul' => 'required|string',
            'deskripsi' => 'nullable|string',
            'tipeSoal' => 'required|string|in:pilihan_ganda,esai,esai_kode',
            'isAktif' => 'boolean',
        ]);

        $data = [
            'judul' => $validated['judul'],
            'deskripsi' => $validated['deskripsi'] ?? null,
            'tipe_soal' => $validated['tipeSoal'],
            'is_aktif' => $validated['isAktif'] ?? true,
        ];

        $soal = $this->model->create($data);
        return response()->json($soal, 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'judul' => 'nullable|string',
            'deskripsi' => 'nullable|string',
            'tipeSoal' => 'nullable|string|in:pilihan_ganda,esai,esai_kode',
            'isAktif' => 'boolean',
        ]);

        $data = [
            'judul' => $validated['judul'] ?? $this->model->find($id)->getJudul(),
            'deskripsi' => $validated['deskripsi'] ?? $this->model->find($id)->getDeskripsi(),
            'tipeSoal' => $validated['tipeSoal'] ?? $this->model->find($id)->getTipeSoal(),
            'isAktif' => $validated['isAktif'] ?? $this->model->find($id)->isAktif(),
        ];

        $soal = $this->model->update($id, $data);
        return response()->json($soal);
    }

    public function destroy(int $id): JsonResponse
    {
        $this->model->delete($id);
        return response()->json(null, 204);
    }
}