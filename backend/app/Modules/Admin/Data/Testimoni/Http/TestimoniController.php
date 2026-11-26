<?php

namespace App\Modules\Admin\Data\Testimoni\Http;

use App\Http\Controllers\Controller;
use App\Modules\Admin\Data\Testimoni\Contracts\TestimoniRepository;
<<<<<<< HEAD
use App\Modules\Admin\Data\Testimoni\Domain\Testimoni;
=======
use App\Modules\Admin\Data\Testimoni\Infrastructure\TestimoniModel;
>>>>>>> 1bfeee7fe687e718303a5d3c1c117410b8748945
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

final class TestimoniController extends Controller
{
    public function __construct(
        private readonly TestimoniRepository $repository
    ) {}

    /** GET /testimoni?status=tampil|pending|ditolak (tanpa status = semua, untuk admin). */
    public function index(Request $request): JsonResponse
    {
        $this->normalisasiStatus($request);
        $filter = $request->validate([
            'status' => ['nullable', Rule::in(TestimoniModel::STATUS)],
        ]);

<<<<<<< HEAD
    public function aktif(): JsonResponse
    {
        $testimoni = $this->repository->getAktif();
        return response()->json(['data' => array_map(fn (Testimoni $item) => $this->publik($item), $testimoni)]);
=======
        $data = !empty($filter['status'])
            ? $this->repository->getByStatus($filter['status'])
            : $this->repository->all();

        return response()->json(['data' => $data]);
>>>>>>> 1bfeee7fe687e718303a5d3c1c117410b8748945
    }

    public function store(Request $request): JsonResponse
    {
        $this->normalisasiStatus($request);
        $validated = $request->validate($this->rules(partial: false));

        // Kiriman baru selalu menunggu moderasi kalau status tidak dikirim.
        $validated['status'] = $validated['status'] ?? TestimoniModel::PENDING;

        $testimoni = $this->repository->create($validated);
        return response()->json(['data' => $testimoni], 201);
    }

    public function show(int $id): JsonResponse
    {
        $testimoni = $this->repository->find($id);
        if (!$testimoni) {
            return response()->json(['message' => 'Testimoni not found'], 404);
        }
        return response()->json(['data' => $this->publik($testimoni)]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        if (!$this->repository->find($id)) {
            return response()->json(['message' => 'Testimoni not found'], 404);
        }

        $this->normalisasiStatus($request);
        $validated = $request->validate($this->rules(partial: true));

        // Jangan menimpa status lama dengan null kalau frontend tidak mengirimnya.
        if (array_key_exists('status', $validated) && $validated['status'] === null) {
            unset($validated['status']);
        }

        $testimoni = $this->repository->update($id, $validated);
        return response()->json(['data' => $testimoni]);
    }

    public function destroy(int $id): JsonResponse
    {
        if (!$this->repository->find($id)) {
            return response()->json(['message' => 'Testimoni not found'], 404);
        }

        $this->repository->delete($id);
        return response()->json(['message' => 'Deleted']);
    }

    /** @return array<string, mixed> */
<<<<<<< HEAD
    private function publik(Testimoni $testimoni): array
    {
        return [
            'id' => $testimoni->id,
            'nama' => $testimoni->nama,
            'lokasiBlcId' => $testimoni->lokasiBlcId,
            'isSurabaya' => $testimoni->isSurabaya,
        ];
    }
}
=======
    private function rules(bool $partial): array
    {
        $kadang = $partial ? ['sometimes'] : [];

        return [
            'nama' => [...$kadang, 'required', 'string', 'max:255'],
            'isi_testimoni' => [...$kadang, 'required', 'string'],
            'phone' => ['nullable', 'string', 'max:50'],
            'email' => ['nullable', 'email', 'max:255'],
            'rating' => ['nullable', 'integer', 'between:1,5'],
            'kategori_id' => ['nullable', 'integer', 'exists:kategori,id'],
            'lokasi_blc_id' => ['nullable', 'integer', 'exists:lokasi_blc,id'],
            'status' => ['nullable', Rule::in(TestimoniModel::STATUS)],
        ];
    }

    /** Terima istilah lama (aktif/nonaktif) dan petakan ke pending/tampil/ditolak. */
    private function normalisasiStatus(Request $request): void
    {
        $peta = ['aktif' => TestimoniModel::TAMPIL, 'nonaktif' => TestimoniModel::PENDING];
        $status = $request->input('status');

        if (is_string($status) && isset($peta[$status])) {
            $request->merge(['status' => $peta[$status]]);
        }
    }
}
>>>>>>> 1bfeee7fe687e718303a5d3c1c117410b8748945
