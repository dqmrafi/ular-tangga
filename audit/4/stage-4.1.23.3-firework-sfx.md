# Stage 4.1.23.3 — Firework SFX

## Scope
Menambah 1 SFX Firework lewat sistem audio existing (`UT.GameplayAudio`). Tanpa audio engine baru, tanpa SFX lain, tanpa trigger gameplay/victory/reward, tanpa perubahan `particle-fx.js/css`, Three.js FX, atau Power.

## SFX File
Tersedia 3 file di `game/assets/sfx/win/`: `Firework_launch.ogg` (1.63s), `Firework_large_blast_far.ogg` (2.50s), `Firework_twinkle.ogg` (1.33s). Sesuai "1 SFX", dipakai **`Firework_launch.ogg`**: visual dimulai dengan launch, jadi suara bisa diputar saat panggilan tanpa timer untuk sinkronisasi. (Blast/twinkle harus tertunda ~300ms+ dan butuh timer.) Dua file lain tidak dipakai. Isi file belum didengar oleh pembuat stage ini; kecocokan suara perlu dinilai saat tes manual.

## Audio Integration
- `audio.js`: +1 entri tabel `FILE` (`firework:'win/Firework_launch.ogg'`) dan +1 metode `sfx.firework()` (`fileSfx('firework',0.7)`). Otomatis ikut gerbang `ready`, tombol mute, `preload()` warm-up, dan try/catch milik `audio.js`.
- `firework-fx.js`: di akhir `burstAt`, `UT.GameplayAudio.play('firework')`, satu kali per event, dan hanya bila visual keluar (`made > 0`).
- `assets/sfx/README.md`: +1 baris tabel.

## Duplicate Prevention
Satu panggilan `FireworkFX.burstAt` = tepat 1 pemutaran (8 pemanggilan engine di dalamnya tidak memutar suara). Tidak ada pemutaran dari render/particle/frame. Opsi `sound:false` untuk rangkaian beberapa firework di sub-stage berikutnya. Tidak ada listener, timer, interval, atau loop audio baru.

## Graceful Failure
- Audio tidak ada / `play` melempar error → ditelan try/catch; visual tetap 24 partikel.
- File gagal diputar → `fileSfx` menelan `play()` rejection; senyap (tanpa fallback beep, sesuai "jangan tambah sound lain"); visual tidak terpengaruh.
- Mute → tidak ada elemen Audio baru. Belum `ready` → senyap.
- Reduced-motion → visual 0 partikel, jadi SFX juga tidak diputar (suara dikaitkan dengan visual).

## Static Checks
- `node --check` OK: `audio.js`, `firework-fx.js`.
- jsdom dengan `Audio` palsu (bukan browser): 1 firework → 1 instance Audio (`assets/sfx/win/Firework_launch.ogg`); `sound:false` → 0; mute → 0 audio, visual tetap; belum ready → 0 audio, visual 24; reduced-motion → 0 visual & 0 audio; tanpa sistem audio → visual 24; audio melempar error → visual 24; 2 event → 2 pemutaran.
- Tidak ada setInterval/setTimeout/rAF/addEventListener di `firework-fx.js`. Runtime reference ke folder referensi: 0.

## Regression
Regresi ParticleFX/Firework 4.1.23.2 tetap lulus (24 partikel default, ≤60 visible, cleanup, reduced-motion). `particle-fx.js/css` dan `gameplay.html` tidak diubah. Tidak ada pemanggil `UT.FireworkFX` di gameplay, jadi gameplay, victory, reward, Power tidak berubah. Perubahan `audio.js` hanya penambahan; fungsi lama tidak disentuh.

## Manual Browser Test
NOT RUN — requires user/browser testing.

## Result
READY FOR MANUAL TEST
