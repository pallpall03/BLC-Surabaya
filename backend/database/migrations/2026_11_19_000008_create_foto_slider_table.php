<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('foto_slider', function (Blueprint $table) {
            $table->id();
            $table->string('file_brosur');                   // file_brosur (path gambar)
            $table->text('ket_brosur')->nullable();          // ket_brosur (deskripsi)
            $table->timestamp('tgl')->nullable();            // tgl (tanggal)
            $table->string('tipe')->nullable();              // tipe: slider, brosur, etc
            $table->char('status', 1)->default('1');         // status: 1=aktif, 0=nonaktif
            $table->integer('urutan')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('foto_slider');
    }
};