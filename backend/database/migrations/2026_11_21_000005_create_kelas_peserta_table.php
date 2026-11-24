<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Setara tabel lama `kelas_peserta`: peserta yang terdaftar di sebuah kelas.
        Schema::create('kelas_peserta', function (Blueprint $table) {
            $table->id();
            $table->foreignId('kelas_id')->constrained('kelas')->cascadeOnDelete();
            $table->foreignId('peserta_id')->constrained('peserta')->cascadeOnDelete();
            $table->foreignId('instruktur_id')->nullable()->constrained('tim_blc')->nullOnDelete();
            $table->boolean('is_delete')->default(false);
            $table->timestamps();

            $table->index(['kelas_id', 'peserta_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kelas_peserta');
    }
};
