<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('lokasi_blc', function (Blueprint $table) {
            $table->dropColumn([
                'foto_absen_ins',
                'ver_foto_absen_ins',
                'is_korwil',
                'is_teknisi_ahli',
                'is_teknisi',
                'radius',
            ]);
        });
    }

    public function down(): void
    {
        Schema::table('lokasi_blc', function (Blueprint $table) {
            $table->string('foto_absen_ins')->nullable();
            $table->integer('ver_foto_absen_ins')->nullable();
            $table->boolean('is_korwil')->default(false);
            $table->boolean('is_teknisi_ahli')->default(false);
            $table->boolean('is_teknisi')->default(false);
            $table->string('radius')->nullable();
        });
    }
};
