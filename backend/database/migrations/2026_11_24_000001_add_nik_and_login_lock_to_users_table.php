<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // NIK 16 digit = identitas login semua role. Nullable agar akun lama tidak error,
            // tetapi akun tanpa NIK tidak bisa login sampai NIK-nya terisi.
            $table->string('nik', 16)->nullable()->unique();
            $table->unsignedSmallInteger('failed_login_attempts')->default(0);
            $table->timestamp('locked_at')->nullable();
            $table->foreignId('unlocked_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('unlocked_at')->nullable();
        });

        // Kolom ini biasanya sudah dibuat migrasi migrate_pengguna_to_users. Ditambahkan di sini hanya
        // bila belum ada (mis. database yang belum menjalankan migrasi itu), karena kode login memakainya.
        Schema::table('users', function (Blueprint $table) {
            if (! Schema::hasColumn('users', 'is_aktif')) {
                $table->boolean('is_aktif')->default(true);
            }
            if (! Schema::hasColumn('users', 'status')) {
                $table->string('status', 20)->default('aktif');
            }
            if (! Schema::hasColumn('users', 'last_login_at')) {
                $table->timestamp('last_login_at')->nullable();
            }
        });

        // NIK instruktur/koordinator sudah ada di tim_blc (tim_blc.user_id = users.id). Salin ke users.nik
        // hanya bila 16 digit angka dan unik, supaya akun yang sudah ada langsung bisa login.
        if (DB::getDriverName() === 'pgsql' && Schema::hasTable('tim_blc')) {
            DB::statement(<<<'SQL'
                UPDATE users u
                SET nik = t.nik
                FROM tim_blc t
                WHERE t.user_id = u.id::text
                  AND t.nik ~ '^[0-9]{16}$'
                  AND u.nik IS NULL
                  AND t.nik IN (SELECT nik FROM tim_blc GROUP BY nik HAVING count(*) = 1)
                  AND NOT EXISTS (SELECT 1 FROM users x WHERE x.nik = t.nik)
            SQL);
        }
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropConstrainedForeignId('unlocked_by');
            $table->dropColumn(['nik', 'failed_login_attempts', 'locked_at', 'unlocked_at']);
        });
    }
};
