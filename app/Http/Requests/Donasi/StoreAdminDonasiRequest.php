<?php

namespace App\Http\Requests\Donasi;

use App\Models\Donasi;
use Illuminate\Support\Facades\Gate;

class StoreAdminDonasiRequest extends StorePublicDonasiRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null && Gate::forUser($this->user())->allows('create', Donasi::class);
    }
}
