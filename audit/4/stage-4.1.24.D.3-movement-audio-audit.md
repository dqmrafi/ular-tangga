# Stage 4.1.24.D.3 — Movement Audio Audit

Mode: AUDIT-ONLY. Tidak ada kode/audio diubah, tidak ada audio dibuat/diunduh/dihapus/di-rename/dikonversi.
Label: **[CONFIRMED]** = dibaca di kode/FS pada HEAD `8ab6363`; **[INFERRED]** = disimpulkan; **NEEDS LISTENING** = butuh validasi suara (karakter bunyi tidak dinilai dari nama file).

## Baseline
HEAD `8ab6363` (D.2), HEAD == origin/main. Audit A/B/C/D.1/D.2 ada dan dibaca. Rujukan: A (inventaris pawn-hop/dice-roll/ladder-up/snake-bite), B (P0 "ular memutar ladder-up", event tanpa suara), C (C04 snake remap, C05 move-back kandidat, C06 ladder, C17–C21), D.1/D.2 (tidak menyentuh movement).

## Movement Audio Matrix
| Event | Current Function | Current Audio | Status | Action |
|---|---|---|---|---|
| Dice Roll | `doRoll` → `sfx.roll()` (gameplay.html 3383) | `dice/dice-roll.mp3` (2.04s) via `fileSfx`; fallback 7 beep | REAL_ASSET (+ ACCEPTED FALLBACK) | Tidak ada. Karakter NEEDS LISTENING. |
| Dice Stop / Land | `sfx.rollStop(rs)` setelah `sleep(1150)` (250 ms bila reduced-motion) | tidak ada suara tersendiri; hanya `fadeOut` 250 ms atas file roll | COVERED (oleh file roll) / NEEDS LISTENING | Roll 2.04s dipotong fade pada ±1.15s → ekor file (bila memuat bunyi mendarat) terpotong [INFERRED]. Dengar dulu; bukan alasan asset baru. |
| Dice 6 / critical | `p.sixes`; 6 → `beginTurn(true)` | tidak ada suara khusus | COVERED (sama dengan roll) — tidak ada event audio khusus di kode | Tidak ada. |
| Tiga kali 6 | `doRoll` `sfx.bounce()` | `bounce()` sintetis (beep), satu-satunya audio event ini | SYNTHETIC (GAP/SYNTHETIC, P2) | Keputusan nanti; tidak ada rekomendasi asset sekarang. |
| Pawn Hop/Step | `walk` → `sfx.hop()` per petak (3154) | `board/pawn-hop.mp3` (0.14s) ; fallback 1 beep | REAL_ASSET (+ ACCEPTED FALLBACK) | Tidak ada. |
| Pawn Hop (jalur tangga) | `climb`: `hopTo`/`glide`/`hopTo` | tanpa `sfx.hop`; hanya `sfx.ladder()` | lihat Ladder | — |
| Pawn Landing | akhir `walk` (hop terakhir) | bunyi hop terakhir = landing; tak ada event/suara terpisah | COVERED (oleh pawn-hop) | Jangan buat `landing.mp3`. |
| Overshoot >100 (memantul) | `playTurn` → `sfx.bounce()` lalu `walk` mundur | `bounce()` sintetis + hop saat berjalan mundur | SYNTHETIC (isyarat saja; gerak tetap COVERED hop) | `board/move-back.mp3` ada, tidak dipakai (kandidat Stage C C05, NEEDS LISTENING). |
| Ladder Up | tile: `sfx.naiktangga()` (3268) → 350ms → `climb` → `sfx.ladder()` (3160) | `board/ladder-up.mp3` (1.37s) lalu 4 beep sintetis (`ladderBeeps`) | REAL_ASSET + SYNTHETIC berlapis; event→asset sesuai | COVERED. Lapisan ganda (file + beep ±350 ms kemudian) [INFERRED]; apakah terdengar dobel = NEEDS LISTENING. |
| Snake Down (animasi, `SNAKEINFO`) | tile: `sfx.naiktangga()` (3275) → `bite` : `hiss`,`chomp`,`gulp`,`caplokular`,`pop` | **`ladder-up.mp3` (file tangga) dimainkan untuk ular** + noise/beep sintetis + `snake-bite.mp3` (1.59s) + `pop()` | **GAP / WRONG_AUDIO** (audio tangga pada event ular) + NEEDS LISTENING untuk karakter `snake-bite.mp3` | Event→fungsi→asset tidak sesuai (lihat bagian Snake). Bukan perubahan di stage ini. |
| Snake Down (tanpa `SNAKEINFO`) | `playTurn`: `hopTo` saja | tidak ada suara | GAP (senyap) | Kandidat `move-back.mp3`/`snake-bite-alt.mp3`: NEEDS LISTENING, belum diputuskan. |
| Turn Start | `beginTurn` | tidak ada `sfx.*`; hanya marker/outline/banner HUD | GAP (tanpa audio, sengaja tidak direncanakan; Stage C C21 NOT_NEEDED) | Tidak ada asset. Sudah cukup bila desain tidak butuh audio giliran. |
| Turn Change | `nextTurn` → `beginTurn` | sama; tidak ada event terpisah | GAP (sama) | Tidak ada. |
| Extra turn (6/Feather) | `beginTurn(true)` | tidak ada | GAP (tanpa audio) | Tidak ada. |

