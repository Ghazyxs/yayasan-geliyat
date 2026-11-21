<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Pengguna\StorePenggunaRequest;
use App\Models\Bidang;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class PenggunaController extends Controller
{
    /**
     * Tampilkan daftar akun pengurus yayasan terdaftar (khusus Super Admin).
     */
    public function index(Request $request): Response
    {
        $users = User::query()
            ->with('bidang:id,kode,nama')
            ->orderByRaw("CASE WHEN role = 'super_admin' THEN 0 ELSE 1 END")
            ->orderBy('id')
            ->get()
            ->map(fn (User $u) => [
                'id' => $u->id,
                'name' => $u->name,
                'email' => $u->email,
                'phone' => $u->phone,
                'role' => $u->role,
                'role_label' => $u->isSuperAdmin() ? 'Super Admin' : 'Admin Bidang',
                'bidang_id' => $u->bidang_id,
                'bidang_nama' => $u->isSuperAdmin()
                    ? 'Lintas Seluruh Bidang (Pimpinan)'
                    : ($u->bidang?->nama ?? '-'),
                'is_active' => (bool) $u->is_active,
                'status_label' => $u->is_active ? 'Aktif' : 'Nonaktif',
                'created_at_formatted' => $u->created_at?->format('d M Y'),
            ])
            ->values()
            ->all();

        $bidangList = Bidang::query()
            ->orderBy('id')
            ->get(['id', 'kode', 'nama']);

        return Inertia::render('admin/pengguna/index', [
            'users' => $users,
            'bidangList' => $bidangList,
        ]);
    }

    /**
     * Simpan akun pengurus baru ke database menggunakan hashing & skema autentikasi existing.
     */
    public function store(StorePenggunaRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $user = DB::transaction(function () use ($validated) {
            return User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'role' => $validated['role'],
                'bidang_id' => $validated['role'] === 'super_admin'
                    ? null
                    : (int) $validated['bidang_id'],
                'phone' => $validated['phone'] ?? null,
                'is_active' => true,
                'email_verified_at' => now(),
            ]);
        });

        return redirect()
            ->route('admin.pengguna')
            ->with('success', "Akun pengurus {$user->name} ({$user->email}) berhasil ditambahkan.");
    }
}
