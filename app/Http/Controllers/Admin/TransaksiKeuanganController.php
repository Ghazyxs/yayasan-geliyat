<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Keuangan\StoreTransaksiRequest;
use App\Models\TransaksiKeuangan;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class TransaksiKeuanganController extends Controller
{
    /**
     * Tampilkan buku kas yayasan dengan ringkasan terpisah (khusus Super Admin).
     */
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', TransaksiKeuangan::class);

        $ringkasan = TransaksiKeuangan::ringkasanKeuangan();

        $transaksiList = TransaksiKeuangan::query()
            ->with(['pencatat:id,name', 'donasi:id,kode_donasi,nama_donatur'])
            ->latest('tanggal_transaksi')
            ->latest('id')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('admin/keuangan/index', [
            'ringkasan' => $ringkasan,
            'transaksiList' => $transaksiList,
        ]);
    }

    /**
     * Catat transaksi keuangan manual (pemasukan operasional atau pengeluaran donasi/operasional).
     */
    public function store(StoreTransaksiRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $buktiPath = null;
        if ($request->hasFile('bukti_nota')) {
            $file = $request->file('bukti_nota');
            $ext = strtolower((string) ($file->guessExtension() ?: $file->getClientOriginalExtension()));
            if (! in_array($ext, ['jpg', 'jpeg', 'png', 'webp', 'pdf'], true)) {
                $ext = 'jpg';
            }
            $filename = Str::uuid()->toString().'.'.$ext;
            $buktiPath = $file->storeAs('bukti-nota/'.now()->format('Y/m'), $filename, 'local');
        }

        $tipePrefix = $validated['tipe'] === TransaksiKeuangan::TIPE_PEMASUKAN ? 'IN' : 'OUT';
        do {
            $kodeTransaksi = sprintf('TRX-%s-%s%04d', now()->format('Ymd'), $tipePrefix, rand(1000, 9999));
        } while (TransaksiKeuangan::where('kode_transaksi', $kodeTransaksi)->exists());

        $transaksi = TransaksiKeuangan::create([
            'kode_transaksi' => $kodeTransaksi,
            'tipe' => $validated['tipe'],
            'sumber_dana' => $validated['sumber_dana'],
            'kategori' => trim($validated['kategori']),
            'nominal' => (int) $validated['nominal'],
            'tanggal_transaksi' => $validated['tanggal_transaksi'],
            'donasi_id' => null, // Transaksi manual non-donasi masuk
            'status_transaksi' => TransaksiKeuangan::STATUS_VALID,
            'keterangan' => trim($validated['keterangan']),
            'bukti_nota' => $buktiPath,
            'created_by' => $request->user()->id,
        ]);

        $labelSumber = $transaksi->sumber_dana === TransaksiKeuangan::SUMBER_DONASI
            ? 'Dana Donasi'
            : 'Kas Operasional Yayasan';

        return redirect()
            ->back()
            ->with('success', "Transaksi {$transaksi->kode_transaksi} ({$labelSumber}) berhasil dicatat.");
    }
}

