# UI COMPONENT AUDIT

Scope: audit baca-saja seluruh UI component di `game/`. Tidak ada implementasi, refactor, atau perubahan gameplay.
Basis: `game/*.html`, `game/hud/`, `game/gameplay/`, `game/assets/css/`, `game/assets/js/app.js`, `game/doc/UI_AUDIT.md`.
Dikecualikan dari audit: `game/old/`, `game/referensi/` (arsip), `game/redesign-hud/` (gambar referensi).

Catatan cakupan: halaman **Quest** tidak punya halaman sendiri (hanya tombol `#misi` di `lobby.html:125`, handler `misi(){soon('Misi')}` di `lobby.html:204`). **Game Room** = kartu `Custom Room` di `mode.html` (`mode.html:243`, `:289`) + modal pilih Publik/Privat dengan `.code`. **Friends** = `friendship.html`.

---

## EXISTING

### A. Komponen reusable yang sudah ada (`game/hud/`)

Registry: `hud/ui-core.js` -> `UT.Hud.register / has / get / create`. Semua komponen mendaftar sendiri.

| Komponen | File | Kelas / API | Status pemakaian |
|---|---|---|---|
| Button | `hud/components/button.{css,js}` | `.ut-btn`, `-primary/-secondary/-ghost/-danger`, `-sm/-md/-lg`; `UT.Hud.create('button',{...})` | **0 pemanggil** |
| Card | `hud/components/card.{css,js}` | `.ut-card`, `-default/-elevated/-outlined/-flat`, `-p-none/-sm/-md/-lg` | **0 pemanggil** |
| Currency | `hud/components/currency.{css,js}` | `.ut-currency`, `-gem/-coin`, `-sm/-md/-lg` | **0 pemanggil** |
| Modal | `hud/components/modal.{css,js}` | `.ut-modal` (instance: `open/close/isOpen/setContent/setTitle`) | **0 pemanggil** |
| Toast | `hud/components/toast.{css,js}` | `.ut-toast` (`show/hide/isVisible/setMessage`) | **0 pemanggil** |
| Badge | `hud/components/badge.{css,js}` | `.ut-badge`, `-default/-success/-warning/-danger/-info`, `-sm/-md/-lg` | **0 pemanggil** |

Fakta pemuatan (diverifikasi dengan grep):
- 8 halaman memuat `hud/ui-core.js` lewat `<script>`: dailyreward, friendship, inventory, leaderboard, lobby, mode, profile, shop.
- **Tidak ada halaman yang memuat file komponen** (`button.js`, `card.js`, dst.). `splash.html:254` hanya menaruh `hud/ui-core.js`, `hud/components/button.css`, `hud/components/button.js` di daftar *preload/cache*, bukan memakainya.
- `UT.Hud.create / get / has` **tidak dipanggil di file mana pun** di `game/` (di luar `hud/` dan `doc/`).
- Komponen memuat CSS-nya sendiri otomatis; selector semua berawalan `.ut-*` sehingga tidak bentrok dengan kelas halaman.

### B. Lapisan UI bersama lain

| Item | File | Fungsi | Pemakaian |
|---|---|---|---|
| `UT.UI.toast(msg, ms)` | `assets/js/app.js:121` | Toast singleton, memakai `#toast` halaman bila ada, kalau tidak membuat `.ut-toast` | 0 pemanggilan di halaman (tiap halaman punya `toast()` sendiri) |
| `UT.UI.modal / closeModal` | `assets/js/app.js:136`, `:153` | Overlay `.ut-overlay` + `.ut-modal` | 0 pemanggilan |
| `UT.UI.setLoading` | `assets/js/app.js:160` | Toggle `html.ut-loading` | 0 pemanggilan (grep `setLoading|ut-loading` di `*.html` dan `gameplay/*.js` kosong) |
| `.ut-overlay/.ut-modal/.ut-toast` | `assets/css/base.css` | Gaya untuk `UT.UI` di atas | ikut tidak terpakai |
| `.ut-curbar` | `assets/css/shared-ui.css` | Gaya bar mata uang + override `.ov > .box` | **dipakai**: string `ut-curbar` ada di 8 halaman non-gameplay (lobby, mode, shop, inventory, profile, leaderboard, friendship, dailyreward); override global ke `.ov > .box` berlaku di 10 halaman yang memuat `shared-ui.css` |
| `shared-ui.css` | `assets/css/shared-ui.css` | "Bridge" yang menimpa gaya kelas halaman (`html body .ut-curbar .cur`, `html body .ov > .box`, dst.) | dimuat: dailyreward, friendship, inventory, leaderboard, loading, lobby, mode, profile, shop, splash |
| `base.css` | `assets/css/base.css` | reset `:where(button|a|input...)`, `.hidden`, `.disabled`, loading | dimuat 9 halaman (dailyreward, friendship, inventory, leaderboard, lobby, mode, profile, shop, splash) + gameplay |

