<?php

namespace App\Modules\Instruktur\InstrukturProfile\Http;

use App\Http\Controllers\Controller;
use App\Modules\Instruktur\InstrukturProfile\Contracts\InstrukturProfileRepository;
use App\Modules\Instruktur\InstrukturProfile\Domain\InstrukturProfile;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class InstrukturProfileController extends Controller
{
    public function index(): JsonResponse
    {
        $profiles = app(InstrukturProfileRepository::class)->findByKantorKuUserId(auth()->user()->id);
        return response()->json($profiles);
    }
    
    public function show(int $id): JsonResponse
    {
        $profile = app(InstrukturProfileRepository::class)->findByLokasiBlcId($id);
        return response()->json($profile);
    }
    
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'kantor_ku_user_id' => 'required',
            'lokasi_blc_id' => 'required',
        ]);
        
        $profile = new InstrukturProfile(
            $data['kantor_ku_user_id'],
            $data['lokasi_blc_id']
        );
        
        app(InstrukturProfileRepository::class)->create($profile);
        
        return response()->json(['message' => 'Profile created'], 201);
    }
    
    public function update(Request $request, int $id): JsonResponse
    {
        $data = $request->validate([
            'kantor_ku_user_id' => 'required',
            'lokasi_blc_id' => 'required',
        ]);
        
        $profile = app(InstrukturProfileRepository::class)->findByLokasiBlcId($id);
        if (!$profile) {
            return response()->json(['message' => 'Profile not found'], 404);
        }
        
        $profile->kantor_ku_user_id = $data['kantor_ku_user_id'];
        $profile->lokasi_blc_id = $data['lokasi_blc_id'];
        
        app(InstrukturProfileRepository::class)->update($profile);
        
        return response()->json(['message' => 'Profile updated']);
    }
    
    public function destroy(int $id): JsonResponse
    {
        app(InstrukturProfileRepository::class)->delete($id);
        return response()->json(['message' => 'Profile deleted']);
    }
}