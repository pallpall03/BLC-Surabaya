<?php

namespace App\Modules\Data\Faq\Application;

use App\Modules\Data\Faq\Contracts\FaqRepository;

/**
 * Kasus pemakaian: ambil daftar Faq.
 * Belum ada aturan bisnis. Dipanggil controller nanti.
 */
final class ListFaq
{
    public function __construct(private readonly FaqRepository $repository)
    {
    }

    public function handle(): array
    {
        return $this->repository->all();
    }
}
