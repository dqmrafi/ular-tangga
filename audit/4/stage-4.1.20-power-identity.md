# Stage 4.1.20 — Power Identity & Cross-Screen Consistency

## Scope

Power identity consistency across Gameplay, Shop, Inventory and Profile.
Core rule: **Power identity (id/name/icon) dipisah dari gameplay effect**. Hanya identity Totem yang diubah (`apple` → `totem`); effect tidak diubah.

## Findings

Klasifikasi seluruh referensi `apple` di `game/` (di luar `old/`, `referensi/`, dan font CSS `-apple-system`):

| Kelas | Lokasi | Tindakan |
|---|---|---|
| A. Effect reference | Tidak ada ID effect terpisah; effect inline `p.shield=true` di `usePU` | Effect **dipertahankan**, hanya pemicunya memakai ID baru |
| B. Visual identity | `item-catalog.js` (id, `POWER_ICON`, nama), `config.js` (`PUN`), `item-art.js` (cabang fallback SVG), `gameplay.html` (`startPU`, daftar CPU, guard fase Dragon, pesan shield `PUN.apple[1]`, tombol disabled) | Diubah ke `totem` |
| C. Legacy storage | `localStorage["ularTanggaBlok:player:v1"].inventory.apple` (key inventory = ID katalog) | Dinormalisasi saat load (lihat Compatibility) |
| D. Unused / dokumentasi | `doc/DATA_MIGRATION.md`, `doc/GAMEPLAY_HUD_AUDIT.md` menyebut `apple` | Tidak diubah; catatan Stage 4.1.20 ditambahkan di akhir `DATA_MIGRATION.md` |

Tempat Power identity bisa tersimpan (diperiksa):
- `PlayerData.inventory` (qty per ID) → **terdampak**, ditangani.
- `equipped`: hanya skin/dice/theme; Power tidak di-equip → tidak terdampak.
- Shop ownership = inventory yang sama → tercakup.
- `localStorage.inv.bag` (daily reward) hanya berisi `box` → tidak terdampak.
- Tabel hadiah harian tidak memuat ID Power → tidak terdampak.
- Gameplay `p.pu` hanya in-memory (random `startPU`), tidak dibaca dari storage → tidak ada data lama.

## Changes

- `assets/js/item-catalog.js`: item Power `apple` → `totem` (id = gameKey = `totem`, nama `Totem`); `POWER_ICON.totem`; tambah `LEGACY_POWER_ID {apple:'totem'}` dan `ItemCatalog.normalizePowerId()` (khusus membaca data lama). Struktur item existing tidak diubah. Katalog tetap satu-satunya sumber metadata visual (id, name, icon).
- `gameplay/config.js`: `PUN.apple` → `PUN.totem` (nama `Totem`). `PUIMG` tetap dibangun dari katalog.
- `assets/js/item-art.js`: cabang fallback SVG `k==='apple'` → `k==='totem'` (SVG tetap sebagai fallback bila `totem.webp` gagal dimuat).
- `gameplay.html` (hanya referensi Power, penggantian eksak dengan hitungan terverifikasi): `startPU`, `cpuPUValid`, guard fase Dragon di `usePU`, `if(k==='totem') p.shield=true`, daftar Power CPU, tombol disabled, pesan shield. Logic effect, dice, movement, board, turn, karakter, kamera tidak disentuh.
- `assets/js/player-data.js`: `sanitize()` membaca key inventory lewat `normalizePowerId`; bila `apple` dan `totem` sama-sama ada, qty digabung (acquiredAt/seq diambil yang paling awal).
- `doc/DATA_MIGRATION.md`: catatan identity baru (ditambahkan di akhir, ASCII, byte lain tidak berubah).

Tidak ada: icon baru, UI baru, redesign Shop/Inventory/Profile, animasi, dependency, atau schema/migration version baru.

## Compatibility

- Save lama dengan `inventory.apple` dibaca sebagai `totem` (qty dan data lain dipertahankan); `owns('apple')` menjadi `false` dan tidak ada item duplikat.
- Jika `apple` dan `totem` sama-sama ada → digabung (mis. 2 + 3 = 5).
- Normalisasi idempoten dan terjadi saat load (tanpa menaikkan `MIGRATION_VERSION`, sehingga pemain yang sudah di migrasi v1 tetap tercakup). Key `apple` di storage hilang pada penulisan berikutnya (purchase/grant/equip); selama belum ada penulisan, storage tidak diubah dan hasil baca tetap benar.
- Data yang tidak berkaitan (coins, gems, skin/dice/theme, Power lain) tidak diubah.

## Static Validation

- `node --check`: `item-catalog.js`, `item-art.js`, `player-data.js`, `config.js` lulus; 4 blok script inline `gameplay.html` lulus.
- Skrip Node (sandbox `vm`, localStorage tiruan) — 24 pemeriksaan lulus:
  - ID konsisten: `PUN` = `PUIMG` = katalog = `startPU` = {sword, feather, tnt, totem, potion, grass}; semua `k==='x'` pada logic Power adalah ID dikenal.
  - Semua file ikon `data/power/sm/*.webp` ada; `catalog.icon === PUIMG`; nama Totem konsisten.
  - `ItemArt.powerup()` memakai `totem.webp` dan masih menyertakan SVG fallback untuk keenam Power.
  - Effect `totem → p.shield=true` dan jalur konsumsi shield utuh; tidak ada sisa identity `apple` di `gameplay.html`.
  - Simulasi save: `apple`(2) → `totem`(2); `apple`(2)+`totem`(3) → 5 tanpa duplikat; save baru tidak berubah; Power lain dan currency utuh; setelah `grant` key `apple` hilang dari storage.
- Pencarian referensi: sisa `apple` hanya pemetaan legacy yang disengaja, komentar, dan dokumentasi.
- Tidak ada browser test yang dijalankan.

## Manual Test

Manual browser testing delegated to user.

## Status

READY FOR MANUAL TEST
