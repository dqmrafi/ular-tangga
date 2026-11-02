# Stage 4.1.24.B — Audio Gap List

Mode: AUDIT-ONLY. Tidak ada file kode/audio yang diubah.
Label bukti: **[CONFIRMED]** = dibaca di kode / hash file, **[INFERRED]** = disimpulkan dari kode, **[NOT VERIFIED]** = tidak diperiksa / tidak didengar.

## Baseline
- Stage 4.1.24.A, commit `1198ab7`.
- **Drift:** audit dijalankan pada HEAD `ccfed70` (2 commit setelah baseline). `df3d9cf` menambah `arenaUp` dan `crystalsCleared` (file root `sfx/`) di `audio.js` + `gameplay.html`. Temuan Stage A untuk Dragon arena/crystal sudah berubah; sisanya diverifikasi ulang terhadap kode. [CONFIRMED lewat `git diff 1198ab7 HEAD`]
- Karakter bunyi file TIDAK dinilai (tidak didengar); hanya nama, jalur, dan pemanggilan.

## Summary
- Audio nyata dipakai: dice-roll, pawn-hop, ladder-up, snake-bite, block-100, chest-open/close, power-reward, mob-punch, player-hurt, creeper-fuse, skeleton-shoot, enderman-teleport, dragon-idle/hurt/death, earthquake, tower-rise, crystal-appear/break, arena-up, crystals-done, Firework_launch.
- Sintetis (beep/noise): semua Power, shield, victory fanfare, hiss/chomp/gulp ular, ladder beeps, bounce (Creeper explode & Computer-sama), Ready screen ticks.
- Tidak ada suara: dice landing, turn start/change, TNT, dragon explosion, draw (event draw tidak ada di kode).
- 9 file ada tapi tidak dipanggil gameplay; 1 broken reference dormant; 1 pasang duplikat byte-identik.
- Temuan baru di luar Stage A: **ular memutar `ladder-up.mp3`** (WRONG_AUDIO).

