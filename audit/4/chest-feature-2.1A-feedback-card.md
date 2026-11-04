FEATURE: Chest Feature 2.1A — Audit existing feedback card (Mob Hit / Power Hit / Chest Reward)

Jenis: AUDIT SAJA. Tidak ada kode game yang diubah. Satu-satunya file baru: dokumen ini.

Baseline:
6edfd67 (HEAD == origin/main saat audit dimulai; clone shallow depth 1, riwayat commit lama tidak diperiksa)

Metode:
Pembacaan kode statis (grep + baca fungsi) pada game/gameplay.html, game/gameplay/feedback.js, hud.js, module-bridge.js, audio.js, config.js.
TIDAK ADA yang dijalankan di browser. Tidak ada klaim PASS runtime. Semua temuan di bawah = hasil baca kode.

------------------------------------------------------------
RINGKASAN (koreksi asumsi awal)
------------------------------------------------------------
Ada DUA lapisan feedback di Gameplay, dan keduanya berbeda:

1. LEVEL 1 = banner/kartu kecil di HUD stack (UT.GameplayHUD, hud.js). Posisi: atas-tengah (top: 58px), non-blocking.
2. CARD TENGAH = elemen #puCard (gameplay.html:364), dikelola UT.GameplayFeedback (feedback.js). Posisi: tengah layar (fixed, top/left 50%).

Power Hit SAAT INI TIDAK memakai card tengah. Power (self maupun bertarget) memakai kartu Power di HUD stack (Level 1).
Komentar di gameplay.html:3708 menyatakan ini sengaja: "Power = feedback singkat (banner HUD), BUKAN kartu/modal hadiah Chest (#puCard)".
Card tengah hanya dipakai oleh: (a) Mob Hit cabang generik, (b) fallback serangan Dragon bila HUD tidak termuat, (c) showPUCard (kartu hadiah Chest lama) yang SEKARANG TIDAK ADA pemanggilnya.

------------------------------------------------------------
1. MOB FEEDBACK
------------------------------------------------------------
Notifikasi kecil (semua mob):
- fb('event','mob', teks, {gid}) -> UT.Gameplay.Feedback.event -> UT.GameplayHUD.showEvent('mob', ...) (hud.js:196) -> push() ke .ut-ghud stack. Ikon 👾, warna ungu (data-k=mob), ttl default 2000 ms.
- Call site (gameplay.html): Creeper 3895, Enderman 3901, Villager 3905, Skeleton 3908, mob generik 3913.
- Helper fb() ada di gameplay.html:3568 (routing ke Feedback.*, fallback ke hud('showEvent')).

Card tengah (HANYA cabang else / mob generik: Zombie, Warden, Blaze via MOB_BACK):
- gameplay.html:3914 -> showAttackCard(MOBNAME[k], p.name, 'hit', MOBNAME[k]+' menghantam '+p.name+' dan mundur '+bk+' blok.')
- Urutan di cabang itu: setMsg -> fb('event','mob') -> showAttackCard -> sfx.hit() + sfx.playerHurt() + hitBlastFx(p) -> sleep -> fly mundur.
- Creeper, Enderman, Villager, Skeleton TIDAK menampilkan card tengah (hanya banner + SFX masing-masing).

------------------------------------------------------------
2. EXISTING CENTER CARD
------------------------------------------------------------
DOM: gameplay.html:364
  <div id="puCard" class="pucard" hidden role="status" aria-live="polite"> #pcWho, #pcEmoji, #pcName, #pcDesc </div>
CSS: gameplay.html:215-227 (dasar) dan 274-277 (skin biru/emas: gradient, border-radius 26px, glow kuning).
  .pucard = position:fixed; left/top 50%; z-index:15; pointer-events:none; animasi pcin; kelas .pop -> pcpop (.35s). prefers-reduced-motion mematikan animasi.
  #pcEmoji .puimg = 84x84.
Fungsi tampil (UT.GameplayFeedback, game/gameplay/feedback.js):
- showPUCard(p, k)  — feedback.js:38. Kartu "<nama> membuka peti": spinner 9 ikon x 75 ms (dilewati bila reduce), sfx.rewardpower(), lalu nama+deskripsi Power dari PUN[k], sfx.pop(), tampil 1500 ms (900 ms bila reduce), lalu hidden. ASYNC (bisa di-await).
- showAttackCard(attacker, defender, weapon, desc) — feedback.js:48. pcWho = "attacker → defender", pcName = PUN[weapon][1] bila ada, kalau tidak teks weapon apa adanya, pcDesc = desc, ikon via setIco(em, weapon, '⚔️'), sfx.pop(), auto-hidden setTimeout 1600 ms. SINKRON (tidak mengembalikan promise).
Wrapper di gameplay.html: showPUCard 3672, showAttackCard 3673 (keduanya aman bila modul tidak termuat). Init dependensi: FBK.init({sfx, sleep, reduce}) di 3671.
Pemakai showAttackCard saat ini: mob generik (3914) dan fallback Dragon (3392, hanya jalan bila UT.GameplayHUD.showCombat tidak ada -> praktis tidak terpakai).

