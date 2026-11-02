# Stage 4.2.1.1 — Lobby Redesign Audit & Structure

Mode: AUDIT-ONLY. Tidak ada kode, aset, atau folder yang diubah/dibuat selain file audit ini.
Label: **[CONFIRMED]** = dibaca di kode/FS; **[INFERRED]** = perhitungan/kesimpulan; **NOT VERIFIED** = tidak diuji (tanpa browser).

## Repository Baseline
- branch: `main`
- commit: `04d629d` (audit(4.1.24.D.3): audit movement audio)
- working tree: bersih sebelum audit (`git status --short` kosong).

## ⚠ Temuan penting: `game/redesign/` TIDAK ADA
- Folder `game/redesign/` tidak ada di repo [CONFIRMED]. Yang ada: `game/redesign-hud/` (5,6 MB): 10 gambar referensi (`lobby.jpg`, `mode.jpg`, `toko.jpg`, `inventory.jpg`, `leaderboard.jpg`, `profil.jpg`, `dailyreward.jpg`, `gameplay.jpg`, `modal.jpg`, `progres.png`) + `readme.md` (prompt "GLOBAL HUD REDESIGN"). **Tidak ada HTML/CSS/JS/model/tekstur/audio/data** di dalamnya.
- Folder tidak dibuat di stage ini. Keputusan yang dibutuhkan sebelum 4.2.1.2: (a) implementasi langsung di `game/lobby.html` (sesuai `readme.md` §10 "implement directly into the existing project, no separate demo"), atau (b) folder baru `game/redesign/`. Rekomendasi: (a).

## Redesign Structure
```
game/redesign-hud/
  readme.md          prompt HUD global (layout kiri/kanan, palet, aturan "jangan tambah/hapus/duplikasi tombol")
  lobby.jpg          REFERENSI layout+gaya lobby (1376×768, landscape)   <- sumber utama stage ini
  mode.jpg toko.jpg inventory.jpg leaderboard.jpg profil.jpg dailyreward.jpg modal.jpg gameplay.jpg progres.png
```
Pemetaan kategori yang diminta: HTML/CSS/JS/model/tekstur/fonts/audio/data/components = **tidak ada** di `redesign-hud/`; yang ada hanya references. Isi `readme.md` dipakai sebagai kontrak: jangan tambah/hapus/duplikasi tombol, pertahankan label, badge, handler; jangan sentuh scene 3D (background, langit, awan, karakter, kamera, Three.js).

## Lobby Files (implementasi existing)
| Role | File | Status |
|---|---|---|
| HTML | `game/lobby.html` (285 baris, markup + CSS + JS inline) | READY, sumber kebenaran |
| CSS | inline di `lobby.html` + `assets/css/base.css` (46) + `assets/css/shared-ui.css` (81, currency bar & modal) | READY |
| JS | inline di `lobby.html` (HUD, modal, ACT, event carousel, 3D Three.js r128 dari cdnjs) | READY |
| JS bersama | `assets/js/item-catalog.js`, `item-art.js`, `player-data.js`, `app.js` (`UT.App/Events/Audio/UI/Router`), `hud/ui-core.js`, `frame-guard.js`, `boot-guard.js`, `landscape.js` (no-op) | READY |
| Komponen HUD | `hud/components/{badge,button,card,currency,modal,toast}.{js,css}` ada, **tidak dimuat oleh lobby.html** (hanya `ui-core.js`) | UNUSED di lobby |
| Aset gambar | `promosi/placeholder.jpg` (event), `data/skins/*.png`, `data/power/*`, `assets/Images/mode/*.jpg`; **lobby sendiri memakai SVG inline + geometri Three.js, tanpa PNG** | lihat Asset Reuse |
| Fonts | Google Fonts "Baloo 2" (eksternal) | PLACEHOLDER/eksternal |

