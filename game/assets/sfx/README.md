# SFX — Ular Tangga Blok

Struktur: `assets/sfx/<kategori>/<nama>.<ext>` (nama kebab-case, maksimal 3 kata).
Semua path file gameplay dikumpulkan di **satu tabel `FILE`** di `gameplay/audio.js`; ganti/menambah file cukup ubah baris di sana.
Halaman UI memakai `assets/js/app.js` (map `SFX`), dan daftar preload di `loading.html`, `splash.html`, `play.html`.

| Folder | File | Dipakai untuk | Fungsi (`sfx.*`) |
|---|---|---|---|
| `ui/` | `button-click.mp3` | klik tombol semua halaman | `UT.Audio 'button'` |
| | `chest-reward.mp3` | buka peti/hadiah di UI | `UT.Audio 'chest'` |
| | `power-claim.mp3` | beli/claim berhasil, power-up | `UT.Audio 'power'` |
| | `game-lose.mp3` | kalah | `UT.Audio 'kalah'` |
| `dice/` | `dice-roll.mp3` | lempar dadu (fade saat angka muncul) | `roll` / `rollStop` |
| `board/` | `pawn-hop.mp3` | pion melompat tiap langkah | `hop` |
| | `ladder-up.mp3` | naik tangga | `naiktangga` |
| | `snake-bite.mp3` | dicaplok ular | `caplokular` |
| | `block-100.mp3` | tiba di Block 100 | `hundred` |
| | `move-back.mp3`, `snake-bite-alt.mp3` | *belum dipakai* | — |
| `reward/` | `chest-open.ogg` / `chest-close.ogg` | peti di board | `chest` / `chestClose` |
| | `power-reward.mp3` | hadiah power-up / hadiah Dragon | `rewardpower` |
| `powerup/` | `sword-use.mp3` | *belum dipakai* (Pedang) | — |
| `mob/` | `mob-punch.mp3` | mob menghantam (lapis pukulan) | `hit` |
| | `player-hurt.mp3` | pemain kena hit (creeper, skeleton, melee) | `playerHurt` |
| | `creeper-fuse.ogg` | creeper menyala | `creeper` |
| | `skeleton-shoot.ogg` | skeleton menembak | `skeltonSh` |
| | `enderman-teleport.ogg` | enderman teleport | `enderman` |
| | `creeper-explosion.mp3`, `creeper-hiss.mp3`, `enderman-alt.ogg`, `mob-hit-alt.mp3` | *belum dipakai* | — |
| `dragon/` | `dragon-idle.ogg` | naga muncul / bertengger / saat diserang | `dragonSpawn`, `dragonIdle` |
| | `dragon-hurt.ogg` / `dragon-death.ogg` | naga kena / kalah | `dragonHurt` / `dragonDeath` |
| | `earthquake.mp3` | gempa saat gunung runtuh | `quakeStart` / `quakeStop` |
| | `tower-rise.mp3` | tower naik | `towerRise` / `towerStop` |
| | `crystal-appear.mp3` | End Crystal muncul | `crystalAppear` |
| | `crystal-break.mp3` | crystal hancur | `crystalBreak` |
| | `dragon-awakening.mp3` | *placeholder, file belum ada* (fallback sintetis) | `dragonAwakening` |

Catatan: semua sfx file menghormati tombol mute dan punya fallback bunyi sintetis bila file gagal diputar.
