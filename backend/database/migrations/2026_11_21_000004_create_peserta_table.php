<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Peserta = baris `user_info` lama yang role-nya student. Kolomnya mengikuti
        // tim_blc (yang berasal dari user_info juga). kategori_id memakai kategori_artikel.
        Schema::create('peserta', function (Blueprint $table) {
            $table->id();
            $table->string('nama_lengkap');
            $table->string('gender', 20)->nullable();
            $table->string('email')->nullable();
            $table->text('alamat')->nullable();
            $table->string('phone', 100)->nullable();
            $table->foreignId('kategori_id')->nullable()->constrained('kategori_artikel')->nullOnDelete();
            $table->foreignId('lokasi_blc_id')->nullable()->constrained('lokasi_blc')->nullOnDelete();
            $table->string('nik')->nullable()->index();
            $table->date('tanggal_lahir')->nullable();
            $table->string('kecamatan')->nullable();
            $table->string('kelurahan')->nullable();
            $table->string('kecamatan_lain')->nullable();
            $table->string('kelurahan_lain')->nullable();
            $table->boolean('is_surabaya')->default(true);
            $table->boolean('is_delete')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('peserta');
    }
};
