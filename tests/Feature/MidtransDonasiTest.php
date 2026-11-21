<?php

use App\Mail\DonasiInvoiceMail;
use App\Mail\DonasiPendingMail;
use App\Models\AnakYatim;
use App\Models\Bidang;
use App\Models\Donasi;
use App\Models\TransaksiKeuangan;
use App\Models\User;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\URL;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    Config::set('services.midtrans.server_key', 'SB-Mid-server-TESTKEY123456');
    Config::set('services.midtrans.client_key', 'SB-Mid-client-TESTKEY123456');
    Config::set('services.midtrans.is_production', false);

    $bidangKemanusiaan = Bidang::firstOrCreate(
        ['kode' => Bidang::KEMANUSIAAN],
        ['nama' => 'Bidang Kemanusiaan', 'deskripsi' => 'Fokus kemanusiaan']
    );

    User::firstOrCreate(
        ['email' => 'admin.midtrans@geliyat.or.id'],
        [
            'name' => 'Admin Midtrans',
            'password' => 'secret123',
            'role' => 'admin',
            'bidang_id' => $bidangKemanusiaan->id,
            'is_active' => true,
        ]
    );
});

function generateMidtransSignature(string $orderId, string $statusCode, string $grossAmount, string $serverKey): string
{
    return hash('sha512', $orderId . $statusCode . $grossAmount . $serverKey);
}

test('public donation submission requires valid email, allows null whatsapp, requests Snap Token, and sends pending email once', function () {
    Mail::fake();

    Http::fake([
        'https://app.sandbox.midtrans.com/snap/v1/transactions' => Http::response([
            'token' => 'dummy-snap-token-abc123xyz',
            'redirect_url' => 'https://app.sandbox.midtrans.com/snap/v2/vtweb/dummy-snap-token-abc123xyz',
        ], 201),
    ]);

    // Tolak jika email kosong atau format tidak valid
    $this->postJson(route('donasi.store'), [
        'nama_donatur' => 'Ahmad Tanpa Email',
        'nominal' => 50000,
    ])->assertUnprocessable()
        ->assertJsonValidationErrors(['email']);

    $this->postJson(route('donasi.store'), [
        'nama_donatur' => 'Ahmad Email Salah',
        'email' => 'bukan-email-valid',
        'nominal' => 50000,
    ])->assertUnprocessable()
        ->assertJsonValidationErrors(['email']);

    // Berhasil hanya dengan nama, email valid, dan nominal (tanpa no_whatsapp)
    $response = $this->postJson(route('donasi.store'), [
        'nama_donatur' => 'Ahmad Fauzi',
        'email' => 'ahmad.fauzi@example.com',
        'nominal' => 50000,
        'pesan_doa' => 'Semoga berkah untuk adik-adik binaan.',
    ]);

    $response->assertOk()
        ->assertJson([
            'status' => 'success',
            'snap_token' => 'dummy-snap-token-abc123xyz',
            'nominal' => 50000,
            'nama_donatur' => 'Ahmad Fauzi',
        ])
        ->assertJsonPath('invoice_url', fn (string $url) => str_contains($url, '/donasi/invoice/DON-') && str_contains($url, 'signature='))
        ->assertJsonPath('status_url', fn (string $url) => str_contains($url, '/donasi/status/DON-') && str_contains($url, 'signature='));

    $donasi = Donasi::where('nama_donatur', 'Ahmad Fauzi')->latest('id')->firstOrFail();
    expect($donasi->status_verifikasi)->toBe(Donasi::STATUS_MENUNGGU)
        ->and($donasi->nominal)->toBe(50000)
        ->and($donasi->metode_pembayaran)->toBe(Donasi::METODE_MIDTRANS)
        ->and($donasi->snap_token)->toBe('dummy-snap-token-abc123xyz')
        ->and($donasi->email_donatur)->toBe('ahmad.fauzi@example.com')
        ->and($donasi->no_whatsapp)->toBeNull()
        ->and($donasi->pending_email_sent_at)->not->toBeNull();

    Mail::assertSent(DonasiPendingMail::class, function (DonasiPendingMail $mail) use ($donasi) {
        $html = $mail->render();

        return $mail->hasTo('ahmad.fauzi@example.com')
            && $mail->donasi->is($donasi)
            && str_contains($html, $donasi->kode_donasi)
            && str_contains($html, 'Lanjutkan Pembayaran')
            && str_contains($html, 'signature=');
    });

    // Pastikan belum masuk ke transaksi buku kas saat berstatus menunggu
    expect(TransaksiKeuangan::where('donasi_id', $donasi->id)->count())->toBe(0);
});

