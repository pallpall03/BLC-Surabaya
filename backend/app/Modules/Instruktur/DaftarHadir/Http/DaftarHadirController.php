<?php

namespace App\Modules\Instruktur\DaftarHadir\Http;

use App\Http\Controllers\Controller;
use App\Modules\Instruktur\DaftarHadir\Contracts\DaftarHadirRepository;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

final class DaftarHadirController extends Controller
{
    public function __construct(private readonly DaftarHadirRepository $repository)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $data = $request->validate([
            'q' => ['nullable', 'string', 'max:100'],
        ]);

        return response()->json([
            'data' => $this->repository->rekapPeserta($this->instrukturId($request), $data['q'] ?? ''),
        ]);
    }

    public function show(Request $request, int $id): JsonResponse
    {
        $data = $request->validate([
            'tanggal' => ['required', 'date', 'before_or_equal:'.Carbon::now('Asia/Jakarta')->toDateString()],
        ]);

        $absensi = $this->repository->absensiKelas(
            $this->instrukturId($request),
            $id,
            Carbon::parse($data['tanggal'])->toDateString(),
        );

        return $absensi === null
            ? response()->json(['message' => 'Kelas tidak ditemukan.'], 404)
            : response()->json($absensi);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'kelas_id' => ['required', 'integer'],
            'tanggal' => ['required', 'date', 'before_or_equal:'.Carbon::now('Asia/Jakarta')->toDateString()],
            'peserta' => ['required', 'array', 'min:1'],
            'peserta.*.peserta_id' => ['required', 'integer', 'distinct'],
            'peserta.*.status' => ['required', 'in:hadir,tidak'],
        ], [
            'tanggal.before_or_equal' => 'Tanggal absensi tidak boleh melewati hari ini.',
            'peserta.*.peserta_id.distinct' => 'Daftar peserta tidak boleh duplikat.',
            'peserta.*.status.in' => 'Status kehadiran harus hadir atau tidak.',
        ]);

        $absensi = $this->repository->simpanAbsensi(
            $this->instrukturId($request),
            (int) $data['kelas_id'],
            Carbon::parse($data['tanggal'])->toDateString(),
            array_map(fn (array $item) => [
                'peserta_id' => (int) $item['peserta_id'],
                'hadir' => $item['status'] === 'hadir',
            ], $data['peserta']),
        );

        return $absensi === null
            ? response()->json(['message' => 'Kelas tidak ditemukan.'], 404)
            : response()->json($absensi);
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
}
