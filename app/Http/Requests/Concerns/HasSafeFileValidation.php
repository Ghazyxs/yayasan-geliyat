<?php

namespace App\Http\Requests\Concerns;

use Closure;
use Illuminate\Http\UploadedFile;

trait HasSafeFileValidation
{
    /**
     * Validasi keamanan nama file untuk mencegah path traversal & double extension berbahaya.
     */
    protected function safeFilenameRule(string $label = 'file'): Closure
    {
        return function (string $attribute, mixed $value, Closure $fail) use ($label): void {
            if (! $value instanceof UploadedFile) {
                $fail("Berkas {$label} tidak valid.");

                return;
            }

            $originalName = $value->getClientOriginalName();

            if ($originalName === '' || mb_strlen($originalName) > 200) {
                $fail("Nama berkas {$label} tidak valid atau terlalu panjang.");

                return;
            }

            if (
                str_contains($originalName, '..')
                || str_contains($originalName, '/')
                || str_contains($originalName, '\\')
                || str_contains($originalName, "\0")
            ) {
                $fail("Nama berkas {$label} mengandung karakter yang tidak diizinkan.");

                return;
            }

            if (preg_match('/\.(php\d*|phtml|phar|exe|sh|bat|cmd|js|jsp|asp|aspx|cgi|pl|py|svg|html|htm)(\.|$)/i', $originalName)) {
                $fail("Ekstensi atau nama berkas {$label} tidak diizinkan.");
            }
        };
    }
}