test('midtrans webhook settlement updates donation to verified and creates exactly one financial transaction', function () {
    $donasi = Donasi::create([
        'kode_donasi' => Donasi::generateKodeDonasi(),
        'nama_donatur' => 'Siti Aisyah',
        'no_whatsapp' => '081234567890',
        'jenis_donasi' => Donasi::JENIS_DONASI_UMUM,
        'rekening_tujuan' => Donasi::REKENING_DEFAULT_PUBLIK,
        'nominal' => 100000,
        'metode_pembayaran' => Donasi::METODE_MIDTRANS,
        'status_verifikasi' => Donasi::STATUS_MENUNGGU,
    ]);

    $serverKey = config('services.midtrans.server_key');
    $statusCode = '200';
    $grossAmount = '100000.00';
    $signatureKey = generateMidtransSignature($donasi->kode_donasi, $statusCode, $grossAmount, $serverKey);

    $webhookPayload = [
        'order_id' => $donasi->kode_donasi,
        'status_code' => $statusCode,
        'gross_amount' => $grossAmount,
        'signature_key' => $signatureKey,
        'transaction_status' => 'settlement',
        'payment_type' => 'qris',
        'transaction_id' => 'midtrans-trx-uuid-001',
        'transaction_time' => '2026-11-12 10:00:00',
    ];

    $response = $this->postJson(route('midtrans.webhook'), $webhookPayload);

    $response->assertOk()
        ->assertJson([
            'status' => 'success',
        ]);

    $donasi->refresh();
    expect($donasi->status_verifikasi)->toBe(Donasi::STATUS_TERVERIFIKASI)
        ->and($donasi->midtrans_transaction_status)->toBe('settlement')
        ->and($donasi->midtrans_payment_type)->toBe('qris')
        ->and($donasi->midtrans_transaction_id)->toBe('midtrans-trx-uuid-001')
        ->and($donasi->paid_at)->not->toBeNull();

    // Verifikasi transaksi buku kas otomatis
    $transaksi = TransaksiKeuangan::where('donasi_id', $donasi->id)->first();
    expect($transaksi)->not->toBeNull()
        ->and($transaksi->tipe)->toBe(TransaksiKeuangan::TIPE_PEMASUKAN)
        ->and($transaksi->sumber_dana)->toBe(TransaksiKeuangan::SUMBER_DONASI)
        ->and($transaksi->nominal)->toBe(100000)
        ->and($transaksi->status_transaksi)->toBe(TransaksiKeuangan::STATUS_VALID)
        ->and($transaksi->created_by)->toBeNull();
});

test('midtrans webhook is idempotent against repeated notifications and prevents duplicate financial records and invoice emails', function () {
    Mail::fake();

    $donasi = Donasi::create([
        'kode_donasi' => Donasi::generateKodeDonasi(),
        'nama_donatur' => 'Donatur Replay Test',
        'email_donatur' => 'replay@example.com',
        'jenis_donasi' => Donasi::JENIS_DONASI_UMUM,
        'rekening_tujuan' => Donasi::REKENING_DEFAULT_PUBLIK,
        'nominal' => 25000,
        'metode_pembayaran' => Donasi::METODE_MIDTRANS,
        'status_verifikasi' => Donasi::STATUS_MENUNGGU,
    ]);

    $serverKey = config('services.midtrans.server_key');
    $statusCode = '200';
    $grossAmount = '25000.00';
    $signatureKey = generateMidtransSignature($donasi->kode_donasi, $statusCode, $grossAmount, $serverKey);

    $webhookPayload = [
        'order_id' => $donasi->kode_donasi,
        'status_code' => $statusCode,
        'gross_amount' => $grossAmount,
        'signature_key' => $signatureKey,
        'transaction_status' => 'settlement',
        'payment_type' => 'bank_transfer',
        'transaction_id' => 'midtrans-trx-uuid-002',
    ];

    // Kirim notifikasi pertama kali
    $this->postJson(route('midtrans.webhook'), $webhookPayload)->assertOk();
    expect(TransaksiKeuangan::where('donasi_id', $donasi->id)->count())->toBe(1);
    expect($donasi->fresh()->invoice_sent_at)->not->toBeNull();

    // Kirim notifikasi berulang (duplikat webhook dari Midtrans)
    $this->postJson(route('midtrans.webhook'), $webhookPayload)->assertOk();
    expect(TransaksiKeuangan::where('donasi_id', $donasi->id)->count())->toBe(1);

    // Pastikan email invoice hanya terkirim tepat 1 kali meskipun webhook masuk dua kali
    Mail::assertSent(DonasiInvoiceMail::class, 1);
    Mail::assertSent(DonasiInvoiceMail::class, function (DonasiInvoiceMail $mail) use ($donasi) {
        $html = $mail->render();

        return $mail->hasTo('replay@example.com')
            && str_contains($html, $donasi->kode_donasi)
            && str_contains($html, 'LUNAS / TERVERIFIKASI')
            && str_contains($html, 'signature=');
    });
});

