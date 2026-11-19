<?php

namespace App\Modules\Admin\System\Pengguna\Http;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Modules\Admin\System\Pengguna\Contracts\PenggunaRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

final class PenggunaController extends Controller
{
    public function __construct(
        private readonly PenggunaRepository $repository
    ) {}

    public function index(): JsonResponse
    {
        $users = $this->repository->getAktif();
        return response()->json(['data' => $users]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $this->validateRequest($request);

        $user = $this->repository->create($validated);
        return response()->json(['data' => $user], 201);
    }

    public function show(int $id): JsonResponse
    {
        $user = $this->repository->find($id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }
        return response()->json(['data' => $user]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $user = $this->repository->find($id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $validated = $this->validateRequest($request, $id);

        $user = $this->repository->update($id, $validated);
        return response()->json(['data' => $user]);
    }

    public function destroy(int $id): JsonResponse
    {
        $this->repository->delete($id);
        return response()->json(['message' => 'Deleted']);
    }

    /**
     * Validasi request dengan support untuk 'role' dari frontend
     */
    private function validateRequest(Request $request, ?int $ignoreId = null): array
    {
        $hasRole = $request->filled('role');

        $rules = [
            'role_id' => $hasRole
                ? 'nullable'
                : ($ignoreId ? 'sometimes|exists:roles,id' : 'required|exists:roles,id'),
            'role' => 'sometimes|string|in:superadmin,admin,operator,instruktur,koordinator,peserta',
            'nama_lengkap' => 'nullable|string|max:255',
            'email' => ['sometimes', 'required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($ignoreId)],
            'password' => $ignoreId ? 'nullable|string|min:6|confirmed' : 'required|string|min:6|confirmed',
            'telepon' => 'nullable|string|max:20',
            'alamat' => 'nullable|string',
            'foto_profil' => 'nullable|string|max:255',
            'is_aktif' => 'boolean',
        ];

        $validated = $request->validate($rules);

        // Map frontend role ke role_id jika role dikirim
        if ($hasRole) {
            $role = Role::where('slug', $validated['role'])->first();
            if ($role) {
                $validated['role_id'] = $role->id;
            }
            unset($validated['role']);
        }

        return $validated;
    }
}
