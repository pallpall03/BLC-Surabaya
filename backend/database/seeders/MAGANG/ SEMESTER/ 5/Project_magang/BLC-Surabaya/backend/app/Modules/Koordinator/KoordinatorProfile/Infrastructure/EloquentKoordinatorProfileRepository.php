<?php

namespace App\Modules\Koordinator\KoordinatorProfile\Infrastructure;

use App\Modules\Koordinator\KoordinatorProfile\Domain\KoordinatorProfile;
use App\Modules\Koordinator\KoordinatorProfile\Contracts\KoordinatorProfileRepository;

class EloquentKoordinatorProfileRepository implements KoordinatorProfileRepository
{
    protected $model;
    
    public function __construct()
    {
        $this->model = \App\Models\KoordinatorProfile::class;
    }
    
    public function findByKantorKuUserId(string $kantorKuUserId): ?KoordinatorProfile
    {
        return $this->model::where('kantor_ku_user_id', $kantorKuUserId)->first();
    }
    
    public function findByLokasiBlcIds(array $lokasiBlcIds): array
    {
        return $this->model::whereJsonContains('lokasi_blc_ids', $lokasiBlcIds)->get()->toArray();
    }
    
    public function create(KoordinatorProfile $profile): KoordinatorProfile
    {
        $this->model::create($profile->toArray());
        return $this->model::where('id', $this->model::max('id'))->first();
    }
    
    public function update(KoordinatorProfile $profile): KoordinatorProfile
    {
        $this->model::where('id', $profile->id)->update($profile->toArray());
        return $this->model::where('id', $profile->id)->first();
    }
    
    public function delete(int $id): void
    {
        $this->model::where('id', $id)->delete();
    }
    
    public function toArray(): array
    {
        return [
            'kantor_ku_user_id' => $this->model::get('kantor_ku_user_id'),
            'lokasi_blc_ids' => $this->model::get('lokasi_blc_ids'),
        ];
    }
}