<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('menu_akses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('role_id')->constrained('roles')->cascadeOnDelete();
            $table->foreignId('menu_id')->constrained('menu')->cascadeOnDelete();
            $table->boolean('bisa_lihat')->default(false);
            $table->boolean('bisa_tambah')->default(false);
            $table->boolean('bisa_edit')->default(false);
            $table->boolean('bisa_hapus')->default(false);
            $table->timestamps();

            $table->unique(['role_id', 'menu_id']);
            $table->index(['role_id', 'bisa_lihat']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('menu_akses');
    }
};