<?php

namespace App\Modules\Admin\Data\TimBlc\Http;

use App\Http\Controllers\Controller;
use App\Modules\Admin\Data\TimBlc\Contracts\TimBlcRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class TimBlcController extends Controller
{
    public function __construct(
        private readonly TimBlcRepository $repository
    ) {}

    public function index(): JsonResponse
    {
        $tim = $this->repository->getAktif();
        return response()->json(['data' => $tim]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'jabatan' => 'nullable|string|max:255',
            'deskripsi' => 'nullable|string',
            'foto' => 'nullable|string|max:255',
            'urutan' => 'integer|default:0',
            'is_aktif' => 'boolean',
        ]);

        $tim = $this->repository->create($validated);
        return response()->json(['data' => $tim], 201);
    }

    public function show(int $id): JsonResponse
    {
        $tim = $this->repository->find($id);
        if (!$tim) {
            return response()->json(['message' => 'Tim BLC not found'], 404);
        }
        return response()->json(['data' => $tim]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'nama' => 'sometimes|required|string|max:255',
            'jabatan' => 'sometimes|nullable|string|max:255',
            'deskripsi' => 'sometimes|string',
            'foto' => 'sometimes|string|max:255',
            'urutan' => 'sometimes|integer',
            'is_aktif' => 'sometimes|boolean',
        ]);

        $tim = $this->repository->update($id, $validated);
        return response()->json(['data' => $tim]);
    }

    public function destroy(int $id): JsonResponse
    {
        $this->repository->softDelete($id);
        return response()->json(['message' => 'Deleted']);
    }
}
