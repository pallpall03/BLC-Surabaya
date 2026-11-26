<?php

namespace App\Modules\Instruktur\Laporan\Http;

use App\Http\Controllers\Controller;
use App\Modules\Instruktur\Laporan\Application\ListLaporan;
use App\Modules\Instruktur\Laporan\Contracts\LaporanRepository;
use App\Modules\Instruktur\Laporan\Domain\Laporan;
use App\Shared\Support\PrivateFileAccess;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use RuntimeException;
use Throwable;

final class LaporanController extends Controller
{
    private const FOLDER = 'laporan-kegiatan-pelatihan';

    public function __construct(private readonly LaporanRepository $repository)
    {
    }

    public function index(Request $request, ListLaporan $useCase): JsonResponse
    {
        $instrukturId = $this->instrukturId($request);
        $filters = $request->validate([
            'mulai' => ['nullable', 'date'],
            'sampai' => ['nullable', 'date', 'after_or_equal:mulai'],
        ]);

        $sekarang = Carbon::now('Asia/Jakarta');
        $mulai = isset($filters['mulai'])
            ? Carbon::parse($filters['mulai'])->toDateString()
            : $sekarang->copy()->startOfMonth()->toDateString();
        $sampai = isset($filters['sampai'])
            ? Carbon::parse($filters['sampai'])->toDateString()
            : $sekarang->copy()->endOfMonth()->toDateString();

        $data = $useCase->handle($instrukturId, $mulai, $sampai);

        return response()->json([
            'data' => array_map(fn (Laporan $laporan) => $this->serialize($laporan), $data),
        ]);
    }

