<?php

namespace App\Modules\Auth\Application;

use App\Models\User;
use Illuminate\Database\Eloquent\ModelNotFoundException;

/** Admin membuka akun yang terkunci karena salah password dan mengembalikan hitungan salah ke nol. */
final class BukaKunciAkun
{
    /** @throws ModelNotFoundException */
    public function handle(int $userId): User
    {
        $user = User::query()->with('role')->findOrFail($userId);

        $user->forceFill(['failed_login_attempts' => 0, 'locked_at' => null])->save();

        return $user;
    }
}
