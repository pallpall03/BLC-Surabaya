<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            ['slug' => 'admin', 'name' => 'Admin'],
            ['slug' => 'instruktur', 'name' => 'Instruktur'],
            ['slug' => 'koordinator', 'name' => 'Koordinator'],
            ['slug' => 'pengguna', 'name' => 'Pengguna'],
        ];

        foreach ($roles as $role) {
            Role::firstOrCreate(['slug' => $role['slug']], $role);
        }
    }
}