## Special Movement
| Event | Audio saat ini | Status |
|---|---|---|
| Tiba di 100 (`p.pos===100`) | `hundred()` (`block-100.mp3`) + `win()` sintetis fanfare | REAL_ASSET + SYNTHETIC (fanfare event progres; dicatat D.1, tidak diubah) |
| Gather ke arena (`gatherArena`) | `sfx.pop()` per pion (2446) | SYNTHETIC (final, satu-satunya) |
| Villager +5 | `pop()` (3290) | SYNTHETIC (final) — C27 SYNTHETIC_FALLBACK_ONLY |
| Enderman/Creeper/Dragon | mob (file nyata, creeper explode sintetis) | di luar scope movement; lihat B/C |
| TNT/Grass (`teleport`) | `teleport` tanpa suara; suara = aktivasi Power (D.2) | COVERED oleh suara aktivasi |
| Totem melindungi di ular/mob | `pop()` (3271) | SYNTHETIC (P1 Stage C C12) |

## Snake / Asset Duplicate
- `board/snake-bite.mp3` == `ui/power-claim.mp3` (md5 `752509e3…`, 50.991 B, 1.59s) [CONFIRMED]. `snake-bite-alt.mp3` (35.040 B, 1.75s) berbeda hash. Tidak dihapus/diganti.
- Pemanggilan ular memutar `naiktangga` → `ladder-up.mp3` (3275) sebelum `bite`; `caplokular` (`snake-bite.mp3`) hanya pada animasi gigit (pertengahan trip). Apakah `snake-bite.mp3` cocok sebagai suara gigitan **NEEDS LISTENING** (nama "power-claim" untuk file identik menunjukkan nama bisa menyesatkan).
- Tidak ada keputusan canonical asset dibuat di sini.

## Computer Parity
Giliran CPU: `beginTurn` → `setTimeout` → `usePU(k,true)` (opsional) → `doRoll()`; `doRoll`, `playTurn`, `walk`, `climb`, `bite`, `beginTurn` dipakai Player dan Computer tanpa cabang audio `p.cpu`. Satu-satunya `p.cpu` terkait audio ada di hasil akhir (D.1). Tidak ada audio khusus Computer dan tidak ada panggilan SFX di scheduler CPU [CONFIRMED]. Parity: PASS.

## Synthetic Audio Audit
| Pemakaian | Peran | Status |
|---|---|---|
| `roll`, `hop`, `naiktangga`, `caplokular`, `hundred` (beep) | fallback bila file gagal | ACCEPTED FALLBACK |
| `ladder()` (`ladderBeeps`) | lapisan sintetis setelah file | SYNTHETIC (berlapis; NEEDS LISTENING) |
| `hiss`, `chomp`, `gulp` | satu-satunya audio fase gigit (selain `snake-bite.mp3`) | SYNTHETIC final (P2) |
| `bounce()` (3× 6, overshoot, dragon no-progress) | satu-satunya audio event | GAP / SYNTHETIC (P2) |
| `pop()` (bite akhir, gather, villager, shield) | satu-satunya audio | SYNTHETIC final (P2/P1) |

## Kesimpulan
**Sudah cukup:** Dice roll (real), Pawn hop dan landing (hop terakhir; tidak perlu `landing.mp3`), Ladder (event→asset benar), Computer parity, Dice 6, Turn start/change (tanpa audio, tidak ada kebutuhan terbukti).
**Masih membutuhkan integrasi/validasi (bukan asset baru):**
1. Snake memutar `ladder-up.mp3` (WRONG_AUDIO, P0 dari B/C04) → remap ke asset yang ada, butuh keputusan setelah NEEDS LISTENING (`snake-bite` vs `snake-bite-alt`, atau senyap).
2. Snake tanpa animasi senyap (kandidat `move-back`/`snake-bite-alt`, NEEDS LISTENING).
3. Dice stop: dengar apakah ekor `dice-roll.mp3` terpotong fade 250 ms @1.15s.
4. Ladder: dengar apakah file + beep terdengar dobel.
5. `bounce()` untuk overshoot / tiga 6 sintetis (P2); `move-back.mp3` kandidat reuse.
Tidak ada rekomendasi asset baru untuk movement: semua gap bisa diisi asset yang sudah ada atau cukup sebagai sintetis P2.

## Static Checks
- `git diff --check`: bersih (hanya file audit baru).
- Pencarian `beep|noise|sfx.pop|playTurn|doRoll|beginTurn|walk|hopTo|ladder|snake` pada `gameplay.html` dan `gameplay/*.js`: ringkasan di atas; `hopTo` tanpa `sfx`; tidak ada `sfx.*` bercabang `p.cpu` pada movement.
- Tidak ada kode yang diubah; tidak ada perubahan gameplay.

## Browser Test
NOT RUN.

## Next Stage
Tidak ditentukan; menunggu instruksi (D.4 tidak dimulai).
