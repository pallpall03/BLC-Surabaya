<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lokasi_blc', function (Blueprint $table) {
            $table->id();
            $table->string('nama_blc');                      // nama_blc
            $table->text('alamat')->nullable();              // alamat
            $table->string('foto_blc')->nullable();          // foto_blc
            $table->string('foto2_blc')->nullable();         // foto2_blc
            $table->boolean('is_delete')->default(false);    // is_delete
            $table->string('radius')->nullable();            // radius
            $table->string('latitude')->nullable();          // latitude
            $table->string('longitude')->nullable();         // longitude
            $table->string('foto_absen_ins')->nullable();    // foto_absen_ins
            $table->integer('ver_foto_absen_ins')->nullable(); // ver_foto_absen_ins
            $table->string('area')->nullable();              // area
            $table->boolean('aktif')->default(true);         // aktif
            $table->boolean('is_korwil')->default(false);    // is_korwil
            $table->boolean('is_teknisi_ahli')->default(false); // is_teknisi_ahli
            $table->boolean('is_teknisi')->default(false);   // is_teknisi
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lokasi_blc');
    }
};