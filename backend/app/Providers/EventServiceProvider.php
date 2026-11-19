<?php

namespace App\Providers;

use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Contracts\Events\QueueingDispatcher;
use Illuminate\Events\EventServiceProvider as LaravelEventServiceProvider;
use Illuminate\Support\ServiceProvider;

class EventServiceProvider extends LaravelEventServiceProvider
{
    /**
     * The event listener mappings for the application.
     *
     * @var array<class-string, array<int, class-string>>
     */
    protected $listen = [
        // Custom events can be added here
    ];

    /**
     * Register any events for your application.
     */
    public function boot(): void
    {
        // Nothing to boot here
    }
}