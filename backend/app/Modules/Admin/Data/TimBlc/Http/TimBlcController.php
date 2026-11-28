<?php

namespace App\Modules\Admin\Data\TimBlc\Http;

use App\Http\Controllers\Controller;
use App\Modules\Admin\Data\TimBlc\Contracts\TimBlcRepository;
use App\Modules\Admin\Data\TimBlc\Domain\TimBlc;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class TimBlcController extends Controller
{
    public function __construct(
        private readonly TimBlcRepository $repository
    ) {}

        public function index(Request $request): JsonResponse
    {
        if ($request->query('status') === 'aktif') {
            return $this->aktif();
        }
        return response()->json(['data' => $this->repository->all()]);
    }

    public function aktif(): JsonResponse
    {
        $tim = $this->repository->getAktif();
        return response()->json(['data' => array_map(fn (TimBlc $item) => $this->publik($item), $tim)]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nama_lengkap' => 'required|string|max:255',
            'role' => 'sometimes|string|max:100',
            'lokasi_blc_id' => 'nullable|integer',
            'avatar' => 'nullable|string',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:50',
            'gender' => 'nullable|string|in:L,P',
            'is_delete' => 'sometimes|boolean',
        ]);

        if (!isset($validated['role']) || empty($validated['role'])) {
            $validated['role'] = 'instruktur';
        }

        $tim = $this->repository->create($validated);
        return response()->json(['data' => $tim], 201);
    }

    public function show(int $id): JsonResponse
    {
        $tim = $this->repository->find($id);
        if (!$tim) {
            return response()->json(['message' => 'Tim BLC not found'], 404);
        }
        return response()->json(['data' => $this->publik($tim)]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'nama_lengkap' => 'sometimes|required|string|max:255',
            'role' => 'sometimes|string|max:100',
            'lokasi_blc_id' => 'nullable|integer',
            'avatar' => 'nullable|string',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:50',
            'gender' => 'nullable|string|in:L,P',
            'is_delete' => 'sometimes|boolean',
        ]);

        $tim = $this->repository->update($id, $validated);
        return response()->json(['data' => $tim]);
    }

    public function destroy(int $id): JsonResponse
    {
        $this->repository->delete($id);
        return response()->json(['message' => 'Deleted']);
    }

    /** @return array<string, mixed> */
    private function publik(TimBlc $tim): array
    {
        return [
            'id' => $tim->id,
            'namaLengkap' => $tim->namaLengkap,
            'role' => $tim->role,
            'avatar' => $tim->avatar,
            'lokasiBlcId' => $tim->lokasiBlcId,
            'isSurabaya' => $tim->isSurabaya,
        ];
    }
}
