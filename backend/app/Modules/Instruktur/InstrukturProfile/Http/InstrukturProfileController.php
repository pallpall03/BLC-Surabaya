<?php

namespace App\Modules\Instruktur\InstrukturProfile\Http;

use App\Http\Controllers\Controller;
use App\Modules\Instruktur\InstrukturProfile\Contracts\InstrukturProfileRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class InstrukturProfileController extends Controller
{
    public function __construct(
        private readonly InstrukturProfileRepository $repository
    ) {}

    public function index(): JsonResponse
    {
        $profiles = $this->repository->all();
        return response()->json($profiles);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'pengguna_id' => 'required|exists:users,id',
            'kantor_ku_user_id' => 'required|unique:instruktur_profiles,kantor_ku_user_id',
            'lokasi_blc_id' => 'nullable|exists:lokasi_blc,id',
            'nip' => 'nullable|unique:instruktur_profiles,nip',
            'bidang_keahlian' => 'nullable|string',
            'riwayat_pendidikan' => 'nullable|string',
            'riwayat_pelatihan' => 'nullable|string',
            'is_aktif' => 'required|boolean',
        ]);

        $profile = $this->repository->create([
            'pengguna_id' => $validated['pengguna_id'],
            'kantor_ku_user_id' => $validated['kantor_ku_user_id'],
            'lokasi_blc_id' => $validated['lokasi_blc_id'],
            'nip' => $validated['nip'],
            'bidang_keahlian' => $validated['bidang_keahlian'],
            'riwayat_pendidikan' => $validated['riwayat_pendidikan'],
            'riwayat_pelatihan' => $validated['riwayat_pelatihan'],
            'is_aktif' => $validated['is_aktif'],
        ]);

        return response()->json($profile, 201);
    }

    public function show(int $id): JsonResponse
    {
        $profile = $this->repository->find($id);
        return response()->json($profile);
    }

    public function update(int $id, Request $request): JsonResponse
    {
        $validated = $request->validate([
            'pengguna_id' => 'required|exists:users,id',
            'kantor_ku_user_id' => 'required|unique:instruktur_profiles,kantor_ku_user_id',
            'lokasi_blc_id' => 'nullable|exists:lokasi_blc,id',
            'nip' => 'nullable|unique:instruktur_profiles,nip',
            'bidang_keahlian' => 'nullable|string',
            'riwayat_pendidikan' => 'nullable|string',
            'riwayat_pelatihan' => 'nullable|string',
            'is_aktif' => 'required|boolean',
        ]);

        $profile = $this->repository->update($id, $validated);

        return response()->json($profile);
    }

    public function destroy(int $id): JsonResponse
    {
        $this->repository->delete($id);
        return response()->json(['message' => 'Profile deleted']);
    }
}