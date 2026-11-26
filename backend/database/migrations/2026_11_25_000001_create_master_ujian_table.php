<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('master_ujian', function (Blueprint $table) {
            $table->id();
            $table->string('judul');
            $table->string('materi_id', 50)->nullable();
            $table->string('tipe');
            $table->unsignedInteger('durasi_menit');
            $table->unsignedInteger('nilai_minimum')->default(70);
            $table->boolean('acak_soal')->default(false);
            $table->boolean('is_aktif')->default(true);
            $table->boolean('is_delete')->default(false);
            $table->timestamps();

            $table->foreign('materi_id')->references('id')->on('materi')->nullOnDelete();
            $table->index(['materi_id', 'is_delete']);
            $table->index(['tipe', 'is_delete']);
            $table->index('is_aktif');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('master_ujian');
    }
};
