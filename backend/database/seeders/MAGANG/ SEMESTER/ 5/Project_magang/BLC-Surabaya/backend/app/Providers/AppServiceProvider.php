<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Shared\Support\ModuleRegistry;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // Load all ModuleRegistry providers
        foreach (ModuleRegistry::providers() as $provider) {
            $this->app->register($provider);
        }
    }
}