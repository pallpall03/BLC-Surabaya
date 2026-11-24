<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Setara tabel lama `daftar_hadir`: satu baris per peserta-di-kelas per tanggal,
        // dengan hadir benar/salah (data lama tidak punya izin/sakit/alpa).
        Schema::create('daftar_hadir', function (Blueprint $table) {
            $table->id();
            $table->date('tgl_hadir');
            $table->foreignId('kelas_peserta_id')->constrained('kelas_peserta')->cascadeOnDelete();
            $table->boolean('hadir')->default(false);
            $table->timestamps();

            $table->unique(['kelas_peserta_id', 'tgl_hadir']);
            $table->index('tgl_hadir');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('daftar_hadir');
    }
};
