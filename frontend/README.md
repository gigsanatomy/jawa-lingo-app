# JawaLingo

Platform pembelajaran Bahasa Jawa interaktif (Next.js + Firebase + Gemini Genkit)

## Fitur
- Auth (Firebase)
- Kamus (CRUD, search, filter, audio)
- Pembelajaran (frasa harian, toggle, audio)
- Quiz dua arah, leaderboard, progress
- Pembina Ayat AI (Gemini Genkit)
- Dashboard & progress tracking

## Setup
1. `cd frontend`
2. `npm install`
3. Salin `.env.example` ke `.env.local` dan isi config Firebase & Gemini Genkit
4. `npm run dev`

## Seed Data Kamus
1. `cd backend/functions`
2. `npm install`
3. Letak `serviceAccountKey.json` (Firebase Admin)
4. `npx ts-node src/seed-dictionary.ts`

## Deploy
- Frontend: Vercel/Netlify
- Backend: Firestore (Firebase), Gemini Genkit (API)

## Struktur
- `/kamus` — Kamus rujukan
- `/pembelajaran` — Frasa harian
- `/quiz` — Kuiz interaktif
- `/builder` — Pembina Ayat AI
- `/leaderboard` — Ranking user