<?php

/*
| Aturan login (mengikuti pola sibunda.go.id).
| - Salah password sebelum `captcha_after` kali: tanpa captcha.
| - Sejak salah ke-`captcha_after`: captcha wajib untuk percobaan berikutnya.
| - Salah ke-`lock_after`: akun terkunci, hanya admin (superadmin) yang bisa membuka.
| Dengan nilai bawaan (2 dan 3): salah 1x tanpa captcha, salah 2x muncul captcha, salah 3x terkunci.
*/
return [
    'nik_length' => 16,
    'captcha_after' => (int) env('LOGIN_CAPTCHA_AFTER', 2),
    'lock_after' => (int) env('LOGIN_LOCK_AFTER', 3),
    // Captcha kedaluwarsa dan form menggantinya otomatis tiap 60 detik.
    'captcha_ttl' => (int) env('LOGIN_CAPTCHA_TTL', 60),
];
