<?php

namespace App\Modules\Admin\Data\TimBlc;

use App\Modules\Admin\Data\TimBlc\Contracts\TimBlcRepository;
use App\Modules\Admin\Data\TimBlc\Infrastructure\EloquentTimBlcRepository;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

final class TimBlcServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(TimBlcRepository::class, EloquentTimBlcRepository::class);
    }

    public static function routes(): void
    {
        Route::prefix('tim-blc')->group(function (): void {
            Route::get('/', [Http\TimBlcController::class, 'index']);
            Route::post('/', [Http\TimBlcController::class, 'store']);
            Route::get('/{id}', [Http\TimBlcController::class, 'show']);
            Route::put('/{id}', [Http\TimBlcController::class, 'update']);
            Route::patch('/{id}', [Http\TimBlcController::class, 'update']);
            Route::delete('/{id}', [Http\TimBlcController::class, 'destroy']);
        });
    }
}
