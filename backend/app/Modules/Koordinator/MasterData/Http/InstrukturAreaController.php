<?php

namespace App\Modules\Koordinator\MasterData\Http;

use App\Modules\Koordinator\MasterData\Infrastructure\InstrukturAreaEloquentModel;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class InstrukturAreaController extends \App\Http\Controllers\Controller
{
    private InstrukturAreaEloquentModel $model;

    public function __construct()
    {
        $this->model = new InstrukturAreaEloquentModel();
    }

    public function index(): JsonResponse
    {
        return response()->json($this->model->all());
    }

    public function show(int $id): JsonResponse
    {
        $item = $this->model->find($id);
        if (!$item) {
            return response()->json(['message' => 'InstrukturArea not found'], 404);
        }
        return response()->json($item);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'namaArea' => 'required|string',
            'instrukturId' => 'required|string',
            'lokasiBlcId' => 'required|string',
            'lokasiBlcNama' => 'required|string',
        ]);

        $data = [
            'nama_area' => $validated['namaArea'],
            'instruktur_id' => $validated['instrukturId'],
            'lokasi_blc_id' => $validated['lokasiBlcId'],
            'lokasi_blc_nama' => $validated['lokasiBlcNama'],
        ];

        $item = $this->model->create($data);
        return response()->json($item, 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'namaArea' => 'nullable|string',
            'instrukturId' => 'nullable|string',
            'lokasiBlcId' => 'nullable|string',
            'lokasiBlcNama' => 'nullable|string',
        ]);

        $data = [
            'nama_area' => $validated['namaArea'] ?? $this->model->find($id)->getNamaArea(),
            'instruktur_id' => $validated['instrukturId'] ?? $this->model->find($id)->getInstrukturId(),
            'lokasi_blc_id' => $validated['lokasiBlcId'] ?? $this->model->find($id)->getLokasiBlcId(),
            'lokasi_blc_nama' => $validated['lokasiBlcNama'] ?? $this->model->find($id)->getLokasiBlcNama(),
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