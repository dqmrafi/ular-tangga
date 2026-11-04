# Stage 4.2.2 — Karakter gameplay di semua halaman, skin PNG dihapus, mob Teman & Hadiah

## Scope
Pasang model karakter dari gameplay (`UT.CharacterData`) di halaman lain; hapus skin PNG; Teman dan Hadiah Harian memakai mob (bukan karakter). `gameplay.html` tidak diubah.

## Changes
- Baru: `assets/js/character-view.js` (`UT.CharacterView`, karakter 3D + emote, ganti `character()` yang terduplikasi), `assets/js/mob-view.js` (`UT.MobView`, mob reusable), `doc/MOB_VIEW.md`.
- `lobby/inventory/shop/profile/leaderboard.html`: `character()` lama (rig terduplikasi) → `UT.CharacterView`; Lobby avatar & wajah memakai `ItemArt.face`; Leaderboard: podium + baris pemain memakai `CharacterData` (`NK`).
- `item-art.js`: `character()/face()` memakai `CharacterData` (cadangan = gambar palet lama).
- `mode.html`: ilustrasi karakter kartu mode = `CharacterData.svg`. `dailyreward.html`: ikon skin Enderman = `CharacterData.face`.
- `friendship.html`: kupu-kupu + bunga (`butterfly-garden`). `dailyreward.html`: ayam (`chicken`, happy).
- Skin PNG dihapus: 6 item di `item-catalog.js` (+ `skinPng`, `SKIN_DIR`, grup `PNG`), `data/skins/*.png`, `preload-manifest.json`, `splash.html`, META di `tools/character-data/build.js` (data diregenerasi).

## Checks
- `node --check` lulus (character-view, mob-view, item-art, item-catalog, character-data); 19 model (7 player, 7 mob, 5 wild) lolos uji API sandbox.
- Headless Chrome (swiftshader): lobby, inventory, shop, profile, friendship, leaderboard, dailyreward, mode, gameplay dimuat tanpa error konsol; tampilan diperiksa lewat screenshot.
- Save lama aman: `PlayerData.sanitize` membuang item tak dikenal dan mengembalikan equipped ke default.
- `git diff game/gameplay.html` kosong.

## Tersisa (sengaja dibiarkan)
- Kode PNG di `gameplay.html` (`PNG_DEFS`, `loadSkin3D`, `upgradePawnPNG`), `gameplay/skin-uv.js`, dan fungsi texture di `item-art.js` kini tidak terpakai (gameplay tidak diubah).
- Daftar teman di Teman masih memakai avatar wajah sederhana buatan halaman (data contoh).
- `.agent/stages/4.1.14.9-png-renderer.md` masih menyebut `data/skins` (riwayat).

## Manual Test
Diserahkan ke pengguna (animasi, emote, ukuran di perangkat nyata).

## Status
READY FOR MANUAL TEST
