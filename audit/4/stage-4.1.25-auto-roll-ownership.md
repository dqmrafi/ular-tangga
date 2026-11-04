# Stage 4.1.25 — Auto Roll Ownership

Baseline: `498496d` (main). File diubah: `game/gameplay.html` (blok Auto Roll + 1 aturan CSS + 2 hook sinkron). Gameplay tidak ditulis ulang.

## Audit (sebelum perubahan)
| Temuan | Lokasi (baseline) | Dampak |
|---|---|---|
| Pemeriksa hanya menolak `p.cpu`; semua pemain manusia di-auto-roll | interval `setInterval` ±4645 | Mode 2/3/4: Auto menjalankan giliran pemain manusia lain (BUG ownership) |
| Tombol `#btnAuto` selalu aktif, juga saat giliran CPU/pemain lain | `index` HUD ±402, tak ada sinkron | Bisa di-toggle bukan di giliran sendiri |
| Status ON/OFF hanya variabel sesi (`let autoRoll`), tidak disimpan | ±4642 | Hilang saat reload |
| Guard roll ganda: `doRoll()` set `busy=true` sinkron + `setRoll(false)` | ±4546-4549 | Sudah aman; interval hanya cek `busy` (dipertahankan + ditambah guard) |
| `autoSince` tidak direset saat game baru (`gameId` berubah) | ±4642 | Jeda bisa terbawa antar game |
| Tidak ada konsep "pemain lokal" eksplisit; tidak ada mode online | seluruh file | Dipakai konvensi `frameOf`: pemain non-CPU `idx===0` = pemilik profil |
| Auto di Block 100 (Special Dice) memanggil `doRoll()` tanpa `opt` (angka acak) — sama dengan jalur AFK | ±4484, ±4261 | Perilaku lama, TIDAK diubah; dicatat |

## Perubahan
- `localPlayerIdx()` (=0) + `isLocalPlayer(p)` = `!p.cpu && p.idx===0` — memakai `players[]`, `cur`, `p.idx` yang ada.
- `syncAutoBtn()`: `#btnAuto` **disabled** (layout tetap) kecuali giliran pemain lokal dan game belum selesai; dipanggil di `beginTurn`, `finishGame`, dan tiap tick interval. CSS `:disabled` meredupkan tombol; ON/OFF tetap terlihat.
- `setAutoRoll` ditolak bila bukan giliran lokal; status disimpan di `localStorage['ut-autoroll']` dan dipulihkan saat load.
- Interval: roll hanya bila `autoCanRoll()` (giliran lokal, tidak busy/paused/gameOver/AWK/DH/readyScreen, Roll tidak disabled); `autoSince` direset saat `gameId` berubah. `doRoll()` tetap satu-satunya jalur roll.

## Keputusan yang perlu dikonfirmasi
Mode 2/3/4 adalah hot-seat satu perangkat. "Pemain lokal" saya definisikan = P1 (`idx 0`). Jika semua kursi manusia dianggap lokal, ubah `isLocalPlayer` (satu fungsi).

## Pemeriksaan
- `git diff --check`: bersih. `node --check` pada 4 inline script `gameplay.html` dan semua `game/gameplay/*.js`: OK.
- `node audit/4/stage-4.1.25-harness.js`: **21 pass, 0 fail** (kode Auto Roll asli diekstrak; DOM/doRoll di-stub).
- Regression `audit/4/chest-feature-02-harness.js`: **tidak bersih, tetapi identik dengan baseline** (1 FAIL "Potion p4…" dan `HARNESS ERROR resolveTileAt is not defined` baik dengan maupun tanpa patch) — harness lama sudah usang terhadap `gameplay.html`; bukan regresi dari perubahan ini, tidak diperbaiki di sini.

## Browser Test
**NOT RUN.** Klik nyata, tampilan disabled, dan interaksi dengan animasi 3D belum diverifikasi di browser.
