<?php

namespace App\Modules\Koordinator\RekapPesertaPengunjung\Http;

use App\Http\Controllers\Controller;
use App\Modules\Koordinator\RekapPesertaPengunjung\Contracts\RekapPesertaPengunjungRepository;
use App\Modules\Koordinator\RekapPesertaPengunjung\Domain\RekapPesertaPengunjung;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class RekapPesertaPengunjungController extends Controller
{
    public function index(): JsonResponse
    {
        $rekap = app(RekapPesertaPengunjungRepository::class)->all();
        return response()->json($rekap);
    }
    
    public function show(int $id): JsonResponse
    {
        $rekap = app(RekapPesertaPengunjungRepository::class)->find($id);
        return response()->json($rekap);
    }
    
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'lokasi_blc_id' => 'required|integer',
            'tanggal' => 'required|date',
            'total_peserta' => 'required|integer',
            'total_pengunjung' => 'required|integer',
        ]);
        
        $rekap = new RekapPesertaPengunjung(
            null,
            $data['lokasi_blc_id'],
            $data['tanggal'],
            $data['total_peserta'],
            $data['total_pengunjung']
        );
        
        app(RekapPesertaPengunjungRepository::class)->create($rekap);
        
        return response()->json(['message' => 'Rekap created'], 201);
    }
    
    public function update(Request $request, int $id): JsonResponse
    {
        $data = $request->validate([
            'lokasi_blc_id' => 'required|integer',
            'tanggal' => 'required|date',
            'total_peserta' => 'required|integer',
            'total_pengunjung' => 'required|integer',
        ]);
        
        $rekap = app(RekapPesertaPengunjungRepository::class)->find($id);
        if (!$rekap) {
            return response()->json(['message' => 'Rekap not found'], 404);
        }
        
        $rekap->lokasi_blc_id = $data['lokasi_blc_id'];
        $rekap->tanggal = $data['tanggal'];
        $rekap->total_peserta = $data['total_peserta'];
        $rekap->total_pengunjung = $data['total_pengunjung'];
        
        app(RekapPesertaPengunjungRepository::class)->update($rekap);
        
        return response()->json(['message' => 'Rekap updated']);
    }
    
    public function destroy(int $id): JsonResponse
    {
        app(RekapPesertaPengunjungRepository::class)->delete($id);
        return response()->json(['message' => 'Rekap deleted']);
    }
}