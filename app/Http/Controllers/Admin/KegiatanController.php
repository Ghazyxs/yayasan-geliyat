<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Kegiatan\StoreKegiatanRequest;
use App\Http\Requests\Kegiatan\UpdateKegiatanRequest;
use App\Models\BeritaUmum;
use App\Models\Bidang;
use App\Models\Kegiatan;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class KegiatanController extends Controller
{
    /**
     * Peta kode bidang ke nilai ENUM kategori pada tabel kegiatan.
     *
     * @var array<string, string>
     */
    private const BIDANG_KATEGORI_MAP = [
        Bidang::PENDIDIKAN => 'Pendidikan',
        Bidang::KEAGAMAAN => 'Keagamaan',
        Bidang::KEMANUSIAAN => 'Kemanusiaan',
        Bidang::EKONOMI => 'Ekonomi',
    ];

    /**
     * Tampilkan halaman daftar Kegiatan & Berita Umum dengan pencarian, filter, dan paginasi.
     */
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', Kegiatan::class);

        $user = $request->user();
        $user->loadMissing('bidang');

        $search = trim((string) $request->input('search', ''));
        $jenis = (string) $request->input('jenis', '');
        $kategori = (string) $request->input('kategori', '');
        $tahun = trim((string) $request->input('tahun', ''));

        $baseKegiatanQuery = Kegiatan::query()->visibleTo($user);
        $baseBeritaQuery = BeritaUmum::query();

        $currentYear = (int) now()->year;
        $stats = [
            'total' => (clone $baseKegiatanQuery)->count() + (clone $baseBeritaQuery)->count(),
            'berita_kegiatan' => (clone $baseKegiatanQuery)->count(),
            'berita_umum' => (clone $baseBeritaQuery)->count(),
            'tahun_ini' => (clone $baseKegiatanQuery)
                ->whereBetween('tanggal_kegiatan', [
                    sprintf('%04d-01-01', $currentYear),
                    sprintf('%04d-12-31', $currentYear),
                ])
                ->count(),
        ];

        $combined = collect();

        if ($jenis === '' || $jenis === 'berita_kegiatan') {
            $kegiatanQuery = (clone $baseKegiatanQuery)
                ->with(['bidang:id,kode,nama', 'pembuat:id,name']);

            if ($search !== '') {
                $like = "%{$search}%";
                $kegiatanQuery->where(function (Builder $q) use ($like) {
                    $q->where('judul', 'like', $like)
                        ->orWhere('lokasi', 'like', $like)
                        ->orWhere('ringkasan', 'like', $like)
                        ->orWhere('deskripsi', 'like', $like)
                        ->orWhere('isi_berita', 'like', $like);
                });
            }

            if ($kategori !== '' && in_array($kategori, array_values(self::BIDANG_KATEGORI_MAP), true)) {
                $kegiatanQuery->where('kategori', $kategori);
            }

            if ($tahun !== '' && ctype_digit($tahun)) {
                $yr = (int) $tahun;
                $kegiatanQuery->whereBetween('tanggal_kegiatan', [
                    sprintf('%04d-01-01', $yr),
                    sprintf('%04d-12-31', $yr),
                ]);
            }

            $kegiatanItems = $kegiatanQuery
                ->orderByDesc('tanggal_kegiatan')
                ->orderByDesc('id')
                ->get()
                ->map(fn (Kegiatan $item) => $this->formatKegiatanItem($item, $user));

            $combined = $combined->concat($kegiatanItems);
        }

        if (($jenis === '' || $jenis === 'berita_umum') && $kategori === '') {
            $beritaQuery = (clone $baseBeritaQuery)->with('pembuat:id,name');

            if ($search !== '') {
                $like = "%{$search}%";
                $beritaQuery->where(function (Builder $q) use ($like) {
                    $q->where('judul', 'like', $like)
                        ->orWhere('ringkasan', 'like', $like)
                        ->orWhere('isi', 'like', $like);
                });
            }

            if ($tahun !== '' && ctype_digit($tahun)) {
                $yr = (int) $tahun;
                $beritaQuery->whereBetween('tanggal_publikasi', [
                    sprintf('%04d-01-01', $yr),
                    sprintf('%04d-12-31', $yr),
                ]);
            }

            $beritaItems = $beritaQuery
                ->orderByDesc('tanggal_publikasi')
                ->orderByDesc('id')
                ->get()
                ->map(fn (BeritaUmum $item) => $this->formatBeritaUmumItem($item, $user));

            $combined = $combined->concat($beritaItems);
        }

        $sorted = $combined
            ->sortByDesc(fn (array $row) => $row['tanggal_iso'].'-'.str_pad((string) $row['id'], 8, '0', STR_PAD_LEFT))
            ->values();

        $perPage = 10;
        $currentPage = max(1, (int) $request->input('page', 1));
        $sliced = $sorted->slice(($currentPage - 1) * $perPage, $perPage)->values();

        $paginator = (new LengthAwarePaginator(
            $sliced,
            $sorted->count(),
            $perPage,
            $currentPage,
            ['path' => route('admin.kegiatan')]
        ))->withQueryString();

        $bidangList = Bidang::query()
            ->orderBy('id')
            ->get(['id', 'kode', 'nama']);

        $tahunKegiatan = (clone $baseKegiatanQuery)
            ->pluck('tanggal_kegiatan')
            ->map(fn ($d) => $d?->year)
            ->filter();
        $tahunBerita = (clone $baseBeritaQuery)
            ->pluck('tanggal_publikasi')
            ->map(fn ($d) => $d?->year)
            ->filter();
        $tahunList = $tahunKegiatan
            ->concat($tahunBerita)
            ->push($currentYear)
            ->unique()
            ->sortDesc()
            ->values()
            ->all();

        return Inertia::render('admin/kegiatan/index', [
            'items' => $paginator,
            'stats' => $stats,
            'filters' => [
                'search' => $search,
                'jenis' => $jenis,
                'kategori' => $kategori,
                'tahun' => $tahun,
            ],
            'bidangList' => $bidangList,
            'tahunList' => $tahunList,
            'permissions' => [
                'is_super_admin' => $user->isSuperAdmin(),
                'can_create' => Gate::forUser($user)->allows('create', Kegiatan::class),
                'user_bidang' => $user->bidang ? [
                    'id' => $user->bidang->id,
                    'kode' => $user->bidang->kode,
                    'nama' => $user->bidang->nama,
                ] : null,
            ],
        ]);
    }

    /**
     * Simpan konten baru (Berita Kegiatan atau Berita Umum) beserta gambar dan dokumentasi.
     */
    public function store(StoreKegiatanRequest $request): RedirectResponse
    {
        $user = $request->user();
        $validated = $request->validated();
        $jenisKonten = $validated['jenis_konten'];

        if ($jenisKonten === 'berita_umum') {
            $gambarPath = null;
            if ($request->hasFile('gambar')) {
                $gambarPath = $this->storePublicImage($request->file('gambar'), 'berita-umum');
            }

            $isi = trim((string) $validated['isi']);
            $judul = trim((string) $validated['judul']);

            DB::transaction(function () use ($judul, $isi, $gambarPath, $validated, $user) {
                BeritaUmum::create([
                    'judul' => $judul,
                    'slug' => $this->generateUniqueSlug($judul),
                    'kategori' => 'Informasi',
                    'ringkasan' => Str::limit(strip_tags($isi), 160),
                    'isi' => $isi,
                    'gambar' => $gambarPath,
                    'tanggal_publikasi' => $validated['tanggal_publikasi'] ?? now()->toDateString(),
                    'is_published' => true,
                    'created_by' => $user->id,
                ]);
            });

            return redirect()
                ->route('admin.kegiatan')
                ->with('success', 'Berita umum berhasil dipublikasikan.');
        }

        // Berita Kegiatan -> tersimpan di tabel `kegiatan`, terhubung otomatis ke Beranda & Rekap Tahunan
        $bidang = $this->resolveAuthorizedBidang($user, isset($validated['bidang_id']) ? (int) $validated['bidang_id'] : null);
        $kategori = self::BIDANG_KATEGORI_MAP[$bidang->kode] ?? 'Kemanusiaan';

        $gambarUtamaUrl = null;
        if ($request->hasFile('gambar')) {
            $gambarUtamaUrl = '/storage/'.$this->storePublicImage($request->file('gambar'), 'kegiatan/utama');
        }

        $dokumentasi = $this->storeUploadedDokumentasi(
            $request->file('dokumentasi_files', []),
            $request->input('dokumentasi_captions', []),
            trim((string) $validated['judul'])
        );

        $isiBerita = trim((string) $validated['isi_berita']);
        $ringkasan = ! empty($validated['ringkasan'])
            ? trim((string) $validated['ringkasan'])
            : Str::limit(strip_tags($isiBerita), 220);

        DB::transaction(function () use ($validated, $bidang, $kategori, $gambarUtamaUrl, $dokumentasi, $isiBerita, $ringkasan, $user) {
            Kegiatan::create([
                'judul' => trim((string) $validated['judul']),
                'bidang_id' => $bidang->id,
                'kategori' => $kategori,
                'ringkasan' => $ringkasan,
                'deskripsi' => $ringkasan,
                'isi_berita' => $isiBerita,
                'lokasi' => trim((string) $validated['lokasi']),
                'tanggal_kegiatan' => $validated['tanggal_kegiatan'],
                'gambar' => $gambarUtamaUrl,
                'dokumentasi' => $dokumentasi,
                'created_by' => $user->id,
            ]);
        });

        return redirect()
            ->route('admin.kegiatan')
            ->with('success', 'Berita kegiatan berhasil ditambahkan dan terhubung ke halaman publik serta Rekap Tahunan.');
    }

    /**
     * Tampilkan detail satu kegiatan (JSON).
     */
    public function show(Kegiatan $kegiatan): JsonResponse
    {
        Gate::authorize('view', $kegiatan);

        $kegiatan->load(['bidang:id,kode,nama', 'pembuat:id,name']);

        return response()->json([
            'status' => 'success',
            'data' => $kegiatan,
        ]);
    }

    /**
     * Perbarui Berita Kegiatan beserta gambar utama dan galeri dokumentasi.
     */
    public function update(UpdateKegiatanRequest $request, Kegiatan $kegiatan): RedirectResponse
    {
        Gate::authorize('update', $kegiatan);

        $user = $request->user();
        $validated = $request->validated();

        $bidang = $this->resolveAuthorizedBidang($user, isset($validated['bidang_id']) ? (int) $validated['bidang_id'] : $kegiatan->bidang_id);
        $kategori = self::BIDANG_KATEGORI_MAP[$bidang->kode] ?? $kegiatan->kategori;

        $filesToDeleteAfterCommit = [];
        $gambarUtamaUrl = $kegiatan->gambar;

        if ($request->hasFile('gambar')) {
            $this->collectPublicStoragePath($kegiatan->gambar, 'kegiatan/', $filesToDeleteAfterCommit);
            $gambarUtamaUrl = '/storage/'.$this->storePublicImage($request->file('gambar'), 'kegiatan/utama');
        } elseif ($request->boolean('hapus_gambar')) {
            $this->collectPublicStoragePath($kegiatan->gambar, 'kegiatan/', $filesToDeleteAfterCommit);
            $gambarUtamaUrl = null;
        }

        // Kelola dokumentasi yang dipertahankan vs baru ditambahkan
        $existingDocs = is_array($kegiatan->dokumentasi) ? $kegiatan->dokumentasi : [];
        if ($request->exists('retained_dokumentasi')) {
            $decoded = json_decode((string) $request->input('retained_dokumentasi', '[]'), true);
            $retainedDocs = is_array($decoded) ? array_values(array_filter($decoded, fn ($d) => is_array($d) && ! empty($d['url']))) : [];
            $retainedUrls = array_column($retainedDocs, 'url');

            foreach ($existingDocs as $oldDoc) {
                $oldUrl = $oldDoc['url'];
                if (! in_array($oldUrl, $retainedUrls, true)) {
                    $this->collectPublicStoragePath($oldUrl, 'kegiatan/', $filesToDeleteAfterCommit);
                }
            }
        } else {
            $retainedDocs = $existingDocs;
        }

        $newDocs = $this->storeUploadedDokumentasi(
            $request->file('dokumentasi_files', []),
            $request->input('dokumentasi_captions', []),
            trim((string) $validated['judul'])
        );
        $finalDokumentasi = array_merge($retainedDocs, $newDocs);

        $isiBerita = trim((string) $validated['isi_berita']);
        $ringkasan = ! empty($validated['ringkasan'])
            ? trim((string) $validated['ringkasan'])
            : Str::limit(strip_tags($isiBerita), 220);

        DB::transaction(function () use ($kegiatan, $validated, $bidang, $kategori, $gambarUtamaUrl, $finalDokumentasi, $isiBerita, $ringkasan) {
            $kegiatan->update([
                'judul' => trim((string) $validated['judul']),
                'bidang_id' => $bidang->id,
                'kategori' => $kategori,
                'ringkasan' => $ringkasan,
                'deskripsi' => $ringkasan,
                'isi_berita' => $isiBerita,
                'lokasi' => trim((string) $validated['lokasi']),
                'tanggal_kegiatan' => $validated['tanggal_kegiatan'],
                'gambar' => $gambarUtamaUrl,
                'dokumentasi' => $finalDokumentasi,
            ]);
        });

        foreach ($filesToDeleteAfterCommit as $path) {
            Storage::disk('public')->delete($path);
        }

        return redirect()
            ->route('admin.kegiatan')
            ->with('success', 'Data kegiatan berhasil diperbarui.');
    }

    /**
     * Hapus Berita Kegiatan beserta file gambar & dokumentasi lokalnya.
     */
    public function destroy(Kegiatan $kegiatan): RedirectResponse
    {
        Gate::authorize('delete', $kegiatan);

        $filesToDelete = [];
        $this->collectPublicStoragePath($kegiatan->gambar, 'kegiatan/', $filesToDelete);

        if (is_array($kegiatan->dokumentasi)) {
            foreach ($kegiatan->dokumentasi as $doc) {
                $this->collectPublicStoragePath($doc['url'], 'kegiatan/', $filesToDelete);
            }
        }

        DB::transaction(function () use ($kegiatan) {
            $kegiatan->delete();
        });

        foreach ($filesToDelete as $path) {
            Storage::disk('public')->delete($path);
        }

        return redirect()
            ->route('admin.kegiatan')
            ->with('success', 'Berita kegiatan berhasil dihapus.');
    }

    /**
     * Perbarui Berita Umum beserta foto sampulnya.
     */
    public function updateBeritaUmum(UpdateKegiatanRequest $request, BeritaUmum $berita_umum): RedirectResponse
    {
        Gate::authorize('create', Kegiatan::class);

        $validated = $request->validated();
        $filesToDeleteAfterCommit = [];
        $gambarPath = $berita_umum->gambar;

        if ($request->hasFile('gambar')) {
            $this->collectPublicStoragePath($berita_umum->gambar, 'berita-umum/', $filesToDeleteAfterCommit);
            $gambarPath = $this->storePublicImage($request->file('gambar'), 'berita-umum');
        } elseif ($request->boolean('hapus_gambar')) {
            $this->collectPublicStoragePath($berita_umum->gambar, 'berita-umum/', $filesToDeleteAfterCommit);
            $gambarPath = null;
        }

        $isi = trim((string) $validated['isi']);
        $judul = trim((string) $validated['judul']);

        DB::transaction(function () use ($berita_umum, $judul, $isi, $gambarPath, $validated) {
            $berita_umum->update([
                'judul' => $judul,
                'ringkasan' => Str::limit(strip_tags($isi), 160),
                'isi' => $isi,
                'gambar' => $gambarPath,
                'tanggal_publikasi' => $validated['tanggal_publikasi'] ?? $berita_umum->tanggal_publikasi,
            ]);
        });

        foreach ($filesToDeleteAfterCommit as $path) {
            Storage::disk('public')->delete($path);
        }

        return redirect()
            ->route('admin.kegiatan')
            ->with('success', 'Berita umum berhasil diperbarui.');
    }

    /**
     * Hapus Berita Umum beserta foto lokalnya.
     */
    public function destroyBeritaUmum(BeritaUmum $berita_umum): RedirectResponse
    {
        Gate::authorize('create', Kegiatan::class);

        $filesToDelete = [];
        $this->collectPublicStoragePath($berita_umum->gambar, 'berita-umum/', $filesToDelete);

        DB::transaction(function () use ($berita_umum) {
            $berita_umum->delete();
        });

        foreach ($filesToDelete as $path) {
            Storage::disk('public')->delete($path);
        }

        return redirect()
            ->route('admin.kegiatan')
            ->with('success', 'Berita umum berhasil dihapus.');
    }

    /**
     * Tentukan bidang yang sah untuk kegiatan.
     */
    private function resolveAuthorizedBidang(User $user, ?int $requestedBidangId): Bidang
    {
        if ($requestedBidangId !== null) {
            return Bidang::findOrFail((int) $requestedBidangId);
        }

        if ($user->bidang_id !== null) {
            return Bidang::findOrFail((int) $user->bidang_id);
        }

        return Bidang::firstOrFail();
    }

    /**
     * Simpan file gambar ke disk public dengan nama acak aman.
     */
    private function storePublicImage(UploadedFile $file, string $directory): string
    {
        $ext = strtolower((string) ($file->guessExtension() ?: $file->getClientOriginalExtension()));
        if (! in_array($ext, ['jpg', 'jpeg', 'png', 'webp'], true)) {
            $ext = 'jpg';
        }

        $filename = Str::uuid()->toString().'.'.$ext;

        return (string) $file->storeAs($directory, $filename, 'public');
    }

    /**
     * Simpan beberapa foto dokumentasi kegiatan dan kembalikan array struktur JSON.
     *
     * @param  array<int, UploadedFile|mixed>  $files
     * @param  array<int, string|null>  $captions
     * @return array<int, array{url: string, caption: string}>
     */
    private function storeUploadedDokumentasi(array $files, array $captions, string $judul): array
    {
        $result = [];

        foreach ($files as $idx => $file) {
            if (! $file instanceof UploadedFile) {
                continue;
            }

            $storedPath = $this->storePublicImage($file, 'kegiatan/dokumentasi');
            $caption = trim((string) ($captions[$idx] ?? ''));

            $result[] = [
                'url' => '/storage/'.$storedPath,
                'caption' => $caption !== '' ? $caption : "Dokumentasi kegiatan {$judul}",
            ];
        }

        return $result;
    }

    /**
     * Ekstrak path relatif disk public jika path merupakan berkas unggahan lokal.
     *
     * @param  array<int, string>  $collector
     */
    private function collectPublicStoragePath(?string $rawUrl, string $expectedPrefix, array &$collector): void
    {
        if (! is_string($rawUrl) || trim($rawUrl) === '') {
            return;
        }

        $normalized = ltrim($rawUrl, '/');
        if (str_starts_with($normalized, 'storage/')) {
            $normalized = substr($normalized, strlen('storage/'));
        }

        if (str_starts_with($normalized, $expectedPrefix)) {
            $collector[] = $normalized;
        }
    }

    /**
     * Buat slug unik untuk BeritaUmum.
     */
    private function generateUniqueSlug(string $judul): string
    {
        $base = Str::slug($judul);
        if ($base === '') {
            $base = 'berita-'.Str::lower(Str::random(6));
        }

        $slug = $base;
        $counter = 2;

        while (BeritaUmum::where('slug', $slug)->exists()) {
            $slug = "{$base}-{$counter}";
            $counter++;
        }

        return $slug;
    }

    /**
     * Format baris Berita Kegiatan untuk dashboard admin.
     *
     * @return array<string, mixed>
     */
    private function formatKegiatanItem(Kegiatan $kegiatan, User $user): array
    {
        $dokumentasi = is_array($kegiatan->dokumentasi) ? array_values(array_map(fn (array $item) => [
            'url' => (string) $item['url'],
            'caption' => (string) ($item['caption'] ?? $kegiatan->judul),
        ], $kegiatan->dokumentasi)) : [];

        return [
            'uid' => "kegiatan-{$kegiatan->id}",
            'id' => $kegiatan->id,
            'jenis_konten' => 'berita_kegiatan',
            'judul' => $kegiatan->judul,
            'kategori' => $kegiatan->kategori,
            'bidang_id' => $kegiatan->bidang_id,
            'bidang' => $kegiatan->bidang ? [
                'id' => $kegiatan->bidang->id,
                'kode' => $kegiatan->bidang->kode,
                'nama' => $kegiatan->bidang->nama,
            ] : null,
            'lokasi' => $kegiatan->lokasi,
            'tanggal_iso' => $kegiatan->tanggal_kegiatan->format('Y-m-d'),
            'tanggal_formatted' => $kegiatan->tanggal_kegiatan->format('d M Y'),
            'ringkasan' => $kegiatan->ringkasan ?: $kegiatan->deskripsi,
            'isi_konten' => $kegiatan->isi_berita ?: $kegiatan->deskripsi,
            'gambar_url' => $kegiatan->gambar ?: null,
            'dokumentasi' => $dokumentasi,
            'penulis' => $kegiatan->pembuat->name ?? 'Pengurus Yayasan',
            'public_url' => route('kegiatan.show', $kegiatan->id),
            'can_update' => Gate::forUser($user)->allows('update', $kegiatan),
            'can_delete' => Gate::forUser($user)->allows('delete', $kegiatan),
        ];
    }

    /**
     * Format baris Berita Umum untuk dashboard admin.
     *
     * @return array<string, mixed>
     */
    private function formatBeritaUmumItem(BeritaUmum $berita, User $user): array
    {
        $gambarUrl = null;
        if ($berita->gambar) {
            if (str_starts_with($berita->gambar, 'http') || str_starts_with($berita->gambar, '/storage/')) {
                $gambarUrl = $berita->gambar;
            } else {
                $gambarUrl = asset('storage/'.ltrim($berita->gambar, '/'));
            }
        }

        $canManage = Gate::forUser($user)->allows('create', Kegiatan::class);

        return [
            'uid' => "berita-umum-{$berita->id}",
            'id' => $berita->id,
            'jenis_konten' => 'berita_umum',
            'judul' => $berita->judul,
            'slug' => $berita->slug,
            'kategori' => $berita->kategori ?: 'Informasi',
            'bidang_id' => null,
            'bidang' => null,
            'lokasi' => null,
            'tanggal_iso' => $berita->tanggal_publikasi?->format('Y-m-d') ?? '',
            'tanggal_formatted' => $berita->tanggal_publikasi?->format('d M Y') ?? '-',
            'ringkasan' => $berita->ringkasan ?: Str::limit(strip_tags($berita->isi), 160),
            'isi_konten' => $berita->isi,
            'gambar_url' => $gambarUrl,
            'dokumentasi' => [],
            'penulis' => $berita->pembuat->name ?? 'Tim Redaksi Yayasan',
            'public_url' => route('berita-umum.show', $berita->slug),
            'can_update' => $canManage,
            'can_delete' => $canManage,
        ];
    }
}
