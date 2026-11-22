import { Head, router, useForm, usePage } from '@inertiajs/react';
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import { BrandSelect } from '@/components/admin/brand-select';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface BidangOption {
    id: number;
    kode: string;
    nama: string;
}

interface DokumentasiItem {
    url: string;
    caption: string;
}

interface ContentItem {
    uid: string;
    id: number;
    jenis_konten: 'berita_kegiatan' | 'berita_umum';
    judul: string;
    slug?: string;
    kategori: string;
    bidang_id: number | null;
    bidang: BidangOption | null;
    lokasi: string | null;
    tanggal_iso: string;
    tanggal_formatted: string;
    ringkasan: string;
    isi_konten: string;
    gambar_url: string | null;
    dokumentasi: DokumentasiItem[];
    penulis: string;
    public_url: string;
    can_update: boolean;
    can_delete: boolean;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedItems {
    data: ContentItem[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    links: PaginationLink[];
}

interface KegiatanPageProps {
    items?: PaginatedItems;
    stats?: {
        total: number;
        berita_kegiatan: number;
        berita_umum: number;
        tahun_ini: number;
    };
    filters?: {
        search: string;
        jenis: string;
        kategori: string;
        tahun: string;
    };
    bidangList?: BidangOption[];
    tahunList?: number[];
    permissions?: {
        is_super_admin: boolean;
        can_create: boolean;
        user_bidang: BidangOption | null;
    };
    flash?: {
        success?: string | null;
        error?: string | null;
    };
    [key: string]: unknown;
}

interface NewGalleryEntry {
    file: File;
    previewUrl: string;
    caption: string;
}

interface KegiatanFormState {
    jenis_konten: 'berita_kegiatan' | 'berita_umum';
    judul: string;
    bidang_id: string;
    tanggal_kegiatan: string;
    lokasi: string;
    isi_berita: string;
    isi: string;
    gambar: File | null;
    hapus_gambar: boolean;
}

const DEFAULT_PAGINATION: PaginatedItems = {
    data: [],
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
    from: null,
    to: null,
    links: [],
};

const DEFAULT_STATS = {
    total: 0,
    berita_kegiatan: 0,
    berita_umum: 0,
    tahun_ini: 0,
};

const DEFAULT_FILTERS = {
    search: '',
    jenis: '',
    kategori: '',
    tahun: '',
};

const KATEGORI_LIST = ['Pendidikan', 'Keagamaan', 'Kemanusiaan', 'Ekonomi'];

function decodePaginationLabel(label: string): string {
    return label
        .replace(/&laquo;\s*Previous/i, 'Sebelumnya')
        .replace(/Next\s*&raquo;/i, 'Berikutnya')
        .replace(/&laquo;/g, '«')
        .replace(/&raquo;/g, '»');
}

export default function KegiatanAdmin({
    items = DEFAULT_PAGINATION,
    stats = DEFAULT_STATS,
    filters = DEFAULT_FILTERS,
    bidangList = [],
    tahunList = [],
    permissions = {
        is_super_admin: false,
        can_create: false,
        user_bidang: null,
    },
}: KegiatanPageProps) {
    const pageProps = usePage<{
        flash?: { success?: string | null; error?: string | null };
    }>().props;

    // Filter state
    const [searchInput, setSearchInput] = useState(filters.search ?? '');
    const [jenisFilter, setJenisFilter] = useState(filters.jenis ?? '');
    const [kategoriFilter, setKategoriFilter] = useState(
        filters.kategori ?? '',
    );
    const [tahunFilter, setTahunFilter] = useState(filters.tahun ?? '');

    // Modals
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<ContentItem | null>(null);
    const [detailItem, setDetailItem] = useState<ContentItem | null>(null);
    const [deletingItem, setDeletingItem] = useState<ContentItem | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Media preview & multi-gallery state
    const [mainImagePreview, setMainImagePreview] = useState<string | null>(
        null,
    );
    const [retainedDokumentasi, setRetainedDokumentasi] = useState<
        DokumentasiItem[]
    >([]);
    const [newGalleryEntries, setNewGalleryEntries] = useState<
        NewGalleryEntry[]
    >([]);

    const mainImageInputRef = useRef<HTMLInputElement | null>(null);
    const galleryInputRef = useRef<HTMLInputElement | null>(null);

    const defaultBidangId = permissions.is_super_admin
        ? bidangList[0]
            ? String(bidangList[0].id)
            : ''
        : permissions.user_bidang
          ? String(permissions.user_bidang.id)
          : '';

    const form = useForm<KegiatanFormState>({
        jenis_konten: 'berita_kegiatan',
        judul: '',
        bidang_id: defaultBidangId,
        tanggal_kegiatan: new Date().toISOString().slice(0, 10),
        lokasi: '',
        isi_berita: '',
        isi: '',
        gambar: null,
        hapus_gambar: false,
    });

    useEffect(() => {
        setSearchInput(filters.search ?? '');
        setJenisFilter(filters.jenis ?? '');
        setKategoriFilter(filters.kategori ?? '');
        setTahunFilter(filters.tahun ?? '');
    }, [filters]);

    const applyFilters = (
        overrides: Partial<{
            search: string;
            jenis: string;
            kategori: string;
            tahun: string;
        }> = {},
    ) => {
        const next = {
            search: overrides.search ?? searchInput,
            jenis: overrides.jenis ?? jenisFilter,
            kategori: overrides.kategori ?? kategoriFilter,
            tahun: overrides.tahun ?? tahunFilter,
        };

        const query: Record<string, string> = {};
        Object.entries(next).forEach(([key, val]) => {
            if (val && val.trim() !== '') {
                query[key] = val.trim();
            }
        });

        router.get('/admin/kegiatan', query, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handleSearchSubmit = (e: FormEvent) => {
        e.preventDefault();
        applyFilters({ search: searchInput });
    };

    const handleResetFilters = () => {
        setSearchInput('');
        setJenisFilter('');
        setKategoriFilter('');
        setTahunFilter('');
        router.get(
            '/admin/kegiatan',
            {},
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    const hasActiveFilters = Boolean(
        searchInput || jenisFilter || kategoriFilter || tahunFilter,
    );

    const clearMediaInputs = () => {
        if (mainImageInputRef.current) mainImageInputRef.current.value = '';
        if (galleryInputRef.current) galleryInputRef.current.value = '';
        newGalleryEntries.forEach((entry) =>
            URL.revokeObjectURL(entry.previewUrl),
        );
        setNewGalleryEntries([]);
    };

    const openCreateModal = () => {
        setEditingItem(null);
        form.clearErrors();
        clearMediaInputs();
        setMainImagePreview(null);
        setRetainedDokumentasi([]);
        form.setData({
            jenis_konten: 'berita_kegiatan',
            judul: '',
            bidang_id: defaultBidangId,
            tanggal_kegiatan: new Date().toISOString().slice(0, 10),
            lokasi: '',
            isi_berita: '',
            isi: '',
            gambar: null,
            hapus_gambar: false,
        });
        setIsFormOpen(true);
    };

    const openEditModal = (item: ContentItem) => {
        setEditingItem(item);
        form.clearErrors();
        clearMediaInputs();
        setMainImagePreview(item.gambar_url);
        setRetainedDokumentasi(item.dokumentasi || []);
        form.setData({
            jenis_konten: item.jenis_konten,
            judul: item.judul,
            bidang_id: item.bidang_id
                ? String(item.bidang_id)
                : defaultBidangId,
            tanggal_kegiatan:
                item.tanggal_iso || new Date().toISOString().slice(0, 10),
            lokasi: item.lokasi || '',
            isi_berita:
                item.jenis_konten === 'berita_kegiatan' ? item.isi_konten : '',
            isi: item.jenis_konten === 'berita_umum' ? item.isi_konten : '',
            gambar: null,
            hapus_gambar: false,
        });
        setIsFormOpen(true);
    };

    const handleMainImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        form.setData((prev) => ({
            ...prev,
            gambar: file,
            hapus_gambar: false,
        }));
        if (file) {
            setMainImagePreview(URL.createObjectURL(file));
        } else {
            setMainImagePreview(editingItem?.gambar_url ?? null);
        }
    };

    const handleRemoveMainImage = () => {
        form.setData((prev) => ({
            ...prev,
            gambar: null,
            hapus_gambar: Boolean(editingItem?.gambar_url),
        }));
        if (mainImageInputRef.current) {
            mainImageInputRef.current.value = '';
        }
        setMainImagePreview(null);
    };

    const handleAddGalleryFiles = (e: ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []);
        if (files.length === 0) return;

        const mapped: NewGalleryEntry[] = files.map((file) => ({
            file,
            previewUrl: URL.createObjectURL(file),
            caption: '',
        }));

        setNewGalleryEntries((prev) => [...prev, ...mapped].slice(0, 10));
        if (galleryInputRef.current) {
            galleryInputRef.current.value = '';
        }
    };

    const handleUpdateGalleryCaption = (index: number, caption: string) => {
        setNewGalleryEntries((prev) =>
            prev.map((entry, idx) =>
                idx === index ? { ...entry, caption } : entry,
            ),
        );
    };

    const handleRemoveNewGalleryEntry = (index: number) => {
        setNewGalleryEntries((prev) => {
            const target = prev[index];
            if (target) URL.revokeObjectURL(target.previewUrl);
            return prev.filter((_, idx) => idx !== index);
        });
    };

    const handleRemoveRetainedDoc = (index: number) => {
        setRetainedDokumentasi((prev) =>
            prev.filter((_, idx) => idx !== index),
        );
    };

    const handleFormSubmit = (e: FormEvent) => {
        e.preventDefault();

        const targetJenis = editingItem
            ? editingItem.jenis_konten
            : form.data.jenis_konten;

        form.transform((data) => {
            const payload: Record<string, unknown> = {
                jenis_konten: targetJenis,
                judul: data.judul,
            };

            if (data.gambar) {
                payload.gambar = data.gambar;
            }
            if (editingItem && data.hapus_gambar) {
                payload.hapus_gambar = '1';
            }

            if (targetJenis === 'berita_umum') {
                payload.isi = data.isi;
            } else {
                payload.bidang_id = data.bidang_id;
                payload.tanggal_kegiatan = data.tanggal_kegiatan;
                payload.lokasi = data.lokasi;
                payload.isi_berita = data.isi_berita;

                if (editingItem) {
                    payload.retained_dokumentasi =
                        JSON.stringify(retainedDokumentasi);
                }

                if (newGalleryEntries.length > 0) {
                    payload.dokumentasi_files = newGalleryEntries.map(
                        (entry) => entry.file,
                    );
                    payload.dokumentasi_captions = newGalleryEntries.map(
                        (entry) => entry.caption,
                    );
                }
            }

            if (editingItem) {
                payload._method = 'PUT';
            }

            return payload as unknown as KegiatanFormState;
        });

        let submitUrl = '/admin/kegiatan';
        if (editingItem) {
            submitUrl =
                editingItem.jenis_konten === 'berita_umum'
                    ? `/admin/berita-umum/${editingItem.id}`
                    : `/admin/kegiatan/${editingItem.id}`;
        }

        form.post(submitUrl, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setIsFormOpen(false);
                setEditingItem(null);
                clearMediaInputs();
            },
        });
    };

    const handleConfirmDelete = () => {
        if (!deletingItem) return;
        setIsDeleting(true);

        const deleteUrl =
            deletingItem.jenis_konten === 'berita_umum'
                ? `/admin/berita-umum/${deletingItem.id}`
                : `/admin/kegiatan/${deletingItem.id}`;

        router.delete(deleteUrl, {
            preserveScroll: true,
            onFinish: () => {
                setIsDeleting(false);
                setDeletingItem(null);
            },
        });
    };

    const activeFormJenis = editingItem
        ? editingItem.jenis_konten
        : form.data.jenis_konten;

    const formErrors = form.errors as Record<string, string | undefined>;

    return (
        <>
            <Head title="Pengelolaan Kegiatan & Berita" />

            <div className="flex min-h-screen flex-col gap-6 bg-[#f8fafb] p-4 font-poppins text-slate-800 sm:p-6 lg:p-8">
                {/* Flash Notification Banner */}
                {pageProps.flash?.success && (
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50/90 px-4 py-3 text-sm text-emerald-800 shadow-2xs">
                        {pageProps.flash.success}
                    </div>
                )}

                {pageProps.flash?.error && (
                    <div className="rounded-xl border border-rose-200 bg-rose-50/90 px-4 py-3 text-sm text-rose-800 shadow-2xs">
                        {pageProps.flash.error}
                    </div>
                )}

                {/* Header Section */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <span className="mb-2 inline-block rounded-md bg-[#e8f8fa] px-2.5 py-1 text-xs font-semibold text-[#087f8c]">
                            {permissions.is_super_admin
                                ? 'Publikasi Lintas Bidang (Super Admin)'
                                : permissions.user_bidang
                                  ? `Unit Kerja: ${permissions.user_bidang.nama}`
                                  : 'Aktivitas & Publikasi'}
                        </span>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">
                            Pengelolaan Kegiatan & Berita
                        </h1>
                        <p className="mt-1 text-sm text-slate-500">
                            Publikasikan berita kegiatan dan berita umum yang
                            otomatis terhubung ke halaman utama serta Rekap
                            Kegiatan Tahunan.
                        </p>
                    </div>

                    {permissions.can_create && (
                        <Button
                            type="button"
                            onClick={openCreateModal}
                            className="w-fit bg-[#14bace] text-xs font-semibold text-white shadow-xs transition hover:bg-[#0fa0ae]"
                        >
                            + Tambah Kegiatan
                        </Button>
                    )}
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-xl border border-t-4 border-[#e4eaec] border-t-[#14bace] bg-white p-4 shadow-2xs">
                        <span className="text-xs font-medium text-slate-500">
                            Total Publikasi
                        </span>
                        <p className="mt-2 text-2xl font-bold text-slate-800">
                            {stats.total}
                        </p>
                        <p className="mt-1 text-[11px] text-slate-400">
                            Seluruh berita kegiatan & berita umum
                        </p>
                    </div>

                    <div className="rounded-xl border border-t-4 border-[#e4eaec] border-t-[#087f8c] bg-white p-4 shadow-2xs">
                        <span className="text-xs font-medium text-slate-500">
                            Berita Kegiatan
                        </span>
                        <p className="mt-2 text-2xl font-bold text-slate-800">
                            {stats.berita_kegiatan}
                        </p>
                        <p className="mt-1 text-[11px] text-[#087f8c]">
                            Terhubung ke Beranda & Laporan Tahunan
                        </p>
                    </div>

                    <div className="rounded-xl border border-t-4 border-[#e4eaec] border-t-sky-500 bg-white p-4 shadow-2xs">
                        <span className="text-xs font-medium text-slate-500">
                            Berita Umum
                        </span>
                        <p className="mt-2 text-2xl font-bold text-slate-800">
                            {stats.berita_umum}
                        </p>
                        <p className="mt-1 text-[11px] text-slate-400">
                            Artikel, pengumuman & informasi yayasan
                        </p>
                    </div>

                    <div className="rounded-xl border border-t-4 border-[#e4eaec] border-t-emerald-500 bg-white p-4 shadow-2xs">
                        <span className="text-xs font-medium text-slate-500">
                            Kegiatan Tahun Ini
                        </span>
                        <p className="mt-2 text-2xl font-bold text-slate-800">
                            {stats.tahun_ini}
                        </p>
                        <p className="mt-1 text-[11px] text-emerald-700">
                            Masuk ke Rekap Kegiatan Tahunan berjalan
                        </p>
                    </div>
                </div>

                {/* Filter & Search Bar */}
                <div className="rounded-xl border border-[#e4eaec] bg-white p-4 shadow-2xs">
                    <form
                        onSubmit={handleSearchSubmit}
                        className="grid grid-cols-1 gap-3 md:grid-cols-12"
                    >
                        <div className="flex gap-2 md:col-span-5">
                            <input
                                type="text"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                placeholder="Cari judul kegiatan, lokasi, atau isi berita..."
                                className="h-9 w-full rounded-lg border border-[#cbebf0] bg-white px-3 text-xs text-slate-800 placeholder:text-slate-400 focus:border-[#14bace] focus:ring-2 focus:ring-[#14bace]/20 focus:outline-hidden"
                            />
                            <Button
                                type="submit"
                                className="h-9 shrink-0 bg-[#087f8c] px-4 text-xs font-semibold text-white shadow-none hover:bg-[#066570]"
                            >
                                Cari
                            </Button>
                        </div>

                        <div className="md:col-span-2">
                            <BrandSelect
                                ariaLabel="Filter Jenis Konten"
                                value={jenisFilter}
                                onValueChange={(val) => {
                                    setJenisFilter(val);
                                    applyFilters({ jenis: val });
                                }}
                                options={[
                                    { value: '', label: 'Semua Jenis' },
                                    {
                                        value: 'berita_kegiatan',
                                        label: 'Berita Kegiatan',
                                    },
                                    {
                                        value: 'berita_umum',
                                        label: 'Berita Umum',
                                    },
                                ]}
                            />
                        </div>

                        <div className="md:col-span-2">
                            <BrandSelect
                                ariaLabel="Filter Kategori Bidang"
                                value={kategoriFilter}
                                onValueChange={(val) => {
                                    setKategoriFilter(val);
                                    applyFilters({ kategori: val });
                                }}
                                options={[
                                    { value: '', label: 'Semua Bidang' },
                                    ...KATEGORI_LIST.map((k) => ({
                                        value: k,
                                        label: k,
                                    })),
                                ]}
                            />
                        </div>

                        <div className="flex items-center gap-2 md:col-span-3">
                            <div className="flex-1">
                                <BrandSelect
                                    ariaLabel="Filter Tahun"
                                    value={tahunFilter}
                                    onValueChange={(val) => {
                                        setTahunFilter(val);
                                        applyFilters({ tahun: val });
                                    }}
                                    options={[
                                        { value: '', label: 'Semua Tahun' },
                                        ...tahunList.map((yr) => ({
                                            value: String(yr),
                                            label: `Tahun ${yr}`,
                                        })),
                                    ]}
                                />
                            </div>

                            {hasActiveFilters && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleResetFilters}
                                    className="h-9 shrink-0 border-[#cbebf0] bg-[#f7fcfd] px-3 text-xs font-medium text-[#087f8c] shadow-none hover:bg-[#e8f8fa]"
                                >
                                    Reset
                                </Button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Data Table */}
                <div className="overflow-hidden rounded-xl border border-[#e4eaec] bg-white shadow-2xs">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left text-xs">
                            <thead>
                                <tr className="border-b border-[#e4eaec] bg-[#f8fafb] text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                                    <th className="px-4 py-3.5">
                                        Judul & Ringkasan
                                    </th>
                                    <th className="px-4 py-3.5">
                                        Jenis & Kategori
                                    </th>
                                    <th className="px-4 py-3.5">
                                        Tanggal & Lokasi
                                    </th>
                                    <th className="px-4 py-3.5">Dokumentasi</th>
                                    <th className="px-4 py-3.5 text-right">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#e4eaec]">
                                {items.data.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="px-4 py-12 text-center text-sm text-slate-500"
                                        >
                                            <div className="mx-auto flex max-w-sm flex-col items-center gap-2">
                                                <p className="font-semibold text-slate-700">
                                                    Belum ada data kegiatan atau
                                                    berita
                                                </p>
                                                <p className="text-xs text-slate-400">
                                                    Klik tombol &ldquo;Tambah
                                                    Kegiatan&rdquo; untuk
                                                    mempublikasikan Berita
                                                    Kegiatan maupun Berita Umum.
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    items.data.map((item) => (
                                        <tr
                                            key={item.uid}
                                            className="transition hover:bg-slate-50/70"
                                        >
                                            {/* Judul & Thumbnail */}
                                            <td className="px-4 py-3.5 align-top">
                                                <div className="flex items-start gap-3">
                                                    {item.gambar_url ? (
                                                        <img
                                                            src={
                                                                item.gambar_url
                                                            }
                                                            alt={item.judul}
                                                            className="size-12 shrink-0 rounded-lg border border-[#e4eaec] object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex size-12 shrink-0 items-center justify-center rounded-lg border border-[#e4eaec] bg-[#f7fcfd] text-[10px] font-semibold text-[#087f8c]">
                                                            Foto
                                                        </div>
                                                    )}
                                                    <div className="min-w-0">
                                                        <div className="font-semibold text-slate-800">
                                                            {item.judul}
                                                        </div>
                                                        <p className="mt-0.5 line-clamp-2 max-w-md text-[11px] text-slate-500">
                                                            {item.ringkasan}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Jenis & Kategori */}
                                            <td className="px-4 py-3.5 align-top">
                                                <div className="flex flex-col gap-1">
                                                    <span
                                                        className={`inline-flex w-fit items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${
                                                            item.jenis_konten ===
                                                            'berita_kegiatan'
                                                                ? 'border-[#cbebf0] bg-[#e8f8fa] text-[#087f8c]'
                                                                : 'border-sky-200 bg-sky-50 text-sky-700'
                                                        }`}
                                                    >
                                                        {item.jenis_konten ===
                                                        'berita_kegiatan'
                                                            ? 'Berita Kegiatan'
                                                            : 'Berita Umum'}
                                                    </span>
                                                    <span className="text-[11px] font-medium text-slate-600">
                                                        {item.bidang?.nama ||
                                                            item.kategori}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Tanggal & Lokasi */}
                                            <td className="px-4 py-3.5 align-top">
                                                <div className="font-medium text-slate-800">
                                                    {item.tanggal_formatted}
                                                </div>
                                                {item.lokasi ? (
                                                    <div className="mt-0.5 max-w-[200px] truncate text-[11px] text-slate-500">
                                                        {item.lokasi}
                                                    </div>
                                                ) : (
                                                    <div className="mt-0.5 text-[11px] text-slate-400">
                                                        Publikasi Informasi
                                                    </div>
                                                )}
                                            </td>

                                            {/* Dokumentasi */}
                                            <td className="px-4 py-3.5 align-top">
                                                {item.jenis_konten ===
                                                'berita_kegiatan' ? (
                                                    <span className="inline-flex items-center rounded-md border border-[#e4eaec] bg-[#f8fafb] px-2 py-0.5 text-[11px] font-medium text-slate-600">
                                                        {
                                                            item.dokumentasi
                                                                .length
                                                        }{' '}
                                                        foto galeri
                                                    </span>
                                                ) : (
                                                    <span className="text-[11px] text-slate-400">
                                                        {item.gambar_url
                                                            ? '1 foto utama'
                                                            : 'Tanpa foto'}
                                                    </span>
                                                )}
                                            </td>

                                            {/* Aksi */}
                                            <td className="px-4 py-3.5 text-right align-top">
                                                <div className="flex flex-wrap items-center justify-end gap-1.5">
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            setDetailItem(item)
                                                        }
                                                        className="h-7 border-[#cbebf0] bg-[#f7fcfd] px-2.5 text-[11px] font-medium text-[#087f8c] shadow-none hover:bg-[#e8f8fa]"
                                                    >
                                                        Detail
                                                    </Button>

                                                    {item.can_update && (
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                openEditModal(
                                                                    item,
                                                                )
                                                            }
                                                            className="h-7 border-[#e4eaec] bg-white px-2.5 text-[11px] font-medium text-slate-700 shadow-none hover:bg-slate-50"
                                                        >
                                                            Edit
                                                        </Button>
                                                    )}

                                                    {item.can_delete && (
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                setDeletingItem(
                                                                    item,
                                                                )
                                                            }
                                                            className="h-7 border-rose-200 bg-white px-2.5 text-[11px] font-medium text-rose-600 shadow-none hover:bg-rose-50 hover:text-rose-700"
                                                        >
                                                            Hapus
                                                        </Button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Footer */}
                    {items.total > 0 && (
                        <div className="flex flex-col items-center justify-between gap-3 border-t border-[#e4eaec] bg-[#f8fafb] px-4 py-3 text-xs text-slate-500 sm:flex-row">
                            <div>
                                Menampilkan{' '}
                                <span className="font-semibold text-slate-700">
                                    {items.from ?? 0}
                                </span>{' '}
                                –{' '}
                                <span className="font-semibold text-slate-700">
                                    {items.to ?? 0}
                                </span>{' '}
                                dari{' '}
                                <span className="font-semibold text-slate-700">
                                    {items.total}
                                </span>{' '}
                                publikasi
                            </div>

                            {items.last_page > 1 && (
                                <div className="flex flex-wrap items-center gap-1">
                                    {items.links.map((link, idx) => {
                                        const label = decodePaginationLabel(
                                            link.label,
                                        );
                                        if (!link.url) {
                                            return (
                                                <span
                                                    key={idx}
                                                    className="rounded-lg border border-[#e4eaec] bg-slate-50 px-2.5 py-1 text-xs text-slate-300"
                                                >
                                                    {label}
                                                </span>
                                            );
                                        }

                                        return (
                                            <button
                                                key={idx}
                                                type="button"
                                                onClick={() =>
                                                    router.get(
                                                        link.url!,
                                                        {},
                                                        {
                                                            preserveState: true,
                                                            preserveScroll: true,
                                                        },
                                                    )
                                                }
                                                className={`rounded-lg border px-2.5 py-1 text-xs font-medium transition ${
                                                    link.active
                                                        ? 'border-[#14bace] bg-[#14bace] text-white'
                                                        : 'border-[#cbebf0] bg-[#f7fcfd] text-[#087f8c] hover:bg-[#e8f8fa]'
                                                }`}
                                            >
                                                {label}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* MODAL CREATE / EDIT KEGIATAN & BERITA UMUM */}
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="max-h-[90vh] overflow-y-auto border-[#e4eaec] bg-white font-poppins text-slate-800 sm:max-w-2xl">
                    <form onSubmit={handleFormSubmit} className="space-y-4">
                        <DialogHeader>
                            <DialogTitle className="text-lg font-bold text-slate-800">
                                {editingItem
                                    ? `Edit ${editingItem.jenis_konten === 'berita_umum' ? 'Berita Umum' : 'Berita Kegiatan'}`
                                    : 'Tambah Publikasi Baru'}
                            </DialogTitle>
                            <DialogDescription className="text-xs text-slate-500">
                                Pilih jenis publikasi: Berita Kegiatan (otomatis
                                masuk Beranda & Rekap Tahunan) atau Berita Umum.
                            </DialogDescription>
                        </DialogHeader>

                        {/* Pilihan 2 Tipe Form: Berita Kegiatan vs Berita Umum */}
                        {!editingItem ? (
                            <div className="grid grid-cols-2 gap-2 rounded-xl border border-[#cbebf0] bg-[#f7fcfd] p-1.5">
                                <button
                                    type="button"
                                    onClick={() =>
                                        form.setData(
                                            'jenis_konten',
                                            'berita_kegiatan',
                                        )
                                    }
                                    className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                                        activeFormJenis === 'berita_kegiatan'
                                            ? 'bg-[#14bace] text-white shadow-2xs'
                                            : 'text-[#087f8c] hover:bg-[#e8f8fa]'
                                    }`}
                                >
                                    Berita Kegiatan
                                </button>
                                <button
                                    type="button"
                                    onClick={() =>
                                        form.setData(
                                            'jenis_konten',
                                            'berita_umum',
                                        )
                                    }
                                    className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                                        activeFormJenis === 'berita_umum'
                                            ? 'bg-[#14bace] text-white shadow-2xs'
                                            : 'text-[#087f8c] hover:bg-[#e8f8fa]'
                                    }`}
                                >
                                    Berita Umum
                                </button>
                            </div>
                        ) : (
                            <div className="inline-block rounded-md border border-[#cbebf0] bg-[#e8f8fa] px-3 py-1 text-xs font-semibold text-[#087f8c]">
                                Tipe:{' '}
                                {activeFormJenis === 'berita_kegiatan'
                                    ? 'Berita Kegiatan'
                                    : 'Berita Umum'}
                            </div>
                        )}

                        {activeFormJenis === 'berita_kegiatan' ? (
                            <div className="space-y-4">
                                {/* 1. Judul Kegiatan / Berita */}
                                <div className="space-y-1.5">
                                    <Label
                                        htmlFor="judul_kegiatan"
                                        className="text-xs font-medium text-slate-700"
                                    >
                                        Judul Kegiatan / Berita{' '}
                                        <span className="text-rose-500">*</span>
                                    </Label>
                                    <Input
                                        id="judul_kegiatan"
                                        required
                                        value={form.data.judul}
                                        onChange={(e) =>
                                            form.setData(
                                                'judul',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Contoh: Santunan Rutin & Bingkisan Sekolah Anak Binaan"
                                        className="border-[#e4eaec] bg-white text-slate-800 shadow-none focus-visible:border-[#14bace] focus-visible:ring-2 focus-visible:ring-[#14bace]/20"
                                    />
                                    <InputError message={form.errors.judul} />
                                </div>

                                {/* 2. Dokumentasi Kegiatan Utama (Gambar Sampul) */}
                                <div className="space-y-2 rounded-xl border border-[#e4eaec] bg-[#fbfcfc] p-3.5">
                                    <Label
                                        htmlFor="gambar_utama"
                                        className="text-xs font-medium text-slate-700"
                                    >
                                        Dokumentasi Kegiatan Utama (Foto Halaman
                                        Depan)
                                    </Label>
                                    <input
                                        ref={mainImageInputRef}
                                        id="gambar_utama"
                                        type="file"
                                        accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                                        onChange={handleMainImageChange}
                                        className="block w-full cursor-pointer text-xs text-slate-600 file:mr-3 file:cursor-pointer file:rounded-md file:border file:border-[#cbebf0] file:bg-[#f7fcfd] file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-[#087f8c] hover:file:bg-[#e8f8fa]"
                                    />
                                    {mainImagePreview && (
                                        <div className="mt-2 flex items-start gap-3">
                                            <img
                                                src={mainImagePreview}
                                                alt="Preview gambar utama"
                                                className="h-24 w-36 rounded-lg border border-[#e4eaec] object-cover"
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={handleRemoveMainImage}
                                                className="border-rose-200 bg-white text-xs text-rose-600 hover:bg-rose-50"
                                            >
                                                Hapus Gambar Utama
                                            </Button>
                                        </div>
                                    )}
                                    <InputError message={form.errors.gambar} />
                                </div>

                                {/* 3, 4, 5: Kategori Bidang, Tanggal Pelaksanaan, Lokasi */}
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                                    <div className="space-y-1.5">
                                        <Label
                                            htmlFor="bidang_id"
                                            className="text-xs font-medium text-slate-700"
                                        >
                                            Kategori Bidang{' '}
                                            <span className="text-rose-500">
                                                *
                                            </span>
                                        </Label>
                                        <BrandSelect
                                            id="bidang_id"
                                            disabled={
                                                !permissions.is_super_admin
                                            }
                                            value={form.data.bidang_id}
                                            onValueChange={(val) =>
                                                form.setData('bidang_id', val)
                                            }
                                            options={bidangList.map((b) => ({
                                                value: String(b.id),
                                                label: b.nama,
                                            }))}
                                        />
                                        <InputError
                                            message={form.errors.bidang_id}
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label
                                            htmlFor="tanggal_kegiatan"
                                            className="text-xs font-medium text-slate-700"
                                        >
                                            Tanggal Pelaksanaan{' '}
                                            <span className="text-rose-500">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            id="tanggal_kegiatan"
                                            type="date"
                                            required
                                            value={form.data.tanggal_kegiatan}
                                            onChange={(e) =>
                                                form.setData(
                                                    'tanggal_kegiatan',
                                                    e.target.value,
                                                )
                                            }
                                            className="border-[#e4eaec] bg-white text-slate-800 shadow-none focus-visible:border-[#14bace] focus-visible:ring-2 focus-visible:ring-[#14bace]/20"
                                        />
                                        <InputError
                                            message={
                                                form.errors.tanggal_kegiatan
                                            }
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label
                                            htmlFor="lokasi"
                                            className="text-xs font-medium text-slate-700"
                                        >
                                            Lokasi Kegiatan{' '}
                                            <span className="text-rose-500">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            id="lokasi"
                                            required
                                            value={form.data.lokasi}
                                            onChange={(e) =>
                                                form.setData(
                                                    'lokasi',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Contoh: Masjid Besar Ujungberung"
                                            className="border-[#e4eaec] bg-white text-slate-800 shadow-none focus-visible:border-[#14bace] focus-visible:ring-2 focus-visible:ring-[#14bace]/20"
                                        />
                                        <InputError
                                            message={form.errors.lokasi}
                                        />
                                    </div>
                                </div>

                                {/* 6. Deskripsi Isi Berita Kegiatan */}
                                <div className="space-y-1.5">
                                    <Label
                                        htmlFor="isi_berita"
                                        className="text-xs font-medium text-slate-700"
                                    >
                                        Deskripsi Isi Berita Kegiatan{' '}
                                        <span className="text-rose-500">*</span>
                                    </Label>
                                    <textarea
                                        id="isi_berita"
                                        required
                                        rows={5}
                                        value={form.data.isi_berita}
                                        onChange={(e) =>
                                            form.setData(
                                                'isi_berita',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Tuliskan deskripsi lengkap pelaksanaan kegiatan dan dampaknya..."
                                        className="w-full rounded-lg border border-[#e4eaec] bg-white px-3 py-2 text-xs leading-relaxed text-slate-800 focus:border-[#14bace] focus:ring-2 focus:ring-[#14bace]/20 focus:outline-hidden"
                                    />
                                    <InputError
                                        message={form.errors.isi_berita}
                                    />
                                </div>

                                {/* 7. Dokumentasi Kegiatan (Galeri Dalam Berita) */}
                                <div className="space-y-3 rounded-xl border border-[#cbebf0] bg-[#f7fcfd] p-3.5">
                                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                                        <div>
                                            <Label
                                                htmlFor="dokumentasi_files"
                                                className="text-xs font-semibold text-[#087f8c]"
                                            >
                                                Dokumentasi Kegiatan (Galeri
                                                Dalam Berita)
                                            </Label>
                                            <p className="text-[11px] text-slate-500">
                                                Tambahkan beberapa foto
                                                pelaksanaan (JPG, PNG, WEBP maks
                                                5 MB/foto).
                                            </p>
                                        </div>
                                    </div>

                                    <input
                                        ref={galleryInputRef}
                                        id="dokumentasi_files"
                                        type="file"
                                        multiple
                                        accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                                        onChange={handleAddGalleryFiles}
                                        className="block w-full cursor-pointer text-xs text-slate-600 file:mr-3 file:cursor-pointer file:rounded-md file:border file:border-[#cbebf0] file:bg-white file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-[#087f8c] hover:file:bg-[#e8f8fa]"
                                    />

                                    {/* Foto dokumentasi tersimpan (Edit mode) */}
                                    {retainedDokumentasi.length > 0 && (
                                        <div className="space-y-2">
                                            <span className="text-[11px] font-semibold text-slate-600">
                                                Dokumentasi Tersimpan (
                                                {retainedDokumentasi.length}):
                                            </span>
                                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                                {retainedDokumentasi.map(
                                                    (doc, idx) => (
                                                        <div
                                                            key={`${doc.url}-${idx}`}
                                                            className="flex items-center gap-2.5 rounded-lg border border-[#e4eaec] bg-white p-2"
                                                        >
                                                            <img
                                                                src={doc.url}
                                                                alt={
                                                                    doc.caption
                                                                }
                                                                className="size-12 shrink-0 rounded object-cover"
                                                            />
                                                            <span className="min-w-0 flex-1 truncate text-[11px] text-slate-700">
                                                                {doc.caption}
                                                            </span>
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleRemoveRetainedDoc(
                                                                        idx,
                                                                    )
                                                                }
                                                                className="shrink-0 text-[11px] font-semibold text-rose-600 hover:underline"
                                                            >
                                                                Hapus
                                                            </button>
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Foto dokumentasi baru ditambahkan */}
                                    {newGalleryEntries.length > 0 && (
                                        <div className="space-y-2">
                                            <span className="text-[11px] font-semibold text-[#087f8c]">
                                                Foto Baru Siap Diunggah (
                                                {newGalleryEntries.length}):
                                            </span>
                                            <div className="space-y-2">
                                                {newGalleryEntries.map(
                                                    (entry, idx) => (
                                                        <div
                                                            key={
                                                                entry.previewUrl
                                                            }
                                                            className="flex flex-col gap-2 rounded-lg border border-[#cbebf0] bg-white p-2 sm:flex-row sm:items-center"
                                                        >
                                                            <img
                                                                src={
                                                                    entry.previewUrl
                                                                }
                                                                alt={
                                                                    entry.file
                                                                        .name
                                                                }
                                                                className="size-12 shrink-0 rounded object-cover"
                                                            />
                                                            <input
                                                                type="text"
                                                                value={
                                                                    entry.caption
                                                                }
                                                                onChange={(e) =>
                                                                    handleUpdateGalleryCaption(
                                                                        idx,
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                placeholder="Keterangan foto (opsional)"
                                                                className="h-8 flex-1 rounded-md border border-[#e4eaec] px-2.5 text-xs text-slate-800 focus:border-[#14bace] focus:outline-hidden"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleRemoveNewGalleryEntry(
                                                                        idx,
                                                                    )
                                                                }
                                                                className="shrink-0 text-left text-[11px] font-semibold text-rose-600 hover:underline sm:px-2"
                                                            >
                                                                Batal
                                                            </button>
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    <InputError
                                        message={
                                            formErrors.dokumentasi_files ||
                                            formErrors['dokumentasi_files.0']
                                        }
                                    />
                                </div>
                            </div>
                        ) : (
                            /* Form Berita Umum */
                            <div className="space-y-4">
                                {/* 1. Judul Berita */}
                                <div className="space-y-1.5">
                                    <Label
                                        htmlFor="judul_berita_umum"
                                        className="text-xs font-medium text-slate-700"
                                    >
                                        Judul Berita{' '}
                                        <span className="text-rose-500">*</span>
                                    </Label>
                                    <Input
                                        id="judul_berita_umum"
                                        required
                                        value={form.data.judul}
                                        onChange={(e) =>
                                            form.setData(
                                                'judul',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Contoh: Jadwal Penyaluran Santunan Bulan Ini"
                                        className="border-[#e4eaec] bg-white text-slate-800 shadow-none focus-visible:border-[#14bace] focus-visible:ring-2 focus-visible:ring-[#14bace]/20"
                                    />
                                    <InputError message={form.errors.judul} />
                                </div>

                                {/* 2. Foto Berita */}
                                <div className="space-y-2 rounded-xl border border-[#e4eaec] bg-[#fbfcfc] p-3.5">
                                    <Label
                                        htmlFor="foto_berita_umum"
                                        className="text-xs font-medium text-slate-700"
                                    >
                                        Foto Berita (Opsional)
                                    </Label>
                                    <input
                                        ref={mainImageInputRef}
                                        id="foto_berita_umum"
                                        type="file"
                                        accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                                        onChange={handleMainImageChange}
                                        className="block w-full cursor-pointer text-xs text-slate-600 file:mr-3 file:cursor-pointer file:rounded-md file:border file:border-[#cbebf0] file:bg-[#f7fcfd] file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-[#087f8c] hover:file:bg-[#e8f8fa]"
                                    />
                                    {mainImagePreview && (
                                        <div className="mt-2 flex items-start gap-3">
                                            <img
                                                src={mainImagePreview}
                                                alt="Preview foto berita"
                                                className="h-24 w-36 rounded-lg border border-[#e4eaec] object-cover"
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={handleRemoveMainImage}
                                                className="border-rose-200 bg-white text-xs text-rose-600 hover:bg-rose-50"
                                            >
                                                Hapus Foto
                                            </Button>
                                        </div>
                                    )}
                                    <InputError message={form.errors.gambar} />
                                </div>

                                {/* 3. Deskripsi Isi Berita */}
                                <div className="space-y-1.5">
                                    <Label
                                        htmlFor="isi_berita_umum"
                                        className="text-xs font-medium text-slate-700"
                                    >
                                        Deskripsi Isi Berita{' '}
                                        <span className="text-rose-500">*</span>
                                    </Label>
                                    <textarea
                                        id="isi_berita_umum"
                                        required
                                        rows={6}
                                        value={form.data.isi}
                                        onChange={(e) =>
                                            form.setData('isi', e.target.value)
                                        }
                                        placeholder="Tuliskan isi berita, artikel, atau pengumuman untuk masyarakat..."
                                        className="w-full rounded-lg border border-[#e4eaec] bg-white px-3 py-2 text-xs leading-relaxed text-slate-800 focus:border-[#14bace] focus:ring-2 focus:ring-[#14bace]/20 focus:outline-hidden"
                                    />
                                    <InputError message={form.errors.isi} />
                                </div>
                            </div>
                        )}

                        <DialogFooter className="gap-2 pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsFormOpen(false)}
                                className="border-[#e4eaec] bg-white text-xs font-medium text-slate-600 shadow-none hover:bg-slate-50"
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                disabled={form.processing}
                                className="bg-[#14bace] text-xs font-semibold text-white shadow-none hover:bg-[#0fa0ae]"
                            >
                                {form.processing
                                    ? 'Menyimpan...'
                                    : editingItem
                                      ? 'Simpan Perubahan'
                                      : 'Publikasikan'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* MODAL DETAIL */}
            <Dialog
                open={detailItem !== null}
                onOpenChange={(open) => !open && setDetailItem(null)}
            >
                <DialogContent className="max-h-[90vh] overflow-y-auto border-[#e4eaec] bg-white font-poppins text-slate-800 sm:max-w-2xl">
                    {detailItem && (
                        <>
                            <DialogHeader>
                                <div className="flex flex-wrap items-center gap-2">
                                    <span
                                        className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${
                                            detailItem.jenis_konten ===
                                            'berita_kegiatan'
                                                ? 'border-[#cbebf0] bg-[#e8f8fa] text-[#087f8c]'
                                                : 'border-sky-200 bg-sky-50 text-sky-700'
                                        }`}
                                    >
                                        {detailItem.jenis_konten ===
                                        'berita_kegiatan'
                                            ? 'Berita Kegiatan'
                                            : 'Berita Umum'}
                                    </span>
                                    <span className="text-xs text-slate-500">
                                        {detailItem.bidang?.nama ||
                                            detailItem.kategori}{' '}
                                        • {detailItem.tanggal_formatted}
                                    </span>
                                </div>
                                <DialogTitle className="mt-1 text-xl font-bold text-slate-800">
                                    {detailItem.judul}
                                </DialogTitle>
                                {detailItem.lokasi && (
                                    <DialogDescription className="text-xs text-slate-500">
                                        Lokasi: {detailItem.lokasi} • Penulis:{' '}
                                        {detailItem.penulis}
                                    </DialogDescription>
                                )}
                            </DialogHeader>

                            <div className="space-y-4 py-2 text-xs">
                                {detailItem.gambar_url && (
                                    <img
                                        src={detailItem.gambar_url}
                                        alt={detailItem.judul}
                                        className="max-h-72 w-full rounded-xl border border-[#e4eaec] object-cover"
                                    />
                                )}

                                <div className="space-y-2.5 rounded-xl border border-[#e4eaec] bg-[#fbfcfc] p-4 leading-relaxed text-slate-700">
                                    {detailItem.isi_konten
                                        .split(/\r?\n/)
                                        .filter((line) => line.trim() !== '')
                                        .map((para, idx) => (
                                            <p key={idx}>{para}</p>
                                        ))}
                                </div>

                                {detailItem.dokumentasi.length > 0 && (
                                    <div className="space-y-2">
                                        <span className="block font-semibold text-slate-700">
                                            Galeri Dokumentasi (
                                            {detailItem.dokumentasi.length}{' '}
                                            foto)
                                        </span>
                                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                            {detailItem.dokumentasi.map(
                                                (doc, idx) => (
                                                    <figure
                                                        key={idx}
                                                        className="overflow-hidden rounded-xl border border-[#e4eaec] bg-white"
                                                    >
                                                        <img
                                                            src={doc.url}
                                                            alt={doc.caption}
                                                            className="h-36 w-full object-cover"
                                                        />
                                                        {doc.caption && (
                                                            <figcaption className="px-3 py-2 text-[11px] text-slate-600">
                                                                {doc.caption}
                                                            </figcaption>
                                                        )}
                                                    </figure>
                                                ),
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <DialogFooter className="flex flex-wrap items-center justify-between gap-2 sm:justify-between">
                                <a
                                    href={detailItem.public_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-xs font-semibold text-[#087f8c] underline hover:text-[#14bace]"
                                >
                                    Buka di Halaman Publik
                                </a>
                                <div className="flex items-center gap-2">
                                    {detailItem.can_update && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => {
                                                const target = detailItem;
                                                setDetailItem(null);
                                                openEditModal(target);
                                            }}
                                            className="border-[#e4eaec] bg-white text-xs font-medium text-slate-700 shadow-none hover:bg-slate-50"
                                        >
                                            Edit
                                        </Button>
                                    )}
                                    <Button
                                        type="button"
                                        onClick={() => setDetailItem(null)}
                                        className="bg-[#14bace] text-xs font-semibold text-white shadow-none hover:bg-[#0fa0ae]"
                                    >
                                        Tutup
                                    </Button>
                                </div>
                            </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>

            {/* MODAL KONFIRMASI HAPUS */}
            <Dialog
                open={deletingItem !== null}
                onOpenChange={(open) => !open && setDeletingItem(null)}
            >
                <DialogContent className="border-[#e4eaec] bg-white font-poppins text-slate-800 sm:max-w-md">
                    {deletingItem && (
                        <>
                            <DialogHeader>
                                <DialogTitle className="text-base font-bold text-slate-800">
                                    Hapus{' '}
                                    {deletingItem.jenis_konten === 'berita_umum'
                                        ? 'Berita Umum'
                                        : 'Berita Kegiatan'}
                                    ?
                                </DialogTitle>
                                <DialogDescription className="text-xs text-slate-600">
                                    Anda akan menghapus{' '}
                                    <strong className="font-semibold text-slate-800">
                                        {deletingItem.judul}
                                    </strong>
                                    . Publikasi ini juga akan dihapus dari
                                    halaman publik website dan Rekap Tahunan.
                                </DialogDescription>
                            </DialogHeader>

                            <DialogFooter className="gap-2 pt-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={isDeleting}
                                    onClick={() => setDeletingItem(null)}
                                    className="border-[#e4eaec] bg-white text-xs font-medium text-slate-600 shadow-none hover:bg-slate-50"
                                >
                                    Batal
                                </Button>
                                <Button
                                    type="button"
                                    disabled={isDeleting}
                                    onClick={handleConfirmDelete}
                                    className="bg-rose-600 text-xs font-semibold text-white shadow-none hover:bg-rose-700"
                                >
                                    {isDeleting
                                        ? 'Menghapus...'
                                        : 'Ya, Hapus Data'}
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}

KegiatanAdmin.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Pengelolaan Kegiatan', href: '/admin/kegiatan' },
    ],
};
