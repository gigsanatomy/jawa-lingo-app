# JawaLingo

Platform pembelajaran Bahasa Jawa interaktif.

Repositori ini mengandungi dua komponen utama:

- **frontend/** – Aplikasi Next.js (TypeScript) yang berhubung dengan Firebase untuk autentikasi, pangkalan data (Firestore) dan fungsi AI Gemini Genkit.
- **backend/** – Projek Laravel kosong bersama folder **functions/** untuk fungsi Firebase yang mengurus seeding kamus melalui Gemini Genkit.

## Struktur Ringkas

```
frontend/  -> Kod React/Next.js
backend/   -> Kod Laravel dan fungsi Firebase
index.html -> Versi statik lama (tidak lagi digunakan)
```

## Cara Mula (ringkas)

1. **Frontend**
   ```bash
   cd frontend
   npm install
   # Sediakan `.env.local` dengan konfigurasi Firebase dan Gemini Genkit
   npm run dev
   ```
2. **Backend**
   ```bash
   cd backend
   composer install
   cp .env.example .env
   php artisan key:generate

   cd functions
   npm install
   # Letakkan `serviceAccountKey.json` untuk Firebase Admin
   # Jalankan `npm run build` sebelum deploy
   ```

### Seed Data Kamus

Terdapat skrip untuk memenuhkan koleksi `dictionary` menggunakan AI:

```bash
cd backend/functions
npx ts-node src/seed-dictionary.ts
```

Untuk maklumat terperinci, rujuk README dalam folder masing‑masing.
