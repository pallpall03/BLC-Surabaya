<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('ujian', function (Blueprint $table) {
            $table->id();
            $table->string('judul');
            $table->string('slug')->unique();
            $table->text('deskripsi')->nullable();
            $table->unsignedInteger('durasi_menit')->default(60);
            $table->unsignedInteger('urutan')->default(0);
            $table->boolean('is_aktif')->default(true);
            $table->boolean('is_delete')->default(false);
            $table->timestamps();

            $table->index(['is_aktif', 'is_delete']);
            $table->index('slug');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ujian');
    }
};