### C. Inventaris per kategori yang diminta

Kolom "Reusable?" = apakah ada implementasi bersama yang benar-benar dipakai. "Ada" = ada komponen tapi 0 pemakai.

| Kategori | Implementasi yang ada | Reusable? | Dipakai oleh |
|---|---|---|---|
| Button | `.ut-btn` (hud) | Ada, tidak dipakai | tidak ada. Tombol nyata: `.cta`, `.bt`, `.mb`, `.heroBtn`, `.modalBtn`, `.pack`, `.use` per halaman; `.btn` di gameplay |
| IconButton | `.ab` (+ `.blue`) | Tidak (duplikat) | lobby, mode, shop, inventory, profile, leaderboard, friendship, dailyreward |
| Card | `.ut-card` (hud) | Ada, tidak dipakai | tidak ada. Nyata: `.card` (shop, inventory), `.gc` (leaderboard), `.friend` (friendship), `.row`, `.panel` (dailyreward), `.pn` (lobby, mode, profile) |
| Panel | `.panel` (dailyreward), `.pnl` (gameplay + lobby), `.pn` | Tidak | lihat bagian DUPLICATES |
| Modal | `.ut-modal` (hud), `UT.UI.modal` | Ada, tidak dipakai | tidak ada. Nyata: `.ov > .box + #mx + #mb` + `openModal/closeModal` di 8 halaman |
| Drawer | **tidak ada** | n/a | n/a (`grep drawer` kosong) |
| Toast | `.ut-toast`, `UT.UI.toast` | Ada, tidak dipakai | tidak ada. Nyata: `#toast` + `toast()` di 8 halaman |
| Badge | `.ut-badge` (hud) | Ada, tidak dipakai | Nyata: `.badge` (shop, inventory), `.tag` (mode), `.badgeCount` (friendship), `.tag` di `.row.cl` (dailyreward) |
| Tooltip | **tidak ada** | n/a | n/a (`grep tooltip|data-tip` kosong) |
| Tabs | tidak ada komponen | Tidak (duplikat) | `.cat` (shop, inventory, profile), `.tb` (leaderboard), `.tab` (friendship) |
| Toggle | tidak ada komponen | Tidak (duplikat) | `.tg` di 6 halaman |
| Progress | tidak ada komponen | Tidak (duplikat) | `.bar` (profile), `.xp` (leaderboard), `.loading-track/.loading-fill` (splash), `.track/.fill` (loading), `.hp` (gameplay), `.dmeter` (gameplay) |
| Avatar | tidak ada komponen | Tidak (duplikat) | `.av` (profile, leaderboard), `.avatar` (friendship), `img` face di `.pr` (gameplay) |
| Currency | `.ut-currency` (hud) | Ada, tidak dipakai | Nyata: `.cur` + `#gem/#coin` + `renderCur`-like di 8 halaman |
| ItemSlot | tidak ada komponen | Tidak (duplikat) | `.th` (shop, inventory), `.tile` (profile), `.day` (dailyreward) |
| PlayerSlot | tidak ada komponen | Tidak (duplikat) | `.gc.lr` (leaderboard), `.friend` (friendship), `.pr` (gameplay), `.rd-card` (ready.js) |
| Loading | `UT.UI.setLoading`, `html.ut-loading` | Sebagian | splash, loading punya progress bar sendiri; `play.html` punya dadu sendiri |

### D. Game UI (gameplay)

Semua bagian ini **khusus gameplay** dan hidup di `gameplay.html` + `gameplay/*.js` (global `UT.Gameplay*`).

