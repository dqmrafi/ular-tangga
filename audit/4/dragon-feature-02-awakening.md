# DRAGON WORLD FEATURE 2 — DRAGON MOUNTAIN COLLAPSE & AWAKENING

Scope: area kiri board (bekas farm) menjadi gunung batu penutup Dragon Arena. Saat pemain mencapai Block 100 gunung bergetar, retak, runtuh, lalu arena terbuka dan Dragon bangkit. Hanya 1x per game. TIDAK ada Crystal progression / Dragon Attack di dokumen fitur ini (fitur 3-6 sudah ada dari commit sebelumnya dan TIDAK disentuh).

## Kondisi awal
Board + gunung batu. Tidak terlihat: Dragon, Dragon Arena, End Crystal, tower (`ARENA.g.visible=false`, naga `visible=false`).
Gunung (`buildMountain`, di semua tema, posisi = jejak arena x -11.6, z -0.2):
- Grid voxel 7 x 8 sel (0.8), tinggi 1-6 lapis: dataran **tebing** di barat (tinggi ~4.8, sisi barat curam), **lereng** turun ke timur (~1.6) menghadap papan, **puncak kecil** kedua di utara.
- Warna abu batu bervariasi, lapis dasar lebih gelap, sebagian puncak berlumut, sedikit tanah.
- 14 **bebatuan voxel** kecil di kaki gunung.
- Total 200 instance dalam 1 `InstancedMesh` (+1 retakan, +1 debu) = 3 draw call. PRNG lokal (urutan `rnd()` dunia tidak berubah).
- Farm kiri (batch `FARMG`) dihapus; `blockRect(-11.6,-0.2,3.2,3.5)` menjaga dekorasi/hewan tidak masuk area itu. Farm kedua (kiri-bawah) tidak diubah.

## Sequence (sekitar 12 dtk; `prefers-reduced-motion` ~35%)
Block 100 (pemain tiba) -> **Getaran** 1.3 dtk (batu bergetar, amplitudo naik, atas lebih kuat) -> **Retakan** 1.1 dtk (38 segmen zigzag muncul bertahap dari tebing, mulai berpendar ungu) -> **Gunung runtuh** 2.3 dtk (runtuh menjalar dari tebing barat ke timur; tiap batu jatuh dipercepat, berputar, memantul kecil; **debu** mengepul) -> **Arena terbuka** (arena naik dari bawah reruntuhan 1.7 dtk, debu menipis) -> Tower naik -> End Crystal muncul & aktif (energi/beam) -> burst -> **Dragon** spawn dari crystal dan terbang ke atas Block 100 -> unlock.
- Tidak instan: setiap batu punya jeda + durasi sendiri (10% / 30% / 60% / 100% progres = 17 / 135 / 186 / 186 dari 186 batu sudah bergerak).
- Batu di atas jejak arena (82) jatuh lalu tenggelam & mengecil (tertelan lubang arena). Batu lain (104) menetap sebagai **rubble** di kaki gunung dan tetap ada setelah selesai. Titik jatuh dibatasi: tidak ke papan dan tidak ke area Start (api unggun).
- Kamera pan sementara 6 unit ke kiri agar arena terlihat di mode LOCK, dipulihkan setelah sequence (kosmetik).

## Audio
Memakai SFX existing `sfx.dragonAwakening()` (`gameplay/audio.js`) -> `assets/sfx/dragon-awakening.mp3`, dipanggil 1x di awal sequence. TIDAK ada audio system baru, tidak ada file/preload baru.
**CATATAN JUJUR:** file `assets/sfx/dragon-awakening.mp3` BELUM ada di repo. Saat file tidak ada/gagal diputar, fallback sintetis existing (retak + gema, ~1.5 dtk) yang berbunyi; bila file asli ditaruh di path itu, ia otomatis dipakai tanpa ubah kode. Saya tidak membuat/mengarang file audio.

