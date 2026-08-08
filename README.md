# Zaan Above

Aplikasi chat AI dengan sistem daftar/login, dibuat dengan Next.js, Supabase (database akun), dan Google Gemini (AI).

## 1. Setup Supabase (database akun, gratis)

1. Buka https://supabase.com → daftar/login → **New project**.
2. Setelah project jadi, buka menu **SQL Editor** → **New query**.
3. Copy-paste isi file `supabase/schema.sql` di project ini, lalu klik **Run**.
4. Buka menu **Settings → API**, catat:
   - `Project URL` → ini untuk `NEXT_PUBLIC_SUPABASE_URL`
   - `service_role` key (bagian "Project API keys") → ini untuk `SUPABASE_SERVICE_ROLE_KEY`
   - **Jangan pernah taruh service_role key ini di kode/GitHub**, hanya di environment variable.

## 2. Dapatkan API key Gemini (gratis, tanpa kartu kredit)

1. Buka https://aistudio.google.com/
2. Login dengan akun Google.
3. Klik **Get API key** → **Create API key**.
4. Copy key-nya → ini untuk `GEMINI_API_KEY`.

## 3. Setup environment variable lokal

1. Copy file `.env.local.example` menjadi `.env.local`.
2. Isi semua value-nya (Supabase URL, Supabase service role key, Gemini API key).
3. Untuk `JWT_SECRET`, isi string acak apa saja yang panjang (misal 40+ karakter random), ini untuk mengamankan session login.

## 4. Jalankan di lokal (opsional, untuk tes dulu)

```bash
npm install
npm run dev
```

Buka http://localhost:3000

## 5. Upload ke GitHub

```bash
git init
git add .
git commit -m "Zaan Above - initial commit"
git branch -M main
git remote add origin https://github.com/USERNAME_GITHUB/zaan-above.git
git push -u origin main
```

Ganti `USERNAME_GITHUB` dengan username GitHub kamu, dan buat dulu repo kosong bernama `zaan-above` di github.com sebelum push.

**PENTING:** file `.env.local` TIDAK ikut ter-upload (sudah ada di `.gitignore`), karena isinya rahasia (API key & password database).

## 6. Deploy ke Vercel

1. Buka https://vercel.com → login pakai akun GitHub.
2. Klik **Add New → Project**, pilih repo `zaan-above` yang baru di-push.
3. Sebelum klik Deploy, buka bagian **Environment Variables**, isi 4 variable ini (sama seperti isi `.env.local`):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `GEMINI_API_KEY`
   - `JWT_SECRET`
4. Klik **Deploy**. Tunggu sampai selesai, lalu buka link yang diberikan Vercel.

Aplikasi sudah bisa dipakai: buka link → daftar akun (username, password, gmail) → login → chat dengan Zaan Above.

## Cara kerja alur login

1. Halaman pertama otomatis mengarah ke `/login`.
2. Klik "Daftar" → isi username, password, gmail → klik **Daftar** → data tersimpan di Supabase (password di-hash, tidak disimpan mentah).
3. Otomatis diarahkan kembali ke halaman login.
4. Masukkan username & password yang baru didaftarkan → klik **Masuk**.
5. Masuk ke halaman chat dan bisa langsung mengobrol dengan AI.

## Fitur khusus

Jika ada yang bertanya "siapa yang membuat kamu / siapa penciptamu", AI akan otomatis menjawab dengan jawaban yang sudah ditentukan, tanpa memanggil Gemini (diatur di `app/api/chat/route.ts`).
