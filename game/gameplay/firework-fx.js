/* Firework Visual Core (Stage 4.1.23.1) — satu burst kembang api voxel: CORE FLASH → MAIN RADIAL BURST → FADE.
   Hanya memakai UT.ParticleFX.burstAt (engine 4.1.22): layer #fx-layer, batas partikel, cleanup animationend, dan guard reduced-motion semua milik engine.
   Tidak membuat engine/layer/listener/timer sendiri; tanpa rAF/interval; hanya transform+opacity (lewat CSS engine). Fade = akhir animasi engine.
   BELUM terhubung ke gameplay: tanpa SFX, tanpa trigger victory/reward, tanpa launch/trail, tanpa secondary burst (sub-stage berikutnya).
   Classic script. Namespace: UT.FireworkFX. API: burstAt(x, y, opts) · burstFromElement(el, opts) — return jumlah partikel yang dibuat (0 bila tidak ada engine/reduced-motion).
   opts: count (8–16, default 12) · colors[] · distance (default 64) */
(function (win) {
  'use strict';
  var UT = win.UT = win.UT || {};
  if (UT.FireworkFX) return;

  /* Palet voxel (acuan visual: palet "victory" pada folder referensi visual; nilai disalin, BUKAN dibaca saat runtime).
     rgba memberi variasi opacity visual antar-partikel tanpa mengubah engine. */
  var PALETTES = [
    ['#fff3a3', '#ffd451', '#f7a7ff', '#78e7ff', '#8fffb6'],
    ['#fff3a3', '#ffd451', '#ff9d38', 'rgba(255,212,81,.8)'],
    ['#78e7ff', '#9af8ff', '#ffffff', 'rgba(120,231,255,.8)'],
    ['#f7a7ff', '#dca8ff', '#fff3a3', 'rgba(247,167,255,.8)']
  ];

  function engine() { return UT.ParticleFX && typeof UT.ParticleFX.burstAt === 'function' ? UT.ParticleFX : null; }

  function burstAt(x, y, o) {
    try {
      var E = engine(); if (!E) return 0;
      o = o || {};
      var n = Math.max(8, Math.min(16, Math.floor(+o.count) || 12));
      var colors = (o.colors && o.colors.length) ? o.colors : PALETTES[Math.floor(Math.random() * PALETTES.length)];
      var dist = Math.max(20, Math.min(140, +o.distance || 64));
      /* 1) CORE FLASH: satu blok krem-terang besar, sangat singkat, membesar sambil memudar */
      var made = E.burstAt(x, y, { count: 1, color: '#fff3a3', size: 18, sizeJitter: 0, distance: 0, duration: 180, durationJitter: 0, scale: 2, shape: 'square' });
      /* 2) MAIN RADIAL BURST: blok kecil menyebar radial; arah/jarak/ukuran/durasi bervariasi (jitter engine); jeda acak kecil agar mulai tepat setelah flash */
      made += E.burstAt(x, y, { count: n, colors: colors, size: 6, sizeJitter: 0.5, distance: dist, distanceJitter: 0.45, duration: 850, durationJitter: 0.3,
        spread: 360, gravity: 24, scale: 0.15, rotate: 90, shape: 'square', delay: 50 });
      return made; /* 3) FADE: opacity 1→0 di akhir keyframe engine; partikel dihapus engine saat animationend */
    } catch (e) { return 0; } /* FX tidak boleh menggagalkan gameplay */
  }

  function burstFromElement(el, o) {
    try {
      if (!el || !el.getBoundingClientRect) return 0;
      var r = el.getBoundingClientRect();
      if (!r.width && !r.height) return 0;
      return burstAt(r.left + r.width / 2, r.top + r.height / 2, o);
    } catch (e) { return 0; }
  }

  UT.FireworkFX = { burstAt: burstAt, burstFromElement: burstFromElement };
})(window);