## Existing Lobby Compatibility (harus dipertahankan) [CONFIRMED]
| data-act / id | Fungsi saat ini | Target |
|---|---|---|
| `#play` (tanpa data-act) | klik → `buzz()` + `location.href='mode.html'`; panah `#pr` mengganti label mode (`MODES`, hanya label) | `mode.html` |
| `toko` | `shop.html` | `shop.html` |
| `inv` | `inventory.html` | `inventory.html` |
| `lead` | `leaderboard.html` | `leaderboard.html` |
| `prof` (kartu profil) | `profile.html` | `profile.html` |
| `teman` | `friendship.html` | `friendship.html` |
| `hadiah` (`#hadc`) | `dailyreward.html` | `dailyreward.html` |
| `misi` | toast "Misi segera hadir" | **tidak ada target (GAP)** |
| `mail` | toast "Pesan segera hadir" | **tidak ada target (GAP)** |
| `gear` | modal Pengaturan: Musik/Suara/Getar → `PD.setSettings` | modal in-page |
| `event` | modal gambar (`EVENTS[]`, 1 placeholder; carousel dot/next tersembunyi bila 1 event) | modal in-page |
| `buygem`/`buycoin` (tanda +) | toast "Beli gem/coin segera hadir" | **tidak ada target (GAP)** |
| `free` | ada di `ACT` ("Hadiah gratis") tetapi **tidak ada elemen `data-act="free"`** di markup | kode mati |
| Klik pada karakter 3D | emote "cheer" 1,6 s (hit-test hardcoded pecahan stage x .33–.57, y .19–.69) | in-page |
Fitur wajib yang diminta: PLAY ✓, SHOP ✓, INVENTORY ✓, LEADERBOARD ✓, PROFILE ✓, FRIENDS ✓, DAILY REWARD ✓, SETTINGS ✓ (modal), QUEST/MISSION ✗ (hanya toast).

## Player State
Sumber tunggal: `PlayerData` (`assets/js/player-data.js`, localStorage `ularTanggaBlok:player:v1`) + `UT.Events` (`currencyChanged`, `skinChanged`, `diceChanged`, `inventoryChanged`, `settingsChanged`) [CONFIRMED].
| Field | Sumber | Dipakai lobby? |
|---|---|---|
| coins, gems | `PD.coins()/gems()` | Ya (`renderCurrency`, event `currencyChanged`) |
| skin terpasang | `PD.equippedId('skin')` → `ItemArt.palette(id)` (hood/hair/pants) | Ya (avatar SVG + karakter 3D; event `skinChanged`) |
| dice terpasang | `PD.equippedId('dice')` | **Tidak ditampilkan di lobby** (tidak ada elemen dadu) |
| settings (music/sound/vibration/graphics) | `PD.settings()/setSettings` | Ya (modal Pengaturan, `buzz`) |
| name | `PD.profile().name` (default 'FajarGG'), `PD.setName` | **Tidak dibaca**: `#pname` hardcoded "FajarGG" (kebetulan = default) |
| level, xp | **tidak ada di PlayerData** | **Hardcoded**: "Lv. 26", `41.7%`, "1.250 / 3.000 XP" di `lobby.html`; `profile.html` memakai `MOCK` (xp:1250,xpMax:3000) |
| bendera | tidak ada | hardcoded SVG Indonesia |
| inventory/qty | `PD.ownedItems()/qty()` | Tidak di lobby |
| badge notifikasi (Mail 1, Misi 2, Teman 3, Hadiah 1, "BARU") | tidak ada sumber state | CSS `.dot`/`.nw` ada; sumber nilai tidak ada. NOT VERIFIED apakah dirender |
| Daily reward claim | key legacy `inv` (`daily`, `bag`) di `dailyreward.html`, bukan PlayerData | state di luar PlayerData |
| Teman | data mock di `friendship.html` (level, status) | mock |
Aturan: redesign tidak boleh membuat state kedua; level/xp/badge butuh keputusan (sumber) sebelum menjadi dinamis.

## Navigation (referensi `lobby.jpg` vs lobby sekarang)
| Elemen | Reference lobby.jpg | lobby.html sekarang |
|---|---|---|
| Profil (avatar, nama, Lv, XP) | kiri-atas | kiri-atas (sama konsep) |
| Gem + Coin | kanan-atas | kanan-atas (`.ut-curbar`) |
| Mail, Settings | kanan, di bawah currency | kanan-atas (`#mail`,`#gear`) |
| Inventory, Leaderboard | kiri, baris 1 | kiri, kolom (top 14,4/23,4rem) |
| Misi | kiri, kartu lebar (judul+progres "3/5"+badge) | kiri-bawah, tombol kotak kecil |
| Event | kiri, di bawah Misi | **kanan**, kartu besar |
| Toko / Teman / Hadiah | kiri-bawah (Toko lebih besar) | **kanan-bawah** (Toko di atas, Teman+Hadiah di bawahnya) |
| MULAI + "Pilih Mode" | **kanan-bawah**, hijau, besar | tengah-bawah, **kuning/emas** (`#play`, left 44,5 %) |
| Karakter | tengah, pulau melayang + bayangan | tengah (hero di-offset ke x 44,5 % stage) |
Perbedaan layout besar: Event, Toko/Teman/Hadiah pindah ke kiri; MULAI pindah ke kanan-bawah dan jadi hijau; Misi menjadi kartu informasi.
Catatan konflik: sketsa layout di prompt stage (vertikal: Settings/Currency atas, Player tengah, Shop/Dice samping, Play bawah) berbeda dari `lobby.jpg` (landscape). Aplikasi berjalan landscape (lihat Responsive) → dipakai `lobby.jpg` sebagai target; tombol **Dice** di sketsa tidak ada di lobby maupun di referensi → tidak ditambah (melanggar "jangan tambah tombol").

