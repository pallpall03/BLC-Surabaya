<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('buku_tamu', function (Blueprint $table) {
            $table->string('instansi')->nullable();
            $table->string('telepon')->nullable();
            $table->date('tanggal_kunjungan')->nullable();
            $table->foreignId('lokasi_blc_id')->nullable()->constrained('lokasi_blc')->nullOnDelete();
            $table->foreignId('sesi_id')->nullable()->constrained('sesi')->nullOnDelete();
            $table->string('jenis_kelamin', 1)->nullable();
            $table->date('tanggal_lahir')->nullable();
            $table->text('alamat')->nullable();
            $table->string('kategori', 100)->nullable();
            $table->boolean('is_delete')->default(false);

            $table->index('created_at');
            $table->index('lokasi_blc_id');
            $table->index('sesi_id');
            $table->index('is_delete');
        });
    }

    public function down(): void
    {
        Schema::table('buku_tamu', function (Blueprint $table) {
            $table->dropIndex(['created_at']);
            $table->dropIndex(['is_delete']);
            $table->dropIndex(['lokasi_blc_id']);
            $table->dropIndex(['sesi_id']);
            $table->dropForeign(['lokasi_blc_id']);
            $table->dropForeign(['sesi_id']);
            $table->dropColumn([
                'instansi',
                'telepon',
                'tanggal_kunjungan',
                'lokasi_blc_id',
                'sesi_id',
                'jenis_kelamin',
                'tanggal_lahir',
                'alamat',
                'kategori',
                'is_delete',
            ]);
        });
    }
};
