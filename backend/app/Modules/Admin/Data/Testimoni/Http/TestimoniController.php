<?php

namespace App\Modules\Admin\Data\Testimoni\Http;

use App\Http\Controllers\Controller;
use App\Modules\Admin\Data\Testimoni\Contracts\TestimoniRepository;
use App\Modules\Admin\Data\Testimoni\Domain\Testimoni;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class TestimoniController extends Controller
{
    public function __construct(
        private readonly TestimoniRepository $repository
    ) {}

    public function index(): JsonResponse
    {
        $testimoni = $this->repository->all();
        return response()->json(['data' => $testimoni]);
    }

    public function aktif(): JsonResponse
    {
        $testimoni = $this->repository->getAktif();
        return response()->json(['data' => array_map(fn (Testimoni $item) => $this->publik($item), $testimoni)]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'phone' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'kategori_id' => 'nullable|integer',
            'lokasi_blc_id' => 'nullable|integer|exists:lokasi_blc,id',
            'isi_testimoni' => 'required|string',
            'rating' => 'nullable|integer|min:1|max:5',
            'status' => 'nullable|string|in:pending,aktif,nonaktif',
        ]);

        if (empty($validated['status'])) {
            $validated['status'] = 'aktif';
        }

        $testimoniModel = $this->repository->create($validated);
        return response()->json(['data' => $testimoniModel], 201);
    }

    public function show(int $id): JsonResponse
    {
        $testimoni = $this->repository->find($id);
        if (!$testimoni) {
            return response()->json(['message' => 'Testimoni not found'], 404);
        }
        return response()->json(['data' => $this->publik($testimoni)]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'nama' => 'sometimes|required|string|max:255',
            'phone' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'kategori_id' => 'nullable|integer',
            'lokasi_blc_id' => 'nullable|integer|exists:lokasi_blc,id',
            'isi_testimoni' => 'sometimes|required|string',
            'rating' => 'nullable|integer|min:1|max:5',
            'status' => 'sometimes|required|string|in:pending,aktif,nonaktif',
        ]);

        $testimoni = $this->repository->update($id, $validated);
        return response()->json(['data' => $testimoni]);
    }

    public function destroy(int $id): JsonResponse
    {
        $this->repository->delete($id);
        return response()->json(['message' => 'Deleted']);
    }

    /** @return array<string, mixed> */
    private function publik(Testimoni $testimoni): array
    {
        return [
            'id' => $testimoni->id,
            'nama' => $testimoni->nama,
            'lokasiBlcId' => $testimoni->lokasiBlcId,
            'isSurabaya' => $testimoni->isSurabaya,
        ];
    }
}
