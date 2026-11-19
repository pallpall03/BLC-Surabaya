<?php

namespace App\Modules\Koordinator\Absensi\Http;

use App\Modules\Koordinator\Absensi\Contracts\AbsensiRepositoryInterface;
use App\Modules\Koordinator\Absensi\Domain\Absensi;
use App\Modules\Koordinator\Absensi\Domain\ValueObjects\AbsensiId;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AbsensiController extends \App\Http\Controllers\Controller
{
    public function __construct(
        private readonly AbsensiRepositoryInterface $repository
    ) {}

    public function index(): JsonResponse
    {
        return response()->json($this->repository->all());
    }

    public function show(string $id): JsonResponse
    {
        $absensi = $this->repository->find(new AbsensiId($id));
        if (!$absensi) {
            return response()->json(['message' => 'Absensi not found'], 404);
        }
        return response()->json($absensi->toArray());
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'pesertaId' => 'required|string',
            'sesiId' => 'required|string',
            'instrukturId' => 'required|string',
            'lokasiBlcId' => 'required|string',
            'waktuAbsen' => 'required|date',
            'status' => 'required|in:hadir,masih_hadiran,tanpa_izin',
            'keterangan' => 'nullable|string',
        ]);

        $data = [
            'peserta_id' => $validated['pesertaId'],
            'sesi_id' => $validated['sesiId'],
            'instruktur_id' => $validated['instrukturId'],
            'lokasi_blc_id' => $validated['lokasiBlcId'],
            'waktu_absen' => Carbon::parse($validated['waktuAbsen'])->toDateTimeString(),
            'status' => $validated['status'],
            'keterangan' => $validated['keterangan'] ?? null,
        ];

        $absensi = $this->repository->create($data);
        return response()->json($absensi->toArray(), 201);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $validated = $request->validate([
            'pesertaId' => 'nullable|string',
            'sesiId' => 'nullable|string',
            'instrukturId' => 'nullable|string',
            'lokasiBlcId' => 'nullable|string',
            'waktuAbsen' => 'nullable|date',
            'status' => 'nullable|in:hadir,masih_hadiran,tanpa_izin',
            'keterangan' => 'nullable|string',
        ]);

        $data = [
            'peserta_id' => $validated['pesertaId'] ?? $this->repository->find(new AbsensiId($id))->getPesertaId(),
            'sesi_id' => $validated['sesiId'] ?? $this->repository->find(new AbsensiId($id))->getSesiId(),
            'instruktur_id' => $validated['instrukturId'] ?? $this->repository->find(new AbsensiId($id))->getInstrukturId(),
            'lokasi_blc_id' => $validated['lokasiBlcId'] ?? $this->repository->find(new AbsensiId($id))->getLokasiBlcId(),
            'waktu_absen' => $validated['waktuAbsen'] ?? $this->repository->find(new AbsensiId($id))->getWaktuAbsen()->toDateTimeString(),
            'status' => $validated['status'] ?? $this->repository->find(new AbsensiId($id))->getStatus(),
            'keterangan' => $validated['keterangan'] ?? $this->repository->find(new AbsensiId($id))->getKeterangan(),
        ];

        $absensi = $this->repository->update(new AbsensiId($id), $data);
        return response()->json($absensi->toArray());
    }

    public function destroy(string $id): JsonResponse
    {
        $this->repository->delete(new AbsensiId($id));
        return response()->json(null, 204);
    }

    public function byPeserta(string $pesertaId): JsonResponse
    {
        $absensiList = $this->repository->findByPesertaId($pesertaId);
        return response()->json(array_map(fn($a) => $a->toArray(), $absensiList));
    }

    public function bySesi(string $sesiId): JsonResponse
    {
        $absensiList = $this->repository->findBySesiId($sesiId);
        return response()->json(array_map(fn($a) => $a->toArray(), $absensiList));
    }

    public function byInstruktur(string $instrukturId): JsonResponse
    {
        $absensiList = $this->repository->findByInstrukturId($instrukturId);
        return response()->json(array_map(fn($a) => $a->toArray(), $absensiList));
    }

    public function byLokasiBlc(string $lokasiBlcId): JsonResponse
    {
        $absensiList = $this->repository->findByLokasiBlcId($lokasiBlcId);
        return response()->json(array_map(fn($a) => $a->toArray(), $absensiList));
    }

    public function byTanggal(string $tanggal): JsonResponse
    {
        $absensiList = $this->repository->findByTanggal($tanggal);
        return response()->json(array_map(fn($a) => $a->toArray(), $absensiList));
    }
}