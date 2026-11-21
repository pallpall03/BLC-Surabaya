<?php

namespace App\Modules\Auth\Application;

use Illuminate\Support\Facades\Auth;

/**
 * Mencabut token yang sedang dipakai (perangkat ini saja): token masuk blacklist JWT
 * sehingga tidak bisa dipakai lagi walau belum kedaluwarsa.
 */
final class LogoutUser
{
    public function handle(): void
    {
        Auth::guard('api')->logout();
    }
}
