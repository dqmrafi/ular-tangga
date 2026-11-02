# Stage 4.1.23.5 — Firework Final Integration & Audit

Checkpoint awal: `75eef39` (4.1.23.4), `HEAD == origin/main`, ahead 0, behind 0. Stage ini audit-only: **tidak ada perubahan kode**; semua test lulus tanpa perlu perbaikan.

## Firework Architecture
```
celebrate(p) [gameplay.html]  ← event kemenangan (Dragon kalah); satu-satunya jalur ke finishGame
  └ fireworkCelebrate(p)       guard FW_GID === gameId, proyeksi pion → layar (sekali per event)
      └ UT.FireworkFX.burstAt  [gameplay/firework-fx.js] susun layer lewat delayMin (animation-delay CSS)
          ├ UT.ParticleFX.burstAt ×8 [gameplay/particle-fx.js + .css] #fx-layer, batas, cleanup animationend
          └ UT.GameplayAudio.play('firework') [gameplay/audio.js] 1x
```
Satu engine partikel, satu layer, satu listener cleanup. Three.js FX lama (`gameplay/fx.js`: konfeti 3D, sparkle) tidak diubah dan tetap berjalan paralel.

## Visual Layers
Launch (1 blok naik ~90px) → Trail (3) → Core flash (inti + halo, 2) → Main burst (8–16, default 12) → Secondary spark (3×2) → fade (opacity 1→0) + cleanup. Default 24 partikel, maksimum 28. Urutan lewat `animation-delay`; tanpa timer.

## SFX Integration
`audio.js` entri `FILE.firework = win/Firework_launch.ogg` + `sfx.firework()` (`fileSfx`), otomatis ikut gerbang ready, mute, preload, try/catch. Dua file lain di `assets/sfx/win/` (blast, twinkle) tidak dipakai. Tanpa fallback sintetis: bila file gagal → senyap.

## Gameplay Trigger
Hook tunggal: `celebrate(p)` → `fireworkCelebrate(p)`. Tidak dipanggil dari render/loop/update partikel/UI render.

## Duplicate Prevention
`FW_GID` (berbasis `gameId` existing): maksimal 1 firework per game. `FireworkFX.burstAt` memutar SFX tepat 1x per panggilan (opsi `sound:false` tersedia, belum dipakai). Hasil tes: 3 panggilan pada game yang sama → 24 partikel & 1 SFX; game berikutnya → SFX ke-2.

## ParticleFX Regression (4.1.22 + perubahan 4.1.23.2)
Default 12/burst; cap 20/burst; cap 60 visible; input NaN → 0; satu `#fx-layer`; `animationend` menghapus partikel; `clear()` → 0; tanpa `--fx-delay` bila delay tidak dipakai. Perubahan engine sejak 4.1.22 hanya: opsi `delayMin` dan fill-mode `forwards` (kompatibel ke belakang). Hasil: lulus.

## Performance Checks
- Hanya `transform` + `opacity`; satu keyframe, 1 iterasi; tidak ada animasi infinite.
- grep di `particle-fx.js/css` + `firework-fx.js`: tidak ada rAF, setInterval, setTimeout, filter/blur/box-shadow/backdrop-filter, THREE, WebGL, canvas (di luar komentar).
- Satu `addEventListener` (delegation `animationend`, dipasang sekali). Tidak ada listener per partikel.
- `getBoundingClientRect` hanya saat event (hook) — bukan polling.
- `#fx-layer`: `pointer-events:none`, `position:fixed`, `contain:strict`; tidak memengaruhi layout/touch.

## Reduced Motion
Guard JS di engine → 0 partikel, tanpa layer; SFX tidak diputar (dikaitkan dengan visual); CSS `#fx-layer{display:none}` sebagai lapis kedua. Teruji: reduced → 0 partikel, 0 SFX.

## Runtime Reference Check
Scan seluruh repo (kecuali `game/referensi/`, `game/old/`, `audit/`, `game/doc/`, `*.md`) untuk `voxel-fx-lab`, `voxel fx lab`, `referensi/`: **0 hasil**. `game/referensi/voxel-fx-lab-refined.html` hanya referensi development; palet warna disalin sebagai nilai literal.

## Static Test Results
- `node --check`: `particle-fx.js`, `firework-fx.js`, `audio.js`, dan seluruh inline script `gameplay.html` — OK.
- jsdom (bukan browser): suite engine/firework (24 partikel, clamp 28, ≤60, cleanup, reduced), suite SFX dengan `Audio` palsu (1 instance, mute, ready-gate, `sound:false`, audio error), suite hook (sekali per game, modul hilang, burst error) — semua lulus, tidak ada kegagalan.
- Diff sejak 4.1.21 (`95345c6`) selain audit: `gameplay.html` +17/−2 (link CSS, 2 script tag, helper `fireworkCelebrate`, 1 baris `celebrate`), `audio.js` +2, 3 file baru FX, SFX README +1, 3 file `.ogg`, 1 file referensi. Tidak ada perubahan pada `finishGame`, `dragonDefeatReward`, `p.shield=true`, `renderChips()`, dice, board, movement, Power, multiplayer, HUD.

## Regression (area yang diaudit)
Victory/finish logic, Power (shield/totem/renderChips), dice, board/movement, Three.js FX, touch (layer `pointer-events:none`): tidak tersentuh dalam diff.

## Manual Test Status
NOT RUN — requires user/browser testing. Disarankan: menang lewat Dragon (vs CPU dan multiplayer), cek posisi firework di portrait & landscape, 1 suara, tidak ada firework ke-2 di layar menang, restart lalu menang lagi, reduced-motion aktif di OS, perangkat Android menengah.

## Remaining Known Limitations
1. Isi `Firework_launch.ogg` belum didengar; kecocokan dengan visual (blast/twinkle tak dipakai) perlu dinilai manual.
2. `celebrate(p)` dipanggil untuk siapa pun yang mengalahkan Dragon, termasuk CPU saat pemain kalah; firework ikut bermain (konsisten dengan konfeti/`sfx.win` existing). Bila tak diinginkan, perlu keputusan produk (guard `p.cpu` di mode CPU) di sub-stage terpisah.
3. `#fx-layer` z-index 60 > `.overlay` z-index 20, jadi firework tampil di atas layar menang/dialog selama ±1,5 dtk.
4. Posisi ledakan adalah proyeksi 2.5 unit di atas pion (dibatasi 12–88% kanvas), belum diverifikasi visual di perangkat nyata.
5. Tab di-background: `animationend` tidak terkirim sampai kembali aktif; partikel menunggu, batas 60 tetap dijaga (dihitung dari DOM).
6. Reduced-motion juga membisukan SFX Firework.
7. `startGame` tidak memanggil `ParticleFX.clear()`; sisa partikel (≤ ~1,5 dtk) bisa terlihat bila restart sangat cepat — tidak diubah agar tidak menyentuh gameplay.

## Result
READY FOR MANUAL TEST
