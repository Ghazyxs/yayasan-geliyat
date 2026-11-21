<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Keuangan\StoreTransaksiRequest;
use App\Models\TransaksiKeuangan;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class TransaksiKeuanganController extends Controller
{
    /**
     * Tampilkan halaman pengelolaan keuangan dan riwayat transaksi yayasan (khusus Super Admin).
     */
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', TransaksiKeuangan::class);

        $search = trim((string) $request->input('search', ''));
        $tipe = (string) $request->input('tipe', '');
        $sumberDana = (string) $request->input('sumber_dana', '');
        $tanggal = (string) $request->input('tanggal', '');
        $tanggalDari = (string) $request->input('tanggal_dari', '');
        $tanggalSampai = (string) $request->input('tanggal_sampai', '');

        $ringkasan = TransaksiKeuangan::ringkasanKeuangan();

        $totalPemasukan = (int) TransaksiKeuangan::query()->valid()->pemasukan()->sum('nominal');
        $totalPengeluaran = (int) TransaksiKeuangan::query()->valid()->pengeluaran()->sum('nominal');

        $stats = [
            'total_pemasukan' => $totalPemasukan,
            'total_pengeluaran' => $totalPengeluaran,
            'saldo_kas' => $totalPemasukan - $totalPengeluaran,
            'jumlah_pemasukan' => TransaksiKeuangan::query()->valid()->pemasukan()->count(),
            'jumlah_pengeluaran' => TransaksiKeuangan::query()->valid()->pengeluaran()->count(),
        ];

        $query = TransaksiKeuangan::query()
            ->with(['pencatat:id,name', 'donasi:id,kode_donasi,nama_donatur']);

        if ($search !== '') {
            $like = "%{$search}%";
            $query->where(function (Builder $q) use ($like) {
                $q->where('kode_transaksi', 'like', $like)
                    ->orWhere('kategori', 'like', $like)
                    ->orWhere('keterangan', 'like', $like)
                    ->orWhereHas('donasi', function (Builder $sub) use ($like) {
                        $sub->where('kode_donasi', 'like', $like)
                            ->orWhere('nama_donatur', 'like', $like);
                    })
                    ->orWhereHas('pencatat', function (Builder $sub) use ($like) {
                        $sub->where('name', 'like', $like);
                    });
            });
        }

        if ($tipe !== '' && in_array($tipe, [TransaksiKeuangan::TIPE_PEMASUKAN, TransaksiKeuangan::TIPE_PENGELUARAN], true)) {
            $query->where('tipe', $tipe);
        }

        if ($sumberDana !== '' && in_array($sumberDana, TransaksiKeuangan::SUMBER_DANA_LIST, true)) {
            $query->where('sumber_dana', $sumberDana);
        }

        if ($tanggal !== '') {
            $query->whereDate('tanggal_transaksi', $tanggal);
        }

        if ($tanggalDari !== '') {
            $query->whereDate('tanggal_transaksi', '>=', $tanggalDari);
        }

        if ($tanggalSampai !== '') {
            $query->whereDate('tanggal_transaksi', '<=', $tanggalSampai);
        }

        $transaksiList = $query
            ->latest('tanggal_transaksi')
            ->latest('id')
            ->paginate(10)
            ->withQueryString()
            ->through(fn (TransaksiKeuangan $item) => $this->formatTransaksiItem($item));

        return Inertia::render('admin/keuangan/index', [
            'ringkasan' => $ringkasan,
            'stats' => $stats,
            'transaksiList' => $transaksiList,
            'filters' => [
                'search' => $search,
                'tipe' => $tipe,
                'sumber_dana' => $sumberDana,
                'tanggal_dari' => $tanggalDari,
                'tanggal_sampai' => $tanggalSampai,
                'tanggal' => $tanggal,
            ],
        ]);
    }

    /**
     * Tampilkan rincian satu transaksi keuangan (JSON).
     */
    public function show(TransaksiKeuangan $transaksi): JsonResponse
    {
        Gate::authorize('view', $transaksi);

        $transaksi->load(['pencatat:id,name', 'donasi:id,kode_donasi,nama_donatur']);

        return response()->json([
            'status' => 'success',
            'data' => $this->formatTransaksiItem($transaksi),
        ]);
    }

    /**
     * Sajikan file bukti nota transaksi secara aman (hanya Super Admin).
     */
    public function buktiNota(TransaksiKeuangan $transaksi): StreamedResponse
    {
        Gate::authorize('view', $transaksi);

        if (
            $transaksi->bukti_nota === null
            || $transaksi->bukti_nota === ''
            || ! Storage::disk('local')->exists($transaksi->bukti_nota)
        ) {
            abort(404, 'Lampiran bukti nota tidak ditemukan.');
        }

        return Storage::disk('local')->response(
            $transaksi->bukti_nota,
            basename($transaksi->bukti_nota),
            [
                'X-Content-Type-Options' => 'nosniff',
                'Cache-Control' => 'private, no-store, no-cache, must-revalidate',
            ]
        );
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
            'donasi_id' => null,
            'status_transaksi' => TransaksiKeuangan::STATUS_VALID,
            'keterangan' => trim($validated['keterangan']),
            'bukti_nota' => $buktiPath,
            'created_by' => $request->user()->id,
        ]);

        return redirect()
            ->back()
            ->with('success', "Transaksi {$transaksi->kode_transaksi} berhasil dicatat.");
    }

    /**
     * Format data transaksi untuk tampilan admin secara aman.
     *
     * @return array<string, mixed>
     */
    private function formatTransaksiItem(TransaksiKeuangan $item): array
    {
        $hasBukti = $item->bukti_nota !== null && $item->bukti_nota !== '';

        return [
            'id' => $item->id,
            'kode_transaksi' => $item->kode_transaksi,
            'tipe' => $item->tipe,
            'sumber_dana' => $item->sumber_dana,
            'sumber_dana_label' => ($item->sumber_dana === TransaksiKeuangan::SUMBER_DONASI || $item->donasi_id !== null)
                ? 'Dana Donasi'
                : 'Dana Operasional',
            'kategori' => $item->kategori,
            'nominal' => (int) $item->nominal,
            'tanggal_transaksi' => $item->tanggal_transaksi?->format('Y-m-d'),
            'tanggal_formatted' => $item->tanggal_transaksi?->format('d M Y') ?? '-',
            'status_transaksi' => $item->status_transaksi,
            'keterangan' => $item->keterangan,
            'has_bukti_nota' => $hasBukti,
            'bukti_nota_url' => $hasBukti ? route('admin.keuangan.bukti', $item->id) : null,
            'bukti_nota_is_pdf' => $hasBukti && str_ends_with(strtolower((string) $item->bukti_nota), '.pdf'),
            'pencatat' => $item->relationLoaded('pencatat') && $item->pencatat ? [
                'id' => $item->pencatat->id,
                'name' => $item->pencatat->name,
            ] : null,
            'donasi' => $item->relationLoaded('donasi') && $item->donasi ? [
                'id' => $item->donasi->id,
                'kode_donasi' => $item->donasi->kode_donasi,
                'nama_donatur' => $item->donasi->nama_donatur,
            ] : null,
            'created_at_formatted' => $item->created_at?->format('d M Y, H:i'),
        ];
    }
}
