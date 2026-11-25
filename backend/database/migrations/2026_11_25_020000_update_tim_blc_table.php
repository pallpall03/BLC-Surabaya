<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    private array $dropColumns = [
        'is_surabaya',
        'alamat',
        'kecamatan',
        'kelurahan',
    ];

    public function up(): void
    {
        // 1. Lepas FK lama (menunjuk ke kategori_artikel)
        DB::statement('ALTER TABLE tim_blc DROP CONSTRAINT IF EXISTS tim_blc_kategori_id_foreign');

        // 2. Buang kolom is_surabaya, alamat, kecamatan, kelurahan
        Schema::table('tim_blc', function (Blueprint $table) {
            $existing = array_filter(
                $this->dropColumns,
                fn ($col) => Schema::hasColumn('tim_blc', $col)
            );
            if (!empty($existing)) {
                $table->dropColumn(array_values($existing));
            }
        });

        // 3. Pastikan foreign key kategori_id mengarah ke tabel kategori
        DB::statement('UPDATE tim_blc SET kategori_id = NULL WHERE kategori_id IS NOT NULL AND kategori_id NOT IN (SELECT id FROM kategori)');
        Schema::table('tim_blc', function (Blueprint $table) {
            $table->foreign('kategori_id')->references('id')->on('kategori')->nullOnDelete();
        });
    }

    public function down(): void
    {
        DB::statement('ALTER TABLE tim_blc DROP CONSTRAINT IF EXISTS tim_blc_kategori_id_foreign');

        Schema::table('tim_blc', function (Blueprint $table) {
            $table->boolean('is_surabaya')->default(true);
            $table->text('alamat')->nullable();
            $table->string('kecamatan')->nullable();
            $table->string('kelurahan')->nullable();

            $table->foreign('kategori_id')->references('id')->on('kategori_artikel')->nullOnDelete();
        });
    }
};
