<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('foto_slider', function (Blueprint $table) {
            $table->string('file_brosur')->nullable()->change();
            $table->text('ket_brosur')->nullable()->change();
            $table->dateTime('tgl')->nullable()->change();
            $table->string('tipe')->nullable()->change();
            $table->char('status', 1)->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('foto_slider', function (Blueprint $table) {
            $table->string('file_brosur')->nullable(false)->change();
            $table->text('ket_brosur')->nullable(false)->change();
            $table->dateTime('tgl')->nullable(false)->change();
            $table->string('tipe')->nullable(false)->change();
            $table->char('status', 1)->nullable(false)->change();
        });
    }
};
