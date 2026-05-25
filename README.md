# DISC Test

Tes kepribadian DISC 24 soal. Pilih P (paling) dan K (kurang) buat tiap pernyataan, dapet hasil profil D-I-S-C beserta rekomendasi karir.

## Stack

- Next.js 16
- Prisma 7 + Turso (SQLite via libsql)
- Upstash Redis (rate limit + counter)
- Tailwind CSS

## Cara jalanin

```bash
npm install
cp .env.example .env   # isi TURSO_DB_URL, TURSO_AUTH_TOKEN
npx prisma generate
npx tsx prisma/seed.ts  # seed 24 soal
npm run dev
```

Buka `http://localhost:3000`.

## Env vars

| Variable | Butuh? | Buat apa |
|---|---|---|
| `TURSO_DB_URL` | wajib | koneksi ke database Turso |
| `TURSO_AUTH_TOKEN` | wajib | auth Turso |
| `DATABASE_URL` | opsional | fallback file lokal (`file:./dev.db`) |
| `KV_REST_API_URL` | opsional | Redis rate limit + counter |
| `KV_REST_API_TOKEN` | opsional | auth Redis |

## API

| Route | Method | Fungsi |
|---|---|---|
| `/api/test` | POST | buat tes baru, balikin UUID |
| `/api/test/[id]/questions` | GET | ambil 24 soal + opsi |
| `/api/test/[id]/submit` | POST | kirim jawaban, dapet skor |
| `/api/result/[uuid]` | GET | lihat hasil dari UUID |
| `/api/stats` | GET | total tes yang udah disubmit |

## Deploy

Push ke GitHub, connect ke Vercel, set env vars. Udah.
