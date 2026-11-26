<?php

namespace App\Modules\Instruktur\DaftarPeserta\Infrastructure;

use App\Modules\Admin\Data\LokasiBlc\Infrastructure\LokasiBlcModel;
use App\Modules\Instruktur\DaftarPeserta\Contracts\DaftarPesertaRepository;
use Illuminate\Database\Eloquent\Builder;

/**
 * Implementasi Eloquent untuk Daftar Peserta (Instruktur).
 * Instruktur bersifat global (tidak dibatasi area), jadi tidak ada filter lokasi otomatis.
 */
final class EloquentDaftarPesertaRepository implements DaftarPesertaRepository
{
    private const RELASI = ['lokasiBlc', 'kategoriPeserta'];

    public function all(): array
    {
        return PesertaModel::with(self::RELASI)
            ->orderBy('nama_lengkap')
            ->orderBy('id')
            ->get()
            ->map(fn (PesertaModel $p) => $this->toArray($p))
            ->all();
    }

    public function paginate(array $filter, int $perPage, int $page): array
    {
        $hasil = $this->query($filter, denganStatus: true)
            ->with(self::RELASI)
            ->orderBy('nama_lengkap')
            ->orderBy('id')
            ->paginate($perPage, ['*'], 'page', $page);

        return [
            'data' => collect($hasil->items())->map(fn (PesertaModel $p) => $this->toArray($p))->all(),
            'meta' => [
                'page' => $hasil->currentPage(),
                'per_page' => $hasil->perPage(),
                'total' => $hasil->total(),
                'last_page' => $hasil->lastPage(),
            ],
        ];
    }

    public function statistik(array $filter): array
    {
        $dasar = $this->query($filter, denganStatus: false);

        $semua = (clone $dasar)->count();
        $valid = (clone $dasar)->where('is_validated', true)->count();
        $belum = (clone $dasar)->where('is_validated', false)->count();

        return ['semua' => $semua, 'tervalidasi' => $valid, 'belum' => $belum];
    }

    public function find(int $id): mixed
    {
        $peserta = PesertaModel::with(self::RELASI)->find($id);

        return $peserta ? $this->toArray($peserta) : null;
    }

    public function create(array $data): mixed
    {
        $peserta = new PesertaModel($this->toDatabase($data));
        $peserta->forceFill([
            'is_delete' => false,
            'is_validated' => false,
        ])->save();

        return $this->toArray($peserta->load(self::RELASI));
    }

    public function update(int $id, array $data): mixed
    {
        $peserta = PesertaModel::findOrFail($id);
        $attributes = $this->toDatabase($data);

        if ($attributes !== []) {
            $peserta->update($attributes);
        }

        return $this->toArray($peserta->load(self::RELASI));
    }

    public function delete(int $id): void
    {
        PesertaModel::findOrFail($id)->forceFill(['is_delete' => true])->save();
    }

    public function setValidasi(int $id, bool $valid, ?int $oleh): mixed
    {
        // Skema aktif tidak menyimpan waktu atau pelaku validasi; $oleh dipertahankan
        // agar signature kontrak dan pemanggil yang sudah ada tetap kompatibel.
        $peserta = PesertaModel::findOrFail($id);
        $peserta->forceFill(['is_validated' => $valid])->save();

        return $this->toArray($peserta->load(self::RELASI));
    }

    public function opsi(): array
    {
        return [
            'lokasi_blc' => LokasiBlcModel::aktif()
                ->orderBy('nama_blc')
                ->get(['id', 'nama_blc'])
                ->map(fn ($l) => ['id' => $l->id, 'nama' => $l->nama_blc])
                ->all(),
            'kategori_peserta' => KategoriPesertaModel::where('jenis_kategori', 'Peserta')
                ->where('is_delete', false)
                ->orderBy('urutan')
                ->orderBy('nama_kelompok')
                ->get(['id', 'nama_kelompok'])
                ->map(fn ($k) => ['id' => $k->id, 'nama' => $k->nama_kelompok])
                ->all(),
        ];
    }

    /** @param  array<string, mixed>  $filter */
    private function query(array $filter, bool $denganStatus): Builder
    {
        $query = PesertaModel::query();

        $kata = isset($filter['q']) ? trim((string) $filter['q']) : '';
        if ($kata !== '') {
            $pola = '%'.mb_strtolower($kata).'%';
            $query->where(function (Builder $w) use ($pola): void {
                $w->whereRaw('LOWER(nama_lengkap) LIKE ?', [$pola])->orWhere('nik', 'like', $pola);
            });
        }

        if (! empty($filter['lokasi_blc_id'])) {
            $query->where('lokasi_blc_id', (int) $filter['lokasi_blc_id']);
        }

        if (! empty($filter['kategori_peserta_id'])) {
            $query->where('kategori_id', (int) $filter['kategori_peserta_id']);
        }

        $status = $filter['status'] ?? 'semua';
        if ($denganStatus && in_array($status, ['valid', 'non'], true)) {
            $query->where('is_validated', $status === 'valid');
        }

        return $query;
    }

    /** @return array<string, mixed> */
    private function toArray(PesertaModel $p): array
    {
        return [
            'id' => $p->id,
            'nik' => $p->nik,
            'nama' => $p->nama_lengkap,
            'jk' => $p->gender,
            'tanggal_lahir' => $p->tanggal_lahir?->format('Y-m-d'),
            'telepon' => $p->phone,
            'alamat' => $p->alamat,
            'lokasi_blc_id' => $p->lokasi_blc_id,
            'blc' => $p->lokasiBlc?->nama_blc ?? '-',
            'kategori_peserta_id' => $p->kategori_id,
            'kategori' => $p->kategoriPeserta?->nama_kelompok ?? '-',
            'tervalidasi' => (bool) $p->is_validated,
            'email' => $p->email,
            'kecamatan' => $p->kecamatan,
            'kelurahan' => $p->kelurahan,
            'kecamatan_lain' => $p->kecamatan_lain,
            'kelurahan_lain' => $p->kelurahan_lain,
            'is_surabaya' => (bool) $p->is_surabaya,
        ];
    }

    /**
     * Memetakan field API lama ke kolom peserta aktif. Field status tidak diterima
     * dari form agar validasi hanya dapat diubah melalui endpoint validasi.
     *
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    private function toDatabase(array $data): array
    {
        $pemetaan = [
            'nik' => 'nik',
            'nama' => 'nama_lengkap',
            'jk' => 'gender',
            'tanggal_lahir' => 'tanggal_lahir',
            'telepon' => 'phone',
            'alamat' => 'alamat',
            'lokasi_blc_id' => 'lokasi_blc_id',
            'kategori_peserta_id' => 'kategori_id',
            'email' => 'email',
            'kecamatan' => 'kecamatan',
            'kelurahan' => 'kelurahan',
            'kecamatan_lain' => 'kecamatan_lain',
            'kelurahan_lain' => 'kelurahan_lain',
            'is_surabaya' => 'is_surabaya',
        ];

        $attributes = [];
        foreach ($pemetaan as $api => $kolom) {
            if (array_key_exists($api, $data)) {
                $attributes[$kolom] = $data[$api];
            }
        }

        return $attributes;
    }
}
