<?php

namespace App\Modules\Koordinator\MasterData\Domain\ValueObjects;

final class MasterDataId
{
    private string $id;

    public function __construct(string $id)
    {
        $this->id = $id;
    }

    public function getId(): string { return $this->id; }
}