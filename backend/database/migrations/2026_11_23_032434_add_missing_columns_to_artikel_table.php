<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('artikel', function (Blueprint $table) {
            $table->string('slug')->nullable()->unique()->after('judul');
            $table->text('konten')->nullable()->after('keterangan');
            $table->string('ringkasan')->nullable()->after('konten');
            $table->string('gambar_utama')->nullable()->after('ringkasan');
            $table->string('penulis')->nullable()->after('gambar_utama');
            $table->date('tanggal_publikasi')->nullable()->after('penulis');
            $table->boolean('is_aktif')->default(true)->after('tanggal_publikasi');
        });
    }

    public function down(): void
    {
        Schema::table('artikel', function (Blueprint $table) {
            $table->dropColumn([
                'slug', 'konten', 'ringkasan', 'gambar_utama', 'penulis', 'tanggal_publikasi', 'is_aktif'
            ]);
        });
    }
};