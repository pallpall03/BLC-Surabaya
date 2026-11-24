<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('hak_akses', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('level_pengguna_id')->nullable();
            $table->timestamps();

            $table->foreign('level_pengguna_id')->references('id')->on('level_pengguna')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('hak_akses');
    }
};
