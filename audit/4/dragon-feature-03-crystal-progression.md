# DRAGON WORLD FEATURE 3 — END CRYSTAL PROGRESSION

Scope: progress 4 End Crystal per player + status READY. TIDAK ada Dragon Attack baru, TIDAK ada Special Dice Control.

## Aturan
- Setelah Dragon Awakening ada 4 End Crystal di 4 sudut Dragon Arena (bernomor 1-4, searah jarum jam dari kiri-atas). Crystal tunggal di atas tower (Feature 2) menghilang di akhir awakening dan digantikan keempatnya.
- Progress disimpan per player: `p.crystal` (0..4) dan `p.ready`. Dibuat di `startGame` (0/false), jadi reset tiap game baru.
- Pemain yang berada di Block 100 dan belum READY: lemparan dadunya dibandingkan dengan target `p.crystal+1`. Cocok -> crystal itu hancur, `p.crystal++`. Tidak cocok -> tidak ada progress (tidak mundur, tidak melompat).
- Harus berurutan: crystal n hanya hancur dengan angka n.
- Crystal 4 hancur -> `p.ready=true` (chip pemain: Crystal x/4 berubah jadi Naga + bar HP; pesan + banner "READY menyerang Dragon").
- Progress pemain lain tidak disentuh (hanya `p` yang dilempar yang diubah).
- Tampilan crystal mengikuti pemain yang sedang giliran (`syncCrystals` di `beginTurn`): crystal yang sudah dihancurkan pemain itu hilang, target aktif berdenyut; pemain di luar Block 100 melihat semua crystal utuh. Ini hanya presentasi dari state per-player, bukan state global.
- Aturan giliran tidak diubah: angka 6 / `p.extra` tetap memberi giliran tambahan seperti cabang Dragon existing.

## Catatan
- Pemain yang sudah READY memakai cabang `hitDragon` existing apa adanya (tidak diubah/ditambah). Dragon Attack baru & Special Dice Control belum dikerjakan. Power Feather (dadu 4-6) dan power lain yang sudah ada tetap berlaku pada lemparan crystal; tidak ada kontrol dadu baru.
- Crystal yang dihancurkan: flash + SFX sintetis `sfx.crystalBreak()` (audio.js); crystal salah angka: pesan + `sfx.bounce`.
- Perubahan Feature 2: setelah awakening, `applyArenaState` tidak lagi menyisakan crystal tower (`A.crystal=0`, `A.energy=0`).

## Test
- Syntax 4 skrip inline gameplay.html + audio.js: PASS.
- Smoke test logika (Node + THREE r128 asli, tanpa WebGL): 4 crystal muncul setelah awakening; angka salah (2, 4 saat target 1) tanpa progress; urut 1->2->3->4; crystal 2 tidak hancur dengan angka 1; player B maju sendiri tanpa mengubah A; pemain lain tidak READY; tampilan crystal mengikuti progress pemain giliran (A, B, pemain di luar 100); A READY setelah crystal 4; reset game baru: PASS.
- BELUM diverifikasi: render nyata di browser/Android (posisi/label crystal, efek hancur), alur penuh playTurn/doRoll interaktif, chip HUD di layar kecil, regresi dadu/giliran/power/pause/CPU. Perlu dicek manual.

Files changed: game/gameplay.html, game/gameplay/audio.js, audit/4/dragon-feature-03-crystal-progression.md
Tidak diubah: board/tile/gerak/ular/tangga, kamera, voxel-geom.js
