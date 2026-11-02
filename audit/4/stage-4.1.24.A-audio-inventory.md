# Stage 4.1.24.A — Audio Inventory Audit

Checkpoint awal: `35fff99` (`stage(4.1.24.2): polish creeper explosion layering`), branch `main`, working tree bersih saat audit dimulai.
Stage ini **audit-only**: tidak ada perubahan kode runtime, tidak ada file audio dibuat/diubah/dihapus, `audio.js` tidak disentuh. Satu-satunya file baru adalah dokumen ini.

Nomor baris merujuk ke HEAD `35fff99`. Status "terpicu" ditentukan dari **pembacaan statis kode**; tidak ada tes browser (lihat Validasi).

## Lingkup & Metode

- **Lokasi audio nyata**: `game/assets/sfx/**` dan `game/assets/music/`. Folder `sfx/`, `assets/sfx/`, `assets/music/` di **root repo tidak ada** (`assets/` root hanya berisi `image`, `css`, `lang`, `old`, `js`).
- **Enumerasi file**: `find` untuk ekstensi audio (`mp3 ogg wav m4a aac flac opus webm weba aif*`) di seluruh repo, lalu sapuan MIME (`file --mime-type`, `audio/*` & `video/*`) di seluruh repo untuk menangkap file berekstensi tak lazim. Kedua metode memberi hasil sama: **39 file**, seluruhnya di `game/assets/{sfx,music}`. Tidak ada `.wav`.
- **Metadata**: `ffprobe` (codec, durasi, sample rate, channel, bitrate) + `stat` (ukuran). Duplikat konten dicek dengan `md5sum`.
- **Referensi kode**: grep `sfx.*`, `GA.play`, `GameplayAudio`, `playSound`, `UT.Audio`, `new Audio`, `AudioContext`, `beep(`, `noise(`, dan semua literal `*.mp3|ogg|wav` di `game/gameplay.html`, `game/gameplay/*.js`, `game/assets/js/*.js`, semua halaman `game/*.html`, `assets/js/main.js`, `index.html`. Tiap path di tabel `FILE` (`audio.js`) diverifikasi ke disk secara terprogram.
- **Tidak dihitung sebagai asset**: `beep()`, `noise()`, dan seluruh bunyi WebAudio sintetis (dicatat hanya sebagai fallback/sintetis).
- File legacy (`game/old/`, `game/referensi/`, `assets/old/`) tidak dimuat runtime; satu-satunya referensi audio di sana (`gameplay.old.html:403` → `community.mp3`, `rainy.mp3`) menunjuk file yang ada.

## Ringkasan

| Kelas | Jumlah |
|---|---|
| File audio nyata di disk | **39** (6,14 MB: musik 3,89 MB, SFX 2,25 MB) |
| REAL ASSET — direferensikan + ada jalur pemicu | **25** |
| REAL ASSET — direferensikan/terdaftar, **tak ada call site** | **2** (`ui/chest-reward.mp3`, `ui/game-lose.mp3`) |
| FILE EXISTS BUT NOT REFERENCED | **12** |
| REFERENCED BUT FILE NOT FOUND | **1** (`dragon/dragon-awakening.mp3`, jalur dormant) |
| Duplikat byte-identik | **1 pasang** (`snake-bite.mp3` = `power-claim.mp3`) |

Gap per 27 kebutuhan gameplay (daftar di bagian *Audio Gap List*): **10 REAL**, **3 PARTIAL**, **2 asset ada tapi belum terpasang**, **11 MISSING**, **1** aturan Computer (terpenuhi).

---

## 1. REAL AUDIO ASSETS

Seluruh 39 file yang benar-benar ada (dibaca dari disk). Kolom Status memakai kelas dari spesifikasi stage.

