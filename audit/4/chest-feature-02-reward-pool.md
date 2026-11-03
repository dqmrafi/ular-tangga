FEATURE: Chest Feature 2 — Reward Pool

Baseline:
414fed4 (HEAD saat mulai: c31111e "design new", hanya menambah 2 gambar di game/referensi; kode identik dengan baseline)

Sumber verifikasi:
- Harness logika (Claude, Node + stub): audit/4/chest-feature-02-harness.js, 70/70 cek lolos. Menjalankan KODE ASLI: item-catalog.js, player-data.js, config.js, serta fungsi chest/doRoll/playTurn yang diekstrak langsung dari game/gameplay.html (bukan salinan). Hanya bagian 3D/DOM/audio yang di-stub.
- Uji mutasi harness: 10 kerusakan sengaja (bobot salah, clamp dihapus, flag tak direset, Odd jadi genap, XP tak tersimpan, Chest memanggil startPU, Add Roll tanpa extra, reward 2x, CPU dapat currency, Surprise memicu tangga) -> semuanya terdeteksi (harness gagal pada tiap mutasi).
- Game 3D asli di browser: BELUM DIUJI. Claude tidak dapat menjalankan Three.js (CDN diblokir di lingkungannya). Lihat "Belum terverifikasi".

Reward Pool:
PASS (9 reward; bobot = Empty 10, Coin 22, XP 13, Surprise 10, Odd 15, Even 15, Lucky 7, Gems 0.5, Add Roll 7.5; total 1000/1000 = 100%; resolver terverifikasi dengan enumerasi 1000 slot; pool rusak -> fallback aman "Kosong")

XP Minimal:
PASS (PlayerData.xp default 0; grant({xp}) ditambahkan; tersimpan di localStorage dan bertahan setelah load ulang; save lama tanpa xp -> 0; grant lama tidak berubah; tanpa level/bar/UI XP; profile/lobby tidak diubah)

Coin:
PASS (+5 via PlayerData.grant; CPU tidak mendapat currency)

Gems/Emerald:
PASS (+1 via grant({gems:1}); tidak ada field "emerald")

Surprise:
PASS (99 posisi x 6 langkah: target selalu 1..99; memakai walk existing; 7 kasus lewat playTurn asli: mendarat tepat di kepala Ular, kaki Tangga, dan petak mob tanpa memicu apa pun)

Odd Dice:
PASS (300 percobaan: hanya 1/3/5, ketiganya muncul; flag reset; roll kedua normal)

Even Dice:
PASS (300 percobaan: hanya 2/4/6, ketiganya muncul; flag reset; roll kedua normal)

Lucky 6:
PASS (300 percobaan: selalu 6; flag reset; roll kedua normal)

Add Roll:
PASS (lewat playTurn asli: hasil roll normal diterapkan, giliran sama dilanjutkan via p.extra -> beginTurn(true), p.extra dipakai sekali)

Power Excluded:
PASS (tidak ada entri Power di pool; kode Chest tidak mereferensikan usePU/puFx/startPU/showPUCard/PUN/inventori Power; dinamis: 9 reward + 200 siklus giveChest = 0 panggilan Power; kode Power tidak diubah)

Reward Once:
PASS (trigger bersamaan dan token sama ditolak; 1 lifecycle = 1 reward; game direset di tengah proses -> stale tanpa reward; landing berikutnya tetap bekerja)

10K Distribution:
PASS (10.000 resolusi, 0 invalid, 0 Power; tiap reward dalam 4 sigma dari target)
  Seed 20261103 (reproducible): Empty 1035, Coin 2167, XP 1254, Surprise 1013, Odd 1523, Even 1498, Lucky 720, Gems 52, Add Roll 738
  Math.random (tanpa seed):      Empty 1037, Coin 2149, XP 1304, Surprise 982, Odd 1507, Even 1520, Lucky 703, Gems 58, Add Roll 740

Gameplay Regression:
PASS pada tingkat logika (playTurn/doRoll asli dengan stub): turn, dadu normal 1..6, dadu 6 dapat roll lagi, movement, Ladder, Snake, Chest guard, Potion (p4) utuh, CPU di Chest.
BELUM TERVERIFIKASI pada game 3D asli (visual, animasi, SFX, HUD).

Keputusan desain / catatan perilaku:
- Pool disimpan di UT.Gameplay.Config.CHEST_POOL sebagai bobot persen x10 (agar 0.5% dan 7.5% jadi bilangan bulat; total harus 1000).
- Flag dadu Chest (p.odd / p.even / p.lucky) eksklusif: reward dadu terbaru menggantikan yang lama. Satu roll mereset semuanya.
- Flag Chest didahulukan di doRoll; Potion (p.p4) tidak ikut terpakai pada roll itu dan tetap tersedia. Special Dice di Block 100 tetap diutamakan.
- Lucky 6 melewati alur dadu normal, jadi tetap dihitung pada aturan "tiga kali 6 berturut-turut" dan tetap memberi roll tambahan (perilaku dadu 6 existing, tidak diubah).
- Surprise yang ter-clamp ke petak yang sama (mis. di petak 1 dengan -2) = tidak bergerak; feedback "Tidak bergerak".
- Reward +5 skor sementara dari Feature 1 diganti oleh reward pool.
- Flag Odd/Even/Lucky belum punya chip di daftar pemain (renderChips tidak diubah agar baris buff Power tidak tersentuh); pemain diberi tahu lewat feedback saat reward. Bisa ditambah sebagai tugas terpisah.
- Harness hanya ada di audit/4/, tidak dimuat game, bukan sistem gameplay.

Belum terverifikasi (perlu pemilik proyek, di browser):
- Chest dibuka -> reward tampil di HUD/pesan -> Chest menutup (tampilan, urutan, SFX).
- Surprise: animasi hop maju/mundur terlihat wajar dan kamera mengikuti.
- Satu putaran penuh vs CPU: Odd/Even/Lucky/Add Roll terasa benar.

Commit:
06acb41 "stage4: add chest reward pool" (implementasi + harness) di branch stage4-chest-feature-02-unverified. Commit audit ini mengikuti.

Push:
SUCCESS (branch stage4-chest-feature-02-unverified; 06acb41 terverifikasi di origin). main TIDAK diubah (tetap c31111e) sampai pemilik proyek menguji di browser dan mengonfirmasi.

LOCAL HEAD == REMOTE HEAD:
PASS (diverifikasi untuk 06acb41 via git rev-parse HEAD dan git ls-remote)

WORKTREE:
CLEAN
