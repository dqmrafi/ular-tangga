/* Ular Tangga Blok — gameplay/themes.js (Stage 4.1.14.3: extract gameplay themes data)
   Skrip klasik (tanpa import/export/type=module). Dimuat SETELAH gameplay/module-bridge.js
   dan SEBELUM blok skrip gameplay inline.
   HANYA data tema statis. Tidak ada THREE, DOM, RNG, localStorage, timer, atau state gameplay di sini.
   Dipindahkan APA ADANYA dari gameplay.html (isi object, property, nilai, dan URUTAN array tidak diubah).
   CATATAN: tema aktif sementara hanya World & Nether (rumput/gurun/salju/hutan dihapus sementara, ada di git history).
   URUTAN WAJIB TETAP: gameplay.html memakai THEMES.indexOf(th) untuk seed dunia (20241022 + index * 977)
   dan THEMES[0] sebagai tema default. Jangan sort/reorder/rename/tambah/hapus tema tanpa memperhitungkan itu.
   Namespace: UT.Gameplay.Themes (slot object dari module-bridge.js, tidak ditimpa).
   API:  UT.Gameplay.Themes.LIST   Array<theme>  — array yang sama persis dengan THEMES lama
   Idempotent: aman dimuat lebih dari sekali, tidak menimpa LIST yang sudah terisi. */
(function (win) {
  'use strict';
  var UT = win.UT = win.UT || {};
  var G = UT.Gameplay = UT.Gameplay || {};
  var T = G.Themes = G.Themes || {};

  T.LIST = T.LIST || [
  {key:'minecraft',name:'World',skyTop:'#6EC6FF',skyBot:'#E6F7FF',
   tileA:0x5A9E3C,tileB:0x5A9E3C,ladderTile:0xE2BE3C,snakeTile:0xD9577A,goalTile:0xE6E3A6,
   wall:[0x8A5B33,0x7B4E2B,0x946339,0x6B4424],deep:[0x7A7A7A,0x6A6A6A,0x8A8A8A],ground:0x4A8F33,
   sw:['#5FAE3E','#8A5B33'],label:'#FFFFFF',labelLine:'rgba(0,0,0,.85)',rail:0x6B4423,rung:0xB07A42,
   snakes:[[0x45C94B,0x1E6B22],[0x7BD96A,0x2E7D32],[0x3FB950,0x145A1E],[0x66CC55,0x2A7A2A],[0x55D060,0x1B6B2B],[0x8FE070,0x3A8A2A],[0x2FAF45,0x105A20]],
   hemi:0xA8D08D,decor:'mc',snow:false,cloud:0xFFFFFF,flag:0xF0453A},
  {key:'nether',name:'Nether',skyTop:'#2a0606',skyBot:'#8a2410',
   tileA:0x8A2B2B,tileB:0x6E2222,ladderTile:0xFFD07A,snakeTile:0xFF7A3A,goalTile:0xE8B84A,
   wall:[0x5A1818,0x4A1212,0x6A1E1E,0x3A0D0D],deep:[0x2A0A0A,0x3A1010,0x1E0707],ground:0x7A2424,
   sw:['#8A2B2B','#3A0D0D'],label:'#FFE3B0',labelLine:'rgba(40,5,5,.9)',rail:0x2A1A12,rung:0x5A3A22,
   snakes:[[0xFF7A1A,0xFFD23F],[0xC0392B,0xFF9A5A],[0xE0561A,0xFFC070],[0x8A1E1E,0xFF8A5A],[0xFFA31A,0xFFE08A],[0xB02A2A,0xFF7A7A],[0xD8481A,0xFFB070]],
   hemi:0xFF8A5A,decor:'nether',snow:false,ember:0xFFA23A,cloud:0x6A2A22,flag:0x3AA8F0}
  ];
})(window);
