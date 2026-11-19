<?php

namespace App\Modules\Admin\System\MenuAkses\Http;

use App\Http\Controllers\Controller;
use App\Modules\Admin\System\MenuAkses\Contracts\MenuAksesRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class MenuAksesController extends Controller
{
    public function __construct(
        private readonly MenuAksesRepository $repository
    ) {}

    public function index(): JsonResponse
    {
        $akses = $this->repository->all();
        return response()->json(['data' => $akses]);
    }

    public function byRole(int $roleId): JsonResponse
    {
        $akses = $this->repository->getByRole($roleId);
        return response()->json(['data' => $akses]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'role_id' => 'required|exists:roles,id',
            'menu_id' => 'required|exists:menu,id',
            'bisa_lihat' => 'boolean',
            'bisa_tambah' => 'boolean',
            'bisa_edit' => 'boolean',
            'bisa_hapus' => 'boolean',
        ]);

        // Check if already exists
        $existing = $this->repository->getByRoleAndMenu($validated['role_id'], $validated['menu_id']);
        if ($existing) {
            $akses = $this->repository->update($existing->id, $validated);
            return response()->json(['data' => $akses]);
        }

        $akses = $this->repository->create($validated);
        return response()->json(['data' => $akses], 201);
    }

    public function show(int $id): JsonResponse
    {
        $akses = $this->repository->find($id);
        if (!$akses) {
            return response()->json(['message' => 'Not found'], 404);
        }
        return response()->json(['data' => $akses]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'bisa_lihat' => 'boolean',
            'bisa_tambah' => 'boolean',
            'bisa_edit' => 'boolean',
            'bisa_hapus' => 'boolean',
        ]);

        $akses = $this->repository->update($id, $validated);
        return response()->json(['data' => $akses]);
    }

    public function destroy(int $id): JsonResponse
    {
        $this->repository->delete($id);
        return response()->json(['message' => 'Deleted']);
    }

    public function sync(Request $request, int $roleId): JsonResponse
    {
        $validated = $request->validate([
            'menu_akses' => 'required|array',
            'menu_akses.*.menu_id' => 'required|exists:menu,id',
            'menu_akses.*.bisa_lihat' => 'boolean',
            'menu_akses.*.bisa_tambah' => 'boolean',
            'menu_akses.*.bisa_edit' => 'boolean',
            'menu_akses.*.bisa_hapus' => 'boolean',
        ]);

        $syncData = [];
        foreach ($validated['menu_akses'] as $item) {
            $syncData[$item['menu_id']] = [
                'bisa_lihat' => $item['bisa_lihat'] ?? true,
                'bisa_tambah' => $item['bisa_tambah'] ?? false,
                'bisa_edit' => $item['bisa_edit'] ?? false,
                'bisa_hapus' => $item['bisa_hapus'] ?? false,
            ];
        }

        $this->repository->syncForRole($roleId, $syncData);
        return response()->json(['message' => 'Synced']);
    }
}