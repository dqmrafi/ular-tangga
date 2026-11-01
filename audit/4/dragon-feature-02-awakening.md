# DRAGON WORLD FEATURE 2 — DRAGON AWAKENING

Scope: sequence awakening saat Block 100 aktif. TIDAK ada Crystal progression, TIDAK ada Dragon Attack baru.

## Sequence
Block 100 (pemain tiba) -> Arena naik -> Tower naik -> End Crystal muncul & aktif (spiral energi, beam, glow, ring) -> burst -> Dragon spawn dari Crystal -> terbang ke posisi Block 100 -> gameplay unlock.
Total sekitar 8 detik (`prefers-reduced-motion`: ~35%).

## Perilaku
- Arena (5.2 x 5.6, end-stone + obsidian, parapet, 4 pilar sudut) dibangun di semua tema, berada di bawah tanah (`visible=false`) sampai dipicu. Posisi = farm kiri board (x -11.6, z -0.2).
- Tema Minecraft: farm kiri board sekarang batch sendiri (`FARMG`) dan disembunyikan saat arena selesai naik. Tema lain tidak punya farm: arena naik dari tanah.
- Tower naik dari bawah slab; End Crystal (voxel magenta + cangkang cyan) muncul di atas tower. Crystal Block 100 milik Feature 1 DIHILANGKAN (glow + partikel portal tetap) supaya tidak ada dua crystal.
- Dragon: `visible=false` sampai crystal aktif; Feature 1 tidak lagi memunculkannya otomatis (hanya bila `AWK.done`). Dragon spawn di crystal, tumbuh, terbang ke posisi existing di atas Block 100.
- Kamera: pan sementara 6 unit ke kiri agar arena terlihat di mode LOCK, dipulihkan setelah sequence. Murni kosmetik.
- Hanya 1x per game: `AWK.done`; reset di `startGame` (arena turun lagi, farm muncul lagi). Setelah ganti tema, state arena dipulihkan sesuai `AWK.done`.
- SFX: `assets/sfx/dragon-awakening.mp3` (PLACEHOLDER, file BELUM ada di repo). Bila file tidak ada/gagal, fallback sintetis (retak + gema) lewat `sfx.dragonAwakening()` di `gameplay/audio.js`. Tidak dimasukkan ke preload agar tidak ada 404 tambahan.

## Gameplay lock (`AWK.running`)
Guard: `doRoll`, `usePU`, `openPause` (termasuk Escape), `camSetAngle`, pointer down/move/wheel kanvas. Capture-phase click guard untuk semua button/select/input/a (termasuk Enter/Space). CSS `body.awk-lock` menonaktifkan pointer button/select/canvas. `busy` sudah true karena sequence berjalan di dalam `playTurn`; timer AFK dihentikan lalu mulai lagi lewat `beginTurn` setelah `nextTurn`. Jika pause sudah terbuka sebelum sequence, sequence menunggu hingga dilanjutkan. Game baru saat sequence (STALE) -> `resetAwakening`.
Jaga-jaga: cabang serang naga di `playTurn` menjalankan awakening bila belum `AWK.done`.

## Test
- Syntax semua 4 skrip inline `gameplay.html` + `gameplay/audio.js`: PASS.
- Smoke test logika (Node + THREE r128 asli, tanpa WebGL; timer dipercepat): dormant, lock aktif, urutan arena>tower>crystal>dragon, unlock, SFX 1x, re-entry diabaikan, tidak terjadi 2x, dragon mendarat di Block 100, kamera pulih, tanpa NaN, reset game baru: PASS.
- BELUM diverifikasi: render nyata di browser/Android (tampilan arena, tumpang tindih dengan dekorasi tema non-Minecraft di area kiri, posisi tower/crystal terhadap kamera), regresi interaktif (dadu, giliran, ular, tangga, power, chest, mob, pause), SFX file asli. Perlu dicek manual.

Files changed: game/gameplay.html, game/gameplay/audio.js, audit/4/dragon-feature-02-awakening.md
Tidak diubah: board/tile/gerak/dadu/giliran/ular/tangga/HUD/kamera engine, voxel-geom.js
