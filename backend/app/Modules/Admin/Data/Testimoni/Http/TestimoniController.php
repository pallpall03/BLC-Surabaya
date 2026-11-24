<?php

namespace App\Modules\Admin\Data\Testimoni\Http;

use App\Http\Controllers\Controller;
use App\Modules\Admin\Data\Testimoni\Contracts\TestimoniRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class TestimoniController extends Controller
{
    public function __construct(
        private readonly TestimoniRepository $repository
    ) {}

    public function index(): JsonResponse
    {
        $testimoni = $this->repository->getAktif();
        return response()->json(['data' => $testimoni]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'pekerjaan' => 'nullable|string|max:255',
            'testimoni' => 'required|string',
            'foto' => 'nullable|string|max:255',
            'urutan' => 'sometimes|integer|min:0',
            'is_aktif' => 'sometimes|boolean',
        ]);

        $testimoniModel = $this->repository->create($validated);
        return response()->json(['data' => $testimoniModel], 201);
    }

    public function show(int $id): JsonResponse
    {
        $testimoni = $this->repository->find($id);
        if (!$testimoni) {
            return response()->json(['message' => 'Testimoni not found'], 404);
        }
        return response()->json(['data' => $testimoni]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'nama' => 'sometimes|required|string|max:255',
            'pekerjaan' => 'sometimes|nullable|string|max:255',
            'testimoni' => 'sometimes|required|string',
            'foto' => 'sometimes|string|max:255',
            'urutan' => 'sometimes|integer|min:0',
            'is_aktif' => 'sometimes|boolean',
        ]);

        $testimoni = $this->repository->update($id, $validated);
        return response()->json(['data' => $testimoni]);
    }

    public function destroy(int $id): JsonResponse
    {
        $this->repository->delete($id);
        return response()->json(['message' => 'Deleted']);
    }
}
