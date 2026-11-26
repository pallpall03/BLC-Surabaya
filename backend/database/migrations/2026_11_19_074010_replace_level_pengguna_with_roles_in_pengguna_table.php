<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Tabel legacy (pengguna/hak_akses/level_pengguna) hanya ada di database lama.
        if (! Schema::hasTable('pengguna') || ! Schema::hasTable('hak_akses') || ! Schema::hasTable('level_pengguna')) {
            return;
        }

        // Drop foreign key on hak_akses.level_pengguna_id first
        Schema::table('hak_akses', function (Blueprint $table) {
            $table->dropForeign(['level_pengguna_id']);
        });

        // Add role_id column (FK to roles table) to pengguna
        Schema::table('pengguna', function (Blueprint $table) {
            $table->foreignId('role_id')
                ->nullable()
                ->constrained('roles')
                ->onDelete('set null')
                ->after('email');
        });

        // Migrate data: copy level_pengguna_id -> role_id by matching slug
        \DB::statement("
            UPDATE pengguna p
            SET role_id = r.id
            FROM roles r
            WHERE p.level_pengguna_id = (
                SELECT id FROM level_pengguna lp
                WHERE (
                    (lp.slug = 'super_admin' AND r.slug = 'superadmin') OR
                    (lp.slug = 'admin' AND r.slug = 'admin') OR
                    (lp.slug = 'instruktur' AND r.slug = 'instruktur') OR
                    (lp.slug = 'koordinator' AND r.slug = 'koordinator') OR
                    (lp.slug = 'peserta' AND r.slug = 'peserta') OR
                    (lp.slug = 'user' AND r.slug = 'peserta') OR
                    (lp.slug = 'operator' AND r.slug = 'operator')
                )
            )
        ");

        // Drop foreign key on level_pengguna_id in pengguna
        Schema::table('pengguna', function (Blueprint $table) {
            $table->dropForeign(['level_pengguna_id']);
            $table->dropColumn('level_pengguna_id');
        });

        // Drop level_pengguna_id column from hak_akses
        Schema::table('hak_akses', function (Blueprint $table) {
            $table->dropColumn('level_pengguna_id');
        });

        // Drop level_pengguna table
        Schema::dropIfExists('level_pengguna');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Recreate level_pengguna table
        Schema::create('level_pengguna', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('nama');
            $table->text('deskripsi')->nullable();
            $table->boolean('is_aktif')->default(true);
            $table->timestamps();
        });

        // Add level_pengguna_id column back to pengguna
        Schema::table('pengguna', function (Blueprint $table) {
            $table->foreignId('level_pengguna_id')
                ->nullable()
                ->constrained('level_pengguna')
                ->onDelete('set null')
                ->after('email');
        });

        // Add level_pengguna_id column back to hak_akses
        Schema::table('hak_akses', function (Blueprint $table) {
            $table->foreignId('level_pengguna_id')
                ->nullable()
                ->constrained('level_pengguna')
                ->onDelete('set null')
                ->after('id');
        });

        // Drop role_id column from pengguna
        Schema::table('pengguna', function (Blueprint $table) {
            $table->dropForeign(['role_id']);
            $table->dropColumn('role_id');
        });
    }
};
