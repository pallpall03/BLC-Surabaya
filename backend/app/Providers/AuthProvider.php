<?php

namespace App\Providers;

use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Contracts\Auth\Repository;
use Illuminate\Encryption\Encrypter;
use Illuminate\Hashing\Hasher;
use Illuminate\Support\ServiceProvider;

class AuthProvider extends ServiceProvider
{
    /**
     * Register bindings in the container.
     */
    public function register(): void
    {
        $this->app->instance(Authenticatable::class, $this->app->make(Authenticatable::class));
        $this->app->instance(Repository::class, $this->app->make(Repository::class));
        $this->app->instance(Encrypter::class, $this->app->make(Encrypter::class));
        $this->app->instance(Hasher::class, $this->app->make(Hasher::class));
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Nothing to boot here
    }
}