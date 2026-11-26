<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('laporan_harian', function (Blueprint $table) {
            $table->id();
            $table->foreignId('instruktur_id')->nullable()->constrained('tim_blc')->nullOnDelete();
            $table->date('tanggal');
            $table->foreignId('kelas_id')->nullable()->constrained('kelas')->nullOnDelete();
            $table->text('aktivitas');
            $table->unsignedInteger('hadir')->default(0);
            $table->unsignedInteger('total')->default(0);
            $table->timestamps();

            $table->index(['instruktur_id', 'tanggal']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('laporan_harian');
    }
};
