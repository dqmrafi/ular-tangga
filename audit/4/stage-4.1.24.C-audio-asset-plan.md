# Stage 4.1.24.C — Audio Asset Plan

Mode: PLANNING ONLY. Tidak ada audio dibuat/diunduh/dihapus/di-rename/dikonversi; `audio.js`, gameplay, Power, Creeper, Firework, Computer tidak diubah.
Label: **[A]** = Stage 4.1.24.A, **[B]** = Stage 4.1.24.B, **[FS]** = diperiksa ulang di filesystem (ffprobe/md5) pada stage ini. **NOT VERIFIED** = belum didengar / belum dibuktikan.

## Baseline
- Stage 4.1.24.A (`1198ab7`), Stage 4.1.24.B (`9440d85`, HEAD saat plan ditulis).
- Sumber keputusan: `audit/4/stage-4.1.24.A-audio-inventory.md`, `audit/4/stage-4.1.24.B-audio-gap-list.md`.
- Kesesuaian bunyi file dengan event dinilai dari nama + pemanggilan kode, **bukan didengar**. Setiap pilihan REUSE yang bergantung pada karakter bunyi diberi tanda "perlu dengar" untuk gerbang review sebelum Stage D.

## Planning Rules
1. Real asset yang ada dipakai dulu (REUSE_EXISTING / REUSE_EXISTING_REMAP). Asset baru hanya bila tidak ada kandidat.
2. Event yang tidak ada di kode tidak diberi asset (NOT_NEEDED). Tidak ada katalog "Minecraft-style" lengkap.
3. Audio adalah respons event game, bukan identitas pemain (Computer = Player, lihat bagian Computer).
4. **Struktur folder: pertahankan 7 folder existing** (`ui/ dice/ board/ reward/ powerup/ mob/ dragon/` + `win/`), tambah hanya `result/` bila perlu. Struktur ideal `movement/ power/ chest/` **tidak diadopsi**: path terdaftar di tabel `FILE` (audio.js), map `SFX` (app.js), README, dan daftar preload `loading.html`/`splash.html`/`play.html` [A,FS]; rename = risiko tinggi tanpa manfaat. Power baru masuk ke `powerup/` (sudah ada `sword-use.mp3`), bukan `power/`.
5. Tidak ada rename/hapus di stage ini; keputusan itu di implementasi terpisah.

## Master Plan
Prioritas mengikuti Stage B. Folder/nama target hanya rencana (belum dibuat).

