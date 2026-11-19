<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('kategori_artikel', function (Blueprint $table) {
            $table->id();
            $table->string('jenis_kategori')->nullable();    // jenis_kategori
            $table->string('nama_kelompok');                 // nama_kelompok
            $table->integer('urutan')->default(0);           // urut
            $table->boolean('is_delete')->default(false);    // is_delete
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kategori_artikel');
    }
};