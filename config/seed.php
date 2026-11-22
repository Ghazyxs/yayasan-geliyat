<?php

return [
    'allow_production' => (bool) env('SEED_ALLOW_PRODUCTION', false),

    'super_admin' => [
        'name' => (string) env('SEED_SUPER_ADMIN_NAME', 'Nina Mahdiah, S.Ag., M.Sos.'),
        'email' => (string) env('SEED_SUPER_ADMIN_EMAIL', 'ketua@geliyat.or.id'),
        'password' => env('SEED_SUPER_ADMIN_PASSWORD'),
    ],

    'admin' => [
        'name' => (string) env('SEED_ADMIN_NAME', 'Juaningsih'),
        'email' => (string) env('SEED_ADMIN_EMAIL', 'admin@geliyat.or.id'),
        'password' => env('SEED_ADMIN_PASSWORD'),
    ],
];