| # | Path | Codec | Durasi | Ukuran | Sample / ch / bitrate | Kategori (kemungkinan) | Status |
|---|---|---|---|---|---|---|---|
| 1 | `game/assets/music/community.mp3` | mp3 | 117.38 s | 2292.7 KB (2347680 B) | 24000 Hz / stereo / 160 kbps | Music (BGM loop) | REAL ASSET |
| 2 | `game/assets/music/rainy.mp3` | mp3 | 86.35 s | 1686.6 KB (1727040 B) | 24000 Hz / stereo / 160 kbps | Music (BGM) | REAL ASSET |
| 3 | `game/assets/sfx/board/block-100.mp3` | mp3 | 1.96 s | 61.2 KB (62693 B) | 44100 Hz / stereo / 256 kbps | Board: milestone Block 100 | REAL ASSET |
| 4 | `game/assets/sfx/board/ladder-up.mp3` | mp3 | 1.37 s | 42.8 KB (43776 B) | 32000 Hz / stereo / 256 kbps | Board: ladder | REAL ASSET |
| 5 | `game/assets/sfx/board/move-back.mp3` | mp3 | 0.91 s | 17.8 KB (18240 B) | 24000 Hz / stereo / 160 kbps | Board: move back | EXISTS, NOT REFERENCED |
| 6 | `game/assets/sfx/board/pawn-hop.mp3` | mp3 | 0.14 s | 4.5 KB (4608 B) | 32000 Hz / stereo / 256 kbps | Board: movement step | REAL ASSET |
| 7 | `game/assets/sfx/board/snake-bite-alt.mp3` | mp3 | 1.75 s | 34.2 KB (35040 B) | 24000 Hz / stereo / 160 kbps | Board: snake (alt) | EXISTS, NOT REFERENCED |
| 8 | `game/assets/sfx/board/snake-bite.mp3` | mp3 | 1.59 s | 49.8 KB (50991 B) | 44100 Hz / stereo / 255 kbps | Board: snake | REAL ASSET |
| 9 | `game/assets/sfx/dice/dice-roll.mp3` | mp3 | 2.04 s | 32.1 KB (32896 B) | 44100 Hz / stereo / 129 kbps | Dice | REAL ASSET |
| 10 | `game/assets/sfx/dragon-areana-up-before-crystal.mp3` | mp3 | 6.43 s | 200.8 KB (205635 B) | 44100 Hz / stereo / 255 kbps | Dragon: arena/crystal cue (from name) | EXISTS, NOT REFERENCED |
| 11 | `game/assets/sfx/dragon-studio.mp3` | mp3 | 1.82 s | 57.0 KB (58368 B) | 48000 Hz / stereo / 256 kbps | Dragon: unclear (from name) | EXISTS, NOT REFERENCED |
| 12 | `game/assets/sfx/dragon/crystal-appear.mp3` | mp3 | 3.02 s | 94.5 KB (96768 B) | 48000 Hz / stereo / 256 kbps | Dragon: crystal | REAL ASSET |
| 13 | `game/assets/sfx/dragon/crystal-break.mp3` | mp3 | 2.09 s | 65.2 KB (66816 B) | 48000 Hz / stereo / 256 kbps | Dragon: crystal | REAL ASSET |
| 14 | `game/assets/sfx/dragon/dragon-death.ogg` | vorbis | 18.00 s | 251.1 KB (257102 B) | 44100 Hz / stereo / 114 kbps | Dragon: defeat | REAL ASSET |
| 15 | `game/assets/sfx/dragon/dragon-hurt.ogg` | vorbis | 1.00 s | 10.6 KB (10812 B) | 44100 Hz / mono / 86 kbps | Dragon: hit | REAL ASSET |
| 16 | `game/assets/sfx/dragon/dragon-idle.ogg` | vorbis | 3.00 s | 26.5 KB (27102 B) | 44100 Hz / mono / 72 kbps | Dragon: idle/spawn | REAL ASSET |
| 17 | `game/assets/sfx/dragon/earthquake.mp3` | mp3 | 7.11 s | 222.0 KB (227369 B) | 44100 Hz / stereo / 256 kbps | Dragon: awakening quake | REAL ASSET |
| 18 | `game/assets/sfx/dragon/tower-rise.mp3` | mp3 | 12.12 s | 378.8 KB (387840 B) | 48000 Hz / stereo / 256 kbps | Dragon: tower rise | REAL ASSET |
| 19 | `game/assets/sfx/mob/creeper-explosion.mp3` | mp3 | 3.89 s | 75.9 KB (77760 B) | 24000 Hz / stereo / 160 kbps | Mob: Creeper explosion | EXISTS, NOT REFERENCED |
| 20 | `game/assets/sfx/mob/creeper-fuse.ogg` | vorbis | 5.66 s | 42.0 KB (43007 B) | 44100 Hz / mono / 60 kbps | Mob: Creeper fuse | REAL ASSET |
| 21 | `game/assets/sfx/mob/creeper-hiss.mp3` | mp3 | 2.90 s | 90.6 KB (92787 B) | 44100 Hz / mono / 255 kbps | Mob: Creeper hiss | EXISTS, NOT REFERENCED |
| 22 | `game/assets/sfx/mob/enderman-alt.ogg` | vorbis | 0.97 s | 11.0 KB (11231 B) | 44100 Hz / mono / 92 kbps | Mob: Enderman (alt) | EXISTS, NOT REFERENCED |
| 23 | `game/assets/sfx/mob/enderman-teleport.ogg` | vorbis | 0.52 s | 7.3 KB (7442 B) | 44100 Hz / mono / 113 kbps | Mob: Enderman teleport | REAL ASSET |
| 24 | `game/assets/sfx/mob/mob-hit-alt.mp3` | mp3 | 1.32 s | 41.2 KB (42240 B) | 48000 Hz / stereo / 256 kbps | Mob: melee hit (alt) | EXISTS, NOT REFERENCED |
| 25 | `game/assets/sfx/mob/mob-punch.mp3` | mp3 | 0.26 s | 4.9 KB (5025 B) | 44100 Hz / stereo / 153 kbps | Mob: melee hit | REAL ASSET |
| 26 | `game/assets/sfx/mob/player-hurt.mp3` | mp3 | 1.10 s | 17.5 KB (17900 B) | 44100 Hz / stereo / 130 kbps | Mob: player hurt | REAL ASSET |
| 27 | `game/assets/sfx/mob/skeleton-shoot.ogg` | vorbis | 0.46 s | 6.5 KB (6658 B) | 44100 Hz / mono / 117 kbps | Mob: Skeleton shot | REAL ASSET |
| 28 | `game/assets/sfx/powerup/sword-use.mp3` | mp3 | 0.82 s | 15.9 KB (16320 B) | 24000 Hz / stereo / 160 kbps | Power-up: Sword | EXISTS, NOT REFERENCED |
| 29 | `game/assets/sfx/reward/chest-close.ogg` | vorbis | 0.52 s | 7.7 KB (7896 B) | 48000 Hz / mono / 120 kbps | Reward: chest close | REAL ASSET |
| 30 | `game/assets/sfx/reward/chest-open.ogg` | vorbis | 0.52 s | 8.7 KB (8916 B) | 48000 Hz / mono / 138 kbps | Reward: chest open | REAL ASSET |
| 31 | `game/assets/sfx/reward/power-reward.mp3` | mp3 | 5.88 s | 183.7 KB (188081 B) | 44100 Hz / stereo / 256 kbps | Reward: power-up/Dragon reward | REAL ASSET |
| 32 | `game/assets/sfx/setalah-hancurkan-crsytal.mp3` | mp3 | 1.75 s | 34.2 KB (35040 B) | 24000 Hz / stereo / 160 kbps | Dragon: after crystal break (from name) | EXISTS, NOT REFERENCED |
| 33 | `game/assets/sfx/ui/button-click.mp3` | mp3 | 0.05 s | 1.5 KB (1536 B) | 48000 Hz / mono / 256 kbps | UI: click | REAL ASSET |
| 34 | `game/assets/sfx/ui/chest-reward.mp3` | mp3 | 1.40 s | 43.9 KB (44928 B) | 32000 Hz / stereo / 256 kbps | UI: chest/reward | REAL ASSET (no trigger) |
| 35 | `game/assets/sfx/ui/game-lose.mp3` | mp3 | 2.11 s | 66.0 KB (67584 B) | 48000 Hz / stereo / 256 kbps | UI: defeat | REAL ASSET (no trigger) |
| 36 | `game/assets/sfx/ui/power-claim.mp3` | mp3 | 1.59 s | 49.8 KB (50991 B) | 44100 Hz / stereo / 255 kbps | UI: purchase/claim | REAL ASSET |
| 37 | `game/assets/sfx/win/Firework_large_blast_far.ogg` | vorbis | 2.50 s | 21.4 KB (21914 B) | 44100 Hz / mono / 70 kbps | Win: Firework blast | EXISTS, NOT REFERENCED |
| 38 | `game/assets/sfx/win/Firework_launch.ogg` | vorbis | 1.63 s | 15.2 KB (15598 B) | 44100 Hz / mono / 76 kbps | Win: Firework launch | REAL ASSET |
| 39 | `game/assets/sfx/win/Firework_twinkle.ogg` | vorbis | 1.33 s | 14.0 KB (14328 B) | 44100 Hz / mono / 85 kbps | Win: Firework twinkle | EXISTS, NOT REFERENCED |

