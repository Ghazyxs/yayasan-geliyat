<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('donasi', function (Blueprint $table) {
            $table->string('no_whatsapp', 30)->nullable()->change();
            $table->timestamp('pending_email_sent_at')->nullable()->after('payment_expires_at');
            $table->timestamp('invoice_sent_at')->nullable()->after('pending_email_sent_at');
        });
    }

    public function down(): void
    {
        Schema::table('donasi', function (Blueprint $table) {
            $table->dropColumn([
                'pending_email_sent_at',
                'invoice_sent_at',
            ]);
        });
    }
};
