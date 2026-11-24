<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Setara tabel lama `materi` (Diskominfo). ID-nya teks, misalnya "F-I", "F-II".
        Schema::create('materi', function (Blueprint $table) {
            $table->string('id', 50)->primary();
            $table->string('nama_materi');
            $table->unsignedInteger('id_index')->nullable();
            $table->boolean('is_delete')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('materi');
    }
};
