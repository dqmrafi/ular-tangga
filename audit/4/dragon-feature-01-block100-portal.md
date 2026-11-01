# DRAGON WORLD FEATURE 1 — BLOCK 100 PORTAL

Scope: hanya visual Block 100 + trigger saat ada pemain di petak 100. Tidak ada Dragon Awakening.

Block 100 portal visual (dasar hitam, bintik energi, denyut, glow halus): PASS (kode + logika diuji; tampilan di browser BELUM diverifikasi visual)
Dormant (sangat subtle, naga & End Crystal tidak muncul): PASS (uji logika dengan THREE asli)
Trigger saat pemain mencapai 100 (efek menguat, End Crystal muncul): PASS (uji logika)
Reset saat tidak ada pemain di 100 / game baru: PASS (uji logika)
Dragon hidden sebelum Block 100: PASS
Board / tile number / tile position / movement / dice / turn / snake / ladder / HUD / camera tidak diubah: PASS (diff hanya menyentuh gameplay.html pada blok portal, pembuatan tile 100, visibilitas naga, dan 1 panggilan update per frame)
Performance: PASS (1 InstancedMesh 46 instance, geometri+material bersama, 2 bidang glow, 1 kristal; tanpa lampu dinamis; tanpa rnd() dunia sehingga dekorasi dunia tidak bergeser)

## Perilaku
- Tile 100: 4x4 kotak gelap (#0A0712/#120B1E) + rim ungu tipis, posisi/ukuran sama dengan tile lain. Bendera di petak 100 tetap.
- Dormant: bintik cyan/magenta/ungu/putih berkedip pelan, glow & ring sangat redup.
- Aktif (ada pemain dengan pos === 100): glow dan ring menguat, sebagian bintik naik seperti energi, End Crystal (voxel, magenta + cangkang cyan) muncul melayang dan berputar.
- Aktif juga menampilkan naga existing (tepi naik, tanpa animasi awakening) supaya pertarungan existing di petak 100 tetap berjalan. Awakening sebenarnya = fitur berikutnya.

## Catatan keputusan
- Trigger dibaca dari state `players[].pos === 100` di loop frame (deteksi tepi untuk naga), bukan dengan mengubah alur gerak/giliran.
- Naga existing dibuat `visible=false` sejak awal dan di `resetDragon()`; pertarungan existing tidak diubah.

## Test yang dijalankan
- Syntax: semua 4 skrip inline gameplay.html valid.
- Logika portal (THREE r128 asli, tanpa WebGL): dormant -> aktif -> reset; kristal, naga, glow, tanpa nilai NaN.
- BELUM dijalankan: render nyata di browser/Android, regresi interaktif (dadu, giliran, ular, tangga, power, chest, mob, AFK), kamera. Perlu dicek manual.

Files changed: game/gameplay.html, audit/4/dragon-feature-01-block100-portal.md
Files untouched: game/gameplay/voxel-geom.js (posisi tile), game/gameplay/*.js lain, HUD, kamera, semua halaman lain
