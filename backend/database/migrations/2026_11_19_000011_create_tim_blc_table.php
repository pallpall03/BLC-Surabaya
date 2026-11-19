<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tim_blc', function (Blueprint $table) {
            $table->id();
            $table->string('user_id')->nullable();           // user_id
            $table->string('nama_lengkap');                  // full_name
            $table->string('gender')->nullable();            // gender
            $table->string('email')->nullable();             // email
            $table->text('alamat')->nullable();              // address
            $table->string('role')->default('instruktur');   // role: instruktur, koordinator, etc
            $table->string('avatar')->nullable();            // avatar
            $table->string('phone')->nullable();             // phone
            $table->foreignId('kategori_id')->nullable()->constrained('kategori_artikel')->nullOnDelete();
            $table->foreignId('lokasi_blc_id')->nullable()->constrained('lokasi_blc')->nullOnDelete();
            $table->string('nik')->nullable();               // nik
            $table->date('tanggal_lahir')->nullable();       // tanggal_lahir
            $table->string('kecamatan')->nullable();         // kecamatan
            $table->string('kelurahan')->nullable();         // kelurahan
            $table->string('username')->nullable();          // username
            $table->boolean('is_delete')->default(false);    // is_delete
            $table->boolean('is_surabaya')->default(true);   // is_surabaya
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tim_blc');
    }
};