## Asset Reuse
| Asset | Location | Status |
|---|---|---|
| Character | prosedural Three.js `character(palette)` di `lobby.html`; warna dari `ItemArt.palette` | READY (reusable) — **tidak memakai PNG `data/skins/*.png`** yang dipakai gameplay → tampilan lobby ≠ skin gameplay [INFERRED] |
| Skin | `data/skins/{hero,knight,ninja_red,pejabat,sakura,warden}.png`; katalog `item-catalog.js` | REUSABLE (tekstur belum dipakai lobby) |
| Dice | `data/dice/` (`3d_dice_roll_effects.html`, jpeg) + `PD.equippedId('dice')` | UNUSED di lobby |
| Island | `island()` voxel inline (≈ cells 7×7×4, InstancedMesh) — dipakai juga di profil/inventory/shop | READY |
| Background/sky/fog/cloud | gradient CSS + `scene.fog` + 7 awan voxel + siluet balok pucat + haze | READY (jangan diubah, readme §7) |
| Icons | SVG inline per tombol; ikon gem/coin SVG inline di 8 halaman (UI_AUDIT) | DUPLICATE (sudah dicatat doc) |
| Buttons/panels | CSS `.pn`, `#toko`, `#hadc`, `#play` inline | READY (perlu restyle) |
| Particles/effects | tidak ada (hanya emote "cheer") | MISSING (tidak wajib) |
| Event image | `promosi/{placeholder,promo2,promosi}.jpg` | PLACEHOLDER (hanya `placeholder.jpg` dipakai) |
| Referensi gaya | `redesign-hud/lobby.jpg` + 9 gambar lain | READY (referensi, bukan asset runtime) |
Tidak ada asset dibuat/diubah di stage ini.

## Interaction Audit
| Element | Current action | Target route | Target function | State dependency | Status |
|---|---|---|---|---|---|
| Play | klik → mode.html | `mode.html` | `$('#play')` handler | – | OK |
| Mode arrow (`#pr`) | ganti label `#pm` | – | `setMode` | `MODES[]` lokal | OK (hanya kosmetik) |
| Shop | navigasi | `shop.html` | `ACT.toko` | – | OK |
| Inventory | navigasi | `inventory.html` | `ACT.inv` | – | OK |
| Leaderboard | navigasi | `leaderboard.html` | `ACT.lead` | – | OK |
| Profile | navigasi | `profile.html` | `ACT.prof` | – | OK |
| Friends | navigasi | `friendship.html` | `ACT.teman` | data mock | OK, data mock |
| Quest/Misi | toast | – | `soon('Misi')` | tak ada | GAP |
| Daily Reward | navigasi | `dailyreward.html` | `ACT.hadiah` | key `inv` legacy | OK |
| Settings | modal | in-page | `ACT.gear` | `PD.settings` | OK |
| Mail | toast | – | `soon('Pesan')` | tak ada | GAP |
| Event | modal gambar | in-page | `ACT.event` | `EVENTS[]` | OK (placeholder) |
| Skin | tampil di avatar/hero, tidak interaktif | – | `skinChanged` | `PD.equippedId('skin')` | OK (tampil saja) |
| Dice | tidak ada elemen | – | – | `PD.equippedId('dice')` | tidak ada di lobby |
| Currency (+) | toast "segera hadir" | – | `buygem/buycoin` | `PD` | GAP (target belum ada) |
| Character | cheer 1,6 s | – | `pointerdown` hit-test | fraksi stage hardcoded | OK, terikat layout |

