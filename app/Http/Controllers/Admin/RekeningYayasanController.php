<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Rekening\StoreRekeningRequest;
use App\Http\Requests\Rekening\UpdateRekeningRequest;
use App\Models\RekeningYayasan;
use DomainException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class RekeningYayasanController extends Controller
{
    /**
     * Tampilkan halaman pengelolaan master rekening yayasan (khusus Super Admin).
     */
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', RekeningYayasan::class);

        $rekeningList = RekeningYayasan::query()
            ->withCount('donasi')
            ->with('pembuat:id,name')
            ->orderByDesc('is_active')
            ->orderBy('nama_bank')
            ->get();

        $stats = [
            'total' => $rekeningList->count(),
            'aktif' => $rekeningList->where('is_active', true)->count(),
            'nonaktif' => $rekeningList->where('is_active', false)->count(),
            'total_donasi' => $rekeningList->sum('donasi_count'),
        ];

        return Inertia::render('admin/rekening/index', [
            'rekeningList' => $rekeningList,
            'stats' => $stats,
        ]);
    }

    /**
     * Tambahkan rekening bank yayasan baru.
     */
    public function store(StoreRekeningRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $rekening = RekeningYayasan::create([
            'nama_bank' => trim($validated['nama_bank']),
            'nomor_rekening' => trim($validated['nomor_rekening']),
            'atas_nama' => trim($validated['atas_nama']),
            'icon' => ! empty($validated['icon']) ? trim($validated['icon']) : null,
            'is_active' => (bool) ($validated['is_active'] ?? true),
            'catatan' => ! empty($validated['catatan']) ? trim($validated['catatan']) : null,
            'created_by' => $request->user()->id,
        ]);

        return redirect()
            ->route('admin.rekening')
            ->with('success', "Rekening {$rekening->nama_bank} ({$rekening->nomor_rekening}) berhasil ditambahkan.");
    }

    /**
     * Perbarui informasi rekening bank yayasan.
     */
    public function update(UpdateRekeningRequest $request, RekeningYayasan $rekening): RedirectResponse
    {
        $validated = $request->validated();

        $rekening->update([
            'nama_bank' => trim($validated['nama_bank']),
            'nomor_rekening' => trim($validated['nomor_rekening']),
            'atas_nama' => trim($validated['atas_nama']),
            'icon' => ! empty($validated['icon']) ? trim($validated['icon']) : null,
            'is_active' => isset($validated['is_active']) ? (bool) $validated['is_active'] : $rekening->is_active,
            'catatan' => ! empty($validated['catatan']) ? trim($validated['catatan']) : null,
        ]);

        return redirect()
            ->route('admin.rekening')
            ->with('success', "Data rekening {$rekening->nama_bank} ({$rekening->nomor_rekening}) berhasil diperbarui.");
    }

    /**
     * Aktifkan atau nonaktifkan status rekening yayasan.
     */
    public function toggleActive(Request $request, RekeningYayasan $rekening): RedirectResponse
    {
        Gate::authorize('toggleActive', $rekening);

        $rekening->update([
            'is_active' => ! $rekening->is_active,
        ]);

        $statusLabel = $rekening->is_active ? 'diaktifkan' : 'dinonaktifkan';

        return redirect()
            ->route('admin.rekening')
            ->with('success', "Rekening {$rekening->nama_bank} ({$rekening->nomor_rekening}) berhasil {$statusLabel}.");
    }

    /**
     * Hapus rekening yayasan secara permanen (hanya jika belum pernah digunakan).
     */
    public function destroy(Request $request, RekeningYayasan $rekening): RedirectResponse
    {
        Gate::authorize('delete', $rekening);

        if (! $rekening->bisaDihapus()) {
            return redirect()
                ->route('admin.rekening')
                ->with('error', 'Rekening ini sudah pernah digunakan dalam transaksi donasi dan tidak boleh dihapus. Silakan nonaktifkan status rekening.');
        }

        try {
            $bank = $rekening->nama_bank;
            $nomor = $rekening->nomor_rekening;
            $rekening->delete();

            return redirect()
                ->route('admin.rekening')
                ->with('success', "Rekening {$bank} ({$nomor}) berhasil dihapus.");
        } catch (DomainException $e) {
            return redirect()
                ->route('admin.rekening')
                ->with('error', $e->getMessage());
        }
    }
}