test('midtrans webhook handles pending, expire, cancel, and deny correctly', function () {
    $serverKey = config('services.midtrans.server_key');

    // 1. Pending
    $donasiPending = Donasi::create([
        'kode_donasi' => Donasi::generateKodeDonasi(),
        'nama_donatur' => 'Donatur Pending',
        'no_whatsapp' => '081234567890',
        'jenis_donasi' => Donasi::JENIS_DONASI_UMUM,
        'rekening_tujuan' => Donasi::REKENING_DEFAULT_PUBLIK,
        'nominal' => 15000,
        'status_verifikasi' => Donasi::STATUS_MENUNGGU,
    ]);

    $sigPending = generateMidtransSignature($donasiPending->kode_donasi, '201', '15000.00', $serverKey);
    $this->postJson(route('midtrans.webhook'), [
        'order_id' => $donasiPending->kode_donasi,
        'status_code' => '201',
        'gross_amount' => '15000.00',
        'signature_key' => $sigPending,
        'transaction_status' => 'pending',
        'payment_type' => 'echannel',
    ])->assertOk();

    expect($donasiPending->refresh()->status_verifikasi)->toBe(Donasi::STATUS_MENUNGGU);

    // 2. Expire
    $donasiExpire = Donasi::create([
        'kode_donasi' => Donasi::generateKodeDonasi(),
        'nama_donatur' => 'Donatur Expire',
        'no_whatsapp' => '081234567890',
        'jenis_donasi' => Donasi::JENIS_DONASI_UMUM,
        'rekening_tujuan' => Donasi::REKENING_DEFAULT_PUBLIK,
        'nominal' => 20000,
        'status_verifikasi' => Donasi::STATUS_MENUNGGU,
    ]);

    $sigExpire = generateMidtransSignature($donasiExpire->kode_donasi, '200', '20000.00', $serverKey);
    $this->postJson(route('midtrans.webhook'), [
        'order_id' => $donasiExpire->kode_donasi,
        'status_code' => '200',
        'gross_amount' => '20000.00',
        'signature_key' => $sigExpire,
        'transaction_status' => 'expire',
        'payment_type' => 'bank_transfer',
    ])->assertOk();

    expect($donasiExpire->refresh()->status_verifikasi)->toBe(Donasi::STATUS_DIBATALKAN);

    // 3. Cancel
    $donasiCancel = Donasi::create([
        'kode_donasi' => Donasi::generateKodeDonasi(),
        'nama_donatur' => 'Donatur Cancel',
        'no_whatsapp' => '081234567890',
        'jenis_donasi' => Donasi::JENIS_DONASI_UMUM,
        'rekening_tujuan' => Donasi::REKENING_DEFAULT_PUBLIK,
        'nominal' => 10000,
        'status_verifikasi' => Donasi::STATUS_MENUNGGU,
    ]);

    $sigCancel = generateMidtransSignature($donasiCancel->kode_donasi, '200', '10000.00', $serverKey);
    $this->postJson(route('midtrans.webhook'), [
        'order_id' => $donasiCancel->kode_donasi,
        'status_code' => '200',
        'gross_amount' => '10000.00',
        'signature_key' => $sigCancel,
        'transaction_status' => 'cancel',
        'payment_type' => 'gopay',
    ])->assertOk();

    expect($donasiCancel->refresh()->status_verifikasi)->toBe(Donasi::STATUS_DIBATALKAN);

    // 4. Deny
    $donasiDeny = Donasi::create([
        'kode_donasi' => Donasi::generateKodeDonasi(),
        'nama_donatur' => 'Donatur Deny',
        'no_whatsapp' => '081234567890',
        'jenis_donasi' => Donasi::JENIS_DONASI_UMUM,
        'rekening_tujuan' => Donasi::REKENING_DEFAULT_PUBLIK,
        'nominal' => 5000,
        'status_verifikasi' => Donasi::STATUS_MENUNGGU,
    ]);

    $sigDeny = generateMidtransSignature($donasiDeny->kode_donasi, '202', '5000.00', $serverKey);
    $this->postJson(route('midtrans.webhook'), [
        'order_id' => $donasiDeny->kode_donasi,
        'status_code' => '202',
        'gross_amount' => '5000.00',
        'signature_key' => $sigDeny,
        'transaction_status' => 'deny',
        'payment_type' => 'credit_card',
    ])->assertOk();

    expect($donasiDeny->refresh()->status_verifikasi)->toBe(Donasi::STATUS_DITOLAK);
});

