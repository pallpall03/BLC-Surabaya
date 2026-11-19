<?php

namespace App\Modules\Instruktur\LaporanKegiatan\Http;

use App\Http\Controllers\Controller;
use App\Modules\Instruktur\LaporanKegiatan\Contracts\LaporanKegiatanRepository;
use App\Modules\Instruktur\LaporanKegiatan\Domain\LaporanKegiatan;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class LaporanKegiatanController extends Controller
{
    public function index(): JsonResponse
    {
        $laporan = app(LaporanKegiatanRepository::class)->all();
        return response()->json($laporan);
    }
    
    public function show(int $id): JsonResponse
    {
        $laporan = app(LaporanKegiatanRepository::class)->find($id);
        return response()->json($laporan);
    }
    
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'kelas_id' => 'required|integer',
            'tanggal' => 'required|date',
            'kecamatan' => 'required',
            'kelurahan' => 'required',
            'deskripsi' => 'required',
        ]);
        
        $laporan = new LaporanKegiatan(
            null,
            $data['kelas_id'],
            $data['tanggal'],
            $data['kecamatan'],
            $data['kelurahan'],
            $data['deskripsi']
        );
        
        app(LaporanKegiatanRepository::class)->create($laporan);
        
        return response()->json(['message' => 'Laporan created'], 201);
    }
    
    public function update(Request $request, int $id): JsonResponse
    {
        $data = $request->validate([
            'kelas_id' => 'required|integer',
            'tanggal' => 'required|date',
            'kecamatan' => 'required',
            'kelurahan' => 'required',
            'deskripsi' => 'required',
        ]);
        
        $laporan = app(LaporanKegiatanRepository::class)->find($id);
        if (!$laporan) {
            return response()->json(['message' => 'Laporan not found'], 404);
        }
        
        $laporan->kelas_id = $data['kelas_id'];
        $laporan->tanggal = $data['tanggal'];
        $laporan->kecamatan = $data['kecamatan'];
        $laporan->kelurahan = $data['kelurahan'];
        $laporan->deskripsi = $data['deskripsi'];
        
        app(LaporanKegiatanRepository::class)->update($laporan);
        
        return response()->json(['message' => 'Laporan updated']);
    }
    
    public function destroy(int $id): JsonResponse
    {
        app(LaporanKegiatanRepository::class)->delete($id);
        return response()->json(['message' => 'Laporan deleted']);
    }
}