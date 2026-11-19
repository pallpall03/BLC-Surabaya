<?php

namespace App\Providers;

use Illuminate\Auth\EloquentUserProvider;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Contracts\Auth\Repository;
use Illuminate\Contracts\Auth\UserProvider;
use Illuminate\Encryption\Encrypter;
use Illuminate\Hashing\Hasher;
use Illuminate\Support\ServiceProvider;

class AuthModuleProvider extends ServiceProvider
{
    /**
     * Register bindings in the container.
     */
    public function register(): void
    {
        $this->app->bind(Authenticatable::class, function ($app) {
            return $app->make('auth')->user();
        });

        $this->app->bind(Repository::class, function ($app) {
            return $app->make('auth');
        });

        $this->app->singleton(Encrypter::class, function ($app) {
            return new Encrypter($app['config']['app.key']);
        });

        $this->app->singleton(Hasher::class, function ($app) {
            return new \Illuminate\Hashing\BcryptHasher();
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Nothing to boot here
    }
}