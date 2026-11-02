# Stage 4.1.23.4 — Firework Gameplay Trigger

## Scope
Menghubungkan Firework (visual + SFX) ke event kemenangan yang sudah ada. Tanpa perubahan aturan menang, giliran, score, reward, Power, dice, board, movement, state, ParticleFX, atau Three.js FX.

## Event Chosen
`celebrate(p)` di `gameplay.html`: efek kemenangan setelah Ender Dragon dikalahkan (`p.dhp<=0`). Satu-satunya pemanggil `celebrate` adalah jalur `celebrate → dragonDefeatReward → finishGame` (satu-satunya jalur ke `finishGame`; tidak ada jalur menang kedua). Event ini sudah memainkan `sfx.win()` + konfeti 3D; Firework ditambahkan di titik yang sama.

## Hook Location
- `gameplay.html`, di `celebrate(p)`: `sfx.win(); spawnConfetti(p.pawn.position); fireworkCelebrate(p);`
- Helper baru `fireworkCelebrate(p)` (+ `let FW_GID`) diletakkan setelah `clearConfetti()`. Memproyeksikan titik 2.5 unit di atas pion pemenang ke layar (`camera`, `$('c').getBoundingClientRect()`), dibatasi 12–88% kanvas, lalu `UT.FireworkFX.burstAt(x, y)`. Dibaca sekali per event, bukan per frame.
- Bukan dari render function, animation loop, particle update, atau UI render.

## Duplicate Prevention
`FW_GID` menyimpan `gameId` terakhir yang sudah dirayakan; panggilan kedua pada game yang sama langsung return (mekanisme `gameId` existing; game baru = `gameId` baru = boleh lagi). `FireworkFX.burstAt` memutar SFX tepat 1x, jadi 1 event = 1 visual + 1 SFX Firework.

## Graceful Failure
Modul tidak termuat → dilewati; `burstAt` melempar error → ditelan try/catch; reduced-motion → engine mengeluarkan 0 partikel dan SFX tidak diputar. Gameplay (celebrate → reward → finishGame) tidak bergantung pada Firework.

## Static Checks
- `node --check` OK untuk inline script `gameplay.html` (diekstrak) dan modul JS (`firework-fx.js`, `audio.js`, tidak berubah sejak 4.1.23.3).
- jsdom (bukan browser), kode helper diekstrak dari `gameplay.html`: 3 panggilan pada game yang sama → 24 partikel & 1 SFX; game berikutnya → SFX ke-2; posisi terproyeksi benar (220px,186px untuk input uji); tanpa modul FireworkFX → tanpa error; reduced-motion → 0 partikel & 0 SFX; `burstAt` melempar error → ditelan.
- Regresi ParticleFX/Firework/SFX (tes 4.1.22–4.1.23.3) tetap lulus.
- Satu-satunya pemanggil `FireworkFX`/`fireworkCelebrate` di luar modul: `celebrate()`.
- Tidak ada rAF/interval/timer baru. Runtime reference ke folder referensi (voxel fx lab): 0.

## Regression
Diff `gameplay.html`: +12 baris (komentar, `FW_GID`, `fireworkCelebrate`) dan 1 baris `celebrate` diperluas. Tidak berubah: `finishGame`, `dragonDefeatReward(p,gid)`, `p.shield=true`, `renderChips()` (jumlah kemunculan sama dengan HEAD), aturan menang, giliran, score, reward, Power, dice, board, movement. `particle-fx.js/css`, `firework-fx.js`, `audio.js` tidak diubah.

## Manual Browser Test
NOT RUN — requires user/browser testing. Yang perlu dicek: kalahkan Ender Dragon → firework muncul di atas pion pemenang, 1 suara firework, tidak ada firework kedua saat layar menang muncul; di mode CPU saat CPU menang; restart lalu menang lagi.

## Result
READY FOR MANUAL TEST
