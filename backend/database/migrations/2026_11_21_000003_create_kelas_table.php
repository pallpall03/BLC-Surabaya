<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Setara tabel lama `kelas`. Kelas berulang tiap minggu (kolom `hari`,
        // misalnya "Senin Rabu") pada slot `sesi`, bukan rentang tanggal.
        // instruktur_id menunjuk ke tim_blc (role instruktur).
        Schema::create('kelas', function (Blueprint $table) {
            $table->id();
            $table->string('nama_kelas');
            $table->string('materi_id', 50)->nullable();
            $table->foreignId('instruktur_id')->nullable()->constrained('tim_blc')->nullOnDelete();
            $table->foreignId('sesi_id')->nullable()->constrained('sesi')->nullOnDelete();
            $table->foreignId('lokasi_blc_id')->nullable()->constrained('lokasi_blc')->nullOnDelete();
            $table->string('hari')->nullable();
            $table->unsignedSmallInteger('status')->default(0);
            $table->boolean('is_delete')->default(false);
            $table->timestamps();

            $table->foreign('materi_id')->references('id')->on('materi')->nullOnDelete();
            $table->index(['instruktur_id', 'is_delete']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kelas');
    }
};