Catatan kategori: kolom "Kategori" untuk nomor 10, 11, dan 32 hanya **ditebak dari nama file**; isi audio tidak didengar. Perlu didengarkan manusia sebelum dipakai.

Titik referensi per grup:
- **Gameplay SFX (21 file)**: tabel `FILE` di `game/gameplay/audio.js:47-55`; dasar path `assets/sfx/` (`audio.js:46`) → `game/assets/sfx/` relatif ke `gameplay.html`. Semua 21 path **terverifikasi ada**.
- **UI SFX (4 file)**: peta `SFX` di `game/assets/js/app.js:166-171`, preload di `loading.html:132-133` dan `splash.html:255`, kolam klik di `play.html:147`.
- **Musik (2 file)**: `play.html:103` (`TRACKS`, bergantian saat `ended`) dan `gameplay.html:676` (`MUSIC`).

## 2. SYNTHETIC FALLBACKS

Sumber: `game/gameplay/audio.js` (`beep()`/`noise()`). **Bukan audio asset**, dicatat hanya sebagai sintetis/fallback.

**A. Sintetis murni (tidak ada file sama sekali)** — satu-satunya bunyi untuk event itu:

| Fungsi | Bunyi | Dipanggil di (`gameplay.html`) | Event |
|---|---|---|---|
| `sfx.pop` | beep triangle | :3062, :3219, :3266, :3285; `feedback.js:45,55`; `ready.js:88` | **Semua pemakaian power-up** (Sword/Feather/TNT/Totem/Potion/Grass), Totem menahan serangan, Villager membantu, pion keluar dari ular, kartu hadiah muncul, tombol READY |
| `sfx.bounce` | beep triangle turun | :2523, :2850, :3257, :3385 | Crystal: dadu salah; **ledakan Creeper** (`explode`); kelebihan lewat 100 (memantul); tiga kali 6 |
| `sfx.win` | arpeggio 6 nada square | :2530, :3230, :3261 | Fanfare: Crystal READY 4/4, **kemenangan** (`celebrate`), tiba di Block 100 |
| `sfx.ladder` | 4 beep naik (`ladderBeeps`) | :3160 (`climb`) | Animasi naik tangga (berlapis dengan `ladder-up.mp3`) |
| `sfx.hiss` / `chomp` / `gulp` | noise + beep | :3191, :3197, :3205 | Ular menyambar / mencaplok / menelan |
| `sfx.shuffleTick` | tick square acak | :3330, :3338; `ready.js:141,143` | Dial Special Dice (tahan Roll), Ready screen |
| `sfx.revealTick` / `revealFirst` | beep square | `ready.js:126` | Reveal urutan giliran |
| `sfx.dragonAwakening` | noise + sawtooth | **tidak pernah dipanggil** | Dormant (lihat bagian 4) |
| `sfx()` di `assets/js/main.js:10` | WebAudio | halaman landing root | Demo dadu landing (di luar game) |

