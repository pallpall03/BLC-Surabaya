<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('lokasi_blc', function (Blueprint $table) {
            $table->integer('jumlah_slot_computer')->nullable();
            $table->string('jadwal_blc')->nullable();
           
            $table->string('wilayah_surabaya')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('lokasi_blc', function (Blueprint $table) {
            $table->dropColumn('jumlah_slot_computer');
            $table->dropColumn('jadwal_blc');
            $table->dropColumn('wilayah_surabaya');
        });
    }
};