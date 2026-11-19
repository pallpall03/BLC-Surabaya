<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('konten', function (Blueprint $table) {
            $table->id();
            $table->foreignId('parent_id')->nullable()->constrained('konten')->nullOnDelete();
            $table->string('judul', 255);
            $table->string('slug', 255)->nullable()->unique();
            $table->text('konten')->nullable();
            $table->string('ikon', 50)->nullable();
            $table->unsignedInteger('urutan')->default(0);
            $table->boolean('is_aktif')->default(true);
            $table->boolean('is_delete')->default(false);
            $table->timestamps();

            $table->index(['parent_id', 'is_aktif', 'is_delete']);
            $table->index('slug');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('konten');
    }
};