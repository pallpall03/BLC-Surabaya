<?php

namespace App\Modules\Koordinator\MasterData\Http;

use App\Modules\Koordinator\MasterData\Infrastructure\InstrukturEloquentModel;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class InstrukturController extends \App\Http\Controllers\Controller
{
    private InstrukturEloquentModel $model;

    public function __construct()
    {
        $this->model = new InstrukturEloquentModel();
    }

    public function index(): JsonResponse
    {
        return response()->json($this->model->all());
    }

    public function show(int $id): JsonResponse
    {
        $instruktur = $this->model->find($id);
        if (!$instruktur) {
            return response()->json(['message' => 'Instruktur not found'], 404);
        }
        return response()->json($instruktur);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'namaLengkap' => 'required|string',
            'username' => 'required|string|unique:instrukturs,username',
            'jenisKelamin' => 'required|in:L,P',
            'lokasiBlcId' => 'nullable|string',
            'kantorKuUserId' => 'nullable|string',
            'email' => 'nullable|email',
            'telepon' => 'nullable|string',
            'alamat' => 'nullable|string',
            'isAktif' => 'boolean',
        ]);

        $data = [
            'nama_lengkap' => $validated['namaLengkap'],
            'username' => $validated['username'],
            'jenis_kelamin' => $validated['jenisKelamin'],
            'lokasiBlcId' => $validated['lokasiBlcId'] ?? null,
            'kantor_ku_user_id' => $validated['kantorKuUserId'] ?? null,
            'email' => $validated['email'] ?? null,
            'telepon' => $validated['telepon'] ?? null,
            'alamat' => $validated['alamat'] ?? null,
            'is_aktif' => $validated['isAktif'] ?? true,
        ];

        $instruktur = $this->model->create($data);
        return response()->json($instruktur, 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'namaLengkap' => 'nullable|string',
            'username' => 'nullable|string|unique:instrukturs,username,' . $id,
            'jenisKelamin' => 'nullable|in:L,P',
            'lokasiBlcId' => 'nullable|string',
            'kantorKuUserId' => 'nullable|string',
            'email' => 'nullable|email',
            'telepon' => 'nullable|string',
            'alamat' => 'nullable|string',
            'isAktif' => 'boolean',
        ]);

        $data = [
            'nama_lengkap' => $validated['namaLengkap'] ?? $this->model->find($id)->getNamaLengkap(),
            'username' => $validated['username'] ?? $this->model->find($id)->getUsername(),
            'jenis_kelamin' => $validated['jenisKelamin'] ?? $this->model->find($id)->getJenisKelamin(),
            'lokasiBlcId' => $validated['lokasiBlcId'] ?? $this->model->find($id)->getLokasiBlcId(),
            'kantor_ku_user_id' => $validated['kantorKuUserId'] ?? $this->model->find($id)->getKantorKuUserId(),
            'email' => $validated['email'] ?? $this->model->find($id)->getEmail(),
            'telepon' => $validated['telepon'] ?? $this->model->find($id)->getTelepon(),
            'alamat' => $validated['alamat'] ?? $this->model->find($id)->getAlamat(),
            'is_aktif' => $validated['isAktif'] ?? $this->model->find($id)->isAktif(),
        ];

        $instruktur = $this->model->update($id, $data);
        return response()->json($instruktur);
    }

    public function destroy(int $id): JsonResponse
    {
        $this->model->delete($id);
        return response()->json(null, 204);
    }
}