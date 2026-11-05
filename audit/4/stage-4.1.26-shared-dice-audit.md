# Stage 4.1.26 — Shared Dice System · Audit (sebelum coding)

Baseline: `841ed80` (main, Stage 4.1.25). Tidak ada kode game yang diubah di checkpoint ini; hanya dokumen.

## 1. Inventaris implementasi dadu saat ini

| # | Lokasi | Teknik | Bentuk | Animasi | Catatan |
|---|---|---|---|---|---|
| 1 | `game/gameplay.html` (CSS ±86-103) + `gameplay/dice-ui.js` | Kubus CSS 3D: `.die-scene` 64px, `perspective:420px`, `.die-tilt` rotateX(-20) rotateY(26), 6 `.face` `translateZ(32px)`, border 3px, grid pip 3x3 padding 7px | **Referensi bentuk/proporsi (wajib dipertahankan)** | Gulir `transform 1.05s cubic-bezier(.15,.7,.2,1)` (+2 putaran penuh) + kelas `.hop` | Warna lewat `--dbg/--dpip/--dedge` |
| 1b | `gameplay/dice-pad.css` + `dice-pad.js` | Keyframes `dieDrop` 1.25s (jatuh dari -130px, squash, pantul 24px, 7px, settle), tatakan: thud, ring, bayangan, hingga 16 partikel putih | Tatakan SVG di `#dieDock` | Dipicu `animationstart` `dieDrop`; impact di 500ms dan 825ms | Efek **sama untuk semua dadu** (tidak ada per-tema) |
| 2 | `gameplay.html` ±4628 `const DICE=[…]` | Daftar palet **duplikat** dari katalog (urutan berbeda) | — | — | `readLobbyConfig()` memvalidasi `?dice=` terhadap daftar ini; menambah dadu = edit 2 tempat |
| 3 | `assets/js/item-art.js` `ItemArt.dice` | SVG datar 64x64, muka angka 5, `edge/bg/pip` dari katalog | Datar (bukan kubus) | Tidak ada | Dipakai thumbnail grid Inventory/Shop. **Identitas visual Inventory/Shop** |
| 4 | `inventory.html` & `shop.html` (`diceTex`, `model()` ±354-359 / ±555-559) | Three.js `BoxGeometry` 2.6, tekstur kanvas 128px, 5 titik di **semua** 6 muka, WebGL wajib | Kubus tanpa border/angka berbeda per muka | Putar + melayang saja (`rotation.y=t*.8`) — **tanpa jatuh/bounce** | Kode tersalin identik di 2 halaman (+ `profile.html` ±533 `diceTex`) |
| 5 | `splash.html` `.hero-dice` | CSS 3D putih berputar (loading screen) | Dadu hias | Putar terus | Tidak terkait equip; **di luar cakupan** |
| — | `lobby.html` | **Tidak menampilkan dadu sama sekali** | — | — | Lobby hanya meneruskan `?dice=` lewat `mode.html` (±327) |

## 2. Alur data & equip (sudah ada, dipakai ulang)
- Sumber kepemilikan/equip: `PlayerData` (`localStorage ularTanggaBlok:player:v1`), `equip(id)` → `notify('equip')` → bridge `app.js` ±226-240 → event `UT.Events` **`diceChanged {id}`**. Shop dan Inventory sudah mendengarkan (`inventory.html` ±506, `shop.html`/`inventory.html` ±328).
- `player-data.js` ±373 punya listener `storage` (sinkron antar-tab).
- Legacy mirror: `mirrorLegacy()` menulis `ut-dadu` (= `gameKey`). `game-integration.js` menormalkan `?dice=` ke dadu **yang dimiliki** (default: equipped).
- **Risiko drift (kecil, dicatat):** `applyDice()` di gameplay juga menulis `ut-dadu` langsung. Bila `?dice=` = dadu dimiliki tapi bukan equipped, kunci legacy bisa berbeda dari `PlayerData.equipped.dice` sampai `notify` berikutnya. Perilaku lama; tidak diubah, tetapi sistem baru **membaca `PlayerData` sebagai kebenaran**, bukan `ut-dadu`.
- Katalog (`item-catalog.js` ±96-110): `dice.klasik 0 common` · `rumput 100 common` · `tnt 200 rare` · `diamond 450 epic` · `obsidian 500 epic` · `emas 900 legendary`. Urutan harga/rarity = urutan tingkat efek.

