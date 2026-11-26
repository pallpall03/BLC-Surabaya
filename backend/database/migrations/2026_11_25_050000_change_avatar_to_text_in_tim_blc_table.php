<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (Schema::hasTable('tim_blc') && Schema::hasColumn('tim_blc', 'avatar')) {
            DB::statement('ALTER TABLE tim_blc ALTER COLUMN avatar TYPE text');
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('tim_blc') && Schema::hasColumn('tim_blc', 'avatar')) {
            DB::statement('ALTER TABLE tim_blc ALTER COLUMN avatar TYPE varchar(255)');
        }
    }
};
