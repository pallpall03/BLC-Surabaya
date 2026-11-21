<?php

namespace Tests\Feature;

use App\Models\Role;
use App\Models\User;
use App\Modules\Admin\Data\LokasiBlc\Infrastructure\LokasiBlcModel;
use App\Modules\Instruktur\DaftarPeserta\Infrastructure\KategoriPesertaModel;
use App\Modules\Instruktur\DaftarPeserta\Infrastructure\PesertaModel;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DaftarPesertaTest extends TestCase
{
    use RefreshDatabase;

    private const URL = '/api/v1/instruktur/daftar-peserta';

    private User $instruktur;

    private LokasiBlcModel $blcA;

    private LokasiBlcModel $blcB;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RoleSeeder::class);

        $this->instruktur = $this->buatUser('instruktur');
        $this->actingAs($this->instruktur, 'api');

        $this->blcA = LokasiBlcModel::create(['nama_blc' => 'Gunung Anyar']);
        $this->blcB = LokasiBlcModel::create(['nama_blc' => 'Bendul Merisi']);
    }

    private function buatUser(string $roleSlug): User
    {
        return User::factory()->create([
            'email' => $roleSlug.'@blc.test',
            'role_id' => Role::where('slug', $roleSlug)->value('id'),
        ]);
    }

    private function buatPeserta(array $override = []): PesertaModel
    {
        static $urut = 0;
        $urut++;

        return PesertaModel::create(array_merge([
            'nik' => str_pad((string) $urut, 16, '0', STR_PAD_LEFT),
            'nama' => 'Peserta '.$urut,
            'jk' => 'L',
            'lokasi_blc_id' => $this->blcA->id,
        ], $override));
    }

    private function dataValid(array $override = []): array
    {
        return array_merge([
            'nik' => '3578010101010001',
            'nama' => 'Budi Santoso',
            'jk' => 'L',
            'tanggal_lahir' => '1990-05-17',
            'telepon' => '081234567890',
            'alamat' => 'Jl. Mawar No. 1',
            'lokasi_blc_id' => $this->blcA->id,
        ], $override);
    }

    // ---- akses ----

    public function test_tanpa_login_ditolak_401(): void
    {
        $this->app['auth']->forgetGuards();
        $this->getJson(self::URL)->assertUnauthorized();
    }

    public function test_peserta_dan_koordinator_ditolak_403(): void
    {
        foreach (['peserta', 'koordinator'] as $role) {
            $this->actingAs($this->buatUser($role), 'api');
            $this->getJson(self::URL)->assertForbidden();
            $this->postJson(self::URL, $this->dataValid())->assertForbidden();
        }
    }

    // ---- daftar ----

    public function test_index_mengembalikan_data_meta_dan_statistik(): void
    {
        $this->buatPeserta(['nama' => 'Ani']);
        $this->buatPeserta(['nama' => 'Budi', 'lokasi_blc_id' => $this->blcB->id]);

        $this->getJson(self::URL)
            ->assertOk()
            ->assertJsonCount(2, 'data')
            ->assertJsonPath('data.0.nama', 'Ani')
            ->assertJsonPath('data.0.blc', 'Gunung Anyar')
            ->assertJsonPath('meta.total', 2)
            ->assertJsonPath('statistik', ['semua' => 2, 'tervalidasi' => 0, 'belum' => 2]);
    }

    public function test_index_filter_cari_blc_dan_status(): void
    {
        $this->buatPeserta(['nama' => 'Ahmad Dani', 'nik' => '1111111111111111']);
        $valid = $this->buatPeserta(['nama' => 'Budi', 'lokasi_blc_id' => $this->blcB->id]);
        $this->patchJson(self::URL.'/'.$valid->id.'/validasi')->assertOk();

        // cari nama (tidak peka huruf besar/kecil)
        $this->getJson(self::URL.'?q=AHMAD')->assertJsonCount(1, 'data')->assertJsonPath('data.0.nama', 'Ahmad Dani');
        // cari NIK
        $this->getJson(self::URL.'?q=1111111')->assertJsonCount(1, 'data');
        // filter BLC
        $this->getJson(self::URL.'?lokasi_blc_id='.$this->blcB->id)->assertJsonCount(1, 'data')->assertJsonPath('data.0.nama', 'Budi');
        // filter status; statistik tetap menampilkan seluruh pembagian
        $this->getJson(self::URL.'?status=valid')
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('statistik', ['semua' => 2, 'tervalidasi' => 1, 'belum' => 1]);
        $this->getJson(self::URL.'?status=non')->assertJsonCount(1, 'data')->assertJsonPath('data.0.nama', 'Ahmad Dani');
    }

    public function test_index_paginasi(): void
    {
        foreach (range(1, 12) as $i) {
            $this->buatPeserta(['nama' => sprintf('Peserta %02d', $i)]);
        }

        $this->getJson(self::URL.'?per_page=5&page=3')
            ->assertOk()
            ->assertJsonCount(2, 'data')
            ->assertJsonPath('meta', ['page' => 3, 'per_page' => 5, 'total' => 12, 'last_page' => 3]);
    }

    public function test_index_menolak_parameter_tidak_valid(): void
    {
        $this->getJson(self::URL.'?status=aneh')->assertUnprocessable()->assertJsonValidationErrors('status');
        $this->getJson(self::URL.'?per_page=1000')->assertUnprocessable()->assertJsonValidationErrors('per_page');
    }

    // ---- opsi ----

    public function test_opsi_hanya_blc_dan_kategori_aktif(): void
    {
        LokasiBlcModel::create(['nama_blc' => 'BLC Nonaktif', 'aktif' => false]);
        LokasiBlcModel::create(['nama_blc' => 'BLC Terhapus', 'is_delete' => true]);
        KategoriPesertaModel::create(['nama' => 'Umum']);
        KategoriPesertaModel::create(['nama' => 'Nonaktif', 'is_aktif' => false]);

        $res = $this->getJson(self::URL.'/opsi')->assertOk();

        $this->assertSame(['Bendul Merisi', 'Gunung Anyar'], array_column($res->json('data.lokasi_blc'), 'nama'));
        $this->assertSame(['Umum'], array_column($res->json('data.kategori_peserta'), 'nama'));
    }

    // ---- tambah ----

    public function test_store_membuat_peserta_belum_tervalidasi(): void
    {
        $kategori = KategoriPesertaModel::create(['nama' => 'Umum']);

        $this->postJson(self::URL, $this->dataValid(['kategori_peserta_id' => $kategori->id]))
            ->assertCreated()
            ->assertJsonPath('data.nama', 'Budi Santoso')
            ->assertJsonPath('data.blc', 'Gunung Anyar')
            ->assertJsonPath('data.kategori', 'Umum')
            ->assertJsonPath('data.tanggal_lahir', '1990-05-17')
            ->assertJsonPath('data.tervalidasi', false);

        $this->assertDatabaseHas('peserta', ['nik' => '3578010101010001', 'tervalidasi' => false]);
    }

    public function test_store_mengabaikan_upaya_menyetel_status_validasi(): void
    {
        $this->postJson(self::URL, $this->dataValid(['tervalidasi' => true, 'divalidasi_oleh' => $this->instruktur->id]))
            ->assertCreated()
            ->assertJsonPath('data.tervalidasi', false)
            ->assertJsonPath('data.tanggal_validasi', null);
    }

    public function test_store_validasi(): void
    {
        $this->postJson(self::URL, [])->assertUnprocessable()
            ->assertJsonValidationErrors(['nik', 'nama', 'jk', 'lokasi_blc_id']);

        $this->postJson(self::URL, $this->dataValid(['nik' => '123']))->assertJsonValidationErrors('nik');
        $this->postJson(self::URL, $this->dataValid(['jk' => 'X']))->assertJsonValidationErrors('jk');
        $this->postJson(self::URL, $this->dataValid(['lokasi_blc_id' => 9999]))->assertJsonValidationErrors('lokasi_blc_id');
        $this->postJson(self::URL, $this->dataValid(['kategori_peserta_id' => 9999]))->assertJsonValidationErrors('kategori_peserta_id');
        $this->postJson(self::URL, $this->dataValid(['telepon' => 'abc']))->assertJsonValidationErrors('telepon');
        $this->postJson(self::URL, $this->dataValid(['tanggal_lahir' => now()->addDay()->toDateString()]))->assertJsonValidationErrors('tanggal_lahir');
    }

    public function test_store_menolak_nik_ganda(): void
    {
        $this->buatPeserta(['nik' => '3578010101010001']);

        $this->postJson(self::URL, $this->dataValid())
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['nik' => 'NIK sudah terdaftar.']);
    }

    // ---- detail ----

    public function test_show_dan_404(): void
    {
        $p = $this->buatPeserta(['nama' => 'Citra']);

        $this->getJson(self::URL.'/'.$p->id)->assertOk()->assertJsonPath('data.nama', 'Citra');
        $this->getJson(self::URL.'/9999')->assertNotFound()->assertJsonPath('message', 'Peserta tidak ditemukan.');
    }

    // ---- ubah ----

    public function test_put_mengubah_data(): void
    {
        $p = $this->buatPeserta(['nik' => '3578010101010001']);

        $this->putJson(self::URL.'/'.$p->id, $this->dataValid(['nama' => 'Nama Baru', 'lokasi_blc_id' => $this->blcB->id]))
            ->assertOk()
            ->assertJsonPath('data.nama', 'Nama Baru')
            ->assertJsonPath('data.blc', 'Bendul Merisi');
    }

    public function test_put_boleh_memakai_nik_miliknya_sendiri_tetapi_bukan_milik_orang_lain(): void
    {
        $a = $this->buatPeserta(['nik' => '1111111111111111']);
        $this->buatPeserta(['nik' => '2222222222222222']);

        $this->putJson(self::URL.'/'.$a->id, $this->dataValid(['nik' => '1111111111111111']))->assertOk();
        $this->putJson(self::URL.'/'.$a->id, $this->dataValid(['nik' => '2222222222222222']))
            ->assertUnprocessable()->assertJsonValidationErrors('nik');
    }

    public function test_patch_hanya_mengubah_field_yang_dikirim(): void
    {
        $p = $this->buatPeserta(['nama' => 'Lama', 'jk' => 'P']);

        $this->patchJson(self::URL.'/'.$p->id, ['nama' => 'Baru'])
            ->assertOk()
            ->assertJsonPath('data.nama', 'Baru')
            ->assertJsonPath('data.jk', 'P');
    }

    public function test_update_tidak_mengubah_status_validasi_dan_404(): void
    {
        $p = $this->buatPeserta();
        $this->patchJson(self::URL.'/'.$p->id.'/validasi')->assertOk();

        $this->patchJson(self::URL.'/'.$p->id, ['nama' => 'Baru', 'tervalidasi' => false])
            ->assertOk()
            ->assertJsonPath('data.tervalidasi', true);

        $this->putJson(self::URL.'/9999', $this->dataValid())->assertNotFound();
    }

    // ---- validasi ----

    public function test_validasi_membalik_status_dan_mencatat_pelaku(): void
    {
        $p = $this->buatPeserta();

        $this->patchJson(self::URL.'/'.$p->id.'/validasi')
            ->assertOk()
            ->assertJsonPath('data.tervalidasi', true)
            ->assertJsonStructure(['data' => ['tanggal_validasi']]);
        $this->assertDatabaseHas('peserta', ['id' => $p->id, 'tervalidasi' => true, 'divalidasi_oleh' => $this->instruktur->id]);

        $this->patchJson(self::URL.'/'.$p->id.'/validasi')
            ->assertOk()
            ->assertJsonPath('data.tervalidasi', false)
            ->assertJsonPath('data.tanggal_validasi', null);
        $this->assertDatabaseHas('peserta', ['id' => $p->id, 'tervalidasi' => false, 'divalidasi_oleh' => null]);
    }

    public function test_validasi_dengan_nilai_eksplisit_bersifat_idempoten(): void
    {
        $p = $this->buatPeserta();

        $this->patchJson(self::URL.'/'.$p->id.'/validasi', ['tervalidasi' => true])->assertJsonPath('data.tervalidasi', true);
        $this->patchJson(self::URL.'/'.$p->id.'/validasi', ['tervalidasi' => true])->assertJsonPath('data.tervalidasi', true);
        $this->patchJson(self::URL.'/'.$p->id.'/validasi', ['tervalidasi' => 'bukan-boolean'])->assertUnprocessable();
        $this->patchJson(self::URL.'/9999/validasi')->assertNotFound();
    }

    // ---- hapus ----

    public function test_destroy_soft_delete_dan_nik_bisa_dipakai_ulang(): void
    {
        $p = $this->buatPeserta(['nik' => '3578010101010001']);

        $this->deleteJson(self::URL.'/'.$p->id)->assertOk()->assertJsonPath('message', 'Peserta dihapus.');

        $this->assertSoftDeleted('peserta', ['id' => $p->id]);
        $this->getJson(self::URL.'/'.$p->id)->assertNotFound();
        $this->getJson(self::URL)->assertJsonCount(0, 'data');
        $this->deleteJson(self::URL.'/'.$p->id)->assertNotFound();

        $this->postJson(self::URL, $this->dataValid())->assertCreated();
    }
}