| Game UI | Lokasi | Selector / fungsi | Catatan |
|---|---|---|---|
| PlayerHUD | `gameplay.html:318`, render di `:3088-3102` | `#players`, `.pr` (+`.on`, `.shielded`), `.pos`, `.bf`, `.hp`; panel skor `#scores .sr` | chip dibuat lewat DOM langsung; `GameplayHUD.updatePlayer` di `gameplay/hud.js:230` |
| TurnIndicator | `gameplay.html:323-329` | `.pnl.tn`, tab "Giliran" (`tab.textContent` di `:3635`), `.tn-av`, `.tn-meta`, `#turnName`, `.msg#msg` | layout grid ditimpa berlapis (`:459`, `:537`, `:546`, `:552`, `:589`) |
| Dice | `gameplay.html:325`; `gameplay/dice-ui.js` | `.die-scene > .die-tilt > .die`, `.face.f1-f6`; `UT.GameplayDiceUI` | murni presentasi |
| PowerButton | `gameplay.html:319` | `.pnl.pu`, `#pus`, `.pb`, `.pu-nav` (`.blue`), `#puPrev/#puNext` | `.pb` didefinisikan ulang di `:73`, `:158`, `:169` |
| FeedbackStack | `gameplay/hud.js` (`UT.GameplayHUD`); `gameplay/feedback.js` (`UT.GameplayFeedback`) | `showEvent/showTurn/showPower/showCombat/showResult/updatePlayer/reset`; `#puCard.pucard`, `#pcWho/#pcName/#pcDesc/#pcEmoji`, `.puimg`, `.pfx-*` | `hud.js` menyuntik CSS sendiri (`injectStyle`, `hud.js:38`); dipanggil lewat `hud('...')` di gameplay.html |
| CameraControls | `gameplay.html:273-284`; `#btnCam`, `#btnPreset`, `#camGrp`, `#btnAngle` | `.camgrp`, `.btn.ico[aria-pressed]`, `body.cam-angle`, `body.cam-lock` | memakai `.btn` gameplay |
| ReadyPanel | `gameplay/ready.js` (`UT.GameplayReady.show(players, opts)`) | `.rd-card .rd-grid .rd-box .rd-av .rd-nm .rd-btn .rd-st .rd-time .rd-ord .rd-sub` | CSS disuntik sendiri (`injectCSS`, `ready.js:48`); tergantung `UT.GameplayAFK` |
| GameResult | `gameplay.html:336-342` | `section.overlay.soft#win > .card.center`, `.res-ico`, `.eyebrow`, `#winTitle`, `#winText`; juga `hud('showResult')` | memakai `.overlay` / `.card` gameplay |
| CrystalProgress | **tidak ada komponen DOM** | teks `Crystal n/4` di `.pos` (`gameplay.html:3091`); crystal itu sendiri objek 3D | logika di `p.crystal` / `syncCrystals` (lihat `audit/4/dragon-feature-03-crystal-progression.md`) |
| DragonHUD | `gameplay/hud.js` `showCombat` (`:207`, `:232-234`) + `.hp` di chip pemain (`:3098`) | bar HP naga + teks `Ender Dragon: n/100` | tidak ada komponen terpisah |
| SpecialDice | `gameplay.html:294`, `:327`, `:328` | `#btnRoll.special`, `#btnRoll.holding`, `.dmeter#diceMeter`, `.dm-bar`, `.dm-needle` | kontrol tahan-lepas, bukan komponen terpisah |

Gameplay punya sistem sendiri (`.btn`, `.card`, `.panel`, `.chip`, `.overlay`, `.pnl`) yang tidak memakai `hud/` ataupun `ut-*`.

---

## DUPLICATES

Format: komponen -> definisi (file:baris) -> fungsi -> reusable? -> pengguna. Baris diambil dari `grep` pada kondisi repo saat audit.

### D1. Toggle ON/OFF `.tg` — 6 salinan CSS, 6 salinan markup/handler
- CSS: `lobby.html:96`, `mode.html:87`, `inventory.html:79`, `profile.html:47` (7.6x3.8rem, font 2rem); `shop.html:262`, `leaderboard.html:218` (7x3.5rem, font 1.8rem). Isi lain identik (`background:#7b8aa8`, `inset` shadow, `.tg.on{background:var(--g)}`).
- Markup + handler: `row=(k,l)=>...<button class="tg ...">` di `lobby.html:207`, `mode.html:300`, `shop.html:463`; handler toggle (`PD.setSettings({[k]:v})`, teks ON/OFF) di inventory, leaderboard, profile, shop, lobby, mode.
- Reusable: belum. Duplicate: ya. Pengguna: lobby, mode, shop, inventory, profile, leaderboard (modal Pengaturan: Musik, Suara, Getar, Grafik di shop).
- Tidak ada komponen Toggle di `hud/`.

