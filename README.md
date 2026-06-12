# ChadFocus Web Demo

Next.js uygulaması. Bu klasör Vercel deploy için hazır.

## Kurulum

1. `.env.example` dosyasını `.env.local` olarak kopyla.
2. Aşağıdaki değerleri doldur.
3. `npm install`
4. `npm run dev`

## Gerekli environment değişkenleri

- `NEXTAUTH_URL` - Vercel canlı URL'i, örn: `https://chad-focus.vercel.app`
- `NEXTAUTH_SECRET` - uzun rastgele bir gizli anahtar
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `DATABASE_URL` - `postgres://user:password@host:5432/dbname`

## Vercel deploy

- Repository root olarak bu klasörü kullanıyorsan `Root Directory` = `./`
- Build command: `npm run build`
- Output directory: boş
- Install command: boş veya `npm install`
- Google redirect URI:
  - `https://<your-vercel-project>.vercel.app/api/auth/callback/google`

## Not

Local geliştirme için `.env.local` içinde `NEXTAUTH_URL=http://localhost:3000` kullan.

## Hızlı GitHub push

Bu klasörde `push-to-github.cmd` komut dosyası oluşturuldu. GitHub reponu şu şekilde ayarlayabilirsin:

```cmd
cd /d "%~dp0"
push-to-github.cmd https://github.com/<kullanici>/<repo>.git
```

> `<kullanici>` ve `<repo>` yerlerine kendi GitHub kullanıcı adını ve repo adını yaz.