| ID | Event | Existing asset | Action | Prio | Filename target | Notes |
|---|---|---|---|---|---|---|
| C01 | Defeat (kalah, termasuk CPU menang) | `ui/game-lose.mp3` (2.1s, 48k stereo, 67 KB) [FS] | REUSE_EXISTING | P0 | `ui/game-lose.mp3` (tetap) | Pasang di Stage D lewat cabang `lost` di `finishGame`. Kecocokan bunyi NOT VERIFIED (perlu dengar). Pemilihan victory vs defeat per hasil = O3 (integrasi, tanpa asset). |
| C02 | Victory | tidak ada (hanya `win()` sintetis) [B] | NEW_ASSET_REQUIRED | P0 | `result/victory.mp3` | Sementara: `win()` sintetis tetap sebagai fallback. Kandidat reuse tidak ada: `power-reward.mp3`/`setalah-hancurkan-crsytal.mp3` sudah punya event lain. |
| C03 | Draw | — | NOT_NEEDED | — | — | Event draw tidak ada di kode [B]. |
| C04 | Snake bite di tile (salah pakai ladder-up) | `board/snake-bite.mp3`, `board/snake-bite-alt.mp3` | REUSE_EXISTING_REMAP | P0 | tanpa file baru | Hapus pemakaian `ladder-up` untuk ular; animasi gigit sudah punya `caplokular`=snake-bite.mp3. Opsi: senyap, atau `snake-bite-alt.mp3` (perlu dengar). Fix = Stage D. |
| C05 | Snake tanpa animasi (`!SNAKEINFO`) | `board/move-back.mp3` (0.9s, 24k) | REUSE_EXISTING_REMAP (kandidat) | P2 | `board/move-back.mp3` | Kandidat, belum diputuskan tanpa dengar. |
| C06 | Ladder climb | `board/ladder-up.mp3` (1.4s, 32k) | NO_NEW_ASSET_REQUIRED | P2 | tetap | `ladderBeeps` sintetis ikut berlapis di `climb()` [B,INFERRED]; keputusan satu lapis atau dua = Stage D. |
| C07 | Power: Sword | `powerup/sword-use.mp3` (0.8s, 24k stereo, 16 KB) [FS] | REUSE_EXISTING | P0 | `powerup/sword-use.mp3` (tetap) | Belum dipanggil [B]. Cocok menurut nama; NOT VERIFIED dengar. |
| C08 | Power: Feather | tidak ada | NEW_ASSET_REQUIRED | P0 | `powerup/feather-use.mp3` | Sementara `pop()`. |
| C09 | Power: Potion | tidak ada | NEW_ASSET_REQUIRED | P0 | `powerup/potion-use.mp3` | Sementara `pop()`. |
| C10 | Power: Grass | tidak ada | NEW_ASSET_REQUIRED | P0 | `powerup/grass-use.mp3` | Sementara `pop()`. Event = tukar posisi (teleport). |
| C11 | Power: Totem activate | tidak ada | NEW_ASSET_REQUIRED | P0 | `powerup/totem-activate.mp3` | Sementara `pop()`. |
| C12 | Totem protect/consume (shield) | tidak ada | NEW_ASSET_REQUIRED (boleh digabung dengan C11 jika dengar menunjukkan cukup) | P1 | `powerup/totem-protect.mp3` | Event protect dan consume di kode = satu panggilan `pop()` (3266) [B], jadi satu asset cukup. |
| C13 | TNT fuse | `mob/creeper-fuse.ogg` (5.7s, mono) kandidat | NEW_ASSET_REQUIRED (kecuali reuse disetujui setelah dengar) | P0 | `powerup/tnt-fuse.mp3` (≤1s) | Kandidat terlalu panjang (5.7s) dan identitas Creeper; jangan diputuskan tanpa dengar. |
| C14 | TNT explosion | `mob/creeper-explosion.mp3` (3.9s, 24k, 78 KB) | REUSE_EXISTING | P0 | `mob/creeper-explosion.mp3` (tetap, dipakai bersama) | Satu canonical explosion untuk TNT dan Creeper; variasi TNT dapat menyusul di P2 (volume/rate), bukan file baru. |
| C15 | Creeper explosion | `mob/creeper-explosion.mp3` | REUSE_EXISTING | P0 | tetap | Ganti `bounce()` di `explode()` (Stage D). Tidak ada asset baru. |
| C16 | Firework | `win/Firework_launch.ogg` (1.6s, mono) dipakai; `Firework_twinkle.ogg` (1.3s), `Firework_large_blast_far.ogg` (2.5s) ada, tidak dipakai | NO_NEW_ASSET_REQUIRED | P0→OK | tetap | Implementasi = 1 sound per burst, 1× per game [B]; tidak dipaksa 3 asset. Burst layer opsional P2 dari `large_blast_far`. |
| C17 | Dice roll | `dice/dice-roll.mp3` (2.0s, 44.1k) | NO_NEW_ASSET_REQUIRED | OK | tetap | — |
| C18 | Dice stop/landing | — | NOT_NEEDED (SYNTHETIC_FALLBACK_ONLY bila ingin) | P2 | — | Saat ini fade-out loop; tidak ada event bunyi tersendiri. |
| C19 | Player step/hop | `board/pawn-hop.mp3` (0.14s, 5 KB) | NO_NEW_ASSET_REQUIRED | OK | tetap | — |
| C20 | Player land | — | NOT_NEEDED | P2 | — | Tidak ada event terpisah; hop sudah menutup langkah. |
| C21 | Turn start / turn change | — | NOT_NEEDED | P2 | — | Tidak ada pemanggilan di kode; hanya potensial, tidak dibuat. |
| C22 | Chest open/close | `reward/chest-open.ogg`, `reward/chest-close.ogg` (0.5s mono) | NO_NEW_ASSET_REQUIRED | OK | tetap | — |
| C23 | Chest reward / power reward | `reward/power-reward.mp3` (5.9s, 188 KB) dipakai; `ui/chest-reward.mp3` (1.4s, 32k) | REUSE_EXISTING | P1 | tetap | Gameplay sudah punya hadiah; `ui/chest-reward.mp3` dipakai UI (`UT.Audio 'chest'`) per README, bukan unused total: koreksi atas Stage B yang melabeli "unused di gameplay". |
| C24 | Power claim (UI) | `ui/power-claim.mp3` = byte-identik `board/snake-bite.mp3` [FS] | DECISION_DEFERRED (perlu dengar) | P1 | — | Bunyinya sama dengan gigitan ular; "claim" semantik kemungkinan salah pakai [INFERRED]. Opsi: remap `'power'` ke `reward/power-reward.mp3` (REUSE_EXISTING_REMAP) atau NEW_ASSET_REQUIRED `ui/power-claim.mp3` baru. Jangan hapus. |
| C25 | Coin/gem reward | — | NOT_NEEDED (di gameplay) | — | — | Tidak ada event coin/gem di gameplay; halaman shop/daily di luar scope, NOT VERIFIED. |
| C26 | Button click (gameplay) | `ui/button-click.mp3` (0.05s) | NO_NEW_ASSET_REQUIRED | P2 | tetap | Apakah auto-click app.js aktif di gameplay NOT VERIFIED. |
| C27 | Villager help | — | SYNTHETIC_FALLBACK_ONLY | P2 | — | `pop()` tetap. |
| C28 | Dragon hit | `dragon/dragon-hurt.ogg` + `board/block-100.mp3` sebagai impact | NO_NEW_ASSET_REQUIRED | P2 | tetap | Kecocokan block-100 sebagai impact NOT VERIFIED. |
| C29 | Dragon attack / dragon explosion | — | NOT_NEEDED | — | — | Event tidak ada di kode [B]; `dragon-death.ogg` sudah ada. |
| C30 | Dragon awakening (`dragon-awakening.mp3`) | file tidak ada; `dragonAwakening()` tidak dipanggil [B] | NO_NEW_ASSET_REQUIRED / DEFERRED | P2 | — | Jangan buat file untuk path dormant. Opsional: bersihkan `FILE_AWAKENING` saat Stage D. |
| C31 | Mob lain (Enderman/Skeleton/Creeper hiss/mob-hit-alt/enderman-alt) | semua ada | NO_NEW_ASSET_REQUIRED | P2 | tetap | Tidak ada zombie/blaze/warden di kode; tidak dibuat. Alt/hiss disimpan sebagai cadangan. |

