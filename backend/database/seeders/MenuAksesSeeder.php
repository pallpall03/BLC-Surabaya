<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Menu;
use App\Models\Role;
use App\Models\MenuAkses;

class MenuAksesSeeder extends Seeder
{
    public function run(): void
    {
        $roles = Role::all()->keyBy('slug');
        $menus = Menu::all()->keyBy('slug');

        // Super Admin: full access to all menus
        if (isset($roles['superadmin'])) {
            foreach ($menus as $menu) {
                MenuAkses::firstOrCreate(
                    ['role_id' => $roles['superadmin']->id, 'menu_id' => $menu->id],
                    ['bisa_lihat' => true, 'bisa_tambah' => true, 'bisa_edit' => true, 'bisa_hapus' => true]
                );
            }
        }

        // Koordinator: full access to Data & Konten (no menu-management)
        if (isset($roles['koordinator'])) {
            $allow = ['data', 'user-management', 'change-password', 'konten', 'artikel', 'faq', 'foto-slider', 'kategori-artikel', 'lokasi-blc', 'testimoni', 'tim-blc'];
            foreach ($allow as $slug) {
                if (isset($menus[$slug])) {
                    MenuAkses::firstOrCreate(
                        ['role_id' => $roles['koordinator']->id, 'menu_id' => $menus[$slug]->id],
                        ['bisa_lihat' => true, 'bisa_tambah' => true, 'bisa_edit' => true, 'bisa_hapus' => true]
                    );
                }
            }
        }

        // Instruktur: read/write Konten only
        if (isset($roles['instruktur'])) {
            $allow = ['konten', 'artikel', 'faq', 'foto-slider', 'kategori-artikel', 'lokasi-blc', 'testimoni', 'tim-blc'];
            foreach ($allow as $slug) {
                if (isset($menus[$slug])) {
                    MenuAkses::firstOrCreate(
                        ['role_id' => $roles['instruktur']->id, 'menu_id' => $menus[$slug]->id],
                        ['bisa_lihat' => true, 'bisa_tambah' => true, 'bisa_edit' => true, 'bisa_hapus' => false]
                    );
                }
            }
        }

        // Operator: read-only Konten
        if (isset($roles['operator'])) {
            $allow = ['konten', 'artikel', 'faq', 'foto-slider', 'kategori-artikel', 'lokasi-blc', 'testimoni', 'tim-blc'];
            foreach ($allow as $slug) {
                if (isset($menus[$slug])) {
                    MenuAkses::firstOrCreate(
                        ['role_id' => $roles['operator']->id, 'menu_id' => $menus[$slug]->id],
                        ['bisa_lihat' => true, 'bisa_tambah' => false, 'bisa_edit' => false, 'bisa_hapus' => false]
                    );
                }
            }
        }

        // Peserta: no admin menu access (portal only)
        // No menu_akses entries needed
    }
}