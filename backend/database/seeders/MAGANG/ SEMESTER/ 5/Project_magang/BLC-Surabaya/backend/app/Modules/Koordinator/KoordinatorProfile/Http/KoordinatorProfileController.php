<?php

namespace App\Modules\Koordinator\KoordinatorProfile\Http;

use App\Http\Controllers\Controller;
use App\Modules\Koordinator\KoordinatorProfile\Contracts\KoordinatorProfileRepository;
use App\Modules\Koordinator\KoordinatorProfile\Domain\KoordinatorProfile;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class KoordinatorProfileController extends Controller
{
    public function index(): JsonResponse
    {
        $profiles = app(KoordinatorProfileRepository::class)->findByKantorKuUserId(auth()->user()->id);
        return response()->json($profiles);
    }
    
    public function show(int $id): JsonResponse
    {
        $profile = app(KoordinatorProfileRepository::class)->findByLokasiBlcIds([$id])[0] ?? null;
        return response()->json($profile);
    }
    
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'kantor_ku_user_id' => 'required',
            'lokasi_blc_ids' => 'required|array',
        ]);
        
        $profile = new KoordinatorProfile(
            $data['kantor_ku_user_id'],
            $data['lokasi_blc_ids']
        );
        
        app(KoordinatorProfileRepository::class)->create($profile);
        
        return response()->json(['message' => 'Profile created'], 201);
    }
    
    public function update(Request $request, int $id): JsonResponse
    {
        $data = $request->validate([
            'kantor_ku_user_id' => 'required',
            'lokasi_blc_ids' => 'required|array',
        ]);
        
        $profile = app(KoordinatorProfileRepository::class)->findByLokasiBlcIds([$id])[0] ?? null;
        if (!$profile) {
            return response()->json(['message' => 'Profile not found'], 404);
        }
        
        $profile->kantor_ku_user_id = $data['kantor_ku_user_id'];
        $profile->lokasi_blc_ids = $data['lokasi_blc_ids'];
        
        app(KoordinatorProfileRepository::class)->update($profile);
        
        return response()->json(['message' => 'Profile updated']);
    }
    
    public function destroy(int $id): JsonResponse
    {
        app(KoordinatorProfileRepository::class)->delete($id);
        return response()->json(['message' => 'Profile deleted']);
    }
}