### D2. Modal / overlay — 8 salinan
- CSS `.ov`: `lobby.html:88`, `mode.html:77`, `shop.html:254`, `inventory.html:71`, `profile.html:39`, `leaderboard.html:211`, `friendship.html:29`, `dailyreward.html:93` (identik; hanya opacity latar .4 vs .45).
- CSS `.box`: 7 halaman (lobby `:61`, mode `:79`, shop `:256`, inventory `:73`, profile `:41`, leaderboard `:213`, dailyreward `:95`), lebar berbeda (44 / 46 / 48rem).
- CSS `.x` (tombol tutup): 7 halaman, posisi/ukuran sedikit beda (4.2 vs 4.6rem; offset -.8 / -1 / -1.2rem).
- JS: `openModal`, `closeModal` di 8 halaman. Perilaku tidak seragam: kelas `closing` ada di 5 halaman (inventory, leaderboard, mode, profile, shop); `big` di shop/inventory/profile; handler Escape di 7 halaman (semua kecuali friendship); fokus ke `#mx` sebagai kebiasaan sebagian halaman.
- `shared-ui.css` menimpa `html body .ov > .box`, `> #mb`, `> .x` secara global -> perubahan gaya modal harus mempertimbangkan override ini.
- Reusable: tidak. Ada `.ut-modal` dan `UT.UI.modal` tapi 0 pemakai.

### D3. Toast — 8 salinan
- CSS `#toast`: lobby `:97`, mode `:91`, shop `:266`, inventory `:83`, profile `:50`, leaderboard `:220`, friendship `:28`, dailyreward `:105` (beda font-size 2.0-2.6rem, padding, bottom 2.5/3rem).
- JS `function toast`: 8 halaman yang sama (~1600 ms).
- Reusable: tidak. Ada `.ut-toast`, `UT.UI.toast`, dan `hud` toast; 0 pemakai.

### D4. Tombol aksi/ikon `.ab` (+ `.ab.blue`, Back `#back`) — 8 salinan
- CSS `.ab`: lobby `:14`, mode `:20`, shop `:31`, inventory `:14`, profile `:14`, leaderboard `:25`, friendship `:14`, dailyreward `:15` (position absolute vs relative berbeda).
- `#back.ab.blue` + SVG panah identik di 7 halaman (dailyreward, friendship, inventory, leaderboard, mode, profile, shop).
- Reusable: tidak. Tidak ada komponen IconButton.

### D5. Tombol teks (CTA) — varian terpisah per halaman
- `.cta`: `mode.html:52` (4.3rem, abu/biru/kuning via `.b/.y`), `shop.html:211` (4.2rem, gradien kuning, lebar penuh).
- `.bt` (+ `.own/.gd/.no`, `.use`): `inventory.html:60` (dan dipakai di kartu shop).
- `.mb`: shop `:264`, inventory `:81`, profile `:49` (identik: `width:48%`).
- `.pack`: mode `:88`, shop `:263`, inventory `:80`, profile `:48`, leaderboard `:219` (margin/padding berbeda tipis).
- `.heroBtn`: `friendship.html:21`; `.modalBtn`: friendship; `.bb` (bar mode): mode.
- Gameplay: `.btn`, `.btn.big/.small/.light/.ico` (`gameplay.html:34`) — 18 elemen memakai kelas `btn` di markup.
- Reusable: tidak. `.ut-btn` ada tapi tidak dipakai.

### D6. Currency bar — 8 salinan
- `.cur` + `#gem/#coin` + `.plus` di semua halaman non-gameplay; ukuran berbeda per halaman (lobby 3.8, mode 4.2, shop 5.0, inventory/profile/friendship 4.2, leaderboard, dailyreward — lihat `doc/UI_AUDIT.md`).
- Sebagian dirapikan lewat `shared-ui.css` (`html body .ut-curbar .cur`, `.plus`), tapi markup dan fungsi render masih per halaman.
- Ikon gem/coin SVG di-inline di 8 halaman.
- Reusable: sebagian (CSS bridge). `.ut-currency` ada, 0 pemakai.

