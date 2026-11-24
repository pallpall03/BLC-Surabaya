<?php

namespace App\Modules\Admin\Data\Faq\Http;

use App\Http\Controllers\Controller;
use App\Modules\Admin\Data\Faq\Contracts\FaqRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class FaqController extends Controller
{
    public function __construct(
        private readonly FaqRepository $repository
    ) {}

    public function index(): JsonResponse
    {
        $faqs = $this->repository->getAktif();
        return response()->json(['data' => $faqs]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'pertanyaan' => 'required|string|max:255',
            'jawaban' => 'required|string',
            'kategori' => 'nullable|string|max:100',
            'urutan' => 'sometimes|integer|min:0',
            'is_aktif' => 'sometimes|boolean',
        ]);

        $faq = $this->repository->create($validated);
        return response()->json(['data' => $faq], 201);
    }

    public function show(int $id): JsonResponse
    {
        $faq = $this->repository->find($id);
        if (!$faq) {
            return response()->json(['message' => 'FAQ not found'], 404);
        }
        return response()->json(['data' => $faq]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'pertanyaan' => 'sometimes|required|string|max:255',
            'jawaban' => 'sometimes|required|string',
            'kategori' => 'sometimes|string|max:100',
            'urutan' => 'sometimes|integer|min:0',
            'is_aktif' => 'sometimes|boolean',
        ]);

        $faq = $this->repository->update($id, $validated);
        return response()->json(['data' => $faq]);
    }

    public function destroy(int $id): JsonResponse
    {
        $this->repository->delete($id);
        return response()->json(['message' => 'Deleted']);
    }

    public function byKategori(string $kategori): JsonResponse
    {
        $faqs = $this->repository->getByKategori($kategori);
        return response()->json(['data' => $faqs]);
    }
}
