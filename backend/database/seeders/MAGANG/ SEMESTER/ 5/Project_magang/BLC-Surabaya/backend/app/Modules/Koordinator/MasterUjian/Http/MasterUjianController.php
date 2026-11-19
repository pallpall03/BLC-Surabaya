<?php

namespace App\Modules\Koordinator\MasterUjian\Http;

use App\Http\Controllers\Controller;
use App\Modules\Koordinator\MasterUjian\Contracts\MasterUjianRepository;
use App\Modules\Koordinator\MasterUjian\Domain\MasterUjian;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class MasterUjianController extends Controller
{
    public function index(): JsonResponse
    {
        $ujian = app(MasterUjianRepository::class)->all();
        return response()->json($ujian);
    }
    
    public function show(int $id): JsonResponse
    {
        $ujian = app(MasterUjianRepository::class)->find($id);
        return response()->json($ujian);
    }
    
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'nama' => 'required',
            'pertemuan_ke' => 'required|integer',
            'soal' => 'required',
        ]);
        
        $ujian = new MasterUjian(
            null,
            $data['nama'],
            $data['pertemuan_ke'],
            $data['soal']
        );
        
        app(MasterUjianRepository::class)->create($ujian);
        
        return response()->json(['message' => 'MasterUjian created'], 201);
    }
    
    public function update(Request $request, int $id): JsonResponse
    {
        $data = $request->validate([
            'nama' => 'required',
            'pertemuan_ke' => 'required|integer',
            'soal' => 'required',
        ]);
        
        $ujian = app(MasterUjianRepository::class)->find($id);
        if (!$ujian) {
            return response()->json(['message' => 'MasterUjian not found'], 404);
        }
        
        $ujian->nama = $data['nama'];
        $ujian->pertemuan_ke = $data['pertemuan_ke'];
        $ujian->soal = $data['soal'];
        
        app(MasterUjianRepository::class)->update($ujian);
        
        return response()->json(['message' => 'MasterUjian updated']);
    }
    
    public function destroy(int $id): JsonResponse
    {
        app(MasterUjianRepository::class)->delete($id);
        return response()->json(['message' => 'MasterUjian deleted']);
    }
}