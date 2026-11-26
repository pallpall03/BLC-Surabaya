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
    // Sesi login memakai cookie httpOnly (blc_dashboard_token), jadi browser harus
    // diizinkan mengirim cookie saat memanggil API dari origin frontend.
    'supports_credentials' => true,
];
