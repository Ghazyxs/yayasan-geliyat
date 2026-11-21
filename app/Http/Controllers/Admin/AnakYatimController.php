<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\AnakYatim\StoreAnakYatimRequest;
use App\Http\Requests\AnakYatim\UpdateAnakYatimRequest;
use App\Models\AnakYatim;
use App\Models\Bidang;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AnakYatimController extends Controller
{
    /**
     * Daftar 5 kelurahan binaan utama Yayasan Geliyat.
     *
     * @var array<int, string>
     */
    private const DEFAULT_KELURAHAN = [
        'Cigending',
        'Pasanggrahan',
        'Pasir Endah',
        'Pasirjati',
        'Pasirwangi',
    ];

    /**
     * Peta field upload form -> kolom database.
     *
     * @var array<string, string>
     */
    private const DOKUMEN_INPUT_TO_COLUMN = [
        'foto_anak' => 'foto',
        'foto_kk' => 'foto_kk',
        'foto_akta_kelahiran' => 'foto_akta_kelahiran',
        'foto_akta_kematian_ayah' => 'foto_akta_kematian_ayah',
    ];

    /**
     * Peta parameter route dokumen -> kolom database.
     *
     * @var array<string, string>
     */
    private const DOKUMEN_ROUTE_TO_COLUMN = [
        'foto' => 'foto',
        'kk' => 'foto_kk',
        'akta_kelahiran' => 'foto_akta_kelahiran',
        'akta_kematian_ayah' => 'foto_akta_kematian_ayah',
    ];

    /**
     * Tampilkan halaman daftar anak yatim sesuai cakupan bidang pengguna.
     */
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', AnakYatim::class);

        $user = $request->user();
        $user->loadMissing('bidang');

        $search = trim((string) $request->input('search', ''));
        $jenisKelamin = (string) $request->input('jenis_kelamin', '');
        $jenjang = (string) $request->input('jenjang', '');
        $kelurahan = (string) $request->input('kelurahan', '');

        $baseQuery = AnakYatim::query()->visibleTo($user);

        // Ringkasan statistik jumlah anak berdasarkan jenjang pendidikan dari database
        $stats = [
            'sd' => (clone $baseQuery)->where('jenjang', 'SD')->count(),
            'smp' => (clone $baseQuery)->where('jenjang', 'SMP')->count(),
            'sma' => (clone $baseQuery)->whereIn('jenjang', ['SMA/SMK', 'SMA'])->count(),
            'perguruan_tinggi' => (clone $baseQuery)->whereIn('jenjang', ['Perguruan Tinggi', 'Kuliah'])->count(),
        ];

        $query = clone $baseQuery;

        if ($search !== '') {
            $like = "%{$search}%";
            $query->where(function (Builder $q) use ($like) {
                $q->where('nama_lengkap', 'like', $like)
                    ->orWhere('tempat_lahir', 'like', $like)
                    ->orWhere('kelurahan', 'like', $like)
                    ->orWhere('nama_ibu_kandung', 'like', $like)
                    ->orWhere('nama_wali', 'like', $like)
                    ->orWhere('no_telepon', 'like', $like)
                    ->orWhere('no_telepon_wali', 'like', $like);
            });
        }

        if ($jenisKelamin !== '' && in_array($jenisKelamin, ['L', 'P'], true)) {
            $query->where('jenis_kelamin', $jenisKelamin);
        }

        if ($jenjang !== '' && in_array($jenjang, AnakYatim::JENJANG_LIST, true)) {
            $query->where('jenjang', $jenjang);
        }

        if ($kelurahan !== '') {
            $query->where('kelurahan', $kelurahan);
        }

        $anakYatim = $query
            ->with(['bidang:id,kode,nama', 'pembuat:id,name'])
            ->withCount('donasi')
            ->latest('id')
            ->paginate(10)
            ->withQueryString()
            ->through(fn (AnakYatim $anak) => $this->formatAnakItem($anak, $user));

        $dbKelurahan = (clone $baseQuery)
            ->distinct()
            ->pluck('kelurahan')
            ->filter()
            ->values()
            ->all();

        $kelurahanList = array_values(array_unique(array_merge(self::DEFAULT_KELURAHAN, $dbKelurahan)));
        sort($kelurahanList);

        $bidangList = Bidang::query()
            ->orderBy('id')
            ->get(['id', 'kode', 'nama']);

        return Inertia::render('admin/anak-yatim/index', [
            'anakYatim' => $anakYatim,
            'stats' => $stats,
            'filters' => [
                'search' => $search,
                'jenis_kelamin' => $jenisKelamin,
                'jenjang' => $jenjang,
                'kelurahan' => $kelurahan,
            ],
            'jenjangList' => AnakYatim::JENJANG_LIST,
            'bidangList' => $bidangList,
            'kelurahanList' => $kelurahanList,
            'permissions' => [
                'is_super_admin' => $user->isSuperAdmin(),
                'can_create' => Gate::forUser($user)->allows('create', AnakYatim::class),
                'user_bidang' => $user->bidang ? [
                    'id' => $user->bidang->id,
                    'kode' => $user->bidang->kode,
                    'nama' => $user->bidang->nama,
                ] : null,
            ],
        ]);
    }

    /**
     * Simpan data anak yatim baru beserta dokumen privat & relasi bidang binaan.
     */
    public function store(StoreAnakYatimRequest $request): RedirectResponse
    {
        $user = $request->user();
        $validated = $request->validated();

        $dummyAnak = new AnakYatim;

        if ($user->isSuperAdmin()) {
            $bidangIds = array_values(array_unique(array_map('intval', $validated['bidang_ids'] ?? [])));
            if ($bidangIds === []) {
                $defaultBidangId = Bidang::where('kode', Bidang::KEMANUSIAAN)->value('id')
                    ?? Bidang::orderBy('id')->value('id');
                $bidangIds = $defaultBidangId ? [(int) $defaultBidangId] : [];
            }
        } else {
            // Admin wajib hanya menghubungkan ke bidangnya sendiri (cegah parameter tampering)
            foreach ($validated['bidang_ids'] ?? [] as $targetBidangId) {
                Gate::authorize('attachBidang', [$dummyAnak, (int) $targetBidangId]);
            }

            $bidangIds = [(int) $user->bidang_id];
        }

        $uploadedPaths = [];
        foreach (self::DOKUMEN_INPUT_TO_COLUMN as $inputKey => $column) {
            if ($request->hasFile($inputKey)) {
                $uploadedPaths[$column] = $this->storePrivateDokumen($request->file($inputKey));
            }
        }

        DB::transaction(function () use ($validated, $user, $bidangIds, $uploadedPaths) {
            $anak = AnakYatim::create(array_merge([
                'nik' => $validated['nik'] ?? null,
                'no_kk' => $validated['no_kk'] ?? null,
                'nama_lengkap' => $validated['nama_lengkap'],
                'anak_ke' => (int) $validated['anak_ke'],
                'jenis_kelamin' => $validated['jenis_kelamin'],
                'status_santunan' => $validated['status_santunan'],
                'tempat_lahir' => $validated['tempat_lahir'],
                'tanggal_lahir' => $validated['tanggal_lahir'],
                'jenjang' => $validated['jenjang'],
                'kelurahan' => $validated['kelurahan'],
                'alamat_detail' => $validated['alamat_detail'] ?? null,
                'nama_ibu_kandung' => $validated['nama_ibu_kandung'],
                'no_telepon' => $validated['no_telepon'] ?? null,
                'nama_wali' => $validated['nama_wali'],
                'no_telepon_wali' => $validated['no_telepon_wali'] ?? null,
                'status_binaan' => $validated['status_binaan'] ?? 'aktif',
                'created_by' => $user->id,
            ], $uploadedPaths));

            $catatan = $validated['catatan_program'] ?? null;
            $pivotData = [];
            foreach ($bidangIds as $bId) {
                $pivotData[$bId] = ['catatan_program' => $catatan];
            }

            if ($pivotData !== []) {
                $anak->bidang()->sync($pivotData);
            }
        });

        return redirect()
            ->route('admin.anak-yatim')
            ->with('success', 'Data anak binaan berhasil ditambahkan.');
    }

    /**
     * Tampilkan detail anak yatim (tanpa mengekspos NIK, No KK, alamat_detail, atau path file).
     */
    public function show(Request $request, AnakYatim $anak_yatim): JsonResponse
    {
        Gate::authorize('view', $anak_yatim);

        $user = $request->user();
        $anak_yatim->load(['bidang:id,kode,nama', 'pembuat:id,name'])->loadCount('donasi');

        return response()->json([
            'status' => 'success',
            'data' => $this->formatAnakItem($anak_yatim, $user),
        ]);
    }

    /**
     * Ambil data sensitif (NIK, No KK terdekripsi & alamat_detail) khusus pengguna berwenang.
     */
    public function sensitive(AnakYatim $anak_yatim): JsonResponse
    {
        Gate::authorize('viewSensitiveData', $anak_yatim);

        $anak_yatim->loadMissing(['bidang:id,kode,nama']);

        return response()->json([
            'status' => 'success',
            'data' => $anak_yatim->makeVisible(['nik', 'no_kk', 'alamat_detail']),
        ]);
    }

    /**
     * Sajikan dokumen / foto anak privat secara aman setelah lolos otorisasi.
     */
    public function dokumen(AnakYatim $anak_yatim, string $jenis): StreamedResponse
    {
        $column = self::DOKUMEN_ROUTE_TO_COLUMN[$jenis] ?? null;
        if ($column === null) {
            abort(404);
        }

        if ($jenis === 'foto') {
            Gate::authorize('view', $anak_yatim);
        } else {
            Gate::authorize('viewSensitiveData', $anak_yatim);
        }

        $path = (string) ($anak_yatim->{$column} ?? '');
        if ($path === '' || ! Storage::disk('local')->exists($path)) {
            abort(404, 'Berkas dokumen anak tidak ditemukan.');
        }

        return Storage::disk('local')->response(
            $path,
            basename($path),
            [
                'X-Content-Type-Options' => 'nosniff',
                'Cache-Control' => 'private, no-store, no-cache, must-revalidate',
            ]
        );
    }

    /**
     * Perbarui data anak yatim beserta dokumen & relasi bidang binaan.
     */
    public function update(UpdateAnakYatimRequest $request, AnakYatim $anak_yatim): RedirectResponse
    {
        Gate::authorize('update', $anak_yatim);

        $user = $request->user();
        $validated = $request->validated();

        if (! $user->isSuperAdmin()) {
            foreach ($validated['bidang_ids'] ?? [] as $targetBidangId) {
                Gate::authorize('attachBidang', [$anak_yatim, (int) $targetBidangId]);
            }
        }

        $canManageSensitive = Gate::forUser($user)->allows('viewSensitiveData', $anak_yatim);
        $shouldUpdateSensitive = $canManageSensitive && (
            $request->boolean('update_sensitive')
            || $request->filled('nik')
            || $request->filled('no_kk')
            || $request->filled('alamat_detail')
        );

        $newUploads = [];
        $oldFilesToDelete = [];

        foreach (self::DOKUMEN_INPUT_TO_COLUMN as $inputKey => $column) {
            if ($request->hasFile($inputKey)) {
                $existingPath = $anak_yatim->{$column};
                if (is_string($existingPath) && $existingPath !== '') {
                    $oldFilesToDelete[] = $existingPath;
                }
                $newUploads[$column] = $this->storePrivateDokumen($request->file($inputKey));
            }
        }

        DB::transaction(function () use ($anak_yatim, $validated, $user, $shouldUpdateSensitive, $newUploads, $request) {
            $attributes = array_merge([
                'nama_lengkap' => $validated['nama_lengkap'],
                'anak_ke' => (int) $validated['anak_ke'],
                'jenis_kelamin' => $validated['jenis_kelamin'],
                'status_santunan' => $validated['status_santunan'],
                'tempat_lahir' => $validated['tempat_lahir'],
                'tanggal_lahir' => $validated['tanggal_lahir'],
                'jenjang' => $validated['jenjang'],
                'kelurahan' => $validated['kelurahan'],
                'nama_ibu_kandung' => $validated['nama_ibu_kandung'],
                'no_telepon' => $validated['no_telepon'] ?? null,
                'nama_wali' => $validated['nama_wali'],
                'no_telepon_wali' => $validated['no_telepon_wali'] ?? null,
                'status_binaan' => $validated['status_binaan'] ?? $anak_yatim->status_binaan ?? 'aktif',
            ], $newUploads);

            if ($shouldUpdateSensitive) {
                $attributes['nik'] = $validated['nik'] ?? null;
                $attributes['no_kk'] = $validated['no_kk'] ?? null;
                $attributes['alamat_detail'] = $validated['alamat_detail'] ?? null;
            }

            $anak_yatim->update($attributes);

            $hasExplicitBidangIds = $request->has('bidang_ids') && is_array($validated['bidang_ids'] ?? null) && $validated['bidang_ids'] !== [];
            $catatan = $validated['catatan_program'] ?? null;

            if ($user->isSuperAdmin() && $hasExplicitBidangIds) {
                $bidangIds = array_values(array_unique(array_map('intval', $validated['bidang_ids'])));

                if ($catatan !== null) {
                    $syncData = [];
                    foreach ($bidangIds as $bId) {
                        $syncData[$bId] = ['catatan_program' => $catatan];
                    }
                    $anak_yatim->bidang()->sync($syncData);
                } else {
                    $anak_yatim->bidang()->sync($bidangIds);
                }
            } elseif (! $user->isSuperAdmin()) {
                // Admin hanya memastikan keterkaitan pada bidangnya sendiri tanpa menghapus bidang lain
                if ($catatan !== null) {
                    $anak_yatim->bidang()->syncWithoutDetaching([
                        (int) $user->bidang_id => ['catatan_program' => $catatan],
                    ]);
                } else {
                    $anak_yatim->bidang()->syncWithoutDetaching([(int) $user->bidang_id]);
                }
            }
        });

        foreach ($oldFilesToDelete as $oldPath) {
            Storage::disk('local')->delete($oldPath);
        }

        return redirect()
            ->route('admin.anak-yatim')
            ->with('success', 'Data anak binaan berhasil diperbarui.');
    }

    /**
     * Hapus data anak yatim dengan tetap menjaga keutuhan riwayat donasi & audit.
     */
    public function destroy(AnakYatim $anak_yatim): RedirectResponse
    {
        Gate::authorize('delete', $anak_yatim);

        if ($anak_yatim->donasi()->exists()) {
            return back()->with(
                'error',
                'Data anak tidak dapat dihapus karena memiliki riwayat donasi tercatat. Silakan ubah data binaan tanpa menghapus riwayat audit.'
            );
        }

        $filesToDelete = array_filter([
            $anak_yatim->foto,
            $anak_yatim->foto_kk,
            $anak_yatim->foto_akta_kelahiran,
            $anak_yatim->foto_akta_kematian_ayah,
        ]);

        DB::transaction(function () use ($anak_yatim) {
            $anak_yatim->delete();
        });

        foreach ($filesToDelete as $path) {
            Storage::disk('local')->delete($path);
        }

        return redirect()
            ->route('admin.anak-yatim')
            ->with('success', 'Data anak binaan berhasil dihapus.');
    }

    /**
     * Simpan berkas dokumen anak ke disk lokal privat.
     */
    private function storePrivateDokumen(UploadedFile $file): string
    {
        $ext = strtolower((string) ($file->guessExtension() ?: $file->getClientOriginalExtension()));
        if (! in_array($ext, ['pdf', 'png', 'jpg', 'jpeg'], true)) {
            $ext = 'jpg';
        }

        $filename = Str::uuid()->toString().'.'.$ext;

        return (string) $file->storeAs('anak-yatim/dokumen/'.now()->format('Y/m'), $filename, 'local');
    }

    /**
     * Format item anak binaan untuk frontend tanpa membocorkan field PII/path internal.
     *
     * @return array<string, mixed>
     */
    private function formatAnakItem(AnakYatim $anak, User $user): array
    {
        $canViewSensitive = Gate::forUser($user)->allows('viewSensitiveData', $anak);

        $item = $anak->toArray();
        $item['tanggal_lahir'] = $anak->tanggal_lahir?->format('Y-m-d');
        $item['can_view_sensitive'] = $canViewSensitive;
        $item['can_update'] = Gate::forUser($user)->allows('update', $anak);
        $item['can_delete'] = Gate::forUser($user)->allows('delete', $anak);
        $item['dokumen'] = [
            'foto_anak' => $this->formatDokumenMeta($anak->id, 'foto', $anak->foto, true),
            'foto_kk' => $this->formatDokumenMeta($anak->id, 'kk', $anak->foto_kk, $canViewSensitive),
            'foto_akta_kelahiran' => $this->formatDokumenMeta($anak->id, 'akta_kelahiran', $anak->foto_akta_kelahiran, $canViewSensitive),
            'foto_akta_kematian_ayah' => $this->formatDokumenMeta($anak->id, 'akta_kematian_ayah', $anak->foto_akta_kematian_ayah, $canViewSensitive),
        ];

        return $item;
    }

    /**
     * Format metadata dokumen untuk frontend.
     *
     * @return array{exists: bool, url: string|null, is_pdf: bool}|null
     */
    private function formatDokumenMeta(int $anakId, string $routeJenis, ?string $path, bool $canView): ?array
    {
        if (! is_string($path) || $path === '') {
            return null;
        }

        return [
            'exists' => true,
            'url' => $canView ? route('admin.anak-yatim.dokumen', [$anakId, $routeJenis]) : null,
            'is_pdf' => str_ends_with(strtolower($path), '.pdf'),
        ];
    }
}
