# Stage 4.1.24.1 — Creeper Explosion Visual Core

## Scope
Visual inti ledakan Creeper di atas `UT.ParticleFX`. Tanpa SFX, `audio.js`, trigger gameplay, perubahan victory/reward/Power/logic, atau efek Three.js baru. `explode()`/efek creeper lama di gameplay tidak disentuh dan belum memakai modul ini.

## Reference Used
Kasus `creeper` di `game/referensi/voxel-fx-lab-refined.html`, dibaca hanya sebagai acuan: palet hijau (`#a8ff78 #4fdb65 #d7ffc2`), burst blok persegi cepat, asap bulat abu-hijau (`#52675a`), flash hijau pucat. Nilai warna disalin sebagai literal; referensi memakai canvas+rAF (tidak ditiru) dan 52+18 partikel (dipangkas ke budget 8–20). Runtime reference count = 0.

## Implementation
NEW `game/gameplay/creeper-fx.js` → `UT.CreeperExplosionFX.burstAt(x, y, opts)` dan `burstFromElement(el, opts)`; semua partikel lewat `UT.ParticleFX.burstAt`. Layer (urutan lewat `delayMin`/`delay` CSS):
1. Flash: 1 blok putih-kehijauan 34px, 140ms, ×2.4.
2. Explosion core: inti 28px (240ms, ×2) + halo hijau 46px semi-transparan (320ms, ×1.7).
3. Chunky burst: 6–9 blok hijau (default 8), 9px dengan variasi ukuran ±60%, radial 360°, gravity 22, rotasi ≤120°, 620ms.
3b. Debris: 4 serpihan gelap, lebih berat (gravity 55, rotasi ≤200°), 760ms.
4. Smoke/dust: 4 gumpalan bulat 18px abu-hijau semi-transparan, naik (gravity −26) sambil membesar ×1.9, mulai ≥100ms, 850ms.
5. Fade/cleanup: opacity 1→0 di keyframe engine; dihapus engine saat `animationend`.
Variasi arah, scale, opacity (rgba), durasi, dan stagger; opsi `count` (6–9) dan `distance`.
`gameplay.html`: +1 `<script src="gameplay/creeper-fx.js">` setelah `firework-fx.js`.

## Particle Budget
Default 19 partikel (1+2+8+4+4); maksimum 20 (count 9, 9+11); minimum 17. Tiap panggilan engine ≤ 9 (batas 20/burst). Batas 60 visible dijaga engine.

## Performance
Hanya `transform` + `opacity` (keyframe engine). Tanpa Three.js, WebGL, canvas, blur/filter/shadow, rAF, setInterval, setTimeout, addEventListener, createElement, layer atau engine baru. Seluruh rangkaian selesai ≈1,15 dtk setelah panggilan.

## Cleanup
Listener `animationend` terpusat milik engine; modul ini tidak menambah mekanisme cleanup.

## Reduced Motion
Guard engine: semua panggilan return 0 → 0 partikel, tanpa layer.

## Static Checks
- `node --check game/gameplay/creeper-fx.js` OK.
- jsdom (bukan browser): default → 19 partikel; count 500 → 20, count 1 → 17; flash mulai 0ms, asap ≥116ms, akhir ≈1143ms; asap bergerak naik (rata-rata y −33px); 17 ukuran berbeda dari 19 partikel; 5 ledakan beruntun tetap ≤ 60 visible & 1 layer; `animationend` menghapus partikel; `clear()` → 0; input NaN/elemen null → 0; reduced-motion → 0 partikel & tanpa layer; tanpa engine → 0; engine melempar error → 0 tanpa exception; 0 elemen Audio dibuat (tanpa SFX).
- Regresi: suite ParticleFX/Firework (visual, layering), SFX, dan hook gameplay 4.1.23.x tetap lulus.
- Runtime reference ke folder referensi (voxel fx lab) di js/css/html game: 0. `CreeperExplosionFX` tidak dipanggil dari mana pun selain modulnya.

## Regression
Diff `gameplay.html` hanya +1 script tag. `particle-fx.js/css`, `firework-fx.js`, `audio.js` tidak diubah. Gameplay, victory/reward, Power, dice, board, `explode()`, Three.js FX tidak berubah.

## Manual Browser Test
NOT RUN — requires user/browser testing. Panggil `UT.CreeperExplosionFX.burstAt(200, 300)` dari console; nilai: ukuran blok, kecepatan, dan keterbacaan asap di layar kecil.

## Result
READY FOR MANUAL TEST
