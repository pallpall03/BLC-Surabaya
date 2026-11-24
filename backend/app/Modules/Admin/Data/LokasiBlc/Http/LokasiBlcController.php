<?php

namespace App\Modules\Admin\Data\LokasiBlc\Http;

use App\Http\Controllers\Controller;
use App\Modules\Admin\Data\LokasiBlc\Contracts\LokasiBlcRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class LokasiBlcController extends Controller
{
    public function __construct(
        private readonly LokasiBlcRepository $repository
    ) {}

    public function index(): JsonResponse
    {
        $lokasis = $this->repository->all();
        return response()->json(['data' => $lokasis]);
    }

    public function aktif(): JsonResponse
    {
        $lokasis = $this->repository->getAktif();
        return response()->json(['data' => $lokasis]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nama_blc' => 'required|string|max:255',
            'alamat' => 'nullable|string',
            'foto_blc' => 'nullable|string|max:255',
            'foto2_blc' => 'nullable|string|max:255',
            'radius' => 'nullable|string',
            'latitude' => 'nullable|string',
            'longitude' => 'nullable|string',
            'foto_absen_ins' => 'nullable|string|max:255',
            'ver_foto_absen_ins' => 'nullable|integer',
            'area' => 'nullable|string',
            'aktif' => 'sometimes|boolean',
            'is_korwil' => 'sometimes|boolean',
            'is_teknisi_ahli' => 'sometimes|boolean',
            'is_teknisi' => 'sometimes|boolean',
        ]);

        $lokasi = $this->repository->create($validated);
        return response()->json(['data' => $lokasi], 201);
    }

    public function show(int $id): JsonResponse
    {
        $lokasi = $this->repository->find($id);
        if (!$lokasi) {
            return response()->json(['message' => 'Lokasi BLC not found'], 404);
        }
        return response()->json(['data' => $lokasi]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'nama_blc' => 'sometimes|required|string|max:255',
            'alamat' => 'sometimes|nullable|string',
            'foto_blc' => 'sometimes|nullable|string|max:255',
            'foto2_blc' => 'sometimes|nullable|string|max:255',
            'radius' => 'sometimes|nullable|string',
            'latitude' => 'sometimes|nullable|string',
            'longitude' => 'sometimes|nullable|string',
            'foto_absen_ins' => 'sometimes|nullable|string|max:255',
            'ver_foto_absen_ins' => 'sometimes|nullable|integer',
            'area' => 'sometimes|nullable|string',
            'aktif' => 'sometimes|boolean',
            'is_korwil' => 'sometimes|boolean',
            'is_teknisi_ahli' => 'sometimes|boolean',
            'is_teknisi' => 'sometimes|boolean',
        ]);

        $lokasi = $this->repository->update($id, $validated);
        return response()->json(['data' => $lokasi]);
    }

    public function destroy(int $id): JsonResponse
    {
        $this->repository->delete($id);
        return response()->json(['message' => 'Deleted']);
    }
}