test('midtrans webhook rejects forged signature with 401 unauthorized', function () {
    $donasi = Donasi::create([
        'kode_donasi' => Donasi::generateKodeDonasi(),
        'nama_donatur' => 'Fake Hacker',
        'no_whatsapp' => '081234567890',
        'jenis_donasi' => Donasi::JENIS_DONASI_UMUM,
        'rekening_tujuan' => Donasi::REKENING_DEFAULT_PUBLIK,
        'nominal' => 100000,
        'status_verifikasi' => Donasi::STATUS_MENUNGGU,
    ]);

    $response = $this->postJson(route('midtrans.webhook'), [
        'order_id' => $donasi->kode_donasi,
        'status_code' => '200',
        'gross_amount' => '100000.00',
        'signature_key' => 'invalid-forged-signature-string',
        'transaction_status' => 'settlement',
    ]);

    $response->assertStatus(401);
    expect($donasi->refresh()->status_verifikasi)->toBe(Donasi::STATUS_MENUNGGU);
});

test('midtrans settlement for orang tua asuh activates child sponsorship status', function () {
    $admin = User::where('email', 'admin.midtrans@geliyat.or.id')->firstOrFail();

    $anak = AnakYatim::create([
        'nik' => '3273111122229999',
        'nama_lengkap' => 'Bintang Al-Fatih',
        'alias' => 'Bintang (B.A.)',
        'jenis_kelamin' => 'L',
        'tanggal_lahir' => '2016-01-01',
        'jenjang' => 'SD',
        'kelas' => 'Kelas 3 SD',
        'kelurahan' => 'Cigending',
        'alamat_detail' => 'Jl. Cigending No. 10',
        'nama_wali' => 'Ibu Aminah',
        'status_binaan' => 'aktif',
        'status_asuh' => AnakYatim::STATUS_ASUH_BELUM,
        'created_by' => $admin->id,
    ]);

    $donasi = Donasi::create([
        'kode_donasi' => Donasi::generateKodeDonasi(),
        'nama_donatur' => 'Orang Tua Asuh Dermawan',
        'no_whatsapp' => '081234567890',
        'jenis_donasi' => Donasi::JENIS_ORANG_TUA_ASUH,
        'anak_yatim_id' => $anak->id,
        'rekening_tujuan' => Donasi::REKENING_DEFAULT_PUBLIK,
        'nominal' => 100000,
        'metode_pembayaran' => Donasi::METODE_MIDTRANS,
        'status_verifikasi' => Donasi::STATUS_MENUNGGU,
    ]);

    $serverKey = config('services.midtrans.server_key');
    $statusCode = '200';
    $grossAmount = '100000.00';
    $signatureKey = generateMidtransSignature($donasi->kode_donasi, $statusCode, $grossAmount, $serverKey);

    $this->postJson(route('midtrans.webhook'), [
        'order_id' => $donasi->kode_donasi,
        'status_code' => $statusCode,
        'gross_amount' => $grossAmount,
        'signature_key' => $signatureKey,
        'transaction_status' => 'settlement',
        'payment_type' => 'bca_va',
        'transaction_id' => 'midtrans-trx-ota-001',
    ])->assertOk();

    expect($donasi->refresh()->status_verifikasi)->toBe(Donasi::STATUS_TERVERIFIKASI);
    expect($anak->refresh()->status_asuh)->toBe(AnakYatim::STATUS_ASUH_AKTIF);
});

