# Stage 4.1.19 — Power Integration

## Scope

Power asset integration from `game/data/power`. Gameplay existing = source of truth; ID dan effect Power tidak diubah.

## Audited

- Power data
- Power IDs
- Image paths
- Gameplay integration
- Effect mapping
- Fallback
- Duplicate references

### Pemetaan Power ID → data → image → effect

| Power ID (existing) | Nama (PUN) | Image (`game/data/power/sm/`) | Effect existing (`gameplay.html`, `usePU`) |
|---|---|---|---|
| `sword` | Pedang | `pedang.webp` | `p.bonus=3` (langkah berikutnya +3) |
| `feather` | Bulu | `feather.webp` | `p.extra=true` (giliran tambahan) |
| `tnt` | TNT | `dinamit.webp` | pemain terdepan mundur 6 |
| `apple` | Totem Undying | `totem.webp` | `p.shield=true` (kebal 1 ular/mob jahat) |
| `potion` | Ramuan | `ramuan.webp` | `p.p4=true` (dadu berikutnya 4–6) |
| `grass` | Blok Rumput | `block.webp` | tukar posisi dengan pemain terdepan |

Semua 6 file `.webp` ada dan nama/ekstensi/case cocok dengan peta. Master `.png` di `data/power/` tidak dipakai runtime (hanya sumber versi `sm`).

### Temuan

1. Gameplay (tombol Power, kartu peti, HUD card) sudah memakai `Config.PUIMG` + `setPuIcon` (emoji sebagai fallback via `onerror`). Tidak ada hardcoded path ikon di `gameplay.html`/`hud.js`/`feedback.js`.
2. **Celah:** Shop / Inventory / Profil memakai `ItemArt.powerup()` yang masih menggambar SVG blok lama, bukan `data/power`. Totem di sana masih SVG placeholder.
3. **Duplikat mapping:** path ikon Power hanya ada di `config.js` (gameplay); katalog item tidak punya path ikon.
4. Service worker network-first: tidak perlu bump versi.

### Totem

ID tetap `apple` (ID existing dipertahankan, termasuk di `p.pu`, `startPU`, `cpuPUValid`, `usePU`, shield logic, dan `item-catalog`). Visual = `totem.webp`. Effect tidak diubah (`p.shield=true`; ditolak saat fase Dragon seperti sebelumnya).

## Changes

- `assets/js/item-catalog.js`: tambah `POWER_ICON` dan field `icon` pada item powerup → satu-satunya sumber path ikon Power.
- `gameplay/config.js`: `PUIMG` kini dibangun dari `ItemCatalog` (bukan literal kedua). Bila katalog tidak ada → peta kosong → fallback emoji existing. `PUN`, `setPuIcon`, dan semua effect tidak berubah.
- `assets/js/item-art.js`: `powerup()` merender `<svg>` + `<image href=data/power/...>`; SVG blok lama dipindah ke `powerupSvg()` sebagai fallback (tampil dulu, disembunyikan hanya saat gambar berhasil `onload`; bila gagal tetap terlihat). Tetap `<svg>` sehingga CSS ukuran existing tidak berubah.
- Tidak ada perubahan pada dice, movement, board, turn, player state, kamera, karakter, atau logic effect.

## Files Changed

- `game/assets/js/item-catalog.js`
- `game/gameplay/config.js`
- `game/assets/js/item-art.js`
- `audit/4/stage-4.1.19-power-integration.md`

## Static Checks

- `node --check` lulus untuk 3 file JS yang diubah.
- Skrip sandbox (memuat catalog + art + config): keenam ID di `PUN`, `PUIMG`, dan `ItemCatalog` identik; `it.icon === PUIMG[id]`; file ada; markup `ItemArt.powerup()` berisi path yang benar. Hasil: ALL CONSISTENT.
- Tidak ada dependency, library, preload, canvas, atau animation loop baru.

## Manual Test

Manual testing is intentionally delegated to the user.

## Status

READY FOR MANUAL TEST
