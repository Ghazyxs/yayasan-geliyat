<?php

use App\Models\AnakYatim;
use Database\Seeders\AnakYatimSeeder;
use Database\Seeders\DatabaseSeeder;

beforeEach(function () {
    $this->seed(DatabaseSeeder::class);
    $this->seed(AnakYatimSeeder::class);
});

test('public anak yatim routes are disabled because all child data is strictly private', function () {
    $anak = AnakYatim::firstOrFail();

    $this->get('/anak-yatim')->assertNotFound();
    $this->get("/anak-yatim/{$anak->id}")->assertNotFound();
});

test('homepage never leaks private child identities, nik, no_kk, or home addresses', function () {
    $anak = AnakYatim::firstOrFail();

    $response = $this->get(route('home'))->assertOk();
    $rawContent = $response->getContent();

    expect($rawContent)->not->toContain($anak->nama_lengkap);
    expect($rawContent)->not->toContain('3273011205150001');
    expect($rawContent)->not->toContain('3273010101100001');
    expect($rawContent)->not->toContain('Jl. Cigending Dalam');
});

test('public guest cannot access internal admin child endpoints or private documents', function () {
    $anak = AnakYatim::firstOrFail();

    $this->getJson(route('admin.anak-yatim.show', $anak))->assertUnauthorized();
    $this->getJson(route('admin.anak-yatim.sensitive', $anak))->assertUnauthorized();
    $this->getJson(route('admin.anak-yatim.dokumen', [$anak->id, 'foto']))->assertUnauthorized();
    $this->getJson(route('admin.anak-yatim.dokumen', [$anak->id, 'kk']))->assertUnauthorized();
});
