# DRAGON WORLD FEATURE 4 — SPECIAL DICE CONTROL

Scope: kontrol dadu tahan-lepas untuk fase End Crystal dan fase serang Dragon. TIDAK ada Dragon Attack baru.

## Cara kerja
- Mode aktif (`specialDiceActive`) hanya bila pemain manusia (bukan CPU) sedang giliran, `pos===100`, `AWK.done`, game belum selesai. Mencakup fase Crystal (`!p.ready`) dan fase serang Dragon (`p.ready`).
- Tekan & tahan tombol Roll: angka dadu existing berputar 1>2>3>4>5>6>1... tiap 170 ms (`showDie(v,false)`, tick SFX `shuffleTick`). Lepas: angka saat itu dipilih -> `doRoll({value})`.
- `doRoll` existing diperluas dengan parameter opsional `value` (hanya dipakai bila mode khusus aktif); seluruh alur setelahnya (animasi dadu, aturan tiga kali 6, `playTurn`, `crystalRoll`, cabang `hitDragon` existing) tidak berubah. Tidak ada sistem dadu baru; `UT.GameplayDiceUI` tidak diubah.
- Crystal: target tetap n -> angka n; benar = hancur, salah = tidak ada progress (logika Feature 3). Pemain READY: angka dipilih lalu cabang `hitDragon` existing berjalan apa adanya (Dragon Attack baru belum dikerjakan).
- Dadu normal tetap: pemain di luar Block 100, CPU, dan AFK auto-roll memakai klik + angka acak seperti sebelumnya (handler `click` hanya mengabaikan klik saat mode khusus aktif, karena pointer/keyboard sudah menangani).
- Power Potion (dadu 4-6) tidak dikonsumsi/dipakai saat angka dipilih lewat mode khusus (angka sudah ditentukan pemain).
- Label tombol: "Tahan & lepas" (mode khusus), "Lepas untuk memilih" (saat ditahan), "Roll dadu" (normal). Pesan petunjuk di `beginTurn` menyebut target Crystal.

## Anti-stuck (Pointer Events)
- `pointerdown` (tombol utama; klik kanan mouse diabaikan; `setPointerCapture`), `pointerup`, `pointercancel`, `lostpointercapture` pada tombol; fallback `pointerup/pointercancel` di window (capture) bila lepas di luar tombol; `blur` window/tombol, `visibilitychange` (tab hidden), `contextmenu` diblokir; `touch-action:none`, `user-select:none`, `-webkit-touch-callout:none` pada tombol.
- Hanya pointerId yang memulai hold yang dihitung; pointerdown kedua tidak menimpa.
- Watchdog pada interval putar: bila game baru, jeda, busy, awakening, tombol disabled, atau giliran bukan lagi mode khusus -> hold dibatalkan tanpa memilih. `doRoll` juga memanggil `holdEnd(false)` bila hold tersisa.
- Batal (cancel) = tidak ada roll, label kembali, timer AFK dimulai lagi. Timer AFK dihentikan selama hold agar tidak auto-roll saat ditahan.
- Keyboard (aksesibilitas): Space/Enter tahan = putar, lepas = pilih.

## Test
- Syntax 4 skrip inline: PASS.
- Smoke test logika (Node, event palsu): hold aktif di Block 100; urutan 1>2>3>4>5>6>1; pointerup memilih angka saat itu -> `doRoll({value})`; pointercancel, lostpointercapture, blur, tab hidden batal tanpa roll; pointerup di luar tombol (window) tetap memilih; pointer lain diabaikan; watchdog busy/game baru membatalkan; pointerdown kedua tidak menimpa; pos<100, CPU, tombol disabled, klik kanan tidak masuk mode khusus; keyboard Space: PASS (18/18).
- BELUM diverifikasi: perangkat Android/browser sungguhan (sentuh tahan, gesture sistem, perilaku long-press), tampilan label tombol di semua ukuran HUD, regresi dadu normal/giliran/power/pause/AFK secara interaktif. Perlu dicek manual.

Files changed: game/gameplay.html, audit/4/dragon-feature-04-special-dice.md
Tidak diubah: gameplay/dice-ui.js, board/tile/gerak, kamera, logika crystal & Dragon existing
