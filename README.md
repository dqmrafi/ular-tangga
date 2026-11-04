# Ular Tangga Blok

Game ular tangga bertema voxel/Minecraft. Jalankan lewat server lokal (mis. `python3 -m http.server`) lalu buka `index.html`.

## Peta folder

```
/                      landing publik (index.html, leaderboard.html) + assets/ khusus landing
├─ assets/             css/ js/ lang/ image/ untuk landing; old/ = arsip landing lama
├─ audit/              laporan audit per stage (arsip, jangan dijadikan acuan path)
├─ .agent/stages/      log kerja per stage
└─ game/               aplikasi game (scope service worker /game/)
   ├─ *.html           halaman: splash, index, lobby, mode, shop, inventory, profile,
   │                   leaderboard, friendship, dailyreward, misi, play (shell), gameplay
   ├─ assets/
   │  ├─ css/ js/      kode bersama (js/vendor = three.min.js)
   │  ├─ Images/       background, clouds, mode, icon/<grup>/ (lihat icon/README.md)
   │  ├─ icons/        ikon PWA
   │  ├─ music/        BGM & musik Awakening Naga
   │  ├─ sfx/<kategori>/  semua efek suara (lihat sfx/README.md)
   │  └─ preload-manifest.json   dibuat oleh tools/gen-preload-manifest.py
   ├─ gameplay/        modul gameplay (audio, hud, fx, config, themes, ...)
   ├─ hud/             UT.Hud + komponen (badge, button, card, currency, modal, toast)
   ├─ data/            gambar data game: dice/ frame/ power/
   ├─ promosi/         banner event lobby
   ├─ doc/             dokumentasi & catatan (CATATAN_GAMEPLAY.md, CATATAN_SOUND.md)
   ├─ referensi/       bahan referensi desain & lab (tidak dimuat game)
   └─ tools/           skrip build (character-data, gen-preload-manifest.py)
```

Setelah menambah/memindah aset: jalankan `python3 game/tools/gen-preload-manifest.py` dan naikkan `VERSION` di `game/sw.js`.

## Halaman utama (`game/`)
| File | Fungsi |
|---|---|
| `splash.html` | Preloader aset, lalu masuk ke aplikasi |
| `play.html` | Shell: halaman game dijalankan di dalam frame (BGM + transisi) |
| `index.html` / `lobby.html` | Beranda aplikasi / lobi (mode, skin, tema, dadu) |
| `mode.html`, `shop.html`, `inventory.html`, `profile.html`, `leaderboard.html`, `friendship.html`, `dailyreward.html`, `misi.html` | Halaman fitur |
| `gameplay.html` | Game 3D (sumber kebenaran logika; modul di `gameplay/`) |

## Kode bersama (`game/assets/js/`, gaya di `game/assets/css/`)
- `item-catalog.js` : satu-satunya sumber harga & metadata item.
- `player-data.js` : saldo, inventory, item aktif; `localStorage["ularTanggaBlok:player:v1"]`.
- `item-art.js`, `app.js`, `game-integration.js` : gambar SVG item, util UI/audio, validasi pilihan gameplay.

Data hanya tersimpan di browser yang dipakai (tanpa akun/server).

## Karakter & mob
- `game/assets/js/character-data.js` (`UT.CharacterData`) = model karakter pemain/mob gameplay; `character-view.js` = karakter 3D di halaman. Lihat `game/doc/CHARACTER_DATA.md`.
- `game/assets/js/mob-view.js` (`UT.MobView`) = mob dekoratif reusable (kupu-kupu + bunga di Teman, ayam di Hadiah Harian). Lihat `game/doc/MOB_VIEW.md`.
- Skin PNG sudah dihapus; semua skin memakai model voxel yang sama dengan gameplay.
