<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('testimoni', function (Blueprint $table) {
            $table->id();
            $table->string('nama');                          // nama
            $table->text('alamat')->nullable();              // alamat
            $table->string('phone')->nullable();             // phone
            $table->string('gender')->nullable();            // gender
            $table->string('email')->nullable();             // email
            $table->foreignId('kategori_id')->nullable()->constrained('kategori_artikel')->nullOnDelete();
            $table->string('keperluan')->nullable();         // keperluan (testimoni content)
            $table->foreignId('lokasi_blc_id')->nullable()->constrained('lokasi_blc')->nullOnDelete();
            $table->text('materi_id')->nullable();           // materi_id (additional info)
            $table->boolean('is_surabaya')->default(false);  // is_surabaya
            $table->date('tanggal_lahir')->nullable();       // tanggal_lahir
            $table->string('kecamatan')->nullable();         // kecamatan
            $table->string('kelurahan')->nullable();         // kelurahan
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('testimoni');
    }
};