**B. File dulu, fallback sintetis bila gagal** (bila file berhasil diputar, sintetis tidak berbunyi): `roll`, `hop`, `naiktangga`, `caplokular`, `hundred`, `chest`, `chestClose`, `rewardpower`, `hit`, `playerHurt`, `creeper`, `skeltonSh`, `enderman`, `dragonHurt`, `dragonDeath`, `quakeStart`, `crystalAppear`, `crystalBreak`.

**C. File saja, tanpa fallback (senyap bila file gagal)**: `firework` (`audio.js:86`), `dragonIdle`, `dragonSpawn`, `towerRise`.

Semua `sfx.*` dibungkus gerbang `ready` (`audio.js:116-118`): senyap sampai `setReady(true)` dipanggil setelah percobaan BGM pada gesture pertama (`gameplay.html:3609-3610`).

## 3. MISSING AUDIO

Event gameplay yang **tidak punya file audio** yang cocok (hanya sintetis atau senyap):

| Event | Kondisi sekarang |
|---|---|
| Feather (giliran tambahan) | `sfx.pop` sintetis |
| TNT | `sfx.pop` sintetis (+ `teleport` visual, tanpa suara ledakan) |
| Totem (pakai & menahan serangan) | `sfx.pop` sintetis |
| Potion | `sfx.pop` sintetis |
| Grass (tukar posisi) | `sfx.pop` sintetis |
| Draw / seri | **tidak ada state seri** di gameplay (tak ada kode, tak ada audio) |
| Coin (dedicated) | `playSound('coin')` → `button-click.mp3` (dipakai bersama klik biasa) |
| Gem (dedicated) | jalur sama dengan coin (`playSound('coin')` untuk gem & coin) |
| Error UI (dedicated) | `playSound('error')` → `button-click.mp3` |
| Turn start | `beginTurn()` (:3119) tanpa SFX |
| Turn change | `nextTurn()` (:3148) tanpa SFX |
| Victory jingle nyata | hanya fanfare sintetis `sfx.win` + `Firework_launch.ogg` |
| Defeat — terpasang di gameplay | `finishGame` (:3395) tanpa SFX; file `ui/game-lose.mp3` ada tapi tidak dipicu |
| Ular tanpa animasi (`!SNAKEINFO[p.pos]`) | :3269 tanpa SFX sama sekali |

## 4. REFERENCED BUT MISSING

| Referensi | Lokasi | Status |
|---|---|---|
| `dragon/dragon-awakening.mp3` | `audio.js:56` (`FILE_AWAKENING`), dipakai `sfx.dragonAwakening` (`audio.js:102`) | **FILE NOT FOUND**. Jalur **dormant**: `dragonAwakening()` tidak dipanggil di kode live mana pun (grep seluruh `game/` di luar `old/`, `referensi/`). Gameplay memakai `sfx.quakeStart` → `earthquake.mp3`. Tidak ada dampak runtime saat ini. |
| `assets/sfx/dragon-awakening.mp3` | komentar `gameplay.html:2540` | Hanya komentar, usang (aktualnya `earthquake.mp3`) |
| `button.mp3`, `game_assets_sfx_chest.mp3`, `kalah.mp3`, `power.mp3`, `menu_music.mp3`, `game_music.mp3`, `win_music.mp3`, `dice_roll.mp3`, `ladder_up.mp3`, `snake_hiss.mp3`, `chest_open.mp3`, `coin_pickup.mp3`, `gem_pickup.mp3`, `button_click.mp3`, `powerup_get.mp3`, `sword_use.mp3`, `tnt_boom.mp3`, `potion_use.mp3`, `feather_use.mp3`, `grass_swap.mp3` | `game/doc/README_AUDIO.md` | **Dokumen usang saja** (nama lama/rencana). Tidak ada kode yang memuatnya, tidak ada file dengan nama itu di disk. Bukan bug runtime. |

Tidak ditemukan path audio live lain yang mengarah ke file yang tidak ada: 21 dari 22 entri `FILE`/`FILE_AWAKENING` ada, 4 UI ada, 2 musik ada.

