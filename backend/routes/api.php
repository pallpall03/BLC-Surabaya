<?php

use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::get('/ping', fn () => response()->json([
        'message' => 'pong',
        'app' => config('app.name'),
        'time' => now()->toIso8601String(),
    ]));
});