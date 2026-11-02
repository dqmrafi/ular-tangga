# Stage 4.1.24.D.1 — Result Audio Integration

## Baseline
Stage 4.1.24.C, commit `0bb04dd`, HEAD == origin/main, ahead/behind 0/0 (diverifikasi sebelum mulai).

## Previous Audits
- Stage 4.1.24.A (inventory, `1198ab7`): menemukan `ui/game-lose.mp3` ada tapi tidak dipanggil gameplay, dan indikasi CPU menang → "Kamu kalah" + victory fanfare + firework (O3).
- Stage 4.1.24.B (gap list, `9440d85`): memetakan O3 sebagai WRONG_AUDIO / WRONG_RESULT_INTEGRATION (P0) dan Defeat sebagai AVAILABLE_BUT_UNUSED (P0); Victory = `win()` sintetis (P1).
- Stage 4.1.24.C (asset plan, `0bb04dd`): C01 Defeat = REUSE_EXISTING `ui/game-lose.mp3`; C02 Victory = NEW_ASSET_REQUIRED `result/victory.mp3`; C03 Draw = NOT_NEEDED; O3 = integrasi tanpa asset.
- Stage 4.1.24.D.1 (ini): mengimplementasikan C01 + koreksi O3; C02 BLOCKED.
Audit A/B/C tidak diubah.

## Scope
Hanya Victory, Defeat, Draw (jika ada), CPU result correctness. Tidak menyentuh Power, TNT, Creeper, Snake, Ladder, Movement, UI reward, implementasi Firework, multiplayer, mekanik lain.

## Changes Made
1. `game/gameplay/audio.js`: tambah kunci `FILE.defeat = 'ui/game-lose.mp3'` dan `sfx.defeat()` (`fileSfx('defeat',0.9)`, tanpa fallback sintetis). Pola sama dengan SFX file existing; tidak ada `new Audio` baru di luar helper `fileSfx`/`preload` existing; tidak ada engine kedua.
2. `game/gameplay.html`:
   - `isPlayerDefeat(p)` = `mode==='cpu' && p.cpu` (predikat yang sama dengan `lost` lama di `finishGame`; kini satu sumber kebenaran).
   - `finishGame`: `lost=isPlayerDefeat(p)`; bila `lost` dan `RES_GID!==gameId` → `RES_GID=gameId; sfx.defeat()` (1× per game).
   - `celebrate(p)`: bila `isPlayerDefeat(p)` (CPU menang) → TIDAK memanggil `sfx.win()` dan `fireworkCelebrate(p)`. Konfeti dan lompatan pion tetap (visual, tidak diubah). Implementasi Firework (`firework-fx.js`, `fireworkCelebrate`) tidak diubah; hanya pemanggilnya dilewati untuk hasil kalah.

## Files Changed
- `game/gameplay/audio.js` (+2 baris)
- `game/gameplay.html` (+9/−2)
- `audit/4/stage-4.1.24.D.1-result-audio-integration.md` (baru)
Tidak ada file audio yang ditambah/diubah/dihapus.

## Victory Audio
### Asset
`game/assets/sfx/result/victory.mp3` — **tidak ada** di repo (folder `result/` pun belum ada) [CONFIRMED: `ls`, `find -iname '*victory*'`].
### Trigger
Tidak dipasang. Tidak ada audio sintetis baru dibuat.
### Status
**BLOCKED — AUDIO ASSET NOT PRESENT.** Integrasi victory TIDAK selesai. Perilaku player-win tetap legacy: `celebrate` → `sfx.win()` (fanfare sintetis lama) + Firework; ini bukan pekerjaan D.1 dan diakui sebagai sintetis sementara (C02). Saat asset tiba: tambah `FILE.victory` + `sfx.victory()` dan ganti `sfx.win()` pada cabang non-defeat di `celebrate`.

## Defeat Audio
### Asset
`game/assets/sfx/ui/game-lose.mp3` (2.1s, 48 kHz stereo, 67.584 B, Stage C [FS]). Kecocokan bunyi **NOT VERIFIED** (tidak didengar).
### Trigger
`finishGame(p)` ← satu-satunya pemanggil di `playTurn` setelah naga kalah (`p.dhp<=0` → `celebrate` → `dragonDefeatReward` → `finishGame`). Dipicu oleh transisi hasil (`gameOver=true`, `lost`), bukan oleh render/teks/modal/animasi/polling. Guard `RES_GID` = 1× per `gameId` (pola sama dengan `FW_GID` Firework). Lewat `GA.sfx` (UT.GameplayAudio) sehingga mengikuti `muted`, gerbang `ready` (unlock setelah gesture), dan preload existing.
### Status
Terpasang (statik + stub test). Browser test NOT RUN.

