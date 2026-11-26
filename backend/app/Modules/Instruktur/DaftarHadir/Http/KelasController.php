<?php

namespace App\Modules\Instruktur\DaftarHadir\Http;

use App\Http\Controllers\Controller;
use App\Modules\Instruktur\DaftarHadir\Contracts\DaftarHadirRepository;
use App\Modules\Instruktur\DaftarHadir\Http\Requests\SimpanKelasRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

/**
 * Endpoint kelas Daftar Hadir. Seluruh akses kelas dibatasi berdasarkan
 * tim_blc.id milik instruktur yang sedang login.
 */
final class KelasController extends Controller
{
    public function __construct(private readonly DaftarHadirRepository $repository)
    {
    }

    /** GET /instruktur/daftar-hadir/kelas */
    public function index(Request $request): JsonResponse
    {
        $instrukturId = $this->instrukturId($request);
        $data = $request->validate([
            'search' => ['nullable', 'string', 'max:100'],
        ]);

        return response()->json([
            'data' => $this->repository->listKelas($instrukturId, $data['search'] ?? ''),
        ]);
    }

    /** GET /instruktur/daftar-hadir/kelas/opsi */
    public function opsi(Request $request): JsonResponse
    {
        $this->instrukturId($request);

        return response()->json(['data' => $this->repository->opsiKelas()]);
    }

    /** GET /instruktur/daftar-hadir/kelas/opsi/sesi */
    public function opsiSesi(Request $request): JsonResponse
    {
        $this->instrukturId($request);

        return response()->json(['data' => $this->repository->opsiSesi()]);
    }

    /** GET /instruktur/daftar-hadir/kelas/opsi/materi */
    public function opsiMateri(Request $request): JsonResponse
    {
        $this->instrukturId($request);

        return response()->json(['data' => $this->repository->opsiMateri()]);
    }

    /** POST /instruktur/daftar-hadir/kelas */
    public function store(SimpanKelasRequest $request): JsonResponse
    {
        $instrukturId = $this->instrukturId($request);

        return response()->json([
            'data' => $this->repository->createKelas($instrukturId, $request->kelasData()),
        ], 201);
    }

    /** GET /instruktur/daftar-hadir/kelas/{id} */
    public function show(Request $request, int $id): JsonResponse
    {
        $kelas = $this->repository->findKelas($this->instrukturId($request), $id);

        return $kelas === null ? $this->kelasTidakDitemukan() : response()->json(['data' => $kelas]);
    }

    /** PUT|PATCH /instruktur/daftar-hadir/kelas/{id} */
    public function update(SimpanKelasRequest $request, int $id): JsonResponse
    {
        $kelas = $this->repository->updateKelas(
            $this->instrukturId($request),
            $id,
            $request->kelasData(),
        );

        return $kelas === null ? $this->kelasTidakDitemukan() : response()->json(['data' => $kelas]);
    }

    /** DELETE /instruktur/daftar-hadir/kelas/{id} */
    public function destroy(Request $request, int $id): JsonResponse
    {
        $dihapus = $this->repository->deleteKelas($this->instrukturId($request), $id);

        return $dihapus
            ? response()->json(['message' => 'Kelas dihapus.'])
            : $this->kelasTidakDitemukan();
    }

    /** GET /instruktur/daftar-hadir/kelas/{id}/calon-peserta */
    public function calonPeserta(Request $request, int $id): JsonResponse
    {
        $peserta = $this->repository->calonPeserta($this->instrukturId($request), $id);

        return $peserta === null ? $this->kelasTidakDitemukan() : response()->json(['data' => $peserta]);
    }

    /** GET /instruktur/daftar-hadir/kelas/{id}/peserta */
    public function peserta(Request $request, int $id): JsonResponse
    {
        $peserta = $this->repository->pesertaKelas($this->instrukturId($request), $id);

        return $peserta === null ? $this->kelasTidakDitemukan() : response()->json(['data' => $peserta]);
    }

    /** POST /instruktur/daftar-hadir/kelas/{id}/peserta */
    public function tambahPeserta(Request $request, int $id): JsonResponse
    {
        $instrukturId = $this->instrukturId($request);
        $data = $request->validate([
            'peserta_ids' => ['required', 'array', 'min:1'],
            'peserta_ids.*' => [
                'required',
                'integer',
                'distinct',
                Rule::exists('peserta', 'id')->where('is_delete', false),
            ],
        ], [
            'peserta_ids.required' => 'Pilih minimal satu peserta.',
            'peserta_ids.array' => 'Daftar peserta harus berupa array.',
            'peserta_ids.min' => 'Pilih minimal satu peserta.',
            'peserta_ids.*.required' => 'ID peserta wajib diisi.',
            'peserta_ids.*.integer' => 'ID peserta harus berupa angka.',
            'peserta_ids.*.distinct' => 'Daftar peserta tidak boleh duplikat.',
            'peserta_ids.*.exists' => 'Salah satu peserta tidak ditemukan atau sudah tidak aktif.',
        ]);

        $peserta = $this->repository->tambahPeserta(
            $instrukturId,
            $id,
            array_map('intval', $data['peserta_ids']),
        );

        return $peserta === null ? $this->kelasTidakDitemukan() : response()->json(['data' => $peserta]);
    }

    /** DELETE /instruktur/daftar-hadir/kelas/{id}/peserta/{pesertaId} */
    public function keluarkanPeserta(Request $request, int $id, int $pesertaId): JsonResponse
    {
        $dikeluarkan = $this->repository->keluarkanPeserta(
            $this->instrukturId($request),
            $id,
            $pesertaId,
        );

        if ($dikeluarkan === null) {
            return $this->kelasTidakDitemukan();
        }

        return response()->json(['message' => 'Peserta dikeluarkan dari kelas.']);
    }

    /** GET /instruktur/daftar-hadir/kelas/{id}/rekap */
    public function rekap(Request $request, int $id): JsonResponse
    {
        $rekap = $this->repository->rekapKelas($this->instrukturId($request), $id);

        return $rekap === null ? $this->kelasTidakDitemukan() : response()->json(['data' => $rekap]);
    }

    private function instrukturId(Request $request): int
    {
        $userId = $request->user()?->getAuthIdentifier();
        $instrukturId = $userId === null
            ? null
            : $this->repository->resolveInstrukturId((string) $userId);

        if ($instrukturId === null) {
            throw new HttpResponseException(response()->json([
                'message' => 'Akun instruktur ini tidak memiliki data tim BLC aktif dengan role instruktur.',
            ], 403));
        }

        return $instrukturId;
    }

    private function kelasTidakDitemukan(): JsonResponse
    {
        return response()->json(['message' => 'Kelas tidak ditemukan.'], 404);
    }
}
