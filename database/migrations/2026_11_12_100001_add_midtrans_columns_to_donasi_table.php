<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Kolom pendukung pembayaran Midtrans Snap pada tabel donasi.
 * Seluruh kolom nullable (additive) sehingga data donasi lama tidak berubah.
 * `kode_donasi` dipakai sebagai `order_id` Midtrans.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('donasi', function (Blueprint $table) {
            // 'midtrans' untuk donasi online; NULL = donasi lama / pencatatan manual.
            $table->string('metode_pembayaran', 20)->nullable()->after('nominal')->index();
            $table->string('email_donatur')->nullable()->after('no_whatsapp');

            $table->string('snap_token')->nullable()->after('metode_pembayaran');
            $table->string('snap_redirect_url', 500)->nullable()->after('snap_token');
            $table->string('midtrans_transaction_id', 100)->nullable()->after('snap_redirect_url')->index();
            $table->string('midtrans_transaction_status', 30)->nullable()->after('midtrans_transaction_id');
            $table->string('midtrans_payment_type', 50)->nullable()->after('midtrans_transaction_status');
            $table->string('midtrans_fraud_status', 30)->nullable()->after('midtrans_payment_type');
            $table->json('midtrans_payload')->nullable()->after('midtrans_fraud_status');
            $table->timestamp('midtrans_notified_at')->nullable()->after('midtrans_payload');
            $table->timestamp('paid_at')->nullable()->after('midtrans_notified_at');
            $table->timestamp('payment_expires_at')->nullable()->after('paid_at');
        });
    }

    public function down(): void
    {
        Schema::table('donasi', function (Blueprint $table) {
            $table->dropIndex(['metode_pembayaran']);
            $table->dropIndex(['midtrans_transaction_id']);
            $table->dropColumn([
                'metode_pembayaran',
                'email_donatur',
                'snap_token',
                'snap_redirect_url',
                'midtrans_transaction_id',
                'midtrans_transaction_status',
                'midtrans_payment_type',
                'midtrans_fraud_status',
                'midtrans_payload',
                'midtrans_notified_at',
                'paid_at',
                'payment_expires_at',
            ]);
        });
    }
};

