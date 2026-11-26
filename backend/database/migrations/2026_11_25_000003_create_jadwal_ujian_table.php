<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('jadwal_ujian', function (Blueprint $table) {
            $table->id();
            $table->foreignId('master_ujian_id')->constrained('master_ujian')->cascadeOnDelete();
            $table->foreignId('kelas_id')->constrained('kelas')->cascadeOnDelete();
            $table->dateTime('mulai');
            $table->dateTime('selesai');
            $table->string('token', 6)->unique();
            $table->boolean('is_delete')->default(false);
            $table->timestamps();

            $table->unique(['master_ujian_id', 'kelas_id']);
            $table->index(['kelas_id', 'is_delete']);
            $table->index('mulai');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('jadwal_ujian');
    }
};