## Tabel EVENT → AUDIO → GAP
| Event | Audio tersedia | Dipakai | Status | Prio |
|---|---|---|---|---|
| Dice roll | dice/dice-roll.mp3 | file (fallback beep) | OK | — |
| Dice landing/stop | — | `rollStop` hanya fade-out loop | MISSING (event tanpa suara) | P2 |
| Dadu 6 / tiga kali 6 | — | `bounce()` sintetis di "Tiga kali 6" | SYNTHETIC | P2 |
| Pawn step/hop | board/pawn-hop.mp3 | file | OK | — |
| Landing | — | tidak ada | MISSING | P2 |
| Turn start / change | — | tidak ada | MISSING | P2 |
| Ladder climb | board/ladder-up.mp3 | `ladder()` beeps sintetis (di climb) + `naiktangga()` file (di tile) → dua lapis | OK + SYNTHETIC (duplikasi layer [INFERRED]) | P2 |
| Snake bite (animasi) | board/snake-bite.mp3 | hiss/chomp/gulp sintetis + `caplokular` file | OK + SYNTHETIC | — |
| Snake bite (tile trigger) | snake-bite*.mp3 | `naiktangga()` = **ladder-up.mp3** (gameplay.html:3270) | WRONG_AUDIO | P0 |
| Snake tanpa animasi gigit (`!SNAKEINFO`) | — | senyap | MISSING | P2 |
| Block 100 / sampai 100 | board/block-100.mp3 | file + `win()` fanfare sintetis | OK + SYNTHETIC | — |
| Power use (6 jenis) | lihat matriks | `pop()` sintetis tunggal | SYNTHETIC | P0 |
| Shield activate/protect/consume | — | `pop()` (activate: usePU; protect+consume: satu event `pop()`) | SYNTHETIC | P1 |
| Chest open | reward/chest-open.ogg | file | OK | — |
| Chest close | reward/chest-close.ogg | file | OK | — |
| Chest reward / power claim | reward/power-reward.mp3 | `rewardpower` file + `pop()` | OK | — |
| ui/chest-reward.mp3 | ada | tidak dipanggil di gameplay | AVAILABLE_BUT_UNUSED | P1 |
| ui/power-claim.mp3 | ada | tidak dipanggil | AVAILABLE_BUT_UNUSED + DUPLICATE_ASSET | P1 |
| Dragon hit | dragon/dragon-hurt.ogg, board/block-100.mp3 | hurt file + `hundred()` (block-100 dipakai sbg impact) | OK / kecocokan block-100 NOT VERIFIED | P2 |
| Dragon attack (naga menyerang) | — | event tidak ada di kode | NOT IN GAMEPLAY | — |
| Dragon awakening | earthquake, arena-up, tower-rise, crystal-appear, dragon-idle | semua file dipanggil | OK | — |
| dragon/dragon-awakening.mp3 | tidak ada | `FILE_AWAKENING` di audio.js; `sfx.dragonAwakening()` tidak dipanggil siapa pun | BROKEN_REFERENCE (dormant) | P2 |
| Dragon death/explosion | dragon-death.ogg | file; ledakan terpisah tidak ada | OK / MISSING ledakan | P2 |
| Creeper fuse | mob/creeper-fuse.ogg | file | OK | — |
| Creeper explosion | mob/creeper-explosion.mp3 | `explode()` → `bounce()` sintetis | AVAILABLE_BUT_UNUSED + SYNTHETIC | P0 |
| mob/creeper-hiss.mp3 | ada | tidak dipanggil | AVAILABLE_BUT_UNUSED | P2 |
| Enderman | enderman-teleport.ogg | file | OK (enderman-alt.ogg unused) | — |
| Skeleton | skeleton-shoot.ogg, player-hurt | file | OK | — |
| Villager | — | `pop()` | SYNTHETIC | P2 |
| Mob punch/hit | mob-punch.mp3 | file (mob-hit-alt unused) | OK | — |
| Victory (fanfare) | — | `win()` sintetis | SYNTHETIC | P1 |
| Defeat | ui/game-lose.mp3 | tidak dipanggil; `UT.Audio.play('kalah')` tidak ada di gameplay | AVAILABLE_BUT_UNUSED / gap | P0 |
| Draw | — | state draw tidak ada | NOT IN GAMEPLAY | — |
| Firework | win/Firework_launch.ogg | 1× per game (FW_GID guard + `burstAt` sekali) | OK, tanpa duplicate playback [CONFIRMED di kode; didengar NOT VERIFIED] | — |
| Button click | ui/button-click.mp3 | via app.js auto-click untuk halaman tanpa `playSound`; apakah aktif di gameplay NOT VERIFIED | NOT VERIFIED | P2 |
| Coin/gem/purchase/error/back | — | tidak ada di gameplay (halaman lobby/shop memakai `UT.Audio`) | di luar gameplay | — |

## P0 Gaps
1. **O3 — CPU win → WRONG_RESULT_INTEGRATION.** Jalur: `celebrate(p)` (sfx.win + firework + konfeti) → `finishGame(p)`; `lost=(mode==='cpu'&&p.cpu)` hanya mengubah teks ("Kamu kalah"). Tidak ada cabang audio/visual celebrate untuk kasus kalah. Fanfare + firework tetap main. [CONFIRMED gameplay.html:3229,3247,3395–3401]
2. **Defeat audio tidak dimainkan.** `ui/game-lose.mp3` ada, hanya terdaftar di app.js `SFX.kalah` + preload, tidak dipanggil gameplay. [CONFIRMED]
3. **Creeper explosion sintetis.** `explode()` memakai `bounce()`; `creeper-explosion.mp3` ada tapi tidak ada di tabel FILE. Creeper-fx.js tidak punya audio. [CONFIRMED]
4. **Power: satu `pop()` sintetis untuk 6 Power** (gameplay.html:3062). [CONFIRMED]
5. **Snake memutar ladder-up.mp3** (3270 `sfx.naiktangga()`). Tidak ada di Stage A. [CONFIRMED]

## P1 Gaps
- Shield: aktivasi, proteksi, dan konsumsi semuanya `pop()` (3062, 3266).
- `chest-reward.mp3` dan `power-claim.mp3` tidak dipanggil di gameplay.
- Victory fanfare sintetis (`win()`), dipakai juga saat tiba di 100 (3261) dan di `celebrate`; kecocokan dengan asset nyata NOT VERIFIED.
- TNT tanpa suara khusus (fuse/ledakan); hanya `pop()` + konfeti teleport.

## P2 Gaps
Dice landing, turn start/change, landing, Villager `pop()`, dragon explosion, ular tanpa SNAKEINFO senyap, creeper-hiss/move-back/mob-hit-alt/enderman-alt/snake-bite-alt/dragon-studio.mp3 tidak dipanggil, `dragonAwakening()` dormant, ladder beeps + file berlapis, button click di gameplay.

