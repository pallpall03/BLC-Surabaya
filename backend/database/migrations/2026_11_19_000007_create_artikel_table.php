<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('artikel', function (Blueprint $table) {
            $table->id();
            $table->foreignId('kategori_artikel_id')->nullable()->constrained('kategori_artikel')->nullOnDelete();
            $table->string('judul')->nullable();
            $table->text('keterangan')->nullable();          // keterangan (4000 chars)
            $table->string('lokasi')->nullable();            // lokasi
            $table->foreignId('created_by')->nullable()->constrained('pengguna')->nullOnDelete();
            $table->string('sesi_id')->nullable();           // sesi_id
            $table->boolean('is_delete')->default(false);    // is_delete
            $table->timestamps();
        });

        Schema::create('artikel_foto', function (Blueprint $table) {
            $table->id();
            $table->foreignId('artikel_id')->constrained('artikel')->cascadeOnDelete();
            $table->string('foto');                          // foto path
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('artikel_foto');
        Schema::dropIfExists('artikel');
    }
};