<?php

namespace App\Providers;

use Illuminate\Routing\Router;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as LaravelRouteServiceProvider;
use Illuminate\Support\Facades\Route;

class RouteServiceProvider extends LaravelRouteServiceProvider
{
    /**
     * Define the routes for the application.
     */
    public function boot(): void
    {
        parent::boot();
    }

    /**
     * Define the route middleware groups.
     */
    protected function configureRateLimiting(): void
    {
        // Rate limiting configuration can be added here
    }
}