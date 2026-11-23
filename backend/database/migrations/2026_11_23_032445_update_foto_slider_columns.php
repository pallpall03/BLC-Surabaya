<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('foto_slider', function (Blueprint $table) {
            $table->string('judul')->nullable()->after('id');
            $table->text('deskripsi')->nullable()->after('judul');
            $table->string('gambar')->nullable()->after('deskripsi');
            $table->boolean('aktif')->default(true)->after('urutan');
        });

        \DB::statement("UPDATE foto_slider SET judul = file_brosur WHERE judul IS NULL");
        \DB::statement("UPDATE foto_slider SET deskripsi = ket_brosur WHERE deskripsi IS NULL");
        \DB::statement("UPDATE foto_slider SET gambar = file_brosur WHERE gambar IS NULL");
        \DB::statement("UPDATE foto_slider SET aktif = (status = '1') WHERE aktif IS NULL");
    }

    public function down(): void
    {
        Schema::table('foto_slider', function (Blueprint $table) {
            $table->dropColumn(['judul', 'deskripsi', 'gambar', 'aktif']);
        });
    }
};