test('public donation invoice page supports resuming pending payment, masks donor email, hides expired or settled snap tokens, and returns 404 for unknown codes', function () {
    Http::fake([
        'https://api.sandbox.midtrans.com/v2/*' => Http::response([
            'status_code' => '404',
            'status_message' => "Transaction doesn't exist.",
        ], 200),
    ]);

    // 1. Transaksi menunggu & belum kedaluwarsa -> boleh lanjut bayar, email disamarkan
    $pending = Donasi::create([
        'kode_donasi' => Donasi::generateKodeDonasi(),
        'nama_donatur' => 'Ahmad Fauzi',
        'email_donatur' => 'ahmad.fauzi@example.com',
        'no_whatsapp' => '081234567890',
        'jenis_donasi' => Donasi::JENIS_DONASI_UMUM,
        'rekening_tujuan' => Donasi::REKENING_DEFAULT_PUBLIK,
        'nominal' => 50000,
        'metode_pembayaran' => Donasi::METODE_MIDTRANS,
        'snap_token' => 'snap-token-pending-001',
        'snap_redirect_url' => 'https://app.sandbox.midtrans.com/snap/v2/vtweb/snap-token-pending-001',
        'payment_expires_at' => now()->addHours(12),
        'status_verifikasi' => Donasi::STATUS_MENUNGGU,
    ]);

    // 0. Akses tanpa signature / signature palsu ke halaman invoice maupun status ditolak (403 Forbidden)
    $this->get(route('donasi.invoice', $pending->kode_donasi))->assertForbidden();
    $this->get(route('donasi.invoice', $pending->kode_donasi).'?signature=forged')->assertForbidden();
    $this->getJson(route('donasi.status', $pending->kode_donasi))->assertForbidden();

    // 1. Transaksi menunggu & belum kedaluwarsa dengan Signed URL -> boleh lanjut bayar, email disamarkan
    $pendingResponse = $this->get(URL::signedRoute('donasi.invoice', ['kode' => $pending->kode_donasi]));
    $pendingResponse->assertOk()
        ->assertInertia(
            fn (Assert $page) => $page
                ->component('public/donasi-invoice')
                ->where('donasi.kode_donasi', $pending->kode_donasi)
                ->where('donasi.email_masked', 'ah***@example.com')
                ->where('donasi.can_resume', true)
                ->where('donasi.snap_token', 'snap-token-pending-001')
                ->where('donasi.is_expired', false)
                ->where('donasi.status_url', fn (string $url) => str_contains($url, 'signature='))
                ->missing('donasi.email_donatur')
                ->missing('donasi.no_whatsapp')
        );

    expect($pendingResponse->getContent())
        ->not->toContain('ahmad.fauzi@example.com')
        ->not->toContain('081234567890');

    // 2. Transaksi sudah terverifikasi -> status lunas & snap_token disembunyikan
    $verified = Donasi::create([
        'kode_donasi' => Donasi::generateKodeDonasi(),
        'nama_donatur' => 'Siti Aminah',
        'email_donatur' => 'siti.aminah@example.com',
        'jenis_donasi' => Donasi::JENIS_DONASI_UMUM,
        'rekening_tujuan' => Donasi::REKENING_DEFAULT_PUBLIK,
        'nominal' => 100000,
        'metode_pembayaran' => Donasi::METODE_MIDTRANS,
        'midtrans_payment_type' => 'qris',
        'snap_token' => 'snap-token-verified-002',
        'paid_at' => now(),
        'verified_at' => now(),
        'status_verifikasi' => Donasi::STATUS_TERVERIFIKASI,
    ]);

    $this->get(URL::signedRoute('donasi.invoice', ['kode' => $verified->kode_donasi]))
        ->assertOk()
        ->assertInertia(
            fn (Assert $page) => $page
                ->component('public/donasi-invoice')
                ->where('donasi.status_verifikasi', Donasi::STATUS_TERVERIFIKASI)
                ->where('donasi.metode_label', 'QRIS')
                ->where('donasi.can_resume', false)
                ->where('donasi.snap_token', null)
        );

    // 3. Transaksi melewati batas waktu -> otomatis dibatalkan & tidak bisa dilanjutkan
    $expired = Donasi::create([
        'kode_donasi' => Donasi::generateKodeDonasi(),
        'nama_donatur' => 'Budi Santoso',
        'email_donatur' => 'budi@example.com',
        'jenis_donasi' => Donasi::JENIS_DONASI_UMUM,
        'rekening_tujuan' => Donasi::REKENING_DEFAULT_PUBLIK,
        'nominal' => 25000,
        'metode_pembayaran' => Donasi::METODE_MIDTRANS,
        'snap_token' => 'snap-token-expired-003',
        'payment_expires_at' => now()->subMinutes(10),
        'status_verifikasi' => Donasi::STATUS_MENUNGGU,
    ]);

    $this->get(URL::signedRoute('donasi.invoice', ['kode' => $expired->kode_donasi]))
        ->assertOk()
        ->assertInertia(
            fn (Assert $page) => $page
                ->component('public/donasi-invoice')
                ->where('donasi.status_verifikasi', Donasi::STATUS_DIBATALKAN)
                ->where('donasi.can_resume', false)
                ->where('donasi.snap_token', null)
        );

    expect($expired->fresh()->status_verifikasi)->toBe(Donasi::STATUS_DIBATALKAN);

    // 4. Kode donasi tidak dikenal dengan Signed URL -> 404
    $this->get(URL::signedRoute('donasi.invoice', ['kode' => 'DON-TIDAK-ADA']))->assertNotFound();
});
