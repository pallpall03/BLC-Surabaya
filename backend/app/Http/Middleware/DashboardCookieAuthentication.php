<?php

namespace App\Http\Middleware;

use App\Shared\Support\DashboardAccess;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

final class DashboardCookieAuthentication
{
    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->headers->has('Authorization')) {
            $token = $request->cookies->get(DashboardAccess::COOKIE);

            if (is_string($token) && trim($token) !== '') {
                $request->headers->set('Authorization', 'Bearer '.trim($token));
            }
        }

        return $next($request);
    }
}
