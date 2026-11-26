<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('foto_kegiatan_pengunjung', function (Blueprint $table) {
            $table->json('foto_deskripsi')->nullable()->after('foto');
        });
    }

    public function down(): void
    {
        Schema::table('foto_kegiatan_pengunjung', function (Blueprint $table) {
            $table->dropColumn('foto_deskripsi');
        });
    }
};
