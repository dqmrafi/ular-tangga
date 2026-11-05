/* Ular Tangga Blok - gameplay/maps/nether.js
   Satu file = satu map. Skrip klasik (tanpa import/export). Dimuat SETELAH gameplay/maps/registry.js
   dan SEBELUM gameplay/themes.js. Mendaftar lewat UT.Gameplay.Maps.register({...}).
   Isi definisi:
     theme     data tampilan (warna, langit, dekor, ...) - isi PERSIS seperti yang dulu di themes.js
     onlyMobs  mob yang hanya aktif di map ini (blaze). Dibaca config.js -> MOB_THEME_ONLY
   Urutan pendaftaran = urutan di THEMES (menentukan seed dunia dan tema default). */
(function (win) {
  'use strict';
  var UT = win.UT = win.UT || {}, G = UT.Gameplay = UT.Gameplay || {};
  if (!G.Maps) return;
  G.Maps.register({
    key: 'nether',
    onlyMobs: ['blaze'],
    theme: {key:'nether',name:'Nether',skyTop:'#2a0606',skyBot:'#8a2410',
     tileA:0x8A2B2B,tileB:0x6E2222,ladderTile:0xFFD07A,snakeTile:0xFF7A3A,goalTile:0xE8B84A,
     wall:[0x5A1818,0x4A1212,0x6A1E1E,0x3A0D0D],deep:[0x2A0A0A,0x3A1010,0x1E0707],ground:0x7A2424,
     sw:['#8A2B2B','#3A0D0D'],label:'#FFE3B0',labelLine:'rgba(40,5,5,.9)',rail:0x2A1A12,rung:0x5A3A22,
     snakes:[[0xFF7A1A,0xFFD23F],[0xC0392B,0xFF9A5A],[0xE0561A,0xFFC070],[0x8A1E1E,0xFF8A5A],[0xFFA31A,0xFFE08A],[0xB02A2A,0xFF7A7A],[0xD8481A,0xFFB070]],
     hemi:0xFF8A5A,decor:'nether',snow:false,ember:0xFFA23A,cloud:0x6A2A22,flag:0x3AA8F0}
  });
})(window);