## CPU Result Audit
Jalur [CONFIRMED di kode]: `hitDragon` → `DRG.defeated` → `celebrate(p)` → `dragonDefeatReward` → `finishGame(p)`. Mode vs Computer: pemain = index 0 (`!p.cpu`), Computer = Villager (`p.cpu`).
### Player Wins
`celebrate`: `sfx.win()` + konfeti + Firework (tidak berubah); `finishGame`: panel "Kamu menang", tanpa defeat audio.
### Player Loses
Sama dengan CPU menang (satu-satunya kondisi kalah di kode).
### CPU Wins
Sebelum: fanfare + Firework + layar "Kamu kalah" (O3). Sesudah: tanpa fanfare/Firework; `sfx.defeat()` 1× di `finishGame`; layar "Kamu kalah" tidak berubah. Hadiah Dragon tidak diberikan untuk CPU (kode existing, tidak diubah).
### CPU Loses
= Player Wins.
### Draw
Tidak ada state draw di gameplay → tidak ada audio draw (C03 NOT_NEEDED).
### Mode lokal 2–4 pemain
`mode!=='cpu'` → tidak ada hasil "kalah"; perilaku menang tidak berubah.

## Firework Interaction
`fireworkCelebrate` hanya dipanggil pada hasil menang pemain; guard `FW_GID` existing tetap. Defeat audio tidak memanggil Firework dan Firework tidak memanggil defeat → tidak ada loop victory→audio→firework→victory. Untuk CPU menang, Firework tidak lagi tampil/berbunyi (perubahan perilaku disengaja, hanya gating pemanggil).

## Duplicate Playback Check
- `sfx.defeat()` hanya satu call site (`finishGame`) + guard `RES_GID`; `finishGame` hanya satu pemanggil.
- `celebrate` sebelumnya memutar `win()` + Firework untuk CPU menang; kini tidak (tidak ada tumpang tindih dengan defeat).
- Catatan di luar scope: `sfx.win()` juga dipanggil saat pion tiba di petak 100 (`gameplay.html` ±3261, event progres, bukan hasil). Tidak diubah; ini fanfare sintetis untuk semua pemain termasuk CPU. Dicatat untuk stage berikutnya.

## Audio Settings Compatibility
Stub test (`/tmp` node, `Audio` di-mock) pada `audio.js` [CONFIRMED]: belum ready → 0 pemutaran; ready → 1 pemutaran `assets/sfx/ui/game-lose.mp3`; muted → 0; unmuted → 1. Mute, gerbang unlock, dan preload memakai jalur existing (`GA.setMuted`, `setReady`, `preload`). Kontrol volume terpisah tidak ada di jalur `fileSfx` (volume tetap konstan 0.9, seperti SFX lain); pengaturan di halaman lain tidak diubah. Hasil audio tidak bergantung animasi/rAF/setTimeout: dipicu sinkron di `finishGame`.

## Static Checks
- `node --check game/gameplay/audio.js`: OK.
- Inline script `gameplay.html` (4 blok, digabung ke file sementara): `node --check` OK.
- `grep game-lose / victory.mp3 / sfx.defeat / new Audio` pada `gameplay.html` dan `gameplay/*.js`: `game-lose` hanya di `audio.js` (FILE.defeat); `sfx.defeat` hanya di `finishGame`; `victory.mp3` tidak direferensikan; `new Audio` hanya `bgMusic` (existing) dan helper `preload`/`fileSfx` di `audio.js` (existing). Tidak ada engine audio baru; tidak ada `beep/noise/pop` baru di jalur hasil.
- `sw.js` network-first → tidak perlu bump VERSION.

## Regression Checks
Statik/logis (bukan eksekusi game): Player win, CPU lose → jalur celebrate lama tidak berubah; Player lose/CPU win → jalur baru; mute/unmute/unlock → stub test; Firework existing flow → pemanggil/guard tidak diubah untuk hasil menang; mode lokal → tidak terpengaruh. Draw: tidak ada. Tidak dieksekusi di browser.

## Browser Test
**NOT RUN.**

## Known Blockers
1. `result/victory.mp3` tidak ada → Victory BLOCKED (butuh asset dari Stage C C02).
2. Kecocokan bunyi `game-lose.mp3` NOT VERIFIED (perlu didengar).
3. Verifikasi manual di browser/Android diperlukan: CPU menang → hanya suara kalah, tanpa Firework; player menang → perilaku lama.

## Git Checkpoint
Lihat laporan akhir (commit/push/verifikasi dicatat setelah push; hash tidak dapat ditanam di file yang di-commit).

## Conclusion
Defeat + koreksi O3 terintegrasi (statik). Victory belum — BLOCKED menunggu asset. Draw tidak ada.

## Next Stage
Stage 4.1.24.D.2 — Power Audio Integration (mulai dari audit D.1 ini).
