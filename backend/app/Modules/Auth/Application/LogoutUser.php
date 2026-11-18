<?php

namespace App\Modules\Auth\Application;

use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

/**
 * Mencabut token yang sedang dipakai (perangkat ini saja).
 */
final class LogoutUser
{
    public function handle(): void
    {
        try {
            JWTAuth::invalidate(JWTAuth::getToken());
        } catch (JWTException $e) {
            // Token already invalid or missing
        }
    }
}
