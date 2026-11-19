<?php

namespace App\Modules\Koordinator\KategoriPeserta\Http;

use App\Http\Controllers\Controller;
use App\Modules\Koordinator\KategoriPeserta\Contracts\KategoriPesertaRepository;
use App\Modules\Koordinator\KategoriPeserta\Domain\KategoriPeserta;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class KategoriPesertaController extends Controller
{
    public function index(): JsonResponse
    {
        $kategori = app(KategoriPesertaRepository::class)->all();
        return response()->json($kategori);
    }
    
    public function show(int $id): JsonResponse
    {
        $kategori = app(KategoriPesertaRepository::class)->find($id);
        return response()->json($kategori);
    }
    
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'nama' => 'required',
            'deskripsi' => 'required',
        ]);
        
        $kategori = new KategoriPeserta(
            null,
            $data['nama'],
            $data['deskripsi']
        );
        
        app(KategoriPesertaRepository::class)->create($kategori);
        
        return response()->json(['message' => 'KategoriPeserta created'], 201);
    }
    
    public function update(Request $request, int $id): JsonResponse
    {
        $data = $request->validate([
            'nama' => 'required',
            'deskripsi' => 'required',
        ]);
        
        $kategori = app(KategoriPesertaRepository::class)->find($id);
        if (!$kategori) {
            return response()->json(['message' => 'KategoriPeserta not found'], 404);
        }
        
        $kategori->nama = $data['nama'];
        $kategori->deskripsi = $data['deskripsi'];
        
        app(KategoriPesertaRepository::class)->update($kategori);
        
        return response()->json(['message' => 'KategoriPeserta updated']);
    }
    
    public function destroy(int $id): JsonResponse
    {
        app(KategoriPesertaRepository::class)->delete($id);
        return response()->json(['message' => 'KategoriPeserta deleted']);
    }
}