# DRAGON WORLD FEATURE 6 — DRAGON DEFEAT & REWARD

Scope: saat Ender Dragon kalah -> efek/suara menang (existing) -> feedback "Dragon defeated" (existing) -> hadiah via reward system existing -> status kemenangan tersimpan -> hadiah TIDAK bisa ganda. Tidak ada fitur Dragon lain.

## Alur
Dragon Attack (`hitDragon`) -> `p.dhp<=0` -> **[baru]** `DRG.defeated=true` + `settleDragonDefeat(p)` (hadiah + simpan status, sinkron) -> efek kalah existing (`sfx.dragonDeath`, panel "Ender Dragon kalah!", konfeti, naga tenggelam) -> `celebrate` existing (`sfx.win`, 3 lompatan) -> **[baru]** `dragonDefeatReward` (feedback hadiah) -> `finishGame` existing (layar menang, +50 skor).

## Yang dipakai ulang (tidak dibuat baru)
- Efek/suara/feedback kalah: `hitDragon`, `celebrate`, `sfx.dragonDeath`, `sfx.win`, `hud('showResult')`, `spawnConfetti`.
- Hadiah: `PlayerData.grant({coins,gems,reason})` (atomik, satu penulisan) — sama dengan daily reward. Tidak ada currency/reward system baru.
- Feedback hadiah: `hud('showResult')` + `sfx.rewardpower` (SFX existing).
- Layar menang: `finishGame` existing; hanya ditambah satu baris teks hadiah.

## Perubahan
- `game/gameplay/config.js`: `DRAGON_REWARD = {coins:500, gems:10}` (nominal saja, single source of truth config).
- `game/gameplay.html`:
  - `canAttackDragon` + `&&!DRG.defeated` (naga yang sudah kalah tidak bisa diserang lagi).
  - Blok Feature 6: `DRG` (state per game), `resetDragonDefeat`, `dragonWinLoad/Save`, `settleDragonDefeat`, `dragonDefeatReward`.
  - `hitDragon`: 1 baris di cabang `p.dhp<=0` (`DRG.defeated=true; settleDragonDefeat(p)`).
  - `playTurn` cabang Block 100: `await A(dragonDefeatReward(p,gid))` antara `celebrate` dan `finishGame`.
  - `finishGame`: teks hadiah ditambahkan ke `#winText` (hanya bila pemenang manusia).
  - `startGame`: `resetDragonDefeat()` (flag + token baru tiap game).

## Anti-ganda (3 lapis)
1. `DRG.defeated` menutup `hitDragon` begitu naga kalah (serangan ulang = tanpa efek/hadiah).
2. `DRG.done` / `DRG.busy` mengunci `settleDragonDefeat`; fungsi sinkron (tanpa `await`) sehingga tidak bisa disela game baru/stale.
3. Token unik per game dicocokkan dengan catatan tersimpan (`last.token` + `settled`) — menahan duplikat walau flag memori hilang.
Grant yang gagal TIDAK menandai selesai (grant atomik: gagal = tidak ada yang tertulis), jadi boleh dicoba ulang tanpa risiko ganda.

## Penyimpanan status kemenangan
`localStorage['ut-dragon-win']` = `{v:1, wins, last:{token,winner,skin,cpu,mode,at,settled,rewarded,coins,gems}}`.
- Terpisah dari `PlayerData` (skema PlayerData membuang field tak dikenal; mengubahnya di luar scope).
- Semua akses `try/catch`; data rusak dicadangkan ke `ut-dragon-win:corrupt:<ts>` (tidak dihapus).
- Gagal menulis catatan tidak membatalkan hadiah dan tidak crash; anti-ganda tetap oleh flag memori.
- Saldo coin/gem tetap hanya di `PlayerData` (tidak ada saldo kedua).

## Aturan hadiah
- Pemenang manusia -> hadiah 1x per game. Mode lokal 2-4 pemain: hadiah masuk ke profil lokal (PlayerData hanya punya satu profil).
- Pemenang CPU (pemain kalah) -> kemenangan dicatat (`cpu:true`, `rewarded:false`), tanpa hadiah, `wins` tidak bertambah.
- Game baru ("Main lagi") -> token baru, hadiah bisa didapat lagi 1x.

## PERLU DIPUTUSKAN (catatan jujur)
- **Nominal hadiah** 500 Coin + 10 Gem adalah pilihan saya (skala daily reward: 1.000 Coin / 50 Gem). Ubah di `DRAGON_REWARD` tanpa menyentuh logika.
- **"Gameplay kembali normal"**: ditafsirkan sebagai alur menang existing — `finishGame` mengakhiri ronde, layar menang muncul, "Main lagi" mereset semua (naga, crystal, flag defeat) sehingga gameplay normal lagi. Naga mati (disembunyikan) dan belum ada fitur respawn, jadi melanjutkan ronde yang sama tidak punya arti tanpa fitur Dragon lain. Bila maksudnya ronde berlanjut setelah hadiah, itu perlu fitur terpisah.

## Test
- Syntax 4 skrip inline `gameplay.html` + `config.js` (`node --check`): PASS.
- Smoke test Node (kode ASLI diekstrak dari `gameplay.html`: `canAttackDragon`, blok Feature 6, `hitDragon`, cabang Dragon `playTurn`, `finishGame`; `PlayerData` + `item-catalog` asli; stub visual/SFX): **25/25 PASS**.
  - Kalah -> +500 Coin +10 Gem tepat 1x, catatan tersimpan, urutan efek -> hadiah -> layar menang, teks menang memuat hadiah.
  - Event terpanggil ulang (`hitDragon`, `settleDragonDefeat`, `dragonDefeatReward`, `playTurn`, flag memori hilang): tidak ada hadiah/`wins` tambahan.
  - Game baru: hadiah lagi 1x. Belum READY: tanpa damage/hadiah. CPU menang: tanpa hadiah, tercatat. Grant gagal -> retry 1x berhasil -> duplikat ditolak. localStorage penuh: tanpa crash, hadiah 1x. Catatan rusak: dicadangkan.
- Diff ditinjau: tidak ada baris dadu, movement, kamera, Awakening, crystal progression, Special Dice, power-up, atau giliran yang diubah.
- BELUM diverifikasi: browser/Android nyata (tampilan panel "Hadiah Dragon" dan teks hadiah di kartu menang pada layar kecil/landscape), alur penuh interaktif crystal -> READY -> serang tahan-lepas -> menang, multi-pemain nyata, regresi pause/AFK/CPU di browser, perilaku `PlayerData` lintas-tab saat hadiah masuk. Perlu dicek manual.

Files changed: game/gameplay.html, game/gameplay/config.js, audit/4/dragon-feature-06-defeat-reward.md
Tidak diubah: dadu, kamera, board/tile/gerak, Awakening, crystal progression, special dice, attack/damage, player-data.js
