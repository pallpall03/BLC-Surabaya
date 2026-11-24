<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('pengguna', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email');
            $table->string('password');
            $table->string('remember_token')->nullable();
            $table->string('status')->default('aktif');
            $table->string('tipe');
            $table->boolean('is_aktif')->default(true);
            $table->unsignedBigInteger('level_pengguna_id')->nullable();
            $table->string('nama_lengkap')->nullable();
            $table->string('username');
            $table->string('plain_password')->nullable();
            $table->timestamp('last_login_at')->nullable();
            $table->timestamps();

            $table->foreign('level_pengguna_id')->references('id')->on('level_pengguna')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pengguna');
    }
};