## P0 Audio Assets
Reuse (tanpa file baru): C01 defeat, C04 snake remap, C07 sword, C14/C15 explosion TNT+Creeper, C16 Firework tetap.
Baru: C02 victory, C08 feather, C09 potion, C10 grass, C11 totem-activate, C13 tnt-fuse (kecuali kandidat creeper-fuse lolos dengar).

## P1 Audio Assets
C12 totem-protect, C23 chest/power reward (reuse), C24 power-claim keputusan (deferred).

## P2 Audio Assets
C05, C06, C18, C20, C21, C26, C27, C28, C30, C31 (kebanyakan NOT_NEEDED / sintetis cukup).

## Power Audio Plan
| Power | Asset nyata? | Cocok? | Perlu baru? | File target | Prio |
|---|---|---|---|---|---|
| Sword | ya, `powerup/sword-use.mp3` | cocok menurut nama; NOT VERIFIED | tidak | `powerup/sword-use.mp3` | P0 |
| Feather | tidak | — | ya | `powerup/feather-use.mp3` | P0 |
| TNT | tidak (fuse); ledakan reuse | explosion ya (NOT VERIFIED); fuse kandidat panjang | fuse ya | `powerup/tnt-fuse.mp3` + `mob/creeper-explosion.mp3` | P0 |
| Totem | tidak | — | ya | `powerup/totem-activate.mp3` (+`totem-protect.mp3` P1) | P0/P1 |
| Potion | tidak | — | ya | `powerup/potion-use.mp3` | P0 |
| Grass | tidak | — | ya | `powerup/grass-use.mp3` | P0 |
Path `power/` dari contoh target diganti `powerup/` mengikuti struktur existing (Planning Rule 4). Fallback sementara per Power = `pop()` yang ada.