## 5. UNUSED AUDIO

**A. EXISTS, NOT REFERENCED (12)** — tak ada path/kunci yang memuatnya di kode live:

| File | Catatan |
|---|---|
| `board/move-back.mp3` | README: "belum dipakai" |
| `board/snake-bite-alt.mp3` | README: "belum dipakai" |
| `powerup/sword-use.mp3` | README: "belum dipakai (Pedang)"; sword saat ini `sfx.pop` |
| `mob/creeper-explosion.mp3` | README: "belum dipakai"; ledakan saat ini `sfx.bounce` sintetis |
| `mob/creeper-hiss.mp3` | README: "belum dipakai" |
| `mob/enderman-alt.ogg` | README: "belum dipakai" |
| `mob/mob-hit-alt.mp3` | README: "belum dipakai" |
| `win/Firework_large_blast_far.ogg` | hanya `Firework_launch.ogg` dipakai |
| `win/Firework_twinkle.ogg` | idem |
| `sfx/dragon-areana-up-before-crystal.mp3` | di root `sfx/`, **tidak ada di README**; nama memuat typo "areana" |
| `sfx/dragon-studio.mp3` | di root `sfx/`, tidak ada di README; kegunaan tidak jelas |
| `sfx/setalah-hancurkan-crsytal.mp3` | di root `sfx/`, tidak ada di README; typo "crsytal"; ukuran & durasi sama dengan `snake-bite-alt.mp3` (35040 B, 1.75 s) tetapi md5 **berbeda** |

**B. Terdaftar/preload tetapi tak ada call site yang ditemukan (2)**:

| File | Terdaftar di | Mengapa dianggap tak terpicu |
|---|---|---|
| `ui/chest-reward.mp3` | `app.js` kunci `chest`; peta `chest:'chest'` di 5 halaman; preload `loading/splash` | Tidak ada `playSound('chest')` maupun `UT.Audio.play('chest')` di kode live |
| `ui/game-lose.mp3` | `app.js` kunci `kalah`; preload `loading/splash` | Tidak ada pemanggil `'kalah'`; peta halaman tidak punya kunci `kalah`; `gameplay.html` tidak memakai `UT.Audio` |

README (`game/assets/sfx/README.md`) menyatakan kedua file ini "dipakai"; kode live tidak mendukung klaim itu (dokumen usang).

**C. Musik**: `rainy.mp3` **dipakai** oleh shell (`play.html:103`, bergantian dengan `community.mp3`) tetapi **tidak** oleh gameplay: `gameplay.html:679` hanya membaca `MUSIC[0]` (`community.mp3`); `MUSIC[1]` tidak pernah dibaca.

**D. Duplikat byte-identik**: `board/snake-bite.mp3` ≡ `ui/power-claim.mp3` (md5 `752509e3d0200569d16ac2415537e449`). Suara gigitan ular dan suara pembelian/claim adalah **file yang sama**.

## 6. EVENT → FILE MAPPING

Legenda: **REAL** = file nyata terpicu; **SYNTH** = sintetis saja; **SILENT** = tanpa suara; **MISSING** = tak ada file; **FILE NOT FOUND**; **UNREF** = file ada tapi tak dirujuk. Computer memakai jalur yang sama dengan pemain (lihat bagian 7).

