<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    private array $dropColumns = [
        'nik',
        'tanggal_lahir',
    ];

    public function up(): void
    {
        Schema::table('tim_blc', function (Blueprint $table) {
            $existing = array_filter(
                $this->dropColumns,
                fn ($col) => Schema::hasColumn('tim_blc', $col)
            );
            if (!empty($existing)) {
                $table->dropColumn(array_values($existing));
            }
        });
    }

    public function down(): void
    {
        Schema::table('tim_blc', function (Blueprint $table) {
            $table->string('nik')->nullable();
            $table->date('tanggal_lahir')->nullable();
        });
    }
};
