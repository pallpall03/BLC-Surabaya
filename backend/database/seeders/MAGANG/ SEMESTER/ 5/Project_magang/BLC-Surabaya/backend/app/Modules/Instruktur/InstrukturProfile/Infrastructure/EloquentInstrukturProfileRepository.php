<?php

namespace App\Modules\Instruktur\InstrukturProfile\Infrastructure;

use App\Modules\Instruktur\InstrukturProfile\Domain\InstrukturProfile;
use App\Modules\Instruktur\InstrukturProfile\Contracts\InstrukturProfileRepository;

class EloquentInstrukturProfileRepository implements InstrukturProfileRepository
{
    protected $model;
    
    public function __construct()
    {
        $this->model = \App\Models\InstrukturProfile::class;
    }
    
    public function findByKantorKuUserId(string $kantorKuUserId): ?InstrukturProfile
    {
        return $this->model::where('kantor_ku_user_id', $kantorKuUserId)->first();
    }
    
    public function findByLokasiBlcId(int $lokasiBlcId): ?InstrukturProfile
    {
        return $this->model::where('lokasi_blc_id', $lokasiBlcId)->first();
    }
    
    public function create(InstrukturProfile $profile): InstrukturProfile
    {
        $this->model::create($profile->toArray());
        return $this->model::where('id', $this->model::max('id'))->first();
    }
    
    public function update(InstrukturProfile $profile): InstrukturProfile
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
            'lokasi_blc_id' => $this->model::get('lokasi_blc_id'),
        ];
    }
}