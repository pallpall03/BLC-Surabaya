<?php

use App\Shared\Support\ModuleRegistry;
use Illuminate\Support\Facades\Route;

/*
| Prefix /api/v1 menyatu dengan routes/api.php.
| Tiap modul hanya mendaftarkan path-nya sendiri lewat ServiceProvider.
| Isi controller masih kosong: endpoint mengembalikan 501 sampai dikerjakan.
*/

foreach (ModuleRegistry::providers() as $provider) {
    $provider::routes();
}
