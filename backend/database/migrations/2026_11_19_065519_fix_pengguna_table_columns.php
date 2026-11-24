<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pengguna', function (Blueprint $table) {
            // Add status column if not exists (using is_aktif as source)
            if (!Schema::hasColumn('pengguna', 'status')) {
                $table->string('status', 20)->nullable()->default('aktif')->after('is_aktif');
            }
            // Fix status: change from char(1) to varchar(20)
            $table->string('status', 20)->default('aktif')->change();
            // Fix tipe: change from char(1) to varchar(50)
            $table->string('tipe', 50)->nullable()->change();
            // Add missing columns
            $table->string('telepon', 20)->nullable()->after('email');
            $table->text('alamat')->nullable()->after('telepon');
            $table->string('foto_profil', 255)->nullable()->after('alamat');
            $table->timestamp('email_verified_at')->nullable()->after('foto_profil');
        });
    }

    public function down(): void
    {
        Schema::table('pengguna', function (Blueprint $table) {
            $table->dropColumn(['telepon', 'alamat', 'foto_profil', 'email_verified_at']);
            // Can't easily revert char types, but we won't go back
        });
    }
};
