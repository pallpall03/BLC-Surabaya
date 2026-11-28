<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/** NIK 16 digit = identitas login semua role. Nullable agar akun lama tidak error,
 *  tetapi akun tanpa NIK tidak bisa login sampai NIK-nya terisi.
 * - failed_login_attempts: hitungan salah password berturut-turut (reset saat login berhasil).
 * - locked_at: terisi = akun terkunci, hanya admin yang bisa membuka.
 * - is_aktif, status, last_login_at: kolom otentikasi standar.
 * - unlocked_by, unlocked_at: untuk mekanisme terkunci.
 */
return new class extends Migration
{
    public function up(): void
    {
        // Migrasi ini berbagi timestamp dengan add_nik_and_lockout_to_users_table, jadi sebagian
        // kolom bisa sudah dibuat lebih dulu. Semua kolom dijaga agar urutan mana pun tetap aman.
        Schema::table('users', function (Blueprint $table) {
Schema::table('users', function (Blueprint $table) {
            // NIK 16 digit = identitas login semua role. Nullable agar akun lama tidak error,
            // tetapi akun tanpa NIK tidak bisa login sampai NIK-nya terisi.
            if (! Schema::hasColumn('users', 'nik')) {
                $table->string('nik', 16)->nullable()->unique();
            }
            if (! Schema::hasColumn('users', 'failed_login_attempts')) {
                $table->unsignedSmallInteger('failed_login_attempts')->default(0);
            }
            if (! Schema::hasColumn('users', 'locked_at')) {
                $table->timestamp('locked_at')->nullable();
            }
            if (! Schema::hasColumn('users', 'unlocked_by')) {
                $table->foreignId('unlocked_by')->nullable()->constrained('users')->nullOnDelete();
            }
            if (! Schema::hasColumn('users', 'unlocked_at')) {
                $table->timestamp('unlocked_at')->nullable();
            }
        });
        });

        // Kolom otentikasi standar - hanya jika belum ada
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'is_aktif')) {
                $table->boolean('is_aktif')->default(true);
            }
            if (!Schema::hasColumn('users', 'status')) {
                $table->string('status', 20)->default('aktif');
            }
            if (!Schema::hasColumn('users', 'last_login_at')) {
                $table->timestamp('last_login_at')->nullable();
            }
        });

        // NIK instruktur/koordinator sudah ada di tim_blc (tim_blc.user_id = users.id). Salin ke users.nik
        // hanya bila 16 digit angka dan unik, supaya akun yang sudah ada langsung bisa login.
        if (DB::getDriverName() === 'pgsql' && Schema::hasTable('tim_blc')) {
            DB::statement("
                UPDATE users u
                SET nik = t.nik
                FROM tim_blc t
                WHERE t.user_id = u.id::text
                  AND t.nik ~ '^[0-9]{16}$'
                  AND u.nik IS NULL
                  AND t.nik IN (SELECT nik FROM tim_blc GROUP BY nik HAVING count(*) = 1)
                  AND NOT EXISTS (SELECT 1 FROM users x WHERE x.nik = t.nik)
            ");
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('users', 'unlocked_by')) {
            $table->dropConstrainedForeignId('unlocked_by');
        }

        Schema::table('users', function (Blueprint $table) {
            $table->dropConstrainedForeignId('unlocked_by');
            // Hanya drop kolom yang kita tambahkan dan belum pernah ada sebelumnya
            if (Schema::hasColumn('users', 'nik')) {
                $table->dropUnique(['nik']);
                $table->dropColumn('nik');
            }
            if (Schema::hasColumn('users', 'failed_login_attempts')) {
                $table->dropColumn('failed_login_attempts');
            }
            if (Schema::hasColumn('users', 'locked_at')) {
                $table->dropColumn('locked_at');
            }
        });            }
        });
    }
};