### D7. Kartu item (ItemSlot / item card) — 2 salinan + variasi
- `.card`: `shop.html:238` (padding .4rem), `inventory.html:50` (padding .3/.7rem, varian `.lg/.lk/.sel`); isi sama: `.th` thumbnail + `.nm` + `.badge` + tombol.
- Markup dibuat via string di `shop.html:402` dan `inventory.html:208`.
- `.tile` (profile `:91`), `.day` (dailyreward `:43`) = slot item lain dengan gaya sendiri.
- Reusable: tidak. Duplicate: ya (shop <-> inventory hampir sama).

### D8. Badge / tag — 4 gaya
- `.badge`: shop `:204` (font 1.5rem), inventory `:37` (font 1rem), keduanya warna rarity.
- `.tag`: mode `:54` (SEGERA / `.soon`), dailyreward `.row.cl .tag`.
- `.badgeCount`: friendship.
- Reusable: tidak. `.ut-badge` ada, 0 pemakai.

### D9. Tabs — 4 implementasi, perilaku sama (satu aktif)
- `.cat` (shop `:143` sebagai ikon; inventory `:24`, profile `:24`: tinggi 4.8rem), `.tb` (leaderboard `:173`, tinggi 4.2rem), `.tab` (friendship).
- Perilaku "satu aktif" = `.on` di semua. Reusable: tidak. Tidak ada komponen Tabs.

### D10. Baris pengaturan / list row `.row` — 7 salinan
- `.row`: lobby `:93`, mode `:84`, shop `:260`, inventory `:77`, profile `:45`, leaderboard `:216` (radius 1.2/1.4/1.6rem), dailyreward `:98` (layout berbeda: `.ri`, `.cl`).
- Reusable: tidak.

### D11. Progress / bar — 6 implementasi
- `.bar` (profile `:69`), `.xp` (leaderboard `:157`) — hampir identik (tinggi 1.5rem, radius .8rem, inset shadow).
- `.loading-track/.loading-fill` (splash `:65`), `.track/.fill` (loading `:90`, role=progressbar).
- Gameplay: `.hp` (chip pemain), `.dmeter/.dm-bar` (dadu spesial), `.dm-needle`.
- Reusable: tidak. Tidak ada komponen Progress.

### D12. Avatar — 3 gaya
- `.av` profile `:63` (radius 1.2rem), `.av` leaderboard `:155` (4.8rem, radius 1rem, border), `.avatar` friendship `:26` (5.2rem, radius 1.4rem, gradien).
- Isi SVG sama dari `assets/js/item-art.js` (`AR`).
- Reusable: tidak.

### D13. Panel — 5 definisi
- `.panel` (dailyreward `:32`, gameplay `gameplay.html:33`), `.pn` (lobby `:19`, mode `:53`, profile `:59`), `.pnl` (gameplay 29 baris aturan; lobby `:49` memakai nama sama untuk hal berbeda: banner Event `#event.ab.pn.pnl.one`).
- **Bentrok nama:** `.pnl` = panel HUD di gameplay, tetapi `lobby.html:49` memakai `.pnl` untuk banner Event. `.pn` didefinisikan tiga kali dengan arti berbeda.

### D14. Player slot — 4 implementasi
- `.gc.lr` leaderboard (`:191`, grid 4 kolom, `.me`), `.friend` friendship, `.pr` gameplay (`gameplay.html:59`, `:140`), `.rd-card` ready.js.

### D15. Helper JS lain yang diduplikasi
| Fungsi | Salinan di |
|---|---|
| `toast()` | dailyreward, friendship, inventory, leaderboard, lobby, mode, profile, shop |
| `openModal()` / `closeModal()` | 8 halaman yang sama |
| `playSound()` | dailyreward, inventory, leaderboard, profile, shop (peta SFX sendiri membungkus `UT.Audio.play`) |
| `spark()` | dailyreward, inventory, mode, profile, shop (`.sp` partikel kilau) |
| render currency | 8 halaman |

---

## REUSABLE NOW

