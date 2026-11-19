<?php

namespace App\Modules\Admin\Data\Piagam\Http;

use App\Http\Controllers\Controller;
use App\Modules\Admin\Data\Piagam\Contracts\PiagamRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class PiagamController extends Controller
{
    public function __construct(
        private readonly PiagamRepository $repository
    ) {}

    public function index(): JsonResponse
    {
        $piagams = $this->repository->getAktif();
        return response()->json(['data' => $piagams]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'judul' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:piagam,slug',
            'deskripsi' => 'nullable|string',
            'template_file' => 'nullable|string|max:255',
            'urutan' => 'integer|default:0',
            'is_aktif' => 'boolean',
        ]);

        $piagam = $this->repository->create($validated);
        return response()->json(['data' => $piagam], 201);
    }

    public function show(int $id): JsonResponse
    {
        $piagam = $this->repository->find($id);
        if (!$piagam) {
            return response()->json(['message' => 'Piagam not found'], 404);
        }
        return response()->json(['data' => $piagam]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'judul' => 'sometimes|required|string|max:255',
            'slug' => 'sometimes|string|max:255|unique:piagam,slug,' . $id,
            'deskripsi' => 'sometimes|string',
            'template_file' => 'sometimes|string|max:255',
            'urutan' => 'sometimes|integer',
            'is_aktif' => 'sometimes|boolean',
        ]);

        $piagam = $this->repository->update($id, $validated);
        return response()->json(['data' => $piagam]);
    }

    public function destroy(int $id): JsonResponse
    {
        $this->repository->softDelete($id);
        return response()->json(['message' => 'Deleted']);
    }
}
