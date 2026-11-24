<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Setara tabel lama `sesi`: slot jam belajar, misalnya "07.30-09.00".
        Schema::create('sesi', function (Blueprint $table) {
            $table->id();
            $table->unsignedSmallInteger('sesi')->nullable();
            $table->string('jam', 50);
            $table->boolean('is_delete')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sesi');
    }
};
