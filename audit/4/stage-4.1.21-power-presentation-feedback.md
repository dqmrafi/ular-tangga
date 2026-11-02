# Stage 4.1.21 — Power Presentation & Feedback

## Scope

Power visual presentation and activation feedback. Hanya lapisan presentasi (CSS class-toggle) yang dipasang pada hook existing di `game/gameplay.html`; effect, state, dan urutan gameplay tidak diubah.

## Audited

### Feedback yang SUDAH ada (dipakai ulang, tidak diganti)

| Tahap | Existing |
|---|---|
| Power acquired | `giveChest` → `sfx.chest`, banner `fb('event','chest')`, kartu hadiah `showPUCard` (`#puCard`, `pcpop`), `sfx.rewardpower` |
| Power selected/ready | `data-state` ready/locked/empty + CSS (`#side .pb[data-state=…]`), hover/active transition, `:disabled` |
| Power activated | `sfx.pop`, `setMsg`, banner HUD `Feedback.short` → `UT.GameplayHUD.showPower` (kartu Power dengan ikon dari katalog) |
| Effect | TNT/Grass: `teleport` + konfeti (`UT.GameplayFX`); Sword/Feather/Potion/Totem: flag `p.bonus/extra/p4/shield` + badge buff `.bf` di chip pemain |
| Shield aktif | badge teks `🗿 kebal` (`.bf`) |
| Shield terpakai | `setMsg` + banner `fb('event','shield')` + `sfx.pop` |
| Consumed/empty | `data-state=empty` + badge jumlah |

### Celah yang ditemukan

1. Tombol Power tidak punya feedback aktivasi per-Power maupun saat Power didapat.
2. `renderChips()` membangun ulang seluruh DOM (dipanggil 2× di `usePU`), sehingga class animasi biasa pada tombol akan hilang seketika.
3. Setelah shield terpakai tidak ada `renderChips()`, jadi badge "kebal" baru hilang di giliran berikutnya (state UI basi).
4. Shield aktif hanya berupa teks kecil.

### Audio / HUD / performa / siklus animasi / duplikat

- Audio: memakai sfx existing (`pop`, `chest`, `rewardpower`); tidak ada audio baru. Modul audio tetap graceful (Proxy senyap bila tidak termuat).
- HUD/kartu Power (`hud.js`): tidak diubah; ikon sudah dari katalog. Kartu tetap stabil (tanpa perubahan ukuran/layout).
- Duplikat: tidak ada listener, loop, timer, canvas, atau WebGL baru (diverifikasi pada diff).

## Changes

Semua di `game/gameplay.html`:

- **CSS (satu blok, di samping CSS `#side .pb` existing):** kelas `pfx-*` — hanya `transform`/`opacity` lewat `@keyframes`, durasi ≤ 0,6 dtk, `pointer-events:none`, tanpa perubahan layout; cincin glow memakai pseudo-element `::after` (tanpa `box-shadow`/`filter`/blur). `prefers-reduced-motion` mematikan animasi.
  - Sword: slash cepat (scale + rotasi singkat) + cincin putih-biru.
  - Feather: naik ringan (−6px) + cincin putih lembut.
  - TNT: guncangan kecil + cincin merah.
  - Totem: pulse emas + cincin emas.
  - Potion: pulse + cincin ungu.
  - Grass/Block: hop kecil + cincin hijau.
  - Acquired (`pfx-get`): pop/bounce emas pada tombol Power yang didapat.
  - Badge jumlah: tick singkat saat berubah (menandai konsumsi/penambahan).
  - Chip pemain: indikator shield aktif statis ringan (`.shielded`, outline emas, tanpa animasi); cincin emas saat shield diaktifkan (`pfx-shield`); cincin putih saat shield menahan serangan (`pfx-hit`).
- **JS minimal (mekanisme feedback tunggal):** `PUFX`, `puFx(key,cls)`, `puFxApply(el,key)`. Feedback disimpan sebagai cap waktu 650 ms lalu dipasang ulang oleh `renderChips()` dengan `animation-delay` negatif, sehingga animasi tidak restart walau DOM dibangun ulang. Kedaluwarsa otomatis; tanpa timer/rAF/listener. Dilewati bila `reduce`.
- **Hook pada event existing:** `giveChest` (acquired), `usePU` (aktivasi per Power + shield aktif), `renderChips` (chip & tombol), blok shield terpakai (`puFx` + satu `renderChips()` agar badge "kebal" langsung hilang — murni refresh UI).
- Input safety: tidak ada `busy`/`setRoll`/lock baru; animasi murni CSS dan tidak memblokir dadu, gerak, atau Power berikutnya.

Sengaja TIDAK dikerjakan: glow 3D pada pawn di board (butuh animasi material/loop baru), perubahan `hud.js`, audio baru, serta ledakan besar untuk TNT (konfeti ledakan existing dipertahankan).

## Gameplay Effect

No gameplay effect changes.

Baris effect tetap persis: `p.bonus=3`, `p.extra=true`, `p.p4=true`, `if(k==='totem') p.shield=true`, `p.pu[k]--`, teleport TNT/Grass, dan kondisi shield `else if(p.shield&&(SNAKES…||mobOn…))`. Satu-satunya penambahan di jalur gameplay adalah `puFx(...)` dan `renderChips()` (refresh UI) setelah `p.shield=false`.

## Static Validation

- Sintaks 4 blok script inline `gameplay.html` lulus (`node --check`).
- Skrip Node (21 pemeriksaan) lulus:
  - Kurung CSS seimbang; setiap `animation` punya `@keyframes`; ada rule untuk keenam Power, `pfx-get`, `pfx-shield`, `pfx-hit`, `.shielded`; keyframes hanya `transform`/`opacity`.
  - Urutan hook benar (`puFx` sebelum `renderChips`) di `usePU`, `giveChest`, dan blok shield.
  - Lima baris effect/logic existing utuh.
  - Simulasi siklus `puFx`/`puFxApply`: t=0 memasang class (delay 0), +200 ms melanjutkan (`-200ms`), key lain tidak terpengaruh, >650 ms bersih dan entri dihapus; mode reduced-motion tidak mencatat apa pun.
  - Diff tidak menambah `requestAnimationFrame`/`setInterval`/`setTimeout`/`addEventListener`/canvas/WebGL.
- `reduce` dan helper berada di scope blok yang sama (kedalaman 1 kontinu) → tidak ada risiko ReferenceError.
- Tidak ada browser test yang dijalankan.

## Manual Test

Manual browser testing delegated to user.

## Status

READY FOR MANUAL TEST
