# Stage 4.1.23.2 — Firework Layering & Polish

## Scope
Memoles Firework Visual Core (4.1.23.1) menjadi berlapis: LAUNCH → TRAIL → CORE FLASH → MAIN BURST → SECONDARY SPARK → FADE/CLEANUP. Tanpa SFX, `audio.js`, trigger victory/reward, gameplay, atau Power. Tetap memakai `UT.ParticleFX`; tidak ada engine baru.

## Changes
- `firework-fx.js`:
  - Launch: 1 blok roket naik `rise` px (default 90) dari bawah titik ledak, 280–330ms.
  - Trail: 3 blok kecil pudar di jalur naik.
  - Core flash: inti putih 22px + halo 34px semi-transparan, 200–260ms, membesar ×2–2.2 (lebih terasa).
  - Main burst: 8–16 blok (default 12) mulai tepat setelah roket sampai.
  - Secondary spark: 3 titik di tepi burst × 2 percik 3px, jatuh dan berkelip.
  - Variasi: timing launch acak, jarak burst ±12%, jitter ukuran/arah/durasi/opacity (rgba), stagger antar layer.
- Perubahan kecil engine (kompatibel ke belakang):
  - `particle-fx.js`: opsi `delayMin` (jeda tetap, maks 1500ms) di samping `delay` acak. Tanpa opsi ini, stagger yang pasti antar layer tidak mungkin tanpa timer.
  - `particle-fx.css`: `animation-fill-mode` dari `both` menjadi `forwards`. Dengan `both`, partikel yang tertunda tampil (opacity 1) di titik awal selama jeda. Dengan `forwards`, partikel tetap opacity 0 sampai mulai. Perilaku tanpa delay identik.

## Scheduling
Semua urutan layer lewat `animation-delay` CSS. Tidak ada setTimeout, rAF, interval, atau listener tambahan.

## Particle Count
Default 12: 1 launch + 3 trail + 2 flash + 12 main + 6 secondary = 24 partikel. Maksimum (count 16): 28. Setiap panggilan engine ≤ 16 (batas 20/burst). Batas 60 visible dijaga engine; bila penuh, jumlah dipangkas, bukan error.

## Performance
Hanya transform + opacity. Tanpa blur/filter/shadow, Three.js, WebGL, rAF, interval, timer per partikel, layer atau engine baru.

## Reduced Motion
Guard engine: semua panggilan return 0, jadi tidak ada partikel dan tidak ada layer. CSS `#fx-layer{display:none}` tetap sebagai lapis kedua.

## Cleanup
Listener `animationend` terpusat milik engine menghapus setiap partikel, termasuk yang tertunda.

## Files Changed
- `game/gameplay/firework-fx.js`
- `game/gameplay/particle-fx.js` (+`delayMin`)
- `game/gameplay/particle-fx.css` (fill-mode `forwards`)
- NEW `audit/4/stage-4.1.23.2-firework-layering.md`

## Static Checks
- `node --check` OK untuk `particle-fx.js` dan `firework-fx.js`.
- jsdom (bukan browser): firework default = 24 partikel; launch/trail mulai di 0ms, flash/burst ≥ 287ms, secondary hingga ~711ms; count 500 → 28 (clamp); beberapa firework beruntun tetap ≤ 60 visible dan 1 layer; `animationend` menghapus partikel; `clear()` → 0.
- Regresi engine 4.1.22: burst default 12, cap 20/burst, input NaN → 0, tanpa `--fx-delay` bila delay tidak dipakai; reduced-motion → 0 partikel & tanpa layer; tanpa engine → 0.
- Tidak ada rAF/interval/timer/addEventListener/createElement di `firework-fx.js`; tidak ada animasi infinite.
- Runtime reference ke folder referensi (voxel fx lab) di js/css/html game: 0.
- `gameplay.html` tidak diubah; tidak ada pemanggil `UT.FireworkFX`, jadi gameplay, Power, shield, audio, HUD tidak berubah.

## Manual Browser Test
NOT RUN — requires user/browser testing.

## Result
READY FOR MANUAL TEST
