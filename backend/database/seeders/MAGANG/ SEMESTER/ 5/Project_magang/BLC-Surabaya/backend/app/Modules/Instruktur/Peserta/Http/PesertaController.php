<?php

namespace App\Modules\Instruktur\Peserta\Http;

use App\Http\Controllers\Controller;
use App\Modules\Instruktur\Peserta\Contracts\PesertaRepository;
use App\Modules\Instruktur\Peserta\Domain\Peserta;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class PesertaController extends Controller
{
    public function index(): JsonResponse
    {
        $peserta = app(PesertaRepository::class)->all();
        return response()->json($peserta);
    }
    
    public function show(int $id): JsonResponse
    {
        $peserta = app(PesertaRepository::class)->find($id);
        return response()->json($peserta);
    }
    
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'nama' => 'required',
            'kelas_id' => 'required|integer',
            'kecamatan' => 'required',
            'kelurahan' => 'required',
            'kategori' => 'required',
        ]);
        
        $peserta = new Peserta(
            null,
            $data['nama'],
            $data['kelas_id'],
            $data['kecamatan'],
            $data['kelurahan'],
            $data['kategori']
        );
        
        app(PesertaRepository::class)->create($peserta);
        
        return response()->json(['message' => 'Peserta created'], 201);
    }
    
    public function update(Request $request, int $id): JsonResponse
    {
        $data = $request->validate([
            'nama' => 'required',
            'kelas_id' => 'required|integer',
            'kecamatan' => 'required',
            'kelurahan' => 'required',
            'kategori' => 'required',
        ]);
        
        $peserta = app(PesertaRepository::class)->find($id);
        if (!$peserta) {
            return response()->json(['message' => 'Peserta not found'], 404);
        }
        
        $peserta->nama = $data['nama'];
        $peserta->kelas_id = $data['kelas_id'];
        $peserta->kecamatan = $data['kecamatan'];
        $peserta->kelurahan = $data['kelurahan'];
        $peserta->kategori = $data['kategori'];
        
        app(PesertaRepository::class)->update($peserta);
        
        return response()->json(['message' => 'Peserta updated']);
    }
    
    public function destroy(int $id): JsonResponse
    {
        app(PesertaRepository::class)->delete($id);
        return response()->json(['message' => 'Peserta deleted']);
    }
}