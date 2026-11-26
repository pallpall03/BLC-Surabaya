<?php

namespace App\Modules\Instruktur\FotoKegiatan\Http;

use App\Http\Controllers\Controller;
use App\Modules\Instruktur\FotoKegiatan\Contracts\FotoKegiatanRepository;
use App\Shared\Support\PengunjungSupport;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use RuntimeException;
use Throwable;

final class FotoKegiatanController extends Controller
{
    private const FOLDER = 'foto-kegiatan-pengunjung';

    public function __construct(private readonly FotoKegiatanRepository $repository)
    {
    }

    public function opsi(): JsonResponse
    {
        return response()->json(['data' => $this->repository->opsi()]);
    }

    public function index(Request $request): JsonResponse
    {
        $filters = $request->validate([
            'mulai' => ['nullable', 'date'],
            'sampai' => ['nullable', 'date'],
            'lokasi_blc_id' => ['nullable', 'integer'],
            'sesi_id' => ['nullable', 'integer'],
        ]);

        return response()->json(['data' => $this->repository->daftar($filters)]);
    }

    public function store(Request $request): JsonResponse
    {
        $this->rejectDuplicate($request);

        return $this->save($request, null);
    }

    public function show(int $id): JsonResponse
    {
        return response()->json(['data' => $this->repository->temukan($id)]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $existing = $this->repository->temukan($id);
        $this->rejectDuplicate($request, $id);

        return $this->save($request, $existing);
    }

    public function destroy(int $id): JsonResponse
    {
        $oldFoto = $this->safePaths($this->repository->hapus($id));

        // File fisik hanya dihapus setelah status soft-delete berhasil disimpan.
        $this->deleteFiles($oldFoto);

        return response()->json(['message' => 'Deleted']);
    }

    /** @param array<string, mixed>|null $existing */
    private function save(Request $request, ?array $existing): JsonResponse
    {
        $oldFoto = $this->safePaths($existing['foto'] ?? []);

        $validated = $request->validate([
            'tanggal' => ['required', 'date'],
            'sesi_id' => ['required', 'integer', PengunjungSupport::sesiRule($existing['sesi_id'] ?? null)],
            'lokasi_blc_id' => ['required', 'integer', PengunjungSupport::lokasiRule($existing['lokasi_blc_id'] ?? null)],
            'keterangan' => ['required', 'string'],
            'foto' => ['nullable', 'array', 'max:10'],
            'foto.*' => ['required', 'image', 'mimes:jpg,jpeg,png,webp,gif', 'max:5120'],
            'foto_deskripsi' => ['nullable', 'array', 'max:10'],
            'foto_deskripsi.*' => ['nullable', 'string', 'max:500'],
            'foto_tetap' => ['nullable', 'array', 'max:10'],
            'foto_tetap.*' => ['required', 'string', 'max:2048', 'distinct', Rule::in($oldFoto)],
            'foto_deskripsi_tetap' => ['nullable', 'array', 'max:10'],
            'foto_deskripsi_tetap.*' => ['nullable', 'string', 'max:500'],
        ]);

        $retained = array_values($validated['foto_tetap'] ?? []);
        foreach ($retained as $path) {
            if (! $this->isSafePath($path)) {
                throw ValidationException::withMessages([
                    'foto_tetap' => 'Salah satu foto tetap bukan milik laporan ini.',
                ]);
            }
        }

        $newFoto = (array) $request->file('foto', []);
        $retainedDeskripsi = $this->deskripsiSejajar(
            $validated['foto_deskripsi_tetap'] ?? [],
            count($retained),
            'foto_deskripsi_tetap',
        );
        $newDeskripsi = $this->deskripsiSejajar(
            $validated['foto_deskripsi'] ?? [],
            count($newFoto),
            'foto_deskripsi',
        );

        if (count($retained) + count($newFoto) === 0) {
            throw ValidationException::withMessages(['foto' => 'Tambahkan minimal satu foto.']);
        }
        if (count($retained) + count($newFoto) > 10) {
            throw ValidationException::withMessages(['foto' => 'Maksimal 10 foto dalam satu laporan.']);
        }

        $uploaded = [];
        $uploadedDeskripsi = [];
        $foto = [];
        try {
            foreach (array_values($newFoto) as $index => $file) {
                /** @var UploadedFile $file */
                $path = $file->store(self::FOLDER, 'public');
                if ($path === false) {
                    throw new RuntimeException('Foto gagal disimpan.');
                }
                $uploaded[] = $path;
                $uploadedDeskripsi[] = $newDeskripsi[$index];
            }

            $foto = array_merge($retained, $uploaded);

            $saved = $this->repository->simpan(
                $existing['id'] ?? null,
                [
                    'tanggal' => $validated['tanggal'],
                    'sesi_id' => $validated['sesi_id'],
                    'lokasi_blc_id' => $validated['lokasi_blc_id'],
                    'keterangan' => $validated['keterangan'],
                    'foto' => $foto,
                    'foto_deskripsi' => array_merge($retainedDeskripsi, $uploadedDeskripsi),
                    'is_delete' => false,
                ],
                (int) $request->user()->id,
            );
        } catch (Throwable $exception) {
            // Upload baru belum menjadi bagian laporan jika penyimpanan DB gagal.
            $this->deleteFiles($uploaded);
            throw $exception;
        }

        // Foto lama yang diganti hanya dihapus setelah DB berhasil diperbarui.
        $this->deleteFiles(array_diff($oldFoto, $foto));

        return response()->json([
            'data' => $saved,
        ], $existing === null ? 201 : 200);
    }

    /** @param list<string|null> $deskripsi @return list<string> */
    private function deskripsiSejajar(array $deskripsi, int $jumlahFoto, string $kolom): array
    {
        if (count($deskripsi) !== $jumlahFoto) {
            throw ValidationException::withMessages([
                $kolom => 'Jumlah deskripsi harus sesuai dengan jumlah foto.',
            ]);
        }

        return array_map(
            fn ($deskripsiFoto) => trim((string) $deskripsiFoto),
            array_values($deskripsi),
        );
    }

    private function rejectDuplicate(Request $request, ?int $ignoreId = null): void
    {
        $validator = Validator::make($request->all(), [
            'tanggal' => ['required', 'date'],
            'sesi_id' => ['required', 'integer'],
            'lokasi_blc_id' => ['required', 'integer'],
        ]);

        if ($validator->fails()) {
            throw new ValidationException($validator);
        }

        $data = $validator->validated();
        $tanggal = Carbon::parse($data['tanggal'])->toDateString();

        if ($this->repository->sudahAda(
            $tanggal,
            (int) $data['sesi_id'],
            (int) $data['lokasi_blc_id'],
            $ignoreId,
        )) {
            throw ValidationException::withMessages([
                'tanggal' => 'Laporan untuk tanggal, sesi, dan BLC ini sudah ada.',
            ]);
        }
    }

    /** @param mixed $paths @return list<string> */
    private function safePaths(mixed $paths): array
    {
        if (! is_array($paths)) {
            return [];
        }

        $safe = array_filter($paths, fn ($path) => is_string($path) && $this->isSafePath($path));

        return array_values(array_unique($safe));
    }

    private function isSafePath(string $path): bool
    {
        return str_starts_with($path, self::FOLDER.'/')
            && ! str_contains($path, '\\')
            && ! str_contains($path, "\0")
            && ! in_array('..', explode('/', $path), true);
    }

    /** @param list<string> $paths */
    private function deleteFiles(array $paths): void
    {
        $safe = array_values(array_filter($paths, fn (string $path) => $this->isSafePath($path)));
        if ($safe !== []) {
            Storage::disk('public')->delete($safe);
        }
    }
}
