# Character Data (data karakter bersama)

Satu sumber detail model voxel karakter & mob gameplay, agar halaman lain (lobby, leaderboard, profil, shop, inventory, dll.)
memakai tampilan yang sama dengan gameplay — bukan lagi wajah 8×8 sederhana.

- File: `assets/js/character-data.js` (skrip klasik, global `UT.CharacterData`, tanpa dependency; three.js hanya untuk `mesh()`)
- Sumber data: diekstrak apa adanya dari `gameplay.html` (`makePawn`, `addCreeper`, `addEnderman`, `addSkeleton`, `addZombie`, `addWarden`,
  `addVillager`, `addBlaze`, `makeHostile`). **`gameplay.html` tidak diubah** — gameplay tetap memakai kodenya sendiri.
- Regenerasi bila model di gameplay berubah: `cd game && node tools/character-data/build.js`
- Preview: `tools/character-preview.html`

## Isi
| Grup | Key |
|---|---|
| `player` | steve, alex, creeper, ender, zombie, skeleton, villager + skin PNG (hero, knight, ninja_red, pejabat, sakura, warden → model cadangan `steve`; tekstur tetap lewat `ItemArt`) |
| `mob` | creeper, ender, skeleton, zombie, warden, villager, blaze (mob di petak papan) |
| `wild` | golem, spider, zombie, skeleton, creeper (mob liar) |

Satu box = `[x, y, z, w, h, d, '#rrggbb', noEdge, tag]` (pusat box, satuan dunia gameplay, kaki di y=0, menghadap +z).
`tag`: 0 biasa · 2 batang Blaze · 3 blok kepala 0.3 (di gameplay = 27 kubus 0.1 dengan variasi warna).

## API
```js
UT.CharacterData.list('player')                         // ['steve', ...]
UT.CharacterData.get('mob', 'warden')                   // {name, hex, css, boxes, bounds, ...}
UT.CharacterData.svg('player', 'alex', {view:'iso', size:160})   // view: front | iso | back | side; yaw/pitch bebas
UT.CharacterData.face('player', 'steve', {size:64})              // kepala saja (thumbnail/leaderboard)
UT.CharacterData.svg('mob', 'warden', {bust:true})                // bust = setengah badan atas
UT.CharacterData.mesh(THREE, 'wild', 'golem', {scale:1})         // THREE.Group (1 mesh, vertex color) untuk lobby 3D
UT.CharacterData.SEATS                                           // warna kursi Merah/Biru/Kuning/Hijau
```
Pakai di halaman: `<script src="assets/js/character-data.js"></script>` lalu masukkan hasil `svg()` ke `innerHTML`.

## Catatan
- Skin PNG: `svg()/face()/mesh()` menampilkan model `steve` (sama seperti fallback gameplay). Untuk tekstur PNG tetap pakai `ItemArt.character()/face()`.
- Belum ada halaman yang dipindah ke data ini; langkah berikutnya: Lobby → Leaderboard → Profil/Shop/Inventory.
