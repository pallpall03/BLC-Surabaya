<?php

namespace App\Modules\Instruktur\Sesi\Http;

use App\Http\Controllers\Controller;
use App\Modules\Instruktur\Sesi\Contracts\SesiRepository;
use App\Modules\Instruktur\Sesi\Domain\Sesi;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class SesiController extends Controller
{
    public function index(): JsonResponse
    {
        $sesis = app(SesiRepository::class)->all();
        return response()->json($sesis);
    }
    
    public function show(int $id): JsonResponse
    {
        $sesi = app(SesiRepository::class)->find($id);
        return response()->json($sesi);
    }
    
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'nama' => 'required',
            'tanggal_mulai' => 'required|date',
            'tanggal_selesai' => 'required|date',
            'lokasi_blc_id' => 'required|integer',
            'status' => 'required',
        ]);
        
        $sesi = new Sesi(
            null,
            $data['nama'],
            $data['tanggal_mulai'],
            $data['tanggal_selesai'],
            $data['lokasi_blc_id'],
            $data['status']
        );
        
        app(SesiRepository::class)->create($sesi);
        
        return response()->json(['message' => 'Sesi created'], 201);
    }
    
    public function update(Request $request, int $id): JsonResponse
    {
        $data = $request->validate([
            'nama' => 'required',
            'tanggal_mulai' => 'required|date',
            'tanggal_selesai' => 'required|date',
            'lokasi_blc_id' => 'required|integer',
            'status' => 'required',
        ]);
        
        $sesi = app(SesiRepository::class)->find($id);
        if (!$sesi) {
            return response()->json(['message' => 'Sesi not found'], 404);
        }
        
        $sesi->nama = $data['nama'];
        $sesi->tanggal_mulai = $data['tanggal_mulai'];
        $sesi->tanggal_selesai = $data['tanggal_selesai'];
        $sesi->lokasi_blc_id = $data['lokasi_blc_id'];
        $sesi->status = $data['status'];
        
        app(SesiRepository::class)->update($sesi);
        
        return response()->json(['message' => 'Sesi updated']);
    }
    
    public function destroy(int $id): JsonResponse
    {
        app(SesiRepository::class)->delete($id);
        return response()->json(['message' => 'Sesi deleted']);
    }
}