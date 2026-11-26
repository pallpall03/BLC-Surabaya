<?php

namespace App\Modules\Admin\Data\BukuTamu\Http;

use App\Http\Controllers\Controller;
use App\Modules\Admin\Data\BukuTamu\Contracts\BukuTamuRepository;
use App\Shared\Support\PengunjungSupport;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

final class BukuTamuController extends Controller
{
    public function __construct(
        private readonly BukuTamuRepository $repository
    ) {}

    public function index(): JsonResponse
    {
        $data = array_map(
            fn ($buku) => $buku->toArray(),
            $this->repository->all(),
        );

        return response()->json(['data' => $data]);
    }

    public function aktif(): JsonResponse
    {
        return response()->json(['data' => $this->repository->getPublicAktif()]);
    }

    public function opsi(): JsonResponse
    {
        return response()->json(['data' => PengunjungSupport::opsi()]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate(PengunjungSupport::rules());

        $validated['is_aktif'] = true;
        $validated['is_delete'] = false;
        $validated['tanggal_kunjungan'] = Carbon::now('Asia/Jakarta')->toDateString();

        $buku = $this->repository->create($validated);

        return response()->json(['data' => $buku->toPublicArray()], 201);
    }

    public function show(int $id): JsonResponse
    {
        $buku = $this->repository->find($id);
        if (! $buku) {
            return response()->json(['message' => 'Buku Tamu not found'], 404);
        }

        return response()->json(['data' => $buku->toArray()]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $current = $this->repository->find($id);
        if (! $current) {
            return response()->json(['message' => 'Buku Tamu not found'], 404);
        }

        $validated = $request->validate(PengunjungSupport::rules(
            partial: true,
            lokasiId: $current->lokasiBlcId,
            sesiId: $current->sesiId,
        ) + [
            'is_aktif' => ['sometimes', 'boolean'],
            'urutan' => ['sometimes', 'integer', 'min:0'],
        ]);

        $buku = $this->repository->update($id, $validated);

        return response()->json(['data' => $buku->toArray()]);
    }

    public function destroy(int $id): JsonResponse
    {
        $this->repository->delete($id);

        return response()->json(['message' => 'Deleted']);
    }
}
