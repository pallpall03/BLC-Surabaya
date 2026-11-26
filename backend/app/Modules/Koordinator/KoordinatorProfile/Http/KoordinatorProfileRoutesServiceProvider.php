<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Koordinator\KoordinatorProfile\Http\KoordinatorProfileController;

Route::middleware(['auth:api', 'role:koordinator'])->prefix('koordinator-profile')->group(function (): void {
    Route::get('/', [KoordinatorProfileController::class, 'index']);
    Route::get('/{id}', [KoordinatorProfileController::class, 'show']);
    Route::post('/', [KoordinatorProfileController::class, 'store']);
    Route::put('/{id}', [KoordinatorProfileController::class, 'update']);
    Route::delete('/{id}', [KoordinatorProfileController::class, 'destroy']);
});