<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Dibuat aman dijalankan di database mana pun: kolom yang belum ada ditambahkan,
     * kolom yang sudah ada dilewati (database lokal sebagian tidak punya status/tipe).
     */
    public function up(): void
    {
        Schema::table('pengguna', function (Blueprint $table) {
            if (Schema::hasColumn('pengguna', 'status')) {
                $table->string('status', 20)->default('aktif')->change();
            } else {
                $table->string('status', 20)->default('aktif');
            }

            if (Schema::hasColumn('pengguna', 'tipe')) {
                $table->string('tipe', 50)->nullable()->change();
            } else {
                $table->string('tipe', 50)->nullable();
            }

            if (! Schema::hasColumn('pengguna', 'telepon')) {
                $table->string('telepon', 20)->nullable();
            }
            if (! Schema::hasColumn('pengguna', 'alamat')) {
                $table->text('alamat')->nullable();
            }
            if (! Schema::hasColumn('pengguna', 'foto_profil')) {
                $table->string('foto_profil', 255)->nullable();
            }
            if (! Schema::hasColumn('pengguna', 'email_verified_at')) {
                $table->timestamp('email_verified_at')->nullable();
            }
        });
    }

    public function down(): void
    {
        // Sengaja kosong: kolom-kolom ini mungkin sudah ada sebelum migrasi ini.
    }
};
