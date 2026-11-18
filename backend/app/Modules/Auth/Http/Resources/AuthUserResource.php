<?php

namespace App\Modules\Auth\Http\Resources;

use App\Modules\Admin\System\Pengguna\Infrastructure\PenggunaModel;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin PenggunaModel
 */
final class AuthUserResource extends JsonResource
{
    public static $wrap = null;

    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->nama_lengkap,
            'email' => $this->email,
            'role' => $this->levelPengguna ? [
                'slug' => $this->levelPengguna->slug,
                'name' => $this->levelPengguna->nama,
            ] : null,
        ];
    }
}
