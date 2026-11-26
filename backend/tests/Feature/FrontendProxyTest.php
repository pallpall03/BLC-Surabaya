<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class FrontendProxyTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        config()->set('services.frontend.public_url', 'http://frontend.test');
    }

    public function test_url_publik_backend_hanya_dialihkan_ke_next(): void
    {
        $this->get('/')->assertRedirect('http://frontend.test');
        $this->get('/login')->assertRedirect('http://frontend.test/login');
        $this->get('/register')->assertRedirect('http://frontend.test/register');

        Http::assertNothingSent();
    }

    public function test_backend_tidak_menyajikan_html_dashboard(): void
    {
        $this->get('/instruktur')->assertNotFound();
        $this->get('/operator')->assertNotFound();
        $this->get('/administrator')->assertNotFound();

        Http::assertNothingSent();
    }

    public function test_backend_tidak_menyajikan_html_publik(): void
    {
        $this->get('/publik')->assertNotFound();

        Http::assertNothingSent();
    }
}
