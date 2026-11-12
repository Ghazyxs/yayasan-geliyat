<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Donasi;
use App\Services\Midtrans\MidtransService;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class MidtransWebhookController extends Controller
{
    public function __construct(
        protected MidtransService $midtrans
    ) {}

    /**
     * Menangani HTTP Notification webhook dari Midtrans.
     * Memverifikasi SHA512 signature, memperbarui status donasi secara aman & idempoten.
     */
    public function handle(Request $request): JsonResponse
    {
        $payload = $request->all();

        Log::info('Midtrans Webhook Received', [
            'order_id' => $payload['order_id'] ?? null,
            'status' => $payload['transaction_status'] ?? null,
        ]);

        if (! $this->midtrans->verifySignature($payload)) {
            Log::warning('Midtrans Webhook: Invalid Signature', [
                'payload' => $payload,
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Invalid signature key.',
            ], 401);
        }

        $orderId = (string) ($payload['order_id'] ?? '');
        $donasi = Donasi::where('kode_donasi', $orderId)->first();

        if (! $donasi) {
            Log::warning("Midtrans Webhook: Donasi [{$orderId}] not found.");

            return response()->json([
                'status' => 'error',
                'message' => "Donasi with order ID {$orderId} not found.",
            ], 404);
        }

        try {
            Donasi::prosesNotifikasiMidtrans($payload);

            return response()->json([
                'status' => 'success',
                'message' => 'Notification processed successfully.',
            ]);
        } catch (Exception $e) {
            Log::error('Midtrans Webhook Error: '.$e->getMessage(), [
                'order_id' => $orderId,
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Internal server error while processing webhook.',
            ], 500);
        }
    }
}

