# Stage 4.1.24.D.2 — Power Audio Integration

## Baseline
`ef323a8` (D.1). Repo saat dikerjakan: HEAD `1a8ca23` (merge + `68de59c redesign hud referensi`, hanya file di `game/redesign-hud/` dan `referensi/`; `ef323a8` adalah ancestor; `gameplay.html` dan `gameplay/` tidak berubah sejak `ef323a8`).

## References
A (`1198ab7`, inventaris: `sword-use.mp3` ada tapi tak dipanggil; semua Power = satu `pop()`) → B (`9440d85`, P0 "Power satu pop sintetis", matriks Power) → C (`0bb04dd`, C07 Sword REUSE, C14 TNT explosion REUSE `creeper-explosion.mp3`, C13 TNT fuse NEW/NEEDS LISTENING, C08–C11 Feather/Potion/Grass/Totem NEW_ASSET_REQUIRED) → D.1 (`ef323a8`, Result audio; pola `FILE`+`sfx.*` tanpa fallback sintetis) → D.2 (ini).

## Scope
Hanya aktivasi audio 6 Power. Tidak menyentuh victory/defeat, Firework, Creeper, movement, ladder/snake, UI, multiplayer, `hud.js`. Efek/quantity/inventory/shield Power tidak diubah.

## Changes Made
- `game/gameplay/audio.js` (+4): `FILE.swordUse='powerup/sword-use.mp3'`, `FILE.tntExplosion='mob/creeper-explosion.mp3'`; `sfx.power(k)` = satu titik suara aktivasi: `sword` → file, `tnt` → file, selain itu `sfx.pop()` lama (bukan audio final, lihat BLOCKED). File gagal = senyap (tanpa fallback sintetis baru).
- `game/gameplay.html` (±1): di `usePU`, `sfx.pop()` → `sfx.power(k)` (satu-satunya trigger aktivasi, setelah `p.pu[k]--`).
- Tidak ada engine/SFX sistem baru; tidak ada audio baru; tidak ada penghapusan.
- Catatan path: prompt menyebut `powerup/creeper-explosion.mp3`; file itu tidak ada. Asset nyata ada di `game/assets/sfx/mob/creeper-explosion.mp3` (Stage C C14: shared explosion, tetap di `mob/`). Dipakai path nyata; tidak ada duplikat dibuat.

## Power Audio Matrix
| Power | Asset | Status | Synthetic Before | Synthetic After |
|---|---|---|---|---|
| Sword | `powerup/sword-use.mp3` (ada) | INTEGRATED (kecocokan bunyi NOT VERIFIED, belum didengar) | `pop()` | tidak ada |
| Feather | `powerup/feather-use.mp3` (tidak ada) | BLOCKED — MISSING asset | `pop()` | `pop()` (legacy, bukan final) |
| TNT (ledakan) | `mob/creeper-explosion.mp3` (ada, 3.9s) | INTEGRATED (shared; kecocokan NOT VERIFIED) | `pop()` | tidak ada |
| TNT Fuse | `mob/creeper-fuse.ogg` (kandidat 5.7s) / `powerup/tnt-fuse.mp3` (tidak ada) | BLOCKED / NEEDS LISTENING — tidak dipasang | tidak ada | tidak ada |
| Totem (activate) | `powerup/totem-activate.mp3` (tidak ada) | BLOCKED — MISSING asset | `pop()` | `pop()` (legacy) |
| Potion | `powerup/potion-use.mp3` (tidak ada) | BLOCKED — MISSING asset | `pop()` | `pop()` (legacy) |
| Grass | `powerup/grass-use.mp3` (tidak ada) | BLOCKED — MISSING asset | `pop()` | `pop()` (legacy) |
| Totem protect | `powerup/totem-protect.mp3` (tidak ada, P1) | NOT APPLICABLE (di luar D.2); `pop()` existing di jalur proteksi tidak diubah | `pop()` | `pop()` |

TNT: ledakan diputar saat aktivasi (satu SFX), sebelum `teleport(L,...)`; tidak ada suara di `teleport` sendiri (diperiksa, tanpa `sfx.*`), jadi tidak ada real+pop dobel. Fuse belum ada → jalur fuse→ledakan belum terbentuk; hanya ledakan.

## Computer Parity
Player: tombol → `usePU(k)`. Computer: `setTimeout` di giliran CPU → `usePU(k,true)` (hanya memilih Power valid via `cpuPUValid`). Keduanya melewati baris yang sama `sfx.power(k)`. Scheduler CPU tidak memanggil `sfx.*`. Tidak ada jalur audio khusus Computer, tidak ada fallback ganda. [CONFIRMED di kode, `gameplay.html` 3054–3062, 3129]

## Duplicate Audio Audit
- `sfx.power` hanya 1 call site (`usePU`). `usePU` tidak dipanggil dari render/`renderChips`/animasi/refresh; hanya klik tombol dan scheduler CPU.
- `giveChest` memanggil `sfx.chest()`/`chestClose()` + kartu hadiah (`feedback.js` `showPUCard` → `sfx.pop()`); itu event hadiah Chest, bukan aktivasi Power → di luar scope, tidak diubah.
- `sfx.pop` lain (gatherArena 2446, bite 3219, Villager 3290, shield protect 3271) bukan aktivasi Power; tidak diubah.
- Satu aktivasi = maksimal satu SFX: Sword = 1 file, TNT = 1 file, empat lainnya = 1 `pop()` legacy. Tidak ada real+`pop()` untuk Power berasset.
- Stub test (Audio di-mock): `power('sword')` → 1 pemutaran `powerup/sword-use.mp3`; `tnt` → 1 `mob/creeper-explosion.mp3`; feather/potion/totem/grass → 0 file (pop sintetis); muted → 0.

## Static Checks
- `node --check game/gameplay/audio.js`: PASS.
- Inline script `gameplay.html` (di-extract, `node --check`): PASS.
- Validasi path: 26 entri `FILE` semuanya ada di `assets/sfx/` (missing: none).
- `git diff --check`: PASS.
- Grep `sfx.pop|sfx.win|sfx.power|usePU|giveChest`: hasil seperti di atas.

## Regression Checks (statis)
Tidak ada perubahan pada efek Sword (`p.bonus=3`), Feather (`extra`), TNT (`teleport(L,max(1,pos-6))`), Totem (`shield`), Potion (`p4`), Grass (swap), `p.pu[k]--`, inventory, chest reward, turn/Computer turn, movement, victory/defeat (D.1 tidak disentuh). Perubahan hanya mengganti satu pemanggilan suara.

## Browser Test
NOT RUN.

## Remaining Blockers
Asset belum ada: `feather-use`, `potion-use`, `grass-use`, `totem-activate` (P0), `tnt-fuse` (P0; kandidat `creeper-fuse.ogg` perlu didengar), `totem-protect` (P1). Perlu didengar: `sword-use.mp3`, `creeper-explosion.mp3` (3.9s untuk TNT; panjang berpotensi menumpuk dengan giliran berikutnya, NOT VERIFIED).

## Conclusion
Status: **BLOCKED (sebagian)**. Sword dan TNT-ledakan terintegrasi; Feather/Potion/Totem/Grass/TNT-fuse menunggu asset.

## Next Stage
Setelah asset tersedia: lanjutan D.2 untuk Power yang diblokir, atau stage berikutnya sesuai instruksi.
