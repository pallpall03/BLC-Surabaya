<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('soal_ujian', function (Blueprint $table) {
            $table->id();
            $table->foreignId('master_ujian_id')->constrained('master_ujian')->cascadeOnDelete();
            $table->text('pertanyaan');
            $table->json('pilihan');
            $table->unsignedTinyInteger('jawaban_benar');
            $table->unsignedInteger('nomor');
            $table->unsignedInteger('bobot')->default(1);
            $table->text('penjelasan')->nullable();
            $table->boolean('is_aktif')->default(true);
            $table->timestamps();

            $table->unique(['master_ujian_id', 'nomor']);
            $table->index(['master_ujian_id', 'is_aktif']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('soal_ujian');
    }
};
