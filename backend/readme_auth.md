Saya telah mengimplementasikan sistem login dengan JWT untuk proyek BLC Surabaya:

✅ **Struktur Autentikasi:**
- Membuat modul Auth dengan Service Provider (AuthModuleProvider) yang mendaftarkan route dan binding
- Membuat konfigurasi JWT (config/jwt.php) dengan parameter secret, TTL, algoritma, dan lain-lain
- Membuat middleware JWT (app/Modules/Auth/Http/Middleware/JwtMiddleware.php) untuk otentikasi request
- Membuat Kernel application (app/Http/Kernel.php) dengan registrasi middleware JWT

✅ **Implementasi Login:**
- Mengganti use case LoginUser untuk menggunakan JWT token (JWTAuth::fromUser())
- Mengupdate AuthController untuk menggunakan LoginUser dan LogoutUser yang baru
- Menghapus dependensi pada Sanctum PersonalAccessToken

✅ **Implementasi Logout:**
- Mengupdate use case LogoutUser untuk menggunakan JWT token invalidation (JWTAuth::invalidate())
- Menghapus dependensi pada Sanctum PersonalAccessToken

✅ **Keamanan & Integrasi:**
- Menambahkan middleware JWT yang mengecek token, mengatasi expired, invalid, dan missing token
- Menetapkan middleware 'jwt.auth' di route auth group
- Mengkonfigurasi rate limiting untuk endpoint login
- Mengaktifkan CORS dan keamanan HTTP (CSRF, dll.) yang diperlukan

✅ **Keunggulan:**
- Satu pintu login untuk semua role (satu endpoint /api/v1/auth/login)
- Token JWT yang aman dan dapat dienkripsi
- Middleware terpisah untuk otentikasi yang dapat digunakan di route lain
- Integrasi rapi dengan struktur Clean Architecture yang sudah ada

Sistem ini siap dipakai untuk autentikasi yang aman dan skalabel.