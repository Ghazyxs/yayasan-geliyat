Yayasan Geliyat — Orphan Care & Donation Management Platform

Together Nurturing Hope, One Step Every Day (Gerakan Peduli Yatim)

<img width="103" height="20" alt="Laravel-13" src="https://github.com/user-attachments/assets/cfcea2cd-c54e-4db7-b84f-ef0a51da7111" />
<img width="93" height="20" alt="React-19" src="https://github.com/user-attachments/assets/8b37acd4-7dcc-468a-bcc8-d1b2cf8c9f6c" />
<img width="75" height="20" alt="PHP-8" src="https://github.com/user-attachments/assets/2fae2306-39be-483f-b6a3-0acdc18853cf" />
<img width="121" height="20" alt="Tailwind_CSS-v4-06B6D4" src="https://github.com/user-attachments/assets/28ece250-8f34-4689-9201-3d493413ea5a" />
<img width="84" height="20" alt="Inertia" src="https://github.com/user-attachments/assets/b8c5cf9a-1c12-457e-a075-59565cbea553" />
<img width="75" height="20" alt="PHP-8" src="https://github.com/user-attachments/assets/f80d3e4f-3b95-4f73-a8c4-0f6527a9966c" />


📖 About The Project

Yayasan Geliyat (Gerakan Peduli Yatim) is an integrated web platform developed as part of the Warjett X Yayasan Geliyat IT Consultation Project. This platform serves as an official digital presence (Company Profile) and an internal management system designed for foundation administrators across 5 fostered sub-districts (kelurahan binaan).
Designed with a mobile-first, human-centric approach, the platform empowers non-technical foundation staff to manage fostered orphan records securely (in compliance with Personal Data Protection regulations), verify manual bank transfer donations via WhatsApp integration, publish foundation activities, and maintain transparent financial bookkeeping.

✨ Key Features

🌐 Public Portal (Company Profile & Donor Interface)
- Interactive Homepage: Foundation impact metrics, 4 core program pillars, and latest activity highlights.
- Foundation Profile (Profil): History, Vision & Mission, and organizational structure (Dewan Pembina & Pengurus Harian).
- Core Pillars (Bidang): Deep dive into Education (Pendidikan), Humanitarian (Kemanusiaan), Cooperative Economy (Ekonomi Koperasi), and Religious Programs (Keagamaan).
- Activity Catalog (Kegiatan): Live search and category filtering for foundation events and social documentation.
- Fostered Children Directory (Anak Yatim): Privacy-first public directory displaying anonymized/protected profiles filtered by education level (SD, SMP, SMA, University).
- Guided Donation Flow (Donasi): 5-step transparent donation guide, copyable BSI & BRI bank account cards, preset donation nominals, and an automated WhatsApp confirmation generator.

🔒 Internal Admin Panel (Role-Based Access Control)
- Multi-Role Authentication: Powered by Laravel Fortify with custom middleware (EnsureUserHasRole) separating operational staff and executive leadership:
  - Super Admin (Chairman / Ketua Yayasan): Full access to executive cash flow dashboards (Income vs. Expense dual charts), Financial Bookkeeping (Keuangan), User & Staff Management (Manajemen Pengguna), and all operational modules.
  - Admin (Field Coordinator / Pengurus Bidang): Focused operational dashboard, Fostered Children CRUD (Pengelolaan Anak Yatim), WhatsApp Donation Verification (Pengelolaan Donasi), Event Publishing (Pengelolaan Kegiatan), and Operational Reports (Laporan).

🛠️ Tech Stack
- Backend: Laravel 12 (PHP 8.5), Laravel Fortify (Authentication), Laravel Wayfinder (Typed Routes)
- Frontend: React 19, TypeScript, Inertia.js v3
- Styling & UI: Tailwind CSS v4, Radix UI Primitives, Lucide Icons, Poppins & Inter Typography
- Database: MySQL / SQLite
- Testing & Quality: Pest PHP, Laravel Pint
