<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('foto_kegiatan_pengunjung', function (Blueprint $table) {
            $table->id();
            $table->date('tanggal');
            $table->foreignId('sesi_id')->nullable()->constrained('sesi')->nullOnDelete();
            $table->foreignId('lokasi_blc_id')->nullable()->constrained('lokasi_blc')->nullOnDelete();
            $table->text('keterangan');
            $table->json('foto')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->boolean('is_delete')->default(false);

            $table->index('created_at');
            $table->index('sesi_id');
            $table->index('lokasi_blc_id');
            $table->index('is_delete');
            $table->index(['tanggal', 'sesi_id', 'lokasi_blc_id'], 'foto_kegiatan_pengunjung_laporan_index');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('foto_kegiatan_pengunjung');
    }
};
