<?php

namespace App\Modules\Admin\System\Menu\Http;

use App\Http\Controllers\Controller;
use App\Modules\Admin\System\Menu\Contracts\MenuRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class MenuController extends Controller
{
    public function __construct(
        private readonly MenuRepository $repository
    ) {}

    public function index(): JsonResponse
    {
        $tree = $this->repository->getTree();
        return response()->json(['data' => $tree]);
    }

    public function flat(): JsonResponse
    {
        $menus = $this->repository->getOrdered();
        return response()->json(['data' => $menus]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'parent_id' => 'nullable|exists:menu,id',
            'nama' => 'required|string|max:100',
            'slug' => 'required|string|max:100|unique:menu,slug',
            'url' => 'nullable|string|max:255',
            'ikon' => 'nullable|string|max:50',
            'urutan' => 'integer|min:0',
            'is_aktif' => 'boolean',
        ]);

        $menu = $this->repository->create($validated);
        return response()->json(['data' => $menu], 201);
    }

    public function show(int $id): JsonResponse
    {
        $menu = $this->repository->find($id);
        if (!$menu) {
            return response()->json(['message' => 'Menu not found'], 404);
        }
        return response()->json(['data' => $menu]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'parent_id' => 'nullable|exists:menu,id',
            'nama' => 'sometimes|string|max:100',
            'slug' => 'sometimes|string|max:100|unique:menu,slug,' . $id,
            'url' => 'nullable|string|max:255',
            'ikon' => 'nullable|string|max:50',
            'urutan' => 'integer|min:0',
            'is_aktif' => 'boolean',
        ]);

        $menu = $this->repository->update($id, $validated);
        return response()->json(['data' => $menu]);
    }

    public function destroy(int $id): JsonResponse
    {
        $this->repository->delete($id);
        return response()->json(['message' => 'Deleted']);
    }
}