------------------------------------------------------------
3. POWER HIT EVENT (caller sebenarnya)
------------------------------------------------------------
Satu-satunya jalur: async function usePU(k, cpu) — gameplay.html ~3686-3717.
Urutan: validasi/tolak (tanpa konsumsi) -> p.pu[k]-- -> sfx.power(k) + setMsg (3696) -> puFx(...) -> efek per Power (3702-3704, di dalam try) -> blocked? -> feedback (3708-3716) -> busy=false.
Efek bertarget:
- sword (3702): askTotem(SW) ; bila TIDAK diblok -> hitBlastFx(SW), sfx.playerHurt(), fly(SW, max(1,SW.pos-2)).
- tnt   (3703): askTotem(L) ; bila tidak diblok -> teleport(L, max(1,L.pos-6)). Tidak ada hitBlastFx / playerHurt.
- grass (3704): askTotem(L) ; bila tidak diblok -> tukar posisi (teleport p dan L).
- blocked (Totem menahan) -> puFx 'pfx-shield' + sfx.pop() (3707).
Titik "target terkena Power" yang bisa dipakai sebagai event: tepat SETELAH blok try (setelah efek selesai, pos aktual sudah diperbarui), yaitu di 3708-3716 tempat feedback sekarang dipanggil. Data tersedia di situ: p (pelaku), SW/L (target), oldL/oldS (posisi lama), blocked, t/e (teks hasil aktual).
Feedback Power SAAT INI: fb('short', k, PUN[k][1], p.name, {gid, icon, desc: e}) (3715/3716) -> UT.Gameplay.Feedback.short -> UT.GameplayHUD.showPower (hud.js:207) -> powerCard di HUD stack (bukan card tengah), ttl default 2400 ms. Pesan tolak (Pedang/Totem saat fase Dragon) memakai opts.text -> satu baris banner.

------------------------------------------------------------
4. POWER HIT SFX
------------------------------------------------------------
Dipanggil saat Power dipakai, SEBELUM efek: sfx.power(k) (gameplay.html:3696 -> audio.js:94):
- sword -> fileSfx 'swordUse' = powerup/sword-use.mp3, vol 0.7
- tnt   -> fileSfx 'tntExplosion' = mob/creeper-explosion.mp3, vol 0.7 (aset ledakan dibagi dengan Creeper)
- Feather/Potion/Totem/Grass -> sfx.pop() (belum ada aset; komentar audio.js: BLOCKED)
Tambahan saat target kena: sword non-blok -> sfx.playerHurt() (3702). Diblok Totem -> sfx.pop() (3707).
Kartu Power HUD (showPower) TIDAK memainkan suara sendiri.
Catatan: showAttackCard memainkan sfx.pop() sendiri (feedback.js:55); showPUCard memainkan sfx.rewardpower() lalu sfx.pop() (feedback.js:44-45). sfx = UT.Gameplay.Audio.sfx (gameplay.html:3227), diinjeksi ke FBK lewat init.

------------------------------------------------------------
5. CHEST CURRENT FEEDBACK
------------------------------------------------------------
giveChest(p, tok) — gameplay.html ~3645-3667:
 openChest(n) + sfx.chest()  ->  sleep 550  ->  resolveChestReward()  ->  applyChestReward(p, rw, gid) mengembalikan {text}  ->  setMsg(p.name+' membuka peti: '+text)  +  fb('event','chest','Chest: '+text) (3662)  ->  sleep 900  ->  sfx.chestClose() + closeChest(n).
Jadi feedback Chest SEKARANG = banner HUD kecil (ikon invenotry.webp, ttl 2000) + setMsg. TIDAK ada card tengah.
Reward Presenter: showPUCard didaftarkan lewat fb('setRewardPresenter', showPUCard) di 3668, tetapi TIDAK ADA pemanggil fb('reward', ...) di gameplay.html HEAD (satu-satunya pemanggil ada di game/referensi/gameplay.old.html:1476). Jadi jalur kartu hadiah Chest lama = kode mati.
Selain itu showPUCard tidak cocok untuk reward baru: ia membaca PUN[k][1]/PUN[k][2] (hanya sword/feather/tnt/totem/potion_odd/potion_even/grass); id reward Chest (maju/mundur/lucky/dst.) tidak ada di PUN -> TypeError bila dipanggil apa adanya. Ia juga memakai spinner ikon Power + rewardpower.
SFX Chest yang sudah ada: sfx.chest() (open), sfx.chestClose(), sfx.pop() di reward tangga/ular (3641).

