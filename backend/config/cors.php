<?php

return [
    // Frontend Next.js memanggil API dari browser, jadi origin-nya harus diizinkan.
    'paths' => ['api/*'],
    'allowed_methods' => ['*'],
    'allowed_origins' => array_filter(array_map('trim', explode(',', (string) env('FRONTEND_URL', 'http://localhost:3000')))),
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    // Token dikirim lewat header Authorization (Bearer), bukan cookie.
    'supports_credentials' => false,
];
