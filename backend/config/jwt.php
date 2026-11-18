<?php

return [

    /*
    |--------------------------------------------------------------------------
    | JWT Authentication Secret
    |--------------------------------------------------------------------------
    |
    | Don't forget to set this in your .env file, as it will be used to sign
    | your tokens. A helper command is provided for this:
    | php artisan jwt:secret
    |
    | Note: This will be used for symmetric algorithms (HS256, HS384, HS512).
    | If you are using asymmetric algorithms (RS256, RS384, RS512) you need
    | to set the 'keys.private' and 'keys.public' options.
    |
    */

    'secret' => env('JWT_SECRET'),

    /*
    |--------------------------------------------------------------------------
    | JWT time to live
    |--------------------------------------------------------------------------
    |
    | Specify the length of time (in minutes) that the token will be valid for.
    | Defaults to 60 (1 hour). You can also set this to null to yield a never
    | expiring token. Some people may want this behaviour for e.g. a mobile app.
    | This is not recommended for most use cases.
    |
    */

    'ttl' => env('JWT_TTL', 60),

    /*
    |--------------------------------------------------------------------------
    | Refresh time to live
    |--------------------------------------------------------------------------
    |
    | Specify the length of time (in minutes) that the token can be refreshed
    | within. I.E. The user can refresh their token within a 2 week window of
    | the original token being created until they must re-authenticate.
    | Defaults to 20160 (2 weeks). Set to null for infinite refreshes.
    |
    */

    'refresh_ttl' => env('JWT_REFRESH_TTL', 20160),

    /*
    |--------------------------------------------------------------------------
    | JWT hashing algorithm
    |--------------------------------------------------------------------------
    |
    | Specify the hashing algorithm that will be used to sign the token.
    | See here: https://github.com/namshi/jose/tree/master/src/Namshi/JOSE/Signer/OpenSSL
    | for possible values.
    |
    */

    'algo' => env('JWT_ALGO', 'HS256'),

    /*
    |--------------------------------------------------------------------------
    | Required Claims
    |--------------------------------------------------------------------------
    |
    | Specify the required claims that must exist in any token.
    | A TokenInvalidException will be thrown if any of these claims are not
    | present in the payload.
    |
    */

    'required_claims' => [
        'iss',
        'iat',
        'exp',
        'nbf',
        'sub',
        'jti',
    ],

    /*
    |--------------------------------------------------------------------------
    | Persistent Claims
    |--------------------------------------------------------------------------
    |
    | Specify the claim keys to be persisted when refreshing a token.
    | 'sub' and 'jti' will automatically be persisted, in addition to these.
    |
    | Note: If a claim does not exist then it will not be persisted.
    |
    */

    'persistent_claims' => [
        // 'foo',
        // 'bar',
    ],

    /*
    |--------------------------------------------------------------------------
    | Lock subject
    |--------------------------------------------------------------------------
    |
    | This will determine if a PRS (previous refresh token) is subject to
    | a token blacklisting. If a token is refreshed, the previous token
    | will be added to the blacklist to prevent replay attacks.
    |
    */

    'lock_subject' => true,

    /*
    |--------------------------------------------------------------------------
    | Leeway
    |--------------------------------------------------------------------------
    |
    | Specify the leeway in seconds to account for clock skew. Defaults to 0.
    |
    */

    'leeway' => env('JWT_LEEWAY', 0),

    /*
    |--------------------------------------------------------------------------
    | Blacklist Enabled
    |--------------------------------------------------------------------------
    |
    | In order to invalidate tokens, you must have the blacklist enabled.
    | If you do not want this functionality, then set this to false.
    |
    */

    'blacklist_enabled' => env('JWT_BLACKLIST_ENABLED', true),

    /*
    |--------------------------------------------------------------------------
    | Blacklist Grace Period
    |--------------------------------------------------------------------------
    |
    | When multiple concurrent requests are made with the same JWT,
    | it is possible that some of them fail, due to token regeneration
    | on every request. Set grace period in seconds to prevent this.
    |
    */

    'blacklist_grace_period' => env('JWT_BLACKLIST_GRACE_PERIOD', 0),

    /*
    |--------------------------------------------------------------------------
    | Cookies
    |--------------------------------------------------------------------------
    |
    | If you want to use cookies to store the token, you can enable this.
    |
    */

    'cookies' => [
        'enabled' => false,
        'name' => 'token',
        'path' => '/',
        'domain' => env('JWT_COOKIE_DOMAIN', null),
        'secure' => env('JWT_COOKIE_SECURE', false),
        'http_only' => true,
        'same_site' => 'lax',
    ],

    /*
    |--------------------------------------------------------------------------
    | Providers
    |--------------------------------------------------------------------------
    |
    | Specify the various providers used throughout the package.
    |
    */

    'providers' => [

        /*
         * JWT Provider
         |
         * Specify the provider used to create and decode the tokens.
         |
         */
        'jwt' => Tymon\JWTAuth\Providers\JWT\Lcobucci::class,

        /*
         * Authentication Provider
         |
         * Specify the provider used to authenticate users.
         |
         */
        'auth' => Tymon\JWTAuth\Providers\Auth\Illuminate::class,

        /*
         * Storage Provider
         |
         * Specify the provider used to store tokens in the blacklist.
         |
         */
        'storage' => Tymon\JWTAuth\Providers\Storage\Illuminate::class,

    ],

];