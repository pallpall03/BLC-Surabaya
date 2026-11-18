<?php

namespace App\Modules\Koordinator\Pengguna\Http;

use App\Modules\Koordinator\Pengguna\Contracts\PenggunaRepositoryInterface;
use App\Modules\Koordinator\Pengguna\Domain\ValueObjects\PenggunaId;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class PenggunaController extends \App\Http\Controllers\Controller
{
    public function __construct(
        private readonly PenggunaRepositoryInterface $repository
    ) {}

    public function index(): JsonResponse
    {
        return response()->json(array_map(fn($p) => $p->toArray(), $this->repository->all()));
    }

    public function show(string $id): JsonResponse
    {
        $pengguna = $this->repository->find(new PenggunaId($id));
        if (!$pengguna) {
            return response()->json(['message' => 'Pengguna not found'], 404);
        }
        return response()->json($pengguna->toArray());
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'username' => 'required|string|unique:pengguna,username',
            'email' => 'required|email|unique:pengguna,email',
            'password' => 'required|string|min:8',
            'namaLengkap' => 'required|string',
            'tanggalMasuk' => 'required|date',
            'lastLoginAt' => 'nullable|date',
            'peran' => 'required|string|in:admin,koordinator,instruktur,peserta',
        ]);

        $data = [
            'username' => $validated['username'],
            'email' => $validated['email'],
            'password_hash' => bcrypt($validated['password']),
            'nama_lengkap' => $validated['namaLengkap'],
            'tanggal_masuk' => $validated['tanggalMasuk'],
            'last_login_at' => $validated['lastLoginAt'] ?? now(),
            'peran' => $validated['peran'],
        ];

        $pengguna = $this->repository->create($data);
        return response()->json($pengguna->toArray(), 201);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $validated = $request->validate([
            'username' => 'nullable|string|unique:pengguna,username,' . $id,
            'email' => 'nullable|email|unique:pengguna,email,' . $id,
            'password' => 'nullable|string|min:8',
            'namaLengkap' => 'nullable|string',
            'tanggalMasuk' => 'nullable|date',
            'lastLoginAt' => 'nullable|date',
            'peran' => 'nullable|string|in:admin,koordinator,instruktur,peserta',
        ]);

        $data = [
            'username' => $validated['username'] ?? $this->repository->find(new PenggunaId($id))->getUsername(),
            'email' => $validated['email'] ?? $this->repository->find(new PenggunaId($id))->getEmail(),
            'password_hash' => $validated['password'] ? bcrypt($validated['password']) : $this->repository->find(new PenggunaId($id))->getPasswordHash(),
            'nama_lengkap' => $validated['namaLengkap'] ?? $this->repository->find(new PenggunaId($id))->getNamaLengkap(),
            'tanggal_masuk' => $validated['tanggalMasuk'] ?? $this->repository->find(new PenggunaId($id))->getTanggalMasuk()->toISOString(),
            'last_login_at' => $validated['lastLoginAt'] ?? $this->repository->find(new PenggunaId($id))->getLastLoginAt()->toISOString(),
            'peran' => $validated['peran'] ?? $this->repository->find(new PenggunaId($id))->getPeran(),
        ];

        $pengguna = $this->repository->update(new PenggunaId($id), $data);
        return response()->json($pengguna->toArray());
    }

    public function destroy(string $id): JsonResponse
    {
        $this->repository->delete(new PenggunaId($id));
        return response()->json(null, 204);
    }

    public function updateLastLogin(string $id): JsonResponse
    {
        $this->repository->updateLastLogin(new PenggunaId($id));
        return response()->json(['message' => 'Last login updated']);
    }
}