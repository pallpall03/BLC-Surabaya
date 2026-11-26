<?php

use App\Shared\Support\PrivateFileAccess;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;

Route::get('/storage/{path}', function (Request $request, string $path) {
    $path = str_replace('\\', '/', $path);
    abort_unless(! in_array('..', explode('/', $path), true), 404);

    if (PrivateFileAccess::isPrivatePath($path)) {
        abort_unless($request->hasValidSignature(), 403);
    }

    $disk = Storage::disk('public');
    abort_unless($disk->isFile($path), 404);

    return $disk->response($path, headers: [
        'Cache-Control' => PrivateFileAccess::isPrivatePath($path)
            ? 'private, max-age=3600'
            : 'public, max-age=31536000, immutable',
    ]);
})->name('storage.file')->where('path', '.*');

// Laravel tidak merender frontend; URL publik hanya dialihkan ke Next.js.
Route::get('/', fn () => redirect()->to(rtrim((string) config('services.frontend.public_url'), '/')));
Route::get('/login', fn () => redirect()->to(rtrim((string) config('services.frontend.public_url'), '/').'/login'));
Route::get('/register', fn () => redirect()->to(rtrim((string) config('services.frontend.public_url'), '/').'/register'));
