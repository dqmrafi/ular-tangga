/* Ular Tangga Blok - gameplay/maps/nether.js
   Satu file = satu map. Skrip klasik (tanpa import/export). Dimuat SETELAH gameplay/maps/registry.js
   dan SEBELUM gameplay/themes.js. Mendaftar lewat UT.Gameplay.Maps.register({...}).
   Isi definisi:
     theme     data tampilan (warna, langit, dekor, ...) - isi PERSIS seperti yang dulu di themes.js
     goal/boss petak akhir dan jenis fase boss (Nether = 120, Wither)
     board     fungsi pembuat papan sendiri (tanpa ini: papan serpentine 10x10)
     view      kotak tampilan kamera LOCK; props dekor; rules ular/tangga/chest/mob per map
     onlyMobs  mob yang hanya aktif di map ini (blaze). Dibaca config.js -> MOB_THEME_ONLY
   Urutan pendaftaran = urutan di THEMES (menentukan seed dunia dan tema default). */
(function (win) {
  'use strict';
  var UT = win.UT = win.UT || {}, G = UT.Gameplay = UT.Gameplay || {};
  if (!G.Maps) return;
  G.Maps.register({
    key: 'nether',
    onlyMobs: ['blaze', 'strider', 'magma_cube', 'piglin', 'piglin_brute', 'hoglin', 'zoglin', 'zombified_piglin'],
    goal: 120,
    boss: 'wither', /* fase Wither belum dibuat: sementara tiba di petak 120 = menang */
    view: { minX: -8.7, maxX: 9.8, minZ: -6.6, maxZ: 6.0 }, /* kotak yang harus terlihat utuh (area Start + seluruh papan) */
    rules: {
      ladders: { 5: 26, 23: 46, 47: 65, 66: 89, 86: 106, 100: 118 },
      snakes: { 28: 7, 45: 22, 64: 48, 84: 61, 102: 79, 114: 94 },
      chests: [9, 17, 33, 52, 57, 72, 92, 96, 110],
      mobs: [['zombified_piglin', [10, 36, 76]], ['blaze', [14, 55, 97]], ['magma_cube', [19, 69, 108]],
             ['ender', [31, 59, 91]], ['piglin_brute', [50, 112]], ['hoglin', [38, 74]],
             ['zoglin', [62, 101]], ['piglin', [43, 83]], ['strider', [12, 68, 95]]] /* strider = mob penolong: maju 3 petak */
    },
    props: [
      ["pillar",-2,-10,2.5],["pillar",-9,9,3],["pillar",-11.5,9,2],
      ["pillar",14,3,2],["pillar",-0.5,7,2.5],["pillar",-12,5.5,2.5],
      ["ghast",-9,9,-6],["ghast",10,11,-9],["ghast",3,10,7]
    ], /* dekor di atas lava: [jenis, x, z, ukuran] atau ['ghast', x, y, z] */
    /* Papan 120 petak: tiga jalan (tier) 13x3 di atas lava, disambung jembatan 1 petak di sisi bergantian.
       Tier 1 Crimson (1-39) -> jembatan 40 -> tier 2 Warped (41-79) -> jembatan 80 -> tier 3 Basalt (81-119) naik ke benteng; 120 = gerbang benteng.
       Mengembalikan [null, {n,row,col,x,z,h}, ...] (format sama dengan GameplayVoxelGeom.buildTiles). */
    board: function board() {
      var T = [null], n = 0;
      function put(x, z, h) { n++; T.push({ n: n, row: Math.round(4.5 - z), col: Math.round(x + 4.5), x: x, z: z, h: h }); }
      function wave(c, r, k, base) { return base + Math.round((Math.sin(c * 0.8 + r * 0.55) * 0.5 + 0.5) * k) * 0.2; }
      var C = 13;
      /* tiga tier jalan di atas lava: tiap tier 3 baris x 13 kolom, disambung 1 petak jembatan di sisi bergantian */
      function tier(z0, firstDir, base, k, rise) {
        for (var r = 0; r < 3; r++) {
          var dir = (r % 2 === 0) ? firstDir : -firstDir;
          for (var i = 0; i < C; i++) {
            var c = dir > 0 ? i : C - 1 - i, h = wave(c, r + Math.round(z0), k, base);
            if (rise && r === 2) h = Math.max(h, 0.2 * Math.min(4, Math.max(0, c - 4))); /* tanjakan menuju benteng */
            put(c - 4.5, z0 - r, Math.round(h * 10) / 10);
          }
        }
      }
      tier(4.5, 1, 0, 3, false);        /* 1-39   Crimson */
      put(7.5, 1.5, 0.2);               /* 40     jembatan kanan */
      tier(0.5, -1, 0.4, 2, false);     /* 41-79  Warped */
      put(-4.5, -2.5, 0.4);             /* 80     jembatan kiri */
      tier(-3.5, 1, 0, 2, true);        /* 81-119 Basalt + tanjakan benteng */
      put(8.5, -5.5, 1.0);              /* 120    gerbang benteng (Wither) */
      return T;
    },
    theme: {key:'nether',name:'Nether',skyTop:'#2a0606',skyBot:'#8a2410',
     tileA:0x8A2B2B,tileB:0x6E2222,ladderTile:0xFFD07A,snakeTile:0xFF7A3A,goalTile:0xE8B84A,
     wall:[0x5A1818,0x4A1212,0x6A1E1E,0x3A0D0D],deep:[0x2A0A0A,0x3A1010,0x1E0707],ground:0x7A2424,
     sw:['#8A2B2B','#3A0D0D'],label:'#FFE3B0',labelLine:'rgba(40,5,5,.9)',rail:0x2A1A12,rung:0x5A3A22,
     snakes:[[0xFF7A1A,0xFFD23F],[0xC0392B,0xFF9A5A],[0xE0561A,0xFFC070],[0x8A1E1E,0xFF8A5A],[0xFFA31A,0xFFE08A],[0xB02A2A,0xFF7A7A],[0xD8481A,0xFFB070]],
     hemi:0xFF8A5A,decor:'nether',snow:false,ember:0xFFA23A,cloud:0x6A2A22,flag:0x3AA8F0}
  });
})(window);
