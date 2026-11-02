# Stage 4.1.24.2 — Creeper Explosion Layering & Polish

## Scope
Memoles Creeper Explosion Visual Core (4.1.24.1) di atas `UT.ParticleFX`. Tanpa SFX, `audio.js`, gameplay trigger, victory/reward, Power, board/gameplay logic, atau efek Three.js. `explode()`/efek creeper lama tidak disentuh; `UT.CreeperExplosionFX` masih belum dipanggil dari gameplay.

## Reference Inspection
Dibaca ulang `game/referensi/voxel-fx-lab-refined.html` (kasus `creeper`, `burst`, `particle`, `ring`, `flash`) hanya sebagai acuan visual: cincin kejut (circle + diamond) di titik ledak; burst blok persegi cepat dengan gravitasi kuat (0.19) dan umur ±30%; ukuran blok kecil bervariasi; asap bulat abu-hijau (`#52675a`) bergravitasi hampir nol dengan umur 500–850ms; flash hijau pucat 180ms. Diadaptasi ke DOM/CSS engine proyek sendiri (canvas, rAF, dan jumlah 52+18 partikel tidak ditiru). Tidak ada kode/asset referensi yang dipakai saat runtime.

## Visual Changes
- Flash lebih besar dan lebih singkat (40px, 120ms, ×2.6).
- Core impact: inti putih membesar dengan gerak patah (`steps(3)`) + halo hijau pekat 52px (`steps(4)`).
- Cincin kejut baru: 5 blok mungil merata melingkar, melesat dengan gerak piksel (`steps(5)`).
- Main chunky burst dua ukuran: 3 blok besar 14px (ledak sangat cepat lalu melambat, `cubic-bezier(.1,.8,.25,1)`, warna hijau lebih pekat) + 5 blok sedang 8px (gerak patah `steps(7)`, lebih jauh).
- Debris berat: 4 serpihan gelap/abu 9px, gravity 85, rotasi ≤260°, umur 950ms (terasa jatuh).
- Smoke 3 gumpalan 22px naik + dust 2 titik terang mengambang; mulai setelah burst.
- Variasi ukuran, arah, scale, opacity (rgba), durasi, dan stagger per layer.

## Layering
FLASH (0ms) → CORE IMPACT (10–30ms) → CINCIN KEJUT (15ms) → MAIN BURST (15–70ms) → DEBRIS (40–100ms) → DUST (50–110ms) → SMOKE (110–210ms) → FADE; seluruh rangkaian selesai ≈1,28 dtk. Penjadwalan murni `animation-delay` CSS.

## Perubahan Engine (kecil, kompatibel ke belakang)
`particle-fx.js/css`: opsi `ease` → CSS variable `--fx-ease` (fallback ke easing lama). Nilai divalidasi whitelist (`linear`, `ease*`, `steps(n[,start|end])`, `cubic-bezier(a,b,c,d)`); nilai lain diabaikan. Tanpa `ease`, perilaku identik dengan 4.1.22–4.1.24.1 (Firework tidak terpengaruh).

## Particle Budget
Default 25 partikel (1+2+5+3+5+4+3+2); minimum 23, maksimum 27 (count 7). Tiap panggilan engine ≤ 7 (batas 20/burst). Dua ledakan bersamaan = 50 (< 60 visible); batas 60 dijaga engine, kelebihan dipangkas. Catatan: target "8–20" di 4.1.24.1 digantikan; budget stage ini tetap jauh di bawah batas engine.

## Performance
Hanya `transform` + `opacity`. Tanpa Three.js, WebGL, canvas, blur/filter/shadow, rAF, setInterval, setTimeout, addEventListener, createElement, layer atau engine baru. Tidak ada animasi infinite.

## Cleanup
Listener `animationend` terpusat milik engine; tidak ada mekanisme cleanup baru.

## Reduced Motion
Guard engine: semua panggilan return 0 → 0 partikel, tanpa layer.

## Static Checks
- `node --check`: `particle-fx.js`, `creeper-fx.js` OK.
- jsdom (bukan browser): default 25; count 500 → 27; count 1 → 8; 7 easing berbeda dipakai; flash 0ms, smoke ≥ 72ms (dust) / ≥110ms (smoke), akhir ≈1281ms; 23 ukuran, 25 durasi, 17 warna berbeda; 9 partikel jatuh >40px (debris berat); 5 ledakan beruntun tetap ≤ 60 & 1 layer; 2 ledakan bersamaan = 50; `animationend` menghapus partikel; `clear()` → 0; NaN/elemen null → 0; 0 elemen Audio; reduced-motion → 0 partikel & tanpa layer; tanpa engine → 0; engine melempar error → 0.
- Whitelist ease: `steps(4, end)` diterima; `url(...)` dan injeksi `cubic-bezier(...); color:red` ditolak.
- Regresi: suite ParticleFX/Firework visual, layering, SFX, dan hook gameplay 4.1.23.x tetap lulus.

## Runtime Reference Check
Scan js/css/html di `game/` (kecuali `game/referensi/`, `game/old/`): 0 hasil untuk `voxel-fx-lab`, `voxel fx lab`, `referensi/`. Tidak ada import/fetch/img/CSS url/manifest/loader.

## Regression
`gameplay.html`, `audio.js`, `firework-fx.js` tidak diubah. Gameplay, victory/reward, Power, dice, board, Three.js FX tidak berubah.

## Manual Browser Test
NOT RUN — requires user/browser testing. Cek lewat console `UT.CreeperExplosionFX.burstAt(200, 300)`: kesan chunky/patah, kekuatan impact, bobot debris, keterbacaan asap di layar kecil, performa di Android menengah.

## Result
READY FOR MANUAL TEST
