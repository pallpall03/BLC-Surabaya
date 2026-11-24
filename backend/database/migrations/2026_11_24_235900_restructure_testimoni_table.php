<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Merombak tabel testimoni:
 * - buang kolom data kunjungan yang tidak relevan untuk testimoni
 * - tambah isi_testimoni dan rating
 * - status jadi pending / tampil / ditolak (default pending)
 * - kategori_id diarahkan ke tabel `kategori` (bukan `kategori_artikel`)
 *
 * Catatan: nama file ini harus LEBIH BARU daripada migration create_kategori_table.
 */
return new class extends Migration {
    /** Kolom yang dibuang dari testimoni */
    private array $dropColumns = [
        'alamat', 'gender', 'keperluan', 'materi_id',
        'is_surabaya', 'tanggal_lahir', 'kecamatan', 'kelurahan',
    ];

    public function up(): void
    {
        // 1. Lepas FK lama (menunjuk ke kategori_artikel) dan check constraint status lama
        DB::statement('ALTER TABLE testimoni DROP CONSTRAINT IF EXISTS testimoni_kategori_id_foreign');
        DB::statement('ALTER TABLE testimoni DROP CONSTRAINT IF EXISTS testimoni_status_check');

        // 2. Buang kolom yang tidak dipakai, tambah kolom baru
        Schema::table('testimoni', function (Blueprint $table) {
            $existing = array_filter(
                $this->dropColumns,
                fn ($col) => Schema::hasColumn('testimoni', $col)
            );
            if ($existing) {
                $table->dropColumn(array_values($existing));
            }

            if (!Schema::hasColumn('testimoni', 'isi_testimoni')) {
                $table->text('isi_testimoni')->nullable();
            }
            if (!Schema::hasColumn('testimoni', 'rating')) {
                $table->unsignedTinyInteger('rating')->nullable();
            }
        });

        // 3. Status: pending / tampil / ditolak
        DB::statement("ALTER TABLE testimoni ALTER COLUMN status TYPE varchar(20)");
        DB::statement("ALTER TABLE testimoni ALTER COLUMN status SET DEFAULT 'pending'");
        DB::statement("UPDATE testimoni SET status = CASE status WHEN 'aktif' THEN 'tampil' ELSE 'pending' END");

        // 4. kategori_id -> tabel kategori (kosongkan id yang tidak ada di kategori agar FK tidak gagal)
        DB::statement('UPDATE testimoni SET kategori_id = NULL WHERE kategori_id IS NOT NULL AND kategori_id NOT IN (SELECT id FROM kategori)');
        Schema::table('testimoni', function (Blueprint $table) {
            $table->foreign('kategori_id')->references('id')->on('kategori')->nullOnDelete();
        });
    }

    public function down(): void
    {
        DB::statement('ALTER TABLE testimoni DROP CONSTRAINT IF EXISTS testimoni_kategori_id_foreign');

        Schema::table('testimoni', function (Blueprint $table) {
            if (Schema::hasColumn('testimoni', 'isi_testimoni')) {
                $table->dropColumn('isi_testimoni');
            }
            if (Schema::hasColumn('testimoni', 'rating')) {
                $table->dropColumn('rating');
            }

            // kembalikan kolom lama (kosong, nullable)
            $table->text('alamat')->nullable();
            $table->string('gender')->nullable();
            $table->string('keperluan')->nullable();
            $table->text('materi_id')->nullable();
            $table->boolean('is_surabaya')->default(false);
            $table->date('tanggal_lahir')->nullable();
            $table->string('kecamatan')->nullable();
            $table->string('kelurahan')->nullable();
        });

        DB::statement("UPDATE testimoni SET status = CASE status WHEN 'tampil' THEN 'aktif' ELSE 'nonaktif' END");
        DB::statement("ALTER TABLE testimoni ALTER COLUMN status SET DEFAULT 'nonaktif'");
        DB::statement("ALTER TABLE testimoni ADD CONSTRAINT testimoni_status_check CHECK (status IN ('aktif', 'nonaktif'))");

        DB::statement('UPDATE testimoni SET kategori_id = NULL WHERE kategori_id IS NOT NULL AND kategori_id NOT IN (SELECT id FROM kategori_artikel)');
        Schema::table('testimoni', function (Blueprint $table) {
            $table->foreign('kategori_id')->references('id')->on('kategori_artikel')->nullOnDelete();
        });
    }
};