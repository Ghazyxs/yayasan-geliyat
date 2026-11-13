import { useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import {
    ChartNoAxesCombined,
    FileText,
    Download,
    Eye,
    Edit3,
    Calendar,
    Building2,
    CheckCircle2,
    AlertTriangle,
    Save,
    X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

export interface AdminLaporanItem {
    id: number | null;
    tahun: number;
    judul: string;
    nomor_dokumen: string | null;
    tanggal_penerbitan: string | null;
    tanggal_formatted: string;
    jumlah_kegiatan: number;
    penandatangan_ketua: string;
    penandatangan_sekretaris: string;
    is_published: boolean;
    latar_belakang: string | null;
    tujuan_laporan: string | null;
    kesimpulan: string | null;
    harapan_evaluasi: string | null;
    preview_url: string;
    download_url: string;
}

interface LaporanAdminProps {
    laporanList: AdminLaporanItem[];
}

export default function LaporanAdmin({ laporanList = [] }: LaporanAdminProps) {
    const pageProps = usePage<{
        flash?: { success?: string | null; error?: string | null };
    }>().props;

    const [editItem, setEditItem] = useState<AdminLaporanItem | null>(null);

    const editForm = useForm({
        judul: '',
        nomor_dokumen: '',
        tanggal_penerbitan: '',
        latar_belakang: '',
        tujuan_laporan: '',
        kesimpulan: '',
        harapan_evaluasi: '',
        penandatangan_ketua: 'Nina Mahdiah, S.Ag., M.Sos.',
        penandatangan_sekretaris: 'Juaningsih',
    });

    const handleOpenEdit = (item: AdminLaporanItem) => {
        setEditItem(item);
        editForm.setData({
            judul: item.judul || `Laporan Kegiatan Tahunan Yayasan Geliyat Mahdiesa Nahate Tahun ${item.tahun}`,
            nomor_dokumen: item.nomor_dokumen || `01/LKT/YGM/XII/${item.tahun}`,
            tanggal_penerbitan: item.tanggal_penerbitan || `${item.tahun}-12-31`,
            latar_belakang: item.latar_belakang || '',
            tujuan_laporan: item.tujuan_laporan || '',
            kesimpulan: item.kesimpulan || '',
            harapan_evaluasi: item.harapan_evaluasi || '',
            penandatangan_ketua: item.penandatangan_ketua || 'Nina Mahdiah, S.Ag., M.Sos.',
            penandatangan_sekretaris: item.penandatangan_sekretaris || 'Juaningsih',
        });
    };

    const handleSaveEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editItem) return;

        editForm.put(route('admin.laporan.update', editItem.tahun), {
            preserveScroll: true,
            onSuccess: () => {
                setEditItem(null);
            },
        });
    };

    return (
        <>
            <Head title="Pengelolaan Laporan Kegiatan Tahunan" />

            <div className="flex min-h-screen flex-col gap-6 bg-[#f8fafb] p-4 font-poppins text-slate-800 sm:p-6 lg:p-8">
                {/* Flash Messages */}
                {pageProps.flash?.success && (
                    <div className="flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50/90 px-4 py-3 text-sm text-emerald-800 shadow-2xs">
                        <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
                        <span>{pageProps.flash.success}</span>
                    </div>
                )}

                {/* Header Section */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="mb-2 flex w-fit items-center gap-2 rounded-md bg-[#e8f8fa] px-2.5 py-1 text-xs font-semibold text-[#087f8c]">
                            <ChartNoAxesCombined className="size-3.5" />
                            Dokumen Pertanggungjawaban Resmi
                        </div>
                        <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
                            Pengelolaan Laporan Kegiatan Tahunan
                        </h1>
                        <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                            Kelola narasi pendahuluan, penutup, nomor dokumen, dan hasil cetak PDF laporan resmi kegiatan tahunan yayasan.
                        </p>
                    </div>
                </div>

                {/* Daftar Dokumen Laporan Tahunan per Tahun */}
                <div className="space-y-4">
                    {laporanList.map((doc) => (
                        <div
                            key={doc.tahun}
                            className="rounded-2xl border border-[#e4eaec] bg-white p-5 shadow-xs transition hover:border-[#14bace]/40 sm:p-6"
                        >
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                <div className="flex items-start gap-3.5">
                                    <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600 ring-1 ring-rose-100">
                                        <FileText className="size-6" />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="rounded-full bg-[#e8f8fa] px-2.5 py-0.5 text-xs font-bold text-[#087f8c]">
                                                Tahun {doc.tahun}
                                            </span>
                                            {doc.nomor_dokumen && (
                                                <span className="font-mono text-xs text-slate-500">
                                                    No: {doc.nomor_dokumen}
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="text-base font-bold text-slate-800 sm:text-lg">
                                            {doc.judul}
                                        </h3>
                                        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="size-3.5 text-slate-400" />
                                                <span>Penerbitan: {doc.tanggal_formatted}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Building2 className="size-3.5 text-slate-400" />
                                                <span>{doc.jumlah_kegiatan} Kegiatan Terlampir di Database</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Aksi Admin */}
                                <div className="flex flex-wrap items-center gap-2 sm:self-center">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleOpenEdit(doc)}
                                        className="flex items-center gap-1.5 font-semibold text-slate-700"
                                    >
                                        <Edit3 className="size-3.5 text-[#087f8c]" />
                                        <span>Edit Narasi</span>
                                    </Button>

                                    <a
                                        href={doc.preview_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 rounded-lg border border-[#e4eaec] bg-white px-3 py-1.5 text-xs font-semibold text-[#087f8c] shadow-2xs hover:bg-[#e8f8fa]"
                                    >
                                        <Eye className="size-3.5" />
                                        <span>Lihat PDF</span>
                                    </a>

                                    <a
                                        href={doc.download_url}
                                        className="inline-flex items-center gap-1.5 rounded-lg bg-[#087f8c] px-3 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-[#066570]"
                                    >
                                        <Download className="size-3.5" />
                                        <span>Unduh PDF</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal Edit Narasi Laporan */}
            {editItem && (
                <Dialog open={!!editItem} onOpenChange={(open) => !open && setEditItem(null)}>
                    <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto font-poppins">
                        <DialogHeader>
                            <DialogTitle className="text-lg font-bold text-slate-800">
                                Edit Dokumen Laporan Tahunan {editItem.tahun}
                            </DialogTitle>
                            <DialogDescription className="text-xs text-slate-500">
                                Perubahan narasi pendahuluan, penutup, dan tanda tangan akan otomatis tercermin pada dokumen PDF resmi.
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleSaveEdit} className="space-y-4 py-2 text-xs">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="font-semibold text-slate-700">Judul Dokumen</label>
                                    <input
                                        type="text"
                                        required
                                        value={editForm.data.judul}
                                        onChange={(e) => editForm.setData('judul', e.target.value)}
                                        className="mt-1 w-full rounded-lg border border-[#e4eaec] p-2 text-xs outline-hidden focus:border-[#14bace]"
                                    />
                                </div>
                                <div>
                                    <label className="font-semibold text-slate-700">Nomor Dokumen/Surat</label>
                                    <input
                                        type="text"
                                        value={editForm.data.nomor_dokumen}
                                        onChange={(e) => editForm.setData('nomor_dokumen', e.target.value)}
                                        className="mt-1 w-full rounded-lg border border-[#e4eaec] p-2 text-xs outline-hidden focus:border-[#14bace]"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="font-semibold text-slate-700">Tanggal Pengesahan/Penerbitan</label>
                                <input
                                    type="date"
                                    value={editForm.data.tanggal_penerbitan}
                                    onChange={(e) => editForm.setData('tanggal_penerbitan', e.target.value)}
                                    className="mt-1 w-full rounded-lg border border-[#e4eaec] p-2 text-xs outline-hidden focus:border-[#14bace]"
                                />
                            </div>

                            <div>
                                <label className="font-semibold text-slate-700">Latar Belakang (Bab I)</label>
                                <textarea
                                    rows={3}
                                    value={editForm.data.latar_belakang}
                                    onChange={(e) => editForm.setData('latar_belakang', e.target.value)}
                                    className="mt-1 w-full rounded-lg border border-[#e4eaec] p-2 text-xs outline-hidden focus:border-[#14bace]"
                                />
                            </div>

                            <div>
                                <label className="font-semibold text-slate-700">Tujuan Laporan</label>
                                <textarea
                                    rows={3}
                                    value={editForm.data.tujuan_laporan}
                                    onChange={(e) => editForm.setData('tujuan_laporan', e.target.value)}
                                    className="mt-1 w-full rounded-lg border border-[#e4eaec] p-2 text-xs outline-hidden focus:border-[#14bace]"
                                />
                            </div>

                            <div>
                                <label className="font-semibold text-slate-700">Kesimpulan (Bab IV)</label>
                                <textarea
                                    rows={3}
                                    value={editForm.data.kesimpulan}
                                    onChange={(e) => editForm.setData('kesimpulan', e.target.value)}
                                    className="mt-1 w-full rounded-lg border border-[#e4eaec] p-2 text-xs outline-hidden focus:border-[#14bace]"
                                />
                            </div>

                            <div>
                                <label className="font-semibold text-slate-700">Evaluasi & Harapan Yayasan</label>
                                <textarea
                                    rows={3}
                                    value={editForm.data.harapan_evaluasi}
                                    onChange={(e) => editForm.setData('harapan_evaluasi', e.target.value)}
                                    className="mt-1 w-full rounded-lg border border-[#e4eaec] p-2 text-xs outline-hidden focus:border-[#14bace]"
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="font-semibold text-slate-700">Penandatangan Ketua</label>
                                    <input
                                        type="text"
                                        required
                                        value={editForm.data.penandatangan_ketua}
                                        onChange={(e) => editForm.setData('penandatangan_ketua', e.target.value)}
                                        className="mt-1 w-full rounded-lg border border-[#e4eaec] p-2 text-xs outline-hidden focus:border-[#14bace]"
                                    />
                                </div>
                                <div>
                                    <label className="font-semibold text-slate-700">Penandatangan Sekretaris</label>
                                    <input
                                        type="text"
                                        required
                                        value={editForm.data.penandatangan_sekretaris}
                                        onChange={(e) => editForm.setData('penandatangan_sekretaris', e.target.value)}
                                        className="mt-1 w-full rounded-lg border border-[#e4eaec] p-2 text-xs outline-hidden focus:border-[#14bace]"
                                    />
                                </div>
                            </div>

                            <DialogFooter className="pt-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setEditItem(null)}
                                >
                                    Batal
                                </Button>
                                <Button
                                    type="submit"
                                    size="sm"
                                    disabled={editForm.processing}
                                    className="bg-[#087f8c] hover:bg-[#066570]"
                                >
                                    <Save className="mr-1.5 size-3.5" />
                                    <span>{editForm.processing ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
}

LaporanAdmin.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Laporan Tahunan', href: '/admin/laporan' },
    ],
};