Sudah reusable dan benar-benar terpakai:
- `assets/css/base.css` (reset + `:where()`), `UT.Audio`, `PlayerData`/`PD`, `item-art.js` (`AR`), `item-catalog.js`.
- `assets/css/shared-ui.css` bagian `.ut-curbar` (dipakai shop + leaderboard).
- Gameplay (internal, bukan lintas halaman): `UT.GameplayHUD`, `UT.GameplayDiceUI`, `UT.GameplayReady`, `UT.GameplayFeedback`, `UT.GameplayFX`, `UT.ParticleFX`, `UT.FireworkFX`, `UT.CreeperExplosionFX` — modul terpisah dengan API jelas.

Sudah ada dan kualitasnya baik, **tetapi 0 pemakai** (siap dipakai tanpa dibuat ulang):
- `.ut-btn`, `.ut-card`, `.ut-currency`, `.ut-modal`, `.ut-toast`, `.ut-badge` beserta fabrik `UT.Hud.create(...)`.
- Semuanya berprefiks `.ut-*`, aman berdampingan dengan kelas halaman, dan memuat CSS sendiri.

---

## NEEDS REFACTOR

Urut menurut dampak terhadap duplikasi (jumlah salinan x risiko rendah):

1. **Toggle `.tg` + baris pengaturan** (6 halaman) — belum ada komponen; salinan identik; paling aman.
2. **Toast `#toast` + `toast()`** (8 halaman) — padanan sudah ada (`.ut-toast`, `UT.UI.toast`).
3. **Modal `.ov/.box/.x` + `openModal/closeModal`** (8 halaman) — padanan sudah ada; hati-hati perilaku yang tidak seragam (`big`, `closing`, Escape, fokus) dan override global `shared-ui.css`.
4. **Tombol Back/Close `.ab` / `#back` / `.x`** (7-8 halaman) — belum ada IconButton.
5. **Currency bar** (8 halaman) — padanan `.ut-currency` ada; `#gem/#coin` diisi dari `PlayerData`.
6. **Button teks (`.cta/.bt/.mb/.pack`)** — padanan `.ut-btn` ada; banyak varian yang harus dipetakan.
7. **Item card shop <-> inventory** — padanan `.ut-card` ada; isi kartu berbeda layout.
8. **Badge/tag** — padanan `.ut-badge` ada; 4 gaya yang harus disatukan.
9. **Tabs, Progress, Avatar, PlayerSlot** — belum ada komponen.
10. **Gameplay** (`.btn/.card/.panel/.pnl/.pb`) — migrasi terakhir; sengaja di luar lingkup sekarang.

---

## GAME-SPECIFIC

Tetap di gameplay, tidak dijadikan komponen umum:
- PlayerHUD (`.pr`, chip + status Crystal/Naga), TurnIndicator (`.pnl.tn`), Dice (`.die-*`, `UT.GameplayDiceUI`), PowerButton (`.pnl.pu`, `.pb`, `#pus`), FeedbackStack (`UT.GameplayHUD`, `#puCard`), CameraControls (`.camgrp`), ReadyPanel (`.rd-*`, `ready.js`), GameResult (`#win`), CrystalProgress (teks di `.pos` + objek 3D), DragonHUD (`showCombat` + `.hp`), SpecialDice (`#btnRoll.special`, `.dmeter`), `.pfx-*`.
- Efek: `particle-fx`, `firework-fx`, `creeper-fx`, `fx.js` (konfeti/sparkle).
- Alasan: terikat state game (`p.crystal`, `p.dragonReady`, `p.dhp`, `p.shield`), layout `#side` + `zoom`/`--hs`, dan sistem `.btn/.card/.panel` sendiri.

---

## NOT SAFE TO EXTRACT YET

