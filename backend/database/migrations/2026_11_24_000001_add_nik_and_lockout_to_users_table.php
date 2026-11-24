<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Login semua role memakai NIK (16 digit) dan akun terkunci setelah terlalu banyak salah password.
 *
 * - nik: nullable dulu supaya akun lama tidak rusak; akun tanpa NIK belum bisa login
 *   sampai admin mengisinya.
 * - failed_login_attempts: hitungan salah password berturut-turut (reset saat login berhasil).
 * - locked_at: terisi = akun terkunci, hanya admin yang bisa membuka.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (! Schema::hasColumn('users', 'nik')) {
                $table->string('nik', 16)->nullable()->unique();
            }
            if (! Schema::hasColumn('users', 'failed_login_attempts')) {
                $table->unsignedSmallInteger('failed_login_attempts')->default(0);
            }
            if (! Schema::hasColumn('users', 'locked_at')) {
                $table->timestamp('locked_at')->nullable();
            }
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
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
        });
    }
};