## Power Audio Matrix
| Power | Visual | Gameplay | Audio | Status |
|---|---|---|---|---|
| Sword | ✓ | ✓ | `pop()` sintetis; `powerup/sword-use.mp3` ada, tidak dipanggil | SYNTHETIC + AVAILABLE_BUT_UNUSED → REUSE EXISTING ASSET |
| Feather | ✓ | ✓ | `pop()` sintetis | SYNTHETIC |
| TNT | ✓ | ✓ | `pop()` sintetis; fuse/explosion tidak ada | SYNTHETIC; kandidat reuse creeper-fuse/creeper-explosion (butuh audit dengar) |
| Totem | ✓ | ✓ | `pop()` (aktivasi dan proteksi) | SYNTHETIC |
| Potion | ✓ | ✓ | `pop()` sintetis | SYNTHETIC |
| Grass | ✓ | ✓ | `pop()` sintetis | SYNTHETIC |
Semua enam memakai fungsi sintetis yang sama. Hanya Sword punya file khusus. [CONFIRMED]

## Computer Audio Audit
- `beginTurn` → CPU memanggil `usePU(k,true)` dan `doRoll()` yang sama dengan pemain; `playTurn`/`walk`/ular/tangga/mob lewat jalur identik. [CONFIRMED 3062, 3330–3380]
- Tidak ada jalur audio terpisah untuk Computer pada event giliran → **tidak ada INTEGRATION GAP di event gameplay**.
- Satu-satunya cabang beda adalah hasil akhir (`finishGame` lost) → lihat O3 (WRONG_RESULT_INTEGRATION, bukan jalur audio Computer).
- TNT/Grass saat tidak valid: CPU `return` diam-diam (tanpa suara), sama dengan konsep tanpa feedback.

## Victory / Defeat Audit
- Victory: `sfx.win()` sintetis + Firework file; menang juga memicu `dragonDeath` + `rewardpower` (hadiah) sebelum layar menang.
- Defeat: tidak ada suara kalah. `game-lose.mp3` unused. Draw: tidak ada.
- CPU win memutar victory+firework lalu layar "Kamu kalah" (P0 di atas).

## Creeper / TNT Audit
- Creeper: fuse = `creeper-fuse.ogg` (file), hurt = `player-hurt.mp3` (file), ledakan = `bounce()` sintetis. `creeper-explosion.mp3` dan `creeper-hiss.mp3` AVAILABLE_BUT_UNUSED. Tidak dipasang.
- TNT: tidak ada audio dedicated; `pop()` saat dipakai, lalu `teleport()` hanya visual.

## Available Assets That Should Be Reused (REUSE EXISTING ASSET)
`ui/game-lose.mp3` (defeat), `mob/creeper-explosion.mp3` (Creeper), `powerup/sword-use.mp3` (Sword), `ui/chest-reward.mp3`, `ui/power-claim.mp3` (reward/claim; cek duplikat dengan reward/power-reward.mp3). Kandidat reuse (butuh audit dengar, belum diputuskan): creeper-fuse/explosion untuk TNT, `snake-bite-alt.mp3` untuk ular, `creeper-hiss.mp3`, `mob-hit-alt.mp3`, `move-back.mp3` (bounce/mundur), `enderman-alt.ogg`.

## Missing Assets That Must Be Created/Sourced (NEW AUDIO ASSET NEEDED)
Feather, Potion, Grass, Totem (aktivasi/proteksi/konsumsi), TNT ledakan jika creeper tidak cocok, dice landing, turn change, victory fanfare nyata (opsional), dragon explosion, villager. Keputusan akhir di Stage C setelah audit dengar.

## Broken References
- `dragon/dragon-awakening.mp3` (`FILE_AWAKENING` di audio.js): file tidak ada; `dragonAwakening()` tidak dipanggil gameplay (diganti `quakeStart`). Dormant, tidak memengaruhi gameplay. Tidak diperbaiki.

## Duplicate Assets
- `board/snake-bite.mp3` == `ui/power-claim.mp3`, md5 `752509e3d0200569d16ac2415537e449`. [CONFIRMED]. DUPLICATE_ASSET, tidak diubah.
- Pasangan lain yang dicek berhash beda.

## Recommended Next Stage
Stage 4.1.24.C — Audio Asset Plan
