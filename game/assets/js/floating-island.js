/* FloatingIsland — komponen pulau melayang voxel (Stage 4), terpisah dari latar & karakter.
   Mengikuti referensi referensi/floaating.webp: puncak rumput 2-warna (kotak-kotak), lapisan tanah coklat,
   dasar batu abu meruncing, jumbai rumput, batu kecil, bayangan di bawah.
   Pakai (butuh THREE global): const isl = UT.FloatingIsland.create(THREE,{seed:5});
     scene.add(isl);  per frame: isl.userData.update(t);   // melayang naik-turun halus
   Permukaan atas pulau ada di y=0 (karakter berdiri di y=0). AO voxel: warna per-instance digelapkan
   menurut tetangga di atas (pendekatan ambient occlusion). */
(function () {
  'use strict';
  var UT = window.UT = window.UT || {};

  function rng(seed) { var s = (seed || 1) * 2654435761 % 2147483647 || 1; return function () { s = s * 16807 % 2147483647; return s / 2147483647; }; }

  /* bayangan lembut (dipakai juga untuk "contact shadow" karakter) */
  function contactShadow(THREE, w, h, opacity) {
    var c = document.createElement('canvas'); c.width = c.height = 128;
    var g = c.getContext('2d'), gr = g.createRadialGradient(64, 64, 4, 64, 64, 62);
    gr.addColorStop(0, 'rgba(20,50,90,.9)'); gr.addColorStop(.55, 'rgba(20,50,90,.35)'); gr.addColorStop(1, 'rgba(20,50,90,0)');
    g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
    var m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true, opacity: opacity == null ? .5 : opacity, depthWrite: false, fog: false }));
    m.rotation.x = -Math.PI / 2; return m;
  }

  function create(THREE, opts) {
    opts = opts || {};
    var rnd = rng(opts.seed || 5), g = new THREE.Group();
    /* layer: [radius, tipe]; 0 = puncak rumput, 1 = tanah (sedikit menjorok keluar), lalu meruncing ke batu */
    var R = [3.6, 3.6, 2.9, 2.0, 1.1], N = R.length, cells = {}, list = [], x, z, y;
    for (y = 0; y < N; y++) {
      var r = R[y], lim = Math.ceil(r + 1);
      for (x = -lim; x <= lim; x++) for (z = -lim; z <= lim; z++) {
        var d = Math.hypot(x * 1.04, z) / (r + (rnd() - .5) * .95);
        if (d <= 1 || (y === 0 && x === 0 && z === 0)) { cells[x + ',' + y + ',' + z] = 1; list.push([x, y, z]); }
      }
    }
    var has = function (a, b, c) { return cells[a + ',' + b + ',' + c] === 1; };
    var geo = new THREE.BoxGeometry(1, 1, 1);
    var mat = new THREE.MeshStandardMaterial({ roughness: .9, metalness: 0 });
    var mesh = new THREE.InstancedMesh(geo, mat, list.length), m4 = new THREE.Matrix4(), col = new THREE.Color();
    var GRASS = [0x7ccd3a, 0x66b82f], DIRT = [0x8d5b33, 0x7e4f2b], STONE = [0x7d7d88, 0x6a6a76, 0x8a8a94];
    list.forEach(function (c, i) {
      x = c[0]; y = c[1]; z = c[2];
      var hex;
      if (y === 0) hex = GRASS[(x + z) & 1];
      else if (y <= 2) hex = DIRT[(x * 3 + z + y) & 1];
      else hex = (y === 3 && rnd() < .35) ? DIRT[(x + z) & 1] : STONE[Math.abs(x * 5 + z * 3 + y) % 3];
      /* AO voxel: hitung tetangga di lapisan atas (3x3) -> makin tertutup makin gelap; sedikit lebih gelap ke bawah */
      var above = 0, a, b;
      for (a = -1; a <= 1; a++) for (b = -1; b <= 1; b++) if (has(x + a, y - 1, z + b)) above++;
      var ao = 1 - .055 * above, depthDark = 1 - .035 * y, jit = .96 + rnd() * .08;
      col.setHex(hex).multiplyScalar(Math.max(.5, ao) * depthDark * jit);
      m4.makeTranslation(x, -y - .5, z); mesh.setMatrixAt(i, m4); mesh.setColorAt(i, col);
    });
    mesh.castShadow = mesh.receiveShadow = true; mesh.instanceMatrix.needsUpdate = true; if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    g.add(mesh);

    /* dekor puncak: jumbai rumput + batu kecil (seperti referensi) */
    var top = list.filter(function (c) { return c[1] === 0 && Math.hypot(c[0], c[2]) < 3 && !(Math.abs(c[0]) < 2 && Math.abs(c[2]) < 2); });
    var tuft = new THREE.MeshStandardMaterial({ color: 0x4a9a26, roughness: 1 }), tuft2 = new THREE.MeshStandardMaterial({ color: 0x8fd84a, roughness: 1 });
    for (var i = 0; i < 16 && top.length; i++) {
      var c = top[(rnd() * top.length) | 0], h = .3 + rnd() * .4;
      for (var k = 0; k < 2; k++) {
        var t = new THREE.Mesh(new THREE.BoxGeometry(.13, h * (k ? .7 : 1), .13), k ? tuft2 : tuft);
        t.position.set(c[0] + (rnd() - .5) * .6, h * (k ? .35 : .5), c[2] + (rnd() - .5) * .6); t.castShadow = true; g.add(t);
      }
    }
    var stones = [[2.0, 1.3, .8, .32, .7, 0xb9a98c], [-1.7, -2.2, .5, .26, .5, 0x9c9ca2], [1.0, -2.6, .38, .2, .38, 0xb4a48a]];
    stones.forEach(function (s) {
      var sm = new THREE.Mesh(new THREE.BoxGeometry(s[2], s[3], s[4]), new THREE.MeshStandardMaterial({ color: s[5], roughness: 1 }));
      sm.position.set(s[0], s[3] / 2, s[1]); sm.rotation.y = s[0]; sm.castShadow = true; g.add(sm);
    });
    /* beberapa voxel menggantung di bawah (potongan batu terlepas) */
    [[.2, -5.9, 0, .5], [1.0, -5.5, -.6, .32]].forEach(function (p) {
      var rock = new THREE.Mesh(new THREE.BoxGeometry(p[3], p[3], p[3]), new THREE.MeshStandardMaterial({ color: 0x70707c, roughness: 1 })); rock.position.set(p[0], p[1], p[2]); g.add(rock);
    });

    var shadow = contactShadow(THREE, 9, 9, opts.shadow == null ? .38 : opts.shadow); shadow.position.y = -7.4; g.add(shadow);
    var amp = opts.bob == null ? .16 : opts.bob;
    g.userData.update = function (t) {
      var b = Math.sin(t * 1.1) * amp;
      g.position.y = b; g.rotation.z = Math.sin(t * .6) * .012;
      shadow.position.y = -7.4 - b; shadow.scale.setScalar(1 - b * .35); shadow.material.opacity = (opts.shadow == null ? .38 : opts.shadow) * (1 - b * .8);
    };
    return g;
  }

  UT.FloatingIsland = { create: create, contactShadow: contactShadow };
})();
