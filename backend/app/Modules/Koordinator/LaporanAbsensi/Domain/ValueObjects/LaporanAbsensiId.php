<?php

namespace App\Modules\Koordinator\LaporanAbsensi\Domain\ValueObjects;

class LaporanAbsensiId
{
    private string $value;

    public function __construct(string $value = '')
    {
        $this->value = $value ?: (string) \Illuminate\Support\Str::uuid();
    }

    public function value(): string { return $this->value; }
    public function __toString(): string { return $this->value; }
    public function equals(self $other): bool { return $this->value === $other->value; }
}