    public function opsi(Request $request): JsonResponse
    {
        return response()->json([
            'data' => $this->repository->opsiKelas($this->instrukturId($request)),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $instrukturId = $this->instrukturId($request);
        $data = $this->simpanFoto($request, $this->validatedData($request, $instrukturId));
        try {
            $laporan = $this->repository->createForInstruktur($instrukturId, $data);
        } catch (Throwable $exception) {
            $this->hapusFile($data['foto_baru']);
            throw $exception;
        }

        return response()->json(['data' => $this->serialize($laporan)], 201);
    }

    public function show(Request $request, int $id): JsonResponse
    {
        $laporan = $this->repository->findForInstruktur($this->instrukturId($request), $id);

        return $laporan === null
            ? $this->laporanTidakDitemukan()
            : response()->json(['data' => $this->serialize($laporan)]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $instrukturId = $this->instrukturId($request);
        $existing = $this->repository->findForInstruktur($instrukturId, $id);
        if ($existing === null) {
            return $this->laporanTidakDitemukan();
        }

        $data = $this->simpanFoto($request, $this->validatedData($request, $instrukturId, $existing), $existing);
        try {
            $laporan = $this->repository->updateForInstruktur($instrukturId, $id, $data);
        } catch (Throwable $exception) {
            $this->hapusFile($data['foto_baru']);
            throw $exception;
        }
        if ($laporan === null) {
            $this->hapusFile($data['foto_baru']);

            return $this->laporanTidakDitemukan();
        }
        $this->hapusFile($data['foto_lama']);

        return response()->json(['data' => $this->serialize($laporan)]);
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $instrukturId = $this->instrukturId($request);
        $existing = $this->repository->findForInstruktur($instrukturId, $id);
        if ($existing === null) {
            return $this->laporanTidakDitemukan();
        }

        $dihapus = $this->repository->deleteForInstruktur($instrukturId, $id);
        if ($dihapus) {
            $this->hapusFile($existing->foto);
        }

        return $dihapus
            ? response()->json(['message' => 'Laporan dihapus.'])
            : $this->laporanTidakDitemukan();
    }

    private function validatedData(Request $request, int $instrukturId, ?Laporan $existing = null): array
    {
        $hariIni = Carbon::now('Asia/Jakarta')->toDateString();
        $fotoLama = $existing?->foto ?? [];

        return $request->validate([
            'tanggal' => ['required', 'date', 'before_or_equal:'.$hariIni],
            'kelas_id' => [
                'nullable',
                'integer',
                Rule::exists('kelas', 'id')
                    ->where('instruktur_id', $instrukturId)
                    ->where('is_delete', false),
            ],
            'aktivitas' => ['required', 'string', 'max:10000'],
            'foto' => ['nullable', 'array', 'max:10'],
            'foto.*' => ['required', 'image', 'mimes:jpg,jpeg,png,webp,gif', 'max:5120'],
            'foto_deskripsi' => ['nullable', 'array', 'max:10'],
            'foto_deskripsi.*' => ['nullable', 'string', 'max:500'],
            'foto_tetap' => ['nullable', 'array'],
            'foto_tetap.*' => ['required', 'string', 'max:2048', Rule::in($fotoLama)],
            'foto_deskripsi_tetap' => ['nullable', 'array'],
            'foto_deskripsi_tetap.*' => ['nullable', 'string', 'max:500'],
        ], [
            'kelas_id.exists' => 'Kelas tidak ditemukan atau bukan milik instruktur ini.',
            'tanggal.before_or_equal' => 'Tanggal kegiatan tidak boleh melewati hari ini.',
            'foto.*.image' => 'Semua lampiran harus berupa gambar.',
            'foto.*.max' => 'Ukuran setiap foto maksimal 5 MB.',
            'foto_deskripsi.*.max' => 'Deskripsi foto maksimal 500 karakter.',
            'foto_deskripsi_tetap.*.max' => 'Deskripsi foto maksimal 500 karakter.',
        ]);
    }

    private function simpanFoto(Request $request, array $data, ?Laporan $existing = null): array
    {
        $fotoLama = $existing?->foto ?? [];
        $deskripsiLama = $existing?->fotoDeskripsi ?? [];
        $retained = array_values(array_unique((array) $request->input('foto_tetap', [])));
        foreach ($retained as $path) {
            if (! is_string($path) || ! in_array($path, $fotoLama, true) || ! $this->pathAman($path)) {
                throw ValidationException::withMessages(['foto_tetap' => 'Salah satu foto tetap bukan milik laporan ini.']);
            }
        }

        $files = array_values((array) $request->file('foto', []));
        $jumlahFoto = count($retained) + count($files);
        if ($jumlahFoto === 0) {
            throw ValidationException::withMessages(['foto' => 'Tambahkan minimal satu foto kegiatan.']);
        }
        if ($jumlahFoto > 10) {
            throw ValidationException::withMessages(['foto' => 'Maksimal 10 foto dalam satu laporan.']);
        }

        $deskripsiRetainedInput = array_values((array) $request->input('foto_deskripsi_tetap', []));
        $deskripsi = [];
        foreach ($retained as $index => $path) {
            $indexLama = array_search($path, $fotoLama, true);
            $deskripsi[] = trim((string) ($deskripsiRetainedInput[$index] ?? $deskripsiLama[$indexLama === false ? 0 : $indexLama] ?? ''));
        }

        $deskripsiBaruInput = array_values((array) $request->input('foto_deskripsi', []));
        $fotoBaru = [];
        try {
            foreach ($files as $index => $file) {
                /** @var UploadedFile $file */
                $path = $file->store(self::FOLDER, 'public');
                if ($path === false) {
                    throw new RuntimeException('Foto gagal disimpan.');
                }
                $fotoBaru[] = $path;
                $deskripsi[] = trim((string) ($deskripsiBaruInput[$index] ?? ''));
            }
        } catch (Throwable $exception) {
            $this->hapusFile($fotoBaru);
            throw $exception;
        }

        $foto = array_merge($retained, $fotoBaru);
        $data['foto'] = $foto;
        $data['foto_deskripsi'] = $deskripsi;
        $data['foto_baru'] = $fotoBaru;
        $data['foto_lama'] = array_values(array_diff($fotoLama, $foto));

        return $data;
    }

    private function serialize(Laporan $laporan): array
    {
        return array_merge($laporan->toArray(), [
            'foto_url' => array_map(fn (string $path) => PrivateFileAccess::url($path), $laporan->foto),
        ]);
    }

    private function pathAman(string $path): bool
    {
        return str_starts_with($path, self::FOLDER.'/')
            && ! str_contains($path, '\\')
            && ! str_contains($path, "\0")
            && ! in_array('..', explode('/', $path), true);
    }

    /** @param list<string> $paths */
    private function hapusFile(array $paths): void
    {
        $safe = array_values(array_filter($paths, fn (string $path) => $this->pathAman($path)));
        if ($safe !== []) {
            Storage::disk('public')->delete($safe);
        }
    }

    private function instrukturId(Request $request): int
    {
        $userId = $request->user()?->getAuthIdentifier();
        $instrukturId = $userId === null
            ? null
            : $this->repository->resolveInstrukturId((string) $userId);

        if ($instrukturId === null) {
            throw new HttpResponseException(response()->json([
                'message' => 'Akun instruktur ini tidak memiliki data tim BLC aktif dengan role instruktur.',
            ], 403));
        }

        return $instrukturId;
    }

    private function laporanTidakDitemukan(): JsonResponse
    {
        return response()->json(['message' => 'Laporan tidak ditemukan.'], 404);
    }
}
