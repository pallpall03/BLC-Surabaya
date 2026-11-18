<?php

namespace App\Modules\Koordinator\KoordinatorProfile\Http;

use App\Http\Controllers\Controller;
use App\Modules\Koordinator\KoordinatorProfile\Contracts\KoordinatorProfileRepositoryInterface;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class KoordinatorProfileController extends Controller
{
    public function __construct(
        private KoordinatorProfileRepositoryInterface $repository
    ) {}

    public function index(): JsonResponse
    {
        return response()->json($this->repository->all());
    }

    public function show(int $id): JsonResponse
    {
        $profile = $this->repository->find($id);
        if (!$profile) {
            return response()->json(['message' => 'KoordinatorProfile not found'], 404);
        }
        return response()->json($profile);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'pengguna_id' => 'required|string|unique:koordinator_profiles',
            'kantor_ku_user_id' => 'nullable|string|unique:koordinator_profiles',
            'lokasi_blc_ids' => 'nullable|array',
            'nip' => 'nullable|string|unique:koordinator_profiles',
            'bidang_keahlian' => 'nullable|string',
            'is_aktif' => 'boolean',
        ]);
        $profile = $this->repository->create($validated);
        return response()->json($profile, 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'kantor_ku_user_id' => 'nullable|string|unique:koordinator_profiles,kantor_ku_user_id,' . $id,
            'lokasi_blc_ids' => 'nullable|array',
            'nip' => 'nullable|string|unique:koordinator_profiles,nip,' . $id,
            'bidang_keahlian' => 'nullable|string',
            'is_aktif' => 'boolean',
        ]);
        $profile = $this->repository->update($id, $validated);
        return response()->json($profile);
    }

    public function destroy(int $id): JsonResponse
    {
        $this->repository->delete($id);
        return response()->json(null, 204);
    }
}