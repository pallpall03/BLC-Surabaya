<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            // Core
            RoleSeeder::class,
            MenuSeeder::class,
            MenuAksesSeeder::class,
            // Admin - System (pengaturan sistem/user)
            PenggunaSeeder::class,
            // Admin - Data (konten landing page)
            KategoriArtikelSeeder::class,
            ArtikelSeeder::class,
            FotoSliderSeeder::class,
            LokasiBlcSeeder::class,
            TestimoniSeeder::class,
            TimBlcSeeder::class,
            FaqSeeder::class,
            ModulSeeder::class,
            UjianSeeder::class,
            PiagamSeeder::class,
        ]);
    }
}
