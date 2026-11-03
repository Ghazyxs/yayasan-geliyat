<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\AnakYatim\StoreAnakYatimRequest;
use App\Http\Requests\AnakYatim\UpdateAnakYatimRequest;
use App\Models\AnakYatim;
use App\Models\Bidang;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

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
     * Tampilkan halaman daftar anak yatim sesuai cakupan bidang pengguna.
     */
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', AnakYatim::class);

        $user = $request->user();
        $user->loadMissing('bidang');

        $search = trim((string) $request->input('search', ''));
        $jenjang = (string) $request->input('jenjang', '');
        $statusBinaan = (string) $request->input('status_binaan', '');
        $statusAsuh = (string) $request->input('status_asuh', '');
        $kelurahan = (string) $request->input('kelurahan', '');
        $bidangId = $request->input('bidang_id');

        $baseQuery = AnakYatim::query()->visibleTo($user);

        // Ringkasan statistik berdasarkan cakupan data yang berhak dilihat user
        $stats = [
            'total' => (clone $baseQuery)->count(),
            'aktif' => (clone $baseQuery)->where('status_binaan', 'aktif')->count(),
            'belum_diasuh' => (clone $baseQuery)->where('status_asuh', AnakYatim::STATUS_ASUH_BELUM)->count(),
            'aktif_diasuh' => (clone $baseQuery)->where('status_asuh', AnakYatim::STATUS_ASUH_AKTIF)->count(),
        ];

        $query = clone $baseQuery;

        if ($search !== '') {
            $like = "%{$search}%";
            $query->where(function (Builder $q) use ($like) {
                $q->where('nama_lengkap', 'like', $like)
                    ->orWhere('alias', 'like', $like)
                    ->orWhere('kelurahan', 'like', $like)
                    ->orWhere('nama_sekolah', 'like', $like)
                    ->orWhere('nama_wali', 'like', $like)
                    ->orWhere('hobi', 'like', $like)
                    ->orWhere('cita_cita', 'like', $like);
            });
        }

        if ($jenjang !== '' && in_array($jenjang, ['SD', 'SMP', 'SMA', 'Kuliah'], true)) {
            $query->where('jenjang', $jenjang);
        }

        if ($statusBinaan !== '' && in_array($statusBinaan, ['aktif', 'alumni', 'nonaktif'], true)) {
            $query->where('status_binaan', $statusBinaan);
        }

        if ($statusAsuh !== '' && in_array($statusAsuh, ['belum_diasuh', 'aktif_diasuh'], true)) {
            $query->where('status_asuh', $statusAsuh);
        }

        if ($kelurahan !== '') {
            $query->where('kelurahan', $kelurahan);
        }

        if ($bidangId !== null && $bidangId !== '') {
            $query->whereHas('bidang', fn (Builder $q) => $q->whereKey((int) $bidangId));
        }

        $anakYatim = $query
            ->with(['bidang:id,kode,nama', 'pembuat:id,name'])
            ->withCount('donasi')
            ->latest('id')
            ->paginate(10)
            ->withQueryString()
            ->through(function (AnakYatim $anak) use ($user) {
                // Model AnakYatim memiliki $hidden = ['nik', 'alamat_detail']
                // sehingga toArray() dijamin tidak membocorkan data sensitif ke props standar.
                $item = $anak->toArray();
                $item['tanggal_lahir'] = $anak->tanggal_lahir?->format('Y-m-d');
                $item['can_view_sensitive'] = Gate::forUser($user)->allows('viewSensitiveData', $anak);
                $item['can_update'] = Gate::forUser($user)->allows('update', $anak);
                $item['can_delete'] = Gate::forUser($user)->allows('delete', $anak);

                return $item;
            });

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
                'jenjang' => $jenjang,
                'status_binaan' => $statusBinaan,
                'status_asuh' => $statusAsuh,
                'kelurahan' => $kelurahan,
                'bidang_id' => $bidangId !== null && $bidangId !== '' ? (string) $bidangId : '',
            ],
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
     * Simpan data anak yatim baru beserta relasi bidang binaan.
     */
    public function store(StoreAnakYatimRequest $request): RedirectResponse
    {
        $user = $request->user();
        $validated = $request->validated();

        $dummyAnak = new AnakYatim;

        if ($user->isSuperAdmin()) {
            $bidangIds = array_values(array_unique(array_map('intval', $validated['bidang_ids'] ?? [])));
        } else {
            // Admin wajib hanya menghubungkan ke bidangnya sendiri (cegah parameter tampering)
            foreach ($validated['bidang_ids'] ?? [] as $targetBidangId) {
                Gate::authorize('attachBidang', [$dummyAnak, (int) $targetBidangId]);
            }

            $bidangIds = [(int) $user->bidang_id];
        }

        DB::transaction(function () use ($validated, $user, $bidangIds) {
            $anak = AnakYatim::create([
                'nik' => $validated['nik'] ?? null,
                'nama_lengkap' => $validated['nama_lengkap'],
                'alias' => $validated['alias'],
                'jenis_kelamin' => $validated['jenis_kelamin'],
                'tanggal_lahir' => $validated['tanggal_lahir'],
                'jenjang' => $validated['jenjang'],
                'kelas' => $validated['kelas'],
                'nama_sekolah' => $validated['nama_sekolah'] ?? null,
                'kelurahan' => $validated['kelurahan'],
                'alamat_detail' => $validated['alamat_detail'] ?? null,
                'nama_wali' => $validated['nama_wali'],
                'no_telepon_wali' => $validated['no_telepon_wali'] ?? null,
                'hobi' => $validated['hobi'] ?? null,
                'cita_cita' => $validated['cita_cita'] ?? null,
                'status_binaan' => $validated['status_binaan'],
                'status_asuh' => $validated['status_asuh'],
                'created_by' => $user->id,
            ]);

            $catatan = $validated['catatan_program'] ?? null;
            $pivotData = [];
            foreach ($bidangIds as $bId) {
                $pivotData[$bId] = ['catatan_program' => $catatan];
            }

            $anak->bidang()->sync($pivotData);
        });

        return redirect()
            ->route('admin.anak-yatim')
            ->with('success', 'Data anak binaan berhasil ditambahkan.');
    }

    /**
     * Tampilkan detail anak yatim (tanpa mengekspos NIK & alamat_detail).
     */
    public function show(Request $request, AnakYatim $anak_yatim): JsonResponse
    {
        Gate::authorize('view', $anak_yatim);

        $user = $request->user();
        $anak_yatim->load(['bidang:id,kode,nama', 'pembuat:id,name'])->loadCount('donasi');

        $data = $anak_yatim->toArray();
        $data['tanggal_lahir'] = $anak_yatim->tanggal_lahir?->format('Y-m-d');
        $data['can_view_sensitive'] = Gate::forUser($user)->allows('viewSensitiveData', $anak_yatim);

        return response()->json([
            'status' => 'success',
            'data' => $data,
        ]);
    }

    /**
     * Ambil data sensitif (NIK terdekripsi & alamat_detail) khusus pengguna berwenang.
     */
    public function sensitive(AnakYatim $anak_yatim): JsonResponse
    {
        Gate::authorize('viewSensitiveData', $anak_yatim);

        $anak_yatim->loadMissing(['bidang:id,kode,nama']);

        return response()->json([
            'status' => 'success',
            'data' => $anak_yatim->makeVisible(['nik', 'alamat_detail']),
        ]);
    }

    /**
     * Perbarui data anak yatim beserta relasi bidang binaan.
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
            || $request->filled('alamat_detail')
        );

        DB::transaction(function () use ($anak_yatim, $validated, $user, $shouldUpdateSensitive) {
            $attributes = [
                'nama_lengkap' => $validated['nama_lengkap'],
                'alias' => $validated['alias'],
                'jenis_kelamin' => $validated['jenis_kelamin'],
                'tanggal_lahir' => $validated['tanggal_lahir'],
                'jenjang' => $validated['jenjang'],
                'kelas' => $validated['kelas'],
                'nama_sekolah' => $validated['nama_sekolah'] ?? null,
                'kelurahan' => $validated['kelurahan'],
                'nama_wali' => $validated['nama_wali'],
                'no_telepon_wali' => $validated['no_telepon_wali'] ?? null,
                'hobi' => $validated['hobi'] ?? null,
                'cita_cita' => $validated['cita_cita'] ?? null,
                'status_binaan' => $validated['status_binaan'],
                'status_asuh' => $validated['status_asuh'],
            ];

            if ($shouldUpdateSensitive) {
                $attributes['nik'] = $validated['nik'] ?? null;
                $attributes['alamat_detail'] = $validated['alamat_detail'] ?? null;
            }

            $anak_yatim->update($attributes);

            $catatan = $validated['catatan_program'] ?? null;

            if ($user->isSuperAdmin()) {
                $bidangIds = array_values(array_unique(array_map('intval', $validated['bidang_ids'] ?? [])));

                if ($catatan !== null) {
                    $syncData = [];
                    foreach ($bidangIds as $bId) {
                        $syncData[$bId] = ['catatan_program' => $catatan];
                    }
                    $anak_yatim->bidang()->sync($syncData);
                } else {
                    $anak_yatim->bidang()->sync($bidangIds);
                }
            } else {
                // Admin hanya mengelola asosiasi bidangnya sendiri tanpa menghapus bidang lain yang terhubung
                if ($catatan !== null) {
                    $anak_yatim->bidang()->syncWithoutDetaching([
                        (int) $user->bidang_id => ['catatan_program' => $catatan],
                    ]);
                } else {
                    $anak_yatim->bidang()->syncWithoutDetaching([(int) $user->bidang_id]);
                }
            }
        });

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
                'Data anak tidak dapat dihapus karena memiliki riwayat donasi tercatat. Silakan ubah status binaan menjadi Nonaktif atau Alumni untuk menjaga jejak audit.'
            );
        }

        DB::transaction(function () use ($anak_yatim) {
            $anak_yatim->delete();
        });

        return redirect()
            ->route('admin.anak-yatim')
            ->with('success', 'Data anak binaan berhasil dihapus.');
    }
}
