<?php

namespace App\Mail;

use App\Models\Donasi;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\URL;

class DonasiInvoiceMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Donasi $donasi) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Bukti Invoice Donasi {$this->donasi->kode_donasi} - Yayasan Geliyat",
        );
    }

    public function content(): Content
    {
        $waktu = $this->donasi->paid_at ?? $this->donasi->verified_at ?? now();
        $waktuBayar = $waktu->timezone('Asia/Jakarta')->translatedFormat('d M Y, H:i').' WIB';

        return new Content(
            view: 'emails.donasi-invoice',
            with: [
                'donasi' => $this->donasi,
                'invoiceUrl' => URL::signedRoute('donasi.invoice', ['kode' => $this->donasi->kode_donasi]),
                'nominalFormatted' => 'Rp '.number_format((int) $this->donasi->nominal, 0, ',', '.'),
                'waktuBayar' => $waktuBayar,
                'metodeLabel' => $this->donasi->formatPaymentMethodLabel(),
            ],
        );
    }
}
