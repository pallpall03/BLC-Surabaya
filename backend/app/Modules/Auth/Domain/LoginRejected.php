<?php

namespace App\Modules\Auth\Domain;

use RuntimeException;

/** Login ditolak. Membawa status HTTP dan data tambahan untuk frontend (captcha_required, dst.). */
final class LoginRejected extends RuntimeException
{
    /** @param array<string, mixed> $extra */
    public function __construct(string $message, public readonly int $status, public readonly array $extra = [])
    {
        parent::__construct($message);
    }
}
