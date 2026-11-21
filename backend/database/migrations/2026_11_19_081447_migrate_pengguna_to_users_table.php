<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Add missing columns to users table
        Schema::table('users', function (Blueprint $table) {
            $table->string('username')->unique()->nullable()->after('name');
            $table->string('status', 20)->default('aktif')->after('username');
            $table->string('tipe', 50)->nullable()->after('status');
            $table->string('plain_password')->nullable()->after('password');
            $table->timestamp('last_login_at')->nullable()->after('plain_password');
            $table->boolean('is_aktif')->default(true)->after('last_login_at');
        });

        // 2. Migrate data from pengguna to users
        // Map role_id from pengguna.role_id (already points to roles table)
        DB::statement("
            INSERT INTO users (name, email, password, role_id, username, status, tipe, plain_password, is_aktif, email_verified_at, created_at, updated_at)
            SELECT 
                COALESCE(nama_lengkap, 'User') as name,
                email,
                password,
                role_id,
                username,
                status,
                tipe,
                plain_password,
                is_aktif,
                email_verified_at,
                created_at,
                updated_at
            FROM pengguna
            ON CONFLICT (email) DO UPDATE SET
                name = EXCLUDED.name,
                password = EXCLUDED.password,
                role_id = EXCLUDED.role_id,
                username = EXCLUDED.username,
                status = EXCLUDED.status,
                tipe = EXCLUDED.tipe,
                plain_password = EXCLUDED.plain_password,
                is_aktif = EXCLUDED.is_aktif,
                email_verified_at = EXCLUDED.email_verified_at,
                updated_at = EXCLUDED.updated_at
        ");

        // 3. Update artikel.created_by FK to point to users table
        // First drop the old FK
        Schema::table('artikel', function (Blueprint $table) {
            $table->dropForeign(['created_by']);
        });

        // Update created_by values: map pengguna.id -> users.id by email
        DB::statement("
            UPDATE artikel a
            SET created_by = u.id
            FROM users u
            JOIN pengguna p ON p.email = u.email
            WHERE a.created_by = p.id
        ");

        // Add new FK to users
        Schema::table('artikel', function (Blueprint $table) {
            $table->foreign('created_by')->references('id')->on('users')->onDelete('set null');
        });

        // 4. Drop pengguna table
        Schema::dropIfExists('pengguna');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Recreate pengguna table
        Schema::create('pengguna', function (Blueprint $table) {
            $table->id();
            $table->foreignId('role_id')->nullable()->constrained('roles')->onDelete('set null');
            $table->string('username')->unique();
            $table->string('password');
            $table->string('nama_lengkap')->nullable();
            $table->string('email')->unique();
            $table->string('status', 20)->default('aktif');
            $table->string('tipe', 50)->nullable();
            $table->string('plain_password')->nullable();
            $table->timestamp('last_login_at')->nullable();
            $table->boolean('is_aktif')->default(true);
            $table->timestamp('email_verified_at')->nullable();
            $table->rememberToken();
            $table->timestamps();
        });

        // Migrate data back
        DB::statement("
            INSERT INTO pengguna (role_id, username, password, nama_lengkap, email, status, tipe, plain_password, is_aktif, email_verified_at, created_at, updated_at)
            SELECT role_id, username, password, name as nama_lengkap, email, status, tipe, plain_password, is_aktif, email_verified_at, created_at, updated_at
            FROM users
            WHERE username IS NOT NULL
            ON CONFLICT (email) DO UPDATE SET
                role_id = EXCLUDED.role_id,
                username = EXCLUDED.username,
                password = EXCLUDED.password,
                nama_lengkap = EXCLUDED.nama_lengkap,
                status = EXCLUDED.status,
                tipe = EXCLUDED.tipe,
                plain_password = EXCLUDED.plain_password,
                is_aktif = EXCLUDED.is_aktif,
                email_verified_at = EXCLUDED.email_verified_at,
                updated_at = EXCLUDED.updated_at
        ");

        // Restore artikel.created_by FK to pengguna
        Schema::table('artikel', function (Blueprint $table) {
            $table->dropForeign(['created_by']);
        });

        DB::statement("
            UPDATE artikel a
            SET created_by = p.id
            FROM pengguna p
            JOIN users u ON u.email = p.email
            WHERE a.created_by = u.id
        ");

        Schema::table('artikel', function (Blueprint $table) {
            $table->foreign('created_by')->references('id')->on('pengguna')->onDelete('set null');
        });

        // Drop added columns from users
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['username', 'status', 'tipe', 'plain_password', 'last_login_at', 'is_aktif']);
        });
    }
};
