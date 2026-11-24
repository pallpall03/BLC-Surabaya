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

    public function index(Request $request): JsonResponse
    {
        $roleSlug = $request->query('role');
        
        if ($roleSlug) {
            $frontendToBackendRole = [
                'administrator' => 'superadmin',
                'operator' => 'operator',
                'instruktur' => 'instruktur',
                'koordinator' => 'koordinator',
                'peserta' => 'peserta',
            ];
            $backendRole = $frontendToBackendRole[$roleSlug] ?? null;
            
            if ($backendRole) {
                $users = $this->repository->getByRole($backendRole);
                return response()->json(['data' => $users]);
            }
        }
        
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

        $isPasswordOnly = $request->has('password') && !$request->has('nama_lengkap') && !$request->has('email') && !$request->has('role');
        
        $validated = $this->validateRequest($request, $id, $isPasswordOnly);

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
    private function validateRequest(Request $request, ?int $ignoreId = null, bool $isPasswordOnly = false): array
    {
        $hasRole = $request->filled('role');

        // Map frontend role ke backend role slug
        $frontendToBackendRole = [
            'administrator' => 'superadmin',
            'operator' => 'operator',
            'instruktur' => 'instruktur',
            'koordinator' => 'koordinator',
            'peserta' => 'peserta',
        ];

        $backendRole = $hasRole && isset($frontendToBackendRole[$request->input('role')])
            ? $frontendToBackendRole[$request->input('role')]
            : null;

        if ($isPasswordOnly) {
            $rules = [
                'password' => 'required|string|min:6|confirmed',
            ];
        } else {
            $rules = [
                'role_id' => $hasRole && $backendRole
                    ? 'nullable'
                    : ($ignoreId ? 'sometimes|exists:roles,id' : 'required|exists:roles,id'),
                'role' => 'sometimes|string|in:administrator,operator,instruktur,koordinator',
                'nama_lengkap' => 'required|string|max:255',
                'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($ignoreId)],
                'nik' => ['nullable', 'digits:16', Rule::unique('users', 'nik')->ignore($ignoreId)],
                'username' => ['sometimes', 'string', 'max:255', Rule::unique('users', 'username')->ignore($ignoreId)],
                'password' => $ignoreId ? 'nullable|string|min:6|confirmed' : 'required|string|min:6|confirmed',
                'telepon' => 'nullable|string|max:20',
                'alamat' => 'nullable|string',
                'foto_profil' => 'nullable|string|max:255',
                'is_aktif' => 'boolean',
            ];
        }

        $validated = $request->validate($rules);

        // Map frontend role ke role_id jika role dikirim
        if ($hasRole && $backendRole) {
            $role = Role::where('slug', $backendRole)->first();
            if ($role) {
                $validated['role_id'] = $role->id;
            }
            unset($validated['role']);
        }

        return $validated;
    }
}
