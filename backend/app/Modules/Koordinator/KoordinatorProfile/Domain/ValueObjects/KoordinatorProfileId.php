<?php

namespace App\Modules\Koordinator\KoordinatorProfile\Domain\ValueObjects;

final class KoordinatorProfileId
{
    private string $id;

    public function __construct(string $id)
    {
        $this->id = $id;
    }

    public function getId(): string
    {
        return $this->id;
    }
}