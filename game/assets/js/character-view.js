/* Tampilan karakter 3D bersama (Lobby, Inventory, Shop, Profil, Teman, Leaderboard, Hadiah Harian).
   Satu sumber model = UT.CharacterData (diekstrak dari gameplay.html), jadi karakter di semua halaman sama dengan gameplay.
   Menggantikan fungsi character(sk, emote) yang dulu diduplikasi di tiap halaman.
   Butuh: assets/js/character-data.js (dan three.js yang dikirim lewat argumen THREE).

   UT.CharacterView.make(THREE, skinIdOrKey, emote) -> THREE.Group, userData.anim(t) siap dipanggil tiap frame
     skinIdOrKey : 'skin.steve' | 'steve' | palet dari ItemArt.palette (memakai .gameKey); tak dikenal -> steve
     emote       : 'idle' (default) | 'wave' | 'dance' | 'victory' | 'cheer' | 'laugh'
   Model adalah satu mesh (tanpa sendi), jadi emote berupa gerak seluruh badan: naik-turun, miring, memutar, melompat.
   Ukuran: 1 satuan gameplay = SCALE satuan halaman (kaki di y = FEET). Karakter lebih tinggi (Enderman) tetap lebih tinggi. */
(function (win) {
  'use strict';
  var UT = win.UT = win.UT || {};
  if (UT.CharacterView) return;

  var SCALE = 6.6, FEET = 0.3, DEFAULT_KEY = 'steve';

  function keyOf(x) {
    var k = x && typeof x === 'object' ? x.gameKey : x;
    if (typeof k === 'string' && k.indexOf('skin.') === 0) k = k.slice(5);
    var CD = UT.CharacterData;
    return CD && k && CD.get('player', k) ? k : DEFAULT_KEY;
  }

  function make(THREE, skin, emote) {
    var CD = UT.CharacterData, g = new THREE.Group();
    var m = CD && CD.mesh(THREE, 'player', keyOf(skin), { scale: SCALE });
    if (!m) { g.userData.anim = function () {}; return g; } /* data karakter tidak ada: kosong, bukan error */
    m.position.y = FEET;
    m.traverse(function (o) { if (o.isMesh) { o.castShadow = true; o.receiveShadow = false; } });
    g.add(m);
    var kind = emote || 'idle';
    g.userData.anim = function (t) {
      var s = Math.sin, y = 0, rz = 0, ry = 0, sy = 1;
      if (kind === 'wave')    { rz = s(t * 6) * 0.07; ry = s(t * 0.7) * 0.12; }
      else if (kind === 'dance')   { y = Math.abs(s(t * 5)) * 0.35; rz = s(t * 5) * 0.12; ry = s(t * 2.5) * 0.5; }
      else if (kind === 'victory') { y = Math.abs(s(t * 4)) * 0.45; rz = s(t * 8) * 0.06; }
      else if (kind === 'cheer')   { y = Math.abs(s(t * 6)) * 0.5; rz = s(t * 12) * 0.08; }
      else if (kind === 'laugh')   { y = Math.abs(s(t * 14)) * 0.08; sy = 1 + s(t * 14) * 0.02; rz = s(t * 7) * 0.04; }
      else                         { y = s(t * 2) * 0.05; sy = 1 + s(t * 2) * 0.012; ry = s(t * 0.7) * 0.12; rz = s(t * 0.9) * 0.03; }
      m.position.y = FEET + y; m.scale.y = SCALE * sy; m.rotation.set(0, ry, rz);
    };
    return g;
  }

  UT.CharacterView = { make: make, keyOf: keyOf, SCALE: SCALE };
})(window);
