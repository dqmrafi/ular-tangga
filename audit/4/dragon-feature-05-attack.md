# DRAGON WORLD FEATURE 5 — DRAGON ATTACK

Scope: pemain READY (Crystal 1-4 selesai) boleh menyerang Dragon dengan Special Dice. TIDAK ada reward / final victory baru.

## Alur
Crystal 4 hancur -> `p.ready=true` (Feature 3) -> giliran berikutnya pemain itu: tahan & lepas Roll (Special Dice, Feature 4) -> angka 1-6 -> `playTurn` cabang Block 100 -> `hitDragon(p,v)` existing -> hasil mengikuti logika existing.

## Perubahan (kecil, tanpa sistem combat baru)
- `canAttackDragon(p)`: true hanya bila `p.ready && p.crystal>=4 && p.pos===100 && AWK.done && !AWK.running && !gameOver`.
- `hitDragon` mendapat guard di awal: pemain yang tidak memenuhi `canAttackDragon` tidak melukai Dragon (tanpa damage, tanpa animasi).
- `playTurn`: bila pemain di Block 100 belum boleh menyerang dan tidak lewat jalur crystal (state tak valid), giliran dilanjutkan tanpa serangan.
- Tidak diubah: damage (angka x `DMG`=5), HP per pemain (`p.dhp`, 100), combat strip HUD, animasi/SFX serangan, bonus giliran tambahan (angka 6 / `p.extra`), Dragon tetap di atas Block 100 (posisi hasil Awakening).

## Aturan terpenuhi
- Hanya READY yang menyerang: pemain belum READY memakai jalur crystal (Feature 3) dan di-guard di `hitDragon`.
- Angka serangan pemain manusia = Special Dice (hold-release). Klik normal diabaikan saat mode khusus aktif.
- Pemain lain tetap berjalan: serangan hanya mengubah `p.dhp` milik penyerang; `nextTurn` normal; pemain di luar Block 100 bergerak seperti biasa; progress crystal pemain lain tidak disentuh.
- Dragon tetap berada di Block 100 sampai aturan existing menentukannya.

## PERLU DIPUTUSKAN (catatan jujur)
- Aturan existing: bila `p.dhp<=0`, `hitDragon` memainkan "Ender Dragon kalah!" (naga tenggelam/hilang, konfeti), lalu `celebrate` + `finishGame` (layar menang, +50 skor). Ini kode LAMA, tidak ditambah/diubah di fitur ini. Karena diminta "jangan implement reward/final victory dulu" tetapi juga "ikuti aturan existing", jalur ini dibiarkan apa adanya. Bila ingin ditahan sampai fitur berikutnya, cukup tambahkan flag di cabang `p.dhp<=0` (belum dilakukan).
- CPU tidak punya kontrol tahan-lepas: CPU READY tetap memakai dadu acak existing (CPU tidak termasuk Special Dice di Feature 4). AFK auto-roll pemain manusia juga tetap acak (fallback agar giliran tidak macet).

## Test
- Syntax 4 skrip inline: PASS.
- Smoke test logika (Node, cabang `playTurn` + `hitDragon` asli dengan stub visual): belum READY tidak melukai Dragon; READY angka 3 -> 15 damage (HP 85), HP pemain lain tetap 100; angka 6 -> giliran tambahan; `canAttackDragon` benar hanya untuk READY di Block 100; HP naga 0 -> `finishGame` existing; state tak valid ditolak guard: PASS (6/6).
- BELUM diverifikasi: browser/Android (alur penuh crystal -> READY -> serang dengan tahan-lepas), multi-pemain nyata, tampilan combat strip, regresi giliran/power/pause/AFK. Perlu dicek manual.

Files changed: game/gameplay.html, audit/4/dragon-feature-05-attack.md
Tidak diubah: dadu, kamera, board/tile/gerak, Awakening, crystal progression, special dice
