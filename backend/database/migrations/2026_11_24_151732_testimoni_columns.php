<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('testimoni', function (Blueprint $table) {
            // Pastikan kolom-kolom yang dibutuhkan ada
            // Kolom nama sudah ada dari sebelum
            // Tambah kategori_id jika belum ada
            if (!Schema::hasColumn('testimoni', 'kategori_id')) {
                $table->unsignedBigInteger('kategori_id')->nullable();
                $table->foreign('kategori_id')->references('id')->on('kategori')->onDelete('set null');
            }
            // Kolom lokasi_blc_id jika belum ada
            if (!Schema::hasColumn('testimoni', 'lokasi_blc_id')) {
                $table->unsignedBigInteger('lokasi_blc_id')->nullable();
                $table->foreign('lokasi_blc_id')->references('id')->on('lokasi_blc')->onDelete('set null');
            }
            // Kolom for "isi testimoni" - bisa itu pesan atau materi, pastikan text field ada
            if (!Schema::hasColumn('testimoni', 'isi_testimoni') && !Schema::hasColumn('testimoni', 'pesan')) {
                $table->text('isi_testimoni')->nullable()->after('keperluan');
            }
            // Pastikan status ada dengan enum atau varchar sesuai kebutuhan
            if (!Schema::hasColumn('testimoni', 'status')) {
                $table->enum('status', ['aktif', 'nonaktif'])->default('nonaktif');
            }
            // Ubah/verifikasi created_at dan updated_at
            if (!Schema::hasColumn('testimoni', 'created_at')) {
                $table->timestamp('created_at')->useCurrent();
            }
            if (!Schema::hasColumn('testimoni', 'updated_at')) {
                $table->timestamp('updated_at')->useCurrentOnUpdate();
            }
        });
    }

    public function down(): void
    {
        Schema::table('testimoni', function (Blueprint $table) {
            $table->dropColumn('kategori_id');
            $table->dropColumn('lokasi_blc_id');
            $table->dropColumn('isi_testimoni');
            $table->dropColumn('status');
        });
    }
};