## Gameplay lock (tidak berubah, `AWK.running`)
Guard: `doRoll` (dice), `usePU`, `openPause` (termasuk Escape), `camSetAngle`, pointer down/move/wheel kanvas; capture-phase click guard untuk semua button/select/input/a; CSS `body.awk-lock`. `busy` true karena sequence berjalan di `playTurn` (movement/giliran terkunci); timer AFK dihentikan lalu mulai lagi lewat `beginTurn`. Pause yang sudah terbuka sebelum sequence ditunggu. Setelah Dragon selesai spawn: `AWK.done=true`, `AWK.running=false` -> gameplay unlock. Hanya 1x (`AWK.done`/`AWK.running`); reset di `startGame`.

## Perubahan kode (`game/gameplay.html` saja)
- Baru: `buildMountain`, `updateMountain` (dipanggil per frame bersama `updateArena`; tidak menghitung ulang bila state tidak berubah), `applyMountainState`, `MOUNT`.
- `awakenDragon`: fase getaran/retakan/runtuh/debu disisipkan sebelum arena naik; callback tween gunung dijaga `gid` (tween lama tidak dibersihkan saat game baru, jadi tidak boleh menulis ke gunung milik game lain); `finally` memanggil `applyMountainState` agar gunung selalu berakhir sebagai rubble.
- `applyArenaState` (ganti tema / game baru): memulihkan gunung utuh (belum awakening) atau rubble (sudah).
- `buildWorld`: `FARMG` -> `MOUNT`; `addMcEnv`: `addFarm(FB...)` kiri diganti `blockRect`.
- Tidak diubah: dadu, giliran, movement, board/tile/ular/tangga, HUD, kamera engine, Crystal progression, Dragon Attack, Special Dice, defeat & reward, `audio.js`, `config.js`.

## Test
- Syntax 4 skrip inline `gameplay.html`: PASS.
- Smoke test Node (kode ASLI diekstrak + THREE r128 asli, tanpa WebGL): **34/34 PASS** — gunung utuh di awal; tebing barat (4.8) >> lereng timur (1.6); getaran kecil & naik bertahap tanpa melepas batu; retakan muncul bertahap dan berpendar ungu lalu hilang saat runtuh; runtuh bertahap (bukan instan), tanpa NaN; rubble menetap di luar jejak arena & tidak ke papan/Start; batu dalam tenggelam; debu muncul lalu hilang; state rubble dipulihkan saat ganti tema, gunung utuh lagi di game baru; update ~0.2 ms/frame. Sequence asli `awakenDragon`: urutan getaran -> retakan -> runtuh -> arena naik -> tower -> crystal; arena & Dragon tidak terlihat sebelum waktunya; terkunci di tiap fase; unlock di akhir; SFX 1x; tidak terjadi 2x; game baru di tengah sequence tidak mencemari gunung baru.
- Regresi Feature 6 (defeat & reward) dijalankan ulang: 25/25 PASS.
- BELUM diverifikasi: render nyata di browser/Android (tampilan gunung dari kamera LOCK/top-down, warna/ukuran, apakah retakan terbaca dari atas, kepadatan debu, ketinggian tanah di tema selain Minecraft, tumpang tindih dengan dekorasi tema non-Minecraft di area kiri karena `blockRect` hanya ada di tema Minecraft), SFX file asli, regresi interaktif (dadu, giliran, ular, tangga, power, chest, mob, pause, AFK), performa di perangkat rendah. Perlu dicek manual.

## PERLU DIPUTUSKAN
- Durasi total sequence naik dari ~8 dtk menjadi ~12 dtk (getaran + retakan + runtuh). Bila terlalu lama, ubah angka tween di `awakenDragon` (1.3 / 1.1 / 2.3).
- File `dragon-awakening.mp3` perlu disediakan bila ingin suara asli.

Files changed: game/gameplay.html, audit/4/dragon-feature-02-awakening.md