## Responsive Issues (analisis kode; tanpa browser) 
- Arsitektur: `#ui` = stage tetap 100rem × 54,054rem (16:9) dipusatkan; `html{font-size:min(1vw,1.85vh)}`; canvas 3D full-viewport; `fit()` menyesuaikan FOV bila aspek < 16:9 dan `setViewOffset` agar hero berada di x 44,5 % stage [CONFIRMED]. HP portrait: `play.html` memutar iframe 90° (`pointer:coarse`), sehingga lobby selalu melihat viewport landscape; halaman yang dibuka langsung dialihkan ke `play.html` oleh `frame-guard.js`; `landscape.js` no-op [CONFIRMED].
- Android phone/small screen [INFERRED]: pada HP 360×800 (viewport landscape 800×360) `font-size` ≈ 6,66 px → tombol `.sm` (4,3 rem) ≈ 29 px, `.lm` (8,8 rem) ≈ 59 px; target tap `.sm`, titik carousel, tanda + currency < 44 px; teks kecil (`#xp span` 1,15 rem ≈ 7,7 px, `small` 1,3 rem ≈ 8,7 px) sangat kecil.
- Large phone/tablet/desktop [INFERRED]: pada aspek < 16:9 stage dibatasi lebar (letterbox vertikal; kanvas tetap penuh), pada aspek lebih lebar dibatasi tinggi (ruang kosong kiri-kanan); `max-aspect-ratio:1/1` hanya mengatur `.ut-curbar` — jendela desktop portrait tidak punya layout khusus. NOT VERIFIED.
- Touch/mouse: `button:hover{scale 1.05}` aktif juga di touch (sticky hover pada sebagian browser); `buzz` memakai `navigator.vibrate`; tidak ada pemisahan hover/touch. 
- Keterikatan hero ↔ posisi Play: offset kamera `.445` dan hit-test karakter hardcoded; memindahkan MULAI ke kanan dan karakter ke tengah (sesuai `lobby.jpg`, hero ≈ 50 %) menuntut perubahan konstanta tersebut.
- Dependensi eksternal: Three.js r128 dan Baloo 2 dari CDN; tanpa jaringan → pesan "3D tidak tersedia" / font fallback (SW network-first hanya meng-cache host yang sudah diizinkan).
- Resolusi referensi `lobby.jpg` 1376×768 (≈ 16:9) cocok dengan stage 100rem × 54,05rem.

## Missing Pieces
**Must fix (sebelum/selama redesign)**
1. Keputusan lokasi implementasi (`lobby.html` vs folder baru) — `game/redesign/` tidak ada.
2. Sumber level/xp (PlayerData tidak punya) — saat ini hardcoded; `profile.html` memakai MOCK.
3. Nama pemain dari `PD.profile().name` (sekarang hardcoded).
4. Layout reposition ke `lobby.jpg` (Event/Toko/Teman/Hadiah ke kiri, MULAI kanan-bawah, hijau) + sinkron offset kamera/hit-test karakter.
5. Kartu Misi sesuai referensi (judul + progres + badge) tetapi **tanpa tombol baru**; target Misi masih "segera hadir".
6. Ukuran tap-target/teks minimum untuk HP kecil.
**Nice to have**
- Badge angka (Mail/Misi/Teman/Hadiah/BARU) bila ada sumber state; bayangan pulau; gunakan `hud/components` bersama; mengganti tekstur PNG skin pada karakter 3D agar sama dengan gameplay; dedup ikon SVG gem/coin.
**Not needed**
- Tombol Dice di lobby (tak ada di referensi & aturan "jangan tambah tombol"); aset baru; engine render baru; perubahan gameplay/HUD gameplay; audio; multiplayer; `ACT.free` (kode mati, biarkan).

## Recommended Implementation Order
1. 4.2.1.2 — Keputusan struktur + pemetaan token gaya dari `lobby.jpg` (palet, border, bevel) sebagai CSS variables di `lobby.html`, tanpa mengubah markup/handler.
2. 4.2.1.3 — Reposisi layout sesuai `lobby.jpg` (HTML/CSS saja) + sinkron konstanta kamera hero/hit-test.
3. 4.2.1.4 — Restyle komponen: profil/XP, currency, Mail/Settings, Inventory/Leaderboard, Misi, Event, Toko/Teman/Hadiah, MULAI hijau; pertahankan `data-act` dan handler.
4. 4.2.1.5 — Data: `PD.profile().name`, sumber level/xp (keputusan), badge; tanpa state baru khusus lobby.
5. 4.2.1.6 — Responsive & tap-target (HP kecil, tablet, desktop), reduced-motion.
6. 4.2.1.7 — Regresi: seluruh navigasi, modal Pengaturan, event `skinChanged/currencyChanged`, tanpa menyentuh gameplay.

## Static Validation
- Tidak ada JS/HTML yang diubah → `node --check` tidak diperlukan.
- `git diff --check`: bersih (hanya file audit baru).
- Browser test: **NOT RUN**.