## 3. Logika yang TIDAK boleh disentuh
`doRoll()` (`gameplay.html` ±4547-4570): `v = 1+Math.floor(Math.random()*6)`, override Special Dice (`opt.value`, hanya Block 100), `chestDiceForce` (Pasti 6 / Ramuan Ganjil-Genap), `sfx.roll()`, `showDie(v,!reduce)`, `await sleep(reduce?250:1150)`, aturan tiga 6, `playTurn`.
Kendala waktu: giliran berlanjut tepat 1150ms setelah roll (reduce: 250ms) **tanpa menunggu animasi**. Animasi baru wajib ≤ 1.25s (sama dengan `dieDrop` sekarang) agar ritme giliran identik. `showDie(v,false)` (mode meter Special Dice, ganti muka seketika) harus tetap instan.
Kontrak yang dipertahankan: `UT.GameplayDiceUI` {init, showDie, roll, setValue, reset}; DOM `#die`, `#dieScene`, `#dieDock`, kelas `hop`, event `animationstart` `dieDrop`.

## 4. Asset & audio yang ada
- `game/data/dice/`: hanya `3d_dice_roll_effects.html` (playground referensi: aura, orbit emas, spark) dan `8301a59a…webp` (jaring dadu abu-abu 1-6, tidak terhubung ke kode). **Belum ada folder per-tema.**
- Audio: `assets/sfx/dice/dice-roll.mp3` (32.896 B) dipakai `sfx.roll()` (`audio.js` ±74: `fileSfx('roll',0.8, fallbackSynth)`, jadi **fallback synth sudah ada**); `rollStop` fade 250ms. Tidak ada suara impact dadu, tidak ada audio per dadu.
- `preload-manifest.json` memuat daftar aset + ukuran; `sw.js` network-first (`VERSION ut-pwa-v12`).
- `reduce` di gameplay = `matchMedia('(prefers-reduced-motion: reduce)')` (±1418). `dice-pad.js` punya `reduce` sendiri; `settings.graphics` (`high|low`) ada di `PlayerData` dan belum dipakai efek dadu.

## 5. Alat uji tersedia
Node 22, Playwright 1.63 + Chrome for Testing 153 (headless berjalan di workspace), ffmpeg, numpy. Browser test **dapat** dijalankan, tetapi hanya hasil yang benar-benar dijalankan yang akan dilaporkan.

## 6. Keputusan desain
1. **Satu sumber per Dice ID** = registry `UT.DiceThemes` (`assets/js/dice-themes.js`), diisi `data/dice/<key>/theme.js` (warna, material, animasi, efek, audio). Katalog tetap sumber nama/harga/rarity; `art` katalog dipertahankan hanya sebagai fallback sinkron dan **diuji sama** dengan data tema (guard drift).
2. **Satu CSS** `assets/css/dice.css`: kubus berproporsi Gameplay, diskalakan lewat `--dd-s`; keyframes jatuh/bounce/settle = keyframes `dieDrop` yang sudah ada, diparameterkan (`--dd-k = ukuran/64`) agar identik di Gameplay dan proporsional di Shop/Inventory/Lobby.
3. **Satu renderer** `assets/js/dice-view.js` (`UT.DiceView`) + `dice-fx.js` (partikel) + `dice-audio.js`. `UT.GameplayDiceUI` tetap ada dan mendelegasikan ke sini.
4. Tingkat efek mengikuti rarity/harga: klasik 0 (tanpa partikel, tetap jatuh/bounce) → rumput 1 → tnt 2 → diamond/obsidian 3 → emas 4. Durasi animasi semua tema ≤ 1.25s.
5. Android: hanya `transform/opacity` (WAAPI), anggaran partikel per tingkat dan dipotong separuh bila `graphics==='low'`, node dibersihkan seusai animasi, berhenti saat tab tersembunyi.
6. Reduced motion: tanpa jatuh/bounce/partikel/glow bergerak; muka final langsung.
7. Fallback: tema tak dikenal → klasik; file audio gagal → synth WebAudio; WebAudio gagal → diam; sprite gagal → partikel kotak berwarna.

## 7. Rencana checkpoint
| CP | Isi | Verifikasi |
|---|---|---|
| 0 | Audit ini | HEAD == origin/main |
| 1 | Registry + folder tema + dice.css + DiceView/FX/Audio (belum dipakai halaman) | Harness Node: data lengkap, fallback, drift katalog |
| 2 | Gameplay memakai sistem bersama | Diff `doRoll`/random = kosong; Playwright: roll, muka = nilai, durasi |
| 3 | Inventory + Shop | Playwright + screenshot |
| 4 | Lobby + sinkron equip 4 halaman | Playwright lintas halaman |
| 5 | Regression akhir + dokumen | Semua harness + browser run |

## Status uji
Browser test: **belum dijalankan** pada checkpoint ini.
