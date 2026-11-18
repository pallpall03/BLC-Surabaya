<?php

namespace App\Modules\Instruktur\Absensi\Http;

use App\Http\Controllers\Controller;
use App\Modules\Instruktur\Absensi\Contracts\AbsensiRepository;
use App\Modules\Instruktur\Absensi\Domain\Absensi;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AbsensiController extends Controller
{
    public function index(): JsonResponse
    {
        $absensi = app(AbsensiRepository::class)->all();
        return response()->json($absensi);
    }
    
    public function show(int $id): JsonResponse
    {
        $absensi = app(AbsensiRepository::class)->find($id);
        return response()->json($absensi);
    }
    
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'peserta_id' => 'required|integer',
            'kelas_id' => 'required|integer',
            'tanggal' => 'required|date',
            'status' => 'required',
        ]);
        
        $absensi = new Absensi(
            null,
            $data['peserta_id'],
            $data['kelas_id'],
            $data['tanggal'],
            $data['status']
        );
        
        app(AbsensiRepository::class)->create($absensi);
        
        return response()->json(['message' => 'Absensi created'], 201);
    }
    
    public function update(Request $request, int $id): JsonResponse
    {
        $data = $request->validate([
            'peserta_id' => 'required|integer',
            'kelas_id' => 'required|integer',
            'tanggal' => 'required|date',
            'status' => 'required',
        ]);
        
        $absensi = app(AbsensiRepository::class)->find($id);
        if (!$absensi) {
            return response()->json(['message' => 'Absensi not found'], 404);
        }
        
        $absensi->peserta_id = $data['peserta_id'];
        $absensi->kelas_id = $data['kelas_id'];
        $absensi->tanggal = $data['tanggal'];
        $absensi->status = $data['status'];
        
        app(AbsensiRepository::class)->update($absensi);
        
        return response()->json(['message' => 'Absensi updated']);
    }
    
    public function destroy(int $id): JsonResponse
    {
        app(AbsensiRepository::class)->delete($id);
        return response()->json(['message' => 'Absensi deleted']);
    }
}