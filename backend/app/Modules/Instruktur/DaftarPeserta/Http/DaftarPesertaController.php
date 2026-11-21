<?php

namespace App\Modules\Instruktur\DaftarPeserta\Http;

use App\Http\Controllers\Controller;
use App\Modules\Instruktur\DaftarPeserta\Application\CreateDaftarPeserta;
use App\Modules\Instruktur\DaftarPeserta\Application\DeleteDaftarPeserta;
use App\Modules\Instruktur\DaftarPeserta\Application\GetDaftarPeserta;
use App\Modules\Instruktur\DaftarPeserta\Application\ListDaftarPeserta;
use App\Modules\Instruktur\DaftarPeserta\Application\OpsiDaftarPeserta;
use App\Modules\Instruktur\DaftarPeserta\Application\SetValidasiPeserta;
use App\Modules\Instruktur\DaftarPeserta\Application\UpdateDaftarPeserta;
use App\Modules\Instruktur\DaftarPeserta\Http\Requests\SimpanPesertaRequest;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Endpoint Instruktur untuk menu Daftar Peserta (hanya role instruktur, lihat ServiceProvider).
 */
final class DaftarPesertaController extends Controller
{
    /** GET /instruktur/daftar-peserta?q=&lokasi_blc_id=&kategori_peserta_id=&status=semua|valid|non&page=&per_page= */
    public function index(Request $request, ListDaftarPeserta $useCase): JsonResponse
    {
        $filter = $request->validate([
            'q' => ['nullable', 'string', 'max:100'],
            'lokasi_blc_id' => ['nullable', 'integer'],
            'kategori_peserta_id' => ['nullable', 'integer'],
            'status' => ['nullable', 'in:semua,valid,non'],
            'page' => ['nullable', 'integer', 'min:1'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
        ]);

        return response()->json($useCase->handle(
            $filter,
            (int) ($filter['per_page'] ?? 10),
            (int) ($filter['page'] ?? 1),
        ));
    }

    /** GET /instruktur/daftar-peserta/opsi — isi dropdown form (BLC dan kategori). */
    public function opsi(OpsiDaftarPeserta $useCase): JsonResponse
    {
        return response()->json(['data' => $useCase->handle()]);
    }

    /** GET /instruktur/daftar-peserta/{id} */
    public function show(int $id, GetDaftarPeserta $useCase): JsonResponse
    {
        $peserta = $useCase->handle($id);

        return $peserta === null ? $this->tidakDitemukan() : response()->json(['data' => $peserta]);
    }

    /** POST /instruktur/daftar-peserta */
    public function store(SimpanPesertaRequest $request, CreateDaftarPeserta $useCase): JsonResponse
    {
        return response()->json(['data' => $useCase->handle($request->validated())], 201);
    }

    /** PUT|PATCH /instruktur/daftar-peserta/{id} */
    public function update(SimpanPesertaRequest $request, int $id, UpdateDaftarPeserta $useCase): JsonResponse
    {
        try {
            return response()->json(['data' => $useCase->handle($id, $request->validated())]);
        } catch (ModelNotFoundException) {
            return $this->tidakDitemukan();
        }
    }

    /** PATCH /instruktur/daftar-peserta/{id}/validasi — body opsional {"tervalidasi": true|false}; tanpa body = balik status. */
    public function validasi(Request $request, int $id, SetValidasiPeserta $useCase): JsonResponse
    {
        $request->validate(['tervalidasi' => ['sometimes', 'boolean']]);

        try {
            $peserta = $useCase->handle(
                $id,
                $request->has('tervalidasi') ? $request->boolean('tervalidasi') : null,
                $request->user()?->id,
            );
        } catch (ModelNotFoundException) {
            return $this->tidakDitemukan();
        }

        return response()->json(['data' => $peserta]);
    }

    /** DELETE /instruktur/daftar-peserta/{id} */
    public function destroy(int $id, DeleteDaftarPeserta $useCase): JsonResponse
    {
        try {
            $useCase->handle($id);
        } catch (ModelNotFoundException) {
            return $this->tidakDitemukan();
        }

        return response()->json(['message' => 'Peserta dihapus.']);
    }

    private function tidakDitemukan(): JsonResponse
    {
        return response()->json(['message' => 'Peserta tidak ditemukan.'], 404);
    }
}