| Event | Pemicu (`gameplay.html` kecuali dinyatakan) | Fungsi audio | File | Status |
|---|---|---|---|---|
| Lempar dadu | :3378 `doRoll` (pemain, CPU, AFK) | `sfx.roll` / `rollStop` (fade 250 ms) | `dice/dice-roll.mp3` | REAL |
| Dial Special Dice | :3330, :3338 | `sfx.shuffleTick` | — | SYNTH |
| Langkah pion | :3154 `walk` | `sfx.hop` | `board/pawn-hop.mp3` | REAL |
| Memantul lewat 100 | :3257 | `sfx.bounce` | — | SYNTH |
| Tiga kali 6 | :3385 | `sfx.bounce` | — | SYNTH |
| Tiba di Block 100 | :3261 | `sfx.hundred` + `sfx.win` | `board/block-100.mp3` + sintetis | REAL + SYNTH |
| Naik tangga | :3263 `naiktangga`, :3160 `ladder` | file + `ladderBeeps` | `board/ladder-up.mp3` + sintetis | REAL + SYNTH (berlapis) |
| Ular (beranimasi) | :3270 `naiktangga`; :3191/:3197/:3205 hiss/chomp/gulp; :3211 `caplokular`; :3219 `pop` | campuran | `board/ladder-up.mp3` (:3270), `board/snake-bite.mp3` (:3211) + 4 sintetis | REAL + SYNTH |
| Ular (tanpa animasi) | :3269 | — | — | SILENT |
| Mundur (move back) | — | — | `board/move-back.mp3` | UNREF |
| Sword | :3062 `usePU` | `sfx.pop` | — (`powerup/sword-use.mp3` ada) | SYNTH; file UNREF |
| Feather | :3062 | `sfx.pop` | — | SYNTH / MISSING |
| TNT | :3062 | `sfx.pop` | — | SYNTH / MISSING |
| Totem (pakai) | :3062 | `sfx.pop` | — | SYNTH / MISSING |
| Totem (menahan serangan) | :3266 | `sfx.pop` | — | SYNTH / MISSING |
| Potion | :3062 | `sfx.pop` | — | SYNTH / MISSING |
| Grass (tukar) | :3062 | `sfx.pop` | — | SYNTH / MISSING |
| Buka peti | :3037 | `sfx.chest` | `reward/chest-open.ogg` | REAL |
| Tutup peti | :3039 | `sfx.chestClose` | `reward/chest-close.ogg` | REAL |
| Kartu hadiah power-up | `feedback.js:44` (+ `pop` di :45/:55) | `sfx.rewardpower` | `reward/power-reward.mp3` (+ sintetis) | REAL + SYNTH |
| Hadiah Dragon | :2516 | `sfx.rewardpower` | `reward/power-reward.mp3` | REAL |
| Dragon bangun: gempa | :2540 / :2551 | `quakeStart` / `quakeStop` | `dragon/earthquake.mp3` | REAL |
| Dragon bangun: tower | :2553 / :2563 | `towerRise` / `towerStop` | `dragon/tower-rise.mp3` | REAL |
| Crystal muncul | :2554, :2567 | `sfx.crystalAppear` | `dragon/crystal-appear.mp3` | REAL |
| Dragon muncul | :2560 | `sfx.dragonSpawn` | `dragon/dragon-idle.ogg` | REAL |
| Dragon bangun (file khusus) | tidak dipanggil | `sfx.dragonAwakening` | `dragon/dragon-awakening.mp3` | FILE NOT FOUND (dormant) |
| Crystal hancur | :2527 | `sfx.crystalBreak` | `dragon/crystal-break.mp3` | REAL |
| Crystal: dadu salah | :2523 | `sfx.bounce` | — | SYNTH |
| Crystal READY 4/4 | :2530 | `sfx.win` | — | SYNTH |
| Dragon diam saat giliran serang | :3245 | `sfx.dragonIdle` | `dragon/dragon-idle.ogg` | REAL |
| Dragon kena | :2834, :2836 | `dragonHurt` + `hundred` | `dragon/dragon-hurt.ogg` + `board/block-100.mp3` | REAL |
| Dragon kalah | :2842 | `sfx.dragonDeath` | `dragon/dragon-death.ogg` (18 s) | REAL |
| **Victory** | :3230 `celebrate` | `sfx.win` + `firework` | sintetis + `win/Firework_launch.ogg` | SYNTH + REAL |
| Firework | `firework-fx.js:58` → `GA.play('firework')` | `sfx.firework` | `win/Firework_launch.ogg` | REAL |
| Firework blast / twinkle | — | — | `win/Firework_large_blast_far.ogg`, `win/Firework_twinkle.ogg` | UNREF |
| **Defeat** (kamu kalah) | :3395 `finishGame` (state `lose`, :3398-3399) | — | — (`ui/game-lose.mp3` ada, tak dipicu) | SILENT; file REAL tanpa trigger |
| **Draw** | tidak ada state seri | — | — | MISSING (fitur tak ada) |
| Creeper: sumbu | :3276 | `sfx.creeper` | `mob/creeper-fuse.ogg` | REAL |
| Creeper: pemain terluka | :3277 | `sfx.playerHurt` | `mob/player-hurt.mp3` | REAL |
| **Creeper: ledakan** | :3277 → `explode` (:2850) | `sfx.bounce` | — (`mob/creeper-explosion.mp3`, `creeper-hiss.mp3` ada) | SYNTH; file UNREF |
| Enderman | :3282 | `sfx.enderman` | `mob/enderman-teleport.ogg` | REAL |
| Skeleton | :3289-3290 | `skeltonSh` + `playerHurt` | `mob/skeleton-shoot.ogg` + `mob/player-hurt.mp3` | REAL |
| Mob melee lain | :3295 | `sfx.hit` + `playerHurt` | `mob/mob-punch.mp3` + `mob/player-hurt.mp3` | REAL |
| Villager membantu | :3285 | `sfx.pop` | — | SYNTH |
| BGM gameplay | :3602-3610 | `playMusic` | `music/community.mp3` | REAL |
| BGM menu/lobby/shell | `play.html:103` | `bgm` | `music/community.mp3`, `music/rainy.mp3` | REAL |
| Klik / select / open UI | `playSound(...)` di 5 halaman; auto-klik di lobby/mode/friendship (`app.js`); kolam di `play.html:147` | `UT.Audio.play('button')` | `ui/button-click.mp3` | REAL |
| Error UI | `playSound('error')` | `'button'` | `ui/button-click.mp3` (dibagi) | REAL (dibagi, bukan dedicated) |
| Coin / Gem UI | `playSound('coin')` | `'button'` | `ui/button-click.mp3` (dibagi) | REAL (dibagi, bukan dedicated) |
| Purchase / claim reward | `playSound('purchase')` | `'power'` | `ui/power-claim.mp3` | REAL |
| Chest UI | tak ada pemanggil | `'chest'` | `ui/chest-reward.mp3` | REAL tanpa trigger |
| Kalah UI | tak ada pemanggil | `'kalah'` | `ui/game-lose.mp3` | REAL tanpa trigger |
| Turn start | `beginTurn` :3119 | — | — | SILENT |
| Turn change | `nextTurn` :3148 | — | — | SILENT |
| Ready screen | `ready.js:126,141,143` | `revealFirst/Tick`, `shuffleTick` | — | SYNTH |