## TNT / Creeper Plan
- Creeper: fuse = `creeper-fuse.ogg` (sudah dipakai), hurt = `player-hurt.mp3` (sudah), **explosion = `creeper-explosion.mp3` REUSE_EXISTING** (ganti `bounce()` di Stage D). `creeper-hiss.mp3` cadangan.
- TNT: fuse dan explosion dipisah. Explosion = REUSE `creeper-explosion.mp3`. Fuse = NEW_ASSET_REQUIRED kecuali `creeper-fuse.ogg` lolos dengar (durasi 5.7s berisiko tidak sinkron dengan teleport 0.6s).
- `teleport()` saat ini tanpa audio; titik pemasangan = `usePU` (3062) / sebelum `teleport` (Stage D).

## Result Audio Plan
- Defeat: REUSE `ui/game-lose.mp3`. Victory: NEW `result/victory.mp3`. Draw: NOT_NEEDED.
- Pemilihan berdasar hasil (menang vs kalah vs CPU menang) = integrasi O3 di Stage D; tidak butuh asset. Saat CPU menang: jangan fanfare + firework (keputusan perilaku, bukan asset).

## Dice / Movement Plan
Digunakan: dice-roll, pawn-hop (OK). Tidak ada event: dice-stop, player-land, turn-start, turn-change → NOT_NEEDED. Ladder: reuse. Snake: lihat C04/C05; gigit animasi tetap sintetis hiss/chomp/gulp + `snake-bite.mp3` (P2: `creeper-hiss` kandidat untuk hiss, belum diputuskan).

## Chest / Reward Plan
chest-open/close OK; reward = `power-reward.mp3` (OK); `ui/chest-reward.mp3` dipertahankan untuk UI; power-claim = keputusan deferred (C24); coin/gem tidak ada di gameplay.

## Mob Audio Plan
Mob nyata di kode: Creeper, Enderman, Skeleton, Villager, Dragon [B]. Semua sudah punya file kecuali Villager (`pop()`). Tidak ada zombie/blaze/warden: tidak dibuat.

## Firework Audio Plan
Satu asset (`Firework_launch.ogg`) cukup: 1 bunyi per burst, 1× per game (FW_GID) [B]. `twinkle` dan `large_blast_far` ada, tidak dipakai; tidak ada kebutuhan tiga asset. Duplicate playback tidak ditemukan di kode.

## Computer / Player Audio Strategy
PLAYER/COMPUTER → game event → SFX sama. Tidak ada `computer-*.mp3`. Jalur giliran sudah identik [B]; satu-satunya perbedaan = hasil akhir (O3), diselesaikan dengan memilih audio hasil, bukan asset Computer.

## Existing Assets To Reuse
`ui/game-lose.mp3`, `powerup/sword-use.mp3`, `mob/creeper-explosion.mp3` (Creeper + TNT), `board/snake-bite-alt.mp3`/`board/move-back.mp3` (kandidat), `ui/chest-reward.mp3` (UI), `win/Firework_*` (sudah cukup), `mob/creeper-hiss.mp3`/`mob-hit-alt`/`enderman-alt` (cadangan).

