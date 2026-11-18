<?php

namespace App\Modules\Instruktur\Kelas\Http;

use App\Http\Controllers\Controller;
use App\Modules\Instruktur\Kelas\Contracts\KelasRepository;
use App\Modules\Instruktur\Kelas\Domain\Kelas;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class KelasController extends Controller
{
    public function index(): JsonResponse
    {
        $kelas = app(KelasRepository::class)->all();
        return response()->json($kelas);
    }
    
    public function show(int $id): JsonResponse
    {
        $kelas = app(KelasRepository::class)->find($id);
        return response()->json($kelas);
    }
    
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'nama' => 'required',
            'tanggal_pembuatan' => 'required|date',
            'lokasi_blc_id' => 'required|integer',
            'sesi_id' => 'required|integer',
        ]);
        
        $kelas = new Kelas(
            null,
            $data['nama'],
            $data['tanggal_pembuatan'],
            $data['lokasi_blc_id'],
            $data['sesi_id']
        );
        
        app(KelasRepository::class)->create($kelas);
        
        return response()->json(['message' => 'Kelas created'], 201);
    }
    
    public function update(Request $request, int $id): JsonResponse
    {
        $data = $request->validate([
            'nama' => 'required',
            'tanggal_pembuatan' => 'required|date',
            'lokasi_blc_id' => 'required|integer',
            'sesi_id' => 'required|integer',
        ]);
        
        $kelas = app(KelasRepository::class)->find($id);
        if (!$kelas) {
            return response()->json(['message' => 'Kelas not found'], 404);
        }
        
        $kelas->nama = $data['nama'];
        $kelas->tanggal_pembuatan = $data['tanggal_pembuatan'];
        $kelas->lokasi_blc_id = $data['lokasi_blc_id'];
        $kelas->sesi_id = $data['sesi_id'];
        
        app(KelasRepository::class)->update($kelas);
        
        return response()->json(['message' => 'Kelas updated']);
    }
    
    public function destroy(int $id): JsonResponse
    {
        app(KelasRepository::class)->delete($id);
        return response()->json(['message' => 'Kelas deleted']);
    }
}