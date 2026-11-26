# Folder Lagu

Taruh file lagu kamu di folder ini (public/music).

## Cara mengganti lagu tanpa mengubah kode

1. Ambil file lagu (mp3 / m4a / wav / ogg).
2. Rename file itu jadi salah satu nama di bawah ini (urutan prioritas):

   - `lagu.mp3`        ← paling gampang, pakai ini
   - `lagu.m4a`
   - `lagu.wav`
   - `lagu.ogg`
   - `masa-ini-nanti-dan-masa-indah-lainnya.mp3`

3. Simpan di folder ini: `birthday-web/public/music/`
4. Refresh halaman (Ctrl+Shift+R / Cmd+Shift+R).

Website otomatis memakai file itu — lagu diputar **full dari awal** sampai habis,
lalu diulang (loop). Tidak perlu edit kode sama sekali.

Kalau folder ini masih kosong, website otomatis memakai pratinjau resmi 30 detik
dari iTunes sebagai cadangan.

## Catatan

- Cukup taruh SATU file dengan salah satu nama di atas. Kalau ada beberapa,
  yang paling atas di daftar yang dipakai.
- Setelah menambah file, tidak perlu restart server dev. Cukup refresh browser.