## New Assets Required
| File target | Event | Prio | Spesifikasi format |
|---|---|---|---|
| `result/victory.mp3` | victory | P0 | mp3, 44.1k, ≤3s, ≤80 KB |
| `powerup/feather-use.mp3` | Feather | P0 | mp3, mono/stereo ringan, ≤1s, ≤20 KB |
| `powerup/potion-use.mp3` | Potion | P0 | idem |
| `powerup/grass-use.mp3` | Grass | P0 | idem |
| `powerup/totem-activate.mp3` | Totem aktivasi | P0 | ≤1.5s, ≤30 KB |
| `powerup/tnt-fuse.mp3` | TNT fuse | P0 | ≤1s, ≤20 KB (bila creeper-fuse ditolak) |
| `powerup/totem-protect.mp3` | shield protect/consume | P1 | ≤1s |
| `ui/power-claim.mp3` (baru, ganti isi) | claim UI | P1 deferred | bergantung hasil dengar |

## Format Audio (dari inventaris [FS])
- Proyek: mp3 (±22 file, 24/32/44.1/48 kHz, mayoritas stereo) + ogg Vorbis (±13 file, mono, 44.1/48 kHz). Total `sfx/` = 2.4 MB; `music/` = 4.1 MB (`community` 2.3 MB, `rainy` 1.7 MB).
- File besar: `tower-rise.mp3` 388 KB (12.1s), `dragon-death.ogg` 257 KB (18s), `earthquake.mp3` 227 KB (7.1s), `dragon-areana-up-before-crystal.mp3` 206 KB (6.4s), `power-reward.mp3` 188 KB (5.9s). Tidak diubah di stage ini; kandidat trimming bila Android berat (NOT VERIFIED beban nyata).
- Target format untuk asset baru: **mp3** (kompatibel luas; dukungan ogg di iOS Safari NOT VERIFIED), mono untuk SFX pendek, 44.1 kHz atau lebih rendah, ≤1s ideal. Tidak ada konversi sekarang.

## Synthetic Fallback Policy
REAL ASSET ada → pakai. REAL ASSET tidak ada → NEW AUDIO ASSET. Asset baru belum ada → fallback sintetis sementara (`pop()`/`win()`/`bounce()`). Sintetis bukan target final untuk P0: Dice, Movement, Snake, Ladder, Power, TNT, Creeper, Victory, Defeat, Firework. Status P0 final menurut plan ini: Dice/Movement/Snake/Ladder/Firework/Creeper/TNT-explosion/Defeat/Sword = real (existing); Feather/Potion/Grass/Totem/TNT-fuse/Victory = real setelah asset baru tersedia.

## Duplicate Assets
- `board/snake-bite.mp3` == `ui/power-claim.mp3` (md5 `752509e3…`) [FS, hanya satu pasangan duplikat di seluruh `sfx/`].
- Keputusan: **canonical = `board/snake-bite.mp3`** (semantik cocok dengan nama). `ui/power-claim.mp3` dipertahankan sampai review dengar; kemungkinan diganti isi (C24). Penghapusan/rename = stage implementasi terpisah.
- Catatan: `snake-bite-alt.mp3` dan `setalah-hancurkan-crsytal.mp3` berukuran dan durasi sama (35.040 B, 1.752s) tetapi hash berbeda → bukan duplikat byte-identik [FS]; kemiripan konten NOT VERIFIED.

## Deferred / Dormant References
- `dragon/dragon-awakening.mp3`: dormant (tidak dipanggil) → NO_NEW_ASSET_REQUIRED / DEFERRED.
- `dragon-studio.mp3` (root sfx): tidak ada referensi di kode (B/FS) → DEFERRED (hapus/arsip nanti).
- Nama file root bertypo (`areana`, `crsytal`) → rename DEFERRED (referensi ada di `audio.js`/README).
- `ladder-up` pada ular, `power-claim` identik snake-bite: ditangani di Stage D / review dengar.

## Recommended Next Stage
Stage 4.1.24.D — Audio Integration. Gerbang sebelum D: (1) sesi dengar untuk file bertanda "perlu dengar" (game-lose, sword-use, creeper-explosion, creeper-fuse, snake-bite-alt, move-back, power-claim); (2) sumber/pembuatan 6–7 asset baru dari tabel New Assets Required; (3) urutan integrasi usulan: defeat+O3 → snake remap → creeper/TNT explosion → sword → asset baru Power/victory.
