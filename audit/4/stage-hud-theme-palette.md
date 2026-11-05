# HUD theme palette (World & Nether)

Scope: warna HUD gameplay saja. Layout, id, JS gameplay, RNG, aturan, dan kanvas 3D tidak diubah.

## Perubahan
- `game/gameplay.html`
  - `applyLook()`: tambah `body.th-world` (key tema `minecraft`) di samping `body.th-nether` yang sudah ada.
  - Blok baru `<style id="hud-theme-palette">` di paling akhir (menimpa `hud-ref-v3`, yang sebelumnya membuat HUD Nether tetap biru/emas).
  - Palet dipusatkan di custom property `--tp-*` per tema, aturan komponen dipakai bersama lewat `body:is(.th-world,.th-nether)`.

## Palet
| Elemen | World (daun + kayu oak) | Nether (Crimson + Warped) |
|---|---|---|
| Tombol kanan atas | hijau daun | merah crimson |
| Tombol aktif (pressed) | kayu oak | hijau warped |
| Kartu pemain | papan kayu oak | batang crimson |
| Kartu pemain giliran aktif | hijau daun | hijau warped |
| Banner event | hijau daun, tepi lime | crimson, tepi mint warped |
| Panel power-up | kayu gelap, badge hijau | crimson gelap, badge teal |
| Tombol Roll | hijau daun, bingkai kayu | warped terang, bingkai crimson |
| Tombol Auto | kayu / menyala lime | crimson / menyala mint |

Tetap warna semantik (tidak diubah): banner snake (merah), mob (ungu), three6/bounce (emas), badge locked/empty, tombol suara muted.

## Cara membatalkan
Hapus blok `<style id="hud-theme-palette">` dan baris `th-world` di `applyLook()`.

## Verifikasi
- Kurung kurawal dan tanda kurung blok CSS baru seimbang (dicek lewat skrip).
- Belum diuji di browser/Android. Pengujian manual oleh pemilik proyek.
