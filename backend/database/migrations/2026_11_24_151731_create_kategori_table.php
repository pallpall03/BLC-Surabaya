<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('kategori', function (Blueprint $table) {
            $table->id();
            $table->string('jenis_kategori')->nullable();    // PELAJAR, PEKERJA, NON PEKERJA, ORGANISASI
            $table->string('nama_kelompok')->nullable();     // SD, SMP, PNS, PKK, dst
            $table->integer('is_delete')->default(0);        // 0 aktif, 1 terhapus
            $table->integer('urutan')->default(0);          // Urutan tampil
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kategori');
    }
};