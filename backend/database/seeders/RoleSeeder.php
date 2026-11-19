<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            ['slug' => 'superadmin', 'name' => 'Super Admin'],
            ['slug' => 'koordinator', 'name' => 'Koordinator'],
            ['slug' => 'instruktur', 'name' => 'Instruktur'],
            ['slug' => 'operator', 'name' => 'Operator'],
            ['slug' => 'peserta', 'name' => 'Peserta'],
        ];

        foreach ($roles as $role) {
            Role::firstOrCreate(['slug' => $role['slug']], $role);
        }
    }
}