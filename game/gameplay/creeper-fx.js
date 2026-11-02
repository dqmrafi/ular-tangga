/* Creeper Explosion Visual Core (Stage 4.1.24.1) — ledakan voxel/Minecraft-style:
   FLASH → EXPLOSION CORE → CHUNKY PARTICLE BURST (+ debris) → SMOKE/DUST → FADE/CLEANUP.
   Hanya memakai UT.ParticleFX.burstAt (engine 4.1.22): layer #fx-layer, batas partikel (20/burst, 60 visible), cleanup animationend, guard reduced-motion milik engine.
   Urutan/stagger lewat animation-delay CSS (opsi delayMin/delay engine): TANPA timer, rAF, interval, listener, atau layer sendiri. Hanya transform+opacity.
   Acuan visual: kasus 'creeper' pada folder referensi visual (palet hijau, burst blok persegi, asap abu-hijau bulat); nilai disalin, TIDAK dibaca saat runtime.
   BELUM terhubung ke gameplay: tanpa SFX, tanpa trigger (explode()/creeper tetap memakai efek lama). Variasi Math.random hanya untuk tampilan.
   Classic script. Namespace: UT.CreeperExplosionFX. API: burstAt(x, y, opts) · burstFromElement(el, opts) — return jumlah partikel yang dibuat (0 bila tak ada engine/reduced-motion).
   (x, y) = pusat ledakan. opts: count (blok burst 6–9, default 8) · distance (default 70) */
(function (win) {
  'use strict';
  var UT = win.UT = win.UT || {};
  if (UT.CreeperExplosionFX) return;

  var GREEN = ['#a8ff78', '#4fdb65', '#d7ffc2', 'rgba(79,219,101,.8)'];   /* palet creeper (acuan) */
  var DEBRIS = ['#3b4a3a', '#52675a', '#2f3b2f'];                           /* serpihan gelap */
  var SMOKE = ['rgba(82,103,90,.6)', 'rgba(120,134,126,.45)'];             /* asap abu-hijau semi-transparan */

  function engine() { return UT.ParticleFX && typeof UT.ParticleFX.burstAt === 'function' ? UT.ParticleFX : null; }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  function burstAt(x, y, o) {
    try {
      var E = engine(); if (!E) return 0;
      o = o || {};
      var n = clamp(Math.floor(+o.count) || 8, 6, 9);
      var dist = clamp((+o.distance || 70) * (0.9 + Math.random() * 0.2), 24, 140);
      var made = 0;

      /* 1) FLASH: satu blok putih-kehijauan, sangat singkat, membesar cepat */
      made += E.burstAt(x, y, { count: 1, color: '#f3ffe0', size: 34, sizeJitter: 0, distance: 0, duration: 140, durationJitter: 0, scale: 2.4, shape: 'square' });
      /* 2) EXPLOSION CORE: inti terang + halo hijau lebih besar & pudar */
      made += E.burstAt(x, y, { count: 1, color: '#d7ffc2', size: 28, sizeJitter: 0, distance: 0, duration: 240, durationJitter: 0, scale: 2, shape: 'square', delayMin: 20 });
      made += E.burstAt(x, y, { count: 1, color: 'rgba(79,219,101,.5)', size: 46, sizeJitter: 0, distance: 0, duration: 320, durationJitter: 0, scale: 1.7, shape: 'square', delayMin: 40 });
      /* 3) CHUNKY BURST: blok hijau besar menyebar cepat (ease-out engine), sedikit jatuh, berputar */
      made += E.burstAt(x, y, { count: n, colors: GREEN, size: 9, sizeJitter: 0.6, distance: dist, distanceJitter: 0.5, duration: 620, durationJitter: 0.3,
        spread: 360, gravity: 22, scale: 0.2, rotate: 120, shape: 'square', delayMin: 20, delay: 40 });
      /* 3b) DEBRIS: serpihan gelap, lebih berat (jatuh lebih jauh), berputar lebih banyak */
      made += E.burstAt(x, y, { count: 4, colors: DEBRIS, size: 7, sizeJitter: 0.5, distance: dist * 0.8, distanceJitter: 0.6, duration: 760, durationJitter: 0.3,
        spread: 360, gravity: 55, scale: 0.5, rotate: 200, shape: 'square', delayMin: 30, delay: 60 });
      /* 4) SMOKE/DUST: 4 gumpalan bulat besar, naik pelan sambil membesar dan memudar; mulai setelah burst */
      made += E.burstAt(x, y, { count: 4, colors: SMOKE, size: 18, sizeJitter: 0.4, angle: -90, spread: 170, distance: 26, distanceJitter: 0.6, duration: 850, durationJitter: 0.25,
        gravity: -26, scale: 1.9, shape: 'round', delayMin: 100, delay: 90 });
      return made; /* 5) FADE/CLEANUP: opacity 1→0 di akhir keyframe engine; partikel dihapus engine saat animationend */
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

  UT.CreeperExplosionFX = { burstAt: burstAt, burstFromElement: burstFromElement };
})(window);
