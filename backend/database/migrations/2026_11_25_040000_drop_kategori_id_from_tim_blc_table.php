<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Lepas constraint foreign key kategori_id jika ada
        DB::statement('ALTER TABLE tim_blc DROP CONSTRAINT IF EXISTS tim_blc_kategori_id_foreign');

        // 2. Drop kolom kategori_id
        Schema::table('tim_blc', function (Blueprint $table) {
            if (Schema::hasColumn('tim_blc', 'kategori_id')) {
                $table->dropColumn('kategori_id');
            }
        });
    }

    public function down(): void
    {
        Schema::table('tim_blc', function (Blueprint $table) {
            $table->unsignedBigInteger('kategori_id')->nullable();
            $table->foreign('kategori_id')->references('id')->on('kategori')->nullOnDelete();
        });
    }
};