## 7. AUDIO GAP LIST

Pencocokan 27 kebutuhan gameplay dengan aset nyata.

| # | Kebutuhan | Hasil | Catatan |
|---|---|---|---|
| 1 | dice | **REAL** | `dice-roll.mp3` |
| 2 | movement | **REAL** | `pawn-hop.mp3`; `move-back.mp3` ada tapi tak terpasang |
| 3 | ladder | **REAL** | `ladder-up.mp3` (+ lapisan sintetis `ladderBeeps`) |
| 4 | snake | **PARTIAL** | `snake-bite.mp3` nyata; hiss/chomp/gulp/pop sintetis; `ladder-up.mp3` ikut berbunyi di awal event ular |
| 5 | Sword | **ASSET ADA, BELUM TERPASANG** | `sword-use.mp3` ada; sekarang `sfx.pop` |
| 6 | Feather | MISSING | |
| 7 | TNT | MISSING | tak ada file ber-nama TNT |
| 8 | Totem | MISSING | |
| 9 | Potion | MISSING | |
| 10 | Grass | MISSING | |
| 11 | chest | **REAL** | `chest-open.ogg`, `chest-close.ogg` |
| 12 | dragon | **REAL** | 7 file terpasang; file Awakening khusus tak ada (dormant) |
| 13 | Creeper | **PARTIAL** | sumbu nyata; ledakan sintetis; `creeper-explosion.mp3` ada tapi tak terpasang |
| 14 | Enderman | **REAL** | `enderman-teleport.ogg` |
| 15 | victory | **PARTIAL** | Firework nyata; fanfare sintetis; tak ada jingle kemenangan nyata |
| 16 | defeat | **ASSET ADA, BELUM TERPASANG** | `ui/game-lose.mp3` ada; `finishGame` senyap |
| 17 | draw | MISSING | tak ada state seri |
| 18 | Firework | **REAL** | `Firework_launch.ogg`; blast & twinkle tak terpasang |
| 19 | coin | MISSING (dedicated) | memakai `button-click.mp3` |
| 20 | gem | MISSING (dedicated) | memakai `button-click.mp3` |
| 21 | purchase | **REAL** | `power-claim.mp3` (byte-identik dengan `snake-bite.mp3`) |
| 22 | reward | **REAL** | `power-reward.mp3`, `chest-open/close.ogg`; `ui/chest-reward.mp3` tak terpicu |
| 23 | UI click | **REAL** | `button-click.mp3` |
| 24 | error | MISSING (dedicated) | memakai `button-click.mp3` |
| 25 | turn start | MISSING | senyap |
| 26 | turn change | MISSING | senyap |
| 27 | Computer / AI event | **Aturan terpenuhi** | lihat di bawah |

Tally: 10 REAL, 3 PARTIAL, 2 asset-ada-belum-terpasang, 11 MISSING, 1 aturan Computer.

**Computer / AI** — tidak ada audio khusus Computer, dan memang tidak boleh ada. Terverifikasi: tidak ada pemanggilan `sfx.*` yang bercabang menurut `cpu`; `audio.js` tidak memuat kata `cpu`. Giliran CPU memakai fungsi yang sama dengan pemain: `doRoll()` (:3129, `sfx.roll` di :3378) dan `usePU(k, true)` (:3054, `sfx.pop` di :3062), lalu jalur `playTurn` yang sama. Artinya semua gap event di atas otomatis berlaku sama untuk Computer, dan memperbaikinya untuk pemain otomatis memperbaikinya untuk Computer. **Tidak ada file/event audio Computer yang perlu dibuat.**

## 8. RECOMMENDED PRIORITY

Rekomendasi (belum dikerjakan; menunggu instruksi). Prioritas: P0 = wajib untuk gameplay inti, P1 = penting untuk polish, P2 = enhancement.

**P0 — gameplay inti**

| Item | Alasan | Bahan |
|---|---|---|
| Defeat (kalah) | Hasil permainan tanpa suara sama sekali | `ui/game-lose.mp3` sudah ada (belum dipicu) |
| Power-up SFX ×6 (Sword, TNT, Totem, Feather, Potion, Grass) | Mekanik inti; keenamnya identik (`sfx.pop` sintetis), pemain tak bisa membedakan | Sword: `sword-use.mp3` ada. Lima lain: butuh aset nyata. TNT & Totem paling berdampak |
| Creeper explosion | Bahaya papan inti; ledakan hanya beep `bounce` padahal file ledakan ada | `mob/creeper-explosion.mp3` ada (belum dipicu) |

**P1 — polish**