- **Seluruh blok CSS gameplay** (`gameplay.html`, 14 blok `<style>`, 29 baris aturan `.pnl`, `.pb` didefinisikan 3 kali, layout `#side` bertimpa di banyak `@media`). Mengubah satu aturan menggeser tata letak lain. Ditandai tahap 4.0.9 di `doc/UI_AUDIT.md`.
- **`.pnl` dan `.pn`**: nama sama, arti berbeda (HUD gameplay vs banner Event lobby vs panel mode/profile). Ekstraksi harus menunggu penyelarasan nama.
- **`.btn[aria-pressed]` dan `.btn.ico`** di gameplay: bagian kontrol kamera dan sudah ditimpa `body .hud .btn...`.
- **Modal**: perilaku berbeda antarhalaman (`big`, `closing`, Escape, fokus) bukan cuma gaya; salah ekstrak mengubah animasi tutup.
- **`shared-ui.css` override `html body .ov > .box`**: global ke 10 halaman; perubahan komponen modal akan bentrok/ditimpa.
- **Ready panel** (`ready.js`) dan **HUD feedback** (`hud.js`): menyuntik CSS sendiri dan bergantung `UT.GameplayAFK`/Config; bukan kandidat komponen umum.
- **`.dmeter` / `#btnRoll.special`**: tahan-lepas + `touch-action:none`, terikat logika dadu.
- **`play.html` dan `splash.html` dadu CSS 3D** (`.dice/.face`): salinan dekoratif dengan keyframe sendiri.

---

## RECOMMENDED COMPONENT STRUCTURE

Memakai struktur yang sudah ada (`hud/ui-core.js` + `hud/components/*`), tidak membuat registry kedua. Kandidat yang belum ada ditandai "baru".

```
game/hud/
  ui-core.js                (ada)  registry UT.Hud
  components/
    button.{css,js}         (ada)  .ut-btn
    icon-button.{css,js}    (baru) pengganti .ab / #back / .x
    card.{css,js}           (ada)  .ut-card
    modal.{css,js}          (ada)  .ut-modal
    toast.{css,js}          (ada)  .ut-toast
    badge.{css,js}          (ada)  .ut-badge
    currency.{css,js}       (ada)  .ut-currency
    switch.{css,js}         (baru) pengganti .tg
    tabs.{css,js}           (baru) pengganti .cat/.tb/.tab
    progress.{css,js}       (baru) pengganti .bar/.xp/.track
    avatar.{css,js}         (baru) pengganti .av/.avatar
    item-slot.{css,js}      (baru) pengganti .th/.tile
    player-slot.{css,js}    (baru) pengganti .gc.lr/.friend
game/gameplay/              (tetap)  modul game-specific
```

Urutan yang disarankan (berdasarkan jumlah salinan dan risiko): Switch -> Toast -> Modal -> IconButton -> Currency -> Button -> Badge -> Card -> Tabs/Progress/Avatar -> Slot -> Gameplay (terakhir).

Aturan: prefiks `.ut-*`; token via variabel CSS (`--ut-*`) dengan fallback ke `--bd/--y1/--y2` halaman; satu halaman dimigrasi per langkah dengan tampilan identik.

---

## FILES TO CHANGE LATER

(Bukan sekarang. Daftar kandidat saat refactor dimulai.)

- `game/hud/components/` — tambah `switch`, `icon-button`, `tabs`, `progress`, `avatar`, `item-slot`, `player-slot`.
- `game/lobby.html`, `mode.html`, `shop.html`, `inventory.html`, `profile.html`, `leaderboard.html`, `friendship.html`, `dailyreward.html` — ganti salinan `.tg`, `#toast/toast()`, `.ov/.box/.x/openModal`, `.ab/#back`, `.cur`, `.cta/.bt/.mb/.pack`, `.badge/.tag`, `.card`, `.cat/.tb/.tab`.
- `game/assets/css/shared-ui.css` — sesuaikan override `.ov > .box` setelah modal dimigrasi.
- `game/assets/js/app.js` — `UT.UI.toast/modal` dihubungkan atau dipensiunkan setelah halaman migrasi.
- `game/doc/UI_AUDIT.md` — perbarui status tahap.

---

## FILES NOT TO TOUCH

- `game/gameplay.html` dan semua `game/gameplay/*.js` (gameplay, kamera, dadu, power, naga, FX, audio, AFK, ready).
- `game/assets/js/player-data.js`, `item-catalog.js`, `item-art.js`, `game-integration.js` (data pemain/skin).
- `game/sw.js`, `game/manifest.webmanifest`, `game/assets/` (gambar, musik, sfx).
- `game/old/*`, `game/referensi/*`, `game/redesign-hud/*`, `game/promosi/*` (arsip/referensi).
- `game/splash.html`, `loading.html`, `play.html`, `index.html` (tidak punya komponen umum; dadu/progress dekoratif).
- `audit/*` yang sudah ada.

---

CHANGES:
NONE
