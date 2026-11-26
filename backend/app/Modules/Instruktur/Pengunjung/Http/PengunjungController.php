<?php

namespace App\Modules\Instruktur\Pengunjung\Http;

use App\Http\Controllers\Controller;
use App\Modules\Instruktur\Pengunjung\Contracts\PengunjungRepository;
use App\Shared\Support\PengunjungSupport;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

final class PengunjungController extends Controller
{
    public function __construct(private readonly PengunjungRepository $repository)
    {
    }

    public function opsi(): JsonResponse
    {
        return response()->json(['data' => $this->repository->opsi()]);
    }

    public function index(Request $request): JsonResponse
    {
        $filters = $request->validate([
            'mulai' => ['nullable', 'date'],
            'sampai' => ['nullable', 'date'],
            'lokasi_blc_id' => ['nullable', 'integer'],
            'sesi_id' => ['nullable', 'integer'],
            'q' => ['nullable', 'string', 'max:255'],
        ]);

        return response()->json(['data' => $this->repository->daftar($filters)]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate(PengunjungSupport::rules(pesanWajib: false));
        $validated['pesan'] = $validated['pesan'] ?? '-';
        $validated['is_aktif'] = true;
        $validated['is_delete'] = false;
        $validated['tanggal_kunjungan'] = Carbon::now('Asia/Jakarta')->toDateString();

        return response()->json(['data' => $this->repository->buat($validated)], 201);
    }

    public function show(int $id): JsonResponse
    {
        return response()->json(['data' => $this->repository->temukan($id)]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $existing = $this->repository->temukan($id);
        $validated = $request->validate(PengunjungSupport::rules(
            partial: true,
            pesanWajib: false,
            lokasiId: $existing['lokasi_blc_id'],
            sesiId: $existing['sesi_id'],
        ));

        if (array_key_exists('pesan', $validated) && $validated['pesan'] === null) {
            $validated['pesan'] = '-';
        }

        return response()->json(['data' => $this->repository->ubah($id, $validated)]);
    }

    public function destroy(int $id): JsonResponse
    {
        $this->repository->hapus($id);

        return response()->json(['message' => 'Deleted']);
    }
}