| Item | Catatan |
|---|---|
| Victory jingle nyata | Gantikan fanfare sintetis `sfx.win`; belum ada file |
| Turn start / turn change | Saat ini senyap sepenuhnya; belum ada file |
| Error / coin / gem dedicated | Saat ini memakai klik biasa |
| Purchase dedicated | `power-claim.mp3` identik dengan `snake-bite.mp3`; satu suara untuk dua makna |
| Snake: lapisan sintetis (hiss/chomp/gulp/pop) dan `naiktangga` di awal event | Tinjau apakah disengaja (lihat Observasi O1) |
| Totem menahan serangan, Villager membantu, memantul lewat 100, tiga kali 6 | Semua masih `pop`/`bounce` sintetis |
| Ladder: lapisan sintetis `ladderBeeps` | Berbunyi bersamaan dengan `ladder-up.mp3` |

**P2 — enhancement / housekeeping**

| Item | Catatan |
|---|---|
| Draw | Butuh aturan seri dulu (fitur belum ada) |
| Trigger `ui/chest-reward.mp3`, `ui/game-lose.mp3` di halaman UI | Terdaftar & di-preload tetapi tak pernah dipanggil |
| Pemakaian `Firework_large_blast_far.ogg`, `Firework_twinkle.ogg` | Lapisan tambahan opsional |
| `rainy.mp3` di gameplay / variasi musik | Gameplay hanya memutar `community.mp3` |
| Ready screen & dial Special Dice | Tick sintetis masih fungsional |
| Housekeeping aset & dokumen | 3 file di root `sfx/` tak terdokumentasi (typo nama), `move-back`/`*-alt`/`creeper-hiss`/`enderman-alt`/`mob-hit-alt` menganggur, sinkronkan `sfx/README.md` & `game/doc/README_AUDIO.md`, bersihkan jalur `dragonAwakening` dormant & komentar :2540 |

## 9. Observasi (dicatat, tidak diperbaiki)

- **O1** — Event ular beranimasi memanggil `sfx.naiktangga()` (:3270, memutar `ladder-up.mp3`) sebelum `bite()`; `snake-bite.mp3` baru bunyi di tengah animasi (:3211). Mungkin disengaja sebagai isyarat, mungkin sisa salin; perlu dikonfirmasi pemilik.
- **O2** — Naik tangga memutar `ladder-up.mp3` (:3263) **dan** `ladderBeeps` sintetis (:3160, `climb`) sekaligus.
- **O3** — `celebrate(p)` (:3229-3231) selalu memutar `sfx.win` + Firework, termasuk saat CPU menang dan layar menampilkan "Kamu kalah" (`finishGame` :3398-3401). Kekalahan pemain diiringi suara kemenangan, tanpa suara kalah.
- **O4** — `snake-bite.mp3` dan `power-claim.mp3` byte-identik.
- **O5** — Gerbang `ready`: semua `sfx.*` senyap sampai gesture pertama menandai audio siap (`audio.js:116-118`, `gameplay.html:3609-3610`). Dibaca dari kode, tidak diuji.
- **O6** — Dokumentasi tak sinkron dengan kode: `sfx/README.md` mengklaim `chest-reward`/`game-lose` dipakai; `game/doc/README_AUDIO.md` memuat nama file lama; komentar `gameplay.html:2540` merujuk file yang tak ada.
- **O7** — Penamaan: `Firework_*` berkapital (README menetapkan kebab-case); tiga file di root `sfx/` tak ada di README; typo "areana", "crsytal".
- **O8** — `game/sw.js` network-first dan tidak mencegat request `Range`; file audio tidak ada di `CORE` precache (informasi saja; ketersediaan audio offline tidak dijamin).

## 10. Validasi

- Semua 39 file di tabel bagian 1 dicocokkan dengan disk (path, ukuran byte) lewat skrip; jumlah baris tabel = jumlah file hasil `find` = jumlah hasil sapuan MIME.
- Ke-22 path dalam `audio.js` (`FILE` + `FILE_AWAKENING`) diverifikasi ke disk; satu tidak ada (`dragon/dragon-awakening.mp3`).
- Tidak ada nama file yang ditebak: setiap file di dokumen ini muncul di hasil `find`/`ffprobe`, atau (untuk bagian 4) di hasil grep kode/dokumen dan dinyatakan tidak ada di disk.
- Asset tak ada ditandai MISSING / FILE NOT FOUND; sintetis tidak dihitung sebagai asset (bagian 2 terpisah, tidak masuk hitungan 39).
- Tidak ada perubahan runtime: tidak ada `.js`/`.html`/`.css`/audio yang diubah; `git diff` tracked file kosong, satu-satunya perubahan adalah dokumen ini.
- Keterbatasan: status "terpicu"/"tak terpicu" berasal dari pembacaan statis; panggilan dinamis (nama diserahkan lewat variabel) di luar pola grep tidak dapat dikesampingkan sepenuhnya. Isi audio tidak didengar (kategori file bernama ambigu hanya dari nama).

**Manual browser test: NOT RUN — audit only.**
