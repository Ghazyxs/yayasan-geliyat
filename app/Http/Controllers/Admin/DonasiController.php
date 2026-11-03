<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Donasi\CancelDonasiRequest;
use App\Http\Requests\Donasi\RejectDonasiRequest;
use App\Http\Requests\Donasi\StoreAdminDonasiRequest;
use App\Http\Requests\Donasi\VerifyDonasiRequest;
use App\Models\AnakYatim;
use App\Models\Donasi;
use App\Models\User;
use DomainException;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class DonasiController extends Controller
{
    /**
     * Tampilkan halaman daftar donasi sesuai cakupan bidang pengguna.
     */
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', Donasi::class);

        $user = $request->user();
        $user->loadMissing('bidang');

        $search = trim((string) $request->input('search', ''));
        $statusVerifikasi = (string) $request->input('status_verifikasi', '');
        $jenisDonasi = (string) $request->input('jenis_donasi', '');
        $tanggalDari = (string) $request->input('tanggal_dari', '');
        $tanggalSampai = (string) $request->input('tanggal_sampai', '');
        $tanggal = (string) $request->input('tanggal', '');

        $baseQuery = Donasi::query()->visibleTo($user);

        // Statistik berdasarkan cakupan data yang berhak dilihat user.
        // Total donasi hanya menghitung donasi yang berstatus terverifikasi.
        $stats = [
            'total' => (clone $baseQuery)->count(),
            'menunggu' => (clone $baseQuery)->where('status_verifikasi', Donasi::STATUS_MENUNGGU)->count(),
            'terverifikasi' => (clone $baseQuery)->where('status_verifikasi', Donasi::STATUS_TERVERIFIKASI)->count(),
            'ditolak' => (clone $baseQuery)->where('status_verifikasi', Donasi::STATUS_DITOLAK)->count(),
            'dibatalkan' => (clone $baseQuery)->where('status_verifikasi', Donasi::STATUS_DIBATALKAN)->count(),
            'total_nominal_terverifikasi' => Donasi::totalTerverifikasi($user),
            'nominal_menunggu' => (int) (clone $baseQuery)->where('status_verifikasi', Donasi::STATUS_MENUNGGU)->sum('nominal'),
        ];

        $query = clone $baseQuery;

        if ($search !== '') {
            $like = "%{$search}%";
            $query->where(function (Builder $q) use ($like) {
                $q->where('kode_donasi', 'like', $like)
                    ->orWhere('nama_donatur', 'like', $like)
                    ->orWhere('no_whatsapp', 'like', $like)
                    ->orWhere('rekening_tujuan', 'like', $like)
                    ->orWhere('pesan_doa', 'like', $like)
                    ->orWhere('catatan_verifikasi', 'like', $like)
                    ->orWhereHas('anakYatim', function (Builder $sub) use ($like) {
                        $sub->where('nama_lengkap', 'like', $like)
                            ->orWhere('alias', 'like', $like);
                    });
            });
        }

        if ($statusVerifikasi !== '' && in_array($statusVerifikasi, Donasi::STATUS_LIST, true)) {
            $query->where('status_verifikasi', $statusVerifikasi);
        }

        if ($jenisDonasi !== '' && in_array($jenisDonasi, Donasi::JENIS_DONASI_LIST, true)) {
            $query->where('jenis_donasi', $jenisDonasi);
        }

        if ($tanggal !== '') {
            $query->whereDate('created_at', $tanggal);
        }

        if ($tanggalDari !== '') {
            $query->whereDate('created_at', '>=', $tanggalDari);
        }

        if ($tanggalSampai !== '') {
            $query->whereDate('created_at', '<=', $tanggalSampai);
        }

        $donasi = $query
            ->with([
                'anakYatim:id,nama_lengkap,alias,jenjang,kelas,kelurahan,status_asuh',
                'anakYatim.bidang:id,kode,nama',
                'verifikator:id,name',
                'transaksi:id,donasi_id,kode_transaksi,tipe,kategori,nominal,status_transaksi,tanggal_transaksi,keterangan',
            ])
            ->latest('id')
            ->paginate(10)
            ->withQueryString()
            ->through(fn (Donasi $item) => $this->formatDonasiItem($item, $user));

        $anakYatimList = AnakYatim::query()
            ->visibleTo($user)
            ->where('status_binaan', 'aktif')
            ->orderBy('nama_lengkap')
            ->get(['id', 'nama_lengkap', 'alias', 'jenjang', 'kelas', 'kelurahan', 'status_asuh']);

        return Inertia::render('admin/donasi/index', [
            'donasi' => $donasi,
            'stats' => $stats,
            'filters' => [
                'search' => $search,
                'status_verifikasi' => $statusVerifikasi,
                'jenis_donasi' => $jenisDonasi,
                'tanggal_dari' => $tanggalDari,
                'tanggal_sampai' => $tanggalSampai,
                'tanggal' => $tanggal,
            ],
            'jenisDonasiList' => Donasi::JENIS_DONASI_LIST,
            'rekeningList' => Donasi::REKENING_RESMI,
            'anakYatimList' => $anakYatimList,
            'permissions' => [
                'is_super_admin' => $user->isSuperAdmin(),
                'can_create' => Gate::forUser($user)->allows('create', Donasi::class),
                'user_bidang' => $user->bidang ? [
                    'id' => $user->bidang->id,
                    'kode' => $user->bidang->kode,
                    'nama' => $user->bidang->nama,
                ] : null,
            ],
        ]);
    }

    /**
     * Catat pengajuan donasi baru melalui dashboard admin dengan status menunggu.
     */
    public function store(StoreAdminDonasiRequest $request): RedirectResponse
    {
        Gate::authorize('create', Donasi::class);

        $validated = $request->validated();

        $jenisTargetAnak = [
            Donasi::JENIS_ORANG_TUA_ASUH,
            Donasi::JENIS_SANTUNAN_RUTIN,
            Donasi::JENIS_BIMBEL_SINAR,
        ];

        $anakYatimId = null;
        if (! empty($validated['anak_yatim_id']) && in_array($validated['jenis_donasi'], $jenisTargetAnak, true)) {
            $anak = AnakYatim::query()->findOrFail((int) $validated['anak_yatim_id']);
            Gate::authorize('view', $anak);
            $anakYatimId = $anak->id;
        }

        $file = $request->file('bukti_transfer');
        $ext = strtolower((string) ($file->guessExtension() ?: $file->getClientOriginalExtension()));
        if (! in_array($ext, ['jpg', 'jpeg', 'png', 'webp', 'pdf'], true)) {
            $ext = 'jpg';
        }

        $filename = Str::uuid()->toString().'.'.$ext;
        $buktiPath = $file->storeAs('bukti-transfer/'.now()->format('Y/m'), $filename, 'local');

        $donasi = DB::transaction(function () use ($validated, $anakYatimId, $buktiPath) {
            return Donasi::create([
                'kode_donasi' => Donasi::generateKodeDonasi(),
                'nama_donatur' => trim($validated['nama_donatur']),
                'no_whatsapp' => trim($validated['no_whatsapp']),
                'jenis_donasi' => $validated['jenis_donasi'],
                'anak_yatim_id' => $anakYatimId,
                'rekening_tujuan' => trim($validated['rekening_tujuan']),
                'nominal' => (int) $validated['nominal'],
                'pesan_doa' => ! empty($validated['pesan_doa']) ? trim($validated['pesan_doa']) : null,
                'bukti_transfer' => $buktiPath,
                'status_verifikasi' => Donasi::STATUS_MENUNGGU,
            ]);
        });

        return redirect()
            ->route('admin.donasi')
            ->with('success', "Donasi {$donasi->kode_donasi} berhasil dicatat dengan status menunggu verifikasi.");
    }

    /**
     * Tampilkan detail donasi beserta informasi verifikasi & transaksi terkait.
     */
    public function show(Request $request, Donasi $donasi): JsonResponse
    {
        Gate::authorize('view', $donasi);

        $donasi->load([
            'anakYatim:id,nama_lengkap,alias,jenjang,kelas,kelurahan,status_asuh',
            'anakYatim.bidang:id,kode,nama',
            'verifikator:id,name',
            'transaksi:id,donasi_id,kode_transaksi,tipe,kategori,nominal,status_transaksi,tanggal_transaksi,keterangan',
        ]);

        return response()->json([
            'status' => 'success',
            'data' => $this->formatDonasiItem($donasi, $request->user()),
        ]);
    }

    /**
     * Sajikan file bukti transfer secara aman (hanya pengguna yang lolos otorisasi view donasi).
     */
    public function buktiTransfer(Donasi $donasi): StreamedResponse
    {
        Gate::authorize('view', $donasi);

        if (
            $donasi->bukti_transfer === null
            || $donasi->bukti_transfer === ''
            || ! Storage::disk('local')->exists($donasi->bukti_transfer)
        ) {
            abort(404, 'Bukti transfer tidak ditemukan.');
        }

        return Storage::disk('local')->response(
            $donasi->bukti_transfer,
            basename($donasi->bukti_transfer),
            [
                'X-Content-Type-Options' => 'nosniff',
                'Cache-Control' => 'private, no-store, no-cache, must-revalidate',
            ]
        );
    }

    /**
     * Verifikasi donasi berstatus menunggu dan buat tepat satu transaksi pemasukan kas.
     */
    public function verify(VerifyDonasiRequest $request, Donasi $donasi): RedirectResponse|JsonResponse
    {
        Gate::authorize('verify', $donasi);

        try {
            $verified = Donasi::verifikasi(
                $donasi->id,
                $request->user(),
                $request->validated('catatan_verifikasi')
            );
        } catch (DomainException $e) {
            if ($request->expectsJson()) {
                return response()->json(['message' => $e->getMessage()], 422);
            }

            return back()->with('error', $e->getMessage());
        }

        return redirect()
            ->route('admin.donasi')
            ->with(
                'success',
                "Donasi {$verified->kode_donasi} berhasil diverifikasi dan tercatat sebagai pemasukan kas."
            );
    }

    /**
     * Tolak donasi berstatus menunggu (tanpa menghasilkan transaksi kas).
     */
    public function reject(RejectDonasiRequest $request, Donasi $donasi): RedirectResponse|JsonResponse
    {
        Gate::authorize('reject', $donasi);

        try {
            $rejected = Donasi::tolak(
                $donasi->id,
                $request->user(),
                (string) $request->validated('catatan_verifikasi')
            );
        } catch (DomainException $e) {
            if ($request->expectsJson()) {
                return response()->json(['message' => $e->getMessage()], 422);
            }

            return back()->with('error', $e->getMessage());
        }

        return redirect()
            ->route('admin.donasi')
            ->with('success', "Donasi {$rejected->kode_donasi} telah ditolak.");
    }

    /**
     * Batalkan donasi terverifikasi (khusus Super Admin) dan ubah transaksi terkait menjadi VOID.
     */
    public function cancel(CancelDonasiRequest $request, Donasi $donasi): RedirectResponse|JsonResponse
    {
        Gate::authorize('cancel', $donasi);

        try {
            $cancelled = Donasi::batalkan(
                $donasi->id,
                $request->user(),
                (string) $request->validated('catatan_verifikasi')
            );
        } catch (DomainException $e) {
            if ($request->expectsJson()) {
                return response()->json(['message' => $e->getMessage()], 422);
            }

            return back()->with('error', $e->getMessage());
        }

        return redirect()
            ->route('admin.donasi')
            ->with(
                'success',
                "Donasi {$cancelled->kode_donasi} telah dibatalkan dan transaksi kas terkait diubah menjadi VOID."
            );
    }

    /**
     * Format item donasi untuk frontend tanpa mengekspos path internal filesystem.
     *
     * @return array<string, mixed>
     */
    private function formatDonasiItem(Donasi $donasi, User $user): array
    {
        $hasBukti = $donasi->bukti_transfer !== null && $donasi->bukti_transfer !== '';

        return [
            'id' => $donasi->id,
            'kode_donasi' => $donasi->kode_donasi,
            'nama_donatur' => $donasi->nama_donatur,
            'no_whatsapp' => $donasi->no_whatsapp,
            'jenis_donasi' => $donasi->jenis_donasi,
            'anak_yatim_id' => $donasi->anak_yatim_id,
            'rekening_tujuan' => $donasi->rekening_tujuan,
            'nominal' => (int) $donasi->nominal,
            'pesan_doa' => $donasi->pesan_doa,
            'status_verifikasi' => $donasi->status_verifikasi,
            'verified_at' => $donasi->verified_at?->toIso8601String(),
            'verified_at_formatted' => $donasi->verified_at?->format('d M Y, H:i'),
            'verified_by' => $donasi->verified_by,
            'catatan_verifikasi' => $donasi->catatan_verifikasi,
            'created_at' => $donasi->created_at?->toIso8601String(),
            'created_at_formatted' => $donasi->created_at?->format('d M Y, H:i'),
            'created_date' => $donasi->created_at?->format('Y-m-d'),
            'has_bukti_transfer' => $hasBukti,
            'bukti_transfer_url' => $hasBukti ? route('admin.donasi.bukti', $donasi->id) : null,
            'bukti_transfer_is_pdf' => $hasBukti && str_ends_with(strtolower((string) $donasi->bukti_transfer), '.pdf'),
            'anak_yatim' => $donasi->relationLoaded('anakYatim') && $donasi->anakYatim ? [
                'id' => $donasi->anakYatim->id,
                'nama_lengkap' => $donasi->anakYatim->nama_lengkap,
                'alias' => $donasi->anakYatim->alias,
                'jenjang' => $donasi->anakYatim->jenjang,
                'kelas' => $donasi->anakYatim->kelas,
                'kelurahan' => $donasi->anakYatim->kelurahan,
                'status_asuh' => $donasi->anakYatim->status_asuh,
                'bidang' => $donasi->anakYatim->relationLoaded('bidang')
                    ? $donasi->anakYatim->bidang->map(fn ($b) => [
                        'id' => $b->id,
                        'kode' => $b->kode,
                        'nama' => $b->nama,
                    ])->values()->all()
                    : [],
            ] : null,
            'verifikator' => $donasi->relationLoaded('verifikator') && $donasi->verifikator ? [
                'id' => $donasi->verifikator->id,
                'name' => $donasi->verifikator->name,
            ] : null,
            'transaksi' => $donasi->relationLoaded('transaksi') && $donasi->transaksi ? [
                'id' => $donasi->transaksi->id,
                'kode_transaksi' => $donasi->transaksi->kode_transaksi,
                'tipe' => $donasi->transaksi->tipe,
                'kategori' => $donasi->transaksi->kategori,
                'nominal' => (int) $donasi->transaksi->nominal,
                'status_transaksi' => $donasi->transaksi->status_transaksi,
                'tanggal_transaksi' => $donasi->transaksi->tanggal_transaksi?->format('Y-m-d'),
                'keterangan' => $donasi->transaksi->keterangan,
            ] : null,
            'can_verify' => Gate::forUser($user)->allows('verify', $donasi),
            'can_reject' => Gate::forUser($user)->allows('reject', $donasi),
            'can_cancel' => Gate::forUser($user)->allows('cancel', $donasi),
        ];
    }
}
