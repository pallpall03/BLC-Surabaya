<?php

namespace App\Modules\Auth\Exceptions;

use Illuminate\Auth\AuthenticationException;

class LoginAuthenticationException extends AuthenticationException
{
    public function __construct(
        string $message = '',
        public readonly bool $captchaRequired = false,
        public readonly ?string $captchaKey = null,
        public readonly ?string $captchaQuestion = null
    ) {
        parent::__construct($message, [], null, []);
    }
}