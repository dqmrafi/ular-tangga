# Stage 4.1.23.1 — Firework Visual Core

## Scope
Satu burst kembang api voxel (CORE FLASH → MAIN RADIAL BURST → FADE) di atas `UT.ParticleFX`. Tanpa SFX, trigger, launch/trail, secondary burst, atau perubahan gameplay.

## Reference Used
`game/referensi/voxel-fx-lab-refined.html` (masuk repo via commit `e8d5df0`, setelah prompt dimulai; sempat belum ada di checkout lokal). Dibaca hanya sebagai acuan visual: palet "victory" (`#fff3a3 #ffd451 #f7a7ff #78e7ff #8fffb6`), burst blok persegi, flash singkat sebelum burst, durasi ~1 detik. Nilai warna disalin ke `firework-fx.js`; file referensi **tidak** dimuat/di-fetch/di-import. Runtime reference count = 0 (grep `voxel-fx-lab` / `referensi/` di js/css/html game: tidak ada, selain file referensi itu sendiri). Referensi memakai canvas + rAF; itu tidak ditiru.

## Implementation
- NEW `game/gameplay/firework-fx.js` → `UT.FireworkFX.burstAt(x, y, opts)` dan `burstFromElement(el, opts)`.
- Core flash: 1 blok krem-terang (`#fff3a3`) 18px, 180ms, membesar ×2 sambil memudar.
- Main burst: 8–16 blok (default 12), 6px, radial 360°, jeda acak ≤50ms, gravity 24px, rotasi ≤90°, 850ms. Variasi arah/jarak/ukuran/durasi lewat jitter engine; variasi opacity visual lewat warna rgba pada palet (4 palet acak: victory-mix, emas, cyan, pink).
- Semua lewat `UT.ParticleFX.burstAt`; `#fx-layer` milik engine. Guard: engine tidak ada → return 0.

## Particle Count
1 flash + 8–16 main = 9–17 per firework (≤ 20/burst). Batas 60 visible tetap dijaga engine.

## Performance
Hanya transform + opacity (keyframe engine). Tanpa rAF, interval, timer, listener, layer, blur, filter, shadow, WebGL, Three.js.

## Reduced Motion
Memakai guard engine: `burstAt` engine return 0 sehingga firework membuat 0 partikel dan tidak membuat layer.

## Cleanup
Cleanup 100% oleh listener `animationend` terpusat milik engine. Modul ini tidak menambah mekanisme cleanup.

## Files Changed
- NEW `game/gameplay/firework-fx.js`
- `game/gameplay.html`: +1 `<script src="gameplay/firework-fx.js">` setelah `particle-fx.js`
- NEW `audit/4/stage-4.1.23.1-firework-visual-core.md`

## Static Checks
- `node --check game/gameplay/firework-fx.js` OK.
- jsdom (bukan browser): firework → 13 partikel; count 500 → 17 (clamp 16+flash); count 1 → 9 (min 8+flash); 6 firework beruntun tetap ≤ 60 visible; 1 `#fx-layer`; `animationend` menghapus partikel; 56 dari 59 kombinasi size/durasi unik; reduced-motion → 0 partikel & tanpa layer; tanpa engine → 0.
- Tidak ada engine kedua, rAF, interval, setTimeout, createElement, atau addEventListener di firework-fx.js.

## Regression
Hanya 1 sisipan script tag di `gameplay.html`. Tidak ada pemanggil `UT.FireworkFX`, sehingga gameplay, Power, shield, audio, HUD tidak berubah. `particle-fx.js/css` tidak diubah.

## Manual Browser Test
NOT RUN — requires user/browser testing.

## Result
READY FOR MANUAL TEST
