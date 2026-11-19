<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('menu', function (Blueprint $table) {
            $table->id();
            $table->foreignId('parent_id')->nullable()->constrained('menu')->nullOnDelete();
            $table->string('nama');
            $table->string('slug')->unique();
            $table->string('url')->nullable();
            $table->string('ikon')->nullable();
            $table->unsignedInteger('urutan')->default(0);
            $table->boolean('is_aktif')->default(true);
            $table->boolean('is_delete')->default(false);
            $table->timestamps();

            $table->index(['parent_id', 'urutan']);
            $table->index(['is_aktif', 'is_delete']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('menu');
    }
};