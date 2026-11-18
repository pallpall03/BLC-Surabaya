<?php

namespace App\Modules\Instruktur\Materi\Http;

use App\Http\Controllers\Controller;
use App\Modules\Instruktur\Materi\Contracts\MateriRepository;
use App\Modules\Instruktur\Materi\Domain\Materi;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class MateriController extends Controller
{
    public function index(): JsonResponse
    {
        $materi = app(MateriRepository::class)->all();
        return response()->json($materi);
    }
    
    public function show(int $id): JsonResponse
    {
        $materi = app(MateriRepository::class)->find($id);
        return response()->json($materi);
    }
    
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'judul' => 'required',
            'deskripsi' => 'required',
            'file_pdf' => 'required',
            'pertemuan_ke' => 'required|integer',
            'kelas_id' => 'required|integer',
        ]);
        
        $materi = new Materi(
            null,
            $data['judul'],
            $data['deskripsi'],
            $data['file_pdf'],
            $data['pertemuan_ke'],
            $data['kelas_id']
        );
        
        app(MateriRepository::class)->create($materi);
        
        return response()->json(['message' => 'Materi created'], 201);
    }
    
    public function update(Request $request, int $id): JsonResponse
    {
        $data = $request->validate([
            'judul' => 'required',
            'deskripsi' => 'required',
            'file_pdf' => 'required',
            'pertemuan_ke' => 'required|integer',
            'kelas_id' => 'required|integer',
        ]);
        
        $materi = app(MateriRepository::class)->find($id);
        if (!$materi) {
            return response()->json(['message' => 'Materi not found'], 404);
        }
        
        $materi->judul = $data['judul'];
        $materi->deskripsi = $data['deskripsi'];
        $materi->file_pdf = $data['file_pdf'];
        $materi->pertemuan_ke = $data['pertemuan_ke'];
        $materi->kelas_id = $data['kelas_id'];
        
        app(MateriRepository::class)->update($materi);
        
        return response()->json(['message' => 'Materi updated']);
    }
    
    public function destroy(int $id): JsonResponse
    {
        app(MateriRepository::class)->delete($id);
        return response()->json(['message' => 'Materi deleted']);
    }
}