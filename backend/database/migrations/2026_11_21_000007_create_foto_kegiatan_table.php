<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Setara tabel lama `foto_kegiatan`: foto bukti yang menempel pada baris daftar_hadir.
        Schema::create('foto_kegiatan', function (Blueprint $table) {
            $table->id();
            $table->foreignId('daftar_hadir_id')->constrained('daftar_hadir')->cascadeOnDelete();
            $table->string('foto');
            $table->timestamp('tgl_berkunjung')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->string('caption_1')->nullable();
            $table->string('caption_2')->nullable();
            $table->string('caption_3')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('foto_kegiatan');
    }
};
