<?php

namespace App\Modules\Instruktur\Ujian\Http;

use App\Http\Controllers\Controller;
use App\Modules\Instruktur\Ujian\Contracts\UjianRepository;
use App\Modules\Instruktur\Ujian\Domain\Ujian;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class UjianController extends Controller
{
    public function index(): JsonResponse
    {
        $ujian = app(UjianRepository::class)->all();
        return response()->json($ujian);
    }
    
    public function show(int $id): JsonResponse
    {
        $ujian = app(UjianRepository::class)->find($id);
        return response()->json($ujian);
    }
    
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'nama' => 'required',
            'kelas_id' => 'required|integer',
            'pertemuan_ke' => 'required|integer',
            'soal_id' => 'required|integer',
        ]);
        
        $ujian = new Ujian(
            null,
            $data['nama'],
            $data['kelas_id'],
            $data['pertemuan_ke'],
            $data['soal_id']
        );
        
        app(UjianRepository::class)->create($ujian);
        
        return response()->json(['message' => 'Ujian created'], 201);
    }
    
    public function update(Request $request, int $id): JsonResponse
    {
        $data = $request->validate([
            'nama' => 'required',
            'kelas_id' => 'required|integer',
            'pertemuan_ke' => 'required|integer',
            'soal_id' => 'required|integer',
        ]);
        
        $ujian = app(UjianRepository::class)->find($id);
        if (!$ujian) {
            return response()->json(['message' => 'Ujian not found'], 404);
        }
        
        $ujian->nama = $data['nama'];
        $ujian->kelas_id = $data['kelas_id'];
        $ujian->pertemuan_ke = $data['pertemuan_ke'];
        $ujian->soal_id = $data['soal_id'];
        
        app(UjianRepository::class)->update($ujian);
        
        return response()->json(['message' => 'Ujian updated']);
    }
    
    public function destroy(int $id): JsonResponse
    {
        app(UjianRepository::class)->delete($id);
        return response()->json(['message' => 'Ujian deleted']);
    }
}