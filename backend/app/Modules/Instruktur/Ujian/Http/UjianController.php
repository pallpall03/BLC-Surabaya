<?php

namespace App\Modules\Instruktur\Ujian\Http;

use App\Http\Controllers\Controller;
use App\Modules\Instruktur\DaftarHadir\Contracts\DaftarHadirRepository;
use App\Modules\Instruktur\Ujian\Application\ListUjian;
use App\Modules\Instruktur\Ujian\Contracts\UjianRepository;
use App\Modules\Instruktur\Ujian\Http\Requests\SimpanUjianRequest;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

final class UjianController extends Controller
{
    public function __construct(
        private readonly UjianRepository $repository,
        private readonly DaftarHadirRepository $daftarHadirRepository,
    ) {
    }

    public function index(ListUjian $useCase): JsonResponse
    {
        return response()->json(['data' => $useCase->handle()]);
    }

    public function opsi(Request $request): JsonResponse
    {
        return response()->json([
            'data' => $this->repository->opsi($this->instrukturId($request)),
        ]);
    }

    public function store(SimpanUjianRequest $request): JsonResponse
    {
        return response()->json([
            'data' => $this->repository->create($request->validated()),
        ], 201);
    }

    public function show(int $id): JsonResponse
    {
        $ujian = $this->repository->find($id);

        return $ujian === null ? $this->ujianTidakDitemukan() : response()->json(['data' => $ujian]);
    }

    public function update(SimpanUjianRequest $request, int $id): JsonResponse
    {
        $ujian = $this->repository->update($id, $request->validated());

        return $ujian === null ? $this->ujianTidakDitemukan() : response()->json(['data' => $ujian]);
    }

    public function destroy(int $id): JsonResponse
    {
        try {
            $this->repository->delete($id);
        } catch (ModelNotFoundException) {
            return $this->ujianTidakDitemukan();
        }

        return response()->json(['message' => 'Ujian dihapus.']);
    }

    public function storeJadwal(Request $request): JsonResponse
    {
        $instrukturId = $this->instrukturId($request);
        $data = $this->jadwalData($request, $instrukturId);

        return response()->json([
            'data' => $this->repository->createJadwal($instrukturId, $data),
        ], 201);
    }

    public function updateJadwal(Request $request, int $id): JsonResponse
    {
        $instrukturId = $this->instrukturId($request);
        $data = $this->jadwalData($request, $instrukturId, $id);
        $jadwal = $this->repository->updateJadwal($instrukturId, $id, $data);

        return $jadwal === null ? $this->jadwalTidakDitemukan() : response()->json(['data' => $jadwal]);
    }

    public function destroyJadwal(Request $request, int $id): JsonResponse
    {
        $dihapus = $this->repository->deleteJadwal($this->instrukturId($request), $id);

        return $dihapus
            ? response()->json(['message' => 'Jadwal ujian dihapus.'])
            : $this->jadwalTidakDitemukan();
    }

    private function instrukturId(Request $request): int
    {
        $userId = $request->user()?->getAuthIdentifier();
        $instrukturId = $userId === null
            ? null
            : $this->daftarHadirRepository->resolveInstrukturId((string) $userId);

        if ($instrukturId === null) {
            throw new HttpResponseException(response()->json([
                'message' => 'Akun instruktur ini tidak memiliki data tim BLC aktif dengan role instruktur.',
            ], 403));
        }

        return $instrukturId;
    }

    private function jadwalData(Request $request, int $instrukturId, ?int $id = null): array
    {
        if (is_string($request->input('token'))) {
            $request->merge(['token' => strtoupper(trim($request->input('token')))]);
        }

        $wajib = $id === null ? 'required' : 'sometimes';
        $tokenRule = Rule::unique('jadwal_ujian', 'token');
        if ($id !== null) {
            $tokenRule->ignore($id);
        }

        return $request->validate([
            'master_ujian_id' => [
                $wajib,
                'integer',
                Rule::exists('master_ujian', 'id')->where('is_delete', false),
            ],
            'kelas_id' => [
                $wajib,
                'integer',
                Rule::exists('kelas', 'id')
                    ->where('is_delete', false)
                    ->where('instruktur_id', $instrukturId),
            ],
            'mulai' => [$wajib, 'date'],
            'selesai' => [$wajib, 'date'],
            'token' => ['nullable', 'string', 'size:6', 'regex:/^[A-Z0-9]{6}$/', $tokenRule],
        ], [
            'master_ujian_id.required' => 'Ujian wajib dipilih.',
            'master_ujian_id.exists' => 'Ujian tidak ditemukan atau sudah dihapus.',
            'kelas_id.required' => 'Kelas wajib dipilih.',
            'kelas_id.exists' => 'Kelas tidak ditemukan, sudah dihapus, atau bukan milik instruktur ini.',
            'mulai.required' => 'Waktu mulai wajib diisi.',
            'selesai.required' => 'Waktu selesai wajib diisi.',
            'token.size' => 'Token harus terdiri dari 6 karakter.',
            'token.regex' => 'Token hanya boleh berisi huruf kapital dan angka.',
            'token.unique' => 'Token sudah digunakan.',
        ]);
    }

    private function ujianTidakDitemukan(): JsonResponse
    {
        return response()->json(['message' => 'Ujian tidak ditemukan.'], 404);
    }

    private function jadwalTidakDitemukan(): JsonResponse
    {
        return response()->json(['message' => 'Jadwal ujian tidak ditemukan.'], 404);
    }
}