TEMUAN KONSISTENSI (tidak diubah):
config.js CHEST_POOL di HEAD = empty 15, maju 19, mundur 5, lucky 9, addroll 15, bonus 19, tangga 9, ular 9 (total 100%), dengan komentar "Coin/XP/Emerald dihapus; Ganjil/Genap jadi Power".
Dokumen audit/4/chest-feature-02-reward-pool.md (baseline 414fed4) mendeskripsikan pool berbeda (Coin, XP, Surprise, Odd, Even, Gems, ...). applyChestReward masih punya case coin/xp/gems tetapi pool HEAD tidak menghasilkannya. Perlu diputuskan pool mana yang berlaku sebelum desain label/ikon card Chest. Riwayat commit tidak diperiksa (clone shallow).

------------------------------------------------------------
6. REUSABLE FUNCTION
------------------------------------------------------------
- Elemen/CSS: #puCard + .pucard/.pop (sudah ada, gaya sudah selaras skin biru-emas).
- Fungsi: UT.GameplayFeedback.showAttackCard(attacker, defender, weapon, desc) dan showPUCard(p, k) (feedback.js), lewat wrapper gameplay.html:3672-3673.
- Routing: UT.Gameplay.Feedback.reward(...) -> presenter terdaftar (3668) sudah tersedia dan bisa dipanggil lewat fb('reward', ...).
- Helper ikon: UT.Gameplay.Config.setPuIcon(el, key, fallback) (config.js) — gambar bila ada di PUIMG, kalau tidak emoji.

------------------------------------------------------------
7. RECOMMENDED REUSE (Chest Reward -> card yang sama)
------------------------------------------------------------
Pakai #puCard yang sama, lewat jalur Feedback.reward yang sudah terdaftar (tanpa component/sistem baru).
Titik pasang: di giveChest, tepat di tempat fb('event','chest', ...) sekarang (gameplay.html:3662), setelah applyChestReward selesai dan res.text tersedia, sebelum sleep 900 dan sfx.chestClose. Reward sudah diterapkan saat itu, jadi card hanya presentasi.
Dua opsi, urut preferensi:
 A (disarankan, perubahan paling kecil): generalisasi ringan showPUCard di feedback.js supaya menerima teks siap pakai (who "<nama> membuka peti", name = label reward, desc = res.text, ikon chest) dan tidak membaca PUN untuk reward non-Power. Tetap satu elemen #puCard, satu fungsi, jalur fb('reward') yang sudah ada. Spinner + rewardpower bisa dipertahankan atau dilewati; keputusan SFX di 2.1B.
 B (tanpa mengubah feedback.js): showAttackCard(p.name, 'Chest', label, res.text). Kekurangan: pcWho jadi "Nama → Chest" (format serangan), ikon jatuh ke fallback '⚔️' (salah untuk chest).
Risiko yang harus ditangani di langkah implementasi:
 1. showAttackCard memakai setTimeout 1600 ms yang tidak dibatalkan: dua pemanggilan < 1600 ms (mis. mob lalu chest) membuat timer pertama menyembunyikan card kedua lebih awal. showPUCard tidak punya timer terpisah (hide setelah await sleep), tetapi juga tidak membatalkan pemanggilan sebelumnya. Satu #puCard dipakai bersama.
 2. showAttackCard sinkron (tidak bisa di-await); showPUCard bisa di-await. Durasi card (1500-1600 ms) lebih panjang dari jeda 900 ms sebelum chestClose; pilih apakah giveChest menunggu card.
 3. Tidak ada guard gid/stale di FBK (HUD punya stale(o)); bila game di-reset saat card tampil, card tetap hilang sendiri lewat timer.
 4. Aturan SFX: showAttackCard memakai sfx.pop, showPUCard memakai rewardpower+pop. Chest sudah memainkan sfx.chest/chestClose sendiri; hindari suara ganda.
 5. Banner HUD 'chest' (3662) bisa dipertahankan atau diganti card; keputusan desain 2.1B. Jangan dobel tanpa sengaja.
 6. Selesaikan dulu konsistensi pool (lihat TEMUAN KONSISTENSI) agar label/ikon reward di card sesuai pool yang berlaku.

------------------------------------------------------------
Yang TIDAK diverifikasi
------------------------------------------------------------
- Tampilan/animasi/timing card di browser: belum dijalankan.
- Perilaku SFX saat runtime (file audio ada/tidak, volume): belum didengar.
- Alur CPU vs manusia untuk card Chest: hanya dibaca dari kode.

------------------------------------------------------------
Log
------------------------------------------------------------
- Stage: Chest Feature 2.1A (audit only). Kode game: TIDAK diubah.
- Catatan log: .agent/stages/ hanya berisi log stage lama (terakhir 4.2.1-camera-angle.md); belum ada log Chest Feature di sana (Chest Feature 01 dan 02 dicatat di audit/4/). Karena itu log 2.1A dicatat di dokumen ini, tidak membuat file log baru.
- Commit: docs(audit): map existing gameplay feedback card
- Berikutnya (BUKAN bagian 2.1A): 2.1B desain/implementasi card Chest setelah keputusan opsi A/B dan pool reward.
