<?php

namespace App\Modules\Instruktur\InstrukturProfile\Domain\ValueObjects;

final class InstrukturProfileId
{
    private string $id;

    public function __construct(string $id)
    {
        $this->id = $id;
    }

    public function getId(): string { return $